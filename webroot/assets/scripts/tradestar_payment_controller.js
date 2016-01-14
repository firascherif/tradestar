/**
 * Created by dharani kumar p(dharani.kumar@gmail.com) on 20-08-2015.
 */
angular.module('tradestar').controller('PaymentController', function ($scope, $modalInstance, vertxEventBusService, context) {
        console.info("Inside the definition of the PaymentController " + JSON.stringify(context));

        $scope.stripeCallback = function (code, result) {
            console.info("Inside stripeCallback with code " + JSON.stringify(code));

            if (result.error) {
                console.error("Stripe call returned with error " + result.error.message);
            } else {
                console.info('Success! Token obtained from stripe: ' + result.id);
                var params = {
                    "token": result.id,
                    "currency": "cad",
                    "numChips": context.numChips,
                    "username": context.playerInfo.username,
                    "balance": context.playerInfo.balance,
                    "amount": context.amount,
                    "sessionID": context.sessionID
                };
                vertxEventBusService.send('ChargePayment', params).then(function (reply) {
                    console.log("Reply for ChargePayment " + JSON.stringify(reply));

                    //$scope.$apply(function(){

                        $scope.paymentInProgress = false;
                        $scope.paymentDone = true;

                        if (reply.status == "ok") {
                            $scope.paymentSucceeded = true;
                            console.log("Payment completed successfully for the user " + context.playerInfo.username);
                            $scope.numChips = context.numChips;
                        } else {
                            $scope.paymentFailed = true;
                            $scope.paymentError = reply.message;
                        }
                    //});
                }).catch(function(){
                    console.error("No response received for ChargePayment in 10 seconds");
                });

                $scope.paymentInProgress = true;
                $scope.paymentDone = false;
                $scope.paymentSucceeded = false;
                $scope.paymentFailed = false;
            }
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.close = function() {
            $modalInstance.dismiss('closed');
        };
    }
);