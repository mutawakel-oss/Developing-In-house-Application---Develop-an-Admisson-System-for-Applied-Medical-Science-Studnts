RadWindowMinimizeMode = 
{
	SameLocation : 1,	
	MinimizeZone : 2, 
	Default	: 1
};

RadWindowBehavior = 
{
	None : 0, 		
	Resize : 1, 
	Minimize : 2,
	Close : 4, 	
	Pin : 8,
	Maximize : 16,
	Move: 32,
	Reload: 64,
	Default: (1 + 2 + 4 + 8 + 16 + 32 + 64)
};

function RadWindowInitialize(id, name, jsName, oSplash, navUrl,	onClientShow, onClientClose, onClientPageLoad,
							iconUrl, minimizeIconUrl, oWidth, oHeight, oLeft, oTop, oTitle, minimizeZoneId,
							oInitialBehavior, oBehavior, oMinimizeMode, oModal, visibleStatusbar, visibleTitlebar,
							visibleOnPageLoad, offsetElementId, openerElementId, destroyOnClose, reloadOnShow, 
							showContentDuringLoad, clientCallBackFunction)
{
	var oManager = GetRadWindowManager();
	
	//SPLASH - Make the RadWindow manager handle it
	if (oSplash)
	{
		oManager.CreateSplash(oWidth, oHeight);
		return;
	}
		
	var oWindow = oManager.CreateWindowObject(id);		
	oWindow.Events = [];//!
	oWindow.Name = name;
	oWindow.JsName = jsName;	
		
	//Args already set by RadWindowManager, replace them with new ones!
	if (onClientShow) oWindow["OnClientShow"] = onClientShow;
	if (onClientClose) oWindow["OnClientClose"] = onClientClose;
	if (onClientPageLoad) oWindow["OnClientPageLoad"] = onClientPageLoad;
	if (clientCallBackFunction) oWindow.ClientCallBackFunction = clientCallBackFunction;
			
	if (iconUrl) oWindow.IconUrl  = iconUrl;	
	if (minimizeIconUrl) oWindow.MinimizeIconUrl = minimizeIconUrl;
	if (navUrl) oWindow.Url = navUrl;
	if (oWidth) oWindow.Width = oWidth;
	if (oHeight) oWindow.Height = oHeight;					
	if (oLeft) oWindow.private_SetSizeValue("Left", oLeft, false);//Do not override default if value is not correct.	
	if (oTop) oWindow.private_SetSizeValue("Top" , oTop, false);						
	if (oTitle) oWindow.Title = oTitle;
	if (minimizeZoneId) oWindow.MinimizeZoneId = minimizeZoneId;		
	if (oInitialBehavior != RadWindowBehavior.None) oWindow.InitialBehavior = oInitialBehavior;
	if (oBehavior != RadWindowBehavior.Default) oWindow.Behavior = oBehavior;
	if (oMinimizeMode != RadWindowMinimizeMode.Default) oWindow.MinimizeMode = oMinimizeMode;	
	if (offsetElementId != RadWindowClass.prototype.OffsetElementId) oWindow.OffsetElementId = offsetElementId;				
	if (openerElementId != RadWindowClass.prototype.OpenerElementId) oWindow.OpenerElementId = openerElementId;	
	
	if (oWindow.OpenerElementId)
	{				
		var hookOpenerFunction = function()
		{			
			oWindow.SetOpenerElementId(oWindow.OpenerElementId);							
		};
				
		var oOpener = document.getElementById(oWindow.OpenerElementId);	
		if (!oOpener)
		{
			//Attach onload, possible that the page has not finished parsing
			RadWindowNamespace.RadUtil_AttachEventEx(window, "load", hookOpenerFunction);
		}
		else hookOpenerFunction();				
	}
		
	//Boolean props	-> if not set explicitly on the server, null is provided. 
	//If set - provided value is used. Else - default is used or the one set in WindowManager
	if (visibleStatusbar != null) oWindow.VisibleStatusbar = visibleStatusbar;
	if (visibleTitlebar != null) oWindow.VisibleTitlebar = visibleTitlebar;		
	if (visibleOnPageLoad != null) oWindow.VisibleOnPageLoad = visibleOnPageLoad;		
	
	if (destroyOnClose != null) oWindow.DestroyOnClose = destroyOnClose;
	if (reloadOnShow != null) oWindow.ReloadOnShow = reloadOnShow;
	if (showContentDuringLoad != null) oWindow.ShowContentDuringLoad = showContentDuringLoad;						
	if (oModal != null) oWindow.Modal = oModal;
					
	//oWindow.SetModal(oWindow.Modal);			
	//oWindow.SetTitle(oWindow.Title);
			
	if (oWindow.VisibleOnPageLoad)
	{			
		oWindow.Show();//Note: Memory leak deterctor waits untile content in windows is full loaded too 
	}		

	return oWindow;		
}

function RadWindowClass(id)
{
	this.IsIE = RadWindowNamespace.RadUtil_DetectBrowser("ie");
	this.Id = id;	
	this.JsName = id;
	this.Name = ""; //For the frame name because of the target attribute for links		
	this.BrowserWindow = window; //Allows window hierarchies to access each-oter's browser windows
}

RadWindowClass.prototype.ClientCallBackFunction = null;	
RadWindowClass.prototype.BrowserWindow = null;
RadWindowClass.prototype.Url = null;		
RadWindowClass.prototype.Width = 300;
RadWindowClass.prototype.Height = 300;
RadWindowClass.prototype.Left = null;
RadWindowClass.prototype.Top = null;
RadWindowClass.prototype.Title = "";
RadWindowClass.prototype.MinimizeZoneId = "";
RadWindowClass.prototype.OffsetElementId = "";
RadWindowClass.prototype.OpenerElementId = "";
RadWindowClass.prototype.IconUrl  = "";
RadWindowClass.prototype.MinimizeIconUrl  = "";
RadWindowClass.prototype.Language = "en_US";
RadWindowClass.prototype.Localization =  {};
RadWindowClass.prototype.SchemeBasePath = null;	
RadWindowClass.prototype.Behavior = RadWindowBehavior.Default;		
RadWindowClass.prototype.InitialBehavior = RadWindowBehavior.None;		
RadWindowClass.prototype.MinimizeMode = RadWindowMinimizeMode.Default;
RadWindowClass.prototype.Maximized = false; 
RadWindowClass.prototype.Minimized = false;	
RadWindowClass.prototype.Pinned = false;			
RadWindowClass.prototype.Closed = false;	
RadWindowClass.prototype.Modal = false;
RadWindowClass.prototype.Loaded = false;		
RadWindowClass.prototype.Splash = false;								
RadWindowClass.prototype.VisibleStatusbar = true;
RadWindowClass.prototype.VisibleTitlebar = true;
RadWindowClass.prototype.VisibleOnPageLoad = false;
RadWindowClass.prototype.Created = false;
RadWindowClass.prototype.DestroyOnClose = false;
RadWindowClass.prototype.ReloadOnShow = false;
//Element holders
RadWindowClass.prototype.WrapperElement = null;	
RadWindowClass.prototype.TitleElement = null;
RadWindowClass.prototype.HeaderRowElement = null;
RadWindowClass.prototype.Iframe = null;
RadWindowClass.prototype.LoadingWrapper = null;
RadWindowClass.prototype.MinimizedWindow = null;
RadWindowClass.prototype.ClassicWindow = null;
RadWindowClass.prototype.Events = null;
RadWindowClass.prototype.ShowContentDuringLoad = false;


