function GetRadUpload(clientID)
{
	return window[clientID];
};

if (typeof(RadUploadNameSpace) == "undefined") RadUploadNameSpace = {};

RadUploadNameSpace.RadUpload = function(parameters)
{
	this.Initialized = false;

	RadControlsNamespace.EventMixin.Initialize(this);
	RadControlsNamespace.DomEventsMixin.Initialize(this);
	
	this.Id = parameters[0];
	
	this.UpdateFormProperties(document.getElementById(parameters[1]));
	
	this.Language				= parameters[2];
	this.FocusOnLoad			= parameters[3];
	this.Enabled				= parameters[4];
	this.MaxFileCount			= parameters[5];
	this.InitialFileInputsCount = parameters[6];
	
	this.EnableFileInputSkinning = parameters[7];
	if (RadControlsNamespace.Browser.IsSafari || 
		(RadControlsNamespace.Browser.IsOpera && !RadControlsNamespace.Browser.IsOpera9))
	{
		this.EnableFileInputSkinning = false;
	}
	
	this.ReadOnlyFileInputs		= parameters[8];
	this.AllowedFileExtensions	= parameters[9];

	this.ShowCheckboxes		= parameters[10] & 1;
	this.ShowRemoveButtons	= parameters[10] & 2;
	this.ShowClearButtons	= parameters[10] & 4;

	this.OnClientAdded			= parameters[11];
	this.OnClientAdding			= parameters[12];
	this.OnClientDeleting		= parameters[13];
	this.OnClientClearing		= parameters[14];
	this.OnClientFileSelected	= parameters[15];
	this.OnClientDeletingSelected = parameters[16];
	
	this.CurrentIndex = 0;
	
	this.ButtonArea		= document.getElementById(this.Id + "ButtonArea");
	this.ListContainer	= document.getElementById(this.Id + "ListContainer");
	
	if (!document.readyState || document.readyState == "complete")
	{
		this.InnerConstructor();
	}
	else
	{
		this.AttachDomEvent(window, "load", "InnerConstructor");
	}
};

