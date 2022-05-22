//-------------- Singleton - global modal image ------------------------------//
RadWindowNamespace.GetModalOverlayImage = function()
{
	if (!RadWindowNamespace.ModalImage)
	{	
		var img = document.createElement("IMG");
		img.src = GetRadWindowManager().SchemeBasePath + "Img/transp.gif";						
		img.setAttribute("unselectable", "on");
		img.setAttribute("galleryimg", "no");		
		img.onselectstart = RadWindowNamespace.RadUtil_CancelEvent;		
		img.ondragstart = RadWindowNamespace.RadUtil_CancelEvent;
		img.onmouseover = RadWindowNamespace.RadUtil_CancelEvent;
		img.onmousemove = RadWindowNamespace.RadUtil_CancelEvent;		
		img.onmouseup = RadWindowNamespace.RadUtil_CancelEvent;		
		img.style.position = "absolute";
		img.className = "RadWModalImage";			
		RadWindowNamespace.ModalImage = img; 
	}
	return RadWindowNamespace.ModalImage;		
};

RadWindowNamespace.ShowModalOverlayImage = function()
{	
	function oModalFun()
	{	
		//The event handlers are now always active, so you should take care whether the modal window is the image is visible		        		
		var	_backgroundElement = RadWindowNamespace.GetModalOverlayImage();	
		
		if (_backgroundElement.style.display == "none") return;
		
        var scrollLeft = (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
        var scrollTop = (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);//IE DOCTYPE problem
        
        var clientWidth;
        if (window.innerWidth)
        {
            clientWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);
        }
        else 
        {
            clientWidth = Math.max(document.body.clientWidth, document.documentElement.clientWidth);            
        }
        
        var clientHeight;        
        if (window.innerHeight)
        {			
            clientHeight = Math.max(window.innerHeight, document.documentElement.clientHeight);//Was Math.min but there is problem in Moz!            
        }
        else 
        {                    
			if (document.documentElement.clientHeight > 0) clientHeight = document.documentElement.clientHeight;//IE DOCTYPE problem
			else clientHeight = document.body.clientHeight;            
        }
   
        _backgroundElement.style.left = scrollLeft+'px';
        _backgroundElement.style.top = scrollTop+'px';
        _backgroundElement.style.width = clientWidth+'px';
        _backgroundElement.style.height = clientHeight+'px';      
                               
        //Get active window. If not modal - return. 
        var oWindow = GetRadWindowManager().GetActiveWindow();
        if (!oWindow.IsModal()) return;
        
		//Center only if no top and left are set
        if (!oWindow.Top && !oWindow.Left)
        {
			oWindow.Center();       
		}
	};
	
	//Attach the event-handlers to the BROWSER window
	if (!RadWindowNamespace.AttachedHandlers)
	{
		RadWindowNamespace._resizeHandler = oModalFun;
		RadWindowNamespace._scrollHandler = oModalFun;	
		RadWindowNamespace.RadUtil_AttachEventEx(window, "resize", RadWindowNamespace._resizeHandler);
		RadWindowNamespace.RadUtil_AttachEventEx(window, "scroll", RadWindowNamespace._scrollHandler);
		RadWindowNamespace.AttachedHandlers = true;
	}

	//Get the active window
    var oWnd = GetRadWindowManager().GetActiveWindow();

	var moveableObject = oWnd.WrapperElement;	
	var overlayImage = RadWindowNamespace.GetModalOverlayImage();	
								
	//Set zIndex just as big as the one of the moved object!
	if (moveableObject && moveableObject.style.zIndex)
	{									
		if (null != document.readyState && "complete" != document.readyState)
		{
			return;//!
		}
		else
		{			
			if (overlayImage.parentNode != document.body) document.body.appendChild(overlayImage);
						
			var zIndex = parseInt(moveableObject.style.zIndex) + 1;				
			overlayImage.style.display = "";								
												
			window.setTimeout(function()
			{	
				if (!oWnd.IsActive()) return;//Here prevent the window from becoming on top if it is not the active one anymore.
							
				//Here we call the same code again							
				overlayImage.style.zIndex = "" + (zIndex  + (document.all ? 0 : -3));//Mozilla and Netscape would put the image infront of the window!
				moveableObject.style.zIndex = "" + zIndex;
				
				//There can be scenarios where this si called after a window is closed. So check if the window exists.
				if (oWnd && oWnd.WrapperElement) 
				{
					//Force show! sometimes we have problems with zIndex otherwise
					oWnd.WrapperElement.Show();					
				}							
			}, 100);
		}
	}
	
	//Call the resize function
	RadWindowNamespace._resizeHandler();
};