RadWindowClass.prototype.SetOffsetElementId = function(id)
{
	this.OffsetElementId = id;
};

RadWindowClass.prototype.SetOpenerElementId = function(id)
{
	var oWindow = this;
	oWindow.OpenerElementId = id;
	var oOpener = document.getElementById(oWindow.OpenerElementId);		
	if (oOpener)
	{	
		var funcRef = oOpener.onclick;								
		oOpener.onclick = function(e)
		{			
			if (funcRef) funcRef();
			oWindow.Show();
			if (e) RadWindowNamespace.RadUtil_CancelEvent(e);
			return false;
		};
	}
	else alert (oWindow.Id + " (OpenerElementId)- Could not find element on page with id " + oWindow.OpenerElementId);						
};

RadWindowClass.prototype.ExecuteServerClientEvent = function(eventName)
{
	var functionPtr = this[eventName];
	if (!functionPtr) return;
	if (typeof(functionPtr) == "string") functionPtr = eval(functionPtr);
	
	//NEWMOZILLA
	if (typeof(functionPtr) != "function") return;
	
	try
	{		
		return functionPtr(this);		
	} catch(e)
	{
		alert ("Exception while executing client event " + eventName  + " Error:" + e.message );
	};
	return true;
};

RadWindowClass.prototype.AutoResize = function()
{	
	try //Blows under Opera
	{
		var frm = this.Iframe;						
		var resize = function()
		{		
			var initHeight = frm.clientHeight;				
			var targetHeight = frm.contentWindow.document.body.scrollHeight;
			if (targetHeight > initHeight)
			{				
				frm.style.height = parseInt(targetHeight) + "px";
			}
			//alert (targetHeight + " >?" + initHeight);		
			if (!document.all)//Problem with popups and Mozilla
			{
				frm.style.marginTop="-3px";
				frm.style.marginBottom="-3px";
			}
		};	
		resize();
	} catch(e){};
};

//Dispose to avoid memory leaks
RadWindowClass.prototype.Dispose = function()
{	
	//alert ("Disposing " + this);
	try
	{
		var oOpener = document.getElementById(this.OpenerElementId);		
		if (oOpener) oOpener.onclick = null;
			
		if (this.WrapperElement)
		{		
			if (this.WrapperElement.DisableMove) this.WrapperElement.DisableMove();			
			this.WrapperElement = null;			
		}
		
		if (this.HeaderRowElement) this.HeaderRowElement.ondblclick = null;
		this.HeaderRowElement = null;
		this.TitleElement = null;
		this.StatusElement = null;
				
		if (this.IframeDocumentClickHandler && this.IframeDocument)
		{
			RadWindowNamespace.RadUtil_DetachEventEx(this.IframeDocument, "click", this.IframeDocumentClickHandler);		 
			this.IframeDocumentClickHandler = null;
			this.IframeDocument = null;
		}
		
		if (this.IframeLoadHandler)
		{
			RadWindowNamespace.RadUtil_DetachEventEx(this.Iframe, "load", this.IframeLoadHandler);		 
			this.IframeLoadHandler = null;
		}
							
		if (this.Iframe)
		{					
		    //MEMORYLEAK - Call onunload handler of the page by forcing a page change
		    this.Iframe.src = "javascript:''";						    
		    this.Iframe = null;				
		}
		
		//NEWCALLBACK		
		window[this.JsName] = null; //remove global reference

		this.LoadingWrapper = null;
		if (this.MinimizedWindow && this.MinimizedWindow.Dispose) this.MinimizedWindow.Dispose();			
		this.MinimizedWindow = null;		
		if (this.ModalElement && this.ModalElement.Dispose) this.ModalElement.Dispose();			
		this.ModalElement = null;						
		this.Events = null;
		this.RestoreRect = null;		
		
		//MEMORYLEAK
		 var oHolder = document.getElementById("WindowHolder_"+ this.Id);
		 if (oHolder)
		 {		
			oHolder.innerHTML = "";
		 }
		 
	}
	catch (e) 
	{ 
		//alert("Exception in RadWindowClass.prototype.Dispose " + e.message); 
	}	
};

//Client event registration & execution methods 
RadWindowClass.prototype.AttachClientEvent = function (eventName, eventHandler)
{
	if (!eventHandler) return;
	else 
	{
		if (null == this.Events[eventName])
		{
			this.Events[eventName] = [];
		}
		var oArray = this.Events[eventName];
				
		if (typeof(eventHandler) == "string")
		{
			eventHandler = eval(eventHandler);					
		}		
		oArray[oArray.length] = eventHandler;		 
	}
};

RadWindowClass.prototype.ExecuteClientEvent = function (eventName)
{				
	var radEvent = this.Events[eventName];
	if (null != radEvent)
	{		
		var oLen = radEvent.length;
		for (var i = 0; i < oLen; i++)
		{
			try {						
				radEvent[i](this);//Call
			} catch(e)
			{
				//alert ("Exception while executing client event " + eventName  + " Error:" + e.message);				
			};
		}
	}
	return true;
};

/***************************************************************************************************************************
 *
 *       PUBLIC API
 *
 ****************************************************************************************************************************/ 
RadWindowClass.prototype.SetModal = function(isModal)
{	
	this.Modal = isModal;	
	if (this.Modal && !this.ModalElement)
	{	
		 this.ModalElement = new RadWindowNamespace.RadWindowModal(this);
	}
	else if (!this.Modal && this.ModalElement)
	{
		this.ModalElement.Dispose();
		this.ModalElement = null;
	}	
};

RadWindowClass.prototype.MoveTo = function(x, y)
{
	var oWnd = this;	
	if (!oWnd.WrapperElement) return;
	
	x = parseInt(x);
	y = parseInt(y);
	oWnd.WrapperElement.MoveTo(x,y);
	if (!oWnd.RestoreRect)
	{
		oWnd.RestoreRect = {};	
	}
	oWnd.RestoreRect = oWnd.WrapperElement.GetRect();	
};


RadWindowClass.prototype.SetWidth = function(width)
{
	//if window was never shown
	if (!this.WrapperElement)
	{
		this.Width = width;
		return;
	}
	
	var oRect = this.WrapperElement.GetRect();
	this.SetSize(width, oRect.height);		
};

RadWindowClass.prototype.SetHeight = function(height)
{
	//if window was never shown
	if (!this.WrapperElement)
	{
		 this.Height = height;
		 return;
	}
	
	var oRect = this.WrapperElement.GetRect();
	this.SetSize(oRect.width, height);	
};

RadWindowClass.prototype.GetWidth = function()
{	
	//GetWidth can be called on a window that was never created and made visible
	if (!this.WrapperElement) return this.Width;
	
	var oRect = this.WrapperElement.GetRect();
	//If not visible or minimized
	if (oRect.width == 0 && this.RestoreRect)
	{
		return this.RestoreRect.width;
	}	
	return oRect.width;	
};

