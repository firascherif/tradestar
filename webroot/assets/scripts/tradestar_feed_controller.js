/**
 * Created by dharani kumar p (dharani.kumar@gmail.com) on 20-08-2015.
 */

angular.module('tradestar').factory('FeedLoader', ['$resource', function ($resource) {
    return $resource('http://ajax.googleapis.com/ajax/services/feed/load', {}, {
        fetch: {method: 'JSONP', params: {v: '1.0', callback: 'JSON_CALLBACK'}}
    });
}]).factory('counterUpdate', function () {
    return {
        init: function (from, to, step, target, diff) {
            var counter = from;
            var gainRemaining = diff;
            var gainUp = true;
            console.log("FROM: " + from + " TO: " + to + " DISTANCE: " + diff);
            if (from > to)
                gainUp = false;
            var timer = setInterval(function () {
                if (gainUp)
                    counter += step;
                else
                    counter -= step;
                gainRemaining -= step;
                var addrGain = "#counter_newBalance" + target;
                $(addrGain).text(counter.toFixed(2)).formatCurrency();
                var addrCounter = ".counter_gain" + target;
                $(addrCounter).text(gainRemaining.toFixed(2)).formatCurrency();

                if (gainRemaining <= 0)
                    clearInterval(timer);
            }, 30);

        }
    };
});

angular.module('tradestar').controller('FeedCtrl', ['FeedLoader', '$scope', function (FeedLoader, $scope) {
    var getFeed = function () {
        $scope.feeds = [];
        var feedSources = [
            {title: 'Slashdot', url: 'http://www.ft.com/rss/companies/financials'},
            {title: 'Tweakers', url: 'http://xml.fxstreet.com/news/forex-news/index.xml'},
            //{title: 'Wired', url: 'http://www.forbes.com/markets/index.xml'}
        ];
        for (var i = 0; i < feedSources.length; i++) {
            FeedLoader.fetch({q: feedSources[i].url, num: 5}, {}, function (data) {

               // console.log(i)

//console.log(JSON.stringify(data));

                var feed = data.responseData.feed;
                var sourceTitle = feed.title;
                feed = feed.entries;
                feed.forEach(function (feed) {
                    var d = new Date(feed.publishedDate);
                    var n = d.getTime();
                    //console.log(d);
                    feed.sourceTitle = sourceTitle;
                    feed.publishedDate = n;
                    $scope.feeds.push(feed);
                });

            });
        }
        return $scope.feeds;
    };
    $scope.feeds = getFeed();

    $scope.startTicker = function () {
        dd = $('#feedList').easyTicker({
            direction: 'down',
            //easing: 'easeInOutBack',
            speed: 'slow',
            interval: 3000,
            visible: 3,
            mousePause: 1
        }).data('easyTicker');

        ddd = $('#my_feedList').easyTicker({
            direction: 'down',
            //easing: 'easeInOutBack',
            speed: 'slow',
            interval: 3000,
            visible: 3,
            mousePause: 1
        }).data('easyTicker');
    };

    $scope.setting_tableChange = function (form) {
        $scope.$apply(function () {
            $scope.setting_tableForm = form;
            alert("NEW TABLE : " + form);
        });
    };
    //alert($("image-picker2").data('picker').val);
    $scope.startTicker();

    //var  feedInterval = setInterval( function(){ $scope.feeds = getFeed()}, 8000);
}]);


