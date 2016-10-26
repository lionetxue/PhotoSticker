<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Insert Email input into database</title>
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
<cfoutput>
<h2>Thank you for downloading CUprofile.zip</h2> 
<p>You have downloaded a zip file that contains your profile photos with different stickers. 
<br/>
Please check your Download folder and share your awesome profile images on social media! </p>
</cfoutput>
</body>
</html>