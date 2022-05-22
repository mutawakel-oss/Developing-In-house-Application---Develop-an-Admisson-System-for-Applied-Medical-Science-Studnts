if (typeof(window.RadControlsNamespace) == "undefined")
{
	window.RadControlsNamespace = new Object();
};

RadControlsNamespace.AppendStyleSheet = function(callback, clientID, pathToCssFile)
{
	if (!pathToCssFile) 
	{ 
		return; 
	}

	if (!callback)
	{
		document.write("<" + "link" + " rel='stylesheet' type='text/css' href='" + pathToCssFile + "' />");
	}
	
	else
	{
		var linkObject = document.createElement("LINK");
		linkObject.rel = "stylesheet";
		linkObject.type = "text/css";
		linkObject.href = pathToCssFile;
		document.getElementById(clientID + "StyleSheetHolder").appendChild(linkObject);
	}
};

//BEGIN_ATLAS_NOTIFY
if (typeof(Sys) != "undefined")
{
    if (Sys.Application != null && Sys.Application.notifyScriptLoaded != null)
    {
        Sys.Application.notifyScriptLoaded();
    }
}
//END_ATLAS_NOTIFY