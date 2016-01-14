'use strict';

var myapp = angular.module('tradestar', ['knalli.angular-vertxbus', 'highcharts-ng']);

myapp.controller('myctrl', function ($scope, vertxEventBus, vertxEventBusService, $window, $interval, $timeout) {

    console.info("Inside the myctrl initialization");
    var CURRENT_PRICE_TIMER = 1000;
	
	$scope.lastClose = 0;
    
    $scope.intervals = {
        availableOptions: [
            {val: 1000, name: "1 second"},
            {val: 5000, name: "5 seconds"},
            {val: 10000, name: "10 seconds"},
            {val: 30000, name: "30 seconds"},
            {val: 60000, name: "1 minute"},
            {val: 120000, name: "2 minutes"},
            {val: 300000, name: "5 minutes"},
            {val: 600000, name: "10 minutes"}
        ],
        selectedInterval: {val: 5000, name: "5 seconds"}
    }

    var t1 = $scope.intervals.selectedInterval.val;
    var t2 = t1 * 2, t3 = t1 * 3, t4 = t1 * 4, t5 = t1 * 5, t6 = t1 * 6, t7 = t1 * 7, t8 = t1 * 8, t9 = t1 * 9,
        t10 = t1 * 10, t11 = t1 * 11, t12 = t1 * 12, t13 = t1 * 13, t14 = t1 * 14, t15 = t1 * 15, t16 = t1 * 16,
        t17 = t1 * 17, t18 = t1 * 18, t19 = t1 * 19, t20 = t1 * 20, t21 = t1 * 21, t22 = t1 * 22, t23 = t1 * 23, t24 = t1 * 24, t25 = t1 * 25;


    console.info("t1 " + t1);

    $scope.currencies = {
        availableCurrencies: ["EUR/USD", "USD/JPY", "GBP/USD", "EUR/GBP", "USD/CHF", "AUD/NZD",
            "CAD/CHF", "CHF/JPY", "EUR/AUD", "EUR/CAD", "EUR/JPY", "EUR/CHF", "USD/CAD", "AUD/USD", "GBP/JPY",
            "AUD/CAD", "AUD/CHF", "AUD/JPY", "EUR/NOK", "EUR/NZD", "GBP/CAD", "GBP/CHF", "NZD/JPY", "NZD/USD",
            "USD/NOK", "USD/SEK"],
        selectedCurrency: "EUR/USD"
    }

    $scope.allCurrencies = ["EUR/USD", "USD/JPY", "GBP/USD", "EUR/GBP", "USD/CHF", "AUD/NZD",
        "CAD/CHF", "CHF/JPY", "EUR/AUD", "EUR/CAD", "EUR/JPY", "EUR/CHF", "USD/CAD", "AUD/USD", "GBP/JPY",
        "AUD/CAD", "AUD/CHF", "AUD/JPY", "EUR/NOK", "EUR/NZD", "GBP/CAD", "GBP/CHF", "NZD/JPY", "NZD/USD",
        "USD/NOK", "USD/SEK"];

    vertxEventBusService.on('ArrayForBar', function (reply) {

        $scope.i++;
        var newEURUSDValue;
        for (var i = 0; i < reply.length; i++) {
            if (reply[i].currency === $scope.currencies.selectedCurrency) {
                newEURUSDValue = reply[i];
                break;
            }
        }

        //console.info("newEURUSDValue " + JSON.stringify(newEURUSDValue));
    });

    $scope.loadAllCurrencies = function() {
        console.info("Inside loadAllCurrencies");
        var address = 'GetAllCurrencyPairs';
        vertxEventBusService.send(address, {}).then(function(reply){
            if(reply.status == "ok") {
                //$scope.availableCurrencies = reply.allCurrencies;
            }

        }).catch(function(){
            console.error("Error while retrieving all currencies.");
        });
    }

    $scope.chartConfig = {
        options: {

            rangeSelector: {
                allButtonsEnabled: true
            },
            navigator: {
                enabled: true
            },
            yAxis: {
                offset: 10,
                format: '{value:.5f}'
            },
            xAxis: {
                type: 'datetime'
            }
        },
        series: [
            /*{
             data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
             },*/
            {
                type: 'candlestick',
                data: []
            }
        ],
        title: {
            text: 'EUR/USD'
        },
        useHighStocks: true,

        func: function (chart) {
            console.info("After chart got initialized " + chart);
            $scope.chart = chart;
        }
    }

    $scope.removePoint = function () {
        var series = $scope.chart.series[0];
        if (series.data.length) {
            series.data[0].remove();
        }
    }

    $scope.loadData = function () {
        console.info("Inside loadData.");
        var address = 'GetPastCurrencyQuotes';
        var params = {currencyPair: $scope.currencies.selectedCurrency};

        vertxEventBusService.send(address, params, {timeout: 5000}).then(function (reply) {
            console.info("Reply for " + address + " handler " + JSON.stringify(reply));

            if($scope.chart) {

                if (reply.status == "ok") {
                    var ohlcData = reply[$scope.currencies.selectedCurrency];
                    //console.log("ohlcData " + JSON.stringify(ohlcData));
                    var time = ohlcData.timeStamp;
                    var series = $scope.chart.series[0];

                    var pointCurr = ohlcData.open;

					//close for moving purposes
                    for (var i = 0; i < 2; i++) {
                        $scope.chartConfig.series[0].data.push([ohlcData[i].timeStamp, ohlcData[i].close, ohlcData[i].close, ohlcData[i].close, ohlcData[i].close]);
						$scope.lastClose = ohlcData[i].close;
                    }

                    console.info("$scope.chartConfig.series[0].data " + JSON.stringify($scope.chartConfig.series[0].data));

                    //$scope.chartConfig.series[0].data = ohlcData;

                    //$scope.chartConfig.series[0].data.push([ohlcData.timeStamp, ohlcData.open, ohlcData.high, ohlcData.low, ohlcData.close]);

                    /*
                     $scope.chartConfig.series[0].data = $scope.chartConfig.series[0].data.concat(
                     [
                     [time - t25, pointCurr, pointCurr + 0.00005, pointCurr - 0.0002, pointCurr = pointCurr - 0.0001],
                     [time - t24, pointCurr, pointCurr + 0.0003, pointCurr - 0.0001, pointCurr = pointCurr + 0.0002],
                     [time - t23, pointCurr, pointCurr + 0.0001, pointCurr - 0.0002, pointCurr = pointCurr - 0.0001],
                     [time - t22, pointCurr, pointCurr + 0.0005, pointCurr - 0.0001, pointCurr = pointCurr + 0.00045],
                     [time - t21, pointCurr, pointCurr + 0.0001, pointCurr - 0.0003, pointCurr = pointCurr - 0.0002],
                     [time - t20, pointCurr, pointCurr + 0.0003, pointCurr - 0.00025, pointCurr = pointCurr - 0.0002],
                     [time - t19, pointCurr, pointCurr + 0.0001, pointCurr - 0.0002, pointCurr = pointCurr - 0.0001],
                     [time - t18, pointCurr, pointCurr + 0.0003, pointCurr - 0.0001, pointCurr = pointCurr + 0.0002],
                     [time - t17, pointCurr, pointCurr + 0.0001, pointCurr - 0.0002, pointCurr = pointCurr - 0.0001],
                     [time - t16, pointCurr, pointCurr + 0.0002, pointCurr - 0.0005, pointCurr = pointCurr - 0.0002],
                     [time - t15, pointCurr, pointCurr + 0.0001, pointCurr - 0.0003, pointCurr = pointCurr - 0.0002],
                     [time - t14, pointCurr, pointCurr + 0.0005, pointCurr - 0.0001, pointCurr = pointCurr + 0.0004],
                     [time - t13, pointCurr, pointCurr + 0.0001, pointCurr - 0.0003, pointCurr = pointCurr - 0.0002],
                     [time - t12, pointCurr, pointCurr + 0.0004, pointCurr - 0.0001, pointCurr = pointCurr + 0.0003],
                     [time - t11, pointCurr, pointCurr + 0.0001, pointCurr - 0.0002, pointCurr = pointCurr - 0.0001],
                     [time - t10, pointCurr, pointCurr + 0.0003, pointCurr - 0.0001, pointCurr = pointCurr + 0.0002],
                     [time - t9, pointCurr, pointCurr + 0.0001, pointCurr - 0.0004, pointCurr = pointCurr - 0.0003],
                     [time - t8, pointCurr, pointCurr + 0.0005, pointCurr - 0.0001, pointCurr = pointCurr + 0.0004],
                     [time - t7, pointCurr, pointCurr + 0.0001, pointCurr - 0.00035, pointCurr = pointCurr - 0.0003],
                     [time - t6, pointCurr, pointCurr + 0.0002, pointCurr - 0.0001, pointCurr = pointCurr + 0.0001],
                     [time - t5, pointCurr, pointCurr + 0.0001, pointCurr - 0.0005, pointCurr = pointCurr - 0.00035],
                     [time - t4, pointCurr, pointCurr + 0.0002, pointCurr - 0.0003, pointCurr = pointCurr + 0.0001],
                     [time - t3, pointCurr, pointCurr + 0.0001, pointCurr - 0.0004, pointCurr = pointCurr - 0.0002],
                     [time - t2, pointCurr, pointCurr + 0.0004, pointCurr - 0.00003, pointCurr = pointCurr + 0.0001],
                     [time - t1, pointCurr, pointCurr + 0.0001, pointCurr - 0.00005, pointCurr = pointCurr - 0.0001],
                     [ohlcData.timeStamp, ohlcData.open, ohlcData.high, ohlcData.low, ohlcData.close]
                     ]);
                     */

                    $scope.chart.redraw();
                    //var last = series.data[series.data.length - 1];
                    //console.info("last x " + last.x + ", open " + last.open + ", high " + last.high + ", low " + last.low + ", close " + last.close);
                }
            } else {
                console.error("Chart object is not yet initialized, lets wait...");
            }
        }).catch(function () {
            console.error("Error while loading data" + JSON.stringify(arguments));
        });

        $scope.candleStickPromise = $interval($scope.updateCandleSticks, $scope.intervals.selectedInterval.val);
        $scope.currentPricePromise = $interval($scope.getCurrentPrice, CURRENT_PRICE_TIMER);

        $scope.updateCandleSticks();
    }

    $scope.updateCandleSticks = function () {
        console.info("Inside updateCandleSticks function.");
        var series = $scope.chartConfig.series[0];
        //var series = $scope.chartConfig.series[0];
        if (series.data.length) {
            console.info("Inside the if block in updateCandleSticks, number of array " + series.data.length);
            var last = series.data[series.data.length - 1];
            console.info("Before adding new candlestick");
            console.info("last " + JSON.stringify(last));
            //console.info("last x " + last.x + ", open " + last.open + ", high " + last.high + ", low " + last.low + ", close " + last.close);

            series.data[series.data.length - 1] = [last[0], last[1], last[2], last[3], last[4]];
            //last.update([last.x, last.open, last.high, last.low, last.close], true, true);
            //$scope.chart.redraw();

            /*
            if(series.data.length > 10) {
                console.info("data.length is greater than 10");
                series.addPoint([{x: newX, open: last.close, high: last.close, low: last.close, close: last.close}], true, true, true);
            } else {
                console.info("data.length is less than 10");
                series.addPoint([{x: newX, open: last.close, high: last.close, low: last.close, close: last.close}], true, false, true);
            }
*/

            //var newX = last.x + $scope.intervals.selectedInterval.val;
            var newX = last[0] + $scope.intervals.selectedInterval.val;
            console.info("newX " + newX);
            //$scope.chartConfig.series[0].data.push([newX, last.close, last.close, last.close, last.close]);
            $scope.chartConfig.series[0].data.push([newX, last[4], last[4], last[4], last[4]]);

            if($scope.chartConfig.series[0].data.length > 10) {
                $scope.chartConfig.series[0].data.shift();
            }

            //$scope.chart.redraw();
            //series.data.push[[newX, last.close, last.close, last.close, last.close]];

            var newPoint = series.data[series.data.length - 1];
            console.info("After adding new candlestick");
            //console.info("newPoint x " + newPoint.x + ", open " + newPoint.open + ", high " + newPoint.high + ", low " + newPoint.low + ", close " + newPoint.close);
            console.info("newPoint " + JSON.stringify(newPoint));
        }
    }

    $scope.getCurrentPrice = function () {
        console.info("Inside GetLatestCurrencyQuote function2.");
        var address = "GetLatestCurrencyQuote";
        var params = {currencyPair: 'EUR/USD'};

        vertxEventBusService.send(address, params, {timeout: 5000}).then(function (reply) {
            console.log('Reply for ' + address + " is " + JSON.stringify(reply));

            if (reply.status == "ok") {
                var currencyOHLCValue = reply[$scope.currencies.selectedCurrency];

                console.info("currencyOHLCValue " + JSON.stringify(currencyOHLCValue));

                var series = $scope.chartConfig.series[0];
                //var newOpen = currencyOHLCValue.open;
                //var newLow = currencyOHLCValue.low;
                //var newHigh = currencyOHLCValue.high;
                var newClose = currencyOHLCValue.close;

                //console.info('newOpen ' + newOpen);
                //console.info('newLow ' + newLow);
                //console.info('newHigh ' + newHigh);
                console.info("newClose " + newClose);
                console.info("series.data.length " + series.data.length);

                if(series.data.length > 0) {
                    var last = series.data[series.data.length - 1];
                    //var last = series.data.pop();
                    //console.info("last x " + last.x + ", open " + last.open + ", high " + last.high + ", low "
                    //    + last.low + ", close " + last.close);
                    console.info("last " + JSON.stringify(last));

					
					
                    //var newHigh = Math.max(last.high, newClose);
                    var newHigh = Math.max(last[2], newClose);
                    //var newLow = Math.min(last.low, newClose);
                    var newLow = Math.min(last[3], newClose);
					
					$scope.lastClose = newClose;

                    console.info("newHigh " + newHigh);
                    console.info("newLow " + newLow);

                    /*last.high = high;
                    last.low = low;
                    last.close = newValue;
                    series.data.push(last);
                    $scope.chart.redraw();*/

                    //last.update([last.x, last.open, newHigh, newLow, newClose], false, true);
                    //$scope.chartConfig.series[0].data[series.data.length - 1] = [last.x, last.open, newHigh, newLow, newClose];
                    $scope.chartConfig.series[0].data[series.data.length - 1] = [last[0], last[1], newHigh, newLow, newClose];
                    //$scope.chart.redraw();

                    /*
                    $scope.chartConfig.series[0].data.pop();
                    $scope.chart.redraw();
                    $scope.chartConfig.series[0].data.push([last.x, last.close, maxHigh, minLow, newOpen]);
                    $scope.chart.redraw();
                    */
                    
                    last = series.data[series.data.length - 1];
                    //console.info("last x " + last.x + ", open " + last.open + ", high " + last.high + ", low "
                    //    + last.low + ", close " + last.close);
                    console.info("last " + JSON.stringify(last));
                    
                } else {
                    console.log("Inside else block");
                }

                /*
                    last.update([
                        last.x,
                        last.open,
                        high,
                        low,
                        newValue
                    ], true);
                 */

            }

        }).catch(function () {
            console.error("Error while processing " + address + ", " + JSON.stringify(arguments));
        });
    }



    $scope.onIntervalChange = function () {
        $interval.cancel($scope.candleStickPromise);
    }

    $scope.onCurrencyChange = function() {
        $interval.cancel($scope.candleStickPromise);
        $interval.cancel($scope.currentPricePromise);

        $scope.loadData();
    }


    $timeout($scope.loadData, 6000);
    //$scope.updateCandleSticks();

    /*
     $scope.addCandleStick = function () {
     console.info("Inside addCandleStick");
     var address = 'GetCurrencyQuotes';
     var params = {'currencyPairs': ['EUR/USD']};
     //vertxEventBusService.send('GetCurrencyQuotes', params).then(function(reply){


     //console.info("Reply for " + address + " is " + JSON.stringify(reply));
     var pointCurr = 1.86;
     var series1 = $scope.chart.series[0];


     //series1.data[0].push();
     series1.setData(
     [
     /********[ts, o, h, l, c]*******************
     [new Date().getTime() - t23, pointCurr, pointCurr + 0.0001, pointCurr - 0.0002, pointCurr = pointCurr - 0.0001],
     [new Date().getTime() - t22, pointCurr, pointCurr + 0.0005, pointCurr - 0.0001, pointCurr = pointCurr + 0.00045],
     [new Date().getTime() - t21, pointCurr, pointCurr + 0.0001, pointCurr - 0.0003, pointCurr = pointCurr - 0.0002],
     [new Date().getTime() - t20, pointCurr, pointCurr + 0.0003, pointCurr - 0.00025, pointCurr = pointCurr - 0.0002],
     [new Date().getTime() - t19, pointCurr, pointCurr + 0.0001, pointCurr - 0.0002, pointCurr = pointCurr - 0.0001],
     [new Date().getTime() - t18, pointCurr, pointCurr + 0.0003, pointCurr - 0.0001, pointCurr = pointCurr + 0.0002],
     [new Date().getTime() - t17, pointCurr, pointCurr + 0.0001, pointCurr - 0.0002, pointCurr = pointCurr - 0.0001],
     [new Date().getTime() - t16, pointCurr, pointCurr + 0.0002, pointCurr - 0.0005, pointCurr = pointCurr - 0.0002],
     [new Date().getTime() - t15, pointCurr, pointCurr + 0.0001, pointCurr - 0.0003, pointCurr = pointCurr - 0.0002],
     [new Date().getTime() - t14, pointCurr, pointCurr + 0.0005, pointCurr - 0.0001, pointCurr = pointCurr + 0.0004],
     [new Date().getTime() - t13, pointCurr, pointCurr + 0.0001, pointCurr - 0.0003, pointCurr = pointCurr - 0.0002],
     [new Date().getTime() - t12, pointCurr, pointCurr + 0.0004, pointCurr - 0.0001, pointCurr = pointCurr + 0.0003],
     [new Date().getTime() - t11, pointCurr, pointCurr + 0.0001, pointCurr - 0.0002, pointCurr = pointCurr - 0.0001],
     [new Date().getTime() - t10, pointCurr, pointCurr + 0.0003, pointCurr - 0.0001, pointCurr = pointCurr + 0.0002],
     [new Date().getTime() - t9, pointCurr, pointCurr + 0.0001, pointCurr - 0.0004, pointCurr = pointCurr - 0.0003],
     [new Date().getTime() - t8, pointCurr, pointCurr + 0.0005, pointCurr - 0.0001, pointCurr = pointCurr + 0.0004],
     [new Date().getTime() - t7, pointCurr, pointCurr + 0.0001, pointCurr - 0.00035, pointCurr = pointCurr - 0.0003],
     [new Date().getTime() - t6, pointCurr, pointCurr + 0.0002, pointCurr - 0.0001, pointCurr = pointCurr + 0.0001],
     [new Date().getTime() - t5, pointCurr, pointCurr + 0.0001, pointCurr - 0.0005, pointCurr = pointCurr - 0.00035],
     [new Date().getTime() - t4, pointCurr, pointCurr + 0.0002, pointCurr - 0.0003, pointCurr = pointCurr + 0.0001],
     [new Date().getTime() - t3, pointCurr, pointCurr + 0.0001, pointCurr - 0.0004, pointCurr = pointCurr - 0.0002],
     [new Date().getTime() - t2, pointCurr, pointCurr + 0.0004, pointCurr - 0.00003, pointCurr = pointCurr + 0.0001],
     [new Date().getTime() - t1, pointCurr, pointCurr + 0.0001, pointCurr - 0.00005, pointCurr = pointCurr - 0.0001]
     ]);

     //}).catch(function(error){});

     }


     /*
     $scope.chartConfig = {
     options: {
     subtitle: {
     text: 'Click and drag to zoom in.'
     },
     xAxis: [{
     type: 'datetime'
     }],
     yAxis:
     [
     {
     id: 0,
     lineWidth: 1,
     allowDecimals: true,
     title: {
     text: 'EUR/USD',
     style: {
     color: 'red'
     }
     }
     }
     ],

     legend: {
     enabled: true
     },
     title: {
     text: 'EUR/USD'
     },
     loading: true,
     useHighStocks: true
     },
     /*
     xAxis: {
     currentMin: 0,
     currentMax: 0,
     title: {text: 'Price'}
     },

     series: [
     {
     data: []
     }
     ],
     chart: {
     type: 'line',
     zoomType: 'x'
     },

     func: function (chart) {
     //console.info("Received the chart " + angular.toJson(chart));
     $scope.chartData = chart;
     }
     }
     */

});