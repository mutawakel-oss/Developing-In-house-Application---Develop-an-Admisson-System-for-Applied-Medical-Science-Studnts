if (typeof window.RadPanelbarNamespace == "undefined")
{
	window.RadPanelbarNamespace = {};
}

if (typeof window.RadControlsNamespace == "undefined")
{
	window.RadControlsNamespace = {};
}

RadControlsNamespace.AppendStyleSheet = function(callback, clientID, pathToCssFile)
{
	if (!pathToCssFile) 
	{ 
		return; 
	}

	var isGecko = window.netscape && !window.opera;
	if (!callback && isGecko)
	{
		//immediate css loading for Gecko
		document.write("<" + "link" + " rel='stylesheet' type='text/css' href='" + pathToCssFile + "' />");
	}
	else
	{
		var linkObject = document.createElement("link");
		linkObject.rel = "stylesheet";
		linkObject.type = "text/css";
		linkObject.href = pathToCssFile;
		document.getElementsByTagName("head")[0].appendChild(linkObject);
	}
};

function RadPanelbar (clientID)
{
	var oldPanelbar = window[clientID];
	
	if (oldPanelbar != null && oldPanelbar.Dispose)
	{
		oldPanelbar.Dispose();
	}
	
	
	this.DomElement = document.getElementById(clientID);
	this.ChildItemList = RadPanelbar.GetFirstChildByTagName(this.DomElement, "ul");
	this.StateField = document.getElementById(clientID + "_Hidden");
	this.Items = [];
	this.AllItems = [];
	this.ExpandedItem = null;
	this.SelectedItem = null;
	this.ExpandAnimation = {};
	this.CollapseAnimation = {};
	this.Attributes = {};
	this.PersistStateInCookie = false;
	this.CollapseDelay = 0;
	this.ExpandDelay = 0;
	this.ID = clientID;
	this.Skin = "Outlook";
	this.RightToLeft = false;
	this.InUpdate = false;
	this.Initialized = false;
	this.Disposed = false;
		
	this.State = {};
	this.ItemState = {};
	
	this.CausesValidation = true;
	this.Enabled = true;
	
	this.FullExpandedItem = false;	
	this.SingleExpandedItem = false;	
	
	this.ExpandMode = RadPanelbar.ExpandMode.MultipleExpandedItems;
	
	RadControlsNamespace.EventMixin.Initialize(this);
	RadControlsNamespace.DomEventMixin.Initialize(this);
}

RadPanelbar.JSONIncludeDeep = { "Attributes" : true };
RadPanelbar.ExpandMode = { MultipleExpandedItems : 0, SingleExpandedItem : 1, FullExpandedItem : 2 };

RadPanelbar.CreateState = function (instance)
{
	instance.InitialState = {};
	for (var i in instance)
	{
		var type = typeof instance[i];
		if (type == "number" || type == "string" || type == "boolean")
		instance.InitialState[i] = instance[i];
	}
}


RadPanelbar.GetFirstChildByTagName = function(parentNode, tagName)
{
	var child = parentNode.getElementsByTagName(tagName)[0];
	
	if (child && child.parentNode == parentNode)
	{
		return child;
	}
	return null;
}

RadPanelbar.GetFirstChildByClassName = function(parentNode, className)
{
	var childrenCount = parentNode.childNodes.length;
	
	for (var i = 0; i < childrenCount; i++)
	{
	    var child = parentNode.childNodes[i];
	    
	    if (child.nodeType == 3) continue;
	    
	    if (child.className.indexOf(className) > -1)
	    {
	        return child;
	    }
	}
	
	return null;
}


RadPanelbar.prototype.RenderInProgress = function()
{
   return this.DomElement.offsetWidth == 0;
}


RadPanelbar.prototype.Initialize = function (configObject, itemData)
{
	this.LoadConfiguration(configObject);
	this.ItemData = itemData;	
	
	
	
    this.DetermineDirection();
    this.ApplyRTL();
	
	
		
	this.CreateControlHierarchy(this, 0);
	

	
    if (!this.Enabled)
    {
		this.Disable();
    }
	
	this.RegisterDisposeOnUnload();
	
	this.Initialized = true;
	
	RadPanelbar.CreateState(this);
	
	this.AttachEventHandlers();
	
	this.RaiseEvent('OnClientLoad', null);
	
	
};

