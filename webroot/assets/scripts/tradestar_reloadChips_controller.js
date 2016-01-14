/**
 * Created by dharani kumar p (dharani.kumar@gmail.com) on 25-08-2015.
 */
angular.module('tradestar').controller('ReloadChipsController', function ($scope, $modalInstance, vertxEventBusService, context) {
    console.info("Inside the definition of the ReloadChipsController " + JSON.stringify(context));

    if (context.reloadNotPossible == true) {
        $scope.reloadNotPossible = true;
        $scope.timeRemainingInSecs = context.timeRemainingInSecs;
        $scope.reloadPossible = false;
    } else {
        $scope.reloadPossible = true;
    }

    $scope.onYes = function () {
        console.info("Inside onYes with code");

        var address = "PerformBalanceTopup";
        var params = {
            "username": context.playerInfo.username,
            "balance": context.playerInfo.balance,
            "sessionID": context.sessionID
        };
        vertxEventBusService.send(address, params).then(function (reply) {
            console.log("Reply for " + address + " handler " + JSON.stringify(reply));
            //$scope.$apply(function () {

                $scope.reloadCompleted = true;
                $scope.reloadInProgress = false;

                if (reply.status == "ok") {
                    $scope.reloadSuccess = true;
                    $scope.reloadPossible = false;
                } else {
                    $scope.reloadPossible = false;
                    $scope.reloadFailed = true;
                    $scope.message = reply.message;
                }
            //});
        }).catch(function(){
            console.error("No response for " + address + " in 10 seconds.");
        });

        $scope.reloadInProgress = true;
    };

    $scope.onNo = function () {
        $modalInstance.dismiss('no');
    };
});