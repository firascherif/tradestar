/**
 * Created by dharani kumar p(dharani.kumar@gmail.com) on 21-08-2015.
 */

angular.module('tradestar').controller('AccountController', ['$scope', '$modal', '$cookies', function ($scope, $modal, $cookies) {
    console.log("Initialization of AccountController, $scope " + $scope + ", $modal " + $modal + ", $cookies " + $cookies);

    $scope.buyOptions = [
        {numChips: 512500, amount: 111, currency: "CAD"},
        {numChips: 2600000, amount: 557, currency: "CAD"},
        {numChips: 5200000, amount: 11114, currency: "CAD"},
        {
            numChips: 43000000,
            amount: 27860,
            currency: "CAD",
            messageLine1: "(was $12,812,500)",
            messageLine2: "+100% 1-day XP Boost"
        },
        {
            numChips: 203000000,
            amount: 83580,
            currency: "CAD",
            messageLine1: "(was $38,437,500)",
            messageLine2: "+200% 1-day XP Boost"
        },
        {
            numChips: 410000000,
            amount: 139290,
            currency: "CAD",
            messageLine1: "(was $64,062,500)",
            messageLine2: "+350% 1-day XP Boost"
        }
    ];

    $scope.selectedBuyOption = {};

    $scope.setSelectedBuyOption = function (buyOption) {
        $scope.selectedBuyOption = buyOption;
    };

    $scope.openPaymentDialog = function () {
        console.info("Inside AccountController.openPaymentDialog()");
        console.info("lets print parent scope " + JSON.stringify($scope.$parent.playerInfo));

        var playerInfo = $scope.$parent.playerInfo;
        console.info("playerInfo " + JSON.stringify(playerInfo));

        var modalInstance = $modal.open({
            animation: true,
            templateUrl: '../../partials/payments_credit_card.html',
            controller: 'PaymentController',
            size: 'lg',
            resolve: {
                context: function () {
                    console.log("Context resolver function.");

                    var contextVals = {
                        "playerInfo": playerInfo,
                        "numChips": $scope.selectedBuyOption.numChips,
                        "sessionID": $cookies.sessionID,
                        "amount": $scope.selectedBuyOption.amount,
                        //"eb": $scope.$parent.eb,
                        "currency": $scope.selectedBuyOption.currency
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
    }
}]);