RadWindowClass.prototype.GetHeight = function()
{
	if (!this.WrapperElement) return this.Height;

	var oRect = this.WrapperElement.GetRect();
	
	//If not visible or minimized
	if (oRect.height == 0 && this.RestoreRect)
	{
		return this.RestoreRect.height;
	}
	
	return oRect.height;
};

RadWindowClass.prototype.GetLeftPosition = function() 
{
	if (!this.WrapperElement) return this.Left;
	
	var oRect = this.WrapperElement.GetRect();
	//If not visible or minimized
	if (this.IsMinimized() || (oRect.left == 0 && this.RestoreRect))
	{
		return this.RestoreRect.left;
	}	
	return oRect.left;
};

RadWindowClass.prototype.GetTopPosition = function() 
{
	if (!this.WrapperElement) return this.Top;

	var oRect = this.WrapperElement.GetRect();
	//If not visible or minimized
	if (this.IsMinimized() || (oRect.top == 0 && this.RestoreRect))
	{
		return this.RestoreRect.top;
	}
	return oRect.top;
};


RadWindowClass.prototype.SetTitle = function(oTitle)
{
	if (!oTitle) return;
	if (this.TitleElement) this.TitleElement.innerHTML = oTitle;
	this.Title = oTitle;
};

RadWindowClass.prototype.GetWindowManager = function()
{
	return GetRadWindowManager();
};

//Used in RadWindowMinimize only
RadWindowClass.prototype.GetRectangle = function()
{	
	 if (this.IsVisible()) return this.WrapperElement.GetRect();
	 else return this.RestoreRect;
};

//Does not work for elements that are not direct descendents of the BODY (e.g.- the Spash!). TO DO: Need to rework
RadWindowClass.prototype.Center = function()
{		
	var oElem = this.WrapperElement;

	var oRect = RadWindowNamespace.RadGetElementRect(oElem);		
	var oScreen = RadWindowNamespace.RadUtil_GetBrowserRect();	
	
	var oWidth = oRect.width;
	var oHeight = oRect.height;		
	var x = oScreen.left + ((oScreen.width - parseInt(oWidth))/ 2);
	var y = oScreen.top + ((oScreen.height - parseInt(oHeight))/ 2);		
		
	//Assume the BODY is the window parent (safe assumption!)	
	if (!isNaN(x)) oElem.style.left = (x) + "px";	
	if (!isNaN(y)) oElem.style.top = (y) + "px";	
};

RadWindowClass.prototype.SetVisible = function(isVisible)
{
	if (isVisible)
	{		
	    //NEWMOZILLA
		if (!this.WrapperElement.Show)
		{ 
		    this.WrapperElement.style.display = "";
		    return;
		}
		
		var oRect = this.RestoreRect;
		if (oRect)
		{												
			this.WrapperElement.MoveTo(oRect.left, oRect.top);
		}
		this.WrapperElement.Show();
		
		if (oRect)//!Execute after Show so that the IE XHTML mode Height fix can work!
		{					
			this.WrapperElement.SetSize(oRect.width, oRect.height);
		}
		this.Closed = false;		
	}
	else
	{		
		//When calling SetSize (a normal thing when creating a window, but before showing it
		//there is a problem - setting the size will create a restore rect, and when you call show it will use the restore rect
		//howeve the values for top and left will be wrong. So, SetSize should not make a restore rect!		
		
		//Problem! If we call SetVisisble and the window is actually NOT visible already then we have problem with coords
		if (!this.IsVisible()) return;
						
		//NEWMOZILLA
		if (this.WrapperElement.Hide) this.WrapperElement.Hide();	
		else this.WrapperElement.style.display = "none";
	}
	this.UpdateStatus();
};

RadWindowClass.prototype.SetSize = function(width, height)
{		
	var oWnd = this;
	var oFun = function()
	{
		//remove size from status bar!
		if (oWnd.StatusElement) oWnd.StatusElement.style.width = "";
	
		var oWidth = parseInt(width);
		var oHeight = parseInt(height);
		
		oWnd.Width = oWidth;
		oWnd.Height = oHeight;
		
		//NEWMOZILLA
		if (oWnd.WrapperElement.SetSize)
		{
			oWnd.WrapperElement.SetSize(oWidth, oHeight);			
		}
		else
		{
			oWnd.WrapperElement.style.height = oHeight + "px";
			oWnd.WrapperElement.style.width = oWidth + "px";
		}
		
		if (oWnd.RestoreRect)
		{
			oWnd.RestoreRect.width = oWidth;
			oWnd.RestoreRect.height = oHeight;
		}
		
		//Update status [width]
		oWnd.UpdateStatus();
	}
	

	oFun();
};

//Creates RadWindow object which is ready to have either url set or content filled!
RadWindowClass.prototype.Create = function()
{		
	if (!this.WrapperElement) 
	{	
		var oManager = GetRadWindowManager();		
		var oHtml = this.private_BuildWindowHtml();									
    						
		var oHolder = document.createElement("SPAN");		
		oHolder.setAttribute("id", "WindowHolder_"+ this.Id);
		document.body.appendChild(oHolder);		
		oHolder.innerHTML = oHtml;		

		//Set references to elements
		this.WrapperElement = document.getElementById("RadWindowWrapperElement" + this.Id);						
		this.TitleElement = document.getElementById("RadWindowTitle" + this.Id);
		this.HeaderRowElement = document.getElementById("RadWindowHeaderRow" + this.Id);
		this.StatusElement = document.getElementById("RadWStatus" + this.Id);
		this.Iframe = document.getElementById("RadWindowContentFrame" + this.Id);
		this.LoadingWrapper = document.getElementById("RadWindowLoadingWrapper" + this.Id);
	
		RadWindowNamespace.MakeMoveable(this.WrapperElement	
				, useDragHelper = true
				, this.UseOverlay //useOverlay
				, this.IsBehaviorEnabled(RadWindowBehavior.Resize) 
				, this.IsBehaviorEnabled(RadWindowBehavior.Move) 
				);				
		
		var thisWnd = this;				
		
		//Attach event handlers: Make sure that when an element is dropped it has the biggest zOrder!
		this.WrapperElement.OnMouseUp = function()
		{		
			thisWnd.SetActive(true);					
		};
		
		this.WrapperElement.OnDragEnd = function()
		{				
			thisWnd.RestoreRect = thisWnd.WrapperElement.GetRect();//Restore rect must be set BEFORE set active!			
			thisWnd.SetActive(true);			
			
			//Update status "width"
			thisWnd.UpdateStatus();
						
			//NEW: execute client event
			thisWnd.ExecuteClientEvent("ondragend");
		};
			
		if (this.IsBehaviorEnabled(RadWindowBehavior.Maximize) && this.HeaderRowElement)
		{
			this.HeaderRowElement.ondblclick = function()
			{			
				thisWnd.ToggleMaximize();
			}
		}
		
		//Create a back reference to parent RadWindow
		this.CreateBackReference();
	}	
	this.Created = true;
};		