RadUploadNameSpace.RadUpload.prototype = 
{
	InnerConstructor : function(eventArgs)
	{
		this.DeleteXhtmlValiationRow();
		
		this.AddButton =	this.InitButton(document.getElementById(this.Id + "AddButton"), "Add", "AddFileInput");
		this.DeleteButton = this.InitButton(document.getElementById(this.Id + "DeleteButton"), "Delete", "DeleteSelectedFileInputs");
		
		this.FakeFileInputTemplate = this.CreateFakeInputTemplate();
		
		var initialFileInputsCount = this.MaxFileCount == 0 ? 
			this.InitialFileInputsCount :
			Math.min(this.InitialFileInputsCount, this.MaxFileCount);

		for (var i=0; i<initialFileInputsCount; i++)
		{
			this.AddFileInput();
		}

		this.SetAddDeleteButtonStates();

		this.Initialized = true;
	},
	
	AddFileInput : function(eventArgs)
	{
		var fileInput = this.AddFileInputAt(this.ListContainer.rows.length);
		
		if (this.Initialized)
		{
			try { fileInput.focus(); } catch(ex) {}
		}
	},
	
	AddFileInputAt : function(index)
	{
		if (typeof(index) == "undefined" ||
			index > this.ListContainer.rows.length)
		{
			index = this.ListContainer.rows.length;
		}
		
		if (this.MaxFileCount > 0 && index >= this.MaxFileCount) return;
		
		if (this.Initialized)
		{
			var result = this.RaiseEvent("OnClientAdding", new RadUploadNameSpace.RadUploadEventArgs(null));
			if (result == false)
			{
				return;
			}
		}
		
		this.AddFileInputAtInternal(index);
	},
	
	AddFileInputAtInternal : function(index)
	{
		var row = this.ListContainer.insertRow(index);
		this.AttachDomEvent(row, "click", "RowClicked");
				
		var cell;
		if (this.ShowCheckboxes)
		{
			cell = row.insertCell(row.cells.length);
			this.AppendCheckBox(cell);
		}
		
		cell = row.insertCell(row.cells.length);
		this.AppendStyledFileInput(cell);
		
		if (this.ShowClearButtons)
		{
			cell = row.insertCell(row.cells.length);
			this.AppendClearButton(cell);
		}
		
		if (this.ShowRemoveButtons)
		{
			cell = row.insertCell(row.cells.length);
			this.AppendRemoveButton(cell);
		}
		
		this.SetAddDeleteButtonStates();

		this.RaiseEvent("OnClientAdded", { Row : row });
		
		//We need this to be last because one may need to call GetID() in the
		// OnClientAdded event. For example to create additional fields per file
		this.CurrentIndex++;
		
		return row;
	},
	
	AppendCheckBox : function(container)
	{
		var checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.id = this.Id + "checkbox" + this.CurrentIndex;
		container.appendChild(checkbox);
		checkbox.className = "RadUploadFileSelector";
		checkbox.disabled = !this.Enabled;
		return checkbox;
	},
	
	AppendClearButton : function(container)
	{
		var button = document.createElement("input");
		button.type = "button";
		button.id = this.Id + "clear" + this.CurrentIndex;
		container.appendChild(button);
		this.InitButton(button, "Clear");
		button.className = "RadUploadClearButton";
		button.name = "ClearInput";
		button.disabled = !this.Enabled;
		
		return button;
	},

	AppendRemoveButton : function(container)
	{
		var button = document.createElement("input");
		button.type = "button";
		button.id = this.Id + "remove" + this.CurrentIndex;
		container.appendChild(button);
		button.value = RadUploadNameSpace.Localization[this.Language]["Remove"];
		button.className = "RadUploadRemoveButton";
		button.name = "RemoveRow";
		button.disabled = !this.Enabled;
		
		return button;
	},

	AppendStyledFileInput : function(container)
	{
		var fileInput = this.CreateFileInput();
		
		this.AttachDomEvent(fileInput, "change", "FileSelected");
		
		if (this.EnableFileInputSkinning)
		{
			fileInput.className = "RealFileInput";
			
			var div = document.createElement("div");
			container.appendChild(div);
			div.style.position = "relative";
			div.appendChild(this.FakeFileInputTemplate.cloneNode(true));
			div.appendChild(fileInput);
			
			if (!this.ReadOnlyFileInputs)
			{
				this.AttachDomEvent(fileInput, "keyup", "SyncFileInputContent");
			}
			else
			{
				this.AttachDomEvent(fileInput, "keydown", "CancelEvent");
			}

			return div;
		}
		else
		{
			container.appendChild(fileInput);
			
			fileInput.className = "NoSkinnedFileUnput";
			
			if (this.ReadOnlyFileInputs)
			{
				this.AttachDomEvent(fileInput, "keydown", "CancelEvent");
			}
			
			return fileInput;
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
	
	ClearFileInputAt : function(index)
	{
		var row = this.ListContainer.rows[index];
		if (row)
		{
			var result = this.RaiseEvent("OnClientClearing", new RadUploadNameSpace.RadUploadEventArgs(this.GetFileInputFrom(row)));
			if (result == false)
			{
				return false;
			}
			
			this.DeleteFileInputAt(index, true);
			this.AddFileInputAtInternal(index, true);
		}
	},
	
	CreateFakeInputTemplate : function()
	{
		var template = document.createElement("div");
		template.style.position = "absolute";
		template.style.top = 0;
		template.style.left = 0;
		template.style.zIndex = 1;
		
		var fileNameInputField = document.createElement("input");
		fileNameInputField.type = "text";
		fileNameInputField.className = "RadUploadInputField";
		template.appendChild(fileNameInputField);
		
		var selectButton = document.createElement("input");
		selectButton.type = "button";
		template.appendChild(selectButton);
		this.InitButton(selectButton, "Select");
		selectButton.disabled = !this.Enabled;
		selectButton.className = "RadUploadSelectButton";
		
		return template;
	},
	
	CreateFileInput : function()
	{
		var fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.name = this.GetID("file");
		fileInput.id = this.GetID("file");
		fileInput.disabled = !this.Enabled;
		
		return fileInput;
	},
	
	DeleteFileInputAt : function(index, skipEvent)
	{
		var row = this.ListContainer.rows[index];
		if (row)
		{
			if (!skipEvent)
			{
				var result = this.RaiseEvent("OnClientDeleting", new RadUploadNameSpace.RadUploadEventArgs(this.GetFileInputFrom(row)));
				if (result == false)
				{
					return false;
				}
			}
			row.parentNode.removeChild(row);
			
			this.SetAddDeleteButtonStates();
		}
	},
	
	DeleteSelectedFileInputs : function(eventArgs)
	{
		var fileInputsToDelete = [];
		var rowIndexesToDelete = [];
		for (var i=this.ListContainer.rows.length - 1; i>=0; i--)
		{
			var currentRow = this.ListContainer.rows[i];
			var currentCheckbox = currentRow.cells[0].childNodes[0];
			if (currentCheckbox.checked)
			{
				rowIndexesToDelete[rowIndexesToDelete.length] = i;
				fileInputsToDelete[fileInputsToDelete.length] = this.GetFileInputFrom(currentRow);
			}
		}
		
		var result = this.RaiseEvent("OnClientDeletingSelected", new RadUploadNameSpace.RadUploadDeleteSelectedEventArgs(fileInputsToDelete));
		if (result == false)
		{
			return;
		}
		
		for (var i=0; i<rowIndexesToDelete.length; i++)
		{
			this.DeleteFileInputAt(rowIndexesToDelete[i], true);
		}
	},
	
	DeleteXhtmlValiationRow : function()
	{
		var xmlValidationRow = this.ListContainer.rows[0];
		xmlValidationRow.parentNode.removeChild(xmlValidationRow);
	},
	
	FileSelected : function(e)
	{
		if (this.EnableFileInputSkinning)
		{
			this.SyncFileInputContent(e);
		}
		
		var fileInput = e.srcElement ? e.srcElement : e.target;
		//VAL Feature: GeminiID=7846
		fileInput.alt = fileInput.title = fileInput.value;
		
		this.RaiseEvent("OnClientFileSelected", new RadUploadNameSpace.RadUploadEventArgs(fileInput));
	},
	
	GetFileInputFrom : function(row)
	{
		var inputs = row.getElementsByTagName("input");
		for (var i=0; i<inputs.length; i++)
		{
			if (inputs[i].type == "file")
			{
				return inputs[i];
			}
		}
		return null;
	},
	
	GetFileInputs : function()
	{
		var fileInputs = [];
		for (var i=0; i<this.ListContainer.rows.length; i++)
		{
			fileInputs[fileInputs.length] = this.GetFileInputFrom(this.ListContainer.rows[i]);
		}
		return fileInputs;
	},
	
	GetID : function(suffix)
	{
		return this.Id + suffix + this.CurrentIndex;
	},
	
	GetParentRow : function(element)
	{
		if (element)
		{
			if (element.tagName.toLowerCase() == "tr")
			{
				return element;
			}
			else
			{
				return this.GetParentRow(element.parentNode);
			}
		}
		return null;
	},
	
	InitButton : function(button, localizationId, clickHandlerName)
	{
		if (button)
		{
			button.value = RadUploadNameSpace.Localization[this.Language][localizationId];
			if (this.Enabled)
			{
				if (clickHandlerName) this.AttachDomEvent(button, "click", clickHandlerName);
			}
			else
			{
				button.disabled = true;
			}
		}
		return button;
	},
	
	IsExtensionValid : function(fileName)
	{
		if (fileName == "") return true;
		
		for (var i=0; i<this.AllowedFileExtensions.length; i++)
		{
			var currentExtension = this.AllowedFileExtensions[i].substring(2);
			var theRegexp = new RegExp("\." + currentExtension + "$", "ig");
			if (fileName.match(theRegexp))
			{
				return true;
			}
		}
		return false;
	},
	
	RowClicked : function(e)
	{
		var srcElement = e.srcElement ? e.srcElement : e.target;
		var srcRow = this.GetParentRow(srcElement);

		if (srcElement.name == "RemoveRow")
		{
			this.DeleteFileInputAt(srcRow.rowIndex);
		}
		else if (srcElement.name == "ClearInput")
		{
			this.ClearFileInputAt(srcRow.rowIndex);
		}
	},
	
	SetAddDeleteButtonStates : function()
	{
		this.SetButtonState(this.DeleteButton, this.ListContainer.rows.length > 0);
		this.SetButtonState(this.AddButton, (this.MaxFileCount <= 0) || (this.ListContainer.rows.length < this.MaxFileCount));
	},
	
	SetButtonState : function(button, isEnabled)
	{
		if (button)
		{
			button.className = isEnabled ? "RadUploadButton" : "RadUploadButtonDisabled";
		}
	},
		
	SyncFileInputContent : function(e)
	{
		var fileInput = e.srcElement ? e.srcElement : e.target;
		var styledInput = fileInput.parentNode.childNodes[0].childNodes[0];
		if (fileInput !== styledInput)
		{
			styledInput.value = fileInput.value;
			styledInput.title = fileInput.value;
			styledInput.disabled = true;
		}
	},
	
	UpdateFormProperties : function(form)
	{
		if (!form) form = document.forms[0];
		form.enctype = form.encoding = "multipart/form-data";
	},
	
	ValidateExtensions : function()
	{
		for (var i=0; i<this.ListContainer.rows.length; i++)
		{
			var currentFileName = this.GetFileInputFrom(this.ListContainer.rows[i]).value;
			if (!this.IsExtensionValid(currentFileName))
			{
				return false;
			}
		}
		return true;
	}
};

RadUploadNameSpace.RadUpload.ApplySkin = function(fileInput)
{
	
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