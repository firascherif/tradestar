/**
 * Created by dharani kumar p (dharani.kumar@gmail.com) on 20-08-2015.
 */
angular.module('tradestar').controller('chatCtrl', ['$scope', function ($scope) {
    $scope.globalChat = [
        {
            username: 'Scott Stevens',
            userImgUrl: 'http://api.randomuser.me/portraits/men/49.jpg',
            postType: 'message to',
            massageTo: 'Mary Jeanne',
            message: 'Hi, It\'s been a while, where have you been...',
            messageTime: '2 min ago'
        },
        {
            username: 'Seth Frazier',
            userImgUrl: 'http://api.randomuser.me/portraits/men/97.jpg',
            postType: 'image with',
            massageTo: 'Marine Lelouch',
            message: '',
            messageTime: '2 min ago'
        },
        {
            username: 'Jean Myers',
            userImgUrl: 'http://api.randomuser.me/portraits/women/90.jpg',
            postType: 'video',
            massageTo: '',
            message: '',
            messageTime: '2 min ago'
        },
        {
            username: 'Jean Myers',
            userImgUrl: 'http://api.randomuser.me/portraits/women/90.jpg',
            postType: 'video',
            massageTo: '',
            message: '',
            messageTime: '2 min ago'
        }
    ];

    $scope.addGlobalPost = function () {
        console.log($scope.globalChatMsg);
        $scope.globalChat.unshift({
            username: $scope.Auth.userName,
            userImgUrl: $scope.Auth.image,
            postType: 'message',
            massageTo: '',
            message: $scope.globalChatMsg,
            messageTime: 'now'
        });
        $scope.globalChatMsg = [];
    };
}]);