/*********************************************************************
*
*	RadWindowManagerClass
* 
*********************************************************************/
function RadWindowManagerInitialize(id, appPath, schemeBasePath, language, useClassicWindows, clientCallBackFunction, oSingleNonMinimizedWindow,
							oPreserveClientState, oShortcutArray, onClientShow, onClientClose, onClientPageLoad,
							iconUrl, minimizeIconUrl, oWidth, oHeight, oLeft, oTop, oTitle, minimizeZoneId,
							oInitialBehavior, oBehavior, oMinimizeMode, oModal, visibleStatusbar, visibleTitlebar,
							visibleOnPageLoad, offsetElementId, openerElementId, destroyOnClose,
							overlay, enableStandardPopups, reloadOnShow, showContentDuringLoad							
							)
{	
	var existingWindows = null;
	
	if(RadWindowNamespace.WindowManager)
	{	
		//NEWCALLBACK
		if(RadWindowNamespace.WindowManager.Id == id)
		{			
			var oWnds = RadWindowNamespace.WindowManager.Windows;
			for (var i=0; i < oWnds.length; i++)
			{
				oWnds[i].Dispose();
			}		
		}
		else
		{
			existingWindows = RadWindowNamespace.WindowManager.Windows;			
		}
				
		RadWindowNamespace.WindowManager.Windows = null;
		RadWindowNamespace.WindowManager = null;
	}
	
	var oManager = GetRadWindowManager();		
	
	//MORE THAN 1 WINDOW MANAGER DECLARED ON PAGE. Move all windows from thsi manager to new manager
	if (existingWindows) oManager.Windows = existingWindows;
		
	oManager.Id = id;	
	oManager.InitializePage(schemeBasePath + "Img/transp.gif");	
	oManager.ApplicationPath = appPath;		
	oManager.SchemeBasePath = schemeBasePath;		
	oManager.SingleNonMinimizedWindow = oSingleNonMinimizedWindow;
	oManager.UseClassicWindows = useClassicWindows;			
	oManager.Localization = eval("localization_" + (language ? language : "en_US"));//Language		
	oManager.UseOverlay = overlay;	
	oManager.EnableStandardPopups = enableStandardPopups;		
	oManager.PreserveClientState = (oPreserveClientState == true);//NEW
	
	//Dispose functionality
	RadWindowNamespace.RadUtil_AttachEventEx(window, "unload", oManager.RadWindowManagerDispose);	   
	
	//AutoSave - preserve client window state in a cookie		
	if(oManager.PreserveClientState)
	{
		RadWindowNamespace.RadUtil_AttachEventEx(window, "load", RadWindowNamespace.RadWindowStateManager.RestoreState);
	}
	
	//Create browser commands such as alert, open, prompt, confirm		
	oManager.CreateBrowserCommands();	
							
	//KeyboardManager could be missing - for size optimization (file can be phisycally missing!
	if (oManager.EnableShortcuts)
	{
		//Defined in RadWindowKeyboardManager.js
		oManager.EnableShortcuts(oShortcutArray);
	}												
						
	//Create a DefaultWindow template for all new windows to be "cloned" from
	var oWindow = new RadWindowClass("");	
	oWindow.Events = [];
	oWindow.SchemeBasePath = schemeBasePath;

	//Attach client event handlers
	if (onClientShow) oWindow["OnClientShow"] = onClientShow;
	if (onClientClose) oWindow["OnClientClose"] = onClientClose;
	if (onClientPageLoad) oWindow["OnClientPageLoad"] = onClientPageLoad;				
	
	oWindow.ClientCallBackFunction = clientCallBackFunction;	
	oWindow.IconUrl  = iconUrl ? iconUrl : schemeBasePath + "Img/defaultIcon.gif";		
	oWindow.MinimizeIconUrl = minimizeIconUrl ? minimizeIconUrl : oWindow.IconUrl;		
	oWindow.Width = oWidth ? oWidth : "500px";	 
	oWindow.Height = oHeight ? oHeight : "200px";
	oWindow.private_SetSizeValue("Left", oLeft, false);
	oWindow.private_SetSizeValue("Top" , oTop, false);								
	oWindow.Title = oTitle;
	oWindow.MinimizeZoneId = minimizeZoneId;
	oWindow.InitialBehavior = oInitialBehavior;
	oWindow.Behavior = oBehavior;
	oWindow.MinimizeMode = oMinimizeMode;	
	oWindow.VisibleStatusbar = visibleStatusbar;
	oWindow.VisibleTitlebar = visibleTitlebar;			
	oWindow.VisibleOnPageLoad = visibleOnPageLoad;
	oWindow.Modal = oModal;
	oWindow.Localization = oManager.Localization;	
	oWindow.OffsetElementId = offsetElementId;		
	oWindow.OpenerElementId = openerElementId;		
	oWindow.DestroyOnClose = destroyOnClose;	
	oWindow.ReloadOnShow = reloadOnShow;	
	oWindow.UseOverlay = oManager.UseOverlay;
	oWindow.ShowContentDuringLoad  = showContentDuringLoad;
	oManager.DefaultWindow = oWindow;			
}

