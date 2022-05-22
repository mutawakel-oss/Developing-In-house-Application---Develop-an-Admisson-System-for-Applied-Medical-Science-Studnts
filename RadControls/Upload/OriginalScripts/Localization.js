if (typeof(RadUploadNameSpace) == "undefined") RadUploadNameSpace = {};

if (typeof(RadUploadNameSpace.Localization) == "undefined") RadUploadNameSpace.Localization = [];

RadUploadNameSpace.Localization.ProcessRawArray = function(rawArr)
{
	var theLanguage = rawArr[0];
	if (typeof(RadUploadNameSpace.Localization[theLanguage]) == "undefined")
	{
	    RadUploadNameSpace.Localization[theLanguage] = [];
	}
	for (var i=1; i<rawArr.length; i+=2)
	{
		RadUploadNameSpace.Localization[theLanguage][rawArr[i]] = rawArr[i+1];
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