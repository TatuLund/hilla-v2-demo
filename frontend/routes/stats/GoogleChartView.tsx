import './google-chart.js';
import { TabSheet, TabSheetTab } from '@vaadin/react-components/TabSheet.js';
import { Tabs } from '@vaadin/react-components/Tabs.js';
import { Tab } from '@vaadin/react-components/Tab.js';
import { Tooltip } from '@vaadin/react-components/Tooltip.js';
import { Icon } from '@vaadin/react-components/Icon.js';

export default function GoogleChartView() {
  setTimeout(() => {
    (window as any).googleChart();
  }, 100);

  return (
    <TabSheet
      style={{ height: '500px', width: '600px' }}
      ref={(element) => {
        element?.style.setProperty('--lumo-space-m', '0px');
        element?.style.setProperty('--lumo-space-s', '0px');
        const height = element?.offsetHeight;
      }}
      // className="flex-row"
      // ref={(element) => {
      //   setTimeout(() => {
      //     element?.querySelector('vaadin-tabs')?.setAttribute('orientation', 'vertical');
      //   }, 100);
      // }}
    >
      <TabSheetTab tooltip-text="Hello" label="Hello" id="hello-tab">
        <div>Hello</div>
      </TabSheetTab>
      <TabSheetTab
        style={{ height: '50px' }}
        label={
          <div className="flex items-baseline">
            World
            <span className="bg-success text-success-contrast rounded-full p-xs ml-xs text-xs" id="world-label-icon">
              W
            </span>
            <Tooltip for="world-label-icon">World</Tooltip>
          </div>
        }
        id="world-tab"
      >
        <div style={{ height: '100%', background: 'lightblue' }}>World</div>
      </TabSheetTab>
      <TabSheetTab
        label={
          <div className="flex items-baseline">
            Chart
            <span className="bg-success text-success-contrast rounded-full p-xs ml-xs text-xs" id="chart-label-icon">
              C
            </span>
            <Tooltip for="chart-label-icon">Chart</Tooltip>
          </div>
        }
        id="chart-tab"
      >
        <div style={{ height: '100%' }} id="chart-div"></div>
      </TabSheetTab>
    </TabSheet>
  );
}