RadWindowNamespace.WindowManager = null;

function GetRadWindowManager()
{
	if (null == RadWindowNamespace.WindowManager)
	{
		RadWindowNamespace.WindowManager = new RadWindowManagerClass();
	}
	return RadWindowNamespace.WindowManager;
}

function RadWindowManagerClass()
{
	this.Windows = [];	
	this.HistoryStack = [];
	this.ParentWindows = {};
	this.PageInitilized = false;
	this.Zindex = 3000;	
	this.JavascriptObjectId = "radWindow_";//Needed because we have iframe name=id and under IE it is confused - when id.MethodCall() is called, it calls the iframe, an not the js object!
	this.ActiveWindow = null;
	this.SingleNonMinimizedWindow = false;
	this.SchemeBasePath = null;	
	this.UseOverlay = true;				
}

RadWindowManagerClass.prototype.CreateSplash = function(oWidth, oHeight)
{
	this.SplashWidth = oWidth ? oWidth : this.DefaultWindow.Width;
	this.SplashHeight = oHeight ? oHeight : this.DefaultWindow.Height;
	this.ShowSplash();	
};

RadWindowManagerClass.prototype.ShowSplash = function(setVisible)
{	
	var oManager = this;			
	var oContent = oManager.GetSplashTemplate(oManager.DefaultWindow);
	var oHolder = document.getElementById("RadWSplashHolder");	
	
	oHolder.style.position = "absolute";
	oHolder.style.zIndex = "" + 5000;	
	oHolder.innerHTML = oContent;
	
	if (false == setVisible)
	{
		oHolder.style.display = "none";
	}
	else
	{
		oHolder.style.display = "";
				
		var oBody = document.body;
		oBody.insertBefore(oHolder, oBody.firstChild);//You can do it in IE, but you cannot do oBody.appendChild(oHolder); before page has fully loaded.
				
		var oWidth = this.SplashWidth;
		var oHeight = this.SplashHeight;
		
		//Use CSS to center the Splash
		var oCenter = function()
		{				
			var oRect = RadWindowNamespace.RadGetElementRect(oHolder);					
			var oScreen = RadWindowNamespace.RadUtil_GetBrowserRect();			
			var leftPerc = 50 - Math.floor((parseInt(oWidth)*100/oScreen.width)/2);
			var topPerc = 50 - Math.ceil( (parseInt(oHeight)*100/oScreen.height)/2 );
			oHolder.style.left = leftPerc + "%";
			oHolder.style.top = topPerc + "%";  
		};		
			
		oCenter();
		
		//Attach event handlers just once!
		if (!this.SplashInitialized)
		{
			this.SplashInitialized = true;
			RadWindowNamespace.RadUtil_AttachEventEx(window, "resize", oCenter);
			RadWindowNamespace.RadUtil_AttachEventEx(window, "scroll", oCenter);
						
			RadWindowNamespace.RadUtil_AttachEventEx(window, "load", function()
				{ 		
					window.setTimeout(function(){oHolder.innerHTML='';}, 200);
				}
			);	
		}
	}	
	return oHolder;	
};


