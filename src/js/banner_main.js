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
    // compare each preview canvas to blank canvas
    var blankcanvas = document.getElementById('blank').toDataURL();
    $( "#previewBtn" ).click(function() {
        // Get id of first child div inside div drag-elements
        var firstid = $("#drag-elements> :nth-child(1)").attr("id");
        var canvas1 = document.getElementById('canvas' + firstid);
        // Get id of second child div inside div drag-elements
        var secondid = $('#drag-elements > :nth-child(2)').attr("id");
        var canvas2 = document.getElementById('canvas' + secondid);
        // // Get id of third child div inside div drag-elements
        var thirdid = $('#drag-elements > :nth-child(3)').attr("id");
        var canvas3 = document.getElementById('canvas' + thirdid);
        // // Get id of forth child div inside div drag-elements
        var thirdid = $('#drag-elements > :nth-child(4)').attr("id");
        var canvas4 = document.getElementById('canvas' + thirdid);
        if( canvas1.toDataURL() === blankcanvas || canvas2.toDataURL() === blankcanvas || canvas3.toDataURL() === blankcanvas) {
            alert("Blank canvas detected!");
        }
        else {
            // merge canvases (canvas1-canvas3) onto a single canvas
            var canvas = document.getElementById('canvas_preview');
            var context = canvas.getContext('2d');
            context.drawImage(canvas1, 0, 0, 150, 150);
            context.drawImage(canvas2, 150, 0, 150, 150);
            context.drawImage(canvas3, 300, 0, 150, 150);
            context.drawImage(canvas4, 450, 0, 150, 150);
            $('#_preview').show();
        }
    });
});