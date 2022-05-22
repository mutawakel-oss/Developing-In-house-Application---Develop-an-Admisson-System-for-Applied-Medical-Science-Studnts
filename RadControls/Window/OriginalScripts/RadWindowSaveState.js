RadWindowNamespace.RadWindowStateManager = 
{	
	SaveState : function()
	{
		var oManager = GetRadWindowManager();
		var oWnds = oManager.GetWindowObjects();
		for (i=0; i < oWnds.length; i++)
		{
			var oWnd = oWnds[i];						
			var oVal = 
					   (oWnd.IsVisible() || oWnd.IsMinimized()) + "@" +					   
					   oWnd.GetWidth() + "@" + 
					   oWnd.GetHeight() + "@" + 
					   oWnd.GetLeftPosition() + "@" + 
					   oWnd.GetTopPosition() + "@" + 
					   oWnd.IsMinimized();					   
			this.SetRadWindowCookie(oWnd.Id, oVal);
		}
	},
    
    RestoreState : function()
    {		
		function restoreWindow(oWnd)
		{
			var array = oStr.split("@");											
			if (array.length > 1)
			{
				//RadWindow.Show executes in a timeout due to problems in AJAX , so in IE there is problem with restoring the "minimized" state.
				//To solve the issue we run another timeout
				
				//The line below does not work well as it does not take into account fact that the window should be shown after a postback if the developer said so!
				//"true" == array[0] ? oWnd.Show() : oWnd.Hide();
				if ("true" == array[0] && !oWnd.IsVisible()) oWnd.Show();
				
				
				//If we set timeout to 0 there is problem in IE - it sometimes shows both the minimized window and the window itself				
				//However, if it is > 0 then there is flickering on the screen. 
				//TODO: Hopefully eventually there would be some good workaround for this
				window.setTimeout(function()
				{																												
					if(parseInt(array[1]) > 0) oWnd.SetWidth(array[1]);
					if(parseInt(array[2]) > 0) oWnd.SetHeight(array[2]);
											
					oWnd.MoveTo(array[3], array[4]);			
					if ("true" == array[5])
					{						
						oWnd.Minimize();							
					}										
				}, 1);
			}
		};
		
		var oThis = RadWindowNamespace.RadWindowStateManager;				
    	var oManager = GetRadWindowManager();
		var oWnds = oManager.GetWindowObjects();
				
		for (i=0; i < oWnds.length; i++)
		{
			var oWnd = oWnds[i];
			var oStr = oThis.GetRadWindowCookie(oWnd.Id);			
									
			if (oStr)
			{
				restoreWindow(oWnd);
			}			
		}		
    },
    
	GetOnlyCookie : function()
	{
		var sName = "RadWindowCookie";
	
		var aCookie = document.cookie.split("; ");
		for (var i=0; i<aCookie.length; i++)
		{
			var aCrumb = aCookie[i].split("=");
			if (sName == aCrumb[0]) return aCrumb[1];
		}
		return null;
	},

	SetRadWindowCookie : function(sName, sValue)
	{
		sName = "[" + sName + "]";
		var stringToSplit = this.GetOnlyCookie();
		var begStr ="";
		var endStr ="";
			
		if (stringToSplit)
		{				
			var array = stringToSplit.split(sName);	
			if (array && array.length > 1)
			{
				begStr = array[0];
				endStr =array[1].substr(array[1].indexOf("#") + 1);
			}
			else endStr = stringToSplit;		
		}

		var today = new Date();
		today.setFullYear(today.getFullYear() + 10);
		document.cookie = "RadWindowCookie" + "=" + (begStr + sName +"-" + sValue + "#" + endStr) + ";path=/;expires=" + today.toUTCString() + ";";
	},

	GetRadWindowCookie : function(sName)
	{	
		var cook = this.GetOnlyCookie();
		if (!cook) return;
		
		var sValue = null;
		sName = "[" + sName + "]";

		var index = cook.indexOf(sName);
		if (index >=0)
		{
			var endIndex = index + sName.length + 1;
			sValue = cook.substring(endIndex, cook.indexOf("#", endIndex));
		}
		return sValue;
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