if (typeof(window.RadTabStripNamespace) == "undefined")
{
	window.RadTabStripNamespace = new Object();
};

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

// enums
RadTabStripNamespace.TabStripAlign = {Left : 0, Center : 1, Right : 2, Justify : 3 };

RadTabStripNamespace.GetChildren = function (element, childTagName)
{
	var children = [];
	var child = element.firstChild;
	childTagName = childTagName.toLowerCase();
	while (child)
	{
		if (child.nodeType == 1 && child.tagName.toLowerCase() == childTagName)
		{
			children[children.length] = child;
		} 
		child = child.nextSibling;
	}
	
	return children;
}

function RadTabStrip (wrapperID)
{
    var oldInstance = window[wrapperID];
	if (oldInstance != null && typeof(oldInstance.Dispose) == "function")
	{
		oldInstance.Dispose();
	}
		
    this.DomElement = document.getElementById(wrapperID);
    this.ChildStripDomElement = this.DomElement.getElementsByTagName('ul')[0];
    this.StateField = document.getElementById(wrapperID + "_Hidden");
    this.Tabs = [];
    this.AllTabs = [];
	this.ID = wrapperID;
    this.LevelWraps = []; 	
    this.LevelWraps[0] = this.ChildStripDomElement.parentNode;
    RadControlsNamespace.EventMixin.Initialize(this);
    
   	// default property values
    this.SelectedTab = null;
    this.SelectedIndex = -1;
    this.IsVertical = false;
    this.ReverseLevelOrder = false;
   
    this.ScrollChildren = false;
    this.EnableImmediateNavigation = true;
    this.ScrollPosition = 0;
    this.ScrollButtonsPosition = RadControlsNamespace.ScrollButtonsPosition.Right;
    this.PerTabScrolling = false;
    
    this.MultiPageID = "";    
    this.MultiPageClientID = "";    
    this.CausesValidation = true;
    this.ValidationGroup = "";
    this.Enabled = true;
    this.Direction = "ltr";
    this.Align = RadTabStripNamespace.TabStripAlign.Left;
    this.ReorderTabRows = false;
    this.UnSelectChildren = false;
    this.ClickSelectedTab = false;
    
    // Client-side event handlers (strings)
    this.OnClientTabSelected = "";
    this.OnClientTabSelecting = "";
    this.OnClientMouseOver = "";
    this.OnClientMouseOut = "";
    this.OnClientTabUnSelected = "";
    this.OnClientTabEnabled = "";
    this.OnClientTabDisabled = "";
    this.OnClientLoad = "";
    
    // internals
	this.DepthLevel = 0;
    this.MaxLevel = 0;
    this.TabData = {};
   
    this.InPostBack = false;
    
    this.Disposed = false;
    
    this.InitialAllTabs = [];
    this.TabsState = {};
    
    // flag for state update
    this.InUpdate = false;
    this.Initialized = false;
	
	
}

RadTabStrip.prototype.Dispose = function ()
{
	if (this.Disposed)
	{
		return;
	}
	
	this.Disposed = true;
	try
	{
	    if (this.Scroll)
	    {
	        this.Scroll.Dispose();
	    }
		for (var i = 0; i < this.AllTabs.length; i ++)
		{
			this.AllTabs[i].Dispose();
		}
		
		this.DisposeDomEventHandlers();
		
		if (this.DomElement)
		{
			this.DomElement.RadShow = null;
			this.DomElement.RadResize = null;
		}
		
		this.DomElement = null;
		this.ChildStripDomElement = null;
		this.StateField = null;
		
		this.LevelWraps[0] = null;
	}catch (e)
	{}
}

RadTabStrip.prototype.MakeScrollable = function (item)
{
	var scroll = RadControlsNamespace.Scroll.Create(item.ChildStripDomElement, this.IsVertical, item);
	scroll.WrapNeeded = true;
	scroll.Initialize();
	scroll.OnScrollStop = function () { item.OnScrollStop(); };
	item.Scroll = scroll;
}

