function createDoughnutChart(chartId, data, labels, colors, options = {}) {
  var doughnutChart = document.getElementById(chartId).getContext("2d");

  var myDoughnutChart = new Chart(doughnutChart, {
    type: "doughnut",
    data: {
      datasets: [
        {
          data: data, // Dynamic data
          backgroundColor: colors, // Dynamic colors
        },
      ],
      labels: labels, // Dynamic labels
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false, // Show Label
        position: "bottom",
      },
      pieceLabel: {
        render: "percentage",
        fontColor: "white",
        fontSize: 14,
      },
      // layout: {
      //   padding: {
      //     left: 20,
      //     right: 20,
      //     top: 20,
      //     bottom: 20,
      //   },
      // },
      // ...options, // Merge any custom options passed in
    },
  });
}

// createDoughnutChart(
//   "doughnutChart", // ID of the canvas
//   [10, 20, 30], // Data points
//   ["Red", "Yellow", "Blue"], // Labels
//   ["#f3545d", "#fdaf4b", "#1d7af3"], // Colors for slices
//   {
//     legend: {
//       position: "bottom",
//     },
//     layout: {
//       padding: {
//         left: 20,
//         right: 20,
//         top: 20,
//         bottom: 20,
//       },
//     },
//   }
// );