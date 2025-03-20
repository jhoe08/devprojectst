function createPieChart(canvasId, chartData, chartLabels, chartColors, chartOptions = {}) {
  var pieChart = document.getElementById(canvasId).getContext("2d");

  var myPieChart = new Chart(pieChart, {
    type: "pie",
    data: {
      datasets: [
        {
          data: chartData,
          backgroundColor: chartColors,
          borderWidth: 0,
        },
      ],
      labels: chartLabels,
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      
      legend: {
        display: false,
        position: "bottom",
        labels: {
          fontColor: "rgb(154, 154, 154)",
          fontSize: 11,
          usePointStyle: true,
          padding: 20,
        },
      },
      pieceLabel: {
        render: "percentage",
        fontColor: "white",
        fontSize: 14,
      },
      // tooltips: true,
      // layout: {
      //   // padding: {
      //   //   left: 20,
      //   //   right: 20,
      //   //   top: 20,
      //   //   bottom: 20,
      //   // },
      // },
    },
    ...chartOptions, // Merge any custom options passed in
  });
}
  
  
  // // Example 1
  // createPieChart("pieChart1", [50, 35, 15], ["New Visitors", "Subscribers", "Active Users"], ["#1d7af3", "#f3545d", "#fdaf4b"]);
  
  // // Example 2
  // createPieChart("pieChart2", [60, 25, 15], ["Visitors", "Subscribers", "Active Users"], ["#6a5acd", "#ff6347", "#90ee90"], {
  //   legend: {
  //     position: "top",
  //   },
  // });
  