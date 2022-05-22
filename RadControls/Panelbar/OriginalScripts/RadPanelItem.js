function RadPanelItem(domElement)
{
	this.DomElement = domElement;
	
	this.LinkElement = RadPanelbar.GetFirstChildByTagName(this.DomElement, "a");
	
	if (this.LinkElement == null)
	{
		
		this.ID = this.DomElement.id;
		this.TextElement = RadPanelbar.GetFirstChildByTagName(this.DomElement, "span");
		this.NavigateUrl = "";	
	}
	else
	{
		this.ID = this.LinkElement.id;
		this.TextElement = RadPanelbar.GetFirstChildByTagName(this.LinkElement, "span");
		this.NavigateUrl = this.LinkElement.href;
	}
		
	this.IsSeparator = false;
	this.AnimationContainer = null;
	this.ExpandedItem = null;
	this.FocusedItem = null;
	this.Items =  [];
	this.Attributes = {};
	this.Index = -1;
	this.Level = -1;
	this.Parent = null;
	this.Panelbar = null;
	this.TimeoutPointer = null;
	this.Templated = false;
	this.NavigateAfterClick = true;
	
	// css classes, load from the server
	this.FocusedCssClass = "focused";
	this.SelectedCssClass = "selected";
	this.ClickedCssClass = "clicked";
	this.ExpandedCssClass = "expanded";
	this.DisabledCssClass = "disabled";
	this.CssClass = "";
	
	this.Focused = false;
	this.Clicked = false;
	this.Enabled = true;
	this.Expanded = false;
	this.EaseInProgress = false;
	
	this.Initialized = false;
	
	this.ImageOverUrl = "";
	this.ExpandedImageUrl = "";
	this.DisabledImageUrl = "";
}


RadPanelItem.prototype.SetText = function (text)
{
	this.TextElement.innerHTML = text;
	this.Text = text;
	this.RecordState();
}

RadPanelItem.prototype.SetValue = function (value)
{
	this.Value = value;
	this.RecordState();
}

RadPanelItem.prototype.GetHeight = function ()
{
	return this.Parent.Expanded || this.Parent == this.Panelbar ? this.LinkElement.offsetHeight : 0;
}

RadPanelItem.prototype.InitializeDomElements = function()
{
	this.AnimationContainer = RadPanelbar.GetFirstChildByClassName(this.DomElement, "slide");
	this.ImageElement = RadPanelbar.GetFirstChildByTagName(this.LinkElement || this.DomElement, "img");
	
	if (this.ImageElement)
	{
		this.ImageUrl = this.ImageElement.src;
	}
		
	if (this.AnimationContainer)
	{
		var ul = this.AnimationContainer.getElementsByTagName("ul")[0];
		
		this.ChildItemList = ul;
	}
}

RadPanelItem.prototype.Initialize = function ()
{

	RadControlsNamespace.DomEventMixin.Initialize(this);

	this.LoadConfiguration();

	this.InitializeDomElements();



		
	if (this.AnimationContainer)
	{
		
		this.Ease = new RadControlsNamespace.Ease(
			this.ChildItemList, 
			this.Panelbar, 
			0,
			0,
			this
		); 

		this.Ease.SlideParent = true;
	
		var expandDirection = "down";
		var easeProperty = RadPanelbarNamespace.ExpandDirectionPropertyName[expandDirection];
		
		this.Ease.SetSide("top");
		this.AnimationContainer.style.zIndex = this.GlobalIndex + 10;
		this.ChildItemList.style.zIndex = this.GlobalIndex + 10;
	}
	
	if (this.TextElement && this.TextElement.firstChild)
	{
	
		this.Text = this.TextElement.firstChild.nodeValue;
	}
	
	this.OriginalZIndex = this.DomElement.style.zIndex;
	
	this.AttachEventHandlers();
	this.RenderAccessKey();

	this.Initialized = true;	
	RadPanelbar.CreateState(this);
	
	this.UpdateCssClass();
	

};


