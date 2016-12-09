<!doctype html>
<html>
<head>
<meta charset="UTF-8">
<!--meta tags for facebook share	-->
<meta property="og:image" content="http://alumni-test.alumni.cornell.edu/zzz/photo-sticker/img/Photo_App_share.png" />
<meta property="og:description" content = "Want to create a unique profile picture with Cornell University icon stickers? Click on the link below to try our web application." />
<meta property="og:url" content="http://alumni-test.alumni.cornell.edu/zzz/photo-sticker/" />
<meta property="og:title" content="Create your Cornell Profile" />
<title>Cornell Profile Generator</title>

<link rel="stylesheet" type="text/css" href="css/picedit.min.css" />
<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-T8Gy5hrqNKT+hzMclPo118YTQO6cYprQmhrYwIiQ/3axmI1hQomh7Ud2hPOy8SP1" crossorigin="anonymous">
</head>
<body>
<!--- Insert the new record ---> 
<cfif IsDefined("Form.email")>
    <cfquery name="AddEmail" datasource="#request.dsn#">
    INSERT INTO PHOTOSTICKER (email, submit_dt)
    VALUES (
        <cfqueryparam cfsqltype="cf_sql_varchar" value="#Form.email#">,
        #createodbcdatetime(now())#
        ) 
    </cfquery> 
</cfif>
<div id="thebox" class="picedit_box">
	<!-- Picedit popup form -->
<!--	<div class="messagepop pop">
		<form method="post" id="email_form" action="addEmail.cfm">
			<div class="close cross"><i class="fa fa-times" aria-hidden="true"></i></div>
			<p>Enter your email to unlock the secrete sticker and download your profile photos with all stickers in one zipfile!</p>
			<p>We are committed to keeping your e-mail address confidential. We collect user emails to improve user experience for Cornell alumni site.</p>
			<p><label for="email">Your email</label><input type="text" size="30" name="email" id="email" placeholder="me@example.com"/></p>
			<p><input class="submitBtn" type="submit" value="Get My ZipFile" id="message_submit"/> or <a class="close" href="/"> Cancel</a></p>
		</form>
		<h4 id="result"></h4>
	</div>-->
	<!-- Picedit canvas element -->
	<div class="picedit_canvas_box">
		<div class="picedit_action_btns active">
			<div class="center">Take a selfie or upload a photo by dragging/browsing</div>
			<div class="picedit_control ico-picedit-picture" data-action="load_image"></div>
			<div class="picedit_control ico-picedit-camera" data-action="camera_open"></div>
		</div>
		<div id="canvas-container" class="picedit_canvas">
			<canvas id="canvas" width="400px" height="400px"> This text is displayed if your browser does not support HTML5 Canvas</canvas>
		</div>
		<div class="picedit_video">
			<video autoplay></video>
			<div class="picedit_video_controls">
				<span class="picedit_control  ico-picedit-checkmark" data-action="take_photo"></span>
				<span class="picedit_control  ico-picedit-close" data-action="camera_close"></span>
			</div>
		</div>
		<div class="picedit_drag_resize">
			<div class="picedit_drag_resize_canvas"></div>
			<div class="picedit_drag_resize_box">
				<div class="picedit_drag_resize_box_corner_wrap">
					<div class="picedit_drag_resize_box_corner"></div>
				</div>
				<div class="picedit_drag_resize_box_elements">
					<span class="picedit_control  ico-picedit-checkmark" data-action="crop_image"></span>
					<span class="picedit_control  ico-picedit-close" data-action="crop_close"></span>
				</div>
			</div>
		</div>
        <!-- Floating Share Buttons Container -->
<!--        <div class="socialfloat">
            &lt;!&ndash; Facebook Share Button &ndash;&gt;
            <a class="fbtn share facebook" target="_blank" href="http://www.facebook.com/sharer/sharer.php?u=http://alumni-test.alumni.cornell.edu/zzz/photo-sticker/"><i class="fa fa-facebook"></i></a>
            &lt;!&ndash; Google Plus Share Button &ndash;&gt;
            <a class="fbtn share gplus" target="_blank" href="https://plus.google.com/share?url=http://alumni-test.alumni.cornell.edu/zzz/photo-sticker/"><i class="fa fa-google-plus"></i></a>
            &lt;!&ndash; Twitter Share Button &ndash;&gt;
            <a class="fbtn share twitter" target="_blank" href="https://twitter.com/intent/tweet?text=Cornell%20Profile%20Generator&url=http://alumni-test.alumni.cornell.edu/zzz/photo-sticker/&via=CornellAlumni"><i class="fa fa-twitter"></i></a>
            &lt;!&ndash; LinkedIn Share Button &ndash;&gt;
            <a class="fbtn share linkedin" target="_blank" href="http://www.linkedin.com/shareArticle?mini=true&url=http://alumni-test.alumni.cornell.edu/zzz/photo-sticker/&title=Cornell%20Profile%20Generator&source=http://alumni-test.alumni.cornell.edu/zzz/photo-sticker/"><i class="fa fa-linkedin"></i></a>
            &lt;!&ndash; Email Share Button &ndash;&gt;
            <a class="fbtn share email" target="_blank" href="mailto:?subject=Cornell%20Profile%20Generator&amp;body=Use%20this%20site%20to%20create%20your%20Cornell%20profile%20pictures%20 http://alumni-test.alumni.cornell.edu/zzz/photo-sticker/"><i class="fa fa-envelope"></i></a>
        </div>-->
	</div>
	<!--Stickers-->
	<div id="stickers">
		<div style="width:410px; text-align: center;">
			<h2 style="margin:8px; text-align: left;">Choose a sticker!</h2>
		</div>