RadWindowManagerClass.prototype.RadWindowManagerDispose = function()
{	
	var oManager = GetRadWindowManager();	

	//Save state
	if (oManager.PreserveClientState && RadWindowNamespace.RadWindowStateManager)
	{	
		RadWindowNamespace.RadWindowStateManager.SaveState();
	}
	
	//Dispose
	try //in case multiple managers are instantiated this will throw
	{
		oManager.ExecuteAll("Dispose");	
	}
	catch (e){}
	oManager.Windows = null;	
	oManager.HistoryStack = null;
	oManager.ParentWindows = null;	
	oManager.ActiveWindow = null;		
};

RadWindowManagerClass.prototype.InitializePage = function(overlayImageUrl)
{
	if (this.PageInitilized) return;		
	if (overlayImageUrl)
	{		
		var overlayImage = RadWindowNamespace.GetOverlayImage();/* If called on pre-load cause abort page exception in IE, so RadGetOverlayImage must be modified*/
		
		if (overlayImage)
		{
			overlayImage.src = overlayImageUrl;
		}
	}		
	this.PageInitilized = true;
};

RadWindowManagerClass.prototype.Open = function(url, wndName)
{
	var oManager = this;
	var oWnd = oManager.GetWindowByName(wndName);		
	if (!oWnd)
	{		
		oWnd = oManager.CreateWindowObject(wndName);	
	}	
	
	if (oManager.UseClassicWindows) //Shows a null page for a short while, then loads the page
	{	
		oWnd.Show(url);	
	}
	else
	{	
		oWnd.Show();		
		if (url) oWnd.SetUrl(url);
	}
	return oWnd;
};

RadWindowManagerClass.prototype.CreateWindowObject = function(id)//addToArray - optional
{	
	var zIndex = this.GetNewZidex(); 
	if (!id) id = "RadWindowClass" + zIndex;

	var newWnd = new RadWindowClass(id);	
	newWnd.Zindex = zIndex; 
		
	//Register it in the array	
	this.Windows[this.Windows.length] = newWnd;
		
	var windowJsName = this.JavascriptObjectId + newWnd.Id;
	
	//Create a global variable in the window object pointing to the rad window
	eval("window." + windowJsName + " = newWnd");
	
	var oDefault = this.DefaultWindow;	
	if (oDefault)
	{		
		for (var item in oDefault)
		{
			 if ("function" != typeof(oDefault[item])) newWnd[item] = oDefault[item];
		}		
	}
	
	if (this.UseClassicWindows)
	{		
		//Configure window to use the classic window methods
		Object.Extend(newWnd, RadWindowNamespace.RadWindowClassic);		
	}
	
	newWnd.Id = id;
	newWnd.Name = id;
	newWnd.JsName = windowJsName;
	newWnd.Events = [];		
	return newWnd;
};

RadWindowManagerClass.prototype.GetNewZidex = function()
{	
	var oZindex = this.Zindex;
	var oArr = this.Windows;
	var oLen = oArr.length;
	for (var i=0; i < oLen; i++)
	{
		oWnd = oArr[i];
		if (oWnd.WrapperElement && oWnd.WrapperElement.style.zIndex > oZindex)
		{
			oZindex = oWnd.WrapperElement.style.zIndex;
		}
	}
	oWnd = null;		
	return (this.Zindex = ++oZindex);
};

RadWindowManagerClass.prototype.CreateStandardPopup = function(dlgName, text)
{		
	var oWnd = this.CreateWindowObject(dlgName);
	oWnd.Behavior = RadWindowBehavior.Close + RadWindowBehavior.Move;
	oWnd.InitialBehavior = RadWindowBehavior.None;	
	oWnd.MinimizeMode = RadWindowClass.prototype.MinimizeMode;			
	oWnd.MinimizeZoneId = "";
	oWnd.OffsetElementId = "";	
	oWnd.OpenerElementId = "";	
	oWnd.VisibleStatusbar = false;		
	oWnd.DestroyOnClose = true;//!

	oWnd.Create();	
	oWnd.SetTitle(oWnd.GetLocalizedString(dlgName));
	oWnd.SetModal(true);			
						
	var oArgs = {Text: text};
	var oContent = this.private_GetTemplate(dlgName + "Template", this.DefaultWindow, oArgs);				
	if (oContent)
	{
		oWnd.SetContent(oContent);
	}		
	return oWnd;
};

