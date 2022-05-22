RadWindowNamespace.RadWindowMinimize = function(oWindow)
{
	this.Window = oWindow;
	this.Id = oWindow.Id;				
	
	var oManager = GetRadWindowManager();	
	var oContent = 	oManager.GetMinimizeTemplate(oWindow);			
	var oSpan = document.createElement("div");
	oSpan.innerHTML = oContent;		
	document.body.appendChild(oSpan);	
	this.MinimizedElement = (oSpan.childNodes.length == 1) ? oSpan.firstChild : oSpan;
								
	var oThis = this;
	var oFunClose = function()//Used below!
	{
		oThis.SetVisible(false);
	};	
	
	var oElem = this.MinimizedElement;
	if (oElem)
	{
		oElem.setAttribute("id", "RadWMinimized" + this.Id);
		oElem.className = "RadWMinimizedActive";
		oElem.onmouseover = function(){ this.CurClassName = this.className; this.className = "RadWMinimizedOver";}
		oElem.onmouseout  = function(){ this.className = this.CurClassName;}
	}	
	
	var oTitleElem = oThis.FindElement("RadWMinimizedTitle");
	if (oTitleElem)
	{
		oThis.TitleElement = oTitleElem;
	}
	
		
	var oCloseBut = oThis.FindElement("RadWMinimizedClose");
	if (oCloseBut) 
	{
		if (!oWindow.IsBehaviorEnabled(RadWindowBehavior.Close))//Check if closable
		{		
			oCloseBut.style.display = "none";
		}
		else
		{
			oCloseBut.onclick = function(e)
			{				
				oWindow.Close();
			};
		}
	}
		
	if (oWindow.IsMinimizeModeEnabled(RadWindowMinimizeMode.MinimizeZone)) //Docked to a zone
	{	
		//Check if the restore button should be here
		var oRestoreBut = oThis.FindElement("RadWMinimizedRestore");
		if (oRestoreBut) oRestoreBut.style.display = "none";	
				
		this.MinimizedElement.onclick = function()
		{	
			if (oWindow.IsClosed()) return;//The click! event propagates to here
			
			if (!oWindow.IsVisible())
			{			
				 oWindow.Show();//if the window was never visible!			
			}
			oWindow.SetActive(true);//!		
			oElem.CurClassName = oElem.className = "RadWMinimizedActive";//!
		}
		
		//Display minimized when a window is first shown
		oWindow.AttachClientEvent("onshow", this.OnRadWindowMinimize);		
	}
	else //Only if the element is free floating
	{		
		var oRestoreBut = oThis.FindElement("RadWMinimizedRestore");
		if (oRestoreBut) oRestoreBut.onclick = function(){ oThis.RestoreWindow(); }
		
		this.MinimizedElement.ondblclick = function()
		{
			oThis.RestoreWindow();			
		}
		
		if (this.MinimizedElement.tagName == "TABLE" && this.MinimizedElement.rows.length > 0)
		{
			var oCell = this.MinimizedElement.rows[0].cells[1];
			if (oCell)
			{
				oCell.setAttribute("grip", "true");
				oCell.setAttribute("titleGrip", "show");
			}
		}
		
		//Make moveable but not resizable			
		RadWindowNamespace.MakeMoveable(this.MinimizedElement
					, useDragHelper = true
					, useOverlay = true
					, resizable = false
					, oWindow.IsBehaviorEnabled (RadWindowBehavior.Move));
		
		//Attach to ondragend event to your own table element					
		oElem.OnDragEnd = function()
		{ 				
			var oRect = this.GetRect();
			var wndRect = oWindow.RestoreRect;
			if (wndRect)
			{
				wndRect.top = oRect.top;
				wndRect.left = oRect.left;	
			}			
		};
		
		//Close on maximize and restore
		oWindow.AttachClientEvent("onmaximize", oFunClose);		
		oWindow.AttachClientEvent("onrestore", oFunClose);		
	}

	oWindow.AttachClientEvent("onclose", oFunClose);	
	oWindow.AttachClientEvent("onminimize", this.OnRadWindowMinimize);					
																					
	//Attach to activate/deactivate 	
	oWindow.AttachClientEvent("onactivate", function()
	{								
		oThis.SetActiveProtected(true);
	});
	
	oWindow.AttachClientEvent("ondeactivate", function()
	{		
		oThis.SetActiveProtected(false);
	});	
	
	//If window is minimized on load - start blinking
	oWindow.AttachClientEvent("onwindowload", function()
	{		
		if (oThis.TitleElement) oThis.TitleElement.innerHTML = oWindow.Title; 
		
		var oElem = oThis.MinimizedElement;
		if ("none" != oElem.style.display)
		{		  
		  if (!oThis.PageLoadInterval && !oWindow.IsVisible())//Start blinking
		  {
			oThis.PageLoadedCount = 0;
			oThis.PageLoadInterval = window.setInterval(
				function()
				{					
					oThis.MinimizedElement.className = ((oThis.PageLoadedCount++) % 2== 0) ? "RadWMinimizedActive" : "RadWMinimizedPageLoaded";		
					if (11 == oThis.PageLoadedCount)
					{
						 window.clearInterval(oThis.PageLoadInterval);
						 oThis.PageLoadInterval = null;
						 oThis.PageLoadedCount = 0;
					}
				}, 500);
			}
		}
	});			
};

