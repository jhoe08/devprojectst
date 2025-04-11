function createLineChart(chartId, labels, datasets, options = {}) {
  var lineChart = document.getElementById(chartId).getContext("2d");

  var myLineChart = new Chart(lineChart, {
    type: "line",
    data: {
      labels: labels, // Dynamic labels
      datasets: datasets.map(function (dataset) {
        return {
          label: dataset.label,
          borderColor: dataset.borderColor || "#1d7af3",
          pointBorderColor: dataset.pointBorderColor || "#FFF",
          pointBackgroundColor: dataset.pointBackgroundColor || "#1d7af3",
          pointBorderWidth: dataset.pointBorderWidth || 2,
          pointHoverRadius: dataset.pointHoverRadius || 4,
          pointHoverBorderWidth: dataset.pointHoverBorderWidth || 1,
          pointRadius: dataset.pointRadius || 4,
          backgroundColor: dataset.backgroundColor || "transparent",
          fill: dataset.fill !== undefined ? dataset.fill : true,
          borderWidth: dataset.borderWidth || 2,
          data: dataset.data, // Dynamic data
        };
      }),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        position: "bottom",
        labels: {
          padding: 10,
          fontColor: "#1d7af3",
        },
      },
      tooltips: {
        bodySpacing: 4,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
        xPadding: 10,
        yPadding: 10,
        caretPadding: 10,
      },
      layout: {
        padding: { left: 15, right: 15, top: 15, bottom: 15 },
      },
      ...options, // Merge any custom options passed in
    },
  });
}

// createLineChart(
//   "lineChart", // ID of the canvas
//   ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], // Labels (months)
//   [
//     {
//       label: "Active Users", // Dataset label
//       data: [542, 480, 430, 550, 530, 453, 380, 434, 568, 610, 700, 900], // Data points
//       borderColor: "#1d7af3", // Line color
//       backgroundColor: "transparent", // Transparent background
//       fill: true, // Fill area under the line
//     },
//   ],
//   {
//     legend: {
//       position: "bottom",
//       labels: {
//         padding: 10,
//         fontColor: "#1d7af3",
//       },
//     },
//     tooltips: {
//       bodySpacing: 4,
//       mode: "nearest",
//       intersect: 0,
//       position: "nearest",
//       xPadding: 10,
//       yPadding: 10,
//       caretPadding: 10,
//     },
//   }
// );
