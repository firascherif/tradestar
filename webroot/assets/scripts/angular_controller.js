var myApp = angular.module('tradestar');
/*
 myApp.factory('CurrencyPairs', function(){
 var CurrencyPairs = {};
 CurrencyPairs.index=0;

 CurrencyPairs.getPairChoiseBuy=function(index){
 return this.cast[index].title}
 // CurrencyPairs.setPairChoiseBuy(index,value)=function(){
 //   this.cast[index]=value;}
 CurrencyPairs.cast = [
 {title: "USD/EUR", glyphicon1: "glyphicon bfh-flag-US", glyphicon2: "glyphicon bfh-flag-EU"},
 {title: "USD/CAD", glyphicon1: "glyphicon bfh-flag-US", glyphicon2: "glyphicon bfh-flag-CA"},
 {title: "USD/CHF", glyphicon1: "glyphicon bfh-flag-US", glyphicon2: "glyphicon bfh-flag-CH"},
 {title: "USD/JPY", glyphicon1: "glyphicon bfh-flag-US", glyphicon2: "glyphicon bfh-flag-JP"},
 {title: "GBP/USD", glyphicon1: "glyphicon bfh-flag-GB", glyphicon2: "glyphicon bfh-flag-US"}
 ];

 return CurrencyPairs;
 });

 */
//angular.module('tradestar').config(function($windows){
//   $window.Stripe.setPublishableKey('1234 1234 1234 1234');
//});