RadWindowClass.prototype.Show = function()
{	
	var oWindow = this;	
	var showFunction = function()
	{	
		var toReturn = false;
		
		if (!oWindow.Created)
		{
			 oWindow.Create();
			 
			 if (RadWindowBehavior.Minimize & oWindow.InitialBehavior)
			 {				
				oWindow.Minimize();
				toReturn = true;
			 }
			 else if (RadWindowBehavior.Maximize & oWindow.InitialBehavior)
			 {
				oWindow.Maximize();
				toReturn = true;
			 }
		}
		
		//Has not been loaded before or should load each time
		if (oWindow.Url && (!oWindow.Loaded || oWindow.ReloadOnShow)) 
		{			
			oWindow.SetUrl(oWindow.Url);
		}
		
		if (toReturn) return;
		
		//NEWMOZILLA - problem with AJAX and duplication of Wrapper when offsetWidth or offsetHeight values are accessed. 
		//	oWindow.SizePending = true;//NEW - needed because of the timeout!
		//	oWindow.MovePending = true;//NEW - needed because of the timeout!
		//	 window.setTimeout(function()
		// {
			if (!oWindow.RestoreRect)
			{			
				var oWrapper = oWindow.WrapperElement;						
				
				//MOZILLA CALLBACK
				if (oWindow.WrapperElement && oWindow.WrapperElement.SetSize)
				{
					oWindow.WrapperElement.SetSize(oWindow.Width, oWindow.Height);
				}
										
				//Must show the window to calculate width and height			
				if (!oWindow.IsVisible())
				{			
					oWrapper.MoveTo(-3000, -3000);										
					oWrapper.Show();					
				}
								
				//Do the OffsetElementId stuff!
				var oRect = oWindow.GetLeftTopPosition();
				
				x = oRect.left;
				y = oRect.top;
				
				oWindow.SetVisible(true);//!OR moving does not update content restore rect properly			
				
				//Hack for IE DOCTYPE resizing problem
				if (/*oWindow.SizePending &&*/ oWindow.IsIE && "CSS1Compat" == document.compatMode)
				{				
					oWrapper.SetSize(oWindow.Width, oWindow.Height);//re-Set size
				};			
														
				//if user did not issue a MoveTo immediately after Show
				//if (oWindow.MovePending)		
				 oWindow.MoveTo(x, y);
			}
			else
			{			
				oWindow.SetVisible(true);		
			}
					
			//Check for pin! Hack - should be improved to check it just once!
			if (RadWindowBehavior.Pin & oWindow.InitialBehavior)
			{ 
				oWindow.Pinned = false;				
				oWindow.TogglePin();
			}
			
			//If MinimizeZone is specified
			if (oWindow.IsMinimizeModeEnabled(RadWindowMinimizeMode.MinimizeZone) && !oWindow.MinimizedWindow)
			{	
				oWindow.MinimizedWindow = new RadWindowNamespace.RadWindowMinimize(oWindow);
			}
			
			//Move from RadWindowInitialize
			oWindow.SetModal(oWindow.Modal);			
			oWindow.SetTitle(oWindow.Title);
				
			//If the window is modal! Then it has to be the active window automatically!
			if (oWindow.Modal) oWindow.SetActive(true);								
			oWindow.Closed = false;
			
			//RWIN-7719 - show window, minimize it, then show it again.
			if (oWindow.IsMinimized()) 	oWindow.ExecuteClientEvent("onrestore");	
			
			oWindow.Minimized = false;
														
			//Raise event
			oWindow.ExecuteClientEvent("onshow");					
			
			oWindow.ExecuteServerClientEvent("OnClientShow");				
			oWindow.SizePending = null;
			oWindow.MovePending = null;
		//}, 0);
	}
	
	if ((null != document.readyState && "complete" != document.readyState))
	{
		RadWindowNamespace.RadUtil_AttachEventEx(window, "load", showFunction);
	}
	else showFunction();
};	

RadWindowClass.prototype.Hide = function() 
{
	this.SetVisible(false);
};

RadWindowClass.prototype.GetLeftTopPosition = function()
{
	var oWindow = this;
	var x = null, y = null;			
	if (oWindow.OffsetElementId)
	{	
		var offsetElem = document.getElementById(oWindow.OffsetElementId);
		if (offsetElem)
		{		
			var oRect = RadWindowNamespace.RadGetElementRect(offsetElem);
			if (oRect)
			{
				x = (oRect.left + (this.Left? parseInt(this.Left) : 0));
				y = (oRect.top + (this.Top? parseInt(this.Top) : 0));
			}	
		}
	}
	
	if (null == x || null == y)
	{
		var oScreen = RadWindowNamespace.RadUtil_GetBrowserRect();
		x = RadWindowNamespace.RadGetScrollLeft(document) + (oWindow.Left? parseInt(oWindow.Left) : (oScreen.width - parseInt(oWindow.GetWidth())) / 2);
		y = RadWindowNamespace.RadGetScrollTop(document) + (oWindow.Top? parseInt(oWindow.Top) : (oScreen.height - parseInt(oWindow.GetHeight())) / 2);		
		
		var windowHeight = parseInt(oWindow.GetHeight());		
		if (windowHeight < oScreen.height)//RWIN-8069
		{
			var topOffset = windowHeight - oScreen.height;		
			if (topOffset > 0) y += topOffset/2;//Prevent from title going above the top visible area		
		}
	}
	return	{ left:x, top:y };
};

RadWindowClass.prototype.CallBack = function(oArg, bKeepOpen)
{
	//alert ("RadWindowClass.prototype.CallBack called with " + oArg);		
	if (true != bKeepOpen) this.Close();
		
	var oFun = this.ClientCallBackFunction;
	if (oFun)
	{		
		if ("string" == typeof(oFun)) oFun = eval(oFun);
		if ("function" == typeof(oFun)) oFun(this, oArg);
	}
};

RadWindowClass.prototype.CreateBackReference = function()
{
	var theWnd = this;
	if (!theWnd.Argument) theWnd.Argument = {};
	
	var oIframe = this.Iframe;
	
	try 	
	{	
		if (this.ClassicWindow)
		{			
			var oWnd = this.ClassicWindow;			
			//alert ("1" + oWnd.frameElement); IE Exception - no such interface supported.
			//alert ("2 " + oWnd.contentWindow);//IE - Undefined			
			oWnd.radWindow = theWnd;//Works in IE and newer Mozillas 
		}
		else
		{			
			//Accessed in both browsers with window.frameElement.RadWindowClass
			//in IE oIframe = window.frameElement 
			oIframe.radWindow = theWnd;//oIframe.contentWindow;

			if (oIframe.contentWindow != null)//Opera problem
			{ 
				//Associate the radWindow oject with the iframe		  		  		  
				//In Moz like this is accessed - window.RadWindowClass, undefined in IE!
				oIframe.contentWindow.radWindow = theWnd;//" Iframe.contentWindow.RadWindowClass ";
			}
						
			//TRUE-> oIframe.contentWindow.frameElement == oIframe;
			//TRUE -> oIframe.contentWindow == window in child!
			//HOWEVER oIframe.contentWindow.RadWindowClass = window.RadWindowClass is false in IE??						
		}		
	}
	catch(e){}
};

RadWindowClass.prototype.GetContentFrame = function()
{
	return this.Iframe;
};