<!--		<p style="margin:8px;">Click on a sticker to place it on your profile picture.</p>-->
		<span class="picedit_control sticker picedit_sticker" title="Sticker" ><img  id="sticker_1" src="img/sticker_1.png" width="100%"/></span>
		<span class="picedit_control sticker picedit_sticker" title="Sticker" ><img  id="sticker_2" src="img/sticker_2.png" width="100%" /></span>
		<span class="picedit_control sticker picedit_sticker" title="Sticker" ><img  id="sticker_3" src="img/sticker_3.png" width="100%"/></span>
		<span class="picedit_control sticker picedit_sticker" title="Sticker" ><img  id="sticker_4" src="img/sticker_4.png" width="100%"/></span>
		<span class="picedit_control sticker hidden_sticker" id="hidden_sticker" title="Hidden Sticker" ><img  id="sticker_5" src="img/sticker_5.png" width="100%"/></span>
		<form method="post" id="email_form" action="index.cfm" onSubmit="index.cfm">
        <cfif IsDefined("Form.email")>
            <h2>Thank you for downloading CUprofile.zip</h2> 
            <p>Please check your Download folder and share your awesome profile images on social media! </p>
		<cfelse>
			<p><label for="email">Enter your email address to unlock the fifth sticker!</label><input style="padding: 5px;" type="text" size="30" name="email" id="email" placeholder="me@example.com"/>
				<input class="submitBtn" type="submit" value="&#xf09c Unlock and Download Zip" id="message_submit"/></p>
        </cfif>
			<p></p>
			<p style="font-size:0.75em;">Your email address is safe with us.  Do you want to know more?  <a style="color:#b31b1b;" href="#">Read our privacy policy</a></p>
		</form>
		<h4 id="result" style="margin:0;"></h4>
		<i id="sticker_lock" style="position: absolute; bottom:220px; right:40px; opacity: 0.5;" class="fa fa-lock fa-2x"></i>
	</div>
	<!--Picedit message-->
	<div class="picedit_message">
		<span class="picedit_control ico-picedit-close" data-action="hide_messagebox"></span>
		<div></div>
	</div>
	<!-- Picedit navigation -->
	<div class="picedit_nav_box">
		<!--<div class="picedit_pos_elements"></div>-->
		<ul class="picedit_nav_elements">
			<!-- Picedit button element begin -->
			<li class="picedit_element"> <span class="picedit_control" title="Rotate" data-action="rotate_cw"><i class="fa fa-repeat fa-lg"></i><b> Rotate</b></span></li>
				<!--					<ul class="picedit_control_menu picedit_tooltip">
					&lt;!&ndash;<div class="picedit_control_menu_container picedit_tooltip picedit_elm_1">&ndash;&gt;
						<li> <span>90&deg; CW</span> <span class="picedit_control picedit_action fa fa-repeat" data-action="rotate_cw"></span> </li>
						<li> <span>90&deg; CCW</span> <span class="picedit_control picedit_action fa fa-undo" data-action="rotate_ccw"></span> </li>
					&lt;!&ndash;</div>&ndash;&gt;
					</ul>-->
			<!-- Picedit button element end -->
			<!-- Picedit button element begin -->
			<li class="picedit_element"><span class="picedit_control" title="Crop" data-action="crop_open"><i class="fa fa-crop fa-lg"></i><b> Crop</b></span> </li>
			<!-- Picedit button element end -->
			<!-- Picedit button element begin -->
			<li class="picedit_element"><span class="picedit_control" title="Discard" data-action="discard_image"><i class="fa fa-trash fa-lg"></i><b>Discard</b></span></li>
			<!-- Picedit button element end -->
			<!-- Picedit button element begin -->
			<li class="picedit_element"><a id="downloadImg" class="picedit_control picedit_action" title="Download" onclick="$('#downloadImg').attr('href', canvas.toDataURL());" download="Cornell_Profile.png" href="#" target="_blank"><i class="fa fa-download fa-lg"></i><b> Download</b></a> </li>
			<!-- Picedit button element end -->
			<!-- Picedit button element begin -->
<!--			<li class="picedit_element downloadZip"><span id="downloadZip" class="picedit_control picedit_action" title="Download ZipFile"><i class="fa fa-file-archive-o fa-lg"></i><b>ZipFile</b></span> </li>-->
			<!-- Picedit button element end -->
			<!-- Picedit button element begin -->
			<!--<li class="picedit_element" id="socialshare"><span class="picedit_control fa fa-share-square-o" title="Share"><b> Share</b></span>
		    </li>-->
			<!-- Picedit button element end -->
		</ul>
	</div>
</div>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<script type="text/javascript" src="js/FileSaver.min.js"></script>
<script type="text/javascript" src="js/jszip.min.js"></script>
<script type="application/javascript" src="js/fabric.js"></script>
<script type="text/javascript" src="js/plugin.min.js"></script>
<script type="text/javascript" src="js/main.min.js"></script>
</body>
</html>