RadPanelbar.prototype.AttachEventHandlers = function ()
{
	this.AttachDomEvent(window, "resize", "WindowResizeHandler");
	
	var instance = this;
	
	this.DomElement.RadShow = function ()
	{
		instance.ResizeHandler();
	}
	
	this.DomElement.RadResize = function ()
	{
		instance.WindowResizeHandler();
	}
}

RadPanelbar.prototype.WindowResizeHandler = function ()
{
	this.ResizeHandler();
	this.CallRadResize();
}


RadPanelbar.prototype.CallRadResize = function ()
{
	var children = this.ChildItemList.getElementsByTagName("*");
	
	for (var i = 0; i < children.length; i ++)
	{
		var child = children[i];
		if (child.RadResize)
		{
			child.RadResize();
		}
	}
}

RadPanelbar.prototype.ResizeHandler = function ()
{
	if (this.Disposed) return;
	
	if (this.ExpandedItem)
	{
		if (this.FullExpandedItem && !this.ExpandedItem.EaseInProgress)
		{
			this.ExpandedItem.SetChildrenHeight(this.GetGroupHeight());
		}
		
		this.ExpandedItem.UpdateChildrenWidth();
	}
}

//TODO: Fix this!
RadPanelbar.prototype.GetGroupHeight = function ()
{
	if (this.ExpandedItem)
	{
		this.ExpandedItem.AnimationContainer.style.display = "none";
		this.ExpandedItem.ChildItemList.style.display = "none";
	}

	var returnValue = this.DomElement.offsetHeight - this.ChildItemList.offsetHeight;
	

	if (this.ExpandedItem)
	{
		this.ExpandedItem.AnimationContainer.style.display = "block";
		this.ExpandedItem.ChildItemList.style.display = "block";
	}
	
	return returnValue;
}

RadPanelbar.prototype.GetContentsHeight = function()
{
	var sum = 0;
	for (var i = 0; i < this.AllItems.length; i ++)
	{
		sum += this.AllItems[i].GetHeight();
	}
	
	return sum;
}


RadPanelbar.prototype.RegisterDisposeOnUnload = function ()
{
	this.AttachDomEvent(window, "unload", "Dispose");
}


RadPanelbar.prototype.DetermineDirection = function ()
{
    var el = this.DomElement;
    while (el.tagName.toLowerCase() != 'html')
    {
        if (el.dir)
        {
            this.RightToLeft = (el.dir.toLowerCase() == "rtl");
            return;
        }
        el = el.parentNode;
    }
    
    this.RightToLeft = false;
}

RadPanelbar.prototype.ApplyRTL = function ()
{
	if (!this.RightToLeft) return;
 	this.DomElement.className += " rtl RadPanelbar_" + this.Skin + "_rtl";
}

RadPanelbar.prototype.Disable = function ()
{	
    this.Enabled = false;
    this.DomElement.disabled = "disabled";	
    for (var i = 0; i < this.AllItems.length; i ++)
    {
        this.AllItems[i].Disable();    
    }
}

RadPanelbar.prototype.Enable = function ()
{	
    this.Enabled = true;
    this.DomElement.disabled = "";	
    for (var i = 0; i < this.AllItems.length; i ++)
    {
        this.AllItems[i].Enable();    
    }
}

RadPanelbar.prototype.Dispose = function ()
{
	this.Disposed = true;
	this.DisposeDomEventHandlers();
	for (var i = 0; i < this.AllItems.length; i ++)
	{
		this.AllItems[i].Dispose();
	}	
	
	if (this.DomElement)
	{
		this.DomElement.RadShow = null;
		this.DomElement.RadResize = null;
	}
    this.StateField	= null;
	this.DomElement = null;
	this.ChildItemList = null;
}

RadPanelbarNamespace.ExpandDirectionPropertyName = {"1" : 'bottom', "2" : 'top', "3" : 'right', "4" : 'left'};

RadPanelbar.prototype.CreatePanelItem = function (parent, domElement)
{
	var item = new RadPanelItem(domElement);

	item.Index = parent.Items.length;
	parent.Items[parent.Items.length] = item;
	
	item.GlobalIndex = this.AllItems.length;
	this.AllItems[this.AllItems.length] = item;

	item.Parent = parent;		
	item.Panelbar = this;
	return item;
};

