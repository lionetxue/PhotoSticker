/**
 * Created by lx58 on 6/30/2017.
 */
/**
 * fabric.js template for bug reports
 *
 * Please update the name of the jsfiddle (see Fiddle Options).
 * This templates uses latest dev verison of fabric.js (https://rawgithub.com/kangax/fabric.js/master/dist/all.js).
 */

// initialize fabric canvas and assign to global windows object for debug
var canvas = new fabric.Canvas('canvas_1');
var MAX_ZOOM_OUT = 1;
var rect = new fabric.Rect({
    left: 100,
    top: 100,
    width: 100,
    height: 75,
    fill: 'rgba(255,0,0,0.5)',
});

canvas.add(rect);
var this_canvas = canvas;

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
