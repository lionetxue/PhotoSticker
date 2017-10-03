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

// main()
$(function() {
    // Document is ready
    // Start the plugin
    $('.picedit_box').picEdit( );

});
//Lin: form
$.fn.slideFadeToggle = function(easing, callback) {
    return this.animate({ opacity: 'toggle', height: 'toggle' }, 'fast', easing, callback);
};
