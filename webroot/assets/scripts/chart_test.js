/**
 * Created by dhara on 01-09-2015.
 */

var chartApp = angular.module('ChartTestApp', ['highcharts-ng']);

chartApp.controller('HighChartController', ['$scope', function ($scope) {

    $scope.chartConfig = {
        options: {
            chart: {
                zoomType: 'x'
            },
            rangeSelector: {
                enabled: true
            },
            navigator: {
                enabled: true
            }
        },
        series: [],
        title: {
            text: 'A Sample Stock chart'
        },
        useHighStocks: true
    }

    $scope.chartConfig.series.push({
            id: 1,
            data: [
                [1147651200000, 23.15],
                [1147737600000, 23.01],
                [1147824000000, 22.73],
                [1147910400000, 22.83],
                [1147996800000, 22.56],
                [1148256000000, 22.88],
                [1148342400000, 22.79],
                [1148428800000, 23.50],
                [1148515200000, 23.74],
                [1148601600000, 23.72],
                [1148947200000, 23.15],
                [1149033600000, 22.65]
            ]
        }
    );
}]);
