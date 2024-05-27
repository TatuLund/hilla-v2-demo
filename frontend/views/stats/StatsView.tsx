import { Chart } from "@vaadin/react-components-pro/Chart.js";
import { ChartSeries } from "@vaadin/react-components-pro/ChartSeries.js";
import type { Options } from "highcharts";
import MessageType from "Frontend/generated/com/example/application/services/EventService/MessageType";
import Stats from "Frontend/generated/com/example/application/services/StatsEndpoint/Stats";
import { EventEndpoint, StatsEndpoint } from "Frontend/generated/endpoints";
import { useEffect, useState } from "react";
import { Notification } from "@vaadin/react-components/Notification.js";
import { Subscription } from "@vaadin/hilla-frontend";
import Message from "Frontend/generated/com/example/application/services/EventService/Message";
import { useOffline } from "Frontend/util/useOffline";

function useStats() {
  const [stats, setStats] = useState<Stats>({
    priorityCounts: [0, 0, 0, 0, 0],
    deadlines: {},
    assigned: 0,
    done: 0,
  });
  const [subscription, setSubscription] = useState<Subscription<Message>>();
  const { isOffline, get, store } = useOffline();

  useEffect(() => {
    (async () => {
      if (isOffline()) {
        setStats(get("stats"));
      } else {
        const fetched = await StatsEndpoint.getStats();
        setStats(fetched);
        store("stats", fetched);
      }
    })();
  }, []);

  useEffect(() => {
    subscribeEventEndpoint();
    return () => {
      subscription?.cancel();
    };
  }, [subscription]);

  /**
   * Subscribes to the event endpoint.
   * If there is no active subscription, it sets a new subscription using the `getEventsCancellable` method from the `EventEndpoint` class.
   */
  function subscribeEventEndpoint() {
    if (!subscription) {
      setSubscription(EventEndpoint.getEventsCancellable().onNext(onMessage));
    }
  }

  /**
   * Handles the incoming message event.
   * If the message type is INFO, it shows a success notification and updates the stats after a delay.
   * @param event - The message event.
   */
  function onMessage(event: Message) {
    if (event.messageType == MessageType.INFO) {
      Notification.show(event.data, { theme: "success" });
      setTimeout(async () => {
        // Wait 3 seconds before updating the stats
        setStats(await StatsEndpoint.getStats());
      }, 3000);
    }
  }

  function deadlineDates(): string[] {
    return Object.keys(stats.deadlines).map((key) => {
      const date = new Date(key);
      return date.toDateString();
    });
  }

  function deadlineCounts(): number[] {
    return Object.values(stats.deadlines).map((count) => (count ? count : 0));
  }

  return [stats, deadlineDates, deadlineCounts] as const;
}

// Options can be used for many kinds of advanced configuration settings
// for VaadinChart. The VaadinChart has some attributes and
// properties for quick configuration.
function getChartOptions(): Options {
  const options: Options = {
    tooltip: {
      formatter: function () {
        return (
          (this.point.name ? this.point.name : this.point.category) +
          ": <b style='color: var(--lumo-primary-text-color)'>" +
          this.point.y +
          "</b>"
        );
      },
    },
    yAxis: {
      title: {
        text: "Count",
      },
    },
    plotOptions: {
      series: {
        animation: {
          duration: 100,
        },
      },
    },
  };
  return options;
}

export default function StatsView() {
  const [stats, deadlineDates, deadlineCounts] = useStats();

  return (
    <>
      <div className="flex flex-row">
        <Chart
          additionalOptions={getChartOptions()}
          key="priorities"
          title="Priorities"
        >
          <ChartSeries
            type="pie"
            values={[
              { name: "1", y: stats?.priorityCounts[0] },
              { name: "2", y: stats?.priorityCounts[1] },
              { name: "3", y: stats?.priorityCounts[2] },
              { name: "4", y: stats?.priorityCounts[3] },
              { name: "5", y: stats?.priorityCounts[4] },
            ]}
          ></ChartSeries>
        </Chart>
        <Chart
          additionalOptions={getChartOptions()}
          key="status"
          title="Status"
        >
          <ChartSeries
            title="Assigned"
            type="column"
            values={[{ name: "Assigned", y: stats?.assigned }]}
          ></ChartSeries>{" "}
          <ChartSeries
            title="Done"
            type="column"
            values={[{ name: "Done", y: stats?.done }]}
          ></ChartSeries>
        </Chart>
      </div>
      <Chart
        additionalOptions={getChartOptions()}
        type="line"
        key="deadlines"
        title="Deadlines"
        categories={deadlineDates()}
      >
        <ChartSeries title="Deadlines" values={deadlineCounts()}></ChartSeries>
      </Chart>
    </>
  );
}