RadWindowManagerClass.prototype.GetSplashTemplate = function(radWindow)
{
	return this.private_GetTemplate("SplashTemplate", radWindow);		
};

RadWindowManagerClass.prototype.GetMinimizeTemplate = function(radWindow)
{
	return this.private_GetTemplate("MinimizeTemplate", radWindow);		
};

RadWindowManagerClass.prototype.private_GetTemplate = function(templateName, radWindow, oArgs)
{
	var oHolder = document.getElementById("RadWindowManager" + templateName);	
	var decoded = RadWindowNamespace.RadUtil_EncodeContent(oHolder.value, false);	
	
	decoded = RadWindowNamespace.RadUtil_Format(RadWindowNamespace.RadUtil_Trim(decoded),//Replace {0}, {1}
					radWindow.Id,
					radWindow.JsName,
					this.SchemeBasePath,
					radWindow.MinimizeIconUrl, 
					radWindow.Title,
					"",//this.ApplicationPath, //TO DO: Some problem - starts flickering. Not clear why! Must be researched.
					oArgs ? oArgs.Text : ""
				);					
	return decoded;
};


/* ******************************************************************************************************
 *											helper commands (private)
 *******************************************************************************************************/
RadWindowManagerClass.prototype.private_GetWindowsSortedByZindex = function()
{
	var oArray = this.Windows.concat([]);//Clone the original array
	var oSortFun = function (oWin1, oWin2)
	{	  	  
	    if (oWin1.Zindex == oWin1.Zindex) return 0;		
		return (oWin1.Zindex < oWin1.Zindex ? -1 : 1);				
	};	
	return oArray.sort(oSortFun);
};

RadWindowManagerClass.prototype.private_RemoveArrayMember = function(oArray, oMember)
{
	if (!oArray || oArray.length < 1) return;
	for (var i=0; i< oArray.length; i++)
	{
		if (oArray[i] == oMember)
		{		
			oArray.splice(i, 1);//Remove 1 at position index
			return;
		}
	}	
};


RadWindowManagerClass.prototype.private_AddArrayMember = function(oArray, oMember)
{
	if (!oArray) return;
	oArray[oArray.length] = oMember;	
};

/*********************************************************************
*
*	Public API or methods called by RadWindowClass
* 
*********************************************************************/
RadWindowManagerClass.prototype.GetActiveWindow = function()
{
	return this.ActiveWindow;	
};

RadWindowManagerClass.prototype.SetActiveWindow = function(radWindow)
{	
	var activeWindow = this.ActiveWindow;		
		
	//Set this.ActiveWindow here - because in SetActive(false) it checks whether the current window is the active, and it should not be
	this.ActiveWindow = radWindow;
		
	if (activeWindow && activeWindow != radWindow)
	{
		activeWindow.SetActiveProtected(false);			
	}	

	//Do not call SetActive(true) it calls SetActiveWindow back...and we have a stack overflow, call SetActiveProtected instead
	this.ActiveWindow.SetActiveProtected(true);	
		
	//Minimize the inactive windows
	if (this.SingleNonMinimizedWindow)
	{
		this.MinimizeInactiveWindows();
	}
	
	//Add the window to the stack
	this.private_RemoveArrayMember(this.HistoryStack, this.ActiveWindow);
	this.private_AddArrayMember(this.HistoryStack, this.ActiveWindow);		
};


