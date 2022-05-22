/******************************************************************************
* RadWindowClassic will use classic browser dialogs. It will be sent to the client if UseClassicWindows property is set or
*  if the server detects a low-level browser. 
* Having a separate file will increase readability and will reduce overall code sent to the client!
* If a RadWindowClass object is requested with the UseClassicWindow = true, then it will replce the RadWindow API functions with "classic" versions
* e.g. this.SetSize = RadWindowClassic_SetSize
/******************************************************************************/
RadWindowNamespace.RadWindowClassicEmptyFunction = function(){};

RadWindowNamespace.RadWindowClassic = 
{
	Create : RadWindowNamespace.RadWindowClassicEmptyFunction,	
	Minimize : RadWindowNamespace.RadWindowClassicEmptyFunction,	
	Maximize : RadWindowNamespace.RadWindowClassicEmptyFunction,	
	Restore : RadWindowNamespace.RadWindowClassicEmptyFunction,	
	TogglePin : RadWindowNamespace.RadWindowClassicEmptyFunction,	
	SetModal : RadWindowNamespace.RadWindowClassicEmptyFunction,
	Cascade : RadWindowNamespace.RadWindowClassicEmptyFunction,
	Tile: RadWindowNamespace.RadWindowClassicEmptyFunction,
	
	SetUrl: function (url)
	{
		var oWnd = this.ClassicWindow;	
		try
		{
			oWnd.location.href = url;
		}catch(e){};
	},
	
	Show : function(oUrl)
	{				
		if (oUrl) this.Url = oUrl;
		
		var oStr = 
				"width=" + this.Width + ", height=" + this.Height +
				", scrollbars=yes" +
				", resizable=" +( this.IsBehaviorEnabled(RadWindowBehavior.Resize) ? "yes" : "no");						
				
		this.ClassicWindow = window.open(this.Url, this.Name, oStr);	

		this.CreateBackReference();		
	},
	
	
	
	SetPosition : function (left, top)//not called anywhere i think!
	{	
		if (this.ClassicWindow)
		{
			this.ClassicWindow.dialogLeft = left;
			this.ClassicWindow.dialogTop = top;
		}	
	},
		
	SetSize : function (width, height)
	{
		var oWnd = this.ClassicWindow;	
		if (oWnd)
		{		
			if (oWnd.dialogWidth && oWnd.dialogHeight) //resizeTo does not work on Modal IE dialogs
			{
				oWnd.dialogWidth = width;
				oWnd.dialogHeight = height;
			}
			else
			{
				oWnd.resizeTo(width, height);
			}
		}
	},
	
	Dispose : function()
	{
		this.Close();
		this.ClassicWindow = null;		
	},	
		
	Close : function()
	{		
		this.ClassicWindow.close();
	},
	
	SetActiveProtected : function()
	{		
		if (false != setActive) this.ClassicWindow.focus();
		else this.ClassicWindow.blur();
	},
	
	
	GetWidth : function()
	{	
		var oWnd = this.ClassicWindow;
		//alert (oWnd.outerWidth + "--" + this.Id + "-->RadWindowClassic_GetWidth called " + oWnd.innerWidth);	
		if (oWnd)
		{
			if (oWnd.dialogWidth) return parseInt(oWnd.dialogWidth);	
			else if (window.outerWidth)//Moz!
			{
				return parseInt(window.outerWidth);
			}
			else
			{			
				//Try to get to the body element and calculate it
				if (oWnd.document.domain == window.document.domain)					
				{
					var oRect = RadWindowNamespace.RadUtil_GetBrowserRect (oWnd);				
					if (oRect) return (oRect.width);
				}
			}
		} 
		return 100;
	},
	
	
	SetWidth : function(width)
	{		
		var oWindow = this.ClassicWindow;
		
		if (oWindow)
		{		
			if (oWindow.dialogWidth)
			{				
				oWindow.dialogTop = oWindow.screenTop - 31;
				oWindow.dialogLeft = oWindow.screenLeft - 4;
								
				oWindow.dialogWidth = width + "px";
			}
			else
			{
				oWindow.outerWidth = width;
			}
		}		
	},
	
	
	GetHeight : function()
	{
		var oWnd = this.ClassicWindow;
		if (oWnd)
		{
			if (oWnd.dialogHeight) return parseInt(oWnd.dialogHeight);	
			else if (window.outerHeight)//Moz!
			{
				return (parseInt(window.outerHeight));
			}
			else
			{
				//Try to get to the body element and calculate it
				if (oWnd.document.domain == window.document.domain)					
				{
					var oRect = RadWindowNamespace.RadUtil_GetBrowserRect (oWnd);
					//alert (oWnd + " RadWindowClassic_GetHeight Here " + oRect.height);
					if (oRect) return (oRect.height + 30);//30 is the title bar!
				}			
			}
		}
		return 30;
	},
	
	SetHeight : function(height)
	{	
		var oWindow = this.ClassicWindow;
		
		if (oWindow.dialogWidth)
		{
			oWindow.dialogTop = oWindow.screenTop - 30;
			oWindow.dialogLeft = oWindow.screenLeft - 4;
			
			oWindow.dialogHeight = height + "px";
		}
		else
		{
			oWindow.outerHeight = height;
		}
	},	
	
	
	IsVisible : function() 
	{
		if (!this.Closed && this.ClassicWindow && !this.ClassicWindow.closed) return true;
		return false;
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