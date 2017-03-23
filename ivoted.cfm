<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
<title>Cornell's Alumni Trustee Election: I voted! Did you?</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<meta http-equiv="Content-Language" content="en-us" />

<!-- Twitter Cards -->

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@cornellalumni">
<meta name="twitter:creator" content="@cornellalumni">
<meta name="twitter:title" content="Cornell's 2017 Alumni Trustee Election: I voted! Did you?">
<meta name="twitter:description" content="By voting, you are helping to select the alumni-elected members of the Cornell University Board of Trustees who guide the future of our alma mater. Cornell is one of the few major universities that offer their alumni this opportunity, so make sure you are ALL IN and vote!">
<meta name="twitter:image:src" content="http://alumni.cornell.edu/trustees/images/ATV-social-graphic.jpg">
<meta name="twitter:url" content="http://alumni.cornell.edu/trustees" />

<!-- End Twitter Cards -->

<!-- Facebook Open Graph -->

<meta property="og:title" content="Cornell's 2017 Alumni Trustee Election: I voted! Did you?" />
<meta property="og:site_name" content="Cornell University Alumni"/>
<meta property="og:url" content="http://www.alumni.cornell.edu/trustees/ivoted.cfm" />
<meta property="og:description" content="By voting, you are helping to select the alumni-elected members of the Cornell University Board of Trustees who guide the future of our alma mater. Cornell is one of the few major universities that offer their alumni this opportunity, so make sure you are ALL IN and vote!" />
<meta property="og:type" content="article" />
<meta property="og:image"  content="http://alumni.cornell.edu/trustees/images/ATV-social-graphic.jpg" /> 

<!-- End Facebook Open Graph -->

<!-- AddThis JS -->

<script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5435428b36f42d17" async="async" ></script>

<!-- End AddThis JS -->



<link rel="shortcut icon" href="favicon_000.ico" type="image/x-icon" />
<link rel="stylesheet" type="text/css" media="screen" href="../_includes/styles/screen.css" />
<cfinclude template="/alumni_includes/menu_css.cfm">

<link rel="stylesheet" type="text/css" media="screen" href="../_includes/styles/tabs.css" />

<link rel="stylesheet" type="text/css" href="css/picedit.css" />
<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-T8Gy5hrqNKT+hzMclPo118YTQO6cYprQmhrYwIiQ/3axmI1hQomh7Ud2hPOy8SP1" crossorigin="anonymous">