RadTabStrip.prototype.AlignElement = function (domElement)
{

	if (this.IsVertical)
	{
		if (domElement.offsetHeight == 0)
		{
			return;
		}
		
		if (this.Align == RadTabStripNamespace.TabStripAlign.Center)
		{
			RadTabStripNamespace.Align.Middle(domElement);
		}
		
		else if (this.Align == RadTabStripNamespace.TabStripAlign.Right)
		{
			RadTabStripNamespace.Align.Bottom(domElement);
		}	
		
		else if (this.Align == RadTabStripNamespace.TabStripAlign.Justify)
		{
			RadTabStripNamespace.Align.VJustify(domElement);
		}	
	}
	else
	{
		if (domElement.offsetWidth == 0)
		{
			return;
		}
		
		if (this.Align == RadTabStripNamespace.TabStripAlign.Center)
		{
			RadTabStripNamespace.Align.Center(domElement);
		}
		
		else if (this.Align == RadTabStripNamespace.TabStripAlign.Right)
		{
			RadTabStripNamespace.Align.Right(domElement);
		}	
		
		else if (this.Align == RadTabStripNamespace.TabStripAlign.Justify)
		{
			RadTabStripNamespace.Align.Justify(domElement);
		}
	}
}


// API


RadTabStrip.prototype.FindTabById = function(id)
{	
	for (var i = 0; i<this.AllTabs.length; i++)
	{
		if (this.AllTabs[i].ID == id)
		{
			return this.AllTabs[i];
		}		
	}
	return null;
};

RadTabStrip.prototype.FindTabByText = function(text)
{	
	for (var i = 0; i<this.AllTabs.length; i++)
	{
		if (this.AllTabs[i].Text == text)		
		{
			return this.AllTabs[i];
		}		
	}
	return null;
};


RadTabStrip.prototype.FindTabByValue = function(value)
{	
	for (var i = 0; i<this.AllTabs.length; i++)
	{
		if (this.AllTabs[i].Value == value)		
		{
			return this.AllTabs[i];
		}		
	}
	return null;
};

RadTabStrip.prototype.FindTabByUrl = function(url)
{	
	for (var i = 0; i<this.AllTabs.length; i++)
	{
		if (this.AllTabs[i].DomElement.href == url)
		{
			return this.AllTabs[i];
		}		
	}
	return null;
};

RadTabStrip.prototype.GetAllTabs = function()
{	
	return this.AllTabs;
};

// Internals

RadTabStrip.prototype.RenderInProgress = function ()
{
	return ((!this.IsVertical) && this.ChildStripDomElement.offsetWidth == 0) || (this.IsVertical && this.ChildStripDomElement.offsetHeight == 0);
}

RadTabStrip.prototype.ApplyAlign = function ()
{
	if (this.RenderInProgress())
	{
		return;
	}
	
	this.AlignElement(this.ChildStripDomElement);
	var selectedTab = this.SelectedTab;
	while (selectedTab)
	{
		if (!selectedTab.ChildStripDomElement)
		{
			break;
		}
		this.AlignElement(selectedTab.ChildStripDomElement);
		selectedTab = selectedTab.SelectedTab;
	}
}

RadTabStrip.prototype.Initialize = function (configObject, tabData)
{
	this.LoadConfiguration(configObject);
	this.TabData = tabData;

    this.DetermineDirection();
    this.ApplyRTL();

	this.DisableEvents();
    this.CreateControlHierarchy(this, this.ChildStripDomElement);
    
    if (!this.Enabled)
    {
		this.Disable();
    }
    

    
    
    
	this.ApplyTabBreaks(this.ChildStripDomElement);    
    
	this.ApplyAlign();

	

    if (this.LevelWraps.length == 1)
    {
		this.ShowLevels(1);
    }
	
	if (this.ScrollChildren)
	{
		this.MakeScrollable(this);
	}
	
	//var inst = this;
	this.ApplySelected();
	//setTimeout(function (){ inst.ApplySelected()}, 0);
	
	this.EnableEvents();

	RadControlsNamespace.DomEventMixin.Initialize(this);
	this.AttachEventHandlers();
	
	this.Initialized = true;
	RadTabStrip.CreateState(this);
	this.RaiseEvent('OnClientLoad', null);
	
    //Korchev
    this.RecordState();
}

RadTabStrip.CreateState = function (instance)
{
	instance.InitialState = {};
	for (var i in instance)
	{
		var type = typeof instance[i];
		if (type == "number" || type == "string" || type == "boolean")
		instance.InitialState[i] = instance[i];
	}
}