RadWindowClass.prototype.GetTitlebar = function()
{
	return this.TitleElement;
};

RadWindowClass.prototype.GetStatusbar = function()
{
	return this.StatusElement;
};


//Sets content string into the RadWindow iframe (good for dialog boxes 
RadWindowClass.prototype.SetContent = function(content)
{			
	this.CreateBackReference();
	
	var frm = this.Iframe;		
	if (content)
	{	
		//Insert the script necessary for getting back reference to the radWindow
		var oRadWindowScript = "function GetRadWindow(){" +
							"var oWindow = null;" + 
							"if (window.radWindow) oWindow = window.radWindow;" + 
							"else if (window.frameElement.radWindow) oWindow = window.frameElement.radWindow;" +				
							"return oWindow; }";							
		if (window.opera)//OPERA!
		{
			frm.src = this.SchemeBasePath + "../../Opera.html";		
			var oWnd = this;	
			frm.attachEvent("onload", function()
				{
					frm.contentWindow.document.body.innerHTML = content;
					
					//VERY VERY HACKY! To be improved - support for localization in Opera!
					//Save all scripts to an array
					re = new RegExp("<(SCRIPT)([^>]*)>([\\s\\S]*?)</(SCRIPT)([^>]*)>", "ig");					
					var scriptArray = [];
					content.replace(re, function(oMatch,a,b,c)
					{			
						scriptArray[scriptArray.length] = c;
						return oMatch;
					});
												
					var oBody = frm.contentWindow.document.body;
										
					//The scripts should be localization scripts, so use a couple of hacks and assumptions to make them work in Opera
					var oScripts = oBody.getElementsByTagName("SCRIPT");
					var oLength = oScripts.length;//!Set it here, because as you replace script elements their length gets less!
					for (var i=0; i < oLength; i++)
					{					
						var oScr = scriptArray[i];//The ORIGINAL script array
						if (oScr.indexOf("GetLocalizedString")>-1)
						{																					
							var startIndex = oScr.indexOf("GetLocalizedString(");
							var endIndex = oScr.indexOf(")", startIndex + 19);//19 is the length of GetLocalizedString(							
							var locString = oScr.substring(startIndex + 20, endIndex-1);//remove quotes
							//alert(locString + " \n" + oWnd.GetLocalizedString(locString));
							//Either use oScripts[0].innerHtml =   or   oScripts[0].innerHtml +=
							oScripts[i].parentNode.innerHTML += oWnd.GetLocalizedString(locString);
						}
					}
				
					//Insert GetRadWindow function
					var oDoc = frm.contentWindow.document;										
					var oScript = oDoc.createElement("SCRIPT");										
					oBody.insertBefore(oScript, oBody.firstChild);
					oScript.innerHTML = oRadWindowScript;									
					
					//Insert styles
					var oStyles = oBody.getElementsByTagName("STYLE");					
					if (oStyles && oStyles.length > 0)
					{
						var regEx = new RegExp("<(STYLE)([^>]*)>[\\s\\S]*?</(STYLE)([^>]*)>", "ig");																
						var stl = content.match(regEx);				
						var oStyle = oStyles[0];
						if (stl) oStyle.innerText =  stl;
					}
				}
			);			
		}	
		else 
		{
			//Factor out common code for setting content
			function fillContent(doc)
			{
				doc.write("");
				doc.close();								
				doc.open();
				doc.write( "<" + "script" + ">" + oRadWindowScript + "<" + "/script>" + content);
				doc.close();
			}	
			
			if (!frm.contentWindow || !frm.contentWindow.document) //SAFARI!
			{	
				frm.src = this.SchemeBasePath + "../../Opera.html";		
				var oWnd = this;	
				frm.addEventListener("load", function()
				{
					fillContent(frm.contentWindow.document);
				}, false);		
			}
			else 
			{				
				fillContent(frm.contentWindow.document);
			}
		}		
	}	
};

RadWindowClass.prototype.GetUrl = function()
{
	return this.Url;
};

//Sets an Url
RadWindowClass.prototype.SetUrl = function(url)
{	
	//If url starts with www, but not with http then do http.. or not? //if (url && url.length > 3 && "www" == url.substr(0, 3)	
	var processedUrl = url;

	this.Url = processedUrl;	
			
	//Append a random string to the url of the page so it is not cached from the browser
	var _ifrmUrl = processedUrl;
	if (this.ReloadOnShow)
	{
		var str = 'rwndrnd=' + Math.random();

		if (_ifrmUrl.indexOf('?') > -1)
		{
			str = '&' + str;
		} 
		else
		{
			str = '?' + str;
		}		
		_ifrmUrl += str;
	}

	this.Iframe.src = _ifrmUrl;

	//New. Prevent a potential problem with RadTabStrip and RadMenu
	if (!this.ShowContentDuringLoad) 
	{
		this.Iframe.style.width  = "0px";
		this.Iframe.style.height = "0px";
	}

	//Put "Loading..." sign as a drag helper or on the toolbar!
	this.LoadingWrapper.style.display = "";
		
	var theWnd = this;
	var theFun = function() 
	{	
		theWnd.LoadingWrapper.style.display = "none";		
		theWnd.Iframe.style.width  = "100%";
		theWnd.Iframe.style.height = "100%";				
		
		if (!theWnd.IsVisible() || theWnd.IsActive() || theWnd.IsClosed()) {} //Do nothing
		else theWnd.SetActive(true);
				
		try //Exception if loaded page is not from the same domain!	
		{		  
		  theWnd.IframeDocument = theWnd.Iframe.contentWindow.document;		  
		  theWnd.IframeDocumentClickHandler = function(e)
			{
				//If you click on a button to close the window, then the click event is fired, but you should diskard it!
				if (!theWnd.IsVisible() || theWnd.IsActive() || theWnd.IsClosed()) return;
				//If active window already return! (or in some scanrios when a button is clicked and the handler gets executed, the effect is not as wanted							
				theWnd.SetActive(true);
			}		  
		  RadWindowNamespace.RadUtil_AttachEventEx(theWnd.IframeDocument, "click", theWnd.IframeDocumentClickHandler);		
		  //Set title		  
		  if (theWnd.IframeDocument.title) theWnd.SetTitle(theWnd.IframeDocument.title);
		}
		catch (e)
		{
			//alert ("Exception in SetUrl -> " + e.message); 			
		}
		
		//Execute load event		
		theWnd.ExecuteServerClientEvent("OnClientPageLoad");		
		theWnd.ExecuteClientEvent("onwindowload");//Used in RadWindowMinimize				
	};
	
	//Attach handler just once for the iframe lifetime
	if (!this.Loaded)
	{		    		 
		 this.IframeLoadHandler = theFun;
		 RadWindowNamespace.RadUtil_AttachEventEx(this.Iframe, "load", this.IframeLoadHandler);
		 if (window.opera && this.Iframe.attachEvent) this.Iframe.attachEvent("onload", theFun);		 		 
	}	
	this.Loaded = true;
};