RadPanelItem.prototype.RenderAccessKey = function ()
{
	if (this.IsSeparator || !this.LinkElement)
	{
		return;
	}
	
	var accessKey = this.LinkElement.accessKey.toLowerCase();
	
	// If accessKey is not set
	if (!accessKey)
	{
		return;
	}
	var text = this.TextElement.firstChild.nodeValue;
	var indexOfAccessKey = text.toLowerCase().indexOf(accessKey);
	
	// If accesKey is not found
	if (indexOfAccessKey == -1)
	{
		return;
	}
	
	this.TextElement.innerHTML = 
		text.substr(0, indexOfAccessKey) + 
		"<u>" + 
		text.substr(indexOfAccessKey,  1) + 
		"</u>" + 
		text.substr(indexOfAccessKey + 1, text.length);
}


RadPanelItem.prototype.Dispose = function ()
{
	if (!this.Initialized) return;
	this.DisposeDomEventHandlers();
	
	if (this.Ease)
	{
		this.Ease.Dispose();
	}
	
	if (this.DomElement)
	{
	    this.DomElement.RadShow = null;
	}
	
	this.DomElement = null;
	this.LinkElement = null;
	this.ChildItemList = null;
	this.TextElement = null;
	this.ImageElement = null;	
	this.AnimationContainer = null;	
}

RadPanelItem.prototype.Focus = function ()
{
	if (!this.CanFocus())
	{
		return;
	}
	
	if ((!this.Parent.Expanded) && this.Parent.Expand)
	{
		this.Parent.Expand();
	}

	this.Parent.FocusedItem = this;
	
	if (!this.Focused && this.LinkElement)
	{
		this.LinkElement.focus();
	}
	
	this.UpdateCssClass();
	
	this.RaiseEvent("OnClientItemFocus");
}

RadPanelItem.prototype.Blur = function ()
{
	if (this.IsSeparator)
	{
		return;
	}
	
	if (this.Focused)
	{
		this.LinkElement.blur();
	}
	this.Parent.FocusedItem = null;
	this.UpdateCssClass();
	this.RaiseEvent("OnClientItemBlur");
}

RadPanelItem.prototype.SetChildrenHeight = function (value)
{
	if (value < 0) value = 0;
	if (!value == "") value += "px";
	
	this.ChildItemList.style.height = value;
	this.AnimationContainer.style.height = value;
	
}

RadPanelItem.prototype.UpdateChildrenWidth = function ()
{
	this.AnimationContainer.style.display = "none"; 
	this.ChildItemList.style.display = "none";
	//this.ChildItemList.style.width = this.DomElement.offsetWidth + "px";
	//this.AnimationContainer.style.width = this.DomElement.offsetWidth + "px";
	this.ChildItemList.style.display = "block";
	this.AnimationContainer.style.display = "block";
}

RadPanelItem.prototype.InstantExpand = function ()
{
	if (!this.Ease) return;
	var type = this.Ease.ExpandConfig.Type;
	this.Ease.ExpandConfig.Type = "None";
	this.Expand();
	this.Ease.ExpandConfig.Type = type;
}
	
RadPanelItem.prototype.Expand = function ()
{	
	if (!this.Items.length)
	{
		return;
	}
	
	if (this.Expanded)
	{
		return;
	}

	if (this.Level == 1 && 	this.Panelbar.FullExpandedItem)
	{
		this.ChildItemList.style.height = this.Panelbar.GetGroupHeight() + "px";
	}
	
	this.ChildItemList.style.display = "none";
	this.ChildItemList.style.width = "100%";//this.DomElement.offsetWidth + "px";
	
	if (this.Level > 1 && !this.Panelbar.FullExpandedItem)
	{
		this.Parent.SetChildrenHeight("");
	}
	
	
		
	if (this.Parent.ExpandedItem && this.Panelbar.SingleExpandedItem)
	{
		this.Parent.ExpandedItem.Collapse();
	}
	
	this.Parent.ExpandedItem = this;
	this.Panelbar.LastExpandedItem = this;
	
	this.Expanded = true;
	
	var documentSize = RadControlsNamespace.Screen.GetViewPortSize();
	
	this.ChildItemList.style.display = "block";
		
	this.Ease.ShowElements();
	
	this.Ease.SetSide("top");


	this.EaseInProgress = true;
	this.Ease.In();
	
	
	this.UpdateCssClass();

	this.RecordState();
	this.RaiseEvent("OnClientItemExpand");
	
	this.CallRadShow();
};	

