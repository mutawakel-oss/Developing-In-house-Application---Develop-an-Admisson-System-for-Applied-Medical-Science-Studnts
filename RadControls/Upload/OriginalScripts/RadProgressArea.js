function GetRadProgressArea(clientID)
{
	return window[clientID];
};

if (typeof(RadUploadNameSpace) == "undefined") RadUploadNameSpace = {};

RadUploadNameSpace.ProgressAreaContainerName = "Panel";

RadUploadNameSpace.RadProgressArea = function(parameters)
{
	this.Id = parameters[0];
	this.OnClientProgressUpdating = parameters[1];
	this.OnClientProgressBarUpdating = parameters[2];
	this.ProgressManagerFound = parameters[3];
	
	if (!this.ProgressManagerFound)
	{
		alert("Could not find an instance of RadProgressManager on the page. Are you missing the control declaration?");
	}

	RadControlsNamespace.EventMixin.Initialize(this);
	RadControlsNamespace.DomEventsMixin.Initialize(this);
	
	this.Element = document.getElementById(this.Id);	
	this.PrimaryProgressBarElement = this.FindElement("PrimaryProgressBar");
	this.PrimaryTotalElement = this.FindElement("PrimaryTotal");
	this.PrimaryValueElement = this.FindElement("PrimaryValue");
	this.PrimaryPercentElement = this.FindElement("PrimaryPercent");
	this.SecondaryProgressBarElement = this.FindElement("SecondaryProgressBar");
	this.SecondaryTotalElement = this.FindElement("SecondaryTotal");
	this.SecondaryValueElement = this.FindElement("SecondaryValue");
	this.SecondaryPercentElement = this.FindElement("SecondaryPercent");
	this.CurrentOperationElement = this.FindElement("CurrentOperation");
	this.TimeElapsedElement = this.FindElement("TimeElapsed");
	this.TimeEstimatedElement = this.FindElement("TimeEstimated");
	this.SpeedElement = this.FindElement("Speed");
	this.CancelButtonElement = this.FindElement("CancelButton");

	this.CancelClicked = false;
	
	if (this.CancelButtonElement)
	{
		this.AttachDomEvent(this.CancelButtonElement, "click", "CancelRequest");
	}
	
	if (typeof(RadUploadNameSpace.ProgressAreas) == "undefined")
	{
		RadUploadNameSpace.ProgressAreas = [];
	}
	
	this.RegisterForAutomaticDisposal("Hide");

	RadUploadNameSpace.ProgressAreas[RadUploadNameSpace.ProgressAreas.length] = this;
};

RadUploadNameSpace.RadProgressArea.prototype = 
{
	Update : function(progressData)
	{
		if (this.RaiseEvent("OnClientProgressUpdating", {ProgressData:progressData}) == false) return;
		
		this.Show();
		
		if (this.RaiseEvent("OnClientProgressBarUpdating", {ProgressValue:progressData.PrimaryPercent, ProgressBarElementName:"PrimaryProgressBar", ProgressBarElement:this.PrimaryProgressBarElement}) != false)
		{
			this.UpdateHorizontalProgressBar(this.PrimaryProgressBarElement, progressData.PrimaryPercent);
		}
		if (this.RaiseEvent("OnClientProgressBarUpdating", {ProgressValue:progressData.SecondaryPercent, ProgressBarElementName:"SecondaryProgressBar", ProgressBarElement:this.SecondaryProgressBarElement}) != false)
		{
			this.UpdateHorizontalProgressBar(this.SecondaryProgressBarElement, progressData.SecondaryPercent);
		}
		
		this.UpdateTextIndicator(this.PrimaryTotalElement, progressData.PrimaryTotal);
		this.UpdateTextIndicator(this.PrimaryValueElement, progressData.PrimaryValue);
		this.UpdateTextIndicator(this.PrimaryPercentElement, progressData.PrimaryPercent);
		this.UpdateTextIndicator(this.SecondaryTotalElement, progressData.SecondaryTotal);
		this.UpdateTextIndicator(this.SecondaryValueElement, progressData.SecondaryValue);
		this.UpdateTextIndicator(this.SecondaryPercentElement, progressData.SecondaryPercent);
		this.UpdateTextIndicator(this.CurrentOperationElement, progressData.CurrentOperationText);
		this.UpdateTextIndicator(this.TimeElapsedElement, progressData.TimeElapsed);
		this.UpdateTextIndicator(this.TimeEstimatedElement, progressData.TimeEstimated);
		this.UpdateTextIndicator(this.SpeedElement, progressData.Speed);
	},
	
	Show : function()
	{
		this.Element.style.display = "";
		if (this.Element.style.position == "absolute")
		{
			if (typeof(this.Overlay) == "undefined")
			{
				this.Overlay = new RadControlsNamespace.Overlay(this.Element);
			}
			this.Overlay.Update();
		}
	},
	
	Hide : function()
	{
		this.Element.style.display = "none";
		if (this.Overlay)
		{
			this.Overlay.Dispose();
			this.Overlay = null;
		}
	},
	
	UpdateHorizontalProgressBar : function(element, percent)
	{
		if (element && typeof(percent) != "undefined") element.style.width = percent + "%";
	},
	
	UpdateVerticalProgressBar : function(element, percent)
	{
		if (element && typeof(percent) != "undefined") element.style.height = percent + "%";
	},
	
	UpdateTextIndicator : function(element, text)
	{
		if (element && typeof(text) != "undefined") 
		{
			if (typeof(element.value) == "string") element.value = text;
			else if (typeof(element.innerHTML) == "string") element.innerHTML = text;
		}
	},
	
	CancelRequest : function()
	{
		this.CancelClicked = true;
	},
	
	FindElement : function(suffix)
	{
		var elementId = this.Id + "_" + RadUploadNameSpace.ProgressAreaContainerName + "_" + suffix;
		return document.getElementById(elementId);
	}
}

//BEGIN_ATLAS_NOTIFY
if (typeof(Sys) != "undefined")
{
    if (Sys.Application != null && Sys.Application.notifyScriptLoaded != null)
    {
        Sys.Application.notifyScriptLoaded();
    }
}
//END_ATLAS_NOTIFY