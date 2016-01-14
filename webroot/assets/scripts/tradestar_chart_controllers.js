/**
 * Created by dharani kumar p(dharani.kumar@gmail.com) on 20-08-2015.
 */

angular.module('tradestar').controller('LineChartCtrl', function ($scope) {

    $scope.options = {
        chart: {
            type: 'lineWithFocusChart',
            height: 450,
            margin: {
                top: 20,
                right: 20,
                bottom: 60,
                left: 40
            },
            transitionDuration: 100,
            xAxis: {
                axisLabel: 'X Axis',
                tickFormat: function (d) {
                    return d3.format(',f')(d);
                }
            },
            x2Axis: {
                tickFormat: function (d) {
                    return d3.format(',f')(d);
                }
            },
            yAxis: {
                axisLabel: 'Y Axis',
                tickFormat: function (d) {
                    return d3.format(',.2f')(d);
                },
                rotateYLabel: false
            },
            y2Axis: {
                tickFormat: function (d) {
                    return d3.format(',.2f')(d);
                }
            }
        }
    };

    $scope.data = sinAndCos();

    /*Random Data Generator */
    function sinAndCos() {
        var sin = [], sin2 = [],
            cos = [];

        //Data is represented as an array of {x,y} pairs.
        for (var i = 0; i < 100; i++) {
            sin.push({x: i, y: Math.sin(i / 10)});
            sin2.push({x: i, y: i % 10 == 5 ? null : Math.sin(i / 10) * 0.25 + 0.5});
            cos.push({x: i, y: .5 * Math.cos(i / 10 + 2) + Math.random() / 10});
        }

        //Line chart data should be sent as an array of series objects.
        return [
            {
                values: sin,      //values - represents the array of {x,y} data points
                key: 'Sine Wave', //key  - the name of the series.
                color: '#ff7f0e'  //color - optional: choose your own line color.
            },
            {
                values: cos,
                key: 'Cosine Wave',
                color: '#2ca02c'
            },
            {
                values: sin2,
                key: 'Another sine wave',
                color: '#7777ff',
                area: true      //area - set to true if you want this line to turn into a filled area chart.
            }
        ];
    }

});

angular.module('tradestar').controller('multiBarHorizontalChartCtrl', function ($scope) {


    $scope.options = {
        chart: {
            type: 'multiBarHorizontalChart',
            height: 450,
            x: function (d) {
                return d.label;
            },
            y: function (d) {
                return d.value;
            },
            showControls: true,
            showValues: true,
            transitionDuration: 500,
            xAxis: {
                showMaxMin: false
            },
            yAxis: {
                axisLabel: 'Values',
                tickFormat: function (d) {
                    return d3.format(',.2f')(d);
                }
            }
        }
    };

    $scope.data = [
        {
            "key": "Defeats",
            "color": "#d62728",
            "values": [
                {
                    "label": "Joueur A",
                    "value": -2
                },
                {
                    "label": "Joueur B",
                    "value": -8
                },
                {
                    "label": "Joueur C",
                    "value": -0
                },
                {
                    "label": "Joueur D",
                    "value": -2
                },
                {
                    "label": "Joueur E",
                    "value": -10
                },
                {
                    "label": "Joueur F",
                    "value": -5
                },
                {
                    "label": "Joueur G",
                    "value": -40
                },
                {
                    "label": "Joueur H",
                    "value": -22
                },
                {
                    "label": "Joueur I",
                    "value": -0
                }
            ]
        },
        {
            "key": "Wins",
            "color": "#1f77b4",
            "values": [
                {
                    "label": "Joueur A",
                    "value": 25
                },
                {
                    "label": "Joueur B",
                    "value": 16
                },
                {
                    "label": "Joueur C",
                    "value": 18
                },
                {
                    "label": "Joueur D",
                    "value": 8
                },
                {
                    "label": "Joueur E",
                    "value": 7
                },
                {
                    "label": "Joueur F",
                    "value": 5
                },
                {
                    "label": "Joueur G",
                    "value": 65
                },
                {
                    "label": "Joueur H",
                    "value": 32
                },
                {
                    "label": "Joueur I",
                    "value": 3
                }
            ]
        }
    ]
});


angular.module('tradestar').controller('pieChartCtrl', function ($scope) {

    $scope.options = {
        chart: {
            type: 'pieChart',
            height: 500,
            x: function (d) {
                return d.key;
            },
            y: function (d) {
                return d.y;
            },
            showLabels: true,
            transitionDuration: 500,
            labelThreshold: 0.01,
            legend: {
                margin: {
                    top: 5,
                    right: 35,
                    bottom: 5,
                    left: 0
                }
            }
        }
    };

    $scope.data = [
        {
            key: "EUR/USD",
            y: 30
        },
        {
            key: "USD/CHF",
            y: 15
        },
        {
            key: "GBP/USD",
            y: 15
        },
        {
            key: "EUR/CAD",
            y: 10
        },
        {
            key: "GBP/JPY",
            y: 5
        },
        {
            key: "USD/JPY",
            y: 14
        },
        {
            key: "NZD/USD",
            y: 11
        }
    ];
});
