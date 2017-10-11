/**
 * Created by lx58 on 10/03/2017.
 */
/*
 *  Project: Banner composer plugin based on PicEdit by Andy V. and fabric.js
 *  Description: Allows user to upload 2 to 4 photos with tools to edit the image on the front-end and compose a collaged banner image.
 *               The html of the draggable canvases and the size of the preview canvas are dynamically generated based on user's choice via click event.
 *               For 2 images, the canvases are 300 x 300 px for a final 600 x 300 px.
 *               For 3 and 4 images, the canvases are 200 x 200 px for a final 600 x 200 px or 800 x 200 px.
 *               4 image banner is scaled down to 600 x 150px at the last step when writing into final preview canvas.
 *               The user can then download the banner image.
 *  Author: Lin Xue
 *  License: MIT
 */

$( document ).ready(function(){
    $('.picedit_box').picEdit( );
    //Initiate Dragula
    dragula([document.getElementById("drag-elements")]);
    var canvasblank = document.getElementById("blank");
    // click event when user choose 2 canvas
    $("#num2").click(function() {
        var newCanvas =
            '<div class="addcanvas" id="addcanvas2"  style="width:300px; height: 300px;"><div class="addcanvastext">Need one more image?</div></div>';
        $("#drag-elements").after(newCanvas);
        $(".picedit_box_preview").width(300);
        $(".picedit_box_preview").height(300);
        var canvas1 = document.getElementById("canvas_preview_1");
        canvas1.width = 300;
        canvas1.height = 300;
        var canvas2 = document.getElementById("canvas_preview_2");
        canvas2.width = 300;
        canvas2.height = 300;
        canvasblank.width = 300;
        canvasblank.height = 300;
        $(".picedit_preview_canvas_box").width(300);
        $(".picedit_preview_canvas_box").height(300);
        $(".previewcanvas").width(300);
        $(".previewcanvas").height(300);
        canvasblank.width = 300;
        canvasblank.height = 300;
        $("#choiceresult").show();
        $("#choice").hide();
    });
    // click event when user choose 3 canvas
    $("#num3").click(function() {
        var newDiv =
            '<div id="_preview_3" class="picedit_box_preview"><div class="picedit_preview_canvas_box"><div class="picedit_canvas"><canvas id="canvas_preview_3" class="previewcanvas"> This text is displayed if your browser does not support HTML5 Canvas</canvas> <button type="button" id="btn_3" class="btn btn-primary btn-lg uploadBtn" data-toggle="modal" data-target="#modal_3">Crop third image. </button></div></div></div>';
        $("#_preview_2").after(newDiv);
        var newCanvas =
            '<div class="addcanvas" id="addcanvas3"  style="width:200px; height: 200px;"><div class="addcanvastext">Need one more image?</div></div>';
        $("#drag-elements").after(newCanvas);
        $(".picedit_box_preview").width(200);
        $(".picedit_box_preview").height(200);
        $(".picedit_preview_canvas_box").width(200);
        $(".picedit_preview_canvas_box").height(200);
        $(".previewcanvas").width(200);
        $(".previewcanvas").height(200);
        var canvas1 = document.getElementById("canvas_preview_1");
        canvas1.width = 200;
        canvas1.height = 200;
        var canvas2 = document.getElementById("canvas_preview_2");
        canvas2.width = 200;
        canvas2.height = 200;
        var canvas3 = document.getElementById("canvas_preview_3");
        canvas3.width = 200;
        canvas3.height = 200;
        canvasblank.width = 200;
        canvasblank.height = 200;
        $("#choice").hide();
        $("#choiceresult").show();
    });
    // click event when user choose 4 canvas
    $("#num4").click(function() {
        var newDiv =
            '<div id="_preview_3" class="picedit_box_preview"><div class="picedit_preview_canvas_box"><div class="picedit_canvas"><canvas id="canvas_preview_3" class="previewcanvas"> This text is displayed if your browser does not support HTML5 Canvas</canvas> <button type="button" id="btn_3" class="btn btn-primary btn-lg uploadBtn" data-toggle="modal" data-target="#modal_3">Crop third image. </button></div></div></div><div id="_preview_4" class="picedit_box_preview"><div class="picedit_preview_canvas_box"><div class="picedit_canvas"><canvas id="canvas_preview_4" class="previewcanvas"> This text is displayed if your browser does not support HTML5 Canvas</canvas><button type="button" id="btn_4" class="btn btn-primary btn-lg uploadBtn" data-toggle="modal" data-target="#modal_4">Crop third image.</button></div></div></div>';
        $("#_preview_2").after(newDiv);
        $(".picedit_box_preview").width(200);
        $(".picedit_box_preview").height(200);
        $(".picedit_preview_canvas_box").width(200);
        $(".picedit_preview_canvas_box").height(200);
        $(".previewcanvas").width(200);
        $(".previewcanvas").height(200);
        $(".picedit_preview_canvas_box").height(200);
        var canvas1 = document.getElementById("canvas_preview_1");
        canvas1.width = 200;
        canvas1.height = 200;
        var canvas2 = document.getElementById("canvas_preview_2");
        canvas2.width = 200;
        canvas2.height = 200;
        var canvas3 = document.getElementById("canvas_preview_3");
        canvas3.width = 200;
        canvas3.height = 200;
        var canvas4 = document.getElementById("canvas_preview_4");
        canvas4.width = 200;
        canvas4.height = 200;
        canvasblank.width = 200;
        canvasblank.height = 200;
        $("#choice").hide();
        $("#choiceresult").show();
    });
    // When add a third canvas
    setTimeout( function() {
        $("#addcanvas2").click( function() {
            var newDiv =
                '<div id="_preview_3" class="picedit_box_preview" style="width: 304px; height: 304px;"><div class="picedit_preview_canvas_box" style="width: 300px; height: 300px;"><div class="picedit_canvas"><canvas id="canvas_preview_3" width="300" height="300" class="previewcanvas"> This text is displayed if your browser does not support HTML5 Canvas</canvas> <button type="button" id="btn_3" class="btn btn-primary btn-lg uploadBtn" data-toggle="modal" data-target="#modal_3">Crop third image. </button></div></div></div>';
            $("#_preview_2").after(newDiv);
            $("#addcanvas2").hide();
        });
        }, 2000);
    // When add a forth canvas
    setTimeout( function() {
        $("#addcanvas3").click( function() {
            var newDiv =
                '<div id="_preview_4" class="picedit_box_preview" style="width: 204px; height: 204px;"><div class="picedit_preview_canvas_box" style="width: 200px; height: 200px;"><div class="picedit_canvas"><canvas id="canvas_preview_4" width="200" height="200" class="previewcanvas"> This text is displayed if your browser does not support HTML5 Canvas</canvas> <button type="button" id="btn_4" class="btn btn-primary btn-lg uploadBtn" data-toggle="modal" data-target="#modal_4">Crop third image. </button></div></div></div>';
            $("#_preview_3").after(newDiv);
            $("#addcanvas3").hide();
        });
    }, 2000);

    // paint perview canvas when preview button is clicked
    $( "#previewBtn" ).click(function() {
        // compare each preview canvas to blank canvas
        var blankcanvas = document.getElementById('blank').toDataURL();
        // Get id of first child div inside div drag-elements
        var firstid = $("#drag-elements> :nth-child(1)").attr("id");
        var canvas1 = document.getElementById('canvas' + firstid);
        // Get id of second child div inside div drag-elements
        var secondid = $('#drag-elements > :nth-child(2)').attr("id");
        var canvas2 = document.getElementById('canvas' + secondid);
        // Count the number of draggable canvases
        var count = $("#drag-elements > div").length;
        switch (count) {
            case 2:
                console.log(blankcanvas);
                console.log(canvasblank);
                if( canvas1.toDataURL() === blankcanvas || canvas2.toDataURL() === blankcanvas) {
                    $('#alertModal').modal('show');
                }
                else {
                    $("#canvas_preview").width(600);
                    $("#canvas_preview").height(300);
                    // merge canvases (canvas1-canvas3) onto a single canvas
                    var canvas = document.getElementById('canvas_preview');
                    var context = canvas.getContext('2d');
                    canvas.width = 600;
                    canvas.height = 300;
                    context.drawImage(canvas1, 0, 0);
                    context.drawImage(canvas2, 300, 0);
                    $('#_preview').show();
                }
                break;
            case 3:
                console.log(blankcanvas);
                console.log(canvasblank);
                // // Get id of third child div inside div drag-elements
                var thirdid = $('#drag-elements > :nth-child(3)').attr("id");
                var canvas3 = document.getElementById('canvas' + thirdid);
                if( canvas1.toDataURL() === blankcanvas || canvas2.toDataURL() === blankcanvas || canvas3.toDataURL() === blankcanvas) {
                    $('#alertModal').modal('show');
                }
                else {
                    $("#canvas_preview").width(600);
                    $("#canvas_preview").height(200);
                    // merge canvases (canvas1-canvas3) onto a single canvas
                    var canvas = document.getElementById('canvas_preview');
                    var context = canvas.getContext('2d');
                    canvas.width = 600;
                    canvas.height = 200;
                    context.drawImage(canvas1, 0, 0, 200, 200);
                    context.drawImage(canvas2, 200, 0, 200, 200);
                    context.drawImage(canvas3, 400, 0, 200, 200);
                    $('#_preview').show();
                }
                break;
            case 4:
                // // Get id of third child div inside div drag-elements
                var thirdid = $('#drag-elements > :nth-child(3)').attr("id");
                var canvas3 = document.getElementById('canvas' + thirdid);
                // // Get id of forth child div inside div drag-elements
                var forthid = $('#drag-elements > :nth-child(4)').attr("id");
                var canvas4 = document.getElementById('canvas' + forthid);
                if( canvas1.toDataURL() === blankcanvas || canvas2.toDataURL() === blankcanvas || canvas3.toDataURL() === blankcanvas || canvas4.toDataURL() === blankcanvas) {
                    $('#alertModal').modal('show');
                }
                else {
                    $("#canvas_preview").width(600);
                    $("#canvas_preview").height(150);
                    // merge canvases (canvas1-canvas3) onto a single canvas
                    var canvas = document.getElementById("canvas_preview");
                    canvas.width = 600;
                    canvas.height = 150;
                    var context = canvas.getContext('2d');
                    context.drawImage(canvas1, 0, 0, 150, 150);
                    context.drawImage(canvas2, 150, 0, 150, 150);
                    context.drawImage(canvas3, 300, 0, 150, 150);
                    context.drawImage(canvas4, 450, 0, 150, 150);
                    $('#_preview').show();
                }
                break;
        }

    });
});