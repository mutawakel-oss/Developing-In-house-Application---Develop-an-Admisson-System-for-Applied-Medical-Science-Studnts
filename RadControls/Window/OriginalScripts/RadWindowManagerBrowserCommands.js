RadWindowManagerClass.prototype.CreateBrowserCommands = function()
{			
	var oManager = this;
	
	window.radopen = function(url, wndName)
	{
		var openWindow = function()
		{
			var oWnd = oManager.Open(url, wndName);	
			return oWnd;
		}

		if (!RadWindowNamespace.RadUtil_IsDocumentLoaded())
		{
			RadWindowNamespace.RadUtil_AttachEventEx (window, "load", openWindow);
			return null;
		}
		else 
		{
			return openWindow();
		}
	};
	
	//Define a function that is assigned to the popup and and called when closing.
	modalDialogCallBack = function(oArg)
	{
		//Make sure here it is the original Close function and not the replacement!
		if (this.Close != RadWindowClass.prototype.Close) this.Close = RadWindowClass.prototype.Close;
	
		this.Close();
		
		if (this.ModalCallBackFunction) 
		{		
			this.ModalCallBackFunction(oArg, this.CallerObj);		
		}
		this.Argument = null;//nullify Argument as the last action!
	};
	
		
	//NEW
	window.radsplash = function(setVisible)
	{
		return oManager.ShowSplash(setVisible);		
	};
	
	
	window.radalert = function(text, oWidth, oHeight, oTitle)
	{						
		if(!oManager.EnableStandardPopups)
		{
			alert(text);
		}
		else
		{		
			var openAlert = function() 
			{
				if (!oWidth) oWidth = 280;
				if (!oHeight) oHeight = 200;

				var oWnd = oManager.CreateStandardPopup("Alert", text);				
				oWnd.WindowToSetActive = oManager.GetActiveWindow();
				
				if (typeof(oTitle) != 'undefined')
				{
					oWnd.SetTitle(oTitle)
				}

				oWnd.SetSize(oWidth, oHeight);
				oWnd["OnClientShow"] = function(){oWnd.AutoResize(); oWnd.Center();};//NEWMOZILLA
				
				window.setTimeout(function()//OPERA
				{
					oWnd.Show();												
				}, 0);
				
				return oWnd;				
			}

			if (!RadWindowNamespace.RadUtil_IsDocumentLoaded())
			{
				RadWindowNamespace.RadUtil_AttachEventEx(window, "load", openAlert);
				return null;
			}
			else 
			{

				return openAlert();
			}
		}
	};
	
	// caller obj - reference to the object that initiates the propmt box
	window.radprompt = function (text, callBackFn, oWidth, oHeight, callerObj, oTitle)
	{
		if(!oManager.EnableStandardPopups)
		{
			return prompt(text);
		} 
		else 
		{			
			var openPrompt = function() 
			{
				if (!oWidth) oWidth = 280;
				if (!oHeight) oHeight = 210;	
				var oWnd = oManager.CreateStandardPopup("Prompt", text);
				oWnd.ModalCallBackFunction = callBackFn;
				oWnd.CallerObj = callerObj;
				oWnd.WindowToSetActive = oManager.GetActiveWindow();
				
				if (typeof(oTitle) != 'undefined') {
					oWnd.SetTitle(oTitle)
				}				
				
				oWnd.SetSize(oWidth, oHeight);
				oWnd["OnClientShow"] = function(){oWnd.AutoResize(); oWnd.Center();};//NEWMOZILLA
				window.setTimeout(function()//OPERA
				{
					oWnd.Show();												
				}, 0);
																				
				oWnd.Close = function(oArg)
				{
					if (null == oArg) oArg = "";					
					oWnd.Close = RadWindowClass.prototype.Close;
					oWnd.ModalDialogCallBack(oArg);
				};
				
				//Assign a callback function to be called
				oWnd.ModalDialogCallBack = modalDialogCallBack;

				return oWnd;
			}
			
			if (!RadWindowNamespace.RadUtil_IsDocumentLoaded())
			{
				RadWindowNamespace.RadUtil_AttachEventEx (window, "load", openPrompt);
				return null;
			}
			else 
			{
				return openPrompt();
			}
		}
	};
	
	// caller obj - reference to the object that initiates the confirm box
	window.radconfirm = function (text, callBackFn, oWidth, oHeight, callerObj, oTitle)
	{	
		if (!oManager.EnableStandardPopups)
		{
			return confirm(text);
		}
		else
		{
			var openConfirm = function()
			{
				if (!oWidth) oWidth = 280;
				if (!oHeight) oHeight = 210;			
				var oWnd = oManager.CreateStandardPopup("Confirm", text);
				oWnd.ModalCallBackFunction = callBackFn;
				oWnd.CallerObj = callerObj;
				
				oWnd.WindowToSetActive = oManager.GetActiveWindow();	
				
				if (typeof(oTitle) != 'undefined') {
					oWnd.SetTitle(oTitle)
				}					
				oWnd.SetSize(oWidth, oHeight);
				oWnd["OnClientShow"] = function(){oWnd.AutoResize(); oWnd.Center();};//NEWMOZILLA
				window.setTimeout(function()//OPERA
				{
					oWnd.Show();												
				}, 0);
				
				//Replace the Close method to call the ModalDialogCallBack even if the window is called from the [x]				
				oWnd.Close = function(oArg)
				{
					if (null == oArg) oArg = false;					
					oWnd.Close = RadWindowClass.prototype.Close;
					oWnd.ModalDialogCallBack(oArg);
				};
				
				//Assign a callback function to be called
				oWnd.ModalDialogCallBack = modalDialogCallBack;
				
				return oWnd;
			}	

			if (!RadWindowNamespace.RadUtil_IsDocumentLoaded())
			{
				RadWindowNamespace.RadUtil_AttachEventEx (window, "load", openConfirm);
				return null;
			}
			else 
			{
				return openConfirm();
			}
		}
	};		
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