// ChartJS V2
const charts = {
    colors: function (index) {
        const colors = [
            "#386641", "#4A6A38", "#5C6E30",
            "#6E7228", "#807620", "#927A18",
            "#A47E10", "#B68208", "#C88600",
            "#D27A00", "#D87A00", "#DE7A00",
            "#E47A00", "#EA7A00", "#F07A00",
            "#F37A00", "#F57A00", "#F77A00",
            "#F87A00", "#F97A00", "#f98329"]

        return colors[index] || colors;
    },

    randomNumber(max, min = 1) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    generateSet(size, min = 1, max = 100) {
        const set = [];
        for (let i = 0; i < size; i++) {
            const num = Math.floor(Math.random() * (max - min + 1)) + min;
            set.push(num);
        }
        return set;
    },

    gradientColors: function (range) {
        const colors = charts.colors()
        return colors.slice(0, range || colors.length);
    },

    doughnut: function (target = "pieChart", labels = ["Red", "Blue", "Yellow"], data = [300, 50, 100]) {
        var canvas = document.getElementById(target);

        if (!canvas) return;

        var ctx = canvas.getContext("2d");

        const keysOnly = Object.keys(data);
        const keysAsArrays = keysOnly.map(k => JSON.parse(k));

        const classificationCounts = {};
        keysAsArrays.forEach(([category]) => {
            classificationCounts[category] = (classificationCounts[category] || 0) + 1;
        });

        labels = Object.keys(classificationCounts)
        data = Object.values(classificationCounts)

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

    pie: function (target = "pieChart", labels = ["New Visitors", "Subscribers", "Active Users"], data = [50, 35, 15]) {
        var canvas = document.getElementById(target);

        if (!canvas) return;

        var ctx = canvas.getContext("2d");

        return new Chart(ctx, {
            type: "pie",
            data: {
                labels: labels,
                datasets: [{
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

    line: function (target = "lineChart", labels = [], data = [], legendContainerId = "lineChartLegend") {
        var ctx = document.getElementById(target)

        if (!ctx) return;

        ctx = ctx.getContext("2d");

        var chartLabels = labels;

        var gradientColors = [charts.colors(0), charts.colors(1), charts.colors(2)];

        var { abcs, quotedAmount, disburseAmount } = data
        abcs = JSON.parse(abcs)
        quotedAmount = JSON.parse(quotedAmount)
        disburseAmount = JSON.parse(disburseAmount)
        console.log({ data })

        var chartData = [
            {
                label: "Amountss",
                legendColor: gradientColors[0] || 'blue',
                values: quotedAmount || [154, 184, 175, 203.12, 210, 231, 240, 278, 252, 312, 320, 374]
            },
            {
                label: "Disbursement",
                legendColor: gradientColors[1] || 'orange',
                values: disburseAmount || [256, 230, 245, 287, 240, 250, 230, 295, 331, 431, 456, 521]
            },
            {
                label: "ABC",
                legendColor: gradientColors[2] || 'lightGreen',
                values: abcs || [456, 456, 245, 287, 240, 250, 230, 295, 331, 431, 456, 521]
            }
        ]

        // console.log({ chart: 'Line', chartLabels, chartData, gradientColors });
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

        if (legendContainerId) {
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
    },

    polar: function (target = "polarChart", labels = [], data = []) {
        var canvas = document.getElementById(target);

        if (!canvas) return;

        var ctx = canvas.getContext("2d");

        if (labels.length === 0) {
            labels = ['Red', 'Orange', 'Yellow', 'Green', 'Blue'];
            data = {
                labels: labels,
                datasets: [
                    {
                        label: 'Type',
                        data: [154, 184, 175, 203, 210, 231, 240, 278, 252, 312, 320, 374],
                        backgroundColor: this.colors()
                    }
                ]
            };
            console.log('Chart Polar: No labels and Data')
        }

        return new Chart(ctx, {
            type: 'polarArea',
            data: data,
            options: {
                responsive: true,
                plugins: {

                    title: {
                        display: false,
                        text: 'Chart.js Polar Area Chart'
                    }
                },
                legend: {
                    display: false, // Show Label
                    position: "bottom",
                },
            },
        })
    },

    bar: function (target = "barChart", labels = [], data = []) {
        var canvas = document.getElementById(target);

        if (!canvas) return;

        var ctx = canvas.getContext("2d");

        const keysOnly = Object.keys(data);
        const keysAsArrays = keysOnly.map(k => JSON.parse(k));

        const procurementTypeCounts = {};
        keysAsArrays.forEach(([, method]) => {
            procurementTypeCounts[String(method)] = (procurementTypeCounts[method] || 0) + 1;
        });
        // console.log("Counts per Procurement Type:", procurementTypeCounts);

        labels = Object.keys(procurementTypeCounts)
        data = Object.values(procurementTypeCounts)

        data = {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: charts.gradientColors(data.length),
                hoverBackgroundColor: charts.gradientColors(data.length),
                borderWidth: 0,
            }]
        };

        return new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                elements: {
                    bar: {
                        borderWidth: 2,
                    }
                },
                responsive: true,
                legend: {
                    display: false,
                    position: 'right',
                },
                title: {
                    display: false,
                    text: 'Chart.js Horizontal Bar Chart'
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            display: false,
                            autoSkip: false,
                            maxRotation: 90,
                            minRotation: 45,
                            callback: function (value) {
                                return value.length > 10 ? value.substr(0, 10) + '…' : value;
                            }

                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            },
        })
    }
};

document.addEventListener("DOMContentLoaded", function () {
    const doughnut = document.getElementById('chartClassification');
    const bar = document.getElementById('chartProcurementType');
    const pie = document.getElementById('chartDistribution');
    const line = document.getElementById('lineChart')

    if (!doughnut && !pie) return;

    const doughnutDatasets = doughnut.dataset.values ? JSON.parse(doughnut.dataset.values) : {};
    const doughnutLabels = Object.keys(doughnutDatasets);
    const doughnutData = Object.values(doughnutDatasets);

    const barDatasets = bar.dataset.values ? JSON.parse(bar.dataset.values) : {};
    // const barDatasets = bar.dataset.values ? bar.dataset.values : {};
    // const barLabels = Object.keys(barDatasets);
    // const barData = Object.values(barDatasets);

    const pieLabels = pie.dataset.labels ? JSON.parse(pie.dataset.labels) : {};
    const piePoints = pie.dataset.points ? JSON.parse(pie.dataset.points) : {};

    // charts.doughnut('chartClassification', doughnutLabels, doughnutData);
    charts.doughnut('chartClassification', '', doughnutDatasets);

    charts.bar('chartProcurementType', '', barDatasets)

    charts.pie('chartDistribution', pieLabels, piePoints);

    const lineLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // const lineLabels = ['Jan', 'Mar', 'May'];

    const abcs = line.dataset.abcs
    const quotedAmount = line.dataset.amounts
    const disburseAmount = line.dataset.disbursements
    const months = JSON.parse(line.dataset.months)

    const sortedMonths = months.sort((a, b) =>
        new Date(`${a} 1, 2000`).getMonth() - new Date(`${b} 1, 2000`).getMonth()
    );

    const shortMonths = sortedMonths.map(m =>
        new Date(`${m} 1, 2000`).toLocaleString('default', { month: 'short' })
    );


    charts.line('lineChart', shortMonths, { abcs, quotedAmount, disburseAmount }, 'myChartLegend');
});