<style>
	.photo {}
	ul.candidates { list-style:none; margin:0 0 0 1em;; padding: 0 0; }
	.candidates li { float:left; width:25%; text-align:center; display:block; list-style:none; list-style-image:none; background:none; margin:0 0; padding:0 0; }
	.candidates li img { margin-bottom:.7em; }
	a{color: #b31b1b;text-decoration: none;}
</style>
</head>

<body class="twocolumn">
<cfinclude template="/alumni_includes/header.cfm">
<div id="header">
  <cfinclude template="/alumni_includes/main-nav.cfm">
  <hr />
  <cfinclude template="_identity.cfm">
</div>
<hr />
<div id="wrap">
 <div id="pagetitle">
     <h1>&nbsp;</h1>
     <h1>Thank you for voting in Cornell's 2017 </h1>
     <h1>Alumni Trustee Election!</h1>
  </div>
  <div id="content">
    <div class="section-navigation-wrap">
      <cfinclude template="_nav.cfm">
    </div>
   
    <div id="main">
     <h2> Share the news and encourage your alumni friends to vote!</h2>
     <p>&nbsp;</p>
     <!-- Go to www.addthis.com/dashboard to customize your tools -->
    <div class="addthis_sharing_toolbox"></div>
        <p>&nbsp;</p>
        
    	<!---Photo sticker app--->
    <!--- Insert the new record ---> 
<cfif IsDefined("Form.email") and isValid("email", #Form.email#)>
    <cfquery name="AddEmail" datasource="#request.dsn#">
    INSERT INTO PHOTOSTICKER (email, submit_dt)
    VALUES (
        <cfqueryparam cfsqltype="cf_sql_varchar" value="#Form.email#">,
        #createodbcdatetime(now())#
        ) 
    </cfquery> 
</cfif>
<div id="thebox" class="picedit_box">
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
	</div>
	<!--Stickers-->
	<div id="stickers">
		<div style="width:410px; text-align: center;">
			<h2 style="margin:8px; text-align: left;">Choose a sticker!</h2>
		</div>
    <span class="picedit_control sticker picedit_sticker" title="Sticker" ><img  id="sticker_1" src="img/I-Voted-CBear.png" width="100%" /></span>
    <span class="picedit_control sticker picedit_sticker" title="Sticker" ><img  id="sticker_2" src="img/I-Voted-CUseal.png" width="100%" /></span>
    <span class="picedit_control sticker picedit_sticker" title="Sticker" ><img  id="sticker_3" src="img/I-Voted-FullBear.png" width="100%"/></span>
		<form method="post" id="email_form" action="#CGI.script_name#">
<!---			<p></p>
			<p style="font-size:0.75em;">Your email address is safe with us.  Do you want to know more?  <a style="color:#b31b1b;" href="#">Read our privacy policy</a></p>--->
		</form>
		<h4 id="result" style="margin:0;"></h4>
	</div>
	<!--Picedit message-->
	<div class="picedit_message">
		<span class="picedit_control ico-picedit-close" data-action="hide_messagebox"></span>
		<div></div>
	</div>
	<!-- Picedit navigation -->
	<div class="picedit_nav_box">
		<ul class="picedit_nav_elements" style="list-style-type:none;">
			<!-- Picedit button element begin -->
			<li class="picedit_element" style="background:none;"> <span class="picedit_control" title="Rotate" data-action="rotate_cw"><i class="fa fa-repeat fa-lg"></i><b> Rotate</b></span></li>
			<!-- Picedit button element end -->
			<!-- Picedit button element begin -->
			<li class="picedit_element" style="background:none;"><span class="picedit_control" title="Crop" data-action="crop_open"><i class="fa fa-crop fa-lg"></i><b> Crop</b></span> </li>
			<!-- Picedit button element end -->
			<!-- Picedit button element begin -->
			<li class="picedit_element" style="background:none;"><span class="picedit_control" title="Discard" data-action="discard_image"><i class="fa fa-trash fa-lg"></i><b>Discard</b></span></li>
			<!-- Picedit button element end -->
			<!-- Picedit button element begin -->
<!---			<li class="picedit_element" style="background:none;"><a id="downloadImg" class="picedit_control" title="Download" onclick="$('#downloadImg').attr('href', canvas.toDataURL("image/png"));" download="Cornell_Profile.png" href="#"><i class="fa fa-download fa-lg"></i><b> Download</b></a> </li>--->
			<li class="picedit_element" style="background:none;"><span class="picedit_control" title="Download" data-action="download_image"><i class="fa fa-download fa-lg"></i><b> Download</b></span></li>
		</ul>
	</div>
</div>    
    <!---End of Photo sticker app--->
    
    <p>&nbsp;</p>
     <h2>Haven't voted yet?      </h2>
     <p>You've been sent here by a friend to encourage you to cast your own vote. Here's how:</p>
<ul>
  <li>Look for the email you&rsquo;ll be receiving on or about March 21,  or the paper ballot you&rsquo;ll get in <br />
    the mail.</li>
  <li>Go to the web link featured  in the communication that you receive: <a href="https://www.esc-vote.com/caa2017" target="_blank">https://www.esc-vote.com/caa2017</a>.</li>
  <li>Enter the validation  number that appears in the email or on the paper ballot.</li>
  <li>Enter your 2-digit class  year.</li>
  <li>Vote!</li>
  <li>Share! Tell your fellow  Cornell alumni that you&rsquo;ve voted via social media and get out the vote!</li>
</ul>
     <p>Questions: Contact the election Help Desk at <a href="mailto:cornell@electionservicescorp.com">cornell@electionservicescorp.com</a>, or call toll-free 1-866-720-4357 Monday thru Friday 9:00 a.m.&#8211;5:00 p.m. (EST)</p>
     <p>&nbsp;</p>
     <h2>Nominations will open  May 17 for 2018 candidates!</h2>
     <p>To learn more about the alumni trustee election  process and nominations, please  visit <a href="./">http://alumni.cornell.edu/trustees/</a>.</p>
<h3>&nbsp;</h3>
     <p>&nbsp;       </p>
<cfquery name="candidates" datasource="#db1#" username="#user1#" password="#pass1#">
		SELECT * FROM tballot_candidates WHERE lname = 'Galvin' OR lname = 'Glasgal' ORDER BY dbms_random.random
		<!--- random order --->
	</cfquery>
	<cfoutput query="candidates"></cfoutput></div>
  </div>
</div>
<hr />
<cfinclude template="/alumni_includes/footer-secure.cfm">
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<script type="application/javascript" src="js/fabric.js"></script>
<!---<script type="application/javascript" src="js/FileSaver.min.js"></script>--->
<script type="text/javascript" src="js/plugin.min.js"></script>
<script type="text/javascript" src="js/main.min.js"></script>
</body>
</html>