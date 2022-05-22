function RadTab (element, dataObj)
{
    this.Parent = null;
    this.TabStrip = null;
    this.SelectedTab = null;
    this.SelectedIndex = -1;
    this.Selected = false;
    
    this.ScrollChildren = false;
    this.ScrollPosition = 0;
    this.ScrollButtonsPosition = RadControlsNamespace.ScrollButtonsPosition.Right;
    this.PerTabScrolling = false;
    
    this.Tabs = [];
    this.PageViewID = "";
    this.PageViewClientID = "";
	this.Index = -1;
	this.GlobalIndex = -1;
	this.CssClass = "";
	this.SelectedCssClass = "selected";
	this.DisabledCssClass = "disabled";
	this.NavigateAfterClick = false;
	this.Enabled = true;
	this.Value = "";
    this.DepthLevel = -1;
    this.IsBreak = false;
    
    this.ID = element.id;
    this.DomElement = element;
	
	this.Text = element.firstChild.firstChild.innerHTML;
	this.ImageDomElement = element.getElementsByTagName('img')[0];
	
	if (this.ImageDomElement)
	{
	   if (element.firstChild.firstChild.childNodes.length > 1)
	   {
			this.Text = element.firstChild.firstChild.childNodes[1].nodeValue;
		}
		else
		{
			this.Text= "";
		}
	}
	
    this.ChildStripDomElement = element.parentNode.getElementsByTagName('ul')[0];
};

RadTab.prototype.Initialize = function ()
{
	RadControlsNamespace.DomEventMixin.Initialize(this);
	this.AttachEventHandlers();
	
	if (this.TabStrip.TabData[this.ID] != null)
	{
		for (var property in this.TabStrip.TabData[this.ID])
		{
			this[property] = this.TabStrip.TabData[this.ID][property];
		}
    }
    
    

    RadTabStrip.CreateState(this);

};

RadTab.prototype.Dispose = function ()
{
	this.DisposeDomEventHandlers();
    for (var i in this.DomElement)
    {
		if (typeof(this.DomElement[i]) == 'function')
		{
			this.DomElement[i] = null;
		}
    }
    
    if (this.Scroll)
    {
        this.Scroll.Dispose();
    }
    this.DomElement = null;
	this.ImageDomElement = null;
    this.ChildStripDomElement = null;
}

RadTab.prototype.ClickHandler = function (e)
{
	return this.Click(e);
}

RadTab.prototype.MouseOverHandler = function (e)
{
	var a = this.DomElement;
    var from = RadControlsNamespace.DomEvent.GetRelatedTarget(e);
	if (from &&
		(from == a ||
		from.parentNode == a ||
		from.parentNode.parentNode == a
		)
	)
	{
		return;
	}    	
    if (this.Enabled)
    {
        this.SetImageUrl(this.ImageOverUrl);
    }
    this.TabStrip.RaiseEvent("OnClientMouseOver", {Tab : this, EventObject : e});
}

RadTab.prototype.SetImageUrl = function(imageUrl)
{
    if (!this.ImageDomElement || !imageUrl)
    {
        return;
    }
    
    imageUrl = imageUrl.replace(/&amp;/ig, "&");
    
    if (this.ImageDomElement.src != imageUrl)
    {
        this.ImageDomElement.src = imageUrl;
    }
}

RadTab.prototype.MouseOutHandler = function (e)
{
	var a = this.DomElement;
    var to =  RadControlsNamespace.DomEvent.GetRelatedTarget(e);
	if (to &&
		(to == a ||
		to.parentNode == a ||
		to.parentNode.parentNode == a
		)
	)
	{
		return;
	}
    
    if (this.Enabled)
    {	
	    if (this.Parent.SelectedTab == this && this.SelectedImageUrl)
	    {
	        this.SetImageUrl(this.SelectedImageUrl);
	    }else
	    {
	        this.SetImageUrl(this.ImageUrl);
	    }
	}
	
    this.TabStrip.RaiseEvent("OnClientMouseOut", {Tab : this, EventObject : e});
}