RadWindowNamespace.RadWindowMinimize.prototype = 
{
	FindElement : function(name)
	{
		return document.getElementById(name + this.Id);
	},

	Dispose : function(toShow)
	{
		this.Window = null;
		var oElem = this.MinimizedElement;
		oElem.ondblclick = null;
		oElem.onclick = null;	
		oElem.Overlay = null;
		oElem.OnDragEnd = null;
		if (oElem.parentNode && oElem.parentNode.removeChild)
		{
			oElem.parentNode.removeChild(oElem);
			oElem.removeAttribute("id");
		}	
		this.MinimizedElement = null;	
	},

	OnRadWindowMinimize : function(oWindow)
	{				
		var oMode = oWindow.MinimizeMode;
		var oThis = oWindow.MinimizedWindow;	
		if (oThis.TitleElement) oThis.TitleElement.innerHTML = oWindow.Title; 
								
		if (!(RadWindowMinimizeMode.SameLocation == oMode))
		{				
			if (oWindow.MinimizeZoneId)
			{
				var oZone = document.getElementById (oWindow.MinimizeZoneId);
				if (oZone)
				{				
					var oTable = oThis.MinimizedElement;						
					if (oTable.parentNode != oZone) //Do not "rotate" minimized windows
					{
						oTable.parentNode.removeChild(oTable);			
						oZone.appendChild(oTable);						
						oTable.style.position = "";
					}
					oTable.style.display = "inline";				
				}			
				return;
			}
		}										
		
		//Else do the default mechanism
		var oRect = oWindow.GetRectangle();//Move to proper location
		
		var x = null, y = null;
		//It is possible that the window was never shown before it is minimized!
		if (!oRect)
		{							
			var oRect = oThis.Window.GetLeftTopPosition();		
			x = oRect.left;
			y = oRect.top;
		}
		else
		{
			x = oRect.left;
			y = oRect.top;
		}	
		
		if (oThis.MinimizedElement.MoveTo)
		{
			oThis.MinimizedElement.MoveTo(x, y);			
		}
		oThis.SetVisible(true);
		oThis.SetPinState();//MakePinnable or not
	},

	//Called if the minimized window is a free floating
	RestoreWindow : function()
	{	
		var oWindow = this.Window;
		var oMinim = this.MinimizedElement;
		var oRect = oMinim.GetRect();
				
		var wndRect = oWindow.RestoreRect;
		if (wndRect)
		{
			wndRect.top = oRect.top;
			wndRect.left = oRect.left;		
			oWindow.Restore();//Shows it and sets it active!
		}
		else
		{						
			if (!oWindow.IsVisible()) oWindow.Show();//if the window was never visible!
			oWindow.SetSize(oWindow.Width, oWindow.Height);		
			oWindow.MoveTo(oRect.left, oRect.top);		
			oWindow.SetActive(true);//!
		}			
		oMinim.Hide();			
	},

	//Called if the minimized window is docked in a docking zone
	//1. register as active window so as to let the Window Manager do good stuff
	//2. Set on top
	SetActiveProtected : function(setActive)
	{
		var oElem = this.MinimizedElement;
		if ("none" == oElem.style.display) return;	
					
		if (setActive)
		{	
			if (this.Window.IsMinimizeModeEnabled(RadWindowMinimizeMode.MinimizeZone))
			{			
				if (!this.Window.IsVisible()) this.Window.Show();//if the window was never visible!			
			}
			else
			{
				RadWindowNamespace.RadUtil_SetOnTop(oElem);
			}
		}		
		oElem.className = setActive ? "RadWMinimizedActive" : "RadWMinimizedInactive";		
	},

	SetPinState : function()
	{	
		RadWindowNamespace.RadUtil_SetPinned(this.Window.IsPinned(), this.MinimizedElement);
	},

	SetVisible : function(toShow)
	{
		var oElem = this.MinimizedElement;		
				
		if (toShow)
		{
			if (oElem.Show) oElem.Show();
			else oElem.style.display = "";		
			var oRect = oElem.GetRect();//Always resize, because when moving the overlay might not be sized OK - e.g. in the case of the minimized element,the overlay is 0 because this element was not visible initially
			oElem.SetSize(oRect.width, oRect.height, false);
		}
		else
		{
			if (oElem.Hide) oElem.Hide();
			else oElem.style.display = "none";
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