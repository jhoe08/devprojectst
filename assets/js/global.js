const charts = {
  colors: function(index) {
        const colors = ["#386641", "#4A6A38", "#5C6E30",
                        "#6E7228", "#807620", "#927A18",
                        "#A47E10", "#B68208", "#C88600",
                        "#D27A00", "#D87A00", "#DE7A00",
                        "#E47A00", "#EA7A00", "#F07A00",
                        "#F37A00", "#F57A00", "#F77A00",
                        "#F87A00", "#F97A00"]

        return colors[index] || colors;
    },
    gradientColors: function(range) {
        const colors = charts.colors()
        return colors.slice(0, range || colors.length);
    },
    doughnut: function(target="pieChart", labels=["Red", "Blue", "Yellow"], data=[300, 50, 100]) {
        var canvas = document.getElementById(target);

        if (!canvas) return;

        var ctx = canvas.getContext("2d");

        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: charts.gradientColors(data.length),
                    hoverBackgroundColor: charts.gradientColors(data.length),
                    borderWidth: 0,
                }]
            }, 
            options: {
                pieceLabel: {
                    render: "percentage",
                    fontColor: "white",
                    fontSize: 14,
                },
                legend: {
                    display: false,
                    position: "bottom",
                },
            }
        });
    },
    pie: function(target="pieChart", labels=["New Visitors", "Subscribers", "Active Users"], data=[50, 35, 15]) {
        var canvas = document.getElementById(target);

        if (!canvas) return;

        var ctx = canvas.getContext("2d");
        console.log({ chart: 'Pie', labels, data })
        return new Chart(ctx, {
            type: "pie",
            data: {
                labels: labels,
                datasets: [ {
                    data: data,
                    backgroundColor: charts.gradientColors(data.length),
                    borderWidth: 0,
                    },
                ],
                
            },

            options: {
                pieceLabel: {
                    render: "percentage",
                    fontColor: "white",
                    fontSize: 14,
                },
                legend: {
                    display: false,
                    position: "bottom",
                },
            },
        });
    },
    line: function(target="lineChart", labels=[], legendContainerId="lineChartLegend") {  
        var ctx = elem = document.getElementById(target)

        if (!ctx) return;

        ctx = ctx.getContext("2d");

        var chartLabels = labels;

        var gradientColors = [charts.colors(0), charts.colors(1), charts.colors(2)];

        var valuesABC = elem.dataset.abcs ? JSON.parse(elem.dataset.abcs) : 0
        var valuesAmount = elem.dataset.amounts ? JSON.parse(elem.dataset.amounts) : 0;
        var valuesDisbursement = elem.dataset.disbursements ? JSON.parse(elem.dataset.disbursements) : 0;

        var chartData = [
          {
            label: "Amount",
            legendColor: gradientColors[0] || 'blue',
            values: valuesABC || [430, 380, 400, 450, 480, 500, 520, 550, 600, 650, 700, 800]
          },
          {
            label: "Disbursement",
            legendColor: gradientColors[1] || 'orange',
            values: valuesDisbursement || [256, 230, 245, 287, 240, 250, 230, 295, 331, 431, 456, 521]
          },
          {
            label: "ABC",
            legendColor: gradientColors[2] || 'lightGreen',
            values: valuesAmount || [542, 480, 430, 550, 530, 453, 380, 434, 568, 610, 700, 900]
          }
        ]

        console.log({ chart: 'Line', chartLabels, chartData, gradientColors });
        var datasets = chartData.map(function (data, index) {
            return {
                label: data.label,
                borderColor: gradientColors[index],
                pointBackgroundColor: gradientColors[index],
                pointRadius: 0,
                backgroundColor: gradientColors[index],
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
                    display: false, // Show Label
                    position: "bottom",
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
                datalabels: {
                    datalabels: {
                        display: function(context) {
                            const value = context.dataset.data[context.dataIndex];
                            console.log({ value });
                            return value !== 0 && value !== '';
                        },
                        formatter: function(value) {
                            return value;
                        }
                    }

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

        if(legendContainerId) {
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
    }
};

document.addEventListener("DOMContentLoaded", function() {
    const doughnut = document.getElementById('chartClassification');
    const pie = document.getElementById('chartDistribution');

    if(!doughnut && !pie) return;

    // Step 1: Invert the dataset (value → key(s))
    const doughnutDatasets = doughnut.dataset.values ? JSON.parse(doughnut.dataset.values) : {};
    // Step 2: Map into [labels, data]
    const doughnutLabels = Object.keys(doughnutDatasets);
    const doughnutData = Object.values(doughnutDatasets);

    const pieLabels = pie.dataset.labels ? JSON.parse(pie.dataset.labels) : {};
    const piePoints = pie.dataset.points ? JSON.parse(pie.dataset.points) : {};
 
    charts.doughnut('chartClassification', doughnutLabels, doughnutData);

    charts.pie('chartDistribution', pieLabels, piePoints);
    
    const lineLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    charts.line('lineChart', lineLabels, [], 'myChartLegend');
});