myApp.controller('tradingFloorController', ['$rootScope','$scope','$cookies', '$modal', '$window', 'vertxEventBus', 'vertxEventBusService', 'counterUpdate','$timeout',
    function ($rootScope,$scope,$cookies, $modal, $window, vertxEventBus, vertxEventBusService, counterUpdate, $timeout) {

function detectidleUser() {

 var idleInterval = setInterval(timerIncrement, 60000); // 1 minute

    //Zero the idle timer on mouse movement.
    $(this).mousemove(function (e) {
        idleTime = 0;
    });
    $(this).keypress(function (e) {
        idleTime = 0;
    });


      }

      detectidleUser();

function timerIncrement() {
    idleTime = idleTime + 1;
    if (idleTime > 60) { // 20 minutes
        alert("detectidleUser");
//user log out after 1 hour //
        $scope.logout();
    }
}

$(window).on('beforeunload',function() {
    

$scope.logout();

    
});
		function errorFuncHolder() {

            return {
                handler: function (message) {
                    console.error("No response within 10 seconds " + JSON.stringify(arguments));
                }
            };
        }
    

        $scope.errorFuncHolder = new errorFuncHolder();

        $scope.pageStats = '';

        $("#floorTimer").TimeCircles(
            {count_past_zero: false}
        );

        $scope.Auth = false;
        $scope.partials = [
            {"url": 'partials/navbar.html', "conditions": "true"},
            {"url": 'partials/bottombar.html', "conditions": "true"},
            {"url": 'partials/home.html', "conditions": "!Auth"}
        ];

        $scope.playerInfo =
        {
            "username": "",
            "balance": 0,
            "level": 0,
            "streak": 0,
            "tables": [],
            "imgUrl": "",
            "flagUrl": "",
            "currentTable": "",
            "numStars":0
        };

        $scope.toggleLeaderboard = function () {
            if ($scope.leaderBoardShow) {
                $scope.leaderBoardShow = false;
            }
            else
                $scope.leaderBoardShow = true;
        }


//var CurrencyPairs = {};
        $scope.totalPartials = 6;
//$scope.currencies=CurrencyPairs.cast;
        
        $scope.updateStatus = {};
        $scope.tableList = [];
        $scope.nb_players = 0;
        $scope.pick_buy_value = 0;
        $scope.pick_sell_value = 0;
        $scope.tab_position = [];
        $scope.eb = null;
        $scope.tableName = "";
        $scope.user1_reply = {};
        $scope.players_list = []; // TODO probablement a enlever ,remplacer par currentTable.players_list
        $scope.players_list_details = {};
        $scope.userInfo_ID = "";
        $scope.tableInfos = {};
        $scope.buy_max = 0;
        $scope.sell_max = 0;
        $scope.modal_on = "";
        $scope.showUpdateComplete = false;
        $scope.players_board = [];
        $scope.showNewPositionsBadge = false;
        $scope.showNewOrderBadge = true;
        $scope.showNewHistoryBadge = true;
        $scope.newPositions = 0;
        $scope.newHistory = 0;
        $scope.newOrders = 0;
        $scope.positionsTabClicked = 1;
        $scope.historyTabClicked = 0
        $scope.orderTabClicked = 0;
        $scope.showChatBadge = true;
        $scope.showNewsBadge = false;
        $scope.showPageOverlay = false;
        $scope.msgNumber = 0;
        $scope.unreadMessages = 0;
        $scope.unreadNews = 0;
        $scope.newsClicked = 1;
        $scope.chatClicked = 0;
        $scope.feeds = [];
        $scope.left_downInfo = {"left": "1%"};
        $scope.timer = {"left": "1%"};
        $scope.allInBtn = {"width": "0vw", "padding-top": "0px"};
        $scope.buying_option = [
            {
                "id": 100,
                "value": '100$'
            },
            {
                "id": 1000,
                "value": '1,000$'
            },
            {
                "id": 10000,
                "value": '10,000$'
            },
            {
                "id": 100000,
                "value": '100,000$'
            }
        ];
        $scope.paramCreate = {
            "maxPlayers": 2,
            "totalGameTime": 600000,
            "gameType": "Fourty four",
            "roundGameTime": 30000,
            "buyIn": 100,
            'hitAndRunAmount': 10
        };


        $scope.select_numberPlayer = 2;

        $scope.gritters = [];
        $scope.open_rightbar = true;
        $scope.placing_players = [
            {"left": "42%", "top": '11%'},
            {"left": '42%', "top": '59%'},
            {"left": '7.5%', "top": '35%'},
            {"left": '75%', "top": '35%'},
            {"left": '14.5%', "top": '17.5%'},
            {"left": '67%', "top": '17%'},
            {"left": '15%', "top": '54%'},
            {"left": '67%', "top": '54%'}
        ];
        $scope.placing_players_profit = [
            {"position": "absolute", "left": "47%", "top": '9%'},
            {"position": "absolute", "left": '47%', "top": '76%'},
            {"position": "absolute", "left": '9%', "top": '44%'},
            {"position": "absolute", "right": '15%', "top": '44%'},
            {"position": "absolute", "left": '25%', "top": '9%'},
            {"position": "absolute", "right": '33%', "top": '9%'},
            {"position": "absolute", "left": '25%', "top": '76%'},
            {"position": "absolute", "right": '33%', "top": '76%'}
        ];
        $scope.floor_action_left = "positions";
        $scope.historyLog = [];
        $scope.friend_line_1 = [
            "../assets/images/friends/trading1.jpg",
            "../assets/images/friends/trading2.jpg",
            "../assets/images/friends/trading3.jpg",
            "../assets/images/friends/trading4.jpg"
        ];
        $scope.currentTable = "";
        $scope.players_list_eliminate = [];


        //by Valerii

        //forgetButton
        $scope.pageForget = false;
        $scope.windows_open_forgetPassword = false;

        $scope.open_forgetPassword = function () {
            if ($scope.windows_open_forgetPassword) {
                $scope.pageForget = false;
                $scope.windows_open_forgetPassword = false;
            } else {
                $scope.windows_open_forgetPassword = true;
                $scope.pageForget = true;
                $scope.confirmInformation = false;
                $scope.sendEmail = true;
            }
        }//End forgetButton

        //BottomBar menu
        $scope.changePage_bottombar = function (page) {
            if ($scope.bottombar_page) {
                $scope.bottombar_page = false;
                $scope.showPageOverlay = false;
            } else {
                $scope.bottombar_page = page;
                $scope.showPageOverlay = true;
            }
        }//End BottomBar menu

        //Closing forgetButton and BottomBar pages
        $scope.closeBottom = function () {
            $scope.gameVideo = false;
            //	showModal
            $scope.orderEditPanel = false;
            $scope.bottombar_page = false;
            $scope.showPageOverlay = false;
            $scope.pageForget = false;
            $scope.windows_open_forgetPassword = false;
            $scope.wrongPassword = false;
            $scope.sendEmail = true;
            $scope.confirmInformation = false;

        }//End function

        //Genarate random digits
        function getRandomInteger(size) {
            return Math.floor((size + 1) * Math.random());
        }

        //End getRandomInteger

        //Insert random pictures of digits for human input validation
        $scope.wrongHumanInput = false;

        $scope.getRandomPics = function () {
            if ($scope.windows_open_forgetPassword) {
                var imageURLIntoArray = new Array(5);
                var digitsGeneratedArray = new Array(5);

                for (var i = 0; i < 5; i++) {
                    var val = getRandomInteger(9);
                    imageURLIntoArray[i] = '../assets/images/validation_numbers/' + val + '.jpg';
                    digitsGeneratedArray[i] = val;
                }
                $scope.imageURLArray = imageURLIntoArray;
                $scope.randomDigitsArray = digitsGeneratedArray.toString();
            } else {
                $scope.imageURLArray = null;
                $scope.randomDigitsArray = null;
            }
        }
        //END getRandomPics


        //Checklist for input validation
        $scope.checkHumanDigits = false;
        $scope.checkEmailValidation = false;

        //Function to check an clear input fields
        function clearInputFields() {
            if (!$scope.checkHumanDigits) {
                document.getElementById("inputDigits").style.borderColor = "green";
                document.getElementById("inputDigits").value = null;
                document.getElementById("inputDigits").focus();
                $scope.wrongHumanInput = true;
            }
            else if ($scope.checkHumanDigits) {
                document.getElementById("inputDigits").style.borderColor = "pink";
                document.getElementById("inputDigits").value = null;
                document.getElementById("inputDigits").focus();
            }
            else if (($scope.checkEmailValidation == false) && ($scope.checkHumanDigits == false)) {
                document.getElementById("mail").value = null;
                document.getElementById("mail").focus();
                document.getElementById("mail").style.borderWidth = "2px";
                document.getElementById("mail").style.borderColor = "red";
                document.getElementById("inputDigits").value = null;
            }
            else if (($scope.checkEmailValidation == false) && ($scope.checkHumanDigits == true)) {
                document.getElementById("mail").value = null;
                document.getElementById("mail").focus();
                document.getElementById("mail").style.borderWidth = "2px";
                document.getElementById("mail").style.borderColor = "orange";
                //document.getElementById("inputDigits").value=null;
            }
            else if ($scope.checkHumanDigits == false) {
                document.getElementById("inputDigits").value = null;
                document.getElementById("inputDigits").focus();
                document.getElementById("inputDigits").style.borderWidth = "2px";
                document.getElementById("inputDigits").style.borderColor = "green";
                //document.getElementById("inputDigits").value=null;
                alert("Well!!!");
            }
            else {
                alert("default clear!!!");
            }
        }

        //End clearInputFields


        //Human Input Validation whether pictures' digits and human input digits are the same
        function getHumanInput() {
            var digitsInputColection = new Array(5);
            var humanDigits = document.getElementById("inputDigits").value;

            for (var i = 0; i < 5; i++) {
                digitsInputColection[i] = parseInt(humanDigits.charAt(i), 10);
            }

            $scope.humanInputDigits = digitsInputColection.toString();

            if (angular.equals($scope.humanInputDigits, $scope.randomDigitsArray)) {
                $scope.checkHumanDigits = true;
                clearInputFields();
                //alert("it's true");
            } else {
                $scope.checkHumanDigits = false;
                clearInputFields();
                //alert("it's false");
            }
        }

        //END getHumanInput Validation

        //Forget Button - -  > send email(try again)/cancel(close) buttons
        $scope.wrongPassword = false;//NEW
        $scope.sendEmail = true;//NEW
        $scope.confirmInformation = false;//NEW

        //Function to retrieve email from database
        $scope.sendPassword = function (forget_email) {
            getHumanInput();
            if ($scope.checkHumanDigits) {
                alert("send is true");

                vertxEventBusService.send('ForgetPassword', forget_email).then(function (reply) {
                    //alert(reply);
                    if (!reply) {
                        //$scope.$apply(function () {
                        //NEW
                        $scope.wrongPassword = true;
                        $scope.sendEmail = false;
                        $scope.confirmInformation = false;
                        $scope.checkEmailValidation = false;
                        clearInputFields();
                        //});
                    }
                    else {
                        //$scope.$apply(function () {
                        $scope.wrongPassword = false;
                        $scope.sendEmail = false;
                        $scope.confirmInformation = true;
                        $scope.checkEmailValidation = true;
                        clearInputFields();
                        //});
                    }
                }).catch(function () {
                    console.error("No reply for ForgetPassword");
                }); //End eb.send ForgetPassword

            } else {
                alert("send is false");
                clearInputFields();
            }
        }//End Function to retrieve email from database
        //END Forget Button  - -  > send email(try again)/cancel(close) buttons

        //End Valerii


        $scope.balanceTransfer = function (from, to, target) {
            var diff = to - from;
            if (diff < 0)
                diff = diff * -1;
            var step = diff / 100;
            counterUpdate.init(from, to, step, target, diff);
        }

        $scope.isPlayerMax = function (value) {
            if (value <= $scope.nb_players)
                return true;
            else
                return false;
        }

        $scope.action_buy = function (value) {

            value = parseFloat(value);
            var address_target_action = $scope.currentTable.tableName + ".NewTrade";
            var user = {
                "sessionID": $cookies.sessionID, "tradeTypeFlag": 1,
                "currency": "EUR/USD", "volume": value
            };
//console.log('line 730');
            var tradeId, tradePosition = 'BUY';

            //if (!$scope.eb)
            //    alert("Pas de connection a l'eventBus");
            //else {
            vertxEventBusService.send(address_target_action, user).then(function (reply) {
//                console.log(JSON.stringify(reply));

                tradeId = reply.tradeID;
                //$scope.$apply(function () {
                $scope.currentTable.positions.push({
                    "id": reply.tradeID,
                    "tradeVolume": reply.tradeVolume,
                    "tradeCurrency": reply.tradeCurrency,
                    "tradePrice": reply.tradePrice,
                    "freeVolume": 0,
                    "gain": 0,
                    "type": "LONG"
                });
                //NEW
                $scope.addToGritterBar("BUY", reply.tradePrice, reply.tradeVolume, reply.tradeCurrency);
                //$scope.addPositionLine(tradePosition, tradeId);
                $scope.newPositions = $scope.newPositions + 1;
                $scope.newHistory = $scope.newHistory + 1;
//console.log('length after buy '+ $scope.currentTable.history.length);					
                //});
            }).catch(function () {
                $scope.errorFuncHolder(address_target_action, user);
            });
            //}
        }

        $scope.update_slider = function (value) {
            $scope.$apply(function () {
                $scope.buy_max = value;
                $scope.sell_max = value;
            });
        }

        $scope.action_sell = function (value) {
            value = parseFloat(value);
            var address_target_action = $scope.currentTable.tableName + ".NewTrade";
            var user = {
                "sessionID": $cookies.sessionID, "tradeTypeFlag": 2,
                "currency": "EUR/USD", "volume": value
            };

            var tradeId,
                tradePosition = 'SELL';
            //if (!$scope.eb)
            //    alert("Pas de connection a l'eventBus");
            //else {
            vertxEventBusService.send(address_target_action, user).then(function (reply) {
                tradeId = reply.tradeID;
                //$scope.$apply(function () {
                $scope.currentTable.positions.push({
                    "id": reply.tradeID,
                    "tradeVolume": reply.tradeVolume,
                    "tradeCurrency": reply.tradeCurrency,
                    "tradePrice": reply.tradePrice,
                    "freeVolume": 0,
                    "gain": 0,
                    "type": "SHORT"
                });
                //NEW
                $scope.addToGritterBar("SELL", reply.tradePrice, reply.tradeVolume, reply.tradeCurrency);
                //$scope.addPositionLine(tradePosition, tradeId);
                $scope.newPositions = $scope.newPositions + 1;
                $scope.newHistory = $scope.newHistory + 1;
                //});
            }).catch(function () {
                $scope.errorFuncHolder.handler(address_target_action, user);
            });
            //}
        }
        //NEW
        $scope.toggleGritterHistory = function () {
            if ($scope.gritterHistory) {
                $scope.gritterHistory = false;
            }
            else $scope.gritterHistory = true;
        }
        //NEW
        $scope.addToGritterBar = function (type, tradePrice, tradeVolume, tradeCurrency) {
            $scope.barGritter = true;

            var gritter = 'You took a ' + type + ' position with ' + tradeVolume + ' ' + tradeCurrency + ' @ ' + tradePrice.toFixed(4);
            $scope.currentTable.gritter.unshift(gritter);
            $('#barGritter').addClass('animated flash');
            $('#barGritter').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (event) {
//            console.log(event);
                $('#barGritter').removeClass('animated flash');
            });
        }
        //NEW
        $scope.addPositionLine = function (tradePosition, tradeId) {
            var lineColor = '';
            var priceYAxis = chart.yAxis[0],
                priceSeries = chart.series[0],
                priceData = priceSeries.yData,
                currentPrice = (priceData[priceData.length - 1][3]).toFixed(5);
            var x = chart.series[0].xData[chart.series[0].xData.length - 1];

            if (tradePosition == 'BUY') {
                lineColor = '#74E05E';
                chart.series[1].addPoint({
                    name: 'positionLine-' + tradeId,
                    color: '#74E05E',
                    x: x,
                    y: priceData[priceData.length - 1][3]
                });
            } else {
                lineColor = '#FF0000';
                chart.series[2].addPoint({
                    name: 'positionLine-' + tradeId,
                    color: '#FFAFBC',
                    x: x,
                    y: priceData[priceData.length - 1][3]
                });
            }

            chart.yAxis[0].addPlotLine({
                value: currentPrice,
                color: lineColor,
                dashStyle: 'LongDashDot',
                width: 1,
                opacity: 1,
                id: 'positionLine-' + tradeId,
                zIndex: 9999,
                label: {
                    text: currentPrice,
                    align: 'right',
                    x: 45,
                    y: 3,
                    style: {
                        color: lineColor,
                        fontSize: '10px',
                        backgroundColor: lineColor
                    }
                }
            });
        }

        $scope.action_close = function (index) {

            $scope.pick_sell_value = 0;
            $scope.pick_buy_value = 0;

            var address_target_action = $scope.currentTable.tableName + ".NewTrade";

            var user = {
                "sessionID": $cookies.sessionID, "tradeTypeFlag": 3,
                "tradeID": $scope.currentTable.positions[index].tradeID
            };

            vertxEventBusService.send(address_target_action, user).then(function (reply) {
                //console.log(JSON.stringify(user));
                //console.log(JSON.stringify(reply));
                //$scope.$apply(function () {
                $scope.currentTable.positions.splice(index, 1);
                //});

            }).catch(function () {
                $scope.errorFuncHolder.handler(address_target_action, user);
            });

            $scope.new_gritter_close();
            //$scope.removePositionLine(tradeId);
            $scope.newHistory = $scope.newHistory + 1;
            console.log("line 883 numbers after close " + $scope.currentTable.positions.length);

        }

        //NEW
//***************************************************************************************VVVVV*//	
        $scope.frameVideo = false;

        $scope.playVideo = function () {

            $scope.frameVideo = true;
//	console.log('sdsdsdsdsdsdsdsdsdsdsd');
        }


//check real rates 

        //var timer2=setInterval(function() { checkRates (value, limitRate, stopRate, duration); }, 10000);
        //var timer2=setInterval(function() { checkRates (value, limitRate, stopRate, duration); }, 10000);

//check order by rate	
        var myVar1;

        function startRates1(value) {
            myVar1 = setInterval(function () {
                checkOrderByRate(value);
            }, 10000);
        }

        function checkOrderByRate(value) {
            //var i=0;
            console.log('checkOrderByRate ' + Date());
            for (i = 0; i < $scope.currentTable.orders.length; i++) {

                if (value <= 0) {
                    $scope.action_cancel_order(i);
                    //	$scope.new_gritter_closeOrder();
                    $scope.checkByRate = 0;
                    console.log("cancel order - not correct data");
                    clearInterval(myVar1);
                }	//*/
                if ($scope.currentTable.orders[i].tradeLimitPrice == 2 && $scope.currentTable.orders[i].type == "Order by rate") {
                    //$scope.action_buy()value;
                    $scope.action_cancel_order(i);
                    $scope.checkByRate = 0;
                    //$scope.currentTable.orders[i].tradeLimitPrice=0;
                    console.log("Order by rate has done " + Date());
                    clearInterval(myVar1);
                    //myVar1=0;
                }
            }
        }

//check order by rate with take profit	without expiration
        var myVar2;

        function startRates2(value) {
            myVar2 = setInterval(function () {
                checkOrderByRateTakeProfit(value);
            }, 10000);
        }

        function checkOrderByRateTakeProfit(value) {

            console.log('checkOrderByRateTakeProfit ' + Date());

            for (i = 0; i < $scope.currentTable.orders.length; i++) {
                if (value <= 0) {

                    $scope.action_cancel_order(i);
                    //	$scope.new_gritter_closeOrder();
                    $scope.checkByRateWithTime = 0;
                    console.log("cancel order - not correct data");
                    clearInterval(myVar2);
                }	//*/
                else if ($scope.currentTable.orders[i].tradeLimitPrice == 2 && $scope.currentTable.orders[i].type == "Order take profit") {
                    //$scope.action_buy()value;
                    $scope.action_cancel_order(i);
                    $scope.checkByRateWithTime = 0;
                    //$scope.currentTable.orders[i].tradeLimitPrice=0;
                    console.log("Order by rate with expiration has done");
                    clearInterval(myVar2);
                }
                else {
                    clearInterval(myVar2);
                    startRates3(value, duration2);

                }
            }
        }


//check order by rate with expiration	
        var myVar3;

        function startRates3(value, duration) {

//console.log('index3 '+index);		
            myVar3 = setInterval(function () {
                checkOrderByRateWithExpiration(value, duration);
            }, 10000);
        }

        function checkOrderByRateWithExpiration(value, duration3) {
            //var i=0;

            duration3 = duration3 - 10;
            console.log('checkOrderByRateWithExpiration ' + duration3 + '  ' + Date());

            for (i = 0; i < $scope.currentTable.orders.length; i++) {
                if (value <= 0 || duration3 <= 0) {

                    $scope.action_cancel_order(i);
                    //	$scope.new_gritter_closeOrder();
                    $scope.checkByRateWithTime = 0;
                    console.log("cancel order - not correct data or expiration less than 0");
                    clearInterval(myVar3);
                }	//*/
                else if ($scope.currentTable.orders[i].tradeLimitPrice == 2 && $scope.currentTable.orders[i].type == "Order by rate with expiration") {
                    //$scope.action_buy()value;
                    $scope.action_cancel_order(i);
                    $scope.checkByRateWithTime = 0;
                    //$scope.currentTable.orders[i].tradeLimitPrice=0;
                    console.log("Order by rate with expiration has done");
                    clearInterval(myVar3);
                }
                else {
                    clearInterval(myVar3);
                    startRates3(value, duration3);

                }
            }
        }

        $scope.checkByRate = 0;
        $scope.checkByRateWithProfit = 0;
        $scope.checkByRateWithTime = 0;


//time order buy with combinations++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        $scope.order_buy = function (value, duration) {
            value = parseFloat(value);

            var address_target_action = $scope.currentTable.tableName + ".NewOrder";
            var user = {
                "sessionID": $cookies.sessionID, "tradeTypeFlag": 1,
                "currency": "EUR/USD", "volume": value
            };

//console.log('$scope.z1 '+$scope.indexTemp);

            var tradeId, tradePosition = 'BUY';
            /*var quantity=0;*/

            //if (!$scope.eb)
            //    alert("Pas de connection a l'eventBus");

//buy by rate(limit order) without expiration- 1
            if (document.getElementById("order2").checked == false && document.getElementById("order3").checked == false
                && document.getElementById("order4").checked == false && $scope.checkByRate == 0) {

                vertxEventBusService.send(address_target_action, user).then(function (reply) {

                    tradeId = reply.tradeID;
                    $scope.currentTable.orders.push({
                        "id": reply.tradeID,
                        "tradeVolume": reply.tradeVolume,
                        "tradeCurrency": reply.tradeCurrency,
                        "tradeLimitPrice": document.getElementById("box").value,
                        "tradeStopPrice": 'N/A',
                        "type": "Order by rate",
                        "time2": "no expiration"
                    });

                    $scope.newOrders = $scope.newOrders + 1;
                    $scope.newHistory = $scope.newHistory + 1;
                    $scope.addToGritterBar("BUY", reply.tradePrice, reply.tradeVolume, reply.tradeCurrency);
//call function to check rates		
                    $scope.checkByRate = $scope.checkByRate + 1;
                    startRates1(value);

                }).catch(function () {
                    $scope.errorFuncHolder.handler(address_target_action, user);
                });

            }//end limit order

            else if (document.getElementById("order2").checked == false && document.getElementById("order3").checked == false
                && document.getElementById("order4").checked == false && $scope.checkByRate == 1)
                alert('U have this type of order!');

//sell with stop loss - 2	 
            /*else if(document.getElementById("order6").checked==true) {
             $scope.eb.send(address_target_action, user, function (reply) {

             tradeId = reply.tradeID;
             $scope.currentTable.orders.push({"id" : reply.tradeID,
             "tradeVolume" :  reply.tradeVolume,
             "tradeCurrency" : reply.tradeCurrency,
             "tradeLimitPrice" : document.getElementById("box").value,
             "tradeStopPrice" : document.getElementById("box1").value,
             "type" : "Buy with stop loss",
             "time2" : "no expiration"
             });

             //call function to check rates
             checkRates(value, document.getElementById("box").value, document.getElementById("box1").value, 0);

             $scope.newOrders  = $scope.newOrders + 1;
             $scope.newHistory = $scope.newHistory + 1;
             $scope.addToGritterBar("BUY", reply.tradePrice, reply.tradeVolume, reply.tradeCurrency);

             });


             }//end buy with stop loss*/

//buy with take profit without expiration -2 
            if (document.getElementById("order7").checked == true && document.getElementById("order8").checked == false && $scope.checkByRateWithProfit == 0) {
                vertxEventBusService.send(address_target_action, user).then(function (reply) {

                    tradeId = reply.tradeID;
                    $scope.currentTable.orders.push({
                        "id": reply.tradeID,
                        "tradeVolume": reply.tradeVolume,
                        "tradeCurrency": reply.tradeCurrency,
                        "tradeLimitPrice": document.getElementById("slider1").value,
                        "tradeStopPrice": document.getElementById("slider2").value,
                        "type": "Order take profit",
                        "time2": "no expiration"
                    });
//call function to check rates	
                    //	checkRates(value, document.getElementById("slider1").value, document.getElementById("slider2").value, 0);
                    $scope.checkByRateWithProfit = $scope.checkByRateWithProfit + 1;
                    startRates2(value);

                    $scope.newOrders = $scope.newOrders + 1;
                    $scope.newHistory = $scope.newHistory + 1;
                    $scope.addToGritterBar("BUY", reply.tradePrice, reply.tradeVolume, reply.tradeCurrency);

                }).catch(function () {
                    $scope.errorFuncHolder.handler(address_target_action, user);
                });

            }//buy with take profit

//buy by rate(limit order) with expiration - 3
            if (document.getElementById("order4").checked == true && $scope.checkByRateWithTime == 0) {

                vertxEventBusService.send(address_target_action, user).then(function (reply) {

                    tradeId = reply.tradeID;
                    $scope.currentTable.orders.push({
                        "id": reply.tradeID,
                        "tradeVolume": reply.tradeVolume,
                        "tradeCurrency": reply.tradeCurrency,
                        "tradeLimitPrice": document.getElementById("box").value,
                        "tradeStopPrice": 'N/A',
                        "type": "Order by rate with expiration",
                        "time2": duration.time,
                        "sec": duration.sec
                    });
//console.log($scope.currentTable.orders)	
                    $scope.checkByRateWithTime = $scope.checkByRateWithTime + 1;
                    startRates3(value, duration.sec);

                    $scope.newOrders = $scope.newOrders + 1;
                    $scope.newHistory = $scope.newHistory + 1;
                    $scope.addToGritterBar("BUY", reply.tradePrice, reply.tradeVolume, reply.tradeCurrency);

                }).catch(function () {
                    $scope.errorFuncHolder.handler(address_target_action, user);
                });

            }//end buy by rate(limit order) with expiration - 3

//buy with take profit with expiration - 4
            if (document.getElementById("order8").checked == true && document.getElementById("order7").checked == true) {

                vertxEventBusService.send(address_target_action, user).then(function (reply) {

                    tradeId = reply.tradeID;
                    $scope.currentTable.orders.push({
                        "id": reply.tradeID,
                        "tradeVolume": reply.tradeVolume,
                        "tradeCurrency": reply.tradeCurrency,
                        "tradeLimitPrice": document.getElementById("slider1").value,
                        "tradeStopPrice": document.getElementById("slider2").value,
                        "type": "Order take profit with expiration",
                        "time2": duration.time
                    });

                    $scope.newOrders = $scope.newOrders + 1;
                    $scope.newHistory = $scope.newHistory + 1;
                    $scope.addToGritterBar("BUY", reply.tradePrice, reply.tradeVolume, reply.tradeCurrency);
//call function to check rates			
                    checkRates(value, document.getElementById("slider1").value, document.getElementById("slider2").value, duration.sec);
                    //duration.sec[
                }).catch(function () {
                    $scope.errorFuncHolder.handler(address_target_action, user);
                });


            }//end buy by rate(limit order) with duration

            /*	*/
            $scope.indexTemp = $scope.indexTemp + 1;

        }//------------------------------------------------end function buy by order----------------

//daration for orders
        $scope.durations = [{time: '60 sec ', sec: 60},
            {time: '30 min', sec: 1800},
            {time: '1 hour', sec: 3600},
            {time: '2 hours', sec: 7200},
            {time: '3 hours', sec: 10800},
            {time: '6 hours', sec: 21600},
            {time: '9 hours', sec: 32400},
            {time: '12 hours', sec: 43200},
            {time: '18 hours', sec: 64800},
            {time: '1 Day', sec: 86400},


            /*  {order: 'Conditional Order'},
             {order: 'Limit Order with duration'},
             {order: 'Stop Order with duration'},*/
        ];
        $scope.duration = $scope.durations[0];


//change ------------------------------------type's order		
//save changers in order 
        $scope.saveOrdersChange = function (item, index, value, newLimitRate, newStopRate, futureDate) {

            //$scope.bottomClose();

            $scope.limit = false;
            $scope.stop = false;
            $scope.new_date = false;

            if (document.getElementById("selectEdit").value == "") {
                console.log(document.getElementById("selectEdit").value);
                alert('Choice order type!');
            }
            else if (item.order == 'Limit Order') {
//close background
                $scope.closeBottom();
//new order			
                $scope.currentTable.orders[index].type = item.order;
//new volume			
                $scope.currentTable.orders[index].tradeVolume = value;
                $scope.currentTable.orders[index].tradeLimitPrice = newLimitRate;
                $scope.currentTable.orders[index].tradeStopPrice = 'N/A';
//add function for check all!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!						
            }
            else if (item.order == 'Stop Order') {

                $scope.closeBottom();
//new order			
                $scope.currentTable.orders[index].type = item.order;
//new volume			
                $scope.currentTable.orders[index].tradeVolume = value;
                $scope.currentTable.orders[index].tradeLimitPrice = 'N/A';
                $scope.currentTable.orders[index].tradeStopPrice = newStopRate;
//add function for check all!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!							
            }
            else if (item.order == 'Limit+Stop Order') {
                $scope.closeBottom();
                $scope.currentTable.orders[index].type = item.order;
                $scope.currentTable.orders[index].tradeVolume = value;
                $scope.currentTable.orders[index].tradeLimitPrice = newLimitRate;
                $scope.currentTable.orders[index].tradeStopPrice = newStopRate;

            }
            else if (item.order == 'Limit Order with duration') {

                //console.log('Future date '+futureDate);

                $scope.currentTable.orders[index].time2 = futureDate;


            }


            else {
                console.log("other");
            }
            //document.getElementById("selectEdit").selectedIndex =0;
            //console.log("2 "+document.getElementById("selectEdit").value);
        }

        $scope.limits2 = function (limitOrderEdit) {
            console.log(limitOrderEdit);

            if (limitOrderEdit > $scope.min && limitOrderEdit < $scope.max) {
                $scope.min = $scope.min;
                $scope.max = $scope.max;
            } else {
                $scope.min = limitOrderEdit * 0.95;
                $scope.max = limitOrderEdit * 1.05;
                document.getElementById("change_limit_rate").value = limitOrderEdit;
                //document.getElementById("change_limit_rate").value=2;
                console.log('zzzzzzz ' + document.getElementById("change_limit_rate").value);
            }
        }

//visible-invisible  edit order	panel
        $scope.orderEditPanel = false;

//call window to edit order	
        $scope.action_edit_order = function (index) {

            $scope.orderEditPanel = true;
            document.getElementById("change_limit_rate").value = $scope.currentTable.orders[index].tradePrice;

//console.log("1 "+document.getElementById("selectEdit").value);	
//output current data		
            $scope.current_type = $scope.currentTable.orders[index].type;
            $scope.current_amount = $scope.currentTable.orders[index].tradeVolume;//---+++
            $scope.formData.limit_rate = $scope.currentTable.orders[index].tradePrice;
//output data for limit rate		
            $scope.currentLimitRate = $scope.currentTable.orders[index].tradeLimitPrice;
//output data for stop rate
            $scope.currentStopRate = $scope.currentTable.orders[index].tradeStopPrice;
//add data :  date expiration-----------------------------------------------------------

            //document.getElementById("selectEdit").value="-1";
//console.log("2 "+document.getElementById("selectEdit").value);

            $scope.cancelOrder = index;
            document.getElementById("selectEdit").selectedIndex = 0;
            $scope.change_order_type(-1, $scope.current_type);

        }
//end window edit order	


        $scope.formData = {};

//list order's type	
        $scope.orders = [{order: 'Order by rate'},
            {order: 'Order stop loss'},
            {order: 'Order take profit'},
            /*  {order: 'Conditional Order'},
             {order: 'Limit Order with duration'},
             {order: 'Stop Order with duration'},*/
        ];


//show order' depends orders in window changes  CHECK SECOND PARAMETER!!!!!!!!!!!!!!!!!!!!???????????????
        $scope.change_order_type = function (item, second_parm) {

            if (item.order == 'Order by rate' || second_parm == 'Order by rate') {
                $scope.limit = true;
                $scope.stop = false;
                $scope.new_date = false;
                //console.log('limit');
            }
            else if (item.order == 'Order stop loss' || second_parm == 'Order stop loss') {
                $scope.limit = false;
                $scope.stop = true;
                $scope.new_date = false;
            }
            else if (item.order == 'Order take profit' || second_parm == 'Order take profit') {
                $scope.limit = true;
                $scope.stop = true;
                $scope.new_date = false;
            }
            /*	else if(item.order=='Limit Order with duration' || second_parm=='LO with duration'){
             $scope.limit=true;
             $scope.stop=false;
             $scope.new_date=true;
             }
             else if(item.order=='Stop Order with duration' || second_parm=='SO with duration'){
             $scope.limit=false;
             $scope.stop=true;
             $scope.new_date=true;
             }
             else if	(item.order=='Conditional Order' || second_parm=='Conditional Order')
             alert('Conditional Order');

             /*	else{
             alert('Enter type of order!');
             $scope.limit=false;
             $scope.stop=false;
             $scope.new_date=false;

             }
             //alert('Enter type of order!');

             //$scope.OOO=	item.order;
             //*/
        }


//cancel order
        $scope.action_cancel_order = function (index) {


//flag for cancel??????????????????????????????????????????????????????????????????????????????????????????????????????		
            var address_target_action = $scope.currentTable.tableName + ".NewTrade";
            var user = {
                "sessionID": $cookies.SessionID, "tradeTypeFlag": 5,
                "tradeID": $scope.currentTable.orders[index].tradeID
            };

            vertxEventBusService.send(address_target_action, user).then(function (reply) {
                //$scope.$apply(function () {
                $scope.currentTable.orders.splice(index, 1);

                //});

            }).catch(function () {
                $scope.errorFuncHolder.handler(address_target_action, user);
            });

            $scope.new_gritter_close();
            $scope.newHistory = $scope.newHistory + 1;
            $scope.newOrders = $scope.newOrders - 1;
//console.log("number orders is "+$scope.currentTable.orders.length);

        }

//cancel all orders
        $scope.clearOrders = function () {
            $scope.new_gritter_closeOrders();
            $scope.newHistory = $scope.newHistory + $scope.currentTable.orders.length;
            $scope.currentTable.orders.splice(0, $scope.currentTable.orders.length);
            $scope.newOrders = 0;
        }

//close all positions
        $scope.closeAllPositions = function () {

            $scope.pick_sell_value = 0;
            $scope.pick_buy_value = 0;

            var address_target_action = $scope.currentTable.tableName + ".NewTrade";

            for (var i = $scope.currentTable.positions.length; i--;) {

                var user = {
                    "sessionID": $cookies.sessionID, "tradeTypeFlag": 3,
                    "tradeID": $scope.currentTable.positions[i].tradeID
                };

                vertxEventBusService.send(address_target_action, user).then(function (reply) {
                    //console.log(JSON.stringify(user));
                    //console.log(JSON.stringify(reply));
                    //$scope.$apply(function () {
                    $scope.currentTable.positions.splice(i, 1);
                    //});
                }).catch(function () {
                    $scope.errorFuncHolder.handler(address_target_action, user);
                });

                $scope.newHistory = $scope.newHistory + 1;
            }
            $scope.new_gritter_closeAll();
        }

//show button close all(positions)
        $scope.closePositions = true;
        //$scope.closeHistory=true;
//visible-invisible buttons CLOSE ALL - CLEAR HISTORY - CLEAR ORDERS - new_floor.html	
        $scope.change_buttons = function () {

            if ($scope.floor_action_left == 'positions') {
                $scope.closePositions = true;
                $scope.closeHistory = false;
                $scope.closeOrders = false;
                $scope.panel_SLO = false;
            }
            else if ($scope.floor_action_left == 'history') {
                $scope.closePositions = false;
                $scope.closeHistory = true;
                $scope.closeOrders = false;
                $scope.panel_SLO = false;
            }
            else {
                $scope.closePositions = false;
                $scope.closeHistory = false;
                $scope.closeOrders = true;
                $scope.panel_SLO = false;
            }//*/
        }


//function for change currency pairs
        /*$scope.change_currency_PH=function(currency){
         $scope.$broadcast("myEvent", {currency:currency});
         $scope.$broadcast("myEvent2", {currency:currency});
         }//*/


//visible-invisible date - floor.html	
        $scope.no_data_time = false;
        $scope.no_data_time2 = false;
//not visible panel limit+stop order
        $scope.panel_SLO = false;

        //show combination order's - floor.html
        $scope.show_order_type = function () {

            $scope.$broadcast("myEvent3", realCurrentPrice());
            if (document.getElementById("order2").checked == true) {
                $scope.panel_SLO = true;
                $scope.visibleOrderPanel = false;
                document.getElementById("order6").setAttribute('checked', "true");
                document.getElementById("order6").style.visibility = "visible";
                document.getElementById("order7").style.visibility = "hidden";
                document.getElementById("buttonOrderBuy").disabled = true;

                //console.log("1");
            }

            if (document.getElementById("order6").checked == false && document.getElementById("order2").checked == true) {
                $scope.panel_SLO = false;
                $scope.visibleOrderPanel = true;
                document.getElementById("order6").checked = true;
                document.getElementById("order6").removeAttribute('checked');
                document.getElementById("order7").style.visibility = "visible";
                document.getElementById("order2").checked = false;
                document.getElementById("order2").setAttribute("checked", "false");
                document.getElementById("buttonOrderBuy").disabled = false;

                //console.log("2");

            }//*/

            if (document.getElementById("order3").checked == true) {
                $scope.panel_SLO = true;
                $scope.visibleOrderPanel = false;
                document.getElementById("order7").setAttribute('checked', "true");
                document.getElementById("order7").style.visibility = "visible";
                document.getElementById("order6").style.visibility = "hidden";
                document.getElementById("buttonOrderSell").disabled = true;

                //console.log("3");
            }

            if (document.getElementById("order7").checked == false && document.getElementById("order3").checked == true) {

                $scope.panel_SLO = false;
                $scope.visibleOrderPanel = true;
                document.getElementById("order3").checked = false;
                document.getElementById("order3").setAttribute("checked", "false");
                document.getElementById("order7").checked = true;
                document.getElementById("order7").setAttribute("checked", "false");
                document.getElementById("buttonOrderSell").disabled = false;
                document.getElementById("order6").style.visibility = "visible";

                //console.log("4");

            }//*/

            if (document.getElementById("order4").checked == true) {

                $scope.no_data_time = true;
            }
            else {

                $scope.no_data_time = false;
            }
            if (document.getElementById("order8").checked == true)

                $scope.no_data_time2 = true;

            else

                $scope.no_data_time2 = false;

        }//end show_order_type

        $scope.formData = {};

        function realCurrentPrice() {
            var priceSeries = chart.series[0],
                priceData = priceSeries.yData,
                currentPrice = (priceData[priceData.length - 1][3]).toFixed(5);
            $scope.currentPrice = currentPrice;
//5% is difference from current rate
            $scope.min = ($scope.currentPrice - ($scope.currentPrice * 0.05));
            $scope.min2 = $scope.min;
            $scope.max = ($scope.min + ($scope.currentPrice * 0.1));
            $scope.max2 = $scope.max;
            return currentPrice;
        }


        $scope.visibleFloorActionPlay = true;
        $scope.visibleOrderPanel = false;
//close-open panel order	
        $scope.show_panel_order = function () {
            $scope.visibleFloorActionPlay = false;
            $scope.visibleOrderPanel = true;
        }
        $scope.hide_panel_order = function () {
            $scope.visibleFloorActionPlay = true;
            $scope.visibleOrderPanel = false;
            $scope.panel_SLO = false;

        }

//*/


//clear all history
        $scope.clearHistory = function () {
            $scope.currentTable.history.splice(0, $scope.currentTable.history.length);

            console.log('clear ' + $scope.currentTable.history.length);
            $scope.newHistory = 0;
        }

//--------------------------------------------------------------------------------------VVVVV/////////////////	
//--------------------------------------------------------------------------------------///
        $scope.removePositionLine = function (tradeId) {
            chart.yAxis[0].removePlotLine('positionLine-' + tradeId);

            var positionPoints = chart.series[1].data;
            for (var i = 0; i < positionPoints.length; i++) {

                if (positionPoints[i].name == 'positionLine-' + tradeId) {
                    var x = positionPoints[i].x;
                    var y = positionPoints[i].y;
                    chart.series[1].data[i].remove();
                    chart.series[1].addPoint({name: 'positionLine-' + tradeId, color: '#FFFFFF', x: x, y: y});
                }
            }
            positionPoints = chart.series[2].data;
            for (var i = 0; i < positionPoints.length; i++) {
                if (positionPoints[i].name == 'positionLine-' + tradeId) {
                    var x = positionPoints[i].x;
                    var y = positionPoints[i].y;
                    chart.series[2].data[i].remove();
                    chart.series[2].addPoint({name: 'positionLine-' + tradeId, color: '#FFFFFF', x: x, y: y});
                }
            }
        }

        $scope.clearChartUserData = function () {
            var plotLineArrayLength;
            var plotLineId;

            plotLineArrayLength = chart.xAxis[0].plotLinesAndBands.length - 1;
            for (i = plotLineArrayLength; i >= 0; i--) {
                plotLineId = chart.xAxis[0].plotLinesAndBands[i].id;
                chart.xAxis[0].removePlotLine(plotLineId);
            }

            plotLineArrayLength = chart.yAxis[0].plotLinesAndBands.length - 1;
            for (i = plotLineArrayLength; i >= 0; i--) {
                plotLineId = chart.yAxis[0].plotLinesAndBands[i].id;
                chart.yAxis[0].removePlotLine(plotLineId);
            }
            chart.series[1].setData([]);
            chart.series[2].setData([]);
            console.log('User`s data cleared from Chart');
        }

        $scope.eventBusConnected = false;
        $scope.pingHandler = function (reply) {
            if (reply.status == "ok") {
                if ($scope.eventBusConnected == false) {
                    console.info('$scope.eventBusConnected is false.');
                    $scope.eventBusConnected = true;
                    $scope.openConn();

                    vertxEventBusService.unregisterHandler('ping', $scope.pingHandler);
                }
            }
        }
        vertxEventBusService.on('ping', $scope.pingHandler);

        $scope.openConn = function () {
            console.info('Inside openConn');
            console.info("$cookies.sessionID " + $cookies.sessionID);

            $scope.loadBar_data();
            $scope.init_lobby();

            if (!$cookies.sessionID) {
                console.info("$cookies.sessionID is undefined.");
                //$scope.$apply(function () {
                $scope.Auth = false;
                //});
                //$cookies = [];
            }
            else {
                var resumeReq =
                {
                    'action': 'resume',
                    'sessionID': $cookies.sessionID
                };
                vertxEventBusService.send('Authenticator', resumeReq).then(function (reply) {
                    if (reply.status == 'ok') {
                        $scope.loadTradestarExperience(reply.username);
                    }
                    else {
                        //$scope.$apply(function () {
                        $scope.Auth = false;
                        //});
                    }
                }).catch(function () {
                    $scope.errorFuncHolder('Authenticator');
                });
            }


            /*
             if (!$scope.eb) {
             //$scope.eb = new vertx.EventBus("http://192.168.1.106:8080/eventbus");
             //  $scope.eb = new vertx.EventBus("http://" + window.location.host + "/eventbus");
             $scope.eb = new vertx.EventBus("/eventbus");
             $scope.eb.onopen = function () {
             $scope.loadBar_data();
             $scope.init_lobby();

             if (!$cookies.sessionID) {
             $scope.$apply(function () {
             $scope.Auth = false;
             });
             //$cookies = [];
             }
             else {
             var resumeReq =
             {
             'action': 'resume',
             'sessionID': $cookies.sessionID
             };
             $scope.eb.send('Authenticator', resumeReq, function (reply) {
             if (reply.status == 'ok') {
             $scope.loadTradestarExperience();
             }
             else {
             $scope.$apply(function () {
             $scope.Auth = false;
             });
             }
             });
             }
             }
             }
             */
        }

        

        $scope.getPlayerInfo = function (sessionID, username) {
            var infoRequest = {"sessionID": $cookies.sessionID, username: username};
            console.log("sessionID");
            console.log($cookies.sessionID);

            vertxEventBusService.send('PlayerInfo', infoRequest).then(function (reply) {
                console.log("PlayerInfo response : " + JSON.stringify(reply));
                if (reply.status == 'ok') {
                    //$scope.$apply(function () {
                    $scope.playerInfo.username = reply.username;
                    $scope.playerInfo.flagUrl = reply.flagUrl;
                    $scope.playerInfo.imgUrl = reply.imgUrl;
                    $scope.playerInfo.level = reply.level;
                    $scope.playerInfo.streak = reply.streak;
                    $scope.playerInfo.tables = reply.tables ? reply.tables : [];
                    $scope.playerInfo.balance = reply.balance;
                    $scope.playerInfo.email = reply.email;
                    //});
                } else {

                }
            }).catch(function () {
                $scope.errorFuncHolder.handler('PlayerInfo', infoRequest);
            });
        }

        //NEW
        $scope.loadTradestarExperience = function (username) {

            //$scope.$apply(function () {
            $scope.Auth = true;
            $scope.partials.push({
                "url": 'partials/home2.html',
                "conditions": "(!currentPage || currentPage=='/') && Auth"
            });
            $scope.partials.push({"url": 'partials/lobbyManager.html', "conditions": "currentPage=='lobby'"});
            $scope.partials.push({"url": 'partials/new_floor.html', "conditions": "currentPage=='floor'"});
            //});





            $scope.getPlayerInfo($cookies.sessionID, username);

            $scope.loadLeaderBoard();

            $scope.getPlayerXP(username);

            $scope.loadOnlinePlayers($cookies.sessionID, username);

            var profileUpdates = $cookies.sessionID + ".ProfileUpdates";
            vertxEventBusService.on(profileUpdates, function (reply) {
                //$scope.$apply(function () {
                if (reply.balance) {
                    $scope.playerInfo.balance = reply.balance;
                }
                if (reply.table) {

                    if (reply.function == 'add') {
                        $scope.playerInfo.tables.push({"tableName": reply.table});

                        if ($scope.playerInfo.tables.length > 1) {
                            $('.swipers').addClass('animated fadeIn');
                        }

                    }
                    if (reply.function == 'remove') {
                        for (var i = 0; i < $scope.playerInfo.tables.length; i++) {
                            if ($scope.playerInfo.tables[i].tableName == reply.table) {
                                $scope.playerInfo.tables.splice(i, 1);
                            }
                        }
                    }
                }
                if (reply.flagUrl) {
                    $scope.playerInfo.flagUrl = reply.flagUrl;
                }
                if (reply.imgUrl) {
                    $scope.playerInfo.imgUrl = reply.imgUrl;
                }
                if (reply.level) {
                    $scope.playerInfo.level = reply.level;
                }
                if (reply.streak) {
                    $scope.playerInfo.streak = reply.streak;
                }
                if (reply.numStars) {
                    $scope.playerInfo.numStars = reply.numStars;
                }
                //});
            });
        }





        $scope.update_playerFrame = function () {
            var addrReq = $cookies.currentTable + ".FreeVolume";
            vertxEventBusService.send(addrReq, {}).then(function (reply) {
                for (var i = 0; i < reply.length; i++) {
                    //$scope.$apply(function () {
                    $scope.players_list[i].freeVolume = reply[i].freeVolume;
                    //});
                }
            });
        }

        $scope.realTimeUpdate = function () {
            $scope.update_playerFrame();
            var addrLeaderBoard = $cookies.currentTable + ".LeaderBoard";
            vertxEventBusService.send(addrLeaderBoard, {}).then(function (reply) {
                //$scope.$apply(function () {
                $scope.players_board = [];
                for (var i = 0; i < reply.length; i++) {
                    $scope.players_board.push({
                        "userName": reply[i].userName,
                        "potentialVolume": reply[i].totalVolume
                    })
                }
                //});
            });
            //MADNESS
            var addresse_timer = $cookies.currentTable + ".GameTimer";
            vertxEventBusService.send(addresse_timer, {}).then(function (reply) {
            });


            var user = {
                "maxPlayers": 4, "totalPlayers": 0, "gameType": "Forty Four",
                "gameLengthInMillis": 20000
            };
            var log = [];
            //MADNESS
            vertxEventBusService.send('RequestCurrency', user).then(function (reply) {
                //$scope.$apply(function () {
                $scope.var = reply['EUR/USD'];
                //});
            });

            if ($cookies.playerID) {
                var address_target_trade = $cookies.currentTable + ".RunningTrades";
                var user_trade = {"sessionID": $cookies.playerID};
                vertxEventBusService.send(address_target_trade, user_trade).then(function (reply) {

                    for (var i = 0; i < reply.length; i++) {
                        $scope.tab_position[i].gain = reply[i].tradeGain;
                        $scope.tab_position[i].tradeCurrency = reply[i].tradeCurrency
                        $scope.tab_position[i].tradeVolume = reply[i].tradeVolume;
                        $scope.tab_position[i].tradePrice = reply[i].tradePrice;
                    }

                });
            }
        }

        $scope.toggleUpdate = function(){
            if($scope.showUpdateComplete)
                $scope.showUpdateComplete = false;
        }

        $scope.selectedTermAndCondition = {
            item1: true,
            item2: false
        };
        
        $scope.update_profile = function (username, email) {

            if(!username)
                    username = "";

                 if(!email)
                    email = "";
            var updates = {
                "action": "update",
                "oldUser" : $scope.playerInfo.username,
                "username": username,
                "email": email,
                "oldMail": $scope.playerInfo.email
            }

            
            if($scope.selectedTermAndCondition.item1)
            {
                vertxEventBusService.send('Authenticator', updates).then(function (reply) {

                   

                  
                $scope.updateStatus.requestChange = reply.message;
                      

                if (reply.status == 'ok') {
                   // $scope.showUpdateComplete = true;
                    
                    //$cookies.sessionID = reply.sessionID;//TODO: regarder si la session a ete change
                    //$scope.loadTradestarExperience(username);
                    // console.log($scope.loadTradestarExperience(username));
                    
                       $scope.playerInfo.username = reply.username;
                       $scope.playerInfo.email = reply.email;
                    
                 console.log("$cookies.sessionID, " + $cookies.sessionID);
                    
                       $("#pop_up").modal("show");
                    
                      //$scope.loadOnlinePlayers($cookies.sessionID, $scope.playerInfo.username);


                   // console.info("Update successful !" + $scope.showUpdateComplete );
                }
                else{
                     $("#pop_up").modal("show");
                }
                   
                   //alert("error: " + reply.message);
                //NEW
                /*
                 $scope.$apply(function () {
                 $cookies.playerID = reply.sessionID;
                 $cookies.playerName = reply.userName;
                 $cookies.playerLevel = reply.level;
                 $cookies.playerImage = reply.userImg;
                 $cookies.playerBalance = reply.balance;
                 $cookies.playerStreak = reply.streak;

                 $scope.Auth = {
                 "id": reply.sessionID,
                 "userName": reply.userName,
                 "level": reply.level,
                 "image": reply.userImg,
                 "balance": reply.balance,
                 "streak": reply.streak
                 }

                 var addrNewBalance = reply.sessionID + ".ProfileUpdates";
                 $scope.eb.registerHandler(addrNewBalance, function (msg) {
                 $scope.$apply(function () {
                 if (msg.balance) {
                 $scope.Auth.balance = msg.balance;
                 $cookies.playerBalance = msg.balance;
                 console.log("UPDATE BALANCE DONE!");
                 }
                 });
                 });


                 //$scope.changePage('lobby');
                 });
                 */
                    
                   
            }).catch(function () {
                $scope.errorFuncHolder.handler('Authenticator', updates);
            });
            }
            
        }
        
        $scope.update_image = function() {
            var dataImage = $('#update_image').attr('src');
           
        
            var updates = {
                "action": "updateImage",
                "username" : $scope.playerInfo.username,
                "dataImage" : dataImage,
                "sessionID":$cookies.sessionID 
            }
        
        vertxEventBusService.send('Authenticator', updates).then(function (reply) {
                
                $scope.updateStatus.requestChange = reply.message;

                if (reply.status == 'ok') {
                   
                    document.getElementById("update_image").src = "../../assets/images/home/newUserSmall.png";
                     
                    
                    $('.profile_img').attr('src',dataImage);
                   
                    $("#pop_up").modal("show");
                    
                }
                else
                   
                    $("#pop_up").modal("show");
       
        });
     };
        
       
       
       

        $scope.selectedPasswordCheckBox = {
            item1: true,
            item2: false
        };

        $scope.change_password = function (oldpassword, newpassword) {

             
            
            var updates = {
                "action": "change_password",
                "user" : $scope.playerInfo.username,
                "oldpassword": oldpassword,
                "newpassword": newpassword
            }

            if($scope.selectedPasswordCheckBox.item1)
            {
                vertxEventBusService.send('Authenticator', updates).then(function (reply) {
                
                $scope.updateStatus.requestChange = reply.message;

                if (reply.status == 'ok') {
                    console.info("Update successful !");
                  
                    
                  $("#pop_up").modal("show");
                    
                }
                else
                    //alert("error: " + reply.message);
                    $("#pop_up").modal("show");
                
                }).catch(function () {
                    $scope.errorFuncHolder.handler('Authenticator', updates);
                });
            }
           

           
            
            
        }

        $scope.login_submit = function (username, password) {
            // alert('login_submit');
            var arg_log = {
                "action": "authenticate",//NEW
                "username": username,
                "password": password
            }
            //NEW
            vertxEventBusService.send('Authenticator', arg_log).then(function (reply) {
                if (reply.status == 'ok') {
                    //$scope.$apply(function () {
                    $cookies.sessionID = reply.sessionID;
                    $scope.loadTradestarExperience(username);
                    //});

//place to function Registering!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 					


                    /*
                     $.gritter.add({
                     // (string | mandatory) the heading of the notification
                     title: '<span style=\"color: #ff0000;margin-left:3em;\">Warning</span>',
                     text: 'Wrong Login or password!'
                     });
                     $('.gritter_loading1').addClass('ng-hide');
                     return;
                     */
                }
                else
                    alert("error: " + reply.message);
                //NEW
                /*
                 $scope.$apply(function () {
                 $cookies.playerID = reply.sessionID;
                 $cookies.playerName = reply.userName;
                 $cookies.playerLevel = reply.level;
                 $cookies.playerImage = reply.userImg;
                 $cookies.playerBalance = reply.balance;
                 $cookies.playerStreak = reply.streak;

                 $scope.Auth = {
                 "id": reply.sessionID,
                 "userName": reply.userName,
                 "level": reply.level,
                 "image": reply.userImg,
                 "balance": reply.balance,
                 "streak": reply.streak
                 }

                 var addrNewBalance = reply.sessionID + ".ProfileUpdates";
                 $scope.eb.registerHandler(addrNewBalance, function (msg) {
                 $scope.$apply(function () {
                 if (msg.balance) {
                 $scope.Auth.balance = msg.balance;
                 $cookies.playerBalance = msg.balance;
                 console.log("UPDATE BALANCE DONE!");
                 }
                 });
                 });


                 //$scope.changePage('lobby');
                 });
                 */
            }).catch(function () {
                $scope.errorFuncHolder.handler('Authenticator', arg_log);
            });
        }

        


        //NEW
        $scope.sortParams = {
            "gameType": 'any',
            "buyIn": -1,
            "totalGameTime": -1
        };

        $scope.sortTables = function () {
            $scope.andrew_tables = [];

            $scope.sortParams.buyIn = parseFloat($scope.sortParams.buyIn);
            $scope.sortParams.totalGameTime = parseFloat($scope.sortParams.totalGameTime);


            vertxEventBusService.send('TableList', $scope.sortParams, {timeout: 3000}).then(function (reply) {
                //$scope.$apply(function () {
                console.info("Reply for TableList is " + JSON.stringify(reply));
                $scope.andrew_tables = reply;
                //});
            }).catch(function () {
                console.error("No response within 3 seconds for TableList");
            });

        }
        //NEW
        $scope.getTableIndex = function (tableName) {
            for (var i = 0; i < $scope.andrew_tables.length; i++) {
                if ($scope.andrew_tables[i].tableName == tableName)
                    return i;
            }
            return null;
        }

        $scope.init_lobby = function () {

            $scope.sortTables();

            vertxEventBusService.on("IncomingTables", function (msg) {
                //$scope.$apply(function () {


                console.log(JSON.stringify(msg));

                if ($scope.sortParams.gameType == 'any' || msg.gameType == $scope.sortParams.buyIn.gameType) {
                    if ($scope.sortParams.buyIn == -1 || $scope.sortParams.buyIn == msg.buyIn) {
                        if ($scope.sortParams.totalGameTime == -1 || $scope.sortParams.totalGameTime == msg.totalGameTime) {

                            if ($scope.getTableIndex(msg.tableName) != null) {
                                $scope.andrew_tables[$scope.getTableIndex(msg.tableName)] = msg;
                            }
                            else {
                                $scope.andrew_tables.push(msg);
                            }


                        }
                    }
                }

                //});
            });

        }

        $scope.create_table = function (createTable_params) {
            if (!createTable_params.totalGameTime) createTable_params.totalGameTime = 0;


            createTable_params.totalGameTime = parseFloat(
                createTable_params.totalGameTime);

            createTable_params.buyIn = parseFloat(
                createTable_params.buyIn);

            var arg_create = {
                "maxPlayers": createTable_params.maxPlayers,
                "buyIn": createTable_params.buyIn,
                "private": false,
                "tradeLimit": 0,
                "instruments": [
                    {"instrument": "EUR/USD"}
                ],
                "totalGameTime": createTable_params.totalGameTime,
                "roundGameTime": 0,
                "sessionID": $cookies.sessionID,
                "gameType": createTable_params.gameType,
                "hitAndRunAmount": 0
            }
            //NEW
            vertxEventBusService.send('CreateTable', arg_create).then(function (reply) {

                if (reply.status) {

                    $('#floorOverlay').addClass('animated bounceOutLeft');
                    $('#createGameModalOn').addClass('animated bounceOutRight');

                    $('#createGameModalOn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (event) {
                        $('#floorOverlay').removeClass('animated bounceOutLeft');
                        $('#createGameModalOn').removeClass('animated bounceOutRight');
                        //$scope.$apply(function () {
                        $scope.floorOverlay = false;
                        $scope.createGameModalOn = false;
                        $scope.animateFadeFloorIn(reply.tableName);
                        //});

                    });


                    //NEW
                    //$scope.update_balance(reply.tableName, $cookies.playerName);
                    //$cookies.currentTable = reply.tableName;

                    /*

                     $scope.playerInfo.currentTable = reply.tableName;
                     $scope.playerMax = [];
                     for (var i = 0; i < arg_create.maxPlayers; i++) {
                     $scope.playerMax.push("new players " + i);
                     }

                     $scope.players_board.push({
                     "userName": $cookies.playerName,
                     "potentialVolume": 1000000
                     });

                     $scope.left_downInfo.top = (59 - ($scope.players_board.length * 1.25)) + "vh";
                     console.log("NEW LEADERBOARD SIZE:" + (59 - ($scope.players_board.length * 1.25)) + "vh");

                     $scope.getTableInfos(reply.tableName);

                     $scope.startGame(reply.tableName);
                     var addrNewPlayer = reply.tableName + ".NewPlayer";
                     $scope.eb.registerHandler(addrNewPlayer, function (msg) {
                     $scope.$apply(function () {
                     console.log("NEW PLAYER PUSHING");
                     $scope.players_board.push({
                     "userName": msg.userName,
                     "potentialVolume": 1000000
                     });

                     $scope.players_list.push({
                     "userName": msg.userName,
                     "flagUrl": msg.flagUrl,
                     "imgUrl": msg.imgUrl,
                     "level": Math.floor(msg.level),
                     "freeVolume": 1000000
                     });

                     $scope.left_downInfo.top = (59 - ($scope.players_board.length * 1.25)) + "vh";
                     console.log("NEW LEADERBOARD SIZE:" + (59 - ($scope.players_board.length * 1.25)) + "vh");
                     });
                     });

                     $scope.changePage('floor');
                     */
                }
                else {
                    alert("Vous n'avez pas pu creer la table!");
                    var addrReqStart = reply.tableName + ".GameStart";
                    //$scope.eb.unregisterHandler(addrReqStart, gameStartHandler);
                }
            }).catch(function () {
                console.error("No response within 10 seconds for CreateTable " + JSON.stringify(arg_create));
            });
        }
        //NEW
        $scope.currentTable = {
            "tableName": "",
            "gameType": "",
            "totalTime": 0,
            "maxPlayers": 0,
            "playerList": [],
            "leaderBoard": [],
            "chat": [],
            "history": [],
            "positions": [],
            "orders": [],
            "endResults": [],
            "gritter": []
        }
        //NEW
        $scope.myRow = function (username) {
            if ($scope.playerInfo.username == username)
                return true;
            return false;
        }
        //NEW
        $scope.clearCurrentTable = function () {
            $scope.currentTable = {
                "tableName": "",
                "gameType": "",
                "totalTime": 0,
                "maxPlayers": 0,
                "playerList": [],
                "leaderBoard": [],
                "chat": [],
                "history": [],
                "orders": [],
                "positions": [],
                "endResults": [],
                "gritter": []
            }
        }
        //NEW
        $scope.viewProfile = function (position) {
            if ($scope.currentTable.playerList[position].username == $scope.playerInfo.username) {
                var exitRequest = {
                    "sessionID": $cookies.sessionID,
                    "tableName": $scope.currentTable.tableName,
                };
                //MADNESS
                vertxEventBusService.send('ExitTable', exitRequest).then(function (reply) {
                    //alert(JSON.stringify(reply));
                    if (reply.status) {

                    }
                }).catch(function () {
                    console.error("No response within 10 seconds for ExitTable, " + JSON.stringify(exitRequest));
                });
            }
            else {
                alert('viewing profile');
            }
        }
        //NEW
        $scope.joinGame = function (position) {
            //NEW
            var joinRequest = {
                "sessionID": $cookies.sessionID,
                "tableName": $scope.currentTable.tableName,
                "order": position
            };

            console.log(JSON.stringify(joinRequest));
            //NEW
            vertxEventBusService.send('JoinTable', joinRequest).then(function (reply) {
                console.info("JoinTable response " + JSON.stringify(reply));
                if (reply.status) {
                    //$scope.$apply(function () {
                    $scope.myTable = true;
                    //});
                }
            }).catch(function () {
                console.error("No response within 10 seconds for JoinTable, " + JSON.stringify(joinRequest));
            });
        }

        //NEW
        var newPlayer = function (reply) {
            $('#player' + reply.order).addClass('animated flipInX');
            if (reply.function == 'add') {
                $scope.$apply(function () {
                $scope.currentTable.playerList[reply.order] = {
                    "username": reply.username,
                    "flagUrl": reply.flagUrl,
                    "imgUrl": reply.imgUrl,
                    "level": Math.floor(reply.level),
                    "freeVolume": 1000000
                };
                });
            }
            if (reply.function == 'remove') {
                //$scope.$apply(function () {
                $scope.currentTable.playerList[reply.order] = null;
                //});
            }
            //NEW
            $('#leaderBoard').addClass('animated fadeOutUp');
            $('#leaderBoard').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (event) {
                console.log(event);
                $('#leaderBoard').removeClass('animated fadeOutUp');
                $('#player' + reply.order).removeClass('animated flipInX');

                if (reply.function == 'add') {
                    //$scope.$apply(function () {
                    $scope.currentTable.leaderBoard.push({
                        "username": reply.username,
                        "totalVolume": 1000000
                    });
                    //});
                }
                if (reply.function == 'remove') {

                    for (var i = 0; i < $scope.currentTable.leaderBoard.length; i++) {
                        if ($scope.currentTable.leaderBoard[i]) {
                            if ($scope.currentTable.leaderBoard[i].username == reply.username) {
                                $scope.$apply(function () {
                                    $scope.currentTable.leaderBoard.splice(i, 1);
                                });
                            }
                        }
                    }
                }
                $('#leaderBoard').addClass('animated fadeInDown');
                $('#leaderBoard').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (event) {
                    console.log(event);
                    $('#leaderBoard').removeClass('animated fadeInDown');
                });
            });


        }

        var mainTimer = function (reply) {
            $('#floorTimer').data("timer", (reply.timeRemaining) / 1000).TimeCircles()
                .restart();

            if (!$scope.floorTimerShow) {
                $scope.floorTimerShow = true;
                $('#floorTimer').addClass('animated fadeInDown');
            }
        }

        var tableChat = function (reply) {
            console.log(reply);
            //$scope.$apply(function () {
            $scope.currentTable.chat.push(reply);
            $scope.unreadMessages = $scope.unreadMessages + 1;
            //});
            var myDiv = document.getElementById("chat_message_box");
            myDiv.scrollTop = myDiv.scrollHeight;
        }

        var history = function (reply) {
//        console.log(reply);
            //$scope.$apply(function () {
            $scope.currentTable.history.push(reply);
            //});

        }

        var orders = function (reply) {
            console.log('line 2667 xren ' + reply);

            //$scope.$apply(function () {
            $scope.currentTable.orders = [];
            //});

            for (var i = 0; i < reply.length; i++) {
                //$scope.$apply(function () {
                $scope.currentTable.orders.push(reply[i]);
                //});
            }
        }


        var positions = function (reply) {
//    console.log(reply);

            //$scope.$apply(function () {
            $scope.currentTable.positions = [];
            //});

            for (var i = 0; i < reply.length; i++) {
                //$scope.$apply(function () {
                $scope.currentTable.positions.push(reply[i]);
                //});
            }
        }

        var volumes = function (reply) {
            console.log('line 2700 ' + JSON.stringify(reply) + ' ' + Date());
            //$scope.$apply(function () {
            $scope.currentTable.playerList[reply.order].freeVolume = reply.freeVolume;
            //});
            if (reply.username == $scope.playerInfo.username) {
                $scope.update_slider(reply.freeVolume);
            }
        }

        var leaderBoard = function (reply) {
//        console.log(JSON.stringify(reply));
            //$scope.$apply(function () {
            $scope.currentTable.leaderBoard = reply;
            //});
        }

        $scope.getNextTable = function () {
            for (var i = 0; i < $scope.playerInfo.tables.length; i++) {
                if ($scope.playerInfo.tables[i].tableName == $scope.currentTable.tableName) {
                    if (!$scope.playerInfo.tables[i + 1]) {
                        return $scope.playerInfo.tables[0].tableName;
                    }
                    else
                        return $scope.playerInfo.tables[i + 1].tableName;
                }
            }
        }

        $scope.getPrevTable = function () {
            for (var i = 0; i < $scope.playerInfo.tables.length; i++) {
                if ($scope.playerInfo.tables[i].tableName == $scope.currentTable.tableName) {
                    if (!$scope.playerInfo.tables[i - 1]) {
                        return $scope.playerInfo.tables[$scope.playerInfo.tables.length - 1].tableName;
                    }
                    else
                        return $scope.playerInfo.tables[i - 1].tableName;
                }
            }
        }

        $scope.goToTable = function (tableName) {

            if ($scope.currentTable && $scope.currentPage == 'floor') {
                var currentTableIndex = -1;
                var goToTableIndex;

                for (var i = 0; i < $scope.playerInfo.tables.length; i++) {
                    if ($scope.playerInfo.tables[i].tableName == $scope.currentTable.tableName) {
                        currentTableIndex = i;
                    }
                    if ($scope.playerInfo.tables[i].tableName == tableName) {
                        goToTableIndex = i;
                    }
                }
                if (currentTableIndex != -1) {
                    if (currentTableIndex < goToTableIndex) {
                        $scope.animateSwipeRight(tableName);
                    }
                    if (currentTableIndex > goToTableIndex) {
                        $scope.animateSwipeLeft(tableName);
                    }
                }
                else $scope.animateFadeFloorIn(tableName);
            }
            else
                $scope.animateFadeFloorIn(tableName);
        }

        $scope.swipeRight = function () {

            $scope.animateSwipeRight($scope.getNextTable());

        }

        $scope.swipeLeft = function () {

            $scope.animateSwipeRight($scope.getPrevTable());

        }

        $scope.animateFadeFloorIn = function (tableName) {
            $scope.viewFloor(tableName);

            $('#mainFloorContainer').addClass('animated fadeInDownBig');
            $('#mainFloorControls').addClass('animated fadeInUpBig');
            $('#leaderBoard').addClass('animated fadeInDown');
            $('#floorTimer').addClass('animated fadeInDown');
            $('#gameBar').addClass('animated fadeIn');


            $('#mainFloorContainer').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (event) {
                //console.log(event);

                $('#mainFloorContainer').removeClass('animated fadeInDownBig');
                $('#mainFloorControls').removeClass('animated fadeInUpBig');
                $('#leaderBoard').removeClass('animated fadeInDown');
                $('#floorTimer').removeClass('animated fadeInDown');
                $('#gameBar').removeClass('animated fadeIn');


            });

        }

        $scope.animateSwipeRight = function (tableName) {
            //$scope.endGameModalOn = true;

            $('#mainFloorContainer').addClass('animated fadeOutRight');
            $('#mainFloorControls').addClass('animated fadeOutRight');
            $('#leaderBoard').addClass('animated fadeOutUp');
            $('#floorTimer').addClass('animated fadeOutUp');
            $('#gameBar').addClass('animated fadeOutLeft');


            $scope.floorTimerShow = false;

            $('#mainFloorContainer').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (event) {
                console.log(event);

                $('#mainFloorContainer').removeClass('animated fadeOutRight');
                $('#mainFloorContainer').addClass('animated fadeInLeft');
                $('#mainFloorControls').removeClass('animated fadeOutRight');
                $('#mainFloorControls').addClass('animated fadeInLeft');
                $('#leaderBoard').removeClass('animated fadeOutUp');
                $('#leaderBoard').addClass('animated fadeInDown');
                $('#floorTimer').removeClass('animated fadeOutUp');
                $('#floorTimer').addClass('animated fadeInDown');
                $('#gameBar').removeClass('animated fadeOutLeft');
                $('#gameBar').addClass('animated fadeInRight');

                $scope.viewFloor(tableName);


                $('#mainFloorContainer').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (event) {
                    console.log(event);
                    $('#mainFloorContainer').removeClass('animated fadeInLeft');
                    $('#mainFloorControls').removeClass('animated fadeInLeft');
                    $('#leaderBoard').removeClass('animated fadeInDown');
                    $('#floorTimer').removeClass('animated fadeInDown');
                    $('#gameBar').removeClass('animated fadeInRight');
                });

            });
        }

        $scope.animateSwipeLeft = function (tableName) {
            //$scope.endGameModalOn = true;

            $('#mainFloorContainer').addClass('animated fadeOutLeft');
            $('#mainFloorControls').addClass('animated fadeOutLeft');
            $('#leaderBoard').addClass('animated fadeOutUp');
            $('#floorTimer').addClass('animated fadeOutUp');
            $('#gameBar').addClass('animated fadeOutRight');


            $scope.floorTimerShow = false;

            $('#mainFloorContainer').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (event) {
                console.log(event);

                $('#mainFloorContainer').removeClass('animated fadeOutLeft');
                $('#mainFloorContainer').addClass('animated fadeInRight');
                $('#mainFloorControls').removeClass('animated fadeOutLeft');
                $('#mainFloorControls').addClass('animated fadeInRight');
                $('#leaderBoard').removeClass('animated fadeOutUp');
                $('#leaderBoard').addClass('animated fadeInDown');
                $('#floorTimer').removeClass('animated fadeOutUp');
                $('#floorTimer').addClass('animated fadeInDown');
                $('#gameBar').removeClass('animated fadeOutRight');
                $('#gameBar').addClass('animated fadeInLeft');

                $scope.viewFloor(tableName);

                $('#mainFloorContainer').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (event) {
                    console.log(event);
                    $('#mainFloorContainer').removeClass('animated fadeInRight');
                    $('#mainFloorControls').removeClass('animated fadeInRight');
                    $('#leaderBoard').removeClass('animated fadeInDown');
                    $('#floorTimer').removeClass('animated fadeInDown');
                    $('#gameBar').removeClass('animated fadeInLeft');
                });

            });

        }

        var gameStartHandler = function (reply) {

            if (reply != 'modalOff') {
                if (reply == 5) {
                    //$scope.$apply(function () {
                    $scope.floorOverlay = true;
                    $scope.countDownModal = true;
                    $('#floorOverlay').addClass('animated bounceInRight');
                    $('#countDownModal').addClass('animated bounceInLeft');

                    $('#countDownModal').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (event) {
                        $('#floorOverlay').removeClass('animated bounceInRight');
                        $('#countDownModal').removeClass('animated bounceInLeft');
                    });

                    //});
                }
                //$scope.$apply(function () {
                $scope.startGameMsg = reply;
                //});
            }
            else {
                console.log(reply);
                //$scope.$apply(function () {
                $('#floorOverlay').addClass('animated bounceOutLeft');
                $('#countDownModal').addClass('animated bounceOutRight');

                $('#countDownModal').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (event) {
                    $('#floorOverlay').removeClass('animated bounceOutLeft');
                    $('#countDownModal').removeClass('animated bounceOutRight');
                });

                $scope.floorOverlay = false;
                $scope.countDownModal = false;
                //});
            }

        }

        $scope.closeEndGameModal = function () {
            $('#confetti').addClass('animated bounceOutLeft');
            $('#endGameModal').addClass('animated bounceOutRight');

            $('#endGameModal').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (event) {
                $('#confetti').removeClass('animated bounceOutLeft');
                $('#endGameModal').removeClass('animated bounceOutRight');
                //$scope.$apply(function () {
                $scope.confetti = false;
                $scope.endGameModal = false;
                $scope.viewFloor($scope.currentTable.tableName);
                //});

            });
        }

        $scope.goToLobby = function () {
            $('#confetti').addClass('animated bounceOutLeft');
            $('#endGameModal').addClass('animated bounceOutRight');

            $('#endGameModal').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (event) {
                $('#confetti').removeClass('animated bounceOutLeft');
                $('#endGameModal').removeClass('animated bounceOutRight');
                //$scope.$apply(function () {
                $scope.confetti = false;
                $scope.endGameModal = false;
                $scope.currentPage = 'lobby';
                //});

            });
        }

        var notifications = function (reply) {
            //alert(JSON.stringify(reply));

            //$scope.$apply(function () {

            $scope.currentTable.endResults = reply.allPlayersRanking;
            console.log($scope.currentTable.endResults);

            $scope.confetti = true;
            $scope.endGameModal = true;
            $('#confetti').addClass('animated bounceInRight');
            $('#endGameModal').addClass('animated bounceInLeft');


            $('#endGameModal').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (event) {
                $('#confetti').removeClass('animated bounceInRight');
                $('#endGameModal').removeClass('animated bounceInLeft');
            });

            //});

        }

        $scope.createGameModal = function () {


            $scope.floorOverlay = true;
            $scope.createGameModalOn = true;
            $('#floorOverlay').addClass('animated bounceInRight');
            $('#createGameModalOn').addClass('animated bounceInLeft');


            $('#createGameModalOn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (event) {
                $('#floorOverlay').removeClass('animated bounceInRight');
                $('#createGameModalOn').removeClass('animated bounceInLeft');
            });


        }

        $scope.closeCreateGameModal = function () {
            $('#floorOverlay').addClass('animated bounceOutLeft');
            $('#createGameModalOn').addClass('animated bounceOutRight');

            $('#createGameModalOn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (event) {
                $('#floorOverlay').removeClass('animated bounceOutLeft');
                $('#createGameModalOn').removeClass('animated bounceOutRight');
                //$scope.$apply(function () {
                $scope.floorOverlay = false;
                $scope.createGameModalOn = false;
                //});

            });
        }

        $scope.isMyTable = function (tableName) {
            for (var i = 0; i < $scope.playerInfo.tables.length; i++) {
                if ($scope.playerInfo.tables[i].tableName == tableName) {
                    return true;
                }
            }
            return false;
        }

        $scope.viewFloor = function (tableName) {

            if ($scope.isMyTable(tableName)) {
                //$scope.$apply(function () {
                $scope.myTable = true;
                //});
            }
            else {
                //$scope.$apply(function () {
                $scope.myTable = false;
                //});
            }

            $scope.leaderBoardShow = true;
            $scope.gritterHistory = false;
            $scope.buy_max = 1000000;
            $scope.sell_max = 1000000;

            if ($scope.currentTable.tableName) {
                $('#floorTimer').TimeCircles().destroy();
                var oldNewPlayerAddr = $scope.currentTable.tableName + ".NewPlayer";
                var oldTimerAddr = $scope.currentTable.tableName + ".Timer";
                var oldChatAddr = $scope.currentTable.tableName + ".ReceiveChatMessage";
                var oldVolumesAddr = $scope.currentTable.tableName + ".Volumes";
                var oldHistoryAddr = $cookies.sessionID + '.' + $scope.currentTable.tableName + ".History";
                var oldPositionsAddr = $cookies.sessionID + '.' + $scope.currentTable.tableName + ".Trades";
                var oldLeaderBoardAddr = $scope.currentTable.tableName + ".LeaderBoard";
                var oldGameStartaAddr = $scope.currentTable.tableName + ".GameStart";
                var oldTableNotifAddr = $scope.currentTable.tableName + ".Notifications";
                console.log('Unregistering: ' + oldNewPlayerAddr);
                console.log('Unregistering: ' + oldTimerAddr);
                console.log('Unregistering: ' + oldChatAddr);
                console.log('Unregistering: ' + oldHistoryAddr);
                console.log('Unregistering: ' + oldPositionsAddr);
                console.log('Unregistering: ' + oldVolumesAddr);
                console.log('Unregistering: ' + oldGameStartaAddr);
                console.log('Unregistering: ' + oldTableNotifAddr);
                vertxEventBusService.unregisterHandler(oldNewPlayerAddr, newPlayer);
                vertxEventBusService.unregisterHandler(oldTimerAddr, mainTimer);
                vertxEventBusService.unregisterHandler(oldChatAddr, tableChat);
                vertxEventBusService.unregisterHandler(oldHistoryAddr, history);
                vertxEventBusService.unregisterHandler(oldPositionsAddr, positions);
                vertxEventBusService.unregisterHandler(oldVolumesAddr, volumes);
                vertxEventBusService.unregisterHandler(oldLeaderBoardAddr, leaderBoard);
                vertxEventBusService.unregisterHandler(oldGameStartaAddr, gameStartHandler);
                vertxEventBusService.unregisterHandler(oldTableNotifAddr, notifications);
            }

            var addrNewPlayer = tableName + ".NewPlayer";
            var addrNewTimer = tableName + ".Timer";
            var addrNewChat = tableName + ".ReceiveChatMessage";
            var addrNewVolumes = tableName + ".Volumes";
            var addrNewLeaderBoard = tableName + ".LeaderBoard";
            var addrNewGameStart = tableName + ".GameStart";
            var addrNewNotifications = tableName + ".Notifications";
            var addrNewHistory = $cookies.sessionID + '.' + tableName + ".History";
            var addrNewPositions = $cookies.sessionID + '.' + tableName + ".Trades";

            $scope.currentPage = 'floor';
            $scope.gameBar = true;

            var addrTableInfo = tableName + ".TableInfo";

            //get basic table information

            vertxEventBusService.send(addrTableInfo, {}).then(function (reply) {
                //$scope.$apply(function () {
                $scope.clearCurrentTable();
                //alert(JSON.stringify(reply));
                $scope.currentTable.tableName = reply.tableName;
                $scope.currentTable.gameType = reply.gameType;
                $scope.currentTable.totalGameTime = (reply.totalGameTime / 60000).toFixed(2) + " minutes";
                $scope.currentTable.maxPlayers = reply.maxPlayers;
                //$scope.nb_players = reply.maxPlayers;

                //});
            });

            //get basic players in table information

            var addrTableInfoPlayer = tableName + ".PlayersInfo";
            vertxEventBusService.send(addrTableInfoPlayer, {}).then(function (reply) {
                //$scope.players_list.length;
                console.log(reply);
                for (var i = 0; i < reply.length; i++) {
                    //$scope.$apply(function () {
                    $scope.currentTable.playerList[reply[i].financials.order] = {
                        "username": reply[i].username,
                        "flagUrl": reply[i].flagUrl,
                        "imgUrl": reply[i].imgUrl,
                        "level": Math.floor(reply[i].level),
                        "freeVolume": reply[i].financials.freeVolume
                    };
                    $scope.currentTable.leaderBoard.push({
                        "username": reply[i].username,
                        "totalVolume": reply[i].financials.totalVolume
                    });
                    //});
                }

                console.log('Registering' + addrNewPlayer);
                vertxEventBusService.on(addrNewPlayer, newPlayer);

            });




console.log("avamt vertxserviceonDestroyTable");
vertxEventBusService.registerHandler("DestroyTable", function(reply){
    console.log("DestroyTable");
    console.log(JSON.stringify(reply));





    var tableName = reply.tableName;

    console.log(tableName);

var indexTable =   $scope.getTableIndex(tableName);

    console.log("indexTable"+indexTable);


$scope.$apply(function(){

console.log("andrew_tables" + JSON.stringify( $scope.andrew_tables));

$scope.andrew_tables.splice(indexTable,1)

console.log("andrew_tables" + JSON.stringify( $scope.andrew_tables));



});

 });

            console.log('Registering' + addrNewTimer);
            vertxEventBusService.registerHandler(addrNewTimer, mainTimer);
            console.log('Registering' + addrNewChat);
            vertxEventBusService.registerHandler(addrNewChat, tableChat);
            console.log('Registering' + addrNewHistory);
            vertxEventBusService.registerHandler(addrNewHistory, history);
            console.log('Registering' + addrNewPositions);
            vertxEventBusService.registerHandler(addrNewPositions, positions);
            console.log('Registering' + addrNewVolumes);
            vertxEventBusService.registerHandler(addrNewVolumes, volumes);
            console.log('Registering' + addrNewLeaderBoard);
            vertxEventBusService.registerHandler(addrNewLeaderBoard, leaderBoard);
            console.log('Registering' + addrNewGameStart);
            vertxEventBusService.registerHandler(addrNewGameStart, gameStartHandler);
            console.log('Registering' + addrNewNotifications);
            vertxEventBusService.registerHandler(addrNewNotifications, notifications);
           
        }


        $scope.join_table = function (tableName, nbmax) {
            $('#timerAndrew').data("timer", 0).TimeCircles().restart();
            //$cookies.currentTable = tableName;
            $scope.currentTable = tableName;
            $scope.players_list.length = 0;
            $scope.tableInfos.length = 0;
            $scope.players_board.length = 0;
            $scope.playerMax = [];
            for (var i = 0; i < nbmax; i++) {
                $scope.playerMax.push("new players " + i);
            }

            /*
             var addrTableInfo = tableName + ".TableInfo";
             $scope.eb.send(addrTableInfo, {}, function (reply) {
             $scope.$apply(function () {
             $scope.tableInfos = {
             "tableName": reply.tableName,
             "gameType": reply.gameType,
             "totalTime": reply.totalTime,
             "maxPlayers": reply.maxPlayers
             }
             //$scope.nb_players = reply.maxPlayers;
             });
             });
             */

            /*
             var addrTableInfoPlayer = tableName + ".PlayersInfo";
             $scope.eb.send(addrTableInfoPlayer, {}, function (msg) {
             $scope.players_list.length;
             for (var i = 0; i < msg.length; i++) {
             $scope.$apply(function () {
             $scope.players_list.push({
             "userName": msg[i].userName,
             "flagUrl": msg[i].flagUrl,
             "imgUrl": msg[i].imgUrl,
             "level": Math.floor(msg[i].level),
             "freeVolume": 1000000
             });

             $scope.players_board.push({
             "userName": msg[i].userName,
             "potentialVolume": 1000000
             });

             $scope.left_downInfo.top = (59 - ($scope.players_board.length * 1.25)) + "vh";
             console.log("NEW LEADERBOARD SIZE:" + (59 - ($scope.players_board.length * 1.25)) + "vh");
             });
             }

             $scope.left_downInfo.top = (59 - ($scope.players_board.length * 1.25)) + "vh";
             console.log("NEW LEADERBOARD SIZE:" + (59 - ($scope.players_board.length * 1.25)) + "vh");
             });
             */

            var addrNewPlayer = tableName + ".NewPlayer";
            vertxEventBusService.on(addrNewPlayer, function (msg) {
                //$scope.$apply(function () {
                console.log("NEW PLAYER PUSHING");
                $scope.players_board.push({
                    "userName": msg.userName,
                    "potentialVolume": 1000000
                });

                $scope.players_list.push({
                    "userName": msg.userName,
                    "flagUrl": msg.flagUrl,
                    "imgUrl": msg.imgUrl,
                    "level": Math.floor(msg.level),
                    "freeVolume": 1000000
                });

                $scope.left_downInfo.top = (59 - ($scope.players_board.length * 1.25)) + "vh";
                console.log("NEW LEADERBOARD SIZE:" + (59 - ($scope.players_board.length * 1.25)) + "vh");
                //});
            });

            $scope.changePage('floor');
        }
        //NEW
        $scope.changePage = function (page) {
            $scope.modal_end = '';

            if (page == 'lobby' && $scope.Auth) {
                $scope.currentPage = 'lobby';

                //NEW
                $("#lobbyLeft").addClass('animated fadeInLeftBig');
                $("#lobbyRight").addClass('animated fadeInRightBig');
                $("#mainLobbyContent").addClass('animated fadeInDownBig');

            }

            if (page == '/') {
                $scope.currentPage = '';
            }

            if (page == 'floor') {
                $scope.gameBar = true;
                $scope.currentPage = 'floor';
            }


            /*

             if ((page == "lobby" || page == "floor") && !$cookies.playerID) {
             $.gritter.add({
             // (string | mandatory) the heading of the notification
             title: '<span style=\"color: #ff0000;margin-left:3em;\">Warning</span>',
             text: 'Connectez vous avant de jouer!'
             });
             //alert("Connectez vous avant de jouer!");
             $('.gritter_loading1').addClass('ng-hide');
             } else {
             if (page == 'floor' && $scope.setting_tableForm) {
             var styleCustom = "URL('" + $scope.setting_tableForm + "') no-repeat center center";
             $('#tableFloorImg').attr('style', styleCustom);
             console.log("HEY YOU HAVE CHANGE STYLE FOR :");
             console.log(styleCustom);
             }
             $scope.currentPage = page;
             } 
             */
        }

        $scope.loadBar_data = function () {
            $('#CnvCurrenciesShow').hide();
            Initialiser();

            vertxEventBusService.on("ArrayForBar", function (currencies) {
                //console.log("ArrayForBar");
              //  console.log(JSON.stringify(currencies));
            //$rootScope.$broadcast('ArrayForBar', { currencies : currencies });
                
                Traiter(currencies);
              //  console.log(JSON.stringify(currencies));

                
            });


          //  $scope.$on('scanner-started', function(event, args) {

    
    


            setInterval(function () {
                Animer()
            }, 40);

            setTimeout(function () {
                $('#CnvCurrenciesShow').show();
                $('#CurBarLoading').hide();
            }, 2000)
        }


        $scope.disableNewPositionNotifier = function () {
            if ($scope.positionsTabClicked == 0) {
                $scope.showNewPositionsBadge = false;

                if ($scope.showNewHistoryBadge == false) {
                    $scope.showNewHistoryBadge = true;
                    $scope.newHistory = 0;
                    $scope.historyTabClicked = 0;
                }

                if ($scope.showNewOrderBadge == false) {
                    $scope.showNewOrderBadge = true;
                    $scope.newOrders = 0;
                    $scope.orderTabClicked = 0;
                }
            }
            $scope.positionsTabClicked = $scope.positionsTabClicked + 1;
        }

        $scope.disableHistoryNotifier = function () {
            if ($scope.historyTabClicked == 0) {
                $scope.showNewHistoryBadge = false;

                if ($scope.showNewPositionsBadge == false) {
                    $scope.showNewPositionsBadge = true;
                    $scope.newPositions = 0;
                    $scope.positionsTabClicked = 0;
                }

                if ($scope.showNewOrderBadge == false) {
                    $scope.showNewOrderBadge = true;
                    $scope.newOrders = 0;
                    $scope.orderTabClicked = 0;
                }
            }
            $scope.historyTabClicked = $scope.historyTabClicked + 1;
        }

        $scope.disableNewOrderNotifier = function () {
            if ($scope.orderTabClicked == 0) {
                $scope.showNewOrderBadge = false;

                if ($scope.showNewPositionsBadge == false) {
                    $scope.showNewPositionsBadge = true;
                    $scope.newPositions = 0;
                    $scope.positionsTabClicked = 0;
                }

                if ($scope.showNewHistoryBadge == false) {
                    $scope.showNewHistoryBadge = true;
                    $scope.newHistory = 0;
                    $scope.historyTabClicked = 0;
                }
            }
            $scope.orderTabClicked = $scope.orderTabClicked + 1;
        }


        $scope.enableChatNotifier = function () {
            if ($scope.newsClicked == 0) {
                $scope.showChatBadge = true;
                $scope.showNewsBadge = false;
                $scope.unreadMessages = 0;
                $scope.chatClicked = 0;
                clearInterval($scope.h);
            }
            $scope.newsClicked = $scope.newsClicked + 1;
        }

        $scope.enableNewsNotifier = function () {
            if ($scope.chatClicked == 0) {
                $scope.showNewsBadge = true;
                $scope.showChatBadge = false;
                $scope.unreadNews = 0;
                $scope.newsClicked = 0;
            }
            $scope.chatClicked = $scope.chatClicked + 1;

            $scope.h = setInterval(function () {
                $scope.$apply(function () {
                    $scope.unreadNewsCounter()
                });
            }, 10000);
        }

        $scope.unreadNewsCounter = function () {
            $scope.unreadNews = $scope.unreadNews + 1;
            return $scope.unreadNews;
        }

        $scope.send_message_chat = function (message) {
            var addrChatSend = $scope.currentTable.tableName + ".Chat";
            vertxEventBusService.send(addrChatSend, {
                "sessionID": $cookies.sessionID,
                "msg": message
            }).then(function (reply) {
            });
            document.getElementById("clearMessage").value = "";
        }

