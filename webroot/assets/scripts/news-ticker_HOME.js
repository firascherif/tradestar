var da;

function my_expandNews(da){
    var cb = $( da ).clone();
    var myhome_Div = $("<div id='myhome_Div' />");

    $(myhome_Div).append( cb );
    $("#my_news").append( myhome_Div );

    $("#my_feedList, .my_contentSnippet").css('display','none');
    $('.my_postContent, .my_closeNewsItem').css("display", "block");
    $(".my_newsItem").css({'width':'100%','overflow':'auto','cursor':'initial'});
    $("#my_news li").css({'height':'210px'});
    $(cb).removeAttr("onclick");
};

function my_closeNews(v){
    //$( "#myhome_Div" ).empty();
    $( "#myhome_Div" ).remove();


    $("#my_feedList,.my_contentSnippet").css('display','block');
    $('.my_postContent, .my_closeNewsItem').css("display", "none");
    $(".my_newsItem").css({'width':'100%','overflow':'','cursor':'pointer'});
    $("#my_news li").css({'height':'70px'});
};