RadPanelbar.prototype.CreateControlHierarchy = function (parent, level)
{
	var element = parent.ChildItemList;
	if (!element) 
	{
		return;
	}
	
	for (var i = 0; i < element.childNodes.length; i ++)
	{
		var domNode = element.childNodes[i];
		if (domNode.nodeType == 3) continue;
		var item = this.CreatePanelItem(parent, domNode);
		item.Level = level + 1;
		item.Initialize();
		this.CreateControlHierarchy(item, level + 1);
		item.ApplyStates();
	}
};


RadPanelbar.prototype.LoadConfiguration = function (configObject)
{
    for (var property in configObject)
    {
        this[property] = configObject[property];
    } 
	var expandModeEnum = 	RadPanelbar.ExpandMode;

	this.FullExpandedItem = this.ExpandMode == expandModeEnum.FullExpandedItem;	
	
	this.SingleExpandedItem = this.ExpandMode == expandModeEnum.FullExpandedItem ||
	this.ExpandMode == expandModeEnum.SingleExpandedItem;
	if (this.FullExpandedItem)
	{
		this.DomElement.style.overflow = "hidden";
	}
};


RadPanelbar.prototype.FindItemByText = function(text)
{
   for (var i = 0; i < this.AllItems.length; i++)
   {
		if (this.AllItems[i].Text == text)
		{
			return this.AllItems[i];
		}
   }
   
   return null;
};

RadPanelbar.prototype.FindItemById = function(id)
{	
	for (var i = 0; i < this.AllItems.length; i++)
	{
		if (this.AllItems[i].ID == id)
		{
			return this.AllItems[i];
		}
	}
	return null;
};

RadPanelbar.prototype.FindItemByValue = function(value)
{	
	for (var i = 0; i < this.AllItems.length; i++)
	{
		if (this.AllItems[i].Value == value)		
		{
			return this.AllItems[i];
		}		
	}
	return null;
};

RadPanelbar.prototype.FindItemByUrl = function(url)
{	
	for (var i = 0; i < this.AllItems.length; i++)
	{
		if (this.AllItems[i].NavigateUrl == url)
		{
			return this.AllItems[i];
		}		
	}
	return null;
};

RadPanelbar.prototype.RecordState = function ()
{
	if (this.InUpdate || !this.Initialized)
	{
		return;
	}
	
	// Ignore these
	this.InitialState.Clicked = this.Clicked;
	
	
	
	var state = RadControlsNamespace.JSON.stringify(this, this.InitialState, RadPanelbar.JSONIncludeDeep);
	
	var itemState = []
	for (var i in this.ItemState)
	{
		if (this.ItemState[i] == "") continue;
        if (typeof this.ItemState[i] == "function") continue;
		itemState[itemState.length] = this.ItemState[i];
	}
	this.StateField.value = "{\"State\":" + state + ",\"ItemState\":{" + itemState.join(",") + "}}";
	
	if (this.PersistStateInCookie)
	{
	    this.PersistState();
	}
}

RadPanelbar.prototype.SetAttribute = function (name, value)
{
	this.Attributes[name] = value;
	this.RecordState();
}

RadPanelbar.prototype.GetAttribute = function (name)
{
	return this.Attributes[name];
}


RadPanelbar.prototype.IsChildOf = function(parent, child)
{
	if (child == parent)
	{
		return false;
	}
	
	while (child && (child != document.body))
	{
		if (child == parent)
		{
			return true;
		}
		try 
		{
			child = child.parentNode;
		}catch (e)
		{
			return false;
		}
	}

	return false;
};

RadPanelbar.prototype.PersistState = function ()
{
    var expandState = [];
    
    for (var i = 0; i < this.AllItems.length; i++)
    {
        var item = this.AllItems[i];
        
        if (item.Expanded)
        {
            expandState[expandState.length] = item.ID;
        }
    }
    var cookieValue = "{";
    if (this.SelectedItem)
    {
        cookieValue += "\"SelectedItem\":\"" + this.SelectedItem.ID + "\",";
    }
    
    cookieValue += "\"ExpandedItems\":\"" + expandState.join(",") + "\"}";
    document.cookie = this.ID + "=" + cookieValue  + ";path=/;expires=";

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