RadTab.prototype.KeyPressHandler = function (e)
{
}

RadTab.prototype.FocusHandler = function (e)
{
	
	if (!e.altKey) return;

	this.Click();
	var handler = this;
	setTimeout(function ()
	{
		handler.DomElement.focus();
	}, 0);
}

RadTab.prototype.AttachEventHandlers = function ()
{
   this.AttachDomEvent(this.DomElement, "click", "ClickHandler");
   this.AttachDomEvent(this.DomElement, "mouseover", "MouseOverHandler");
   this.AttachDomEvent(this.DomElement, "contextmenu", "ContextMenuHandler");
   this.AttachDomEvent(this.DomElement, "dblclick", "DoubleClickHandler");
   
   this.AttachDomEvent(this.DomElement, "mouseout", "MouseOutHandler");
   
   if (RadControlsNamespace.Browser.IsIE)
   {
		this.AttachDomEvent(this.DomElement, "focus", "FocusHandler");
   }
}

RadTab.prototype.DoubleClickHandler = function (e)
{
	if (!this.TabStrip.RaiseEvent('OnClientDoubleClick', {Tab : this, EventObject : e}))
	{
		return RadControlsNamespace.DomEvent.PreventDefault(e);
	}
}

RadTab.prototype.ContextMenuHandler = function (e)
{
	if (!this.TabStrip.RaiseEvent('OnClientContextMenu', {Tab : this, EventObject : e}))
	{
		return RadControlsNamespace.DomEvent.PreventDefault(e);
	}
}

RadTab.prototype.Validate = function ()
{
	if (!this.TabStrip.CausesValidation)
	{
		return true;
	}
	
	if (typeof (Page_ClientValidate) != 'function')
	{
		return true;
	}
	
	return Page_ClientValidate(this.TabStrip.ValidationGroup);
}


RadTab.prototype.Click = function (e)
{
	if ((!this.Enabled) || (!this.Validate()))
	{
		return RadControlsNamespace.DomEvent.PreventDefault(e);
	}

	var navigateAfterClick = this.NavigateAfterClick;
	
	if (this.DomElement.target && this.DomElement.target != "_self")
	{
	    navigateAfterClick = false;
	}
	
	if (!this.TabStrip.EnableImmediateNavigation)
	{
	    navigateAfterClick = false;
	}
	
	var outcome = this.Select(navigateAfterClick);

	
	if ( (!outcome) || (!this.NavigateAfterClick)) 
	{
		return RadControlsNamespace.DomEvent.PreventDefault(e);
	}
	else if (!e || (this.ImageDomElement && (e.srcElement == this.ImageDomElement))) // hack for ie with image and navigate url
	{
		var target = this.DomElement.target;
		if (!target || target == '_self')
		{
			location.href = this.DomElement.href;
		}
		else if (target == '_blank')
		{
			window.open(this.DomElement.href);
		}
		else
		{
			if (top.frames[target])
			{
				top.frames[target].window.location.href = this.DomElement.href;
			}
		}
		
	}

	return true;
};

RadTab.prototype.InternalUnSelect = function (navigateAfterClick)
{
    this.Selected = false;
    this.Parent.SelectedTab = null;
    this.Parent.SelectedIndex = -1;
    
	if (this.SelectedTab != null && this.TabStrip.UnSelectChildren)
	{
		this.SelectedTab.UnSelect(navigateAfterClick);
	}
	
	this.RecordState();
}

RadTab.prototype.UnSelect = function (navigateAfterClick)
{
	if (!this.Selected)
	{
		return;
	}
	
	
	this.InternalUnSelect(navigateAfterClick);
	
    if (!navigateAfterClick)
    {
        this.ModifyZIndex(-this.MaxZIndex);
        this.DomElement.className = this.CssClass;
	    this.HideChildren();
	    this.SetImageUrl(this.ImageUrl);
	}
    
    this.TabStrip.RaiseEvent('OnClientTabUnSelected', {Tab : this});	
};