RadWindowManagerClass.prototype.FocusNextWindow = function(currentWin)
{
	//Factored out code activation code
	var activateWindow = function(nextWnd, oManager)
	{	
		if (nextWnd && nextWnd.Created && !nextWnd.IsClosed() && (!nextWnd.IsMinimized() || oManager.SingleNonMinimizedWindow))
		{
			nextWnd.SetActive(true);
			return true;
		}
		return false;
	};
	
	//Focus previous window from the history stack
	if (null != currentWin)
	{
		//Remove this window from the history stack
		this.private_RemoveArrayMember(this.HistoryStack, currentWin);
		
		//Activate the last member in the stack
		var nextWnd = this.HistoryStack.length > 0 ? this.HistoryStack[this.HistoryStack.length - 1] : null;
		
		if (nextWnd)
		{			
		  var result = activateWindow(nextWnd, this);	
		  if (result) return;
		}		
	}

	//else if no window was activated above use  heuristics to find the next focusable window.
	var oWnd = this.ActiveWindow;	
	var oArray = this.Windows.concat([]);
	if (!oWnd)
	{
		activateWindow(oArray[0], this);	
	}
	else
	{					
		var oWndPos = 0;
		var bWindowFound = false;
		var i=0;
		for (; i < oArray.length; i++)
		{
			if (oWnd == oArray[i])
			{
				oWndPos = i;				
				bWindowFound = true;
				break;
			}
		}
				
		if (bWindowFound) //If such a window exists, find a visible window to focus on!
		{				
			var oFocusFunction = function(startPos, endPos, oManager)
			{			
				for (var counter = startPos; counter < endPos; counter++)
				{				
					var result = activateWindow(oArray[counter], oManager);						
					if (result) return true;					
				}	
			};			
			
			var oFound = oFocusFunction(i+1, oArray.length, this);			
			if (!oFound) oFocusFunction(0, oWndPos, this);		
		}		
	}
};

RadWindowManagerClass.prototype.UnregisterWindow = function(oWnd)
{		
	if (!oWnd) return;	
	this.private_RemoveArrayMember(this.Windows, oWnd);	
	this.private_RemoveArrayMember(this.HistoryStack, oWnd);	
	if (oWnd.Dispose) oWnd.Dispose();
	if (oWnd == this.ActiveWindow) this.ActiveWindow = null;	
};

RadWindowManagerClass.prototype.GetWindowById = function(id)
{
	var oArr = this.Windows;
	for (var i=0; i < oArr.length; i++)
	{
		var oWnd = oArr[i];
		if (name == oWnd.Id)
		{
			 if (!oWnd.Created) oWnd.Create();//Otherwise it was throwing errors when you try to use its methods!
			 return oWnd;
		}
	}	
	return null;	
};

RadWindowManagerClass.prototype.GetWindowByName = function(name)
{	
	var oArr = this.Windows;
	for (var i=0; i < oArr.length; i++)
	{	
		var oWnd = oArr[i];
		if (name == oWnd.Name)
		{
			 if (!oWnd.Created) oWnd.Create();
			 return oWnd;
		}
	}	
	return null;	
};

RadWindowManagerClass.prototype.GetWindowObjects = function()
{		
	return this.Windows;
};

//Duplicate to the previous function, but more user-friendly name.
RadWindowManagerClass.prototype.GetWindows = function()
{		
	return this.Windows;
};

RadWindowManagerClass.prototype.Cascade = function()
{
	var oTop = 40;
	var oLeft = 40;
	
	var oArray = this.private_GetWindowsSortedByZindex();
	
	for (var i=0; i<oArray.length; i++)	
	{
		var oWnd = oArray[i];
		if (!oWnd.Closed && oWnd.Created) 
		{			
			var oRet = oWnd.Restore();				
			oWnd.MoveTo(oTop, oLeft);		 
			RadWindowNamespace.RadUtil_SetOnTop(oWnd.WrapperElement);//Set on top!
			oTop += 25;
			oLeft += 25;
		}
	};	
};