RadWindowClass.prototype.Reload = function()
{			
	//Put "Loading..." sign as a drag helper or on the toolbar!
	this.LoadingWrapper.style.display = "";
	
	try
	{
		this.Iframe.contentWindow.location.reload();			
	}
	catch (e)
	{		
		this.LoadingWrapper.style.display = "none";
	}	
};


//We apply a bit of event-like archtiecture here with the WindowManager serving as middle tier. Not true event in order to have maximum speed 
RadWindowClass.prototype.SetActive = function(setActive)
{	
	//Problem - in some scenarios this function can be called when window is actually not visible	
	//if (!this.IsVisible()) return;
	//But in this case the SingleNonMinimizedWindow functionality stops working! So, for now we leave it like this and fix the problem where it starts!
	
	if (false != setActive)
	{	
		
		var oUrl = this.Url;
		try
		{
			oUrl = this.Iframe.contentWindow.location.href;
			if (oUrl.indexOf("javascript") == 0) oUrl = "";
		}catch(e)
		{
			oUrl = "";
		}		
		
		if (!this.GetStatus()) //DO not override existing status if it was there!
		{
			//Causes the window to resize a bit. For now remove this functionality!
			//this.SetStatus(oUrl ? oUrl : "");			
		}
						
		this.private_SetActiveCssClass(true);//Make sure you set the right css class, (before checking if is the currenty active window) whatever happens!		
		RadWindowNamespace.RadUtil_SetOnTop(this.WrapperElement);
					
		var oManager = GetRadWindowManager();		
		var oActiveWnd = oManager.GetActiveWindow();		
	
		if (this == oActiveWnd) return;
		else oManager.SetActiveWindow(this);//Manager checks whether is same window, but this is not enough when SingleActiveWindow = true!		
	}			
};


RadWindowClass.prototype.SetActiveProtected = function(setActive)
{
	//alert (setActive + "--" + this.Id + " RadWindowClass.prototype.SetActiveProtected");
	this.private_SetActiveCssClass(setActive);//keep the call here as well				
	if (setActive)
	{				
		var oWrapper = this.WrapperElement;			

		//Nasty bug in Moz not repainting the page when element zOrder is changed, so hide/show for proper repaint!
		if (!this.IsIE && (this.MinimizeMode != RadWindowMinimizeMode.MinimizeZone))
		{				
			oWrapper.Hide();
			oWrapper.Show();
		}		
	}
	
	//Raise event
	this.ExecuteClientEvent(setActive ? "onactivate" : "ondeactivate");			
};

RadWindowClass.prototype.SetStatus = function(oStr)
{	
	if (this.StatusElement)
	{
		this.StatusElement.value = oStr;		
		var oParent = this.StatusElement.parentNode;
		var oWidth = oParent && oParent.offsetWidth > 0 ?  oParent.offsetWidth - 5 : "";
		if (oWidth) oWidth += "px";		
		this.StatusElement.style.width = oWidth;
	}
};

RadWindowClass.prototype.UpdateStatus = function(oBehavior)
{	
	if (this.StatusElement)
	{
		var oThis = this;
		this.StatusElement.style.width = "";
		window.setTimeout(function()
		{
			oThis.SetStatus(oThis.GetStatus());	
		});
	}
};


RadWindowClass.prototype.GetStatus = function()
{	
	if (this.StatusElement)
		return this.StatusElement.value;		
	
};

/*************************************************************************************************************************** 
 *       Methods called by the Title Buttons 
 ****************************************************************************************************************************/ 
RadWindowClass.prototype.Minimize = function()
{	
	if (!this.Created || this.Closed || this.Minimized) return;
	
	this.WrapperElement.Hide();	

	RadWindowNamespace.RadUtil_EnableScrolling(true);
	
	this.Minimized = true;
	this.Maximized = false;	

	//See RWIN-5182
	var oManager = GetRadWindowManager();	
	if (this == oManager.GetActiveWindow())
	{	
		oManager.ActiveWindow = null;
	}
	
	//Create minimized window on demand to improve performance. The minimize window handles all details on the minimization!
	if (!this.MinimizedWindow) this.MinimizedWindow = new RadWindowNamespace.RadWindowMinimize(this);
	
	//Raise event	
	this.ExecuteClientEvent("onminimize");	
};

RadWindowClass.prototype.ToggleMaximize = function()
{
	//Take care of pinning
	var pinOn = this.Pinned;
	if (pinOn) this.TogglePin();	
	

	if (this.Maximized)
	{
		this.Restore();				
	}
	else
	{
		this.Maximize();			
	}
		
	if (pinOn) this.TogglePin();	
};

RadWindowClass.prototype.Restore = function()
{		
	if(!this.Created) return;
	
	//Enable move
	if (this.WrapperElement && this.WrapperElement.EnableMove) this.WrapperElement.EnableMove(true);
		
	//Remove IE onresize handler
	if (this.OnResizeHanlder)
	{
			RadWindowNamespace.RadUtil_DetachEventEx(window, "resize", this.OnResizeHanlder);
			this.OnResizeHanlder = null;
	}
	
	//Scrolling should be restored to what it was before maximzing					
	RadWindowNamespace.RadUtil_EnableScrolling(true, this.PageOverflow);
	this.PageOverflow = null;
	
	var rect = this.RestoreRect;

	if (!rect) // Not always present. Method can be called from outside, because is in public API
	{
		//Set the default restore rectangle
		var position = this.GetLeftTopPosition();
		this.RestoreRect =
		{
			width	: this.Width,
			height	: this.Height,
			top		: position.top,
			left	: position.left
		};
		rect = this.RestoreRect;
	}
	
	this.SetVisible(true);
	var oWrapper = this.WrapperElement;		
	oWrapper.SetSize(rect.width, rect.height);		
	oWrapper.MoveTo(rect.left, rect.top);
	
	this.private_SetAttribute("ToggleMaximizeButton", "title", this.GetLocalizedString("Maximize"));
	this.private_SetAttribute("ToggleMaximizeButton", "src", this.private_GetImageUrl("Maximize.gif"));
	this.Maximized = false;
	this.Minimized = false;				
	this.SetActive(true);					
			
	//Raise event
	this.ExecuteClientEvent("onrestore");
	return this;	
};

RadWindowClass.prototype.Maximize = function()
{	
	if (!this.Created) return;				
	this.SetVisible(true);									//Set Visible!
	
	//Disable move
	if (this.WrapperElement && this.WrapperElement.EnableMove) this.WrapperElement.EnableMove(false);		 
	
	this.PageOverflow = document.body.style.overflow;
	RadWindowNamespace.RadUtil_EnableScrolling(false);		//Disable scrolling 				
	
	var rect = RadWindowNamespace.RadUtil_GetBrowserRect();	//Calculate browser dimensions!	
	this.WrapperElement.MoveTo(rect.left, rect.top);		//Move to top left browser corner			
	this.WrapperElement.SetSize(rect.width, rect.height, false);//Do not use API, set directly, and PREVENT FIRING OF EVENT!
	
	this.private_SetAttribute("ToggleMaximizeButton", "title", this.GetLocalizedString("Restore"));
	this.private_SetAttribute("ToggleMaximizeButton", "src", this.private_GetImageUrl("Restore.gif"));
	this.Maximized = true;
	this.Minimized = false;	
	this.SetActive(true);
		
	if (!this.OnResizeHanlder)
	{
		var oWrapper = this.WrapperElement;		
		var oThis = this;
		this.OnResizeHanlder = function()
		{			
			var oBrowser = RadWindowNamespace.RadUtil_GetBrowserRect();			
			oWrapper.MoveTo(oBrowser.left, oBrowser.top);
			oWrapper.SetSize(oBrowser.width, oBrowser.height, false);			
			
		};		
		RadWindowNamespace.RadUtil_AttachEventEx (window, "resize", this.OnResizeHanlder);
	}
				
	//Raise event
	this.ExecuteClientEvent("onmaximize");	
};