RadTab.prototype.RecordState = function ()
{
	this.InitialState.Selected = !this.Selected;
	var serialized = RadControlsNamespace.JSON.stringify(this, this.InitialState);
	if (serialized == "{}")
	{
		this.TabStrip.TabsState[this.ID] = "";
	}
	else
	{
		this.TabStrip.TabsState[this.ID] = "\"" + this.ID + "\":" + serialized;
	}
	
	this.TabStrip.RecordState();
}

RadTab.prototype.ModifyZIndex = function (zIndex)
{
    this.DomElement.style.zIndex = parseInt(this.DomElement.style.zIndex) + zIndex;
    this.DomElement.style.cssText = this.DomElement.style.cssText;
}

RadTab.prototype.InternalSelect = function(navigateAfterClick)
{
    var previousTab = this.Parent.SelectedTab;
    
    if (previousTab)
    {
		this.TabStrip.InUpdate = true;
        this.Parent.SelectedTab.UnSelect(navigateAfterClick);
        this.TabStrip.InUpdate = false;
    }
    
    this.Selected = true;
    this.Parent.SelectedTab = this;
    this.Parent.SelectedIndex = this.Index;
    
    this.RecordState();
}

RadTab.prototype.Select = function (navigateAfterClick)
{
	if (!this.Enabled)
	{
		return false;
	}
	
	if (this.Selected && !this.TabStrip.ClickSelectedTab)
	{
		return false;
	}	

    var previousTab = this.Parent.SelectedTab;
    var eventArgs = {Tab : this, PreviousTab : previousTab};
    
    if (!this.TabStrip.RaiseEvent('OnClientTabSelecting', eventArgs) )
    {
		return false;
	}
	
	this.TabStrip.SelectPageView(this);  
	
	this.InternalSelect(navigateAfterClick);

    if (!navigateAfterClick)
    {	
	    if (this.TabStrip.ReorderTabRows && !this.TabStrip.RenderInProgress())
	    {
		    this.PopRow();
	    }
    	
        this.DomElement.className = this.SelectedCssClass;
        
        this.ModifyZIndex(this.MaxZIndex);
	    
	    this.FixFirstTabPosition();
    	
	    this.SetImageUrl(this.SelectedImageUrl);

    }   

    this.ShowChildren(navigateAfterClick)
    
    this.TabStrip.RaiseEvent('OnClientTabSelected', eventArgs);
    
    return true;
};

// IE fix - this should technically do nothing, but sometimes the first tab "runs away".
RadTab.prototype.FixFirstTabPosition = function ()
{
	if (this.Parent.Tabs[0] && this.Parent.Tabs[0].DomElement)
	{
		this.Parent.Tabs[0].DomElement.style.cssText = this.Parent.Tabs[0].DomElement.style.cssText;
	}
}

RadTab.prototype.SelectParents = function ()
{

	var parentPath = [];
	var parent = this;
	while (parent != this.TabStrip)
	{
		parentPath[parentPath.length] = parent;
		parent = parent.Parent;
	}

		
	var i = parentPath.length;
	
	while (i --)
	{
		parentPath[i].Select();
	}
	
}

RadTab.prototype.IsVisible = function ()
{
	var parent = this.Parent;
	if (parent == this.TabStrip) return true;
	while (parent != this.TabStrip)
	{
		if (!parent.Selected)
		{	
			return false;
		}
		parent = parent.Parent;
	}
	
	return true;
}

RadTab.prototype.ShowChildren = function(navigateAfterClick)
{
    if (!this.ChildStripDomElement) return;
	if (!this.IsVisible()) return;
	
	if (!navigateAfterClick)
    {	
        this.ChildStripDomElement.style.display = "block";
        this.TabStrip.ShowLevels(this.DepthLevel);
        this.TabStrip.ApplyTabBreaks(this.ChildStripDomElement);
        this.TabStrip.AlignElement(this.ChildStripDomElement);

        if (this.ScrollChildren)
        {
            this.TabStrip.MakeScrollable(this);
        }
    }
    
    if (this.SelectedTab)
    {
		this.SelectedTab.Selected = false;
        this.SelectedTab.Select(navigateAfterClick);
    }
}

