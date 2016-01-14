$scope.startGame = function (table) {
        $scope.buy_max = 1000000;
        $scope.sell_max = 1000000;
        $scope.players_board.length = 0;
        $('#timerAndrew').TimeCircles({start: false});
        $('#timerAndrew').data("timer", (0)).TimeCircles().restart().rebuild();
        //$scope.ready_go = "Waiting for Players";

        $scope.players_list.length = 0;
        $scope.players_list_details.length = 0;
        $scope.nb_players = 0;
        $scope.tab_position.length = 0;
        $scope.tchat_messages.length = 0;

        var add_history = $cookies.playerID + "." + table + ".History";
        vertxEventBusService.on(add_history, function (msg) {
            //console.log(msg);

            $scope.historyLog.push(msg);
            //console.log($scope.historyLog);
        });

        var addrHitAndRunNote = $cookies.playerID + "." + $cookies.currentTable + '.HitAndRunNotifications';
        vertxEventBusService.on(addrHitAndRunNote, function (reply) {
//            console.log("HANDLER WORKING");
//            console.log(reply);
            var winnerPlayer = reply.allPlayersRanking[0].userName;
            var winnerPlayer_picture = reply.allPlayersRanking[0].imgUrl;

            var myVideo = "";
            if (reply.winner) {
                $.gritter.add({
                    // (string | mandatory) the heading of the notification
                    title: 'Felicitation, you won!',

                    image: '../assets/images/gritter/trophyGold.png',
                    // (string | mandatory) the text inside the notification
                    //text: 'Your request to '+type+' '+volume+' of USDHKD was filled at 1.3589.'
                    text: 'You have been in first position. You won the game!'
                });
                myVideo = document.getElementById("thevideo_win");
                $scope.modal_end = "win";
            }
            else {
                $.gritter.add({
                    // (string | mandatory) the heading of the notification
                    title: 'The winner is ' + winnerPlayer,

                    image: winnerPlayer_picture,
                    // (string | mandatory) the text inside the notification
                    //text: 'Your request to '+type+' '+volume+' of USDHKD was filled at 1.3589.'
                    text: 'You not been on first position'
                });
                myVideo = document.getElementById("thevideo_loose");
                $scope.modal_end = "loose";
            }


            if (reply.end || reply.winner) {
                $scope.rankingPlayers = reply.allPlayersRanking;
                //$scope.rankingPlayers.reverse();

                //$scope.$apply(function () {
                setTimeout(function () {
                    myVideo.play();
                    $scope.clearChartUserData();
                }, 500);

                setTimeout(function () {
                    $('#endModal_part2').removeClass('ng-hide');
                    $('.end_videoBlock').addClass('ng-hide');
                    $scope.modal_end = true;
                    console.log("RANK END : " + reply.rank);

                    if (reply.winner) {
                        $scope.$apply(function () {
                            setTimeout(function () {
                                $('#showStarOne').removeClass('ng-hide');
                                setTimeout(function () {
                                    $('#showStarTwo').removeClass('ng-hide');
                                    setTimeout(function () {
                                        $('#showStarThree').removeClass('ng-hide');
                                    }, 500);
                                }, 1000);
                            }, 1500);
                        });


                    }

                    setTimeout(function () {
                        for (var i = 0; i < $scope.rankingPlayers.length; i++) {
                            console.log("balance player: " + $scope.rankingPlayers[i].balance);
                            console.log($scope.rankingPlayers[i]);
                            $scope.balanceTransfer($scope.rankingPlayers[i].balance,
                                $scope.rankingPlayers[i].balance + $scope.tableInfos.buyIn, i);
                        }
                    }, 5000);

                }, 17000);
                //});
            }
        });

        var addrEliminatorNote = $cookies.playerID + "." + $cookies.currentTable + '.EliminatorNotifications';
        vertxEventBusService.on(addrEliminatorNote, function (reply) {
            //chaque jouer recois un message quand le temp de paix est fini.
            if (reply.hasOwnProperty("peace")) {
                $.gritter.add({
                    title: 'War begin',
                    image: '../assets/images/gritter/favicon-white.png',
                    text: 'Peace time ended !'
                });
            }

            //Une notification est envoyer a chaque jouere qui est encore dans la game quand un autre joueur est eliminer
            if (reply.hasOwnProperty("playerEliminated")) {
                var eliminatePlayer = reply.userName;
                var eliminatePlayer_picture = "../" + reply.imgUrl;
                console.log("NEW PLAYER ELIMANATED : " + eliminatePlayer + " with picture " + eliminatePlayer_picture);

                var stringGritterEliminated = eliminatePlayer + " has been Eliminated!"
                $.gritter.add({
                    // (string | mandatory) the heading of the notification
                    title: stringGritterEliminated,

                    image: eliminatePlayer_picture,
                    text: 'Peace time ended. Trade for miss elimination!'
                });
                for (var i = 0; i < $scope.players_list.length; i++) {
                    if (eliminatePlayer == $scope.players_list[i].userName) {
                        $scope.players_list[i].out = true;
                    }
                }
            }

            if (reply.hasOwnProperty("end")) {
                ////////////////***************Changement****************///////////////
                //var addrGetElimminatedPlayers = $cookies.currentTable+".EliminatedPlayers";
                //$scope.eb.send(addrGetElimminatedPlayers, {}, function(replyEliminate) {
                //$scope.$apply(function () {
                $scope.rankingPlayers = reply.allPlayersRanking;
                //});
                var winnerPlayer = $scope.rankingPlayers[0].userName;
                var winnerPlayer_picture = "../" + $scope.rankingPlayers[0].imgUrl;

                //$scope.rankingPlayers = replyEliminate;

                $scope.rankingPlayers[0].balance = $scope.rankingPlayers[0].balance - (($scope.rankingPlayers.length - 1) * $scope.tableInfos.buyIn);
                for (var i = 1; i < $scope.rankingPlayers.length; i++) {
                    $scope.rankingPlayers[i].balance += $scope.tableInfos.buyIn;
                }

                console.log("ELIMINATOR, END GAME");
                console.log("WINNER STATS : " + winnerPlayer + " / " + winnerPlayer_picture);
                console.log("ALL PLAYER ELIMINATE");
                console.log($scope.rankingPlayers);

                var myVideo = "";
                if (winnerPlayer == $cookies.playerName) {
                    $.gritter.add({
                        // (string | mandatory) the heading of the notification
                        title: 'Felicitation, you won!',

                        image: '../assets/images/gritter/trophyGold.png',
                        // (string | mandatory) the text inside the notification
                        //text: 'Your request to '+type+' '+volume+' of USDHKD was filled at 1.3589.'
                        text: 'You have been in first position. You won the game!'
                    });
                    myVideo = document.getElementById("thevideo_win");
                    $scope.modal_end = "win";
                }
                else {
                    $.gritter.add({
                        // (string | mandatory) the heading of the notification
                        title: 'The winner is ' + winnerPlayer,

                        image: winnerPlayer_picture,
                        // (string | mandatory) the text inside the notification
                        //text: 'Your request to '+type+' '+volume+' of USDHKD was filled at 1.3589.'
                        text: 'You not been on first position'
                    });
                    myVideo = document.getElementById("thevideo_loose");
                    $scope.modal_end = "loose";
                }

                //$scope.$apply(function () {
                setTimeout(function () {
                    myVideo.play();
                    $scope.clearChartUserData();
                }, 500);

                setTimeout(function () {
                    $('#endModal_part2').removeClass('ng-hide');
                    $('.end_videoBlock').addClass('ng-hide');
                    $scope.modal_end = true;
                    console.log("RANK END : " + reply.rank);

                    if (winnerPlayer == $cookies.playerName) {
                        $scope.$apply(function () {
                            setTimeout(function () {
                                $('#showStarOne').removeClass('ng-hide');
                                setTimeout(function () {
                                    $('#showStarTwo').removeClass('ng-hide');
                                    setTimeout(function () {
                                        $('#showStarThree').removeClass('ng-hide');
                                    }, 500);
                                }, 1000);
                            }, 1500);
                        });
                    }

                    else if (1) {
                        $scope.$apply(function () {
                            setTimeout(function () {
                                $('#showStarOne').removeClass('ng-hide');
                                setTimeout(function () {
                                    $('#showStarTwo').removeClass('ng-hide');

                                }, 500);
                            }, 1000);
                        });
                    }

                    setTimeout(function () {

                        $scope.balanceTransfer($scope.rankingPlayers[0].balance, $scope.rankingPlayers[0].balance + ($scope.rankingPlayers.length - 1) * $scope.tableInfos.buyIn, 0);
                        for (var i = 1; i < $scope.rankingPlayers.length; i++) {
                            $scope.balanceTransfer($scope.rankingPlayers[i].balance, $scope.rankingPlayers[i].balance - $scope.tableInfos.buyIn, i);
                        }
                    }, 5000);

                }, 17000);
                //});
                //});
            }

            //le jour elminier recevra ce message
            if (reply.hasOwnProperty("elimination")) {
                $.gritter.add({
                    // (string | mandatory) the heading of the notification
                    title: 'You are eliminated',

                    image: '../assets/images/gritter/trophySilver.png',
                    // (string | mandatory) the text inside the notification
                    //text: 'Your request to '+type+' '+volume+' of USDHKD was filled at 1.3589.'
                    text: 'You have been in last position. You are eliminated, try again.'
                });
            }


            //Les jouer qui attend que le leader fait un choix recois la kle "waitingForPick"
            //Presente les avec un modal qui dit que le leader est en train de faire un chois
            if (reply.hasOwnProperty("waitForPick")) {
                if (reply.pauseCounter == 28) {
                    $.gritter.add({
                        // (string | mandatory) the heading of the notification
                        title: 'Elimination time, felicitation for ' + reply.userName,

                        image: '../assets/images/gritter/favicon-white.png',
                        // (string | mandatory) the text inside the notification
                        //text: 'Your request to '+type+' '+volume+' of USDHKD was filled at 1.3589.'
                        text: 'The leadership pick a player to eliminate.'
                    });
                }
                console.log("WAITING A ELIMINATE PLAYER PLAYER!" + reply.pauseCounter);
            }

            //Seulement le leader recevra un message qui contien la kle "makeAPick"
            //Presente lui un modal avec le chois de jouer
            // utilise la fonction "eliminate" (juste en bas) pour envoyer le chois au back end
            if (reply.hasOwnProperty("makeAPick")) {
                //Le leader recevra un countdown de 30 jusqua 0, utilise la kle "pauseCounter" pour recevoir
                //ce countdown. Le countdown se termine a 0, ou au moment que le back end recois son chois
                console.log("PICK A PLAYER!" + reply.pauseCounter);
                if (!$scope.modal_eliminatorPlayers) {
                    var addrTableInfoPlayer = $cookies.currentTable + ".PlayersInfo";
                    vertxEventBusService.send(addrTableInfoPlayer, {}).then(function (msg) {
                        //$scope.$apply(function () {
                        $scope.players_list_eliminate = [];
                        //});
                        for (var i = 0; i < msg.length; i++) {
                            ////////////////***************Changement****************///////////////
                            if (!msg[i].eliminated) {
                                //$scope.$apply(function () {
                                $scope.players_list_eliminate.push({
                                    "userName": msg[i].userName,
                                    "flagUrl": msg[i].flagUrl,
                                    "imgUrl": msg[i].imgUrl,
                                    "level": Math.floor(msg[i].level),
                                    "freeVolume": 1000000
                                });
                                //});
                            }
                        }
                    }).catch(function () {
                        $scope.errorFuncHolder.handler(addrTableInfoPlayer);
                    });
                }
                $scope.modal_eliminatorPlayers = true;
            }
        });


        $scope.eliminatePlayer = function (playerPicked) {
            var addrEliminatePlayer = $cookies.currentTable + ".Eliminator";

            $scope.modal_eliminatorPlayers = false;
            vertxEventBusService.send(addrEliminatePlayer, {"userName": playerPicked}).then(function (reply) {
            }).catch(function () {
                $scope.errorFuncHolder.handler(addrEliminatePlayer);
            });
        }

        var addrSurvivorNote = $cookies.playerID + "." + $cookies.currentTable + '.SurvivorNotifications';
        vertxEventBusService.on(addrSurvivorNote, function (reply) {
            //chaque jouer recois un message quand le temp de paix est fini.
            if (reply.hasOwnProperty("peace")) {
                console.log("peace time end")
            }

            //Une notification est envoyer a chaque jouere qui est encore dans la game quand un autre jouere est eliminer
            if (reply.hasOwnProperty("playerEliminated")) {
                console.log(reply);
                var playerLeft = reply.userName;
                $.gritter.add({
                    // (string | mandatory) the heading of the notification
                    title: "Good by " + playerLeft,

                    image: '../assets/images/gritter/favicon-white.png',
                    // (string | mandatory) the text inside the notification
                    //text: 'Your request to '+type+' '+volume+' of USDHKD was filled at 1.3589.'
                    text: playerLeft + " been in last position. He must to leave the table."
                });

                $('.content_name').each(function () {
                    if ($(this).text() == playerLeft) {
                        var element = $(this).parent();
                        $(element).parent().css('background', 'RGBA(0,0,0,0.5');
                        $(this).append("<span style='color: red; margin-left: 2em;'>OUT</span>");
                    }
                });
            }

            //le jour elminier recevra ce message
            if (reply.hasOwnProperty("elimination")) {
                $.gritter.add({
                    // (string | mandatory) the heading of the notification
                    title: 'You are eliminated',

                    image: '../assets/images/gritter/favicon-white.png',
                    // (string | mandatory) the text inside the notification
                    //text: 'Your request to '+type+' '+volume+' of USDHKD was filled at 1.3589.'
                    text: 'You have been in last position. You are eliminated, try again.'
                });

                $('.content_name').each(function () {
                    if ($(this).text() == $cookies.playerName) {
                        var element = $(this).parent();
                        $(element).parent().css('background', 'RGBA(0,0,0,0.5');
                        $(this).append("<span style='color: red; margin-left: 2em;'>OUT</span>");
                    }
                });
                $scope.clearChartUserData();
            }
            if (reply.hasOwnProperty("end")) {
                ////////////////***************Changement****************///////////////
                $scope.rankingPlayers = reply.allPlayersRanking;
                console.log($scope.rankingPlayers);
                if ($scope.rankingPlayers[0].userName == $cookies.playerName) {
                    $.gritter.add({
                        // (string | mandatory) the heading of the notification
                        title: 'Felicitation, you won!',

                        image: '../assets/images/gritter/trophyGold.png',
                        // (string | mandatory) the text inside the notification
                        //text: 'Your request to '+type+' '+volume+' of USDHKD was filled at 1.3589.'
                        text: 'You have been in first position. You won the game!'
                    });
                    myVideo = document.getElementById("thevideo_win");
                    $scope.modal_end = "win";
                } else {
                    $.gritter.add({
                        // (string | mandatory) the heading of the notification
                        title: 'Sorry, you are not first this time!',

                        image: '../assets/images/gritter/trophySilver.png',
                        // (string | mandatory) the text inside the notification
                        //text: 'Your request to '+type+' '+volume+' of USDHKD was filled at 1.3589.'
                        text: 'You not been on first position'
                    });
                    myVideo = document.getElementById("thevideo_loose");
                    $scope.modal_end = "loose";
                }
                //$scope.$apply(function () {
                setTimeout(function () {
                    myVideo.play();
                    $scope.clearChartUserData();
                }, 500);

                setTimeout(function () {
                    $('#endModal_part2').removeClass('ng-hide');
                    $('.end_videoBlock').addClass('ng-hide');
                    $scope.modal_end = true;
                }, 15000);

                setTimeout(function () {
                    $('#endModal_part2').removeClass('ng-hide');
                    $('.end_videoBlock').addClass('ng-hide');
                    $scope.modal_end = true;
                    var ranked = 0;
                    for (var i = 0; i < $scope.rankingPlayers.length; i++) {
                        if ($scope.rankingPlayers[i].userName == $cookies.playerName) {
                            ranked = i;
                        }
                    }
                    ranked++;
                    console.log("MY RANK : " + ranked)
                    if (ranked == 1) {
                        $scope.$apply(function () {
                            setTimeout(function () {
                                $('#showStarOne').removeClass('ng-hide');
                                setTimeout(function () {
                                    $('#showStarTwo').removeClass('ng-hide');
                                    setTimeout(function () {
                                        $('#showStarThree').removeClass('ng-hide');
                                    }, 500);
                                }, 1000);
                            }, 1500);
                        });


                    }
                    else if (ranked == 2) {
                        $scope.$apply(function () {
                            setTimeout(function () {
                                console.log("ETOILE 1" + $scope.currentPosEnd);
                                $('#showStarOne').removeClass('ng-hide');
                                setTimeout(function () {
                                    $('#showStarTwo').removeClass('ng-hide');
                                    console.log("ETOILE 2" + $scope.currentPosEnd);
                                }, 500);
                            }, 1000);
                        });
                    }
                    setTimeout(function () {
                        $scope.balanceTransfer($scope.rankingPlayers[0].balance - ($scope.rankingPlayers.length - 1) * $scope.tableInfos.buyIn, $scope.rankingPlayers[0].balance, 0);
                        for (var i = 1; i < $scope.rankingPlayers.length; i++) {
                            $scope.balanceTransfer($scope.rankingPlayers[i].balance + $scope.tableInfos.buyIn, $scope.rankingPlayers[i].balance, i);
                        }
                    }, 4000);
                }, 17000);
                //});
            }

            //le winner recevra ce message quant il gagne

            //if (reply.hasOwnProperty("win")) {
            //    $.gritter.add({
            //        // (string | mandatory) the heading of the notification
            //        title: 'Felicitation, you won!',
            //
            //        image: '../assets/images/gritter/favicon-white.png',
            //        // (string | mandatory) the text inside the notification
            //        //text: 'Your request to '+type+' '+volume+' of USDHKD was filled at 1.3589.'
            //        text: 'You have been in first position. You won the game!'
            //    });
            //
            //    myVideo = document.getElementById("thevideo_win");
            //    $scope.modal_end = "win";
            //
            //    $scope.$apply(function () {
            //        setTimeout(function () {
            //            myVideo.play();
            //
            //        }, 500);
            //
            //        setTimeout(function () {
            //            $scope.modal_end_part2 = true;
            //            $scope.modal_end = true;
            //        }, 15000);
            //    });
            //    $scope.clearChartUserData();
            //}


        });


        var addrReqStart = table + ".GameStart";
        var gameStartHandler = function (msg) {
            //$scope.$apply(function () {
            //$('#chart-holder').css('background',
            //    'url("../assets/images/trading_floor/table_black.png") no-repeat center center')
            //    .css('background-size', '88% 96%');
            $('#startModal_window').css('opacity', '1');


            $scope.modal_start = true;
            $scope.start_game_stat = msg;
            console.log(msg);
            if (msg == "modalOff") {
                console.log('modalOff');
                //$('#chart-holder').css('background',
                //    'url("../assets/images/trading_floor/table_rect.png") no-repeat center center')
                //    .css('background-size', '88% 96%');
                $('#startModal_window').css('opacity', '2');
                $scope.modal_start = false;
            }
            //});
        }
        vertxEventBusService.on(addrReqStart, gameStartHandler);

        //NEW
        /*
         var addrChat = table + ".ReceiveChatMessage";
         $scope.eb.registerHandler(addrChat, function (msg) {
         $scope.$apply(function () {
         $scope.tchat_messages.push(msg);
         $scope.unreadMessages = $scope.unreadMessages + 1;
         });
         var myDiv = document.getElementById("chat_message_box");
         myDiv.scrollTop = myDiv.scrollHeight;
         });
         */

        /*
         var addrVolume = table + ".Volumes";
         $scope.eb.registerHandler(addrVolume, function (msg) {
         for (var i = 0; i < $scope.players_list.length; i++) {
         if (msg.userName == $scope.players_list[i].userName) {
         $scope.$apply(function () {
         $scope.players_list[i].freeVolume = msg.freeVolume;
         });

         if (msg.userName == $cookies.playerName) {
         $scope.update_slider($scope.players_list[i].freeVolume);
         }
         }
         }

         });
         */

        /*
         var addrTimer = table + ".Timer";
         $scope.eb.registerHandler(addrTimer, function (msg) {
         if (msg.tableTimer == $scope.currentTable && msg.gameType == "Fourty four")
         $('#timerAndrew').data("timer", (msg.timeRemaining) / 1000).TimeCircles()
         .restart();
         else {
         $('#timerAndrew').data("timer", (msg.roundTimeRemaining) / 1000).TimeCircles()
         .restart();
         }
         });
         */

        /*
         var addrTrades = $cookies.playerID + "." + table + ".Trades";
         $scope.eb.registerHandler(addrTrades, function (msg) {

         for (var i = 0; i < msg.length; i++) {
         $scope.$apply(function () {
         $scope.tab_position[i].gain = msg[i].tradeGain;
         $scope.tab_position[i].tradeCurrency = msg[i].tradeCurrency
         $scope.tab_position[i].tradeVolume = msg[i].tradeVolume;
         $scope.tab_position[i].tradePrice = msg[i].tradePrice;
         });
         }
         });

         $scope.getTableInfos(table);
         */

        /*
         var addrPlayerInfo = table + ".PlayersInfo";
         $scope.eb.send(addrPlayerInfo, {}, function (reply) {
         for (var i = 0; i < reply.length; i++) {
         $scope.$apply(function () {
         $scope.players_list.push({
         "userName": reply[i].userName,
         "flagUrl": reply[i].flagUrl,
         "imgUrl": reply[i].imgUrl,
         "level": Math.floor(reply[i].level),
         "freeVolume": 1000000
         });


         $scope.players_board.push({
         "userName": reply[i].userName,
         "totalVolume": 1000000
         });


         $scope.nb_players++;
         });
         }
         });
         */
        //
        var addrTrades = table + ".LeaderBoard";
        vertxEventBusService.on(addrTrades, function (msg) {
            ////////////////***************Changement****************///////////////
            //$scope.$apply(function () {
            $scope.players_board = msg
            //});
        });

        var addrFourty = $cookies.playerID + '.' + $cookies.currentTable + '.FourtyfourNotifications';
        vertxEventBusService.on(addrFourty, function (reply) {
            var myVideo = "";
            if (reply.rank == 1 && reply.hasOwnProperty("end")) {
                $.gritter.add({
                    // (string | mandatory) the heading of the notification
                    title: 'Felicitation, you won!',

                    image: '../assets/images/gritter/trophyGold.png',
                    // (string | mandatory) the text inside the notification
                    //text: 'Your request to '+type+' '+volume+' of USDHKD was filled at 1.3589.'
                    text: 'You have been in first position. You won the game!'
                });
                myVideo = document.getElementById("thevideo_win");
                $scope.modal_end = "win";
            }
            else if (reply.rank != 1 && reply.hasOwnProperty("end")) {
                $.gritter.add({
                    // (string | mandatory) the heading of the notification
                    title: 'Sorry, you are not first this time!',

                    image: '../assets/images/gritter/trophySilver.png',
                    // (string | mandatory) the text inside the notification
                    //text: 'Your request to '+type+' '+volume+' of USDHKD was filled at 1.3589.'
                    text: 'You not been on first position'
                });
                myVideo = document.getElementById("thevideo_loose");
                $scope.modal_end = "loose";
            }

            if (reply.hasOwnProperty("end")) {
                $scope.rankingPlayers = reply.allPlayersRanking;

                //$scope.$apply(function () {
                setTimeout(function () {
                    myVideo.play();
                    $scope.clearChartUserData();
                }, 500);

                setTimeout(function () {
                    $('#endModal_part2').removeClass('ng-hide');
                    $('.end_videoBlock').addClass('ng-hide');
                    $scope.modal_end = true;
                    console.log("RANK END : " + reply.rank);

                    if (reply.rank == 1) {
                        $scope.$apply(function () {
                            setTimeout(function () {
                                $('#showStarOne').removeClass('ng-hide');
                                setTimeout(function () {
                                    $('#showStarTwo').removeClass('ng-hide');
                                    setTimeout(function () {
                                        $('#showStarThree').removeClass('ng-hide');
                                    }, 500);
                                }, 1000);
                            }, 1500);
                        });


                    }


                    else if (reply.rank == 2) {
                        $scope.$apply(function () {
                            setTimeout(function () {
                                console.log("ETOILE 1" + $scope.currentPosEnd);
                                $('#showStarOne').removeClass('ng-hide');
                                setTimeout(function () {
                                    $('#showStarTwo').removeClass('ng-hide');
                                    console.log("ETOILE 2" + $scope.currentPosEnd);
                                }, 500);
                            }, 1000);
                        });
                    }

                    setTimeout(function () {
                        for (var i = 0; i < $scope.rankingPlayers.length; i++) {
                            console.log("balance player: " + $scope.rankingPlayers[i].balance);
                            console.log($scope.rankingPlayers[i]);
                            $scope.balanceTransfer($scope.rankingPlayers[i].balance,
                                $scope.rankingPlayers[i].balance + $scope.tableInfos.buyIn, i);
                        }
                    }, 5000);

                }, 17000);
                //});
            }
        });

        //var addrEndGame = table+".GameEnd";
        //$scope.eb.registerHandler(addrEndGame, function(msg) {
        //    $scope.$apply(function () {
        //        $scope.update_balance(table, $cookies.playerName);
        //        if(msg == $cookies.playerName) {
        //            myVideo = document.getElementById("thevideo_win");
        //            $scope.modal_end = "win";
        //        }
        //        else {
        //            myVideo = document.getElementById("thevideo_loose");
        //            $scope.modal_end = "loose";
        //        }
        //
        //    });
        //
        //    $scope.$apply(function () {
        //        setTimeout(function () {
        //            myVideo.play();
        //
        //        }, 500);
        //    });
        //
        //
        //    $scope.$apply(function () {
        //        setTimeout(function () {
        //
        //            $scope.modal_end = "";
        //            $scope.changePage('lobby');
        //        }, 20000);
        //    });
        //});

//        $scope.$apply(function () {
//            //setInterval($scope.realTimeUpdate, 1000);
//
//        });


    }