RadPanelItem.prototype.CallRadShow = function ()
{
	var children = this.ChildItemList.getElementsByTagName("*");
	
	for (var i = 0; i < children.length; i ++)
	{
		var child = children[i];
		if (child.RadShow)
		{
			child.RadShow();
		}
	}
}

RadPanelItem.prototype.RaiseEvent = function(eventName)
{
	return this.Panelbar.RaiseEvent(eventName, {Item:this});
}

RadPanelItem.prototype.UpdateCssClass = function ()
{
	if (this.IsSeparator || !this.LinkElement)
	{
		return;
	}
	
	var cssClass = "link " + this.CssClass;
	
	if (this.Focused)
	{
		cssClass = cssClass + " " + this.FocusedCssClass;
	}
	
	if (this.Selected)
	{
		cssClass = cssClass + " " + this.SelectedCssClass;
	}	

	if (this.Expanded)
	{
		cssClass = cssClass + " " + this.ExpandedCssClass;
	}

	if (this.Clicked)
	{
		cssClass = cssClass + " " + this.ClickedCssClass;
	}

    if (!this.Enabled)
    {
        cssClass = cssClass + " " + this.DisabledCssClass;
    }

	this.LinkElement.className = cssClass;
	
	this.UpdateImageUrl();
}

RadPanelItem.prototype.UpdateImageUrl = function ()
{
	if (!this.ImageElement) return;

	var newUrl = this.ImageUrl;

	if (this.Hovered && this.ImageOverUrl)
	{
		newUrl = this.ImageOverUrl;
	}

	if (this.Selected && this.SelectedImageUrl)
	{
		newUrl = this.SelectedImageUrl;
	}

	if (this.Expanded && this.ExpandedImageUrl)
	{
		newUrl = this.ExpandedImageUrl;
	}
	
	if (!this.Enabled && this.DisabledImageUrl)
	{
		newUrl = this.DisabledImageUrl;
	}
	        
    newUrl = newUrl.replace(/&amp;/ig, "&");
    
	if (newUrl != this.ImageElement.src)
	{
		this.ImageElement.src = newUrl;
	}
}


RadPanelItem.prototype.Enable = function ()
{
	if (this.IsSeparator)
	{
		return;
	}
	
	this.LinkElement.disabled = "";	
	this.Enabled = true;
	this.EnableDomEventHandling();
	this.UpdateCssClass();
}

RadPanelItem.prototype.Disable = function ()
{
	if (this.IsSeparator)
	{
		return;
	}
	
	if (this.LinkElement)
	{
	    this.LinkElement.disabled = "disabled";	
	}
	this.Enabled = false;
	this.DisableDomEventHandling();
	this.UpdateCssClass();
}
	
RadPanelItem.prototype.Collapse = function ()
{

	if (!this.Items.length)
	{
		return;
	}
	
	if (this.IsSeparator)
	{
		return;
	}
	
    if (!this.Expanded)
	{
		return;
    }
    
    
	this.Parent.ExpandedItem = null;
	
	this.Parent.LastExpandedItem = this.Parent;

	this.Expanded = false;
	
	if (this.Level > 1 && !this.Panelbar.FullExpandedItem)
	{
		this.Parent.SetChildrenHeight("");
	}
		
	
	this.EaseInProgress = true;
	this.Ease.Out();
	
	this.UpdateCssClass();
	
    this.RecordState();
    this.RaiseEvent("OnClientItemCollapse");
};

