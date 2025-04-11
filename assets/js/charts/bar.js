function createBarChart(canvasId, labels, datasets, backgroundColor, borderColor) {
    var barChart = document.getElementById(canvasId).getContext("2d");
  
    var myBarChart = new Chart(barChart, {
      type: "bar",
      data: {
        labels: labels, // Dynamic labels
        datasets: datasets.map(function(dataset) {
          return {
            label: dataset.label,
            backgroundColor: backgroundColor || dataset.backgroundColor, // Dynamic background color
            borderColor: borderColor || dataset.borderColor, // Dynamic border color
            data: dataset.data, // Dynamic data
          };
        }),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  }

//   createBarChart(
//     "barChart2", // ID of the canvas
//     ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], // Labels (months)
//     [
//       {
//         label: "Revenue", // Dataset label
//         data: [4, 5, 6, 7, 6, 5, 8, 9, 10, 11, 8, 7], // Data points
//       },
//       {
//         label: "Expenses", // Another dataset label
//         data: [2, 3, 4, 3, 5, 2, 4, 3, 6, 5, 4, 3], // Data points for expenses
//       }
//     ],
//     "rgb(23, 125, 255)", // Background color for bars
//     "rgb(255, 99, 132)"  // Border color for bars
//   );
  