function createLineChartWithHtmlLegend(chartId, legendContainerId, chartData, chartLabels, gradientColors) {
  var ctx = document.getElementById(chartId).getContext("2d");

  // Create gradients dynamically based on the passed colors
  var gradients = gradientColors.map(function (colors) {
    var gradient = ctx.createLinearGradient(500, 0, 100, 0);
    colors.forEach(function (colorStop, index) {
      gradient.addColorStop(index, colorStop);
    });
    return gradient;
  });

  var datasets = chartData.map(function (data, index) {
    return {
      label: data.label,
      borderColor: gradients[index],
      pointBackgroundColor: gradients[index],
      pointRadius: 0,
      backgroundColor: gradients[index],
      legendColor: data.legendColor,
      fill: true,
      borderWidth: 1,
      data: data.values
    };
  });

  var myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: chartLabels,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false,
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
      scales: {
        yAxes: [{
          ticks: {
            fontColor: "rgba(0,0,0,0.5)",
            fontStyle: "500",
            beginAtZero: false,
            maxTicksLimit: 5,
            padding: 20,
          },
          gridLines: {
            drawTicks: false,
            display: false,
          },
        }],
        xAxes: [{
          gridLines: {
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "rgba(0,0,0,0.5)",
            fontStyle: "500",
          },
        }],
      },
      legendCallback: function (chart) {
        var text = [];
        text.push('<ul class="' + chart.id + '-legend html-legend">');
        for (var i = 0; i < chart.data.datasets.length; i++) {
          text.push('<li><span style="background-color:' + chart.data.datasets[i].legendColor + '"></span>');
          if (chart.data.datasets[i].label) {
            text.push(chart.data.datasets[i].label);
          }
          text.push('</li>');
        }
        text.push('</ul>');
        return text.join('');
      },
    },
  });

  // Generate and insert the HTML legend
  var myLegendContainer = document.getElementById(legendContainerId);
  myLegendContainer.innerHTML = myChart.generateLegend();

  // Bind onClick event to all LI-tags of the legend
  var legendItems = myLegendContainer.getElementsByTagName('li');
  for (var i = 0; i < legendItems.length; i++) {
    legendItems[i].addEventListener("click", function (event) {
      var target = event.target || event.srcElement;
      while (target.nodeName !== 'LI') {
        target = target.parentElement;
      }
      var parent = target.parentElement;
      var chartId = parseInt(parent.classList[0].split("-")[0], 10);
      var chart = Chart.instances[chartId];
      var index = Array.prototype.slice.call(parent.children).indexOf(target);

      chart.legend.options.onClick.call(chart, event, chart.legend.legendItems[index]);
      if (chart.isDatasetVisible(index)) {
        target.classList.remove('strikethrough');
      } else {
        target.classList.add('strikethrough');
      }
    }, false);
  }
}

// createLineChartWithHtmlLegend(
//   "htmlLegendsChart",   // chartId
//   "myChartLegend",      // legend container ID
//   [                     // chartData (arrays for each dataset)
//     {
//       label: "Subscribers",
//       legendColor: "#f3545d",
//       values: [154, 184, 175, 203, 210, 231, 240, 278, 252, 312, 320, 374]
//     },
//     {
//       label: "New Visitors",
//       legendColor: "#fdaf4b",
//       values: [256, 230, 245, 287, 240, 250, 230, 295, 331, 431, 456, 521]
//     },
//     {
//       label: "Active Users",
//       legendColor: "#177dff",
//       values: [542, 480, 430, 550, 530, 453, 380, 434, 568, 610, 700, 900]
//     }
//   ],
//   ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],  // chartLabels
//   [                                                            // gradientColors
//     ["#177dff", "#80b6f4"],
//     ["#f3545d", "#ff8990"],
//     ["#fdaf4b", "#ffc478"]
//   ]
// );