RadTab.prototype.HideChildren = function ()
{
    if (!this.ChildStripDomElement) return;
	this.TabStrip.ShowLevels(this.DepthLevel - 1);
	this.ChildStripDomElement.style.display = "none";
	if (this.SelectedTab)
	{
		this.SelectedTab.HideChildren();
	}
}

RadTab.prototype.Enable = function ()
{
	if (this.Enabled)
	{
		return;
	}
	this.Enabled = true;
	this.DomElement.className = this.CssClass;
	this.DomElement.disabled = "";
	this.RecordState();
	
	if (this.Parent.SelectedTab == this && this.SelectedImageUrl)
	{
	    this.SetImageUrl(this.SelectedImageUrl);
	    
	}else
	{
	    
	    this.SetImageUrl(this.ImageUrl);
	}
	
	this.TabStrip.RaiseEvent('OnClientTabEnabled', {Tab : this});
}

RadTab.prototype.Disable = function ()
{
	this.Enabled = false;
	this.UnSelect();
	this.DomElement.className = this.DisabledCssClass;	
	this.DomElement.disabled = "disabled";
	this.RecordState();
	this.SetImageUrl(this.DisabledImageUrl);
	this.TabStrip.RaiseEvent('OnClientTabDisabled', {Tab : this});	
}

RadTab.prototype.OnScrollStop = function ()
{
	this.RecordState();
}

RadTab.prototype.SetCssClass = function (value)
{
	this.CssClass = value;
	if (this.Enabled && !this.Selected) 
	{
		this.DomElement.className = value;		
	}
}


RadTab.prototype.SetText = function (value)
{
	this.Text = value;
	var innerSpan = this.DomElement.firstChild.firstChild;
	var textNode = innerSpan.firstChild.nodeType == 3 ? innerSpan.firstChild : innerSpan.childNodes[1];
	textNode.nodeValue = value;
	this.RecordState();
}

RadTab.prototype.SetDisabledCssClass = function (value)
{
	this.DisabledCssClass = value;
	if (!this.Enabled) 
	{
		this.DomElement.className = value;		
	}
}


RadTab.prototype.SetSelectedCssClass = function (value)
{
	this.SelectedCssClass = value;
	if (this.Selected) 
	{
		this.DomElement.className = value;		
	}
}

RadTab.prototype.PopRow = function ()
{
	var instanceTop = this.DomElement.parentNode.offsetTop;
	if (this.IsBreak && RadControlsNamespace.Browser.IsIE)
	{
		var style = RadTabStripNamespace.Box.GetCurrentStyle(this.DomElement);
		instanceTop -= RadTabStripNamespace.Box.GetStyleValues(style, "marginTop");
	}
	var rowItems = [];
	
	for (var i = 0; i < this.Parent.Tabs.length; i ++)
	{
		var wrapElement = this.Parent.Tabs[i].DomElement.parentNode;
		var elementOffsetTop = wrapElement.offsetTop;
		
	 	var style = RadTabStripNamespace.Box.GetCurrentStyle(this.Parent.Tabs[i].DomElement);
		
		if (this.Parent.Tabs[i].IsBreak && (this.Parent.Tabs[i].Selected) && RadControlsNamespace.Browser.IsIE)
		{
			elementOffsetTop -= RadTabStripNamespace.Box.GetStyleValues(style, "marginTop");
		}

		if (elementOffsetTop == instanceTop || this == this.Parent.Tabs[i])
		{
			rowItems[rowItems.length] = this.Parent.Tabs[i].DomElement.parentNode;
		}
	}
	
	if (rowItems.length == this.Parent.Tabs.length) 
	{
		return;
	}
	
	var container = this.DomElement.parentNode.parentNode;
	for (var i = 0; i < rowItems.length; i ++)
	{
		rowItems[i].parentNode.removeChild(rowItems[i]);
		container.appendChild(rowItems[i]);
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