RadWindowManagerClass.prototype.Tile = function()
{					
	var oArray = this.private_GetWindowsSortedByZindex();	
	//Heuristic - let's say we have a maximum of 5 columns. 
	//Calculate the smallest number of rows that you need to fit the windows
	var oLen = 0;
	//Only the visible windows should be used
	for (var i=0; i < oArray.length; i++)
	{
		var oWin = oArray[i];
		
		if (!oWin.Closed && oWin.Created) 
		{
			oLen++;
		}
	}
	
	var oMaxCols = 5;	
	var oCols = 0;
	var oRows = 1;
		
	if (oLen <= oMaxCols)
	{
		 oCols = oLen;
	}
	else
	{
		var i = 2;					
		//Try to get a heuristic by multiplying the (oLength * i) > (oMaxCols i-1)
		while ((oLen * i) < (oMaxCols * (i+1)))
		{
			i++;			
			if (i > 6) break;//In case something goes wrong
		}
		oRows = i;	
		//Calculate cols
		oCols = Math.ceil(oLen / oRows);
	}
	
	var oScreen = RadWindowNamespace.RadUtil_GetBrowserRect();
	
	//See to what two-dimentional grid it correspends
	var oWinWidth  = Math.floor(oScreen.width / oCols);
	var oWinHeight = Math.floor(oScreen.height / oRows);
	
	var left = RadWindowNamespace.RadGetScrollLeft(document);
	var top  = RadWindowNamespace.RadGetScrollTop(document);
	
	var tiledWindowCount = 0;			
	for (var i = 0; i < oArray.length; i++)
	{	
		var oWin = oArray[i];				
		if (!oWin.Closed && oWin.Created) 
		{	
			tiledWindowCount++;
			if ( (tiledWindowCount-1) % (oCols) == 0 && tiledWindowCount > oCols)
			{
				top += oWinHeight;
				left = RadWindowNamespace.RadGetScrollLeft(document);			 
			}		
				
			oWin.Restore();		
			oWin.MoveTo(left, top);
			oWin.SetSize(oWinWidth, oWinHeight);		
			left += oWinWidth;
		}
	}
};

/* ******************************************************************************************************
 *											Group commands
 *******************************************************************************************************/
RadWindowManagerClass.prototype.Fire = function(cmdName)//called by shortcut manager
{
	if (this[cmdName] && "function" == typeof(this[cmdName]))
	{
		this[cmdName]();
	}
};

RadWindowManagerClass.prototype.MinimizeInactiveWindows = function()
{
	var activeWnd = this.ActiveWindow;	
	var theArray = this.Windows;
	var oLength = theArray.length;		
	for (var i=0; i < oLength; i++)
	{	
		var oWin = theArray[i];
		if (oWin != activeWnd) oWin.Minimize();		
		//else oWin.Restore();
	}		
};

//ESC pressed
RadWindowManagerClass.prototype.EscapeActiveWindow = function()
{	
	var oWnd = this.GetActiveWindow();	
	if (oWnd)
	{
		var oWrapper = oWnd.WrapperElement;		
		if (oWrapper.IsMoving() || oWrapper.IsResizing())
		{
			oWrapper.CancelDrag();
		}
		else
		{
			oWnd.Close();
		}
	}
};


RadWindowManagerClass.prototype.ExecuteActiveWindow = function(cmdName)
{		
	if (this.ActiveWindow && "function" == typeof(this.ActiveWindow[cmdName]))
	{		
		this.ActiveWindow[cmdName]();
	}
};

RadWindowManagerClass.prototype.CloseActiveWindow = function()
{
	this.ExecuteActiveWindow("Close");
};

RadWindowManagerClass.prototype.MinimizeActiveWindow = function()
{
	this.ExecuteActiveWindow("Minimize");
};

RadWindowManagerClass.prototype.RestoreActiveWindow = function()
{
	this.ExecuteActiveWindow("Restore");
};

RadWindowManagerClass.prototype.ToggleMaximizeActiveWindow = function()
{
	this.ExecuteActiveWindow("ToggleMaximize");
};

RadWindowManagerClass.prototype.CloseAll = function()
{
	this.ExecuteAll("Close");	
};

RadWindowManagerClass.prototype.ShowAll = function()
{
	this.ExecuteAll("Show");
};

RadWindowManagerClass.prototype.MinimizeAll = function()
{
	this.ExecuteAll("Minimize");
};

RadWindowManagerClass.prototype.MaximizeAll = function()
{
	this.ExecuteAll("Maximize");
};

RadWindowManagerClass.prototype.RestoreAll = function()
{
	this.ExecuteAll("Restore");
};

RadWindowManagerClass.prototype.ExecuteAll = function(fnName)
{	
	if (!this.Windows) return;
	
	var oArray = this.Windows.concat([]);
	for (var i=0; i<oArray.length; i++)	
	{
		oArray[i][fnName]();
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