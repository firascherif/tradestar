$(document).ready(function () {


    setInterval(function () {
        var seconds = new Date().getSeconds();
        var sdegree = seconds * 6;
        var srotate = "rotate(" + sdegree + "deg)";

        $("#sec").css({ "-moz-transform": srotate, "-webkit-transform": srotate });

    }, 1000);


    setInterval(function () {
        var hours = new Date().getHours();
        var mins = new Date().getMinutes();
        var hdegree = hours * 30 + (mins / 2);
        var hrotate = "rotate(" + hdegree + "deg)";

        $("#hour").css({ "-moz-transform": hrotate, "-webkit-transform": hrotate });

    }, 1000);


    setInterval(function () {
        var mins = new Date().getMinutes();
        var mdegree = mins * 6;
        var mrotate = "rotate(" + mdegree + "deg)";

        $("#min").css({ "-moz-transform": mrotate, "-webkit-transform": mrotate });

    }, 1000);



    //second clock

    setInterval(function () {
        var seconds = new Date().getSeconds();
        var sdegree = seconds * 6;
        var srotate = "rotate(" + sdegree + "deg)";

        $("#sec2").css({ "-moz-transform": srotate, "-webkit-transform": srotate });

    }, 1000);


    setInterval(function () {
        var hours = new Date().getHours() + 5;
        var mins = new Date().getMinutes();
        var hdegree = hours * 30 + (mins / 2);
        var hrotate = "rotate(" + hdegree + "deg)";

        $("#hour2").css({ "-moz-transform": hrotate, "-webkit-transform": hrotate });

    }, 1000);


    setInterval(function () {
        var mins = new Date().getMinutes();
        var mdegree = mins * 6;
        var mrotate = "rotate(" + mdegree + "deg)";

        $("#min2").css({ "-moz-transform": mrotate, "-webkit-transform": mrotate });

    }, 1000);




    //Third clock

    setInterval(function () {
        var seconds = new Date().getSeconds();
        var sdegree = seconds * 6;
        var srotate = "rotate(" + sdegree + "deg)";

        $("#sec3").css({ "-moz-transform": srotate, "-webkit-transform": srotate });

    }, 1000);


    setInterval(function () {
        var hours = new Date().getHours() + 6;
        var mins = new Date().getMinutes();
        var hdegree = hours * 30 + (mins / 2);
        var hrotate = "rotate(" + hdegree + "deg)";

        $("#hour3").css({ "-moz-transform": hrotate, "-webkit-transform": hrotate });

    }, 1000);


    setInterval(function () {
        var mins = new Date().getMinutes();
        var mdegree = mins * 6;
        var mrotate = "rotate(" + mdegree + "deg)";

        $("#min3").css({ "-moz-transform": mrotate, "-webkit-transform": mrotate });

    }, 1000);




    //Fourth clock

    setInterval(function () {
        var seconds = new Date().getSeconds();
        var sdegree = seconds * 6;
        var srotate = "rotate(" + sdegree + "deg)";

        $("#sec4").css({ "-moz-transform": srotate, "-webkit-transform": srotate });

    }, 1000);


    setInterval(function () {
        var hours = new Date().getHours() + 7;
        var mins = new Date().getMinutes();
        var hdegree = hours * 30 + (mins / 2);
        var hrotate = "rotate(" + hdegree + "deg)";

        $("#hour4").css({ "-moz-transform": hrotate, "-webkit-transform": hrotate });

    }, 1000);


    setInterval(function () {
        var mins = new Date().getMinutes();
        var mdegree = mins * 6;
        var mrotate = "rotate(" + mdegree + "deg)";

        $("#min4").css({ "-moz-transform": mrotate, "-webkit-transform": mrotate });

    }, 1000);




    //Fith clock

    setInterval(function () {
        var seconds = new Date().getSeconds();
        var sdegree = seconds * 6;
        var srotate = "rotate(" + sdegree + "deg)";

        $("#sec5").css({ "-moz-transform": srotate, "-webkit-transform": srotate });

    }, 1000);


    setInterval(function () {
        var hours = new Date().getHours() + 12;
        var mins = new Date().getMinutes();
        var hdegree = hours * 30 + (mins / 2);
        var hrotate = "rotate(" + hdegree + "deg)";

        $("#hour5").css({ "-moz-transform": hrotate, "-webkit-transform": hrotate });

    }, 1000);


    setInterval(function () {
        var mins = new Date().getMinutes();
        var mdegree = mins * 6;
        var mrotate = "rotate(" + mdegree + "deg)";

        $("#min5").css({ "-moz-transform": mrotate, "-webkit-transform": mrotate });

    }, 1000);




    //Sixth clock

    setInterval(function () {
        var seconds = new Date().getSeconds();
        var sdegree = seconds * 6;
        var srotate = "rotate(" + sdegree + "deg)";

        $("#sec6").css({ "-moz-transform": srotate, "-webkit-transform": srotate });

    }, 1000);


    setInterval(function () {
        var hours = new Date().getHours() + 13;
        var mins = new Date().getMinutes();
        var hdegree = hours * 30 + (mins / 2);
        var hrotate = "rotate(" + hdegree + "deg)";

        $("#hour6").css({ "-moz-transform": hrotate, "-webkit-transform": hrotate });

    }, 1000);


    setInterval(function () {
        var mins = new Date().getMinutes();
        var mdegree = mins * 6;
        var mrotate = "rotate(" + mdegree + "deg)";

        $("#min6").css({ "-moz-transform": mrotate, "-webkit-transform": mrotate });

    }, 1000);
});