RadPanelItem.prototype.OnCollapseComplete = function()
{
	this.EaseInProgress = false;
}


RadPanelItem.prototype.OnExpandComplete = function()
{
	this.EaseInProgress = false;

    this.AnimationContainer.style.height = "auto";
}



RadPanelItem.prototype.Select = function ()
{
	if (this.Selected) return;
	if (this.Panelbar.SelectedItem)
	{
		this.Panelbar.SelectedItem.UnSelect();
	}
	
	this.Panelbar.SelectedItem = this;
	this.Selected = true;

	this.RecordState();
	this.UpdateCssClass();
}

RadPanelItem.prototype.UnSelect = function ()
{
	if (!this.Selected) return;
	this.Panelbar.SelectedItem = null;
	this.Selected = false;
	
	this.RecordState();
	this.UpdateCssClass();
}

/**
 * Event handlers
 */

RadPanelItem.prototype.AttachEventHandlers = function ()	
{
	if (this.IsSeparator || !this.LinkElement)
	{
		return;
	}

	this.AttachDomEvent(this.LinkElement, "mouseout", "HRefMouseOutHandler");
	this.AttachDomEvent(this.LinkElement, "mouseover", "HRefMouseOverHandler");
	
	this.AttachDomEvent(this.LinkElement, "click", "ClickHandler", true);
	
	this.AttachDomEvent(this.LinkElement, "mousedown", "MouseDownHandler");
	this.AttachDomEvent(this.LinkElement, "mouseup", "MouseUpHandler");
	
	this.AttachDomEvent(this.LinkElement, "blur", "BlurHandler");
	this.AttachDomEvent(this.LinkElement, "focus", "FocusHandler");
	this.AttachDomEvent(this.LinkElement, "contextmenu", "ContextMenuHandler");
	
	this.AttachDomEvent(this.LinkElement, "keydown", "KeyDownHandler");
	
	this.AttachDomEvent(window, "load", "WindowLoadHandler");

    var instance = this;
	this.DomElement.RadShow = function()
	{
	    instance.WindowLoadHandler();
	}

};

RadPanelItem.prototype.ContextMenuHandler = function (e)
{
	if (!this.Panelbar.RaiseEvent('OnClientContextMenu', {Item : this, EventObject : e}))
	{
		return RadControlsNamespace.DomEvent.PreventDefault(e);
	}
}

RadPanelItem.prototype.WindowLoadHandler = function (e) 
{
	if (this.Panelbar.RenderInProgress())
	{
		return;
	}
	
	if (this.LoadHandlerExecuted)
	{
		return;
	}
	
	this.LoadHandlerExecuted = true;
	
    if (this.Expanded)
    {
		this.Expanded = false;
		this.Parent.ExpandedItem = this;
		this.InstantExpand();	
    }
}

RadPanelItem.prototype.MouseDownHandler = function (e)
{
	this.Clicked = true;
	this.UpdateCssClass();
}

RadPanelItem.prototype.MouseUpHandler = function (e)
{
	this.Clicked = false;
	this.UpdateCssClass();
}

RadPanelItem.prototype.HRefMouseOutHandler = function (e)
{
	var to = RadControlsNamespace.DomEvent.GetRelatedTarget(e);
	
	if (this.Panelbar.IsChildOf(this.LinkElement, to) || to == this.LinkElement)
	{
		return;
	}

	this.Hovered = false;
	
	this.UpdateCssClass();

	this.RaiseEvent("OnClientMouseOut");
}

RadPanelItem.prototype.HRefMouseOverHandler = function (e)
{
	var from = RadControlsNamespace.DomEvent.GetRelatedTarget(e);
	if (this.Panelbar.IsChildOf(this.LinkElement, from) || this.LinkElement == from)
	{
		return;
	}
	
	this.Hovered = true;
	
	this.UpdateCssClass();
	
	this.RaiseEvent("OnClientMouseOver");
}