RadWindowClass.prototype.Close = function(callBackFnArg)
{	
	if(!this.Created || this.Closed) return;	

	RadWindowNamespace.RadUtil_EnableScrolling(true);
	this.SetVisible(false);		
	this.Closed = true;
	
	//Invoke CallBack Function
	//!Be careful with changes. CallBack calls Close again, so this.Closed = true is the only way to stop recursion!
	if (null != callBackFnArg)
	{
		this.CallBack(callBackFnArg);
	}
				
	var oManager = GetRadWindowManager();	
	
	if (this == oManager.GetActiveWindow())
	{	
		oManager.ActiveWindow = null;
	}

	//Raise event
	this.ExecuteClientEvent("onclose");	

	//Return if condition is met!
	if (oManager.SingleNonMinimizedWindow && this.IsMinimizeModeEnabled(RadWindowMinimizeMode.MinimizeZone))
	{
		this.ExecuteServerClientEvent("OnClientClose");//TEKI: Slight code duplication. Quick fix - OnClientClose MUST be called always when closing.		
		this.Argument = null;
		return;
	}
		
	//Set when a (modal) dialog is opened from within another RadWindow!
	if (this.WindowToSetActive)
	{		
		this.WindowToSetActive.SetActive(true);
		this.WindowToSetActive = null;
	}
	else 
	{			
		oManager.FocusNextWindow(this);//true means to use the next window from the history stack if such.
	}			

	//Determine whether to make invisible or destroy	
	if (true == this.DestroyOnClose)
	{	
		oManager.UnregisterWindow(this);
	}
	
	this.ExecuteServerClientEvent("OnClientClose");		
	this.Argument = null;
};

RadWindowClass.prototype.TogglePin = function()
{		
	if(!this.Created) return;

	this.Pinned = !this.Pinned;	
	var pinPos = this.Pinned ? "PinOn" : "PinOff";
	this.private_SetAttribute("TogglePinButton", "title", this.GetLocalizedString(pinPos));
	this.private_SetAttribute("TogglePinButton", "src", this.private_GetImageUrl(pinPos + ".gif"));		
				
	RadWindowNamespace.RadUtil_SetPinned(this.Pinned, this.WrapperElement);
	//Raise event
	this.ExecuteClientEvent("ontogglepin");
};

/*************************************************************************************************************************** 
 *		private Utility methods       
 ****************************************************************************************************************************/
RadWindowClass.prototype.private_SetAttribute = function(id, attribName, attribValue)
{
	var oElem = document.getElementById(id + this.Id);
	
	if (oElem && oElem.setAttribute)
	{	
		oElem.setAttribute(attribName, attribValue, 0);		
	}
};

RadWindowClass.prototype.private_SetSizeValue = function(propName, propValue, setIllegal)
{
	if (null == propValue || "" == propValue) //if setIllegal = false do not set value if it is illegal.
	{
		if (!setIllegal) return;
	}
	else
	{
		//TO DO: Some checks and adjustments to values needed
		this[propName] = propValue;
	}
};

RadWindowClass.prototype.private_GetImageUrl = function(imgName)
{
	return this.SchemeBasePath + "Img/" + imgName;	
};

RadWindowClass.prototype.GetLocalizedString = function(key)
{
	var str = this.Localization[key];
	return str ? str : key;
};

RadWindowClass.prototype.toString = function()
{
	return "object [RadWindow id=" + this.Id + "]";
};

RadWindowClass.prototype.private_SetActiveCssClass = function(toSet)
{
	this.WrapperElement.className = toSet? "RadWWrapperActive" : "RadWWrapperInactive";		
};

/*************************************************************************************************************************** 
 *       Bool API methods for quering state
 ****************************************************************************************************************************/ 
RadWindowClass.prototype.IsMaximized = function()
{
	return this.Maximized;
};

RadWindowClass.prototype.IsMinimized = function()
{
	return this.Minimized;
};

RadWindowClass.prototype.IsModal = function()
{
	return this.Modal;
};
 
RadWindowClass.prototype.IsClosed = function()
{
	return this.Closed;
};

RadWindowClass.prototype.IsPinned = function()
{
	return this.Pinned;
};

RadWindowClass.prototype.IsVisible = function()
{	
	return (this.WrapperElement && this.WrapperElement.style.display != "none");
};

RadWindowClass.prototype.IsActive = function()
{
	try
	{
		var oManager = GetRadWindowManager();
		return (oManager.GetActiveWindow() == this);
	}
	catch(e){}
};

//Checks whether a particular minimize mode is enabled! 
RadWindowClass.prototype.IsMinimizeModeEnabled = function(oMode)
{	
	return oMode & this.MinimizeMode;
};

//Checks whether a particular behavior mode is enabled! 
RadWindowClass.prototype.IsBehaviorEnabled = function(oBehavior)
{
	return oBehavior & this.Behavior ? true : false;
};


/****************************************************************************************************************************
 *													BuildWindowHtml 
 *
 ****************************************************************************************************************************/