//	$scope.content_message_chat=null;
        //NEW
        $scope.logout = function () {

            vertxEventBusService.send('Logout', {sessionID: $cookies.sessionID}).then(function (reply) {
                if (reply.status == "ok")
                    console.info("Logout successful.");
                else
                    console.error("Logout failed.");
            }).catch(function () {
                console.error("No response within 10 seconds for Logout");
            });

            $scope.Auth = false;
            $cookies.sessionID = "";
            $scope.playerInfo.username = "";
            $scope.playerInfo.flagUrl = "";
            $scope.playerInfo.imgUrl = "";
            $scope.playerInfo.level = "";
            $scope.playerInfo.streak = "";
            $scope.playerInfo.tables = [];
            $scope.playerInfo.balance = "";
            $scope.playerInfo.email = "";


//document.getElementById("myModal").remove();
            console.log($scope.playerInfo);
            $scope.partials.pop();
            $scope.partials.pop();
            $scope.partials.pop();

            /*
             $scope.eb.send("Logout", {"sessionID": $cookies.playerID}, function (reply) {

             $scope.changePage('');
             });
             */
        }

        $scope.new_gritter = function (type, price, volume, currency) {
            volume = accounting.formatMoney(volume);
            //price = price.toFixed(4);
            $.gritter.add({
                // (string | mandatory) the heading of the notification
                title: 'Order filled at ' + price,

                image: '../assets/images/gritter/favicon-white.png',
                // (string | mandatory) the text inside the notification
                //text: 'Your request to '+type+' '+volume+' of USDHKD was filled at 1.3589.'
                text: "<img style=\"width: 1.2em; height: 1.2em; margin-right: 0.6em;\" " +
                "class=\"gritter_loading2\" " + 'Volume: ' +
                'src="../assets/images/gritter/loading_great.GIF">' +
                volume + "<br>" +
                "<img style=\"width: 1.2em; height: 1.2em; margin-right: 0.6em;\" class=\"gritter_loading3\" " +
                'src="../assets/images/gritter/loading_great.GIF">' +
                'Position :' + type
            });
        }


        $scope.new_gritter_close = function () {
            $.gritter.add({
                // (string | mandatory) the heading of the notification
                title: 'You close your position',

                image: '../assets/images/gritter/favicon-white.png',
                // (string | mandatory) the text inside the notification
                text: ' '
            });
        }


        $scope.new_gritter_closeAll = function () {
            $.gritter.add({
                // (string | mandatory) the heading of the notification
                title: 'You close your all positions',

                image: '../assets/images/gritter/favicon-white.png',
                // (string | mandatory) the text inside the notification
                text: ' '
            });
        }

        $scope.new_gritter_closeOrders = function () {
            $.gritter.add({
                // (string | mandatory) the heading of the notification
                title: 'You cancel your all ordres',

                image: '../assets/images/gritter/favicon-white.png',
                // (string | mandatory) the text inside the notification
                text: ' '
            });
        }


        //$scope.openConn();

        $scope.clearData = function () {
            $cookies.playerID = '';
            $cookies.playerName = '';
            $cookies.currentTable = '';
            $scope.Auth = false;
            $cookies.playerID = "";
            $cookies.playerName = "";
            $cookies.playerLevel = "";
            $cookies.playerImage = "";
            $cookies.playerBalance = "";
            $cookies.playerStreak = "";
            $scope.players_list.length = 0;
            $scope.players_list_details.length = 0;
            $scope.players_board.length = 0;
        }

        $scope.open_rightbar = function (element) {
            if ($scope.rightbar_stat == true) {
                $scope.left_downInfo.left = "1%";
                $scope.timer.left = "1%";
                $scope.allInBtn = {"width": "8vw", "padding-top": "0px"};
                ;
                $scope.rightbar_stat = false;
                $(".arrow_deploy_left_base").removeClass('glyphicon-chevron-left');
                $(".arrow_deploy_left_base").addClass('glyphicon-chevron-right');

                $("#leftChevronFolder").css('margin-left', '-14px');
                $("#leftBarBtn").css('margin-left', '-1vw');
                $("#chevron-right").css('margin-left', '-14px');
                $("#rightBarBtn").css('margin-right', '-1vw;');


                $(".arrow_deploy_right_base").removeClass('glyphicon-chevron-right');
                $(".arrow_deploy_right_base").addClass('glyphicon-chevron-left');

                $('#tableInfos').addClass('zoomIn').addClass('left_100');
                $('#tableInfos').addClass('zoomIn').removeClass('left_75');
                $('#leaderboard').addClass('zoomIn');

                $('#chevron-right').addClass('glyphicon-chevron-right').removeClass('glyphicon-chevron-left');
                $('#chevron-left').addClass('glyphicon-chevron-left').removeClass('glyphicon-chevron-right');
            }
            else {
                $scope.left_downInfo.left = "8.5%";
                $scope.timer.left = "8.5%";
                $scope.allInBtn = {"width": "4vw", "padding-top": "0"};
                ;
                $scope.rightbar_stat = true;
                $(".arrow_deploy_left_base").removeClass('glyphicon-chevron-right');
                $(".arrow_deploy_left_base").addClass('glyphicon-chevron-left');
                $(".arrow_deploy_right_base").removeClass('glyphicon-chevron-left');
                $(".arrow_deploy_right_base").addClass('glyphicon-chevron-right');

                $("#leftChevronFolder").css('margin-left', '16px');
                $("#leftBarBtn").css('margin-left', '0.5vw');
                $("#chevron-right").css('margin-left', '20px');

                $('#tableInfos').addClass('zoomIn').addClass('left_75');
                $('#tableInfos').addClass('zoomIn').removeClass('left_100');
                $('#leaderboard').addClass('zoomIn');

                $('#chevron-right').addClass('glyphicon-chevron-left').removeClass('glyphicon-chevron-right');
                $('#chevron-left').addClass('glyphicon-chevron-right').removeClass('glyphicon-chevron-left');
            }
        }

        
        
        
        
        $scope.SignUP = function (sign_image, sign_email, sign_userName, sign_password, sign_promoCode) {
            var dataImage = $('#img_signup').attr('src');
            //dataImage = dataImage.substring(23);

            if (dataImage == "../../assets/images/home/newUserSmall.png")
            {
                dataImage = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxQSEhIUEhQUFhUVFRgWFg8RFRQVFhcUFBQXFhQUGBQYHSggGB0lHBQWITEhJSkrLi4uGB8zODMsOCgtLisBCgoKDg0OFxAQFyscHBwsLCssLCwsLCssLCwsLC8sKy0sNywsLCssLC4rLCssNCwrNywrKystKysrLCwsKysrK//AABEIAMwAzAMBIgACEQEDEQH/xAAcAAEAAQUBAQAAAAAAAAAAAAAABQIDBAYHCAH/xABEEAABAwICBgYIAQsCBwAAAAABAAIDBBEFIQYSMUFRYQciMnGBkRNCUnKhscHRYhQjM0NTY4KSouHwJDQIFRZEstLx/8QAGQEBAQEBAQEAAAAAAAAAAAAAAAIBAwQF/8QAIhEBAAICAwACAgMAAAAAAAAAAAECERIDITEEE0FRBSNh/9oADAMBAAIRAxEAPwDuKIiAiIgIiICIqZHhoJJAAFy45AAZkkoPt1CYnpLHE8xRh00w/VRW6vvv2M+aiqzF5KwltO4xU4ydVbHycWxcB+LbwX2jhZCzVhaGtG1538STvW4ZlfNVVyZufHAPYiHpHDvkdl5NWFUxH1qicnlIW/BtlG4jpTEy4aTK78PZ896h5McqJewwAcbZeZVYZlNPqpIz1KmYe87XHk4FXKfTaeI/nmNmZvfH1JAOOrsd8FqNRXyDtysHIZ/JYEmJn2w7+G31W4Zl3HCMViqYxJC7WbsI2Fp9lzdoKzlwvRjSM01UyTYxxDZRuLD6xHEbbrt9LUskaHxuDmuFw9pBB8QomMKicrqIixoiIgIiICIiAiIgIiICIiAiL4UFuonaxrnvIa1oLnOcbAAZkkrTXyvxJ2sQ5lE09VhuHVBB7TuDOA37Vr/SJpi2KtFLVRu9CxjJWsGbZi4mz38WgttqjeDfcoqu08dMLRVcUQtYMdABYcLk2V1qmZbxiGItj6kUbpngWEUQu1vvO2BaZj+JA/72riiA/wC0gIlf3ENNr95WmY5LVTgh1ZNM39nC+Fjf5A4LVzTeiP8AtpDzkuR/TktwxvTtLYWnVpKcuP7Wbru79XstWLVYlPJnNJq/gB+m5ao3En7OwPZaNVZEEq0TQlG655uWdh1C+Z4Y0ZnPk1vtH7KMpRYBxFyTZjfacdi6PS0YoqYa2cr+s887bO4ZBBGPoI4W6ozdbN7tp+wWX0X46Yq19KT+bluWt3NkA1hbvAI8lreM1pdI7kbeSwtFKotxSmP7xg8zb6rJjpme3pJERc3QREQEREBERAREQEREBERAREQc36bdFTV0gniF56a7hba6I9tv18FwlmGVG+I+JC9b18QdHI05hzHAjkQVpEeDQu9TyJU2vNfFVrE+uBf8tm/ZO8LKn0crfVkb4H6Lvc2izD2SRyNioyr0c1drAeYWfbb9N0q4w2uePWvycAfmsiGvHrRMJ4tu34DIrpNRo3G7a3wIVik0WjYbhg79q37o/TPqQ+icBdUQyzABrSSyPdcNJBt3qd0kxAvPh83t+yx8XeInw24n7KKxCovfu+TgV1pO0Zc7xicMWvd1395WLoxniEB/fN+DmhK2bNx/zYszQGm1sQpG/vAT4XcfkqlMPSSIi5OgiIgIiICIiAiIgIiICIiAiIgpeLg9y1Kk7RHh5LblqMw1Z3j8R+Of1XO/4XRJRhUyhW2vXxz1OWsKqo2nkVGz05bdS8jlg1buqVMqhzfT9+oyF/B9vMLGwrBpapjpGOYxjTq+kkJsXWvqtA2n5KV08ojNRvDBdzS1zQOTh91NUFIIIIKduyJgBPGR2cjjzLiV0rya06TPHmzldXM6OR8clrscWutsuFu3QxT+lxEvHZhie4n8T7Mb8HO8lzjSuqvW1JH7Q/AAfRdv6AMJ1KKSpcM6iQ6t/wBnF1R4a2su+enLHbqSIihoiIgIiICIiAiIgIiICIiAiIgLVNI2ak7XbnAHxGR+i2tQWlkF4g8eofgcvnZTeOlV9R4lXx0iwopbgKoyLjl0XnvUdiMnVV90ii8SlzspmVQxrqzjFe2CCSZxya0nvOwDzX3WVivaHsMbhrB+RaeG9ZGMtlxKjppKuoaxovJPIAB+J7v7r2JgWGNpaeGCPsxRtYOeqLEnmTn4rkvRX0fCHEZKkkOjiZ+ZB2iSQFpv7rda3vDgu0r15z480xgREQEREBERAREQEREBERAREQEREBWaqAPY5h2OBHmryIOctuxzmO2tJHkqzIpLS+i1JGzNGTsne8Nh8R8lAmRea0Yl3juGQ+VQ08t3Eq7W1O4KHnxBrch1jy2eaiVxDOfIALkq7h8RdeQ7NjQsLCqN87tZ3YG/6BbLI0NbYZAbAtiGTLM0UxFsUjg82a4do7ARvPLNb2CubtorMcXDN7SA3kQrXRjpsCBQ1TrSRksild67WmwjJ9oDIcQOO308cThwvMZdOREVJEREBERAREQEREBERAREQF8uvq0XpB0gez/TQEtcW3kkG0NdsYDuJGZPAhbEZJnDY8U0lpae/pZmAj1G3e7+VtytIx3pUsCKSEk7pJ8h36jTc+YWnS01jZYVd1G7LuJs1vFx2K4qjZRVaS19VMC+Zzi03DAAI2j3Bls43PNb5o9QyzwSPkIDwDqhosDqi+d1r2BYQI29bM9p7ufBdM0VhtBE4jt3ce517fCyi9YmFUtMOQ1X5Q9xa5rvdaMv7qXwfRtxs6bIexvPfwW21kPoZHRkZg9XLa09khZNJhM0uer6Nntvy8m7V5NO3p36YLAGgNaOQa3b5KSgoNQB8u31Y+HfzUpTUUcA6g1375XfTgO5WZYyTc5ldq0x65WvlFTguNz/APFyTSik9HWTtHtB4tu12h3hmSuz1AaxrnONmtBc5x3AZkrj0khqJaipIyeTqA+yBqs/pAXarlZs+h3Sk6nMcFcXPiPVbUgaz2W2B4Gbxz2967DQV0c7GyRPa9jhcPYbgryzjsVmB3svHxyWZgOkFRRv16eUs4s2sdycw5H5rZqyJeo0XPdEelKCo1Y6m0EpyDj+iceTvV7j5roLXXzGw71GF5fUREBERAREQEREBERAXG63EBNWVROfXOr3M6v0XXMRn9HFK/2GOd/K0n6LhtPBlHKNpHXHG+9VVNmViEgu08RbxH+BR2GMEs7pHdmLqsH4vWcrWIVVht3qxgdR1XfikPzXRDaMUqfR051e0/qt73HVaPMhdYo6IRxxsHqMa3+VoH0XHGfn8RoKf1RK2R99gZA0yknldjR4rddM9I5XxOZRWNyGPqL2aL5Gx38MtqnWbTEQ2bRSs2nyGw0ONQzTSwxkOkhAu6wzvtDTvsbXWdJGTtXCMFxH8iqoTEXPkc4mRxO1trOy4cl3jDq1k8bZGbDu3g7wVvNxTx2xLOLljkrtCw6BWzApMsC57p7pS4uNFRO/POylnbshYdoB9sjyuucRl0mcILTnGfyqQ0VObxtd/qJW7HOGfogd4B2niLblEVtMI42sb/llMYbhbKeMAcM3byd+awatusSfLuXSES07SSH/AE8h4AH4qLERsMty2HSxlqaXnYDvLgFWKEWGW4fJafhrJC3PQnpBnoSGSF0tPs9Gc3M5xuOf8OzuUPPRtALnHVY3a7eT7LRxUBWVzXG0bA1o37XHmSsmB61pKhsjGSMN2vaHNdxa4Ag+RV1ab0SVxmwunubmPWjJ9xxA+FluS5OgiIgIiICIiAiIggNPaj0eH1jv3Lm/z9X6rjU1fqQsaDmWhdQ6Xp9TDJvxOjb5vH2XCcQqiXW4AD4K6osrrKouPcruF1Fi0fiuorXyV2mPWaeatKTikM+KU7LmxcdYAkXaG3INtx1di65pOGx08VOyzbt13auVrdn+rP8AhXJNCRfF2X3Mefhb6rf8cxL0s0r75DJvusFm/G58V6vhce/JmfIfO/lOaacOtfbdNXwSjDcRpwTrOcJC48RqmwtwXXIqeSkeXxAuiPbj3jmFyfRp+visX4Ynf+J+665pnpPHQQaxGtK/qxQ73O4ng0bSfBR8yf7Onr+LmOOMoTTjTfUYIaS5mlHat2AdpstXwajbAwucbvd1nyHMknbmoCOts5887taWQ3ce/Y0DcBs7lakxYyHbYbm/deaId8tsfXh3cvhYDsWtx1wAuTYDeVEVmNPqrxxEshvZ0wyc/i1nAc1ozsVnFVIIYs445A6af1SWZiJvtG+3uUlUkNG0Z/5dRNM9kTA1gDWtGwfM8SrNfUEi/HYOSEovSCvMh1Rk1uQb9e9QrGrYJqMRs1ndo7uChCbklGO09AOKXiqaY7WObK33ZAQfJzf6gutLzp0P4h6HE4gTYTMfERxJAe34sC9FqLeulfBERS0REQEREBERBzrpxktQRt9uojHlc/RcMqX3JPNdo6eJbU9K3jOXW5NjP/sFxGZy6V8Rb1U05K9TlWoxkq6feqSzsBqfRV7n/uX27yMlsD6zqu8lp0rtWojdxbb4KTdU5L2/FvrWXi+Vw/Zav+JXRTEWxVc879kcZsBtJJaA0czZfcYxd9RM+pnN3uyZHuYwdljeH3uVDUkNrud3n6BVSv1jmvLy22tMvZWMRhZqJS83J/srTqv0Yu45KirqQ3IC7jsaPqseGnz1pM3bh6re5Qpdc981te7Y90e93N32UjAdUcANgViJt1VNJuWD5UVBsB7TgPC+an3U4u0nY1osOa1aU9aP3ls9ZNZvgtYiMZm1rqHAWXUuusdoQZOG135PPDNs9FIx5t7LXAu+F16zY64BGwi/mvIUzbgheotBa30+H0chzLoIw4/ia0Nd8QVF1VTqIihYiIgIiICIiDiXTtiAdU00I/Vxuee+RwA+EZ81ymZ2a9Mab6FRYgwa3VlaDqSjaL7jxHJcJ0m0HqqIkytDo7/pWbNuVwcwrrKJhEMGQ7lTGbOCrurLirS+4iLGN3B3zWXRDWN9w+ax60a0ZPis+jZqsHdcnmVdbYiYJhdeo2oqSSWx7d79w/uqp5jIdVuTd7uPILPioGBotcZfFQIuGnDeZO1x2lZMcSyTTAb1S7JBS42CxiVW91yrUxsEFva9vepysfcAKBgPWCmJHIMSpZkFihqzphdY2qgsTBegOhSr18LjB2xySM8A8kfArgUwXYf+H+q/MVcZPZma4Dk9gHzaVNvFV9dYRfAV9XNYiIgIiICIiAofSzCBVUs0O9zSAeBtkfNTCIPJ+JUMlPI6KVpa9u0HeOIO8LBcV6d0q0RgrmWkbZ3qyDtA8iuKaT9G1VSklg9NH7TB1gObfsukWRNWpwZjV5jyuq6iX0h1R2RtPHksfVIJabg7CDkRxyV5mQsFSV5oAFgsltQViAqsOQZDpVZc5UOcvl0HzVzWPUuzssq6w5MyUFMGRUm191GgLLhcgyiFZc3NX2Kl7c0GJMFvHQ1X+imqW7nMYfEOd91pjoi4gNBJOQaBck8AF03QHQaZjdd41S+xPEDc1TaelQ6dSV4cpJjrrBw/CxGBvUgBZc1vqIiAiIgIiICIiAvjm32r6iCDxfROlqf0sTCfasL+a0rFeh6F1zBK+M8D1h8V1FFuZMOCV/RRWR31HRyDldp+qgKzRGti7UD+9tnfJemV8LQt2Zq8pT0sjO2x7fea4fMKzrjiF6uko2O2tafALHODwfs2+QW7s1eWtZV02FzSfo4pHX4Mdbz2L1I3CoRsjb5BZDKdo2NA7gs3NXnGn6Pq9zdYQ25OIB8la/6PrWmxp3+Fj9V6Xslk2k1h53pNDa136hw96wWxYb0W1EhBle2NvADWd9h8V2ZfU2k1hrGjmhFNSdZrdZ++R+Z/stmAsvqKVCIiAiIg/9k=";
            }
            var testSend = {
                "action": "register",
                "username": sign_userName,
                "password": sign_password,
                "promoCode": sign_promoCode,
                "email": sign_email,
                "imgData": dataImage,
                "flagPath": "assets/images/home/lang/fr.png"
            };
           // alert(dataImage);
            console.log(dataImage);
            //NEW
            vertxEventBusService.send("Authenticator", testSend).then(function (reply) {
                //$scope.$apply(function () {

                if (reply.status == 'ok') {
                    $scope.login_submit(sign_userName, sign_password);

                    $scope.$watch(function () {
                        $('#myModal').modal('show');
                        
                    });

                }
                else {
                    alert('Error: ' + reply.message);

                }

                 
            });

        }


        $scope.update_gameChange = function () {

            if ($scope.paramCreate.gameType == "Hit & Run") {
                $scope.game_timeExtend_hit = true;
            }
            else
                $scope.game_timeExtend_hit = false;


            if ($scope.paramCreate.gameType == "Eliminator" || $scope.paramCreate.gameType == "Survivor") {
                $scope.game_timeExtend = true;
            }
            else
                $scope.game_timeExtend = false;
        }

        $scope.changePage_rightbar = function (page) {
            if ($scope.rightbar_page)
                $scope.rightbar_page = false;
            else
                $scope.rightbar_page = page;
        }


        $scope.update_balance = function (tablePicked, namePicked) {
            //alert("TABLE : "+tablePicked+"NAME PICKED : "+namePicked);
            //
            //var addrTableInfoPlayer = tablePicked+".PlayersInfo";
            //$scope.eb.send(addrTableInfoPlayer, {}, function(msg) {
            //    for(var i=0 ; i < msg.length ; i++) {
            //        if(msg[i].userName == namePicked)
            //            $scope.Auth.balance = msg[i].balance;
            //    }
            //});
        }


        $scope.getTableInfos = function (tableName) {
            var addrTableInfo = tableName + ".TableInfo";
            vertxEventBusService.send(addrTableInfo, {}).then(function (reply) {
                //$scope.$apply(function () {
                $scope.tableInfos = {
                    "tableName": reply.tableName,
                    "gameType": reply.gameType,
                    "totalGameTime": reply.totalGameTime,
                    "maxPlayers": reply.maxPlayers,
                    "buyIn": reply.buyIn
                }
                //$scope.nb_players = reply.maxPlayers;
                //});
            });
        }

        $scope.changeTabLeft = function (type) {
            $scope.floor_action_left = type;

            if (type == 'positions') {
                $scope.disableNewPositionNotifier();
            } else if (type == 'history') {
                $scope.disableHistoryNotifier();
            } else {
                $scope.disableNewOrderNotifier();
            }
        }

        // Function to launch the reloadChips window.
        $scope.openReloadChipsDialog = function () {
            console.info("Inside TradingFloorController.openReloadChipsDialog()");
            console.info("lets print scope " + JSON.stringify($scope.playerInfo));

            var playerInfo = $scope.playerInfo;
            console.info("playerInfo " + JSON.stringify(playerInfo));

            var address = "GetTimeRemainingForTopup";
            var context = {};

            vertxEventBusService.send(address, {username: $scope.playerInfo.username}).then(function (reply) {
                console.info("Inside " + address + " reply handler, with response " + JSON.stringify(reply));

                if (reply.status == "ok") {
                    context.reloadNotPossible = reply.timeRemainingInSecs > 0;
                    context.timeRemainingInSecs = reply.timeRemainingInSecs;

                    var modalInstance = $modal.open({
                        animation: true,
                        templateUrl: '../../partials/reload_chips_dialog.html',
                        controller: 'ReloadChipsController',
                        size: 'lg',
                        resolve: {
                            context: function () {
                                console.log("Context resolver function.");

                                var contextVals = {
                                    playerInfo: playerInfo,
                                    sessionID: $cookies.sessionID,
                                    //eb: $scope.eb,
                                    reloadNotPossible: context.reloadNotPossible,
                                    timeRemainingInSecs: context.timeRemainingInSecs
                                };
                                console.log("contextVals " + JSON.stringify(contextVals));
                                return contextVals;
                            }
                        }
                    });

                    modalInstance.result.then(function () {
                        console.info("Dialog is closed");
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    });
                } else {
                    console.error("GetTimeRemainingForTopup reply handler has error!!!");
                }
            });
        }

        $scope.abs = $window.Math.abs;
        $scope.pow = $window.Math.pow;

        $scope.SERVER_SIDE_ADDRESS = {
            EVENT_BUS_PREFIX: '/eventbus',
            GET_ONLINE_PLAYERS: 'GetOnlinePlayers',
            GET_PLAYER_XP: 'GetPlayerXP',
            GET_LEADER_BOARD: 'GetLeaderBoard'
        };

        $scope.CLIENT_SIDE_ADDRESS = {
            ONLINE_PLAYERS: 'OnlinePlayers',
            UPDATE_XP: 'UpdateXP'
        };

        // Dharani Kumar P - to support online players
        $scope.friendsList = [];
        $scope.playerSearch = "";

        $scope.loadOnlinePlayers = function (sessionID, username) {
            console.log("GetOnlinePlayers with sessionID " + sessionID + ", username " + username);
            vertxEventBusService.send($scope.SERVER_SIDE_ADDRESS.GET_ONLINE_PLAYERS, {
                "sessionID": sessionID,
                "username": username
            }).then(function (reply) {

                console.info("Reply for GetOnlinePlayers, " + JSON.stringify(reply));
                if (reply.status == "ok") {

                    $scope.friendsList = reply.friendsList;
                    console.info("$scope.friendsList " + JSON.stringify($scope.friendsList));
                }
            }).catch(function () {
                console.error("No reply within 10 seconds for " + $scope.SERVER_SIDE_ADDRESS.GET_ONLINE_PLAYERS);
            });
        }

        $scope.onOnlinePlayersChangeHandler = function (reply) {
            console.log("OnlinePlayers.handler() " + JSON.stringify(reply));
           //console.log("$scope.playerInfo object " + JSON.stringify($scope.playerInfo));
            
            if (reply.status == "ok") {

                if (reply.action == "add") {
                    if (reply.playerInfo.username != $scope.playerInfo.username) {
                        // New player has signed in
                        
                        console.log("onOnlinePlayersChangeHandler add" + reply.playerInfo.username);

                        // Filter out if the incoming player is same as one present in the list
                        var temp = $scope.friendsList.filter(function (value) {
                            return value.username == reply.username;
                        });

                        if (temp.length == 0) {
                            $scope.friendsList.push(reply.playerInfo);
                        }
                    }

                } else if (reply.action == "remove") {
                    // Player has signed off
                    //delete $scope.friendsList[reply.username];
                    var newArray = $scope.friendsList.filter(function (value) {
                        return value.username != reply.username;
                    });

                    $scope.friendsList = newArray;

                } else if (reply.action == "update") {
                    
                   console.log("$scope.friendsList " + JSON.stringify($scope.friendsList));
                   console.log("onOnlinePlayersChangeHandler ");
                   console.log("action update new username ");
                    console.log("$cookies.sessionID, " + $cookies.sessionID);
                    
                    
                  // var indexUsername = $scope.friendsList.indexOf(reply.oldUsername);
                    
                             $scope.friendsList.forEach(function(friend){
                            
                            if(friend.username == reply.oldUsername){
                                friend.username = reply.newUsername;
                            }
                            });
                        
                    console.log("$scope.friendsList  " + JSON.stringify($scope.friendsList));

                  

                    $scope.leaderBoardPlayers.forEach(function(player){

                        if(player.username == reply.oldUsername){
                            player.username = reply.newUsername;
                        }
                    });
                       
                   
                   
                    
                }else if(reply.action == "updateImg"){
                    console.log("upadteImg");
                    console.log(reply.dataImage);
                    $scope.image={};
                    $scope.image.player=reply.dataImage;
                    console.log("action updateImg");
                 
                             $scope.friendsList.forEach(function(friend){
                            
                            if(friend.username == reply.username){
                                friend.imgUrl = reply.dataImage;
                                
                            }
                            });
                      
                     $scope.leaderBoardPlayers.forEach(function(player, index){
                       console.log(index);
                        console.log(JSON.stringify($scope.leaderBoardPlayers[index]));
                       console.log("leaderBoardPlayers.forEach");
                        $scope.$apply(function(){
                            $scope.leaderBoardPlayers[index].usrImg=reply.dataImage;
                                //player.usrImg = reply.dataImage;
                                // $scope.playerInfo.imgUrl =  reply.dataImage;
                        });
                                
                           
                     });
                    
                   
                    
                    console.log($scope.currentTable.playerList.length);
                    
                }
               
            }
        }

        vertxEventBusService.on($scope.CLIENT_SIDE_ADDRESS.ONLINE_PLAYERS, $scope.onOnlinePlayersChangeHandler);

        $scope.playerXP = {
            username: "",
            totalXP: 0,
            currentLevel: 0,
            pointsToNextLevel: 500,
            progressPercent: 0,
            levelOnePoints: 500,
            multiplier: 2.5
        };

        $scope.getPlayerXP = function (username) {
            console.info("getPlayerXP with username " + username);
            vertxEventBusService.send($scope.SERVER_SIDE_ADDRESS.GET_PLAYER_XP, {"username": username}).then(
                function (reply) {
                    console.info("Reply for getPlayerXP " + angular.toJson(reply));
                    if (reply.status == "ok") {
                    
	                    if (reply.playerXP.username) {
	                		vertxEventBusService.on(reply.playerXP.username + "." + $scope.CLIENT_SIDE_ADDRESS.UPDATE_XP, 
	                			$scope.onXPUpdate);
	           	 		}
                    	
                        $scope.updateXPFieldsAndComputeProgress(reply);
                    }
                }).catch(function () {
                    console.error("No reply within 10 seconds for " + $scope.SERVER_SIDE_ADDRESS.GET_PLAYER_XP);
                });
        };

        $scope.onXPUpdate = function (reply) {
            console.info("onXPUpdate " + angular.toJson(reply));

            if (reply.status == "ok") {
                $scope.updateXPFieldsAndComputeProgress(reply);
            }
        };

        $scope.updateXPFieldsAndComputeProgress = function (reply) {
            console.info("Inside updateXPFieldsAndComputeProgress");
            if (reply.playerXP.username) {
                $scope.playerXP.username = reply.playerXP.username;
            }

            if (reply.playerXP.totalXP) {
                $scope.playerXP.totalXP = reply.playerXP.totalXP;
            }

            if (reply.playerXP.currentLevel) {
                $scope.playerXP.currentLevel = reply.playerXP.currentLevel;
            }

            if (reply.playerXP.pointsToNextLevel) {
                $scope.playerXP.pointsToNextLevel = reply.playerXP.pointsToNextLevel;
            }

            if (reply.xpConfig.levelOnePoints) {
                $scope.playerXP.levelOnePoints = reply.xpConfig.levelOnePoints;
            }

            if (reply.xpConfig.multiplier) {
                $scope.playerXP.multiplier = reply.xpConfig.multiplier;
            }

            if ($scope.playerXP.currentLevel > 0) {
                var previousLevel = $scope.playerXP.currentLevel - 1;
                var pointsTillPreviousLevel = $scope.playerXP.levelOnePoints * $scope.pow($scope.playerXP.multiplier, previousLevel);
                var pointsInThisLevel = $scope.playerXP.totalXP - pointsTillPreviousLevel;
                var progressPercent = (pointsInThisLevel / $scope.playerXP.pointsToNextLevel) * 100;
                $scope.playerXP.progressPercent = progressPercent;
            } else {
                $scope.playerXP.progressPercent = ($scope.playerXP.totalXP / $scope.playerXP.pointsToNextLevel) * 100;
            }
            console.info("new $scope.playerXP " + JSON.stringify($scope.playerXP));
        };

        $scope.leaderBoardPlayers = [];

        $scope.loadLeaderBoard = function () {
            var address = $scope.SERVER_SIDE_ADDRESS.GET_LEADER_BOARD;
            var params = {};
            vertxEventBusService.send(address, params).then(function (reply) {
                console.info(address + '.reply ' + JSON.stringify(reply));
                $scope.leaderBoardPlayers = reply.leaderBoard;
            }).catch(function () {
                $scope.errorFuncHolder(address);
            });
        };

        $scope.getLeaderBoardBadgeColor = function (index) {
            if (index == 0) {
                return {'font-size': '2em', 'padding-right': '1vh', color: 'goldenrod'};
            }
            else if (index == 1) {
                return {'font-size': '2em', 'padding-right': '1vh', color: 'silver'};
            }
            else if (index == 2) {
                return {'font-size': '2em', 'padding-right': '1vh', color: 'saddlebrown'};
            }
            else {
                return {'font-size': '2em', 'padding-right': '1vh', color: 'black'};
            }
        }
    }]);