RadPanelItem.prototype.KeyDownHandler = function (e)
{
	var arrows = {left : 37, up : 38, right : 39, down : 40, esc : 27 };
	
	var keyCode = RadControlsNamespace.DomEvent.GetKeyCode(e);
	
	if (keyCode == arrows.up)
	{
		this.HandleUpArrow();	
	}
	else if (keyCode == arrows.down)
	{
		this.HandleDownArrow();
	}
	
	else if (keyCode == arrows.esc)
	{
		this.Parent.Focus();
	}
	else
	{
		return;
	}
	
	RadControlsNamespace.DomEvent.PreventDefault(e);

}


RadPanelItem.prototype.FocusHandler = function (e)
{
	this.Focused = true;
	this.Focus();
}


RadPanelItem.prototype.BlurHandler = function (e)
{
	this.Focused = false;
	this.Panelbar.Clicked = false;
	this.Blur();
}

RadPanelItem.prototype.NavigatesToURL = function ()
{
	if (location.href + "#" == this.NavigateUrl || location.href == this.NavigateUrl)
	{
	    return false;
	}
	return (new RegExp("//")).test(this.LinkElement.href);
}	

RadPanelItem.prototype.Validate = function ()
{
	if (!this.Panelbar.CausesValidation || this.NavigatesToURL())
	{
		return true;
	}
	
	if (typeof (Page_ClientValidate) != 'function')
	{
		return true;
	}
	
	return Page_ClientValidate(this.Panelbar.ValidationGroup);
}


RadPanelItem.prototype.ClickHandler = function (e)
{
	if (!this.Enabled)
	{
		RadControlsNamespace.DomEvent.PreventDefault(e);
		return false;
	}
	
    if (!this.RaiseEvent("OnClientItemClicking"))
	{
		RadControlsNamespace.DomEvent.PreventDefault(e);
		return false;
	}
    
    if (!this.Validate())
    {
        return false;    
    }
    
    var javaScriptUrl = this.LinkElement.href.indexOf("javascript:") == 0;
    
    if (this.NavigateAfterClick && !javaScriptUrl)
    {
		if (this.Panelbar.SingleExpandedItem)
		{
			if (this.Parent.ExpandedItem)
			{
				this.Parent.ExpandedItem.Expanded = false;
				this.Parent.ExpandedItem.RecordState();
			}
			if (this.Items.length)
			{
				this.Expanded = true;
			}
		
		}
		else if (this.Items.length)
		{
			this.Expanded = !this.Expanded;
		}
		
		if (this.Panelbar.SelectedItem)
		{
			this.Panelbar.SelectedItem.Selected = false;
			this.Panelbar.SelectedItem.RecordState();
		}
		
		this.Panelbar.SelectedItem = this;
		this.Selected = true;
		
        this.RaiseEvent("OnClientItemClicked");
		this.RecordState();
		return true;
    }
    
    if (this.Panelbar.SingleExpandedItem)
	{
		if (!this.Expanded) this.Expand();
    }
	else
	{
		this.Expanded ? this.Collapse() : this.Expand();
	}
	
	this.Select();
	
	this.RaiseEvent("OnClientItemClicked");


	if (javaScriptUrl)
	{	
		return true;
	}
	
	RadControlsNamespace.DomEvent.PreventDefault(e);
	return false;
}


/*
 * Private (sort of)
 */
 

RadPanelItem.prototype.SetContainerPosition = function(left, top)
{
	this.AnimationContainer.style.top = (top + this.GroupSettings.OffsetY) + "px";
	this.AnimationContainer.style.left = (left + this.GroupSettings.OffsetX) + "px";
}


RadPanelItem.prototype.SetAttribute = function (name, value)
{
	this.Attributes[name] = value;
	this.RecordState();
}

RadPanelItem.prototype.SetImageUrl = function (src)
{
	this.ImageUrl = src;
	this.UpdateCssClass();
	this.RecordState();
}

RadPanelItem.prototype.SetImageOverUrl = function (src)
{
	this.ImageOverUrl = src;
	this.UpdateCssClass();
	this.RecordState();
}