RadTabStrip.prototype.AttachEventHandlers = function ()
{
	this.HandleResize();
	this.AttachDomEvent(window, "unload", "Dispose");
	this.AttachDomEvent(window, "load", "HandleResize");
	
	if (this.RenderInProgress())
	{
	    this.AttachDomEvent(window, "load", "PopRowOnLoad");
	}
	
	this.AttachDomEvent(window, "resize", "HandleResize");
	
	var instance = this;
	this.DomElement.RadShow = function()
	{
		instance.HandleResize();
		instance.DomElement.style.cssText = instance.DomElement.style.cssText;
	}
    
    this.DomElement.RadResize = function()
	{
		instance.HandleResize();
		instance.DomElement.style.cssText = instance.DomElement.style.cssText;
	}
}

RadTabStrip.prototype.PopRowOnLoad = function ()
{
    if (this.ReorderTabRows && this.SelectedTab)
    {
        if (!this.SelectedTab.NavigateAfterClick)
        {
            this.SelectedTab.PopRow();
        }
    }
}

RadTabStrip.prototype.ApplySelected = function ()
{
	for (var i = 0; i < this.AllTabs.length; i ++)
	{
		if (this.AllTabs[i].Selected)
		{
			this.AllTabs[i].Selected = false;
			this.AllTabs[i].Select();
			this.AllTabs[i].DomElement.style.cssText = this.AllTabs[i].DomElement.style.cssText;
		}
	}
}


RadTabStrip.prototype.HandleResize = function ()
{
	this.ApplyAlign();

		
	if (this.Scroll)
	{
		this.Scroll.ResizeHandler();
	}
	
	
	
	var selectedTab = this.SelectedTab;
	while (selectedTab)
	{
		if (selectedTab.Scroll)
		{
			selectedTab.Scroll.ResizeHandler();
		}
		
		selectedTab = selectedTab.SelectedTab;
	}
}


RadTabStrip.prototype.LoadConfiguration = function (configObject)
{
    for (var property in configObject)
    {
        this[property] = configObject[property];
    } 
}

RadTabStrip.prototype.ShowLevels = function (toLevel)
{
    for (var i = 0; i <= this.MaxLevel; i ++)
    {
		var newDisplay = i > toLevel ? "none" : "block";
        if (this.LevelWraps[i].style.display != newDisplay)
        {
			this.LevelWraps[i].style.display = newDisplay;
        }
    }
}

RadTabStrip.prototype.DetermineDirection = function ()
{
    var el = this.DomElement;
    while (el.tagName.toLowerCase() != 'html')
    {
        if (el.dir)
        {
            this.Direction = el.dir.toLowerCase();
            return;
        }
        el = el.parentNode;
    }
    
    this.Direction = "ltr";
}

RadTabStrip.prototype.ApplyTabBreaks = function (strip)
{
    var lis = strip.getElementsByTagName('li');
    
    for (var i = 0; i < lis.length; i ++)
    {
        var li = lis[i];
        if (li.className.indexOf("break") == -1) continue;
		var a = li.getElementsByTagName('a')[0];

        if (this.Direction == "rtl" && li.firstChild.tagName.toLowerCase() == "a")
        {
            a.style.cssFloat = "right";
            a.style.styleFloat = "right";
        }
        
    }
}

RadTabStrip.prototype.CreateTab = function (parent, hrefElement, maxZIndex)
{
	var tab = new RadTab(hrefElement);
	tab.MaxZIndex = maxZIndex;
	tab.DepthLevel = parent.DepthLevel + 1;
	tab.Parent = parent;
	tab.TabStrip = this;
	tab.Index = parent.Tabs.length;
	tab.GlobalIndex = this.AllTabs.length;
	return tab;
}

RadTabStrip.prototype.CreateTabObject = function (parent, hrefElement, maxZIndex)
{
	
	var tab = this.CreateTab(parent, hrefElement, maxZIndex);
	parent.Tabs[parent.Tabs.length] = tab;
	

    
    this.AllTabs[this.AllTabs.length] = tab;
    
    return tab;
}

RadTabStrip.prototype.CreateLevelWrap = function (depth)
{
    if (this.LevelWraps[depth]) return this.LevelWraps[depth];
    
    this.LevelWraps[depth] = document.createElement('div');
    
    this.LevelWraps[depth].style.display = depth > 0 ? "none" : "block";
    
    if (this.ReverseLevelOrder && depth > 0)
    {
		this.DomElement.insertBefore(this.LevelWraps[depth], this.LevelWraps[depth - 1]);
	}
    else
    {
		this.DomElement.appendChild(this.LevelWraps[depth]);
	}
	
    this.LevelWraps[depth].className = "levelwrap level" + (depth + 1);    
    if (this.Direction == "rtl")
    {
        this.LevelWraps[depth].style.cssFloat = "right";
        this.LevelWraps[depth].style.styleFloat = "right";
    }  

    return this.LevelWraps[depth];
}

