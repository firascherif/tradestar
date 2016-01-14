


//var chart; //variable globale
var eb = null;
var chart;
var tradeCurrency = 'EUR/USD';
var currency = 0;

//
var t1 = 60000;
var t2 = t1 * 2, t3 = t1 * 3, t4 = t1 * 4, t5 = t1 * 5, t6 = t1 * 6, t7 = t1 * 7, t8 = t1 * 8, t9 = t1 * 9, t10 = t1 * 10, t11 = t1 * 11, t12 = t1 * 12, t13 = t1 * 13, t14 = t1 * 14, t15 = t1 * 15, t16 = t1 * 16, t17 = t1 * 17, t18 = t1 * 18, t19 = t1 * 19, t20 = t1 * 20, t21 = t1 * 21, t22 = t1 * 22, t23 = t1 * 23, t24 = t1 * 24, t25 = t1 * 25;
var candleTimer, currentPriceTimer, last;
function requestData() {

    var series = this.series[0];

    if (!eb) {
        //eb = new vertx.EventBus("http://192.168.1.106:8080/eventbus");
     //   eb = new vertx.EventBus("http://" + window.location.host + "/eventbus");
        
        
         eb = new vertx.EventBus("/eventbus");
        var user = {"maxPlayers": 4, "totalPlayers": 0, "gameType": "Forty Four", "gameLengthInMillis": 20000};

        eb.onopen = function () {
            //var user = {"maxPlayers":4,"totalPlayers":0,"gameType":"Forty Four","gameLengthInMillis":20000};
            eb.send('RequestCurrency', user, function (reply) {
                currency = reply[tradeCurrency];
                //console.log(currency);
                var pointCurr = currency;
                series.setData(
                    [
                        [new Date().getTime() - t25, pointCurr, pointCurr + 0.00005, pointCurr - 0.0002, pointCurr = pointCurr - 0.0001],
                        [new Date().getTime() - t24, pointCurr, pointCurr + 0.0003, pointCurr - 0.0001, pointCurr = pointCurr + 0.0002],
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
                //console.log(currency);
            });

            candleTimer = setInterval(function () {
                    last = series.data[series.data.length - 1];
                    chart.series[0].addPoint([ last.x + 100000, last.close, last.close, last.close, last.close], true, true);
            }, t1);

            currentPriceTimer = setInterval(function () {
                eb.send('RequestCurrency', user, function (reply) {
                    var currency1 = reply[tradeCurrency];
                    var nv = currency1;
                    // console.log(nv);
                    last = series.data[series.data.length - 1];//tempObj.EURUSD*1000;//series.data[series.data.length - 1];
                    var high = Math.max(last.high, nv);
                    var low = Math.min(last.low, nv);

                    last.update([
                        last.x,
                        last.open,
                        high,
                        low,
                        nv
                    ], true);

                });
            }, 1000);

            $("#currencySelector, #timeSelector").change(function () {

                tradeCurrency = document.getElementById("currencySelector").value;
                t1 = document.getElementById("timeSelector").value;
                t2 = t1 * 2, t3 = t1 * 3, t4 = t1 * 4, t5 = t1 * 5, t6 = t1 * 6, t7 = t1 * 7, t8 = t1 * 8, t9 = t1 * 9, t10 = t1 * 10, t11 = t1 * 11, t12 = t1 * 12, t13 = t1 * 13, t14 = t1 * 14, t15 = t1 * 15, t16 = t1 * 16, t17 = t1 * 17, t18 = t1 * 18, t19 = t1 * 19, t20 = t1 * 20, t21 = t1 * 21, t22 = t1 * 22, t23 = t1 * 23, t24 = t1 * 24, t25 = t1 * 25;

                var user = {"maxPlayers": 4, "totalPlayers": 0, "gameType": "Forty Four", "gameLengthInMillis": 20000};
                clearInterval(candleTimer);

                eb.send('RequestCurrency', user, function (reply) {
                    currency = reply[tradeCurrency];
                    var pointCurr = currency;
                    series.setData(
                        [
                        /********[ts, o, h, l, c]*******************/
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
                });
                candleTimer = setInterval(function () {
                        last = chart.series[0].data[series.data.length - 1];
                        chart.series[0].addPoint([ last.x + 1000, last.close, last.close, last.close, last.close], true, true);
                }, t1);

                clearInterval(currentPriceTimer);
                currentPriceTimer = setInterval(function () {
                    eb.send('RequestCurrency', user, function (reply) {
                        var currency1 = reply[tradeCurrency];
                        var nv = currency1;

                        last = series.data[series.data.length - 1]; //tempObj.EURUSD*1000;//series.data[series.data.length - 1];
                        var high = Math.max(last.high, nv);
                        var low = Math.min(last.low, nv);

                        last.update([
                            last.x,
                            last.open,
                            high,
                            low,
                            nv
                        ], true);
                    });
                }, 1000);
            });
        }
    }
}

$(document).ready(function () {

    var plotLineId = 0;
    function drawLine(event) {
        var lineType = $('#chooseLine').val();
        var lineColor = $('#lineColor').val();
        var chart = '';

        if(lineType != 'diagonal'){

            if (lineType == 'xAxis') {
                chart = this.xAxis[0];
                var axisValue = event.xAxis[0].value,
                    lineCursor = 'ew-resize';

            } else if (lineType == 'yAxis') {
                chart = this.yAxis[0];
                var axisValue = event.yAxis[0].value,
                    lineCursor = 'ns-resize';
            } else {
                return false;
            }

            var line,
                clickX,
                clickY;

            var start = function (e) {
                chart.chart.xAxis[0].zoomEnabled = false;
                console.log(this);
                $(document).bind({
                    'mousemove.line': step,
                    'mouseup.line': stop
                });

                if(lineType == 'xAxis'){
                    clickX = e.pageX - line.translateX;
                }else{
                    clickY = e.pageY - line.translateY; //uncomment if plotline should be also moved vertically
                }
            }

            var step = function (e) {
                line.translate(e.pageX - clickX, e.pageY - clickY)
            }

            var stop = function (e) {
                var newVal = chart.toValue(e.pageX - clickX + chart.plotLeft) + chart.plotLinesAndBands[0].options.value;
                console.log(chart.plotLinesAndBands);
                $("#report").text("Value: " + newVal);
                $(document).unbind('.line');
                chart.chart.xAxis[0].zoomEnabled = true;
            }

            plotLineId = plotLineId + 1;

            chart.addPlotLine({
                value: axisValue,
                color: lineColor,
                width: 2,
                id: 'plotLine-' + plotLineId,
                zIndex: 20,
                events: {
                    dblclick: function () {
                        var lineId = this.id;
                        chart.removePlotLine(lineId);
                        chart.removePlotLine(lineId + '-a');
                    },
                    mouseover: function () {
                        line = chart.plotLinesAndBands[0].svgElem.attr({'stroke-width': 4}).css({'cursor': lineCursor});

                        //     var lineId = this.id,
                        //         axisValue = this.options.value,
                        //         lineColor = this.options.color,
                        //         isXAxis,
                        //         isYAxis,
                        //         align;


                        //     if(this.axis.isXAxis == true){
                        //         isXAxis = 3;
                        //         isYAxis = -15;
                        //     }else{
                        //         isXAxis = 20;
                        //         isYAxis = -5;
                        //     }
                        //     chart.addPlotLine({
                        //         value: axisValue,
                        //         color: lineColor,
                        //         width: 4,
                        //         id: lineId + '-a',
                        //         zIndex: 15,
                        //         label: {
                        //             text: '× Double click to delete',
                        //             x: isXAxis,
                        //             y: isYAxis,
                        //             verticalAlign: 'bottom',
                        //             style: {
                        //                 color: '#CCCCCC',
                        //                 fontWeight: 'bold',
                        //                 fontSize: 18,
                        //                 cursor: 'pointer'
                        //             }
                        //         }
                        //     })
                    },
                    mouseout: function () {
                        var lineId = this.id;
                        chart.removePlotLine(lineId + '-a');
                        line = chart.plotLinesAndBands[0].svgElem.attr({'stroke-width': 2}).css({'cursor': 'cursor'});
                    }
                }
            })

            line = chart.plotLinesAndBands[0].svgElem.translate(0, 0).on('mousedown', start);

            $('#chooseLine').val('0');
        }else{
            var x = event.xAxis[0].value;
            var y = event.yAxis[0].value;

            //var chart = $('#container').highcharts();

            //console.log(chart);
//            chart.renderer.circle(x,y,3)
//                .attr({
//                    fill: lineColor,
//                    stroke: 'white',
//                    'stroke-width': 1,
//                    id: 'box',
//                    class: 'box',
//                    zIndex: 170
//                })
//                .add();

            var seriesNumber = chart.series.length;
            if (chart.series[seriesNumber-1].data.length != 1) {
                chart.addSeries({
                    type: 'line',
                    name: 'Trend Line',
                    color: lineColor,
                    cursor: 'all-scroll',
                    draggableX: true,
                    draggableY: true,
                    zIndex: 15,
                    stack: 1,
                    marker: {
                        enabled: true,
                        symbol: 'circle',
                        zIndex: 16,
                        radius: 3,
                        states: {
                            hover: {
                                lineWidth: 2
                            }
                        }
                    },
                    data: [],
                    plotOptions:{

                    },
                    line:{
                        events: {

                            drag: function(e) {
                                console.log(chart);
                                // Returning false stops the drag and drops. Example:
                                /*
                                 if (e.newY > 300) {
                                 this.y = 300;
                                 return false;
                                 }
                                 */
//                                $('#drag').html(
//                                    'Dragging <b>' + this.series.name + '</b>, <b>' +
//                                        this.category + '</b> to <b>' +
//                                        Highcharts.numberFormat(e.newY, 2) + '</b>'
//                                );
                            },
                            drop: function() {
                                console.log(chart);
//                                $('#drop').html(
//                                    'In <b>' + this.series.name + '</b>, <b>' +
//                                        this.category + '</b> was set to <b>' +
//                                        Highcharts.numberFormat(this.y, 2) + '</b>'
//                                );
                            }
                        }
                    },
                    point: {
                        events: {

                            drag: function(e) {
                                chart
                                // Returning false stops the drag and drops. Example:
                                /*
                                 if (e.newY > 300) {
                                 this.y = 300;
                                 return false;
                                 }
                                 */
                                $('#drag').html(
                                    'Dragging <b>' + this.series.name + '</b>, <b>' +
                                        this.category + '</b> to <b>' +
                                        Highcharts.numberFormat(e.newY, 2) + '</b>'
                                );
                            },
                            drop: function() {
                                $('#drop').html(
                                    'In <b>' + this.series.name + '</b>, <b>' +
                                        this.category + '</b> was set to <b>' +
                                        Highcharts.numberFormat(this.y, 2) + '</b>'
                                );
                            }
                        }
                    },
                    stickyTracking: false
                });
                chart.series[seriesNumber].addPoint([x, y]);
            }else{
                var seriesNumber = chart.series.length - 1;
                chart.series[seriesNumber].addPoint([x, y]);
                $('#chooseLine').val('0');
            }
        }

    }

    $('#removeLines').click(function () {

        var plotLineArrayLength;
        var plotLineId;

        plotLineArrayLength = chart.xAxis[0].plotLinesAndBands.length-1;
        for( i = plotLineArrayLength; i >= 0; i--){
            plotLineId = chart.xAxis[0].plotLinesAndBands[i].id;
            chart.xAxis[0].removePlotLine(plotLineId);
        }

        plotLineArrayLength = chart.yAxis[0].plotLinesAndBands.length-1;
        for( i = plotLineArrayLength; i >= 0; i--){
            plotLineId = chart.yAxis[0].plotLinesAndBands[i].id;
            chart.yAxis[0].removePlotLine(plotLineId);
        }
    });

    $('#lineColor').change(function () {
        var color = $('#lineColor').val();
        $('#lineColor').css('background-color', color);
    });

    var width = (600)*0.70;
    var height = (305)*0.54;
   // window.chart = new Highcharts.StockChart({
        chart: {
            background: '',
            width: width,
            height: height,
            renderTo: 'container',
            marginTop: 0,
            spacingBottom: 5,
            spacingRight: 12,
            spacingLeft: 0,
            animation: {
                duration: 200
            },
            zoomType: 'x',
            panning: true,
            panKey: 'shift',
            //defaultSeriesType: 'candlestick',
            data: [],
            events: {
                load: requestData,
                click: drawLine
            }
        },
        tooltip: {
            borderColor: '#464646',
            borderWidth: 5,
            backgroundColor: '#292929',
            valueDecimals: 5,
            shadow: false,
            crosshairs: false,
            style: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '9px',
                padding: '8px'
            }
        },
        plotOptions: {
            line:{
                cropThreshold: 0,
                states: {
                    hover: {
                        enabled: true,
                        lineWidth: 3
                    }
                }
            },
            series: {
                stickyTracking: false,
                events: {
                    dblclick: function () {
                        alert('d');
                    },
                    click: function () {
                        $('.highcharts-tooltip').show();
                    },
                    mouseOut: function () {
                        $('.highcharts-tooltip').hide();
                    },
                    states: {
                        hover: {
                            color: '#FF0009'
                        }
                    }
                }
            }
        },
        series: [
            {
                type: 'candlestick',
                name: 'Chart data',
                data: [],
                zIndex: 10,
                stack: 1,
                marker: {
                    enabled: true,
                    width: 32,
                    height: 16
                },
                events: {
                    afterAnimate: function () {
                        $('.highcharts-tooltip').hide();
                    }
                }
            },
            {
                type: 'scatter',
                name: 'Position Long',
                zIndex: 15,
                marker: {
                    enabled: true,
                    symbol: 'triangle',
                    zIndex: 16,
                    radius: 4
                },
                data: []
            },
            {
                type: 'scatter',
                name: 'Position Short',
                zIndex: 15,
                marker: {
                    enabled: true,
                    symbol: 'triangle-down',
                    zIndex: 16,
                    radius: 4
                },
                data: []
            }
        ],
        rangeSelector: {
            enabled: false
        },
        navigator: {
            enabled: false
        },
        xAxis: {
            lineColor: '#dddddd',
            tickColor: '#fff',
            color: '#dddddd',
            gridLineColor: "#333",
            gridLineWidth: 1,
            minRange: 60000,
            //showLastLabel: false,
            endOnTick: false,
            zIndex: 1,
            labels: {
                style: {
                    fontSize: '9px'
                }
            },
            offset: -1,
            dateTimeLabelFormats: {
                millisecond: '%H:%M:%S.%L',
                second: '%M:%S',
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%e. %b',
                week: '%e. %b',
                month: '%b \'%y',
                year: '%Y'
            },
            crosshair: {
                color: 'rgba(255, 255, 255, 0.5)',
                snap: false,
                dashStyle: 'dash'
            }
        },

        yAxis: {
            offset: 20,
            gridLineColor: "#333",
            lineWidth: 1,
            lineColor: '#dddddd',
            tickColor: '#fff',
            tickLength: 3,
            zIndex: 1,
            labels: {
                align: 'left',
                x: -10,
                y: -2,
                style: {
                    fontSize: '9px'
                },
                formatter: function () {
                    return this.value.toFixed(5);
                }
            },
            crosshair: {
                color: 'rgba(255, 255, 255, 0.5)',
                snap: false,
                dashStyle: 'dash'
            }
        },
        scrollbar: {
            enabled: false
        },
        exporting: {
            enabled: false
        }
    });


    (function (H) {
        'use strict';
        var merge = H.merge;

        H.wrap(H.Chart.prototype, 'init', function (proceed) {

            // Run the original proceed method
            proceed.apply(this, Array.prototype.slice.call(arguments, 1));

            renderCurrentPriceIndicator(this);
        });

        H.wrap(H.Chart.prototype, 'redraw', function (proceed) {

            // Run the original proceed method
            proceed.apply(this, Array.prototype.slice.call(arguments, 1));

            renderCurrentPriceIndicator(this);
        });

        var prevPrice = 0,
            PriceIndicatoreColor;


        function renderCurrentPriceIndicator(chart) {

            var priceYAxis = chart.yAxis[0],
                priceSeries = chart.series[0],
                priceData = priceSeries.yData,
                currentPrice = (priceData[priceData.length - 1][3]).toFixed(5),

                extremes = priceYAxis.getExtremes(),
                min = extremes.min,
                max = extremes.max,

                options = chart.options.yAxis[0].currentPriceIndicator,
                defaultOptions = {
                    backgroundColor: '#74E05E',
                    borderColor: '#74E05E',
                    lineColor: '#74E05E',
                    lineDashStyle: 'Solid',
                    lineOpacity: 1,
                    enabled: true,
                    style: {
                        color: '#ffffff',
                        fontSize: '10px'
                    },
                    x: -5,
                    y: 0,
                    zIndex: 10
                },

                chartWidth = chart.chartWidth,
                chartHeight = chart.chartHeight,
                marginRight = chart.optionsMarginRight || 0,
                marginLeft = chart.optionsMarginLeft || 0,

                renderer = chart.renderer,

                currentPriceIndicator = priceYAxis.currentPriceIndicator || {},
                isRendered = Object.keys(currentPriceIndicator).length,

                group = currentPriceIndicator.group,
                label = currentPriceIndicator.label,
                box = currentPriceIndicator.box,
                line = currentPriceIndicator.line,

                width,
                height,
                x,
                y,

                lineFrom;

            options = merge(true, defaultOptions, options);

            width = priceYAxis.opposite ? (marginRight ? marginRight : 40) : (marginLeft ? marginLeft : 40);
            x = priceYAxis.opposite ? chartWidth - width : marginLeft;
            y = priceYAxis.toPixels(currentPrice);

            lineFrom = priceYAxis.opposite ? marginLeft : chartWidth - marginRight;

            // offset
            x += options.x;
            y += options.y;

            if (options.enabled) {

                // render or animate
                if (!isRendered) {
                    // group
                    group = renderer.g()
                        .attr({
                            zIndex: options.zIndex
                        })
                        .add();

                    // label
                    label = renderer.text(currentPrice, 270, y)
                        .attr({
                            zIndex: 2
                        })
                        .css({
                            color: options.style.color,
                            fontSize: options.style.fontSize
                        })
                        .add(group);

                    height = 14;
                    // box
                    box = renderer.rect(x, y - (height / 2), width, height)
                        .attr({
                            fill: options.backgroundColor,
                            stroke: options.borderColor,
                            zIndex: 1,
                            'stroke-width': 1
                        })
                        .add(group);

                    // box
                    line = renderer.path(['M', lineFrom, y, 'L', x, y])
                        .attr({
                            stroke: options.lineColor,
                            'stroke-dasharray': dashStyleToArray(options.lineDashStyle, 1), dashStyle: 'Shortdash',
                            'stroke-width': 1,
                            opacity: options.lineOpacity,
                            zIndex: 1
                        })
                        .add(group);

                    // adjust
                    label.animate({
                        y: y + (height / 4)
                    }, 0);
                } else {
                    if (currentPrice < prevPrice) {
                        PriceIndicatoreColor = '#ff0000';
                    } else {
                        PriceIndicatoreColor = '#74E05E';
                    }
                    ;
                    currentPriceIndicator.label.animate({
                        text: currentPrice,
                        y: y,
                        x: x + 3
                    }, 0);

                    height = 14;

                    currentPriceIndicator.box.animate({
                        y: y - (height / 2),
                        x: x + 3,
                        fill: PriceIndicatoreColor,
                        stroke: PriceIndicatoreColor
                    }, 0);

                    currentPriceIndicator.line.animate({
                        d: ['M', lineFrom, y, 'L', x, y],
                        stroke: PriceIndicatoreColor
                    }, 0);

                    // adjust
                    currentPriceIndicator.label.animate({
                        y: y + (height / 4) + 1
                    }, 0);
                }

                if (currentPrice > min && currentPrice < max) {
                    group.show();
                } else {
                    group.hide();
                }

                // register to price y-axis object
                priceYAxis.currentPriceIndicator = {
                    group: group,
                    label: label,
                    box: box,
                    line: line
                }
            }
            prevPrice = currentPrice;
        };
        /**
         * Convert dash style name to array to be used a the value
         * for SVG element's "stroke-dasharray" attribute
         * @param {String} dashStyle    Possible values: 'Solid', 'Shortdot', 'Shortdash', etc
         * @param {Integer} width    SVG element's "stroke-width"
         * @param {Array} value
         */
        function dashStyleToArray(dashStyle, width) {
            var value;
            dashStyle = dashStyle.toLowerCase();
            width = (typeof width !== 'undefined' && width !== 0) ? width : 1;

            if (dashStyle === 'solid') {
                value = 'none';
            } else if (dashStyle) {
                value = dashStyle
                    .replace('shortdashdotdot', '3,1,1,1,1,1,')
                    .replace('shortdashdot', '3,1,1,1')
                    .replace('shortdot', '1,1,')
                    .replace('shortdash', '3,1,')
                    .replace('longdash', '8,3,')
                    .replace(/dot/g, '1,3,')
                    .replace('dash', '4,3,')
                    .replace(/,$/, '')
                    .split(','); // ending comma

                var i = value.length;
                while (i--) {
                    value[i] = parseInt(value[i]) * width;
                }
                value = value.join(',');
            }
            return value;
        };
    })(Highcharts);


    var counter = 0;
    $("#zoomIn").click(function () {
        counter = counter + 1;

        if (counter > 4) {
            counter = 4
        }
        ;
        switch (counter) {
            case 1:
                chart.xAxis[0].minRange = 3600000;
                chart.xAxis[0].isDirty = true;
                chart.redraw();
                break;
            case 2:
                chart.xAxis[0].minRange = 14400000;
                chart.xAxis[0].isDirty = true;
                chart.redraw();
                break;
            case 3:
                chart.xAxis[0].minRange = 43200000;
                chart.xAxis[0].isDirty = true;
                chart.redraw();
                break;
            case 4:
                chart.xAxis[0].minRange = 604800000;
                chart.xAxis[0].isDirty = true;
                chart.redraw();
                break;
        }
    });

    $("#zoomOut").click(function () {
        counter = counter - 1;

        if (counter < 0) {
            counter = 0
        }
        ;

        switch (counter) {
            case 0:
                chart.xAxis[0].minRange = 60000;
                chart.xAxis[0].isDirty = true;
                chart.redraw();

                break;
            case 1:
                chart.xAxis[0].minRange = 3600000;
                chart.xAxis[0].isDirty = true;
                chart.redraw();
                break;
            case 2:
                chart.xAxis[0].minRange = 14400000;
                chart.xAxis[0].isDirty = true;
                chart.redraw();
                break;
            case 3:
                chart.xAxis[0].minRange = 43200000;
                chart.xAxis[0].isDirty = true;
                chart.redraw();
                break;
        }
    });

    $("#chartType").change(function () {
        var chartType = $("#chartType").val(), chartColor;

        if (chartType == 'ohlc' || chartType == 'line') {
            chartColor = '#74E05E';
        } else {
            chartColor = '#ff0000';
        }

        if (chartType == 'line'||chartType == 'line') {
            clearInterval(candleTimer);
            candleTimer = setInterval(function () {
                    last = chart.series[0].data[chart.series[0].data.length - 1];
                    chart.series[0].addPoint([ last.x + 1000, last.close, last.close, last.close, last.close], true, true);
            }, 1000);

            chart.series[0].update({
                type: chartType,
                color: chartColor
            });
            $('#timeSelector').attr('disabled', true);
        } else {
            clearInterval(candleTimer);
            candleTimer = setInterval(function () {
                last = chart.series[0].data[chart.series[0].data.length - 1];
                chart.series[0].addPoint([ last.x + 1000, last.close, last.close, last.close, last.close], true, true);
            }, t1);
            chart.series[0].update({
                type: chartType,
                color: chartColor
            });
            $('#timeSelector').attr('disabled', false);
        }
    });


    var cssChanged = false;
    $("#fullScreen").change(function () {
        var x = $("#fullScreen").val();

        switch (x) {
            case "1":
                $("#chart-holder").attr('class', 'col-xs-6');
                $("#chart-holder").css({'background': "url('../assets/images/trading_floor/table_rect.png') no-repeat", 'background-size': '100% 96%', 'margin-top': '11vh','margin-left': '20%','padding': '0 0 0 0.7vw'});
                $("#wrapper").css({'margin': '82px auto 0','padding':'0 20px'});
                $(".highcharts-container").css({'border-radius': '20px'});
                $("#container").css({'position':'fixed','left':'100px','height': '20vh','width':'30vh'});
                $('#container').highcharts().reflow();

                break;
            case "2":
                $("#chart-holder").attr('class', 'col-xs-8');
                $("#chart-holder").css({'background': 'rgba(225,225,225,0)', 'height': '41vh', 'margin-top': '9vh','margin-left': '16%','padding': '0 0 0 0.7vw'});
                $("#wrapper").css({'margin': '0 auto 0','padding':'5'});
                $(".highcharts-container").css({'border-radius': '5'});
                $("#container").css({'position':'fixed','left':'50px','height': '41vh','width':'46vw'});
                $('#container').highcharts().reflow();
                break;
            case "3":
                $("#chart-holder").attr('class', 'col-xs-12');
                $("#chart-holder").css({'background': 'rgba(225,225,225,0)', 'height': '58vh', 'margin-top': '2px','margin-left': '0','padding':'0'});
                $("#wrapper").css({'margin': '0 auto 0'});
                $(".highcharts-container").css({'border-radius': '0', 'width':'700px'});
                $("#container").css({'position':'fixed','left':'-10px','height': '60vh','width':'100vw'});
                $('#container').highcharts().reflow();
                break;
        }
    });
    var checkChart = function(){
        if (window.chart.series[0].data == "" || window.chart.chartWidth < 150){
            window.chart.redraw();
            console.log(window.chart.chartWidth);
        }
    }
    setTimeout(function(){ checkChart(); }, 20000);
});

/*
var resizeChart=function() {

    var width = $('#imageChartHolder').width()*0.76;
    var height = $('#imageChartHolder').height()*0.54;

    window.chart.setSize(width, height);

};
                                            */

function resizeChart() {

    console.info("Size changed");
    var width = $('#container').width();
    var height = $('#container').height();
    window.chart.setSize(width, height);
    
};

function fA(){
    console.log("Initial resize.");
    resizeChart();
}


$(window).load(fA);

/*

$(window).resize(function() {

    var width = $('#chartHolder').width()-80;
    var height = $('#chartHolder').height()-80;

    console.log(width);


    $("#container").highcharts({
        chart: {
            width: width,
            height: height,
            animation: {
                duration: 200
            },
        data: [],
        events: {
            load: requestData,
            click: drawLine
        }
        },
        tooltip: {
            borderColor: '#464646',
            borderWidth: 5,
            backgroundColor: '#292929',
            valueDecimals: 5,
            shadow: false,
            crosshairs: false,
            style: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '9px',
                padding: '8px'
            }
        },
        plotOptions: {
            line:{
                cropThreshold: 0,
                states: {
                    hover: {
                        enabled: true,
                        lineWidth: 3
                    }
                }
            },
            series: {
                stickyTracking: false,
                events: {
                    dblclick: function () {
                        alert('d');
                    },
                    click: function () {
                        $('.highcharts-tooltip').show();
                    },
                    mouseOut: function () {
                        $('.highcharts-tooltip').hide();
                    },
                    states: {
                        hover: {
                            color: '#FF0009'
                        }
                    }
                }
            }
        },
        series: [
            {
                type: 'candlestick',
                name: 'Chart data',
                data: [],
                zIndex: 10,
                stack: 1,
                marker: {
                    enabled: true,
                    width: 32,
                    height: 16
                },
                events: {
                    afterAnimate: function () {
                        $('.highcharts-tooltip').hide();
                    }
                }
            },
            {
                type: 'scatter',
                name: 'Position Long',
                zIndex: 15,
                marker: {
                    enabled: true,
                    symbol: 'triangle',
                    zIndex: 16,
                    radius: 4
                },
                data: []
            },
            {
                type: 'scatter',
                name: 'Position Short',
                zIndex: 15,
                marker: {
                    enabled: true,
                    symbol: 'triangle-down',
                    zIndex: 16,
                    radius: 4
                },
                data: []
            }
        ],
        rangeSelector: {
            enabled: false
        },
        navigator: {
            enabled: false
        },
        xAxis: {
            lineColor: '#dddddd',
            tickColor: '#fff',
            color: '#dddddd',
            gridLineColor: "#333",
            gridLineWidth: 1,
            //showLastLabel: false,
            endOnTick: false,
            zIndex: 1,
            labels: {
                style: {
                    fontSize: '9px'
                }
            },
            dateTimeLabelFormats: {
                millisecond: '%H:%M:%S.%L',
                second: '%M:%S',
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%e. %b',
                week: '%e. %b',
                month: '%b \'%y',
                year: '%Y'
            },
            crosshair: {
                color: 'rgba(255, 255, 255, 0.5)',
                snap: false,
                dashStyle: 'dash'
            }
        },

        yAxis: {
            gridLineColor: "#333",
            lineColor: '#dddddd',
            tickColor: '#fff',
            tickLength: 3,
            zIndex: 1,
            labels: {
                align: 'left',
                x: -10,
                y: -2,
                style: {
                    fontSize: '9px'
                },
                formatter: function () {
                    return this.value.toFixed(5);
                }
            },
            crosshair: {
                color: 'rgba(255, 255, 255, 0.5)',
                snap: false,
                dashStyle: 'dash'
            }
        },
        scrollbar: {
            enabled: false
        },
        exporting: {
            enabled: false
        }
    });



    window.chart = new Highcharts.StockChart({
        chart: {
            width: width,
            height: height,
            renderTo: 'container',
            backgroundColor: '#000000',
            animation: {
                duration: 200
            },
            data: [],
            events: {
                load: requestData
                //click: drawLine
            }
        },
        tooltip: {
            borderColor: '#464646',
            borderWidth: 5,
            backgroundColor: '#292929',
            valueDecimals: 5,
            shadow: false,
            crosshairs: false,
            style: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '9px',
                padding: '8px'
            }
        },
        plotOptions: {
            line:{
                cropThreshold: 0,
                states: {
                    hover: {
                        enabled: true,
                        lineWidth: 3
                    }
                }
            },
            series: {
                stickyTracking: false,
                events: {
                    dblclick: function () {
                        alert('d');
                    },
                    click: function () {
                        $('.highcharts-tooltip').show();
                    },
                    mouseOut: function () {
                        $('.highcharts-tooltip').hide();
                    },
                    states: {
                        hover: {
                            color: '#FF0009'
                        }
                    }
                }
            }
        },
        series: [
            {
                type: 'candlestick',
                name: 'Chart data',
                data: [],
                zIndex: 10,
                stack: 1,
                marker: {
                    enabled: true,
                    width: 32,
                    height: 16
                },
                events: {
                    afterAnimate: function () {
                        $('.highcharts-tooltip').hide();
                    }
                }
            },
            {
                type: 'scatter',
                name: 'Position Long',
                zIndex: 15,
                marker: {
                    enabled: true,
                    symbol: 'triangle',
                    zIndex: 16,
                    radius: 4
                },
                data: []
            },
            {
                type: 'scatter',
                name: 'Position Short',
                zIndex: 15,
                marker: {
                    enabled: true,
                    symbol: 'triangle-down',
                    zIndex: 16,
                    radius: 4
                },
                data: []
            }
        ],
        rangeSelector: {
            enabled: false
        },
        navigator: {
            enabled: false
        },
        xAxis: {
            lineColor: '#dddddd',
            tickColor: '#fff',
            color: '#dddddd',
            gridLineColor: "#333",
            gridLineWidth: 1,
            //showLastLabel: false,
            endOnTick: false,
            zIndex: 1,
            labels: {
                style: {
                    fontSize: '9px'
                }
            },
            dateTimeLabelFormats: {
                millisecond: '%H:%M:%S.%L',
                second: '%M:%S',
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%e. %b',
                week: '%e. %b',
                month: '%b \'%y',
                year: '%Y'
            },
            crosshair: {
                color: 'rgba(255, 255, 255, 0.5)',
                snap: false,
                dashStyle: 'dash'
            }
        },

        yAxis: {
            gridLineColor: "#333",
            lineColor: '#dddddd',
            tickColor: '#fff',
            tickLength: 3,
            zIndex: 1,
            labels: {
                align: 'left',
                x: -10,
                y: -2,
                style: {
                    fontSize: '9px'
                },
                formatter: function () {
                    return this.value.toFixed(5);
                }
            },
            crosshair: {
                color: 'rgba(255, 255, 255, 0.5)',
                snap: false,
                dashStyle: 'dash'
            }
        },
        scrollbar: {
            enabled: false
        },
        exporting: {
            enabled: false
        }
    });

});
*/