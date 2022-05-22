function GetRadProgressManager()
{
	return window['RadProgressManager'];
};

if (typeof(RadUploadNameSpace) == "undefined") RadUploadNameSpace = {};

RadUploadNameSpace.RadProgressManager = function(parameters)
{
	RadControlsNamespace.EventMixin.Initialize(this);
	RadControlsNamespace.DomEventsMixin.Initialize(this);
	
	this._refreshPeriod = Math.max(parameters[0], 50);

	var ajaxUrl = parameters[1];

	this.EnableMemoryOptimizationIdentifier = parameters[2];
	this.UniqueRequestIdentifier = parameters[3];
	this.PageGUID = parameters[4];
	this.OnClientProgressStarted = parameters[5];
	this.OnClientProgressUpdating = parameters[6];
	this.FormId = parameters[7];
	this.ShouldRegisterForSubmit = parameters[8];
	this.EnableMemoryOptimization = parameters[9];
	this.SuppressMissingHttpModuleError = parameters[10];
	this.OnClientSubmitting = parameters[11];
		
	this.TimeFormat = "%HOURS%:%MINUTES%:%SECONDS%s";
	
	var form = document.getElementById(this.FormId);
	if (!form)
	{
		form = document.forms[0];
	}

	this.UpdateFormAction(form);

	if (this.ShouldRegisterForSubmit == true) 
	{
		this.RegisterForSubmit(form);
	}

	this._callbackUrl = this.CreateCallbackUrl(ajaxUrl);

	this._waitingForResponse = false;

	if (typeof(RadUploadNameSpace.ProgressAreas) == "undefined")
	{
		RadUploadNameSpace.ProgressAreas = [];
	}
};

