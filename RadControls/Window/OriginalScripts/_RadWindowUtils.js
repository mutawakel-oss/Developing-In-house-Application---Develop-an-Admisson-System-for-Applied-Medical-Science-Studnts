if ("undefined" == typeof(RadWindowNamespace))
{
	RadWindowNamespace = new Object();
}

Object.Extend = function(object, extender)
{
	for (var prop in extender)
	{
		object[prop] = extender[prop];
	}
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

//A generic function that adds a <link>stylesheet to the head of the document. Used in RadEditor, RadEditorPopup, in EditorHtmlBackbone as well 
/*
function RadUtil_AddStyleSheet(sStyleSheetUrl, oDocument)
{		
	var theDoc = oDocument != null ? oDocument : document;
	
	var oLink = theDoc.createElement("link");
	oLink = oLink.cloneNode(true);
	oLink.setAttribute("href", sStyleSheetUrl, 0);		
	oLink.setAttribute("type", "text/css");
	oLink.setAttribute("rel", "stylesheet", 0);	
	var oHead = theDoc.getElementsByTagName("head")[0];	//SAFARI HEAD expects small caps
	
	if (RadWindowNamespace.RadUtil_DetectBrowser ("safari")) //SAFARI has problems with the direct addition!
	{
		var addSheet = function() {oHead.appendChild(oLink);}
		window.setTimeout (addSheet, 200);
	}
	else
	{
		oHead.appendChild(oLink);
	}		
}*/

 RadWindowNamespace.RadUtil_Trim = function(str)
 {
 	return str.replace(/^\s{1,}/ig, "").replace(/\s{1,}$/ig, "");
 };


 RadWindowNamespace.RadUtil_Format = function (text)
 {
    for (var i = 1; i < arguments.length; i++)
    {
        text = text.replace(new RegExp("\\{" + (i - 1) + "\\}", "ig"), arguments[i]);
    }
    
    return text;
 };
 
RadWindowNamespace.RadUtil_EncodeContent = function (content, toEncode)
{	
	var characters = new Array('%', '<', '>', '!', '"', '#', '$', '&', '\'', '(', ')', ',', ':', ';', '=', '?',
								'[', '\\', ']', '^', '`', '{', '|', '}', '~', '+');	
	var newContent = content;
	if (toEncode)
	{		
		for (var i=0; i<characters.length; i++)
		{
			newContent = newContent.replace(new RegExp("\\x" + characters[i].charCodeAt(0).toString(16), "ig"), '%' + characters[i].charCodeAt(0).toString(16));
		}
	}
	else
	{
		for (var i = characters.length - 1; i>=0; i--)
		{
			newContent = newContent.replace(new RegExp('\%' + characters[i].charCodeAt(0).toString(16), "ig"), characters[i]);
		}
	}	
	return newContent;
};

/*------------------ Pin functionality--------------------------*/
RadWindowNamespace.RadUtil_PinnedList = {};

RadWindowNamespace.RadUtil_SetPinned = function (toDock, oWrapper)
{
	if (toDock)
	{		
		oWrapper.TopOffset = parseInt(oWrapper.style.top) - RadWindowNamespace.RadGetScrollTop(document);				
		oWrapper.LeftOffset = parseInt(oWrapper.style.left) - RadWindowNamespace.RadGetScrollLeft(document);				
		var intervalId = window.setInterval(function(){RadWindowNamespace.RadUtil_UpdatePinnedElementPosition(oWrapper); }, 100);
		RadWindowNamespace.RadUtil_PinnedList[intervalId] = oWrapper;
	}
	else
	{		
		var interval = null;
		var oList = RadWindowNamespace.RadUtil_PinnedList;
		for (var name in oList)
		{
			if (oList[name] == oWrapper)
			{
				interval  = name;
				break;
			}
		}		
		if (null != interval)
		{
			window.clearInterval(interval);
			RadWindowNamespace.RadUtil_PinnedList[interval] = null;	
		}		
		oWrapper.TopOffset = null;	
		oWrapper.LeftOffset = null;
	}
}

RadWindowNamespace.RadUtil_UpdatePinnedElementPosition = function (oWrapper)
{	
	var left = (oWrapper.LeftOffset != null)? oWrapper.LeftOffset + RadWindowNamespace.RadGetScrollLeft(document) : parseInt(oWrapper.style.left);		
	var top = (oWrapper.TopOffset != null)? oWrapper.TopOffset + RadWindowNamespace.RadGetScrollTop(document) : parseInt(oWrapper.style.top);		
	if (oWrapper.MoveTo) oWrapper.MoveTo(left, top);	
};
/*------------------ /Pin functionality--------------------------*/

//Used by both RadWindowClass and RadMinimize and RadWindowManagerClass
RadWindowNamespace.RadUtil_SetOnTop = function (moveableElement)
{
	var oManager = GetRadWindowManager();			
	var curIndex = oManager.GetNewZidex(); 				
	if (moveableElement.Overlay && moveableElement.Overlay.style)
	{
		moveableElement.Overlay.style.zIndex = curIndex;//!Set the same zIndex to the overlay!
	}
	moveableElement.style.zIndex = curIndex;	
};


RadWindowNamespace.RadUtil_EnableScrolling = function(enable, overflow)
{
	if (enable)
	{	
		document.body.style.overflow = overflow ? overflow : '';
		document.documentElement.style.overflow = overflow ? overflow : '';
	}
	else
	{		
		document.body.style.overflow = 'hidden';
		document.documentElement.style.overflow = 'hidden';
	}
};

// Used in Overlay image when moving a window
RadWindowNamespace.RadUtil_GetBrowserInnerRect = function(oWindow)
{
	if (!oWindow) oWindow = window;
	var oDoc = oWindow.document;
	var rect = {};
	if (document.all) 
	{		
		// IE Strict Mode
		if (document.documentElement && document.documentElement.clientHeight)
		{
			rect.width = oDoc.documentElement.clientWidth;
			rect.height = oDoc.documentElement.clientHeight;
		}
		else
		{
			rect.width = oDoc.body.clientWidth;
			rect.height = oDoc.body.clientHeight;
		}
	} else {
		rect.width = window.innerWidth ? parseInt(oWindow.innerWidth) : parseInt(oDoc.body.clientWidth);		
		rect.height = window.innerHeight ? parseInt(oWindow.innerHeight): parseInt(oDoc.body.clientHeight);
	}

	return rect;
}

RadWindowNamespace.RadUtil_GetBrowserRect = function(oWindow)
{			
	if (!oWindow) oWindow = window;
	oDoc = oWindow.document;
	
    var rect = {};
	if (oDoc.all && "CSS1Compat" == oDoc.compatMode && !oWindow.opera)//!OPERA
	{

		rect.width = oDoc.documentElement.clientWidth;
		rect.height = oDoc.documentElement.clientHeight;			
	}
	else
	{		

		rect.width = window.innerWidth  ? parseInt(oWindow.innerWidth) : parseInt(oDoc.body.clientWidth);		
		rect.height = window.innerHeight? parseInt(oWindow.innerHeight): parseInt(oDoc.body.clientHeight);
	}	
	//When the document is scrolled these values must be calculated
	rect.top = RadWindowNamespace.RadGetScrollTop(oDoc);	
	rect.left = RadWindowNamespace.RadGetScrollLeft(oDoc);	
	return rect;
};

/*------------------------------------------------- Utility methods -------------------------------------------------*/
RadWindowNamespace.RadGetScrollTop = function(oDocument)
{
	if (oDocument.documentElement 
		&& oDocument.documentElement.scrollTop)
	{
		return oDocument.documentElement.scrollTop;
	}
	else
	{
		return oDocument.body.scrollTop;
	}
};

RadWindowNamespace.RadGetScrollLeft = function (oDocument)
{
	if (oDocument.documentElement 
		&& oDocument.documentElement.scrollLeft)
	{
		return oDocument.documentElement.scrollLeft;
	}
	else
	{
		return oDocument.body.scrollLeft;
	}
};

//------------------------------------------------------Box--------------------------------------------------------------------//
RadWindowNamespace.Box = 
{
	GetOuterWidth : function (element)
	{
		var computedStyle = this.GetCurrentStyle(element);
		return element.offsetWidth + this.GetHorizontalMarginValue(computedStyle);
	},

	GetOuterHeight : function (element)
	{
		var computedStyle = this.GetCurrentStyle(element);
		return element.offsetHeight + this.GetVerticalMarginValue(computedStyle);
	},

	GetInnerWidth : function (element)
	{
		var computedStyle = this.GetCurrentStyle(element);
		return element.offsetWidth - this.GetHorizontalPaddingAndBorderValue(computedStyle);
	},

	GetInnerHeight : function (element)
	{
		var computedStyle = this.GetCurrentStyle(element);
		return element.offsetHeight - this.GetVerticalPaddingAndBorderValue(computedStyle);
	},

	SetOuterWidth : function (element, width)
	{
		var computedStyle = this.GetCurrentStyle(element);
		if (computedStyle) width -= this.GetHorizontalMarginValue(computedStyle);//TEKI - If because of (invisible?) Iframe not having computed style
		
		if (this.IsCompat())
		{
			if (computedStyle) width -= this.GetHorizontalPaddingAndBorderValue(computedStyle); //TEKI - If because of (invisible?)Iframe 
		}
		if (width < 0)
		{
    		element.style.width = "auto";
		}
		else
		{
			element.style.width = width + "px";
		}
	},


	SetOuterHeight : function (element, height)
	{	
		var intendedHeight = height;
		var computedStyle = this.GetCurrentStyle(element);
		height -= this.GetVerticalMarginValue(computedStyle);
		
		var oDiff = 0;
		if (this.IsCompat())
		{
			oDiff = this.GetVerticalPaddingAndBorderValue(computedStyle);
			height -= oDiff;
		}
		
		element.style.height = height + "px";
		
		var setHeight = this.GetOuterHeight(element);
	
		// ie table issue covered
		if (setHeight != 0 && setHeight != intendedHeight) //TEKI setHeight != 0 --> Moz!!!!
		{
			var difference = (setHeight - intendedHeight);
			var newHeight = (intendedHeight - difference);
			
			if (newHeight > 0) 
			{
				element.style.height = (newHeight - oDiff) + "px";//TEKI - the Padding and border must be considered here too!!
			}
		}				
	},

	// private methods
	SafeParseInt : function (value)
	{
		var result = parseInt(value);
		return isNaN(result) ? 0 : result;
	},

	GetStyleValues : function (style)
	{
		if (!style) return 0;
		
		var value = 0;
		for (var i = 1; i < arguments.length; i++)
		{
			value += this.SafeParseInt(style[arguments[i]]);
		}
		return value;
	},

	GetHorizontalPaddingAndBorderValue : function (style)
	{
		return this.GetStyleValues(style, "borderLeftWidth", "paddingLeft", "paddingRight", "borderRightWidth");
	},

	GetVerticalPaddingAndBorderValue : function (style)
	{
		return this.GetStyleValues(style, "borderTopWidth", "paddingTop", "paddingBottom", "borderBottomWidth");
	},

	GetHorizontalMarginValue : function (style)
	{
		return this.GetStyleValues(style, "marginLeft", "marginRight");
	},

	GetVerticalMarginValue : function (style)
	{
		return this.GetStyleValues(style, "marginTop", "marginBottom");
	},

	GetCurrentStyle : function (element)
	{
		if (element.currentStyle)
		{
			return element.currentStyle;
		}
		else if (document.defaultView && document.defaultView.getComputedStyle)
		{
			return document.defaultView.getComputedStyle(element, null);
		}
		else
		{
			return null;
		}
	},


	IsCompat : function ()
	{
		return true;
		/*RadTabStripNamespace.Browser.IsSafari || 
		RadTabStripNamespace.Browser.IsOpera9 || 
		RadTabStripNamespace.Browser.IsMozilla || 
		document.compatMode == "CSS1Compat";*/
	}
};

/*************************************************
 *
 * RadGetElementRect
 *
 *************************************************/
RadWindowNamespace.RadGetElementRect = function (element)
{
	if (!element) element = this;
		
	var left = 0;
	var top  = 0;
	
	var width = RadWindowNamespace.Box.GetOuterWidth(element);
	var height = RadWindowNamespace.Box.GetOuterHeight(element);
					
	while (element.offsetParent)
	{
		left += element.offsetLeft;
		top += element.offsetTop;
		
		element = element.offsetParent;
	}
	
	if (element.x) left = element.x;
		
	if (element.y) top = element.y;
	
	var oRect = {};
	oRect.left   = RadWindowNamespace.RadUtil_GetIntValue(left, 0);
	oRect.top    = RadWindowNamespace.RadUtil_GetIntValue(top, 0);
	oRect.width  = RadWindowNamespace.RadUtil_GetIntValue(width, 0);
	oRect.height = RadWindowNamespace.RadUtil_GetIntValue(height, 0);
	return oRect;  //return new RadWindowNamespace.Rectangle(left, top, width, height);
};

/*
RadWindowNamespace.Rectangle = function(left, top, width, height)
{
	this.left   = (null != left ? left : 0);
	this.top    = (null != top ? top : 0);
	this.width  = (null != width ? width : 0);
	this.height = (null != height ? height : 0);
};*/

//Browser detection function
RadWindowNamespace.RadUtil_DetectBrowser = function (bName)//msie, safari, compatible
{	
	bName = bName.toLowerCase();
	if ("ie" == bName) bName = "msie";
	else if ("mozilla" == bName || "firefox" == bName) bName = "compatible";		
	var detect = navigator.userAgent.toLowerCase();
	place = detect.indexOf(bName) + 1;	
	if (place) return true;	
	else return false;	
};

RadWindowNamespace.RadUtil_IsDocumentLoaded = function(oDocument)
{
	return (null != document.readyState && "complete" != document.readyState) ? false : true ;
}

RadWindowNamespace.RadUtil_GetIntValue = function (sNumber, defaultValue)
{
	if (!defaultValue)
		defaultValue = 0;

	var nNumber = parseInt(sNumber);
	return (isNaN(nNumber) ? defaultValue : nNumber);
};

RadWindowNamespace.RadUtil_GetEventSource = function(e)
{
	if (null == e)return null;
	return (e.srcElement ? e.srcElement : e.target);	
};

RadWindowNamespace.RadUtil_CancelEvent = function(eventArgs)
{
	if (!eventArgs) return;
	eventArgs.returnValue = false;
	eventArgs.cancelBubble = true;
	
	if (eventArgs.stopPropagation) 
	{
		eventArgs.stopPropagation();
	}
	
	if (eventArgs.preventDefault)
	{
		eventArgs.preventDefault();
	}	
	return false;
};

/************************************************
 *
 *	EVENT HELPERS
 *
 ************************************************/
RadWindowNamespace.RadUtil_AttachEventEx = function(element, eventName, handler)
{
	eventName = RadWindowNamespace.RadUtil_FixEventName(eventName);
	if (element.addEventListener)
	{
		element.addEventListener(eventName, handler, false);//! was true so far!, but in Atlas is false, and onscroll on Moz only works when set to false!!
	}
	else if (element.attachEvent)
	{	
		element.attachEvent(eventName, handler);
	}
};
			
RadWindowNamespace.RadUtil_DetachEventEx = function (element, eventName, handler)
{
	eventName = RadWindowNamespace.RadUtil_FixEventName(eventName);
	if (element.addEventListener)
	{
		element.removeEventListener(eventName, handler, false);
	}
	else if (element.detachEvent)
	{
		element.detachEvent(eventName, handler);
	}
};

RadWindowNamespace.RadUtil_StartsWith = function (text, value)
{
	if (typeof(value) != "string") return false;		
	return (0 == text.indexOf(value));
};
 
RadWindowNamespace.RadUtil_FixEventName = function (eventName)
{
	eventName = eventName.toLowerCase();
	if (document.addEventListener)
	{
		//TEKI: OPERA has both document.addEventListener + document.attachEvent
		if (RadWindowNamespace.RadUtil_StartsWith(eventName, "on")) return eventName.substr(2);
		else return eventName;
	}
	else if (document.attachEvent && !RadWindowNamespace.RadUtil_StartsWith(eventName, "on"))
	{
		return "on" + eventName;
	}
	else
	{
		return eventName;
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