RadTabStrip.prototype.CreateControlHierarchy = function (parentObject, ulInstance)
{
    this.MaxLevel = Math.max(parentObject.DepthLevel, this.MaxLevel);
	
	if (parentObject.DepthLevel > 0)
    {
		this.CreateLevelWrap(parentObject.DepthLevel).appendChild(ulInstance);
    }
    
    var lis = RadTabStripNamespace.GetChildren(ulInstance, 'li');
    for (var i = 0; i < lis.length; i ++)
    {
        var li = lis[i];

        if (i == 0)
        {
            li.className += " first";
        }
        
        // tab separator
        var href = li.getElementsByTagName('a')[0];
        if (!href) 
        {
            continue;
        }
        
        href.style.zIndex = lis.length - i;
        var tab = this.CreateTabObject(parentObject, href, lis.length);

        tab.Initialize();
        
        if (tab.ChildStripDomElement)
        {
            this.CreateControlHierarchy(tab, tab.ChildStripDomElement);
        }
	}
    
    if (li)
    {
		li.className += " last";
    }
}

RadTabStrip.prototype.SelectPageView = function (tab)
{
	if (!this.Initialized) 
	{
		return;
	}

	if (
	this.MultiPageClientID == "" 
	|| typeof(window[this.MultiPageClientID]) == "undefined"
	|| window[this.MultiPageClientID].innerHTML // dom element
	) 
	{
		return;
	}


	
	var multiPage = window[this.MultiPageClientID];
	
	
	if (tab.NavigateAfterClick && this.EnableImmediateNavigation)
	{
	    multiPage.NavigateAfterClick = true;
	}
	
	if (tab.PageViewID)
	{
		multiPage.SelectPageById(tab.PageViewID);
	}
	else
	{
		multiPage.SelectPageByIndex(tab.GlobalIndex);
	}
}

RadTabStrip.prototype.ApplyRTL = function ()
{
    
    if (this.Direction == "ltr") return;
    
    if (RadControlsNamespace.Browser.IsIE)
    {
		this.DomElement.dir = "ltr";
    }
    
    var lis = this.DomElement.getElementsByTagName('li');
    
    if (this.IsVertical) return;
    
    for (var i = 0; i < lis.length; i ++)
    {
        if (lis[i].className.indexOf("break") > -1) continue;
        lis[i].style.styleFloat = 'right';
        lis[i].style.cssFloat = 'right';
    }
    
    
    var uls = this.DomElement.getElementsByTagName('ul');
    for (var i = 0; i < uls.length; i ++)
    {
        uls[i].style['clear'] = 'right';
    }  
      
}


RadTabStrip.prototype.Enable = function ()
{

	this.Enabled = true;	
	this.DomElement.disabled = "";	
	this.InUpdate = true;
	for (var i = 0; i < this.AllTabs.length; i ++)
    {
		this.AllTabs[i].Enable();    
    }  
    this.InUpdate = false;
    this.RecordState();
}

RadTabStrip.prototype.Disable = function ()
{
	this.Enabled = false;
	this.DomElement.disabled = "disabled";	
	this.InUpdate = true;
	
	for (var i = 0; i < this.AllTabs.length; i ++)
    {
		this.AllTabs[i].Disable();    
    }  
    
    this.InUpdate = false;
    
    this.RecordState();
}


RadTabStrip.prototype.RecordState = function ()
{
	if (this.InUpdate || !this.Initialized || !this.Enabled)
	{
		return;
	}
	
	var state = RadControlsNamespace.JSON.stringify(this, this.InitialState);
	var tabState = []
	for (var i in this.TabsState)
	{
		if (this.TabsState[i] == "") continue;
		if (typeof this.TabsState[i] == "function") continue;
		tabState[tabState.length] = this.TabsState[i];
	}
	this.StateField.value = "{\"State\":" + state + ",\"TabState\":{" + tabState.join(",") + "}}";
}

RadTabStrip.prototype.OnScrollStop = function ()
{
	this.RecordState();
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