myApp.factory('CurrencyPairs', function () {
    var CurrencyPairs = {};
    CurrencyPairs.cast = [
        {title: "EUR/USD", glyphicon1: "glyphicon bfh-flag-EU", glyphicon2: "glyphicon bfh-flag-US"},
        {title: "USD/CAD", glyphicon1: "glyphicon bfh-flag-US", glyphicon2: "glyphicon bfh-flag-CA"},
        {title: "CHF/USD", glyphicon1: "glyphicon bfh-flag-CH", glyphicon2: "glyphicon bfh-flag-US"},
        {title: "JPY/USD", glyphicon1: "glyphicon bfh-flag-JP", glyphicon2: "glyphicon bfh-flag-US"},
        {title: "USD/GBP", glyphicon1: "glyphicon bfh-flag-US", glyphicon2: "glyphicon bfh-flag-GB"}
    ];
    return CurrencyPairs;
});

function currencySearchCtrl($scope, CurrencyPairs, $timeout) {
    $scope.currencySearchInputBuy = true;
    $scope.currencySearchInputHideBuy = true;
    $scope.currencySearchInputSell = true;
    $scope.currencySearchInputHideSell = true;


    $scope.$watch('orderRate', function () {
        if ($scope.orderRate > $scope.min && $scope.orderRate < $scope.max) {
            $scope.min = $scope.min;
            $scope.max = $scope.max;

        } else {
            $scope.$on("myEvent3", function (event, args) {
                $scope.orderRate = args;
            });
            $scope.min = ($scope.orderRate * 0.95);
            $scope.max = ($scope.orderRate * 1.05);
            document.getElementById("slider").value = $scope.orderRate;
            document.getElementById("slider1").value = $scope.orderRate;
            //document.getElementById("change_limit_rate").value=$scope.orderRate;
        }
    });

    $scope.$watch('orderRate2', function () {
        if ($scope.orderRate2 > $scope.min2 && $scope.orderRate2 < $scope.max2) {
            $scope.min2 = $scope.min2;
            $scope.max2 = $scope.max2;

        } else {
            $scope.$on("myEvent3", function (event, args) {
                $scope.orderRate2 = args;
            });
            $scope.min2 = ($scope.orderRate2 * 0.95);
            $scope.max2 = ($scope.orderRate2 * 1.05);
            document.getElementById("slider2").value = $scope.orderRate2;
        }
    });

    $scope.$watch('newRate2', function () {
        if ($scope.newRate2 > $scope.min2 && $scope.newRate2 < $scope.max2) {
            $scope.min2 = $scope.min2;
            $scope.max2 = $scope.max2;

        } else {
            $scope.$on("myEvent3", function (event, args) {
                $scope.newRate2 = args;
            });
            $scope.min2 = ($scope.newRate2 * 0.95);
            $scope.max2 = ($scope.newRate2 * 1.05);
            document.getElementById("slider2").value = $scope.newRate2;
        }
    });

    $scope.pairs = CurrencyPairs;

    $scope.pairChoiseBuy = CurrencyPairs.cast[0];

    $scope.choosePairBuy = function (pairChosen) {
        $scope.pairChoiseBuy = pairChosen.pair;
        $scope.hideSearchInputBuy();
    }

    $scope.showSearchInputBuy = function (element) {
        if (typeof $scope.search != "undefined") {
            $scope.search.title = [];
        }
        $scope.currencySearchInputBuy = false;
        $scope.currencySearchInputHideBuy = false;
        var countUp = function () {
            document.getElementById('currSelectorBuy').focus();
        }
        $timeout(countUp, 200);
    }

    $scope.hideSearchInputBuy = function () {
        $scope.currencySearchInputHideBuy = true;
        var countUp = function () {
            $scope.currencySearchInputBuy = true;
        }
        $timeout(countUp, 200);
    }


    $scope.pairChoiseSell = CurrencyPairs.cast[0];
    $scope.choosePairSell = function (pairChosen) {
        $scope.pairChoiseSell = pairChosen.pair;
        $scope.hideSearchInputSell();
    }

    $scope.showSearchInputSell = function (element) {
        if (typeof $scope.search != "undefined") {
            $scope.search.title = [];
        }
        $scope.currencySearchInputSell = false;
        $scope.currencySearchInputHideSell = false;
        var countUp = function () {
            document.getElementById('currSelectorSell').focus();
        }
        $timeout(countUp, 200);
    }

    $scope.hideSearchInputSell = function () {
        $scope.currencySearchInputHideSell = true;
        var countUp = function () {
            $scope.currencySearchInputSell = true;
        }
        $timeout(countUp, 200);
    }

}

