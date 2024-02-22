import './google-chart.js';

export default function GoogleChartView() {

  setTimeout(() => {
    (window as any).googleChart();
  }, 100);

  return (
    <>
      <div id="chart-div"></div>
    </>
  );
}