RadPanelItem.prototype.GetAttribute = function (name)
{
	return this.Attributes[name];
}

RadPanelItem.prototype.LoadConfiguration = function ()
{
	if (this.Panelbar.ItemData[this.ID])
	{
		for (var property in this.Panelbar.ItemData[this.ID])
		{
			this[property] = this.Panelbar.ItemData[this.ID][property];
		}
	}
};

RadPanelItem.prototype.ApplyStates = function ()
{
    if (!this.Enabled)   
    {
		this.Disable();
    }
    
    if (this.Selected)
    {
		this.Selected = false;
		this.Select();	
    }

    // Fixing bug when panelbar is in tabstrip/slidingPane which is initialy invisible
    /*    
    debugger;
    if (this.Panelbar.DomElement.offsetHeight)
    {
		this.WindowLoadHandler(); 
	}
	*/
	
	this.WindowLoadHandler(); 
}

/**
 * Keyboard handlers
 */

RadPanelItem.prototype.HandleRightArrow = function ()
{
	
}

RadPanelItem.prototype.HandleLeftArrow = function ()
{
	
}

RadPanelItem.prototype.HandleUpArrow = function ()
{		
	this.Index || !this.Parent.Focus ? this.FocusPreviousItem() : this.Parent.Focus();
}


RadPanelItem.prototype.HandleDownArrow = function ()
{	
	
	if (this.Expanded)
	{
		this.FocusFirstChild();
		return;
		
	}
	var last = this.Index == this.Parent.Items.length - 1;	
	
	if ( last && this.Parent.Focus)
	{
		this.Parent.FocusNextItem();
	}
	
	else
	{
		this.FocusNextItem();
	}
}


RadPanelItem.prototype.GetNextItem = function ()
{
	if (this.Index == this.Parent.Items.length - 1)
	{
		return this.Parent.Items[0];
	}
	
	return this.Parent.Items[this.Index + 1];
}

RadPanelItem.prototype.GetPreviousItem = function ()
{
	if (this.Index == 0)
	{
		return this.Parent.Items[this.Parent.Items.length - 1];
	}
	
	return this.Parent.Items[this.Index - 1];
}

RadPanelItem.prototype.CanFocus = function ()
{
	return (!this.IsSeparator) && this.Enabled;
}

RadPanelItem.prototype.FocusFirstChild = function ()
{
	if (!this.Items.length)
	{
		return;
	}
	
	var item = this.Items[0];
	
	while (!item.CanFocus())
	{
		
		item = item.GetNextItem();
		if (item == this.Items[0]) 
		{
			return; // no items to focus
		}
	}
		
	item.Focus();

}

RadPanelItem.prototype.FocusLastChild = function ()
{
	if (!this.Items.length)
	{
		return;
	}
	
	var item = this.Items[this.Items.length - 1];
	
	while (!item.CanFocus())
	{
		item = item.GetPreviousItem();
		if (this.Items.length - 1) 
		{
			return; // no items to focus
		}		
	}	
	item.Focus();
}



RadPanelItem.prototype.FocusNextItem = function ()
{
    var item = this.GetNextItem();
	
	while (!item.CanFocus())
	{
		item = item.GetNextItem();
	}	
	item.Focus();
}

RadPanelItem.prototype.FocusPreviousItem = function ()
{
    var item = this.GetPreviousItem();
	
	while (!item.CanFocus())
	{
		item = item.GetPreviousItem();
	}	
	item.Focus();
}

RadPanelItem.prototype.RecordState = function ()
{
	// Ignore these properties
	this.InitialState.EaseInProgress = this.EaseInProgress;
	
	var serialized = RadControlsNamespace.JSON.stringify(this, this.InitialState, RadPanelbar.JSONIncludeDeep);
	if (serialized == "{}")
	{
		this.Panelbar.ItemState[this.ID] = "";
	}
	else
	{
		this.Panelbar.ItemState[this.ID] = "\"" + this.ID + "\":" + serialized;
	}
	
	this.Panelbar.RecordState();
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