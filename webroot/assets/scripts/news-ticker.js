var a;

function expandNews(a){
    var b = $( a ).clone();
    var myDiv = $("<div id='myDiv' />");

    $(myDiv).append( b );
    $("#news").append( myDiv );

    $("#feedList, .contentSnippet").css('display','none');
    $('.postContent, .closeNewsItem').css("display", "block");
    $(".newsItem").css({'width':'100%','overflow':'auto','cursor':'initial'});
    $("#news li").css({'height':'210px'});
    $(b).removeAttr("onclick");
};

function closeNews(v){
    //$( "#myDiv" ).empty();
    $( "#myDiv" ).remove();


    $("#feedList,.contentSnippet").css('display','block');
    $('.postContent, .closeNewsItem').css("display", "none");
    $(".newsItem").css({'width':'100%','overflow':'','cursor':'pointer'});
    $("#news li").css({'height':'70px'});
};