RadUploadNameSpace.RadProgressManager.prototype = 
{
	ClientSubmitHandler : function(eventArgs)
	{
		if (this.RaiseEvent("OnClientSubmitting") == false) 
		{
			this.CancelEvent(eventArgs);
			return false;
		}

		this.StartProgressPolling();
	},
	
	StartProgressPolling : function()
	{
		this.InitSelectedFilesCount();
		
		this.RaiseEvent("OnClientProgressStarted");
		
		this._startTime = new Date();
		
		this.MakeCallback();
	},
	
	MakeCallback : function()
	{
		if (!this._waitingForResponse)
		{
			this._waitingForResponse = true;
			
			this.SendXmlHttpRequest();
		}
	},
	
	HandleCallback : function()
	{
		if (this._xmlHttpRequest.readyState != 4) return; //4 == complete

		this._waitingForResponse = false;

		if (this.ErrorOccured()) return;

		var responseText = this._xmlHttpRequest.responseText;
		if (responseText)
		{
			try 
			{
				eval(responseText); //var rawProgressData = {...};
			}
			catch(ex)
			{
				this.ShowInvalidContentMessage();
				return;
			}

			if (rawProgressData)
			{
				if (this.EnableMemoryOptimization == true && 
				   !this.SuppressMissingHttpModuleError &&
					rawProgressData.ProgressError)
				{
					alert(rawProgressData.ProgressError);
					return;
				}

				if (rawProgressData.InProgress)
				{
					if (this._selectedFilesCount > 0 || rawProgressData.RadProgressContextCustomCounters)
					{	//Update the progress areas only if there are selected files or custom progress info 
						this.ModifyProgressData(rawProgressData);

						if (!this.UpdateProgressAreas(rawProgressData))
						{	//Cancel was clicked on one of the progress areas. Refresh the page
							window.location.href = window.location.href;
							//And do not make another callback, just return
							return; 
						}
					}
				}
			}
		}
		
		window.setTimeout(this.CreateEventHandler("MakeCallback"), this._refreshPeriod);
	},
	
	ErrorOccured : function()
	{
		//Mozilla throws exception when accessing the this._xmlHttpRequest.status property.
		if (!document.all) return false;
		
		if (this._xmlHttpRequest.status == 404)
		{
			this.ShowNotFoundMessage();
		}
		else if (this._xmlHttpRequest.status > 0 && this._xmlHttpRequest.status != 200)
		{
			this.ShowGenericErrorMessage();
		}
		else return false; //status == 200 || status == 0
		
		return true;
	},
	
	ShowNotFoundMessage : function()
	{
		alert("RadUpload Ajax callback error. Source url was not found: \n\r\n\r" + 
			this._callbackUrl + "\n\r\n\rDid you register the RadUploadProgressHandler in web.config?" +
			"\r\n\r\nPlease, see the help for more details: RadUpload 2.x - Using RadUpload - Configuration - RadUploadProgressHandler.");
	},
	
	ShowGenericErrorMessage : function()
	{
		alert("RadUpload Ajax callback error. Source url returned error: " + this._xmlHttpRequest.status + " \n\r\n\r" + 
			this._xmlHttpRequest.statusText + " \n\r\n\r" + 
			this._callbackUrl + "\n\r\n\rDid you register the RadUploadProgressHandler in web.config?" +
			"\r\n\r\nPlease, see the help for more details: RadUpload 2.x - Using RadUpload - Configuration - RadUploadProgressHandler.");
	},
	
	ShowInvalidContentMessage : function()
	{
		alert("RadUpload Ajax callback error. Source url returned invalid content: \n\r\n\r" + 
			this._xmlHttpRequest.responseText + "\n\r\n\r" +
			this._callbackUrl + "\n\r\n\rDid you register the RadUploadProgressHandler in web.config?" +
			"\r\n\r\nPlease, see the help for more details: RadUpload 2.x - Using RadUpload - Configuration - RadUploadProgressHandler.");
	},
	
	UpdateProgressAreas : function(rawProgressData)
	{
		this.RaiseEvent("OnClientProgressUpdating", {ProgressData:rawProgressData});

		for (var i=0; i<RadUploadNameSpace.ProgressAreas.length; i++)
		{
			var progressArea = RadUploadNameSpace.ProgressAreas[i];
			if (progressArea.CancelClicked)
			{
				return false;
			}

			progressArea.Update(rawProgressData);
		}
		
		return true;
	},
	
	ModifyProgressData : function(rawProgressData)
	{
		var elapsedMilliseconds = new Date() - this._startTime;
		
		if (typeof(rawProgressData.TimeElapsed) == "undefined")
			rawProgressData.TimeElapsed = this.GetFormattedTime(this.ToSeconds(elapsedMilliseconds));
			
		if (rawProgressData.RadUpload)
		{
			var primaryTotal = rawProgressData.RadUpload.RequestSize;
			var primaryValue = rawProgressData.RadUpload.Bytes;
			
			if (typeof(rawProgressData.PrimaryTotal) == "undefined")
				rawProgressData.PrimaryTotal = this.FormatBytes(primaryTotal);
			if (typeof(rawProgressData.PrimaryValue) == "undefined")
				rawProgressData.PrimaryValue = this.FormatBytes(primaryValue);
			if (typeof(rawProgressData.PrimaryPercent) == "undefined")
				rawProgressData.PrimaryPercent = Math.round(100 * primaryValue / primaryTotal);
			if (typeof(rawProgressData.SecondaryTotal) == "undefined")
				rawProgressData.SecondaryTotal = this._selectedFilesCount;
			if (typeof(rawProgressData.SecondaryValue) == "undefined")
				rawProgressData.SecondaryValue = rawProgressData.RadUpload.FilesCount;
			if (typeof(rawProgressData.SecondaryPercent) == "undefined")
				rawProgressData.SecondaryPercent = Math.round(100 * rawProgressData.RadUpload.FilesCount / (this._selectedFilesCount != 0 ? this._selectedFilesCount : 1));
			if (typeof(rawProgressData.CurrentOperationText) == "undefined")
				rawProgressData.CurrentOperationText = rawProgressData.RadUpload.CurrentFileName;
			if (typeof(rawProgressData.Speed) == "undefined")
			{
				if (this.ToSeconds(elapsedMilliseconds) == 0)
				{
					rawProgressData.Speed = this.FormatBytes(0) + "/s";
				}
				else
				{
					rawProgressData.Speed = this.FormatBytes(rawProgressData.RadUpload.Bytes / this.ToSeconds(elapsedMilliseconds)) + "/s";
				}
			}
		}
		
		if (typeof(rawProgressData.TimeEstimated) == "undefined" && typeof(rawProgressData.PrimaryPercent) == "number")
		{
			if (rawProgressData.PrimaryPercent == 0)
			{
				rawProgressData.TimeEstimated = this.GetFormattedTime(this.ToSeconds(359999000));
			}
			else
			{
				rawProgressData.TimeEstimated = this.GetFormattedTime(this.ToSeconds(elapsedMilliseconds * (100 / rawProgressData.PrimaryPercent - 1)));
			}
		}
	},
	
	ToSeconds : function(milliseconds)
	{
		return Math.round(milliseconds / 1000);
	},
	
	InitSelectedFilesCount : function()
	{
		this._selectedFilesCount = 0;
		var fileInputs = document.getElementsByTagName("input");
		for (var i=0; i<fileInputs.length; i++)
		{
			var fileInput = fileInputs[i];
			if (fileInput.type == "file" && fileInput.value != "")
			{
				this._selectedFilesCount++;
			}
		}
	},
	
	CancelEvent : function (eventArgs)
	{
		if (!eventArgs) eventArgs = window.event;
		if (!eventArgs) return false;

		eventArgs.returnValue = false;
		eventArgs.cancelBubble = true;

		if (eventArgs.stopPropagation)
		{
			eventArgs.stopPropagation();
		}
		//Opera
		if (eventArgs.preventDefault)
		{		
			eventArgs.preventDefault();
		}

		return false;
	},

	SendXmlHttpRequest : function()
	{
		if (typeof(XMLHttpRequest) != "undefined")
		{
			this._xmlHttpRequest = new XMLHttpRequest();
		}
		else if (typeof(ActiveXObject) != "undefined")
		{
			this._xmlHttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
		}
		else return;

		this._xmlHttpRequest.onreadystatechange = this.CreateEventHandler("HandleCallback");
		this._xmlHttpRequest.open("GET", this.GetTimeStampedCallbackUrl(), true);
		this._xmlHttpRequest.send("");
	},
	
	CreateDelegate : function(instance, method)
	{
		return function() { method.apply(instance, arguments); };
	},
	
	CreateCallbackUrl : function(ajaxUrl)
	{
		var separator = ajaxUrl.indexOf("?") < 0 ? "?" : "&";
		
		return ajaxUrl + separator + this.UniqueRequestIdentifier + "=" + this.PageGUID;
	},
	
	GetTimeStampedCallbackUrl : function()
	{
		return this._callbackUrl + "&RadUploadTimeStamp=" + new Date().getTime();
	},
	
	RegisterForSubmit : function(form)
	{
		this.RegisterForLinkButtons(form);
		this.RegisterForRegularButtons(form);
	},
	
	RegisterForLinkButtons : function(form)
	{
		var clientSubmitHandlerFunction = this.CreateEventHandler("ClientSubmitHandler");
		
		var originalSubmit = form.submit;
		
		try
		{
			form.submit = function()
			{
				if (clientSubmitHandlerFunction() == false) return;
				
				form.submit = originalSubmit;
				form.submit();
			}
		}
		catch (exception) //This is executed in IE5.5
		{
			try
			{
				var originalDoPostBack = __doPostBack;
				__doPostBack = function(eventTarget, eventArgument)
				{
					var isValid = true;
					if (typeof(Page_ClientValidate) == "function")
					{
						isValid = Page_ClientValidate();
					}
					if (isValid)
					{
						if (clientSubmitHandlerFunction() == false) return;
						
						originalDoPostBack(eventTarget, eventArgument);
					}
				};
			}
			catch (exception) {}
		}
	},
	
	RegisterForRegularButtons : function(form)
	{
		this.AttachDomEvent(form, "submit", "ClientSubmitHandler");
	},
	
	UpdateFormAction : function(form)
	{
		if (typeof(form.action) == "undefined") form.action = "";
		
		if (form.action.match(/\?/))
		{
			form.action = this.RemoveQueryStringParameter(form.action, this.UniqueRequestIdentifier);
			form.action = this.RemoveQueryStringParameter(form.action, this.EnableMemoryOptimizationIdentifier);

			if (form.action.substring(form.action.length - 1) != "?")
			{
				form.action += "&";
			}
		}
		else
		{
			form.action += "?"
		}

		form.action += this.UniqueRequestIdentifier + "=" + this.PageGUID;
		
		if (this.EnableMemoryOptimization)
		{
			form.enctype = form.encoding = "multipart/form-data";
		}
		else
		{
			form.action += "&" + this.EnableMemoryOptimizationIdentifier + "=false";
		}
		//VAL 7798: ASP.NET AJAX hack. When the form action is modified, 
		// the ScriptManager disables the partial rendering!
		form._initialAction = form.action;
	},
	
	RemoveQueryStringParameter : function(queryString, parameter)
	{
		var parameterRegExp = new RegExp("&?" + parameter + "=[^&]*");
		if (queryString.match(parameterRegExp))
		{
			return queryString.replace(parameterRegExp, "");
		}
		return queryString;
	},
	
	FormatBytes : function(bytes)
	{
		var kiloBytes = bytes/1024;
		var megaBytes = kiloBytes/1024;
		if (megaBytes > 0.8)
		{
			return "" + Math.round(megaBytes * 100)/100 + "MB";
		}
		if (kiloBytes > 0.8) 
		{
			return "" + Math.round(kiloBytes * 100)/100 + "kB";
		}
		return "" + bytes + " bytes";
	},
	
	GetFormattedTime : function(seconds)
	{
		var period = this.NormalizeTime(seconds);
		return this.TimeFormat.replace(/%HOURS%/, period.Hours).replace(/%MINUTES%/, period.Minutes).replace(/%SECONDS%/, period.Seconds);
	},
	
	NormalizeTime : function(totalSeconds)
	{
		var seconds = totalSeconds % 60;
		var totalMinutes = Math.floor(totalSeconds/60);
		var minutes = totalMinutes % 60;
		var hours = Math.floor(totalMinutes/60);

		return { Hours : hours, Minutes : minutes, Seconds : seconds }
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