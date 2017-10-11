/**
 * Created by lx58 on 4/27/2017.
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

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {
    "use strict";
    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window is passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the default params object
    var pluginName = 'picEdit',
        defaults = {
            imageUpdated: function(img){},	// Image updated callback function
            formSubmitted: function(res){},	// After form was submitted callback function
            redirectUrl: false,				// Page url for redirect on form submit
            maxWidth: 400,					// Max width parameter
            maxHeight: 400,				// Max height parameter
            aspectRatio: true,				// Preserve aspect ratio
            defaultImage: false             // Default image to be used with the plugin
        };


    // The actual plugin constructor
    function Plugin( element, options ) {
        // this.inputelement = element;
        this.element = element;
        this.canvasID = "canvas" + element.id;
        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;
        // Reference to the loaded image
        this._image = false;
        // Lin: reference to the scale factor
        this._scale = false;
        // Lin: Reference to the sticker object
        this._sticker = null;
        // Reference to the filename of the loaded image
        this._filename = "";
        // Interface variables (data synced from the user interface)
        this._variables = {};
        this.init();
    }

    Plugin.prototype = {
        init: function () {
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.settings

            // Save instance of this for inline functions
            var _this = this;
            // Get type of element to be used (type="file" and type="picedit" are supported)
            var type = $(this.element).prop("type");
            if(type == "file")
                this._fileinput = $(this.element);
            else {
                // Create a reference to the file input box
                $(this.element).after('<input type="file" style="display:none;" accept="image/*">');
                this._fileinput = $(this.element).next("input");
            }
            // Get reference to the main canvas element
            this._canvas = new fabric.Canvas(this.canvasID);
            //// Lin: store the reference to the fabric object on the Canvas element itself
            // so that we can call it outside of the plugin
            document.getElementById(this.canvasID).fabric = this._canvas;
            //stop the bringtofront on selected objects
            this._canvas. preserveObjectStacking = true;
            // Create and set the 2d context for the canvas
            this._ctx = this._canvas.getContext("2d");
            //setOverlayImage makes sure sticker adds as overlay, no change or move the sticker
            // this._canvas.setOverlayImage("img/I-Voted-frame.png");
            // Reference to video elemment holder element
            this._videobox = $(this.element).find(".picedit_video");
            //Lin: keep a global reference to the opened stream
            this._videostream;
            // Save the reference to the messaging box
            this._messagebox = $(this.element).find(".picedit_message");
            this._messagetimeout = false;
            // Reference to the main/top nav buttons holder
            this._mainbuttons = $(this.element).find(".picedit_action_btns");
            // Size of the viewport to display image (a resized image will be displayed)
            this._viewport = {
                "width": 0,
                "height": 0
            };
            // All variables responsible for cropping functionality
            this._cropping = {
                is_dragging: false,
                is_resizing: false,
                left: 0,
                top: 0,
                width: 300,
                height: 300,
                cropbox: $(this.element).find(".picedit_drag_resize"),
                cropframe: $(this.element).find(".picedit_drag_resize_box")
            };
            function build_img_from_file(files) {
                if(!files && !files.length) return;
                var file = files[0];
                if(!_this._filename) {
                    _this._filename = file.name;
                    //console.log(file.name);
                }
                var reader = new FileReader();
                reader.onload = function(e) {
                    _this._create_image_with_datasrc(e.target.result, false, file);
                };
                if (file) {
                    reader.readAsDataURL(file);
                }
            }
            // Bind file drag-n-drop behavior
            $(this.element).find(".picedit_canvas_box").on("drop", function(event) {
                event.preventDefault();
                $(this).removeClass('dragging');
                var files = (event.dataTransfer || event.originalEvent.dataTransfer).files;
                build_img_from_file(files);
            }).on("dragover", function(event) {
                event.preventDefault();
                $(this).addClass('dragging');
            }).on("dragleave", function(event) {
                event.preventDefault();
                $(this).removeClass('dragging');
            });
            // Bind onchange event to the fileinput to pre-process the image selected
            $(this._fileinput).on("change", function() {
                build_img_from_file(this.files);
            });
            // If Firefox (doesn't support clipboard object), create DIV to catch pasted image
            if (!window.Clipboard) { // Firefox
                var pasteCatcher = $(document.createElement("div"));
                pasteCatcher.prop("contenteditable","true").css({
                    "position" : "absolute",
                    "left" : -999,
                    "width" : 0,
                    "height" : 0,
                    "overflow" : "hidden",
                    "outline" : 0,
                    "opacity" : 0
                });
                $(document.body).prepend(pasteCatcher);
            }
            // Bind onpaste event to capture images from the the clipboard
            $(document).on("paste", function(event) {
                var items = (event.clipboardData  || event.originalEvent.clipboardData).items;
                var blob;
                if(!items) {
                    pasteCatcher.get(0).focus();
                    pasteCatcher.on('DOMSubtreeModified', function(){
                        var child = pasteCatcher.children().last().get(0);
                        pasteCatcher.html("");
                        if (child) {
                            if (child.tagName === "IMG" && child.src.substr(0, 5) == 'data:') {
                                _this._create_image_with_datasrc(child.src);
                            }
                            else if (child.tagName === "IMG" && child.src.substr(0, 4) == 'http') {
                                _this._create_image_with_datasrc(child.src, false, false, true);
                            }
                        }
                    });
                }
                else {
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].type.indexOf("image") === 0) {
                            blob = items[i].getAsFile();
                        }
                    }
                    if(blob) {
                        var reader = new FileReader();
                        reader.onload = function(e) { _this._create_image_with_datasrc(e.target.result); };
                        reader.readAsDataURL(blob);
                    }
                }
            });
            // Define formdata element
            this._theformdata = false;
            this._theform = $(this.inputelement).parents("form");
            // Bind form submit event
            if(this._theform.length) {
                this._theform.on("submit", function(){ return _this._formsubmit(); });
            }
            // Call helper functions
            this._bindControlButtons();
            this._bindInputVariables();
            this._bindSelectionDrag();
            this._variables.prev_pos = false;
            // Load default image if one is set
            if(this.options.defaultImage) _this.set_default_image(this.options.defaultImage);
            //Lin: bind onclick event to sticker buttons
            $(this.element).find('.sticker').click(function(e) {
                if(!_this._image) return _this._hideAllNav(1);
                var imgElement = document.getElementById(e.target.id);
                //// Lin: check to see if a sticker exists.  Only allow one sticker at a time.
                // If already has one sticker, replace the existing one
                if (_this._sticker) {
                    _this._sticker.setElement(imgElement);
                }
                // If not, create a new sticker object
                else{
                    _this._sticker = new fabric.Image(imgElement, {
                        left: 20,
                        top: 270,
                        scaleX: 1.5,
                        scaleY: 1.5,
                        lockUniScaling: true,
                        hasControls: false,
                        hasBorders: false
                    });
                }
                //setOverlayImage makes sure sticker adds as overlay, no change or move the sticker
                // _this._canvas.setOverlayImage(imgInstance);
                _this._canvas.insertAt(_this._sticker,1, false);
            });
            //Limit the movement of object within canvas
            this._canvas.on('object:moving', function (e) {
                var obj = e.target;
                // Ignore if object is sticker
                if (_this._canvas.getObjects().indexOf(obj) === 0) {
                    obj.setCoords();
                    // top-left  corner
                    if(obj.getBoundingRect().top > 0 || obj.getBoundingRect().left > 0){
                        obj.top = Math.min(obj.top, obj.top-obj.getBoundingRect().top);
                        obj.left = Math.min(obj.left, obj.left-obj.getBoundingRect().left);
                    }
                    // bot-right corner
                    if(obj.getBoundingRect().top+obj.getBoundingRect().height  < obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width  < obj.canvas.width){
                        obj.top = Math.max(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
                        obj.left = Math.max(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
                    }
                }
            });
            //Variables and functions for Fabric.js zoom on mousewheel event
            var this_canvas = this._canvas;
            var MAX_ZOOM_OUT = 1;
            $(this_canvas.wrapperEl).on('mousewheel', function(e) {
                // cross-browser wheel delta
                var e = window.event || e; // old IE support
                var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
                if(e.detail<0 || delta <0){
                    //canvas.setZoom(canvas.getZoom() * 1.1 );
                    this_canvas.zoomToPoint(new fabric.Point(this_canvas.width / 2, this_canvas.height / 2), this_canvas.getZoom() * 1.1);
                }
                else if (this_canvas.getZoom()> MAX_ZOOM_OUT){
                    //canvas.setZoom(canvas.getZoom() / 1.1 );
                    this_canvas.zoomToPoint(new fabric.Point(this_canvas.width / 2, this_canvas.height / 2), this_canvas.getZoom() / 1.1);
                }
                this_canvas.renderAll();
                return false;
            });

        }, // end of init()
        // Check Browser Capabilities (determine if the picedit should run, or leave the default file-input field)
        check_browser_capabilities: function () {
            if(!!window.CanvasRenderingContext2D == false) return false; //check canvas support
            if(!window.FileReader) return false; //check file reader support
            return true;    //otherwise return true
        },
        // Set the default Image
        set_default_image: function (path) {
            this._create_image_with_datasrc(path, false, false, true);
        },
        // Remove all notification copy and hide message box
        hide_messagebox: function () {
            var msgbox = this._messagebox;
            msgbox.removeClass("active no_close_button");
            setTimeout(function() {msgbox.children("div").html("")}, 200);
        },
        // Open a loading spinner message box or working... message box
        set_loading: function (message) {
            if(message && message == 1) {
                return this.set_messagebox("Working...", false, false);
            }
            else return this.set_messagebox("Please Wait...", false, false);
        },
        // Open message box alert with defined text autohide after number of milliseconds, display loading spinner
        set_messagebox: function (text, autohide, closebutton) {
            autohide = typeof autohide !== 'undefined' ? autohide : 3000;
            closebutton = typeof closebutton !== 'undefined' ? closebutton : true;
            var classes = "active";
            if(!closebutton) classes += " no_close_button";
            if(autohide) {
                clearTimeout(this._messagetimeout);
                var _this = this;
                this._messagetimeout = setTimeout(function(){ _this.hide_messagebox(); }, autohide);
            }
            return this._messagebox.addClass(classes).children("div").html(text);
        },
        // Toggle button and update variables
        toggle_button: function (elem) {
            if($(elem).hasClass("active")) {
                var value = false;
                $(elem).removeClass("active");
            }
            else {
                var value = true;
                $(elem).siblings().removeClass("active");
                $(elem).addClass("active");
            }
            var variable = $(elem).data("variable");
            if(variable) {
                var optional_value = $(elem).data("value");
                if(!optional_value) optional_value = $(elem).val();
                if(optional_value && value) value = optional_value;
                this._setVariable(variable, value);
            }
        },
        // Perform image load when user clicks on image button
        load_image: function () {
            this._fileinput.click();
        },
        // Rotate the image 90 degrees counter-clockwise
        rotate_ccw: function () {
            if(!this._image) return this._hideAllNav(1);
            var _this = this;
            //run task and show loading spinner, the task can take some time to run
            this.set_loading(1).delay(200).promise().done(function() {
                _this._doRotation(-90);
                _this._resizeViewport();
                //hide loading spinner
                _this.hide_messagebox();
            });
            //hide all opened navigation
            this._hideAllNav();
        },
        // Rotate the image 90 degrees clockwise
        rotate_cw: function () {
            if(!this._image) return this._hideAllNav(1);
            var _this = this;
            // Lin:
            _this._doRotation(90);
            //hide all opened navigation
            this._hideAllNav();
        },
        // Open video element and start capturing live video from camera to later make a photo
        camera_open: function() {
            var getUserMedia;
            var browserUserMedia = navigator.webkitGetUserMedia	||	// WebKit
                navigator.mozGetUserMedia	||	// Mozilla FireFox
                navigator.getUserMedia;			// 2013...
            if (!browserUserMedia) return this.set_messagebox("Sorry, your browser doesn't support WebRTC!");
            var _this = this;
            getUserMedia = browserUserMedia.bind(navigator);
            getUserMedia({
                    audio: false,
                    video: true
                },
                function(stream) {
                    var videoElement = _this._videobox.find("video")[0];
                    videoElement.src = URL.createObjectURL(stream);
                    //resize viewport
                    videoElement.onloadedmetadata = function() {
                        if(videoElement.videoWidth && videoElement.videoHeight) {
                            if(!_this._image) _this._image = {};
                            _this._image.width = videoElement.videoWidth;
                            _this._image.height = videoElement.videoHeight;
                            _this._resizeViewport();
                        }
                    };
                    _this._videobox.addClass("active");
                    //Lin
                    _this._videostream = stream;
                },
                function(err) {
                    return _this.set_messagebox("No video source detected! Please allow camera access!");
                }
            );
        },
        camera_close: function() {
            this._videobox.removeClass("active");
            //Lin: close the web camera
            this._videostream.getVideoTracks()[0].stop();
        },
        take_photo: function() {
            var _this = this;
            var live = this._videobox.find("video")[0];
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext("2d");
            canvas.width = live.clientWidth;
            canvas.height = live.clientHeight;
            ctx.drawImage(live, 0, 0, canvas.width, canvas.height);
            this._create_image_with_datasrc(canvas.toDataURL("image/png"), function() {
                _this._videobox.removeClass("active");
                //Lin: close the web camera
                _this._videostream.getVideoTracks()[0].stop();
            });
        },
        // Crop the image
        crop_image: function(e) {
            //prevent mousedown events to shift the drag_resize_box
            var crop = this._calculateCropWindow();
            var _this = this;
            //Lin: fix the shifting problem when base image is moved before cropping
            var baseimage = _this._canvas.item(0);
            var sx =  crop.left - baseimage.left / _this._scale;
            var sy = crop.top - baseimage.top / _this._scale;
            // If the size of image is smaller than 600 x 600
            if (_this._scale > 1) {
                sx =  (crop.left - baseimage.left ) / _this._scale;
                sy = (crop.top - baseimage.top ) / _this._scale;
            }
            this.set_loading(1).delay(200).promise().done(function() {
                var id = 'canvas_preview'+ _this.element.id;
                var canvas = document.getElementById(id);
                var ctx = canvas.getContext('2d');
                ctx.drawImage(_this._image, sx, sy, crop.width, crop.height, 0, 0, canvas.width, canvas.height);
                 var btnID = "btn" + _this.element.id;
                $('#' + btnID ).hide();
                $('.close').click(); // close modal
                if(crop.width < 200 ) {
                    alert("Your images is smaller than crop frame.  It yields low quality photo.");
                    //_this.set_messagebox("Your images is smaller than crop frame.  It yields low quality photo.");
                }
                else {
                    _this.hide_messagebox();
                }
            });
            this.crop_close();
        },
        crop_open: function () {
            if(!this._image) return this._hideAllNav(1);
            this._cropping.cropbox.addClass("active");
            this._hideAllNav();
        },
        crop_close: function () {
            this._cropping.cropbox.removeClass("active");
        },
        // Lin: Discard base image and re-active picedit_action_btns
        discard_image: function() {
            if(!this._image) return this._hideAllNav(1);
            //Clear canvas (base image)
            // this._ctx.clearRect(0, 0, canvas.width, canvas.height);
            //Clear entire canvas (including base image, overlay and sticker)
            this._canvas.clear();
            //Add overlay back
            // this._canvas.setOverlayImage("img/I-Voted-frame.png");
            this._image = false;
            //Re-active buttons for new upload
            $(".picedit_action_btns").addClass("active");
        },
        download_image: function(){
            var canvas = document.getElementById(canvasID);
            if (canvas.msToBlob) { //for IE
                var blob = canvas.msToBlob();
                window.navigator.msSaveBlob(blob, "Banner_composer.png");
            } else {
                var element = document.createElement('a');
                element.setAttribute('href', canvas.toDataURL("image/png"));
                element.setAttribute('download', "Banner_composer.png");

                element.style.display = 'none';
                document.body.appendChild(element);

                element.click();

                document.body.removeChild(element);
            }
        },
        // Create and update image from datasrc
        _create_image_with_datasrc: function(datasrc, callback, file, dataurl) {
            var _this = this;
            var img = document.createElement("img");
            if(dataurl) img.setAttribute('crossOrigin', 'anonymous');
            if(file) img.file = file;
            img.src = datasrc;
            img.onload = function() {
                if(dataurl) {
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    img.src = canvas.toDataURL('image/png');
                }
                _this._image = img;
                _this._resizeViewport();
                _this._paintCanvas();
                _this.options.imageUpdated(_this._image);
                _this._mainbuttons.removeClass("active");
                // automatically open the crop frame
                _this._cropping.cropbox.addClass("active");
                if(callback && typeof(callback) == "function") callback();
            };
        },
        // Functions to control cropping functionality (drag & resize cropping box)
        _bindSelectionDrag: function() {
            var _this = this;
            var eventbox = this._cropping.cropframe;
            var resizer = this._cropping.cropbox.find(".picedit_drag_resize_box_corner_wrap");
            $(window).on("mousedown touchstart", function(e) {
                var evtpos = (e.clientX) ? e : e.originalEvent.touches[0];
                _this._cropping.x = evtpos.clientX;
                _this._cropping.y = evtpos.clientY;
                _this._cropping.w = eventbox[0].clientWidth;
                _this._cropping.h = eventbox[0].clientHeight;
                eventbox.on("mousemove touchmove", function(event) {
                    event.stopPropagation();
                    event.preventDefault();
                    _this._cropping.is_dragging = true;
                    if(!_this._cropping.is_resizing) _this._selection_drag_movement(event);
                });
                resizer.on("mousemove touchmove", function(event) {
                    event.stopPropagation();
                    event.preventDefault();
                    _this._cropping.is_resizing = true;
                    _this._selection_resize_movement(event);
                });
            }).on("mouseup touchend", function() {
                if (_this._painter_painting) {
                    _this._painter_merge_drawing();
                }
                _this._cropping.is_dragging = false;
                _this._cropping.is_resizing = false;
                // _this._painter_painting = false;
                _this._variables.prev_pos = false;
                eventbox.off("mousemove touchmove");
                resizer.off("mousemove touchmove");
                if (_this._cropping.width < 200) {
                    _this.set_messagebox("Your crop frame is less than 200px wide.  It will yield low quality photo.");
                }
            });
        },
        _selection_resize_movement: function(e) {
            var cropframe = this._cropping.cropframe[0];
            var evtpos = (e.clientX) ? e : e.originalEvent.touches[0];
            this._cropping.width = this._cropping.w + evtpos.clientX - this._cropping.x;
            //Lin:  keep the aspect ratio = 1
            this._cropping.height = this._cropping.width;
            cropframe.style.width  = this._cropping.width + 'px';
            cropframe.style.height = this._cropping.height + 'px';
        },
        _selection_drag_movement: function(e) {
            /*var cropframe = this._cropping.cropframe[0];
            var evtpos = (e.pageX) ? e : e.originalEvent.touches[0];
            this._cropping.cropframe.offset({
                top: evtpos.pageY - parseInt(cropframe.clientHeight / 2, 10),
                left: evtpos.pageX - parseInt(cropframe.clientWidth / 2, 10)
            });*/
            var cropframe = this._cropping.cropframe[0];
            var evtpos = (e.pageX) ? e : e.originalEvent.touches[0];
            var frametop = evtpos.pageY - parseInt(cropframe.clientHeight / 2, 10);
            var frameleft = evtpos.pageX - parseInt(cropframe.clientWidth / 2, 10);
            // Lin: get the position of canvas box relative to document
            var box = $('#'+ this.canvasID)[0].getBoundingClientRect();
            var body = document.body;
            var docEl = document.documentElement;
            var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
            var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
            var clientTop = docEl.clientTop || body.clientTop || 0;
            var clientLeft = docEl.clientLeft || body.clientLeft || 0;
            var boxtop = box.top + scrollTop - clientTop;
            var boxleft = box.left + scrollLeft - clientLeft;
            // The maximum position of crop frame top so that the buttom edge do not exceed canvas box bottom
            // var maxtop =  boxtop + $('.picedit_canvas_box').height() - cropframe.clientHeight -2; // border is 1, clientHeight is the inner height
            var maxtop = boxtop + this.options.maxHeight - cropframe.clientHeight -2;
            // Restrict framebox to be inside canvas box container vertically
            if (frametop < boxtop) {
                frametop = boxtop;
            } else if (frametop > maxtop ) {
                frametop = maxtop;
            }
            // The maximum position of crop frame top so that the buttom edge do not exceed canvas box bottom
            //var maxleft =  boxleft + $('.picedit_canvas_box').width() - cropframe.clientWidth -2; // border is 1, clientWidth is the inner width
            var maxleft = boxleft + this.options.maxWidth - cropframe.clientWidth -2;
            // Restrict framebox to be inside canvas box container horizontally
            if (frameleft < boxleft) {
                frameleft = boxleft;
            } else if (frameleft > maxleft ) {
                frameleft = maxleft;
            }
            this._cropping.cropframe.offset({
                top: frametop,
                left: frameleft
            });
        },
        // Hide all opened navigation and active buttons (clear plugin's box elements)
        _hideAllNav: function (message) {
            if(message && message == 1) {
                this.set_messagebox("Upload an image first!");
            }
            $(this.element).find(".picedit_nav_box").removeClass("active").find(".picedit_element").removeClass("active");
        },
        // Paint image on canvas
        _paintCanvas: function () {
            ////Lin: add image with datasrc
            var _this = this;
            var scaleX = this._canvas.width / this._image.width ;
            var scaleY = this._canvas.height / this._image.height ;
            var scale = Math.max(scaleX, scaleY);
            _this._scale = scale;
            //clear previous image first
            //_this._canvas.clear();
            fabric.Image.fromURL(this._image.src , function(oImg) {
                if (scale > 2 ) {
                    _this.set_messagebox("Your image may be too small to crop!");
                }
                oImg.scale(scale);
                // lock aspect ratio
                oImg.lockUniScaling = true;
                oImg.hasControls = false;
                oImg.hasBorders = false;
                if (scaleX < scaleY) {oImg.lockMovementY = true;}
                else {oImg.lockMovementX = true;}
                _this._canvas.insertAt(oImg, 0, true).deactivateAll().renderAll();
            });
            //
            $(this.element).find(".picedit_canvas").css("display", "block");
        },
        // Helper function to translate crop window size to the actual crop size
        _calculateCropWindow: function (){
            var view = this._viewport;		//viewport sizes
            var cropframe = this._cropping.cropframe[0];
            var real = {						//image real sizes
                "width": this._image.width,
                "height": this._image.height
            };
            var crop = {						//crop area sizes and position
                "width": cropframe.clientWidth + 2, //add the border width
                "height": cropframe.clientHeight + 2, //add the border width
                "top": (cropframe.offsetTop > 0) ? cropframe.offsetTop : 0.1,
                "left": (cropframe.offsetLeft > 0) ? cropframe.offsetLeft : 0.1
            };
            // if((crop.width + crop.left) > view.width) crop.width = view.width - crop.left;
            // if((crop.height + crop.top) > view.height) crop.height = view.height - crop.top;
            //calculate width and height for the full image size
            var width_percent = crop.width / view.width;
            var height_percent = crop.height / view.height;
            var area = {
                "width": parseInt(real.width * width_percent, 10),
                "height": parseInt(real.height * height_percent, 10)
            };
            //calculate actual top and left crop position
            var top_percent = crop.top / view.height;
            var left_percent = crop.left / view.width;
            if (this._scale > 1) {
                top_percent = top_percent * this._scale;
                left_percent = left_percent * this._scale;
            }
            area.top = parseInt(real.height * top_percent, 10);
            area.left = parseInt(real.width * left_percent, 10);
            return area;
        },
        // Helper function to perform canvas rotation
        _doRotation: function (degrees){
            ////Lin: rotate around the center of canvas
            var baseimage = this._canvas.item(0);
            var curAngle = baseimage.getAngle();
            var rotatethispoint = new fabric.Point(this._canvas.width / 2, this._canvas.height / 2); // center of canvas
            // var rads= degrees*Math.PI/180;
            var rads = fabric.util.degreesToRadians(degrees);
            var objectOrigin = new fabric.Point(baseimage.left, baseimage.top);
            var new_loc = fabric.util.rotatePoint(objectOrigin, rotatethispoint, rads);
            baseimage.setAngle(curAngle + degrees);
            baseimage.top = new_loc.y;
            baseimage.left = new_loc.x;
            this._canvas.renderAll();
        },
        // Resize the viewport (should be done on every image change)
        _resizeViewport: function () {
            //get image reference
            var img = this._image;
            //set correct viewport width
            var viewport = {
                "width": img.width,
                "height": img.height
            };
            // if(this.options.maxWidth != 'auto' && img.width > this.options.maxWidth) viewport.width = this.options.maxWidth;
            // if(this.options.maxHeight != 'auto' && img.height > this.options.maxHeight) viewport.height = this.options.maxHeight;
            //calculate appropriate viewport size and resize the canvas
            if(this.options.aspectRatio) {
                var resizeWidth = img.width;
                var resizeHeight = img.height;
                var aspect = resizeWidth / resizeHeight;
                //Lin: check for landscape or portrait
                if (resizeWidth > resizeHeight) {
                    if(this.options.maxHeight != 'auto' && img.height < this.options.maxHeight) viewport.width = this.options.maxWidth * img.width / img.height;
                    if(this.options.maxHeight != 'auto') viewport.height = this.options.maxHeight;
                    if (resizeHeight > viewport.height) {
                        viewport.height = parseInt(viewport.height, 10);
                        viewport.width = parseInt(viewport.height * aspect, 10);
                    }
                }
                else {
                    if(this.options.maxWidth!= 'auto' && img.width < this.options.maxWidth) viewport.height = this.options.maxHeight * img.height / img.width;
                    if(this.options.maxWidth != 'auto') viewport.width = this.options.maxWidth;
                    if (resizeWidth > viewport.width) {
                        viewport.width = parseInt(viewport.width, 10);
                        viewport.height = parseInt(viewport.width / aspect, 10);
                    }
                }
            }
            //set the global viewport
            this._viewport = viewport;
            //update interface data (original image width and height)
            this._setVariable("resize_width", img.width);
            this._setVariable("resize_height", img.height);
        },
        // Bind click and action callbacks to all buttons with class: ".picedit_control"
        _bindControlButtons: function() {
            var _this = this;
            $(this.element).find(".picedit_control").bind( "click", function() {
                // check to see if the element has a data-action attached to it
                var action = $(this).data("action");
                if(action) {
                    _this[action](this);
                }
                // handle click actions on top nav buttons
                else if($(this).hasClass("picedit_action")) {
                    $(this).parent(".picedit_element").toggleClass("active").siblings(".picedit_element").removeClass("active");
                    if($(this).parent(".picedit_element").hasClass("active"))
                        $(this).closest(".picedit_nav_box").addClass("active");
                    else
                        $(this).closest(".picedit_nav_box").removeClass("active");
                }
            });
        },
        // Bind input elements to the application variables
        _bindInputVariables: function() {
            var _this = this;
            $(this.element).find(".picedit_input").bind( "change keypress paste input", function() {
                // check to see if the element has a data-action attached to it
                var variable = $(this).data("variable");
                if(variable) {
                    var value = $(this).val();
                    _this._variables[variable] = value;
                }
                if((variable == "resize_width" || variable == "resize_height") && _this._variables.resize_proportions) {
                    var aspect = _this._image.width / _this._image.height;
                    if(variable == "resize_width") _this._setVariable("resize_height", parseInt(value / aspect, 10));
                    else _this._setVariable("resize_width", parseInt(value * aspect, 10));
                }
            });
        },
        // Set an interface variable and update the corresponding dom element (M-V binding)
        _setVariable: function(variable, value) {
            this._variables[variable] = value;
            $(this.element).find('[data-variable="' + variable + '"]').val(value);
        }
    };

    // You don't need to change something below:
    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations and allowing any
    // public function (ie. a function whose name doesn't start
    // with an underscore) to be called via the jQuery plugin,
    // e.g. $(element).defaultPluginName('functionName', arg1, arg2)
    $.fn[pluginName] = function ( options ) {
        var args = arguments;

        // Is the first parameter an object (options), or was omitted,
        // instantiate a new instance of the plugin.
        if (options === undefined || typeof options === 'object') {
            return this.each(function () {

                // Only allow the plugin to be instantiated once,
                // so we check that the element has no plugin instantiation yet
                if (!$.data(this, 'plugin_' + pluginName)) {

                    // if it has no instance, create a new one,
                    // pass options to our plugin constructor,
                    // and store the plugin instance
                    // in the elements jQuery data object.
                    $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
                }
            });

            // If the first parameter is a string and it doesn't start
            // with an underscore or "contains" the `init`-function,
            // treat this as a call to a public method.
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

            // Cache the method call
            // to make it possible
            // to return a value
            var returns;

            this.each(function () {
                var instance = $.data(this, 'plugin_' + pluginName);

                // Tests that there's already a plugin-instance
                // and checks that the requested public method exists
                if (instance instanceof Plugin && typeof instance[options] === 'function') {

                    // Call the method of our plugin instance,
                    // and pass it the supplied arguments.
                    returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
                }

                // Allow instances to be destroyed via the 'destroy' method
                if (options === 'destroy') {
                    $.data(this, 'plugin_' + pluginName, null);
                }
            });

            // If the earlier cached method
            // gives a value back return the value,
            // otherwise return this to preserve chainability.
            return returns !== undefined ? returns : this;
        }
    };

}(jQuery, window, document));