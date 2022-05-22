if (typeof(RadUploadNameSpace) == "undefined") RadUploadNameSpace = {};

RadUploadNameSpace.UploadContainerName = "Upload";
RadUploadNameSpace.SummaryContainerName = "Summary";
RadUploadNameSpace.EmptyContainerName = "Empty";

RadUploadNameSpace.RadTemplateUpload = function(parameters)
{
	this.Id = parameters[0];
	this.SummaryItems = parameters[1];

	RadControlsNamespace.EventMixin.Initialize(this);
	RadControlsNamespace.DomEventsMixin.Initialize(this);

	this.RegisterForAutomaticDisposal("Dispose");

	this.SelectedFiles = [];
	
	this.AddButtonElement = this.FindUploadElement("Add");
	if (this.AddButtonElement)
	{
		this.AddButtonElement.onclick = this.CreateEventHandler("AddSelectedFile");
	}
}

RadUploadNameSpace.RadTemplateUpload.prototype = 
{
	AddSelectedFile : function(e)
	{
		var summary = document.getElementById(this.Id + "_" + RadUploadNameSpace.SummaryContainerName);
		alert(summary.outerHTML);
		var cloned = summary.cloneNode(true);
		alert(cloned.outerHTML);
		return false;
	},
	
	Dispose : function()
	{
	},

	SetSummary : function()
	{
		var summary = document.getElementById(this.Id + "_" + RadUploadNameSpace.SummaryContainerName);
		var empty = document.getElementById(this.Id + "_" + RadUploadNameSpace.EmptyContainerName);
		summary.style.display = this.SelectedFiles.length > 0 ? "block" : "none";
		empty.style.display = this.SelectedFiles.length > 0 ? "none" : "block";
	},

	FindUploadElement : function(name)
	{
		var elementId = this.Id + "_" + RadUploadNameSpace.UploadContainerName + "_" + name;
		return document.getElementById(elementId);
	},

	FindSummaryElement : function(name)
	{
		var elementId = this.Id + "_" + RadUploadNameSpace.SummaryContainerName + "_" + name;
		return document.getElementById(elementId);
	}
}