RadWindowNamespace.HideModalOverlayImage = function()
{		
	if (RadWindowNamespace.ModalImage) this.ModalImage.style.display = "none";
	//TODO: This code should be called on page unload	
	//RadWindowNamespace.RadUtil_DetachEventEx(window, "resize", this._resizeHandler);
	//RadWindowNamespace.RadUtil_DetachEventEx(window, "scroll", this._scrollHandler);
	//this.ModalImage.className = "";//Eliminate class with filter!
	//this.ModalImage = null;	
};


//----------------------------------------------------------------------------------//

/* This is an independent object that is activated when the window is set to be modal.
It takes care of implemeting the modality functionality on the activate & deactivate event.
It is being created (on demand) by the RadWindowObject when its SetCapture method is called */
RadWindowNamespace.RadWindowModal = function(oWindow)
{
	this.Window = oWindow;							 	
	var oThis = this;
	
				
	var oFunActivate = function()
	{			
		oThis.SetActiveProtected(true);
	};
	oWindow.AttachClientEvent("onactivate", oFunActivate);
	oWindow.AttachClientEvent("onrestore", oFunActivate);	
	
	var oFun = function()
	{	
		oThis.SetActiveProtected(false);
	};	
	oWindow.AttachClientEvent("onclose", oFun);	
	oWindow.AttachClientEvent("onminimize", oFun);		
	
	//Override this method!
	oWindow.private_SetActiveCssClass = function(toSet)
	{
		oWindow.WrapperElement.className = toSet ? "RadWWrapperModal" : "RadWWrapperInactive";		
	};
	
	/**
	 * keep here the state of the input elements that will be disabled
	 * when the modal dialog is displayed
	 *
	 *  this is an array of hash-es:
	 *
	 *  [
			{
				inputElement : theDomElement,
				isDisabled   : true/false
			},
			{
				inputElement : theDomElement,
				isDisabled   : true/false
			}, 
			...
	    ]
	 *
	*/ 
	this.InputElementsState = [];
};

RadWindowNamespace.RadWindowModal.prototype.Dispose = function()
{
	this.Window = null;		
	this.InputElementsState = null;		
};


//Makes the window modal or not
RadWindowNamespace.RadWindowModal.prototype.SetActiveProtected = function(toSet)
{	
	var oManager = this.Window.GetWindowManager();
		
	if (toSet && !this.Window.Closed)
	{		
		//If minimized, but not in a minimized zone return without doing anything.
		if (this.Window.Minimized && !this.Window.IsMinimizeModeEnabled(RadWindowMinimizeMode.MinimizeZone))
		{
			return;
		}
			
		RadWindowNamespace.ShowModalOverlayImage(this.Window);
		
		this.DisableInputElements();
		
		//Add a shortcut to radwindow manager to disable TAB browsing		
		if (oManager && oManager.AddShortcut)		
		{			
			oManager.DisableTabKey = function(){};
			oManager.AddShortcut("DisableTabKey", "TAB");
		}
	}
	else
	{		
		//Remove shortcut to radwindow manager to disable TAB browsing		
		if (oManager && oManager.AddShortcut)		
		{			
			oManager.DisableTabKey = null;
			oManager.RemoveShortcut("DisableTabKey");
		}
				
		RadWindowNamespace.HideModalOverlayImage();
		
		this.RestoreInputElementsState();			
	}
};

RadWindowNamespace.RadWindowModal.prototype.DisableInputElements = function()
{
	if (this.Window.IsIE && !this.DisabledDrodpowns) 
	{
		this.InputElementsState = [];
		var lists = document.getElementsByTagName("SELECT");
		for (var i=0; i < lists.length; i++)
		{		
			this.InputElementsState[i] = {
				inputElement : lists[i],
				isDisabled : lists[i].disabled
			}

			lists[i].setAttribute ("disabled", "true");
		}
		
		this.DisabledDrodpowns = true;
	}
};

RadWindowNamespace.RadWindowModal.prototype.RestoreInputElementsState = function()
{
	if (this.Window.IsIE) 
	{
		this.DisabledDrodpowns = false;
		for (var i=0; i < this.InputElementsState.length; i++)
		{
			var _o = this.InputElementsState[i];		
			_o.inputElement.setAttribute("disabled", _o.isDisabled);
		}
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