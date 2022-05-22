RadUploadNameSpace.RadUploadEventArgs = function(fileInputField)
{
	this.FileInputField = fileInputField;
};

RadUploadNameSpace.RadUploadDeleteSelectedEventArgs = function(fileInputFields)
{
	this.FileInputFields = fileInputFields;
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