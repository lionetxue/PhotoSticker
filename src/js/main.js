/**
 * Created by lx58 on 10/25/2016.
 */
/*
 *  Project: PhotoSticker plugin based on PicEdit by Andy V. and fabric.js
 *  Description: Allows user to take a selfie or upload a photo with tools to edit the image on the front-end and apply stickers to it
 *               The user can then download the profile, download a Zip file for all stickers and share on social media.
 *  Author: Lin Xue
 *  License: MIT
 */
// Popup Email Form
function deselect(e) {
    $('.pop').slideFadeToggle(function() {
        e.removeClass('selected');
        $("#result").text('');
    });
}
function validateEmail(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
}

$(function() {
    // Document is ready
    $('#thebox').picEdit();

    //popup form to collect user email
    $('#downloadZip').on('click', function() {
        if($(this).hasClass('selected')) {
            deselect($(this));
        } else {
            $(this).addClass('selected');
            $('.pop').slideFadeToggle();
        }
        return false;
    });

    $('.close').on('click', function() {
        deselect($('#downloadZip'));
        $("#result").text('');
        return false;
    });

    /* 		//test JSZip
     var zip = new JSZip();
     // create a file
     zip.file("Hello.txt", "Hello World\n");
     // create a folder
     var img = zip.folder("images");
     var imgData = "R0lGODdhBQAFAIACAAAAAP/eACwAAAAABQAFAAACCIwPkWerClIBADs=";
     img.file("smile.gif", imgData, {base64: true});*/

    function bindEvent(el, eventName, eventHandler) {
        if (el.addEventListener){
            // standard way
            el.addEventListener(eventName, eventHandler, false);
        } else if (el.attachEvent){
            // old IE
            el.attachEvent('on'+eventName, eventHandler);
        }
    }

    // Blob
    var blobLink = document.getElementById('message_submit');
    if (JSZip.support.blob) {
        function downloadWithBlob(e) {
            //Don't submit form yet
            e.preventDefault();
            var email = $("#email").val();
            var canvas1 = document.getElementById('canvas').fabric;
            var baseImg = canvas1.item(0);
            //check if base image exist
            if(!baseImg) {
                $("#result").text('Please take a selfie or upload a photo first!').css("color", "red");
            }
            //validate email first
            else if (validateEmail(email)) {
                $("#result").text('');
                //prepare zipfile
                var zip = new JSZip();
                //Remove existing sticker if any
                var exSticker = canvas1.item(1);
                if (exSticker) {
                    canvas1.remove(exSticker);
                }
                // Get all img elements
                var stickers = document.getElementsByTagName('img');
                for (var i=0; i<stickers.length; i++) {
                    var stickerID = stickers[i].id;
                    if (sticker) {
                        canvas1.remove(sticker);
                    }
                    var imgElement = document.getElementById(stickerID);
                    var sticker = new fabric.Image(imgElement, {
                        left: 20,
                        top: 300,
                        lockUniScaling: true,
                        hasControls: false,
                        hasBorders: false
                    });
                    //Add new sticker to canvas
                    canvas1.insertAt(sticker,1, false);
                    var savable = new Image();
                    savable.src = canvas1.toDataURL();
                    var imageData = savable.src.substr(savable.src.indexOf(',')+1);
                    zip.file("profile_"+ i +".png", imageData, {base64: true});
                }

                zip.generateAsync({type:"blob"}).then(function (blob) {
                    saveAs(blob, "example.zip");
                }, function (err) {
                    blobLink.innerHTML += " " + err;
                });
            }
            else {
                $("#result").text("You must enter a valid email address!").css("color", "red");
            }
//				this.submit(); //now submit the form
            return false;
        }
        bindEvent(blobLink, 'click', downloadWithBlob);
    } else {
        blobLink.innerHTML += " (not supported on this browser)";
    }
    /*		// data URI
     function downloadWithDataURI() {
     zip.generateAsync({type:"base64"}).then(function (base64) {
     window.location = "data:application/zip;base64," + base64;
     }, function (err) {
     // shouldn't happen with a base64...
     });
     }
     var dataUriLink = document.getElementById('message_submit');
     bindEvent(dataUriLink, 'click', downloadWithDataURI);*/

    //Social Media share popup window
    $('.share').click(function() {
        var NWin = window.open($(this).prop('href'), '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
        if (window.focus)
        {
            NWin.focus();
        }
        return false;
    });


});
//Lin: form
$.fn.slideFadeToggle = function(easing, callback) {
    return this.animate({ opacity: 'toggle', height: 'toggle' }, 'fast', easing, callback);
};