RadWindowClass.prototype.private_BuildWindowHtml = function()
{
	var id = this.Id;
	var jsObjId = this.JsName;
	var name = this.Name;
	var url = document.all ? "javascript:'';" : "";		//TEKI - RE5-2838 javascript:'' causes in Moz the Javascript console to appear sometimes	
			
	var html = "";		
	
	//TEMP RETURN
	/*html +=	"<table id='RadWindowWrapperElement" + id + "' class='RadWWrapperActive' style='z-index:" + this.Zindex + ";width:" + this.Width + "px;height:" + this.Height + "px;position:absolute;' cellspacing='0' cellpadding='0'>\n"
		+ "<tr><td>WINDOW</td></tr></table>";		
	return html;
	*/
	html +=	"		<table border=0 id='RadWindowWrapperElement" + id + "' class='RadWWrapperActive' style='display:none;z-index:" + this.Zindex + ";width:" + this.Width + ";height:" + this.Height + ";position:absolute;' cellspacing='0' cellpadding='0'>\n"		
			+ "		  <tbody style='" + (document.all ? "" : "height:100%") + "'>" //TEKI: This setting is crucial for Mozilla and small IFRAME < 100px, has negative effect on IE!
			+ "			<tr class='RadWTitleRow' "
			+ "				style='" + (this.VisibleTitlebar ? "" : "display:none")+ "'>\n"			
			+ "				<td width='1' style='height:3px;' class='RadWWrapperHeaderLeft' nowrap></td>\n"
			+ "				<td valign='top' unselectable='on' grip='true' titleGrip='show' width='100%' style='height:3px;' class='RadWWrapperHeaderCenter' nowrap='true' >\n"
			+ " <div class='RadWHeaderTopResizer'>&nbsp;</div>"	
			+ "		<table border=0 cellspacing='0' cellpadding=0' width='100%' ><tr>"
			+ "<td class='RadWWrapperHeaderCenter'>\n"
			+ "					<img ondblclick='" + jsObjId + ".Close();return RadWindowNamespace.RadUtil_CancelEvent(event);' class='RadWIcon' src='" + this.IconUrl + "' align='absmiddle' border='0'>"
			+ "				</td><td id='RadWindowHeaderRow" + id + "' class='RadWWrapperHeaderCenter' nowrap width='100%'>	<span id='RadWindowTitle" + id + "' unselectable='on' onselectstart='return false;' class='RadWTitleText'>" + this.Title + "</span>\n"
			+ "				</td>";

	
	//Pin	
	if (!this.Modal && this.IsBehaviorEnabled(RadWindowBehavior.Pin))		
	{
		html	+= "		<td width='1' title='" + this.GetLocalizedString("PinOff") + "' class='RadWWrapperHeaderCenter' nowrap>\n"
				+ "<img onmousedown='return RadWindowNamespace.RadUtil_CancelEvent(event);' class='RadWButton' border='0' src='" + this.private_GetImageUrl("PinOff.gif") + "' id='TogglePinButton" + id + "' onclick='" + jsObjId + ".TogglePin();return false;' ondblclick='return RadWindowNamespace.RadUtil_CancelEvent(event);'/>"
				+ "</td>\n";						
	}
	
	//Refresh
	if (this.IsBehaviorEnabled(RadWindowBehavior.Reload))		
	{
		html	+= "		<td width='1' class='RadWWrapperHeaderCenter' nowrap>\n"
				+ "					<img onmousedown='return RadWindowNamespace.RadUtil_CancelEvent(event);'  class='RadWButton' border='0' src='" + this.private_GetImageUrl("Reload.gif") + "' title='" + this.GetLocalizedString("Reload") + "' id='ReloadButton" + id + "' onclick='" + jsObjId + ".Reload();return false;' ondblclick='return RadWindowNamespace.RadUtil_CancelEvent(event);'/>"
				+ "			</td>\n";						
	}
	
	//Minimize
	if (this.IsBehaviorEnabled(RadWindowBehavior.Minimize))		
	{
		html	+= "		<td width='1'  class='RadWWrapperHeaderCenter' nowrap>\n"
				+ "					<img onmousedown='return RadWindowNamespace.RadUtil_CancelEvent(event);' class='RadWButton' border='0' src='" + this.private_GetImageUrl("Minimize.gif") + "' title='" + this.GetLocalizedString("Minimize") + "' id='MinimizeButton" + id + "'  onclick='" + jsObjId + ".Minimize();return false;'/>"
				+ "			</td>\n";						
	}
	
	//Maximize
	if (this.IsBehaviorEnabled(RadWindowBehavior.Maximize))		
	{
		html	+= "		<td width='1' class='RadWWrapperHeaderCenter' nowrap>\n"
				+ "					<img onmousedown='return RadWindowNamespace.RadUtil_CancelEvent(event);' class='RadWButton' border='0' src='" + this.private_GetImageUrl("Maximize.gif") + "' title='" + this.GetLocalizedString("Maximize") + "' id='ToggleMaximizeButton" + id + "' onclick='" + jsObjId + ".ToggleMaximize();return false;'/>"
				+ "			</td>\n";						
	}		

	//Close
	if (this.IsBehaviorEnabled(RadWindowBehavior.Close))		
	{
		html += "			<td width='1' title='" + this.GetLocalizedString("Close") + "' class='RadWWrapperHeaderCenter' nowrap>\n"
			+ "					<img onmousedown='return RadWindowNamespace.RadUtil_CancelEvent(event);' class='RadWButton' border='0' src='" + this.private_GetImageUrl("Close.gif") + "' id='CloseButton" + id + "'  onclick='" + jsObjId + ".Close();return false;'/>\n"
			+ "				</td>\n";
	}		

	
	html +=  "			</tr></table> </td>\n";
	html += "				<td width='1' class='RadWWrapperHeaderRight' nowrap></td>\n"
			+ "			</tr>\n";

	
	//Row 2		
	html += "			<tr height='100%' style='height:100%' >\n"
			+ "				<td align='left' id='RadWindowContentTD" + id + "' colspan='8' style='width:100%;height:100%;'>\n"
			+ "					<table style='border:0px solid red;width:100%;height:100%;' cellspacing='0' cellpadding='0'>\n"
			+ "						<tbody style='height:100%'><tr height='100%' style='height:100%'>"
			+ "							<td rowspan=2 width='1' class='RadWWrapperBodyLeft' nowrap>&nbsp;</td>\n"
			+ "							<td height='100%' style='height:100%' width='100%' class='RadWWrapperBodyCenter' valign='bottom' align='left' onselectstart='return false;'>\n"			
			+ "									<iframe class='RadWContentFrame' name='"+ name +"' frameborder='0' style='border:0px solid green;width:100%;height:100%;' id='RadWindowContentFrame" + id + "' src='" + url + "' border='no'  ></iframe>"												
			
			+ "							</td>"							
			+ "							<td rowspan=2 width='1' class='RadWWrapperBodyRight' nowrap>&nbsp;</td>"
			+ "						</tr>"
			+ "					<tr style='height:1px;'><td class='RadWStatusRow'>" //height=5 is need in IE XHTML mode. DO not delete!
			+ "<div class='RadWStatus' style='"+ (this.VisibleStatusbar ? "" : "display:none") + "'> "			
			+ "					<span class='RadWLoadingWrapper' style='display:none;white-space:nowrap' id='RadWindowLoadingWrapper"+ id + "'>"
			+ "					<img align='absmiddle' src='" + this.private_GetImageUrl("loading.gif") + "' border='0'> " +  this.GetLocalizedString("Loading") + "</span> "
			+ "					<input style='font:icon;border:0px solid red;background-color:transparent;' unselectable='on' type='text' onselect='return false;' onbeforeactivate='return false;' onmousedown='return false;'  id='RadWStatus"+ id + "'/>"			
			+ "			</div></td></tr>"			
			+ "					</tbody></table>"									
			+ "				</td>\n"						
			+ "			</tr>\n";	
			
	//Row 3		
	html	+="			<tr>\n"
			+ "				<td colspan='8' width='100%' height='1'>"	
			+ "					<table border='0' width='100%' height='1' cellspacing='0' cellpadding='0'>\n"			
			+ "						<tr>\n"
			+ "							<td width='1' class='RadWWrapperFooterLeft' nowrap>&nbsp;</td>\n"
			+ "							<td width='100%' class='RadWWrapperFooterCenter' nowrap>&nbsp;</td>		\n"
			+ "							<td width='1' class='RadWWrapperFooterRight' nowrap>&nbsp;</td>\n"
			+ "						</tr>\n"
			+ "					</table>\n"
			+ "				</td>\n"
			+ "			</tr>\n"
			+ "		</tbody></table>\n";											
	return html;
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