/*************************************************
 *
 * CurrentDragTarget - the current object to be moved around
 *
 *************************************************/ 
RadWindowNamespace.CurrentDragTarget = null;

/************************************************* 
 * MakeMoveable.
 *
 *		- obj - HTML element to make enable to move;
 *
 *		- useDragHelper - if TRUE when dragging a helper object (DIV) will be moved instead the HTML element 
 *							itself (if FALSE);
 *							
 *		- useOverlay - if TRUE an overlay will be used that prevents windowed controls (select, ActiveX)
 *						to come over the HTML element.
 *
 *		- resizable - if TRUE object can be resized by mouse.
 * 
 *		- movable - if TRUE object can be moved (to be refactored RWIN-4429 )
 *
 *	  Custom HTML attributes to mark a HTML element as Moveable object: 
 *	- grip. Optional. Marks a HTML element as a grip to init dragging 
 *************************************************/
RadWindowNamespace.MakeMoveable = function (obj, useDragHelper, useOverlay, resizable, movable)
{
	if (!obj || obj.Move) return;
		
	Object.Extend(obj, RadWindowNamespace.RadMoveableObject);		
	
	// well little patchy is this , but this is the best we can do in this moment
	// should be refactored. see RWIN-4429 
	obj.AllowMove = (movable) ? true : false ;
	
	if (resizable != false)
	{
		Object.Extend(obj, RadWindowNamespace.ResizableObject);				
		obj.InitResize();
	}
	
	obj.onmouseout = function (e)
	{
		if ("" != this.style.cursor)
		{
			this.style.cursor = "";
		}
	};
	
	obj.onmousedown = function (e)
	{
		if (!this.MoveEnabled) return;
		
		if (!e) e = window.event;			
		
		if (this.SetOnTop) this.SetOnTop();
				
		if (!this.DragMode)
		{			
			if (this.AllowResize && this.ResizeDir)
			{		
				this.DragMode = 2;//"resize";
				this.StartDrag(e);//Start resizing!
			}
			else if (this.AllowMove && this.GripHitTest(e))
			{						
				this.DragMode = 1;//"move";	
			}		
		}	
		return RadWindowNamespace.RadUtil_CancelEvent(e);	
	};
	
	
	obj.onmouseup  = function (e)
	{	
		this.DragMode = "";		
		RadWindowNamespace.HideOverlayImage();//Remove the empty image, in case it has not been removed!
		if (this.OnMouseUp)
		{
			this.OnMouseUp(e);
		}
	};
	
	obj.onmousemove = function (e)
	{
		if (!e) e = window.event;
				
		//Check whether to start moving or resiziing		
		if (this.DragMode)
		{			
			this.StartDrag(e);
			return;
		}
				
		//When moving it should NOT be calculating the resizing cursors!
		if (this.IsMoving()) return;
		
		//Calculate whether you are over a resize area and whether you should display a cursor
		if (!this.IsResizing() && null != this.CalcResizeDir)
		{
			this.ResizeDir = this.CalcResizeDir(e);
			this.style.cursor = this.ResizeDir;
		}
	};
						
	if (useOverlay != false && document.all && !window.opera)// Overlay -- IE only
	{			
		RadWindowNamespace.EnableOverlayIframe(obj);
	}						
}

/*************************************************
 *
 * RadMoveableObject object
 *
 *************************************************/
RadWindowNamespace.RadMoveableObject = 
{	
	// Properties & Events
	OnDragStart : null,
	OnDragEnd   : null,		
	OnMouseUp	: null,
	OnResize	: null,
	OnShow		: null,
	OnHide		: null,	
	AllowMove	: true,
	AllowResize : true,	
	UseDragHelper : true,
	DragMode : null,
	MoveEnabled : true,
	
	
	EnableMove: function (enable)
	{
		this.MoveEnabled = enable;
	},
	
	// Methods 
	StartDrag : function(eventArgs)
	{	
		//Return if drag already started
		if (this.DragStarted) return;
		
		this.MouseX = eventArgs.clientX;
		this.MouseY = eventArgs.clientY;
						
		RadWindowNamespace.RadUtil_AttachEventEx(document, "onmouseup",   RadWindowNamespace.GeneralMouseUp);		
		RadWindowNamespace.RadUtil_AttachEventEx(document, "onmousemove", RadWindowNamespace.GeneralMouseMove);		
			
		RadWindowNamespace.CurrentDragTarget = this;
		
		if (this.UseDragHelper)
		{
			this.DragHelper = RadWindowNamespace.GetDragHelper();		
			this.DragHelper.Show(this.GetRect());
		}

		if (this.OnDragStart)
		{
			this.OnDragStart(eventArgs);
		}
				
		this.ActualZindex = this.style.zIndex;
		this.style.zIndex = 50000;
		RadWindowNamespace.ShowOverlayImage(this);
	
		this.DragHelper.style.zIndex = this.style.zIndex + 1 ;// -5;//
	
		//Indicate a drag has started		
		this.DragStarted = true;
	},
	
	
	EndDrag : function(eventArgs)
	{	
		if (this.DragHelper)
		{
			var rc = this.DragHelper.GetRect();
						
			if (1 == this.DragMode)
			{
				this.MoveTo(rc.left, rc.top);
			}
			else if (2 == this.DragMode)
			{																				
				this.SetSize(rc.width, rc.height);				
				//Move up if resize was done upwards
				this.MoveTo(rc.left, rc.top);		
			}		
		}
		
		this.CancelDrag(eventArgs);
			
		if (this.OnDragEnd)
		{
			this.OnDragEnd(eventArgs);
		}
	},
	
	CancelDrag : function(eventArgs)
	{
		RadWindowNamespace.CurrentDragTarget = null;
		
		//Indicate end drag
		this.DragStarted = false;
		
		RadWindowNamespace.HideOverlayImage();//Hide overlay image
					
		var oDoc = document;
		RadWindowNamespace.RadUtil_DetachEventEx(oDoc, "onmouseup",   RadWindowNamespace.GeneralMouseUp);
		RadWindowNamespace.RadUtil_DetachEventEx(oDoc, "onmousemove", RadWindowNamespace.GeneralMouseMove);		
				
		if (this.DragHelper)//Hide drag helper (the rectangular div that is used instead of the original object)
		{
			this.DragHelper.Hide();
			this.DragHelper = null;
		}	
		
		this.DragMode = "";				
		this.style.zIndex = this.ActualZindex;//TEKI - reset original object's Zindex.							
		this.Show();//TEKI!
	},
		
	DoDrag  : function (e)
	{		
		if (1 == this.DragMode)//"move" 
		{		
			this.Move(e);
		}
		else if (2 == this.DragMode)//"resize"
		{			
			this.Resize(e);			
		}

		this.MouseX = e.clientX;
		this.MouseY = e.clientY;				
	},
		
	GripHitTest : function (eventArgs)
	{
		var oSrc = RadWindowNamespace.RadUtil_GetEventSource(eventArgs);		
		try
		{	
			while (oSrc && null != oSrc.getAttribute)
			{
				if (null != oSrc.getAttribute("grip")) return oSrc;
				else oSrc = oSrc.parentNode;	
			}
		} catch (e) {;} //IE 5.5 bug
		return null;
	},	

	Move  : function (eventArgs)
	{
		var dX = eventArgs.clientX - this.MouseX;
		var dY = eventArgs.clientY - this.MouseY;	
		//We always use a helper
		this.DragHelper.MoveBy(dX, dY);
	},
	
	
	MoveBy  : function (dX, dY)
	{
		if (!this.Left)
		{
			this.Left = parseInt(this.style.left);
		}
		
		if (!this.Top)
		{
			this.Top = parseInt(this.style.top);
		}
		
		this.MoveTo(this.Left + dX, this.Top + dY);
	},


	MoveTo : function (x, y)
	{
		if (isNaN(x) || isNaN(y)) return;
		this.Left = x;
		this.Top = y;
		
		this.style.position = "absolute";
		this.style.left = this.Left + "px";
		this.style.top = this.Top + "px";
		
		if (this.NeedOverlay)
		{
			this.SetOverlay();
			this.NeedOverlay = false;
		}
		
		if (this.Overlay)
		{		
			this.Overlay.style.top = this.style.top;
			this.Overlay.style.left = this.style.left;
		}
	},	
				
	SetSize  : function (width, height, fireEvent) 
	{	
		width = parseInt(width);
		height = parseInt(height);		
		
		//Similar code is set in the Inflate method as well.
		if (width < 5 || height < 5) return;
						
		if (!isNaN(width) && width >= 0)
		{
			RadWindowNamespace.Box.SetOuterWidth(this, width);
						
			if (this.Overlay)
			{				
				RadWindowNamespace.Box.SetOuterWidth(this.Overlay, width);
			}
		}				
			
		if (!isNaN(height) && height >= 0)
		{				
			RadWindowNamespace.Box.SetOuterHeight(this, height);
			
			//alert("SetSize(height) " + height + " = ? = " + this.GetRect().height);
					
			if (this.Overlay)
			{			
				this.Overlay.style.height = height + "px";				
			}
		}				
		
		if ((false != fireEvent) && this.OnResize && "function" == typeof(this.OnResize)) this.OnResize();
	},
	
	/*
	FixIeHeight : function (oElem, height)//BUGS in IE in DOCTYPE strict mode
	{	
		if (document.all &&  "CSS1Compat" == document.compatMode) 
		{			
			var oHeight = RadWindowNamespace.Box.GetOuterHeight(oElem);
			var difference = (oHeight - parseInt(oElem.style.height));		
			if (difference > 0)
			{	
				var newHeight = (parseInt(oElem.style.height) - difference); 
				if (newHeight > 0) oElem.style.height = newHeight + "px";
			}					
		}
	},
	*/			
	GetRect	: function()
	{	
		if (this == RadWindowNamespace.CurrentDragTarget
			&& this.DragHelper
			&& this.DragHelper.IsVisible())
		{
			return RadWindowNamespace.RadGetElementRect(this.DragHelper);
		}
		else
		{
			return RadWindowNamespace.RadGetElementRect(this);
		}
	},
	
	
	SetPosition : function (rect)
	{
		if (rect)
		{
			this.MoveTo(rect.left, rect.top);
			this.SetSize(rect.width, rect.height);
		}
	},	
	
	
	SetOnTop : function()
	{	
		var maxZIndex = 0;
		var zIndex = 0;
		
		var siblings = this.parentNode.childNodes;
		var node;
		for (var i = 0; i < siblings.length; i++)
		{
			node = siblings[i];
			if (1 != node.nodeType)
				continue;
				
			zIndex = parseInt(node.style.zIndex);
			if (zIndex > maxZIndex)
			{
				maxZIndex = zIndex;
			}
		}
		this.style.zIndex = maxZIndex + 1;
	},
			
			
	Show  : function (rect)
	{
		this.style.display = this.OldDisplayMode ? this.OldDisplayMode : "";
			
		if (null != rect)
		{
			this.SetPosition(rect);
		}
		
		this.SetOnTop();
		
		if (this.ShowOverlay)
		{
			this.ShowOverlay();
		}
			
		if (this.OnShow)
		{
			this.OnShow();
		}
	},
	
	
	Hide : function()
	{
		if (!this.IsVisible()) return;

		this.OldDisplayMode = this.style.display;
		this.style.display = "none";
		
		if (this.HideOverlay)
		{
			this.HideOverlay();
		}
		
		if (this.OnHide)
		{
			this.OnHide();
		}
	},
	
	
	IsVisible : function()
	{
		return (this.style.display != "none");
	},			
	
	
	IsResizing : function()
	{
		return (2 == this.DragMode);//"resize" 
	},
	
	
	IsMoving : function()
	{
		return (1 == this.DragMode);//"move" 
	},			
	
	DisableMove: function()
	{						
		this.CalcResizeDir = null;
		this.Resize = null;	
		this.Inflate = null;
		this.InitResize = null;
		this.SetResizeDirs = null;
		
		this.onmousemove = null;
		this.onmouseup = null;
		this.onmouseout  = null;
		this.onmousedown = null;	
		// methods
		this.StartDrag   = null;
		this.EndDrag     = null;
		this.CancelDrag  = null;
		this.DoDrag      = null;
		this.GripHitTest = null;	
		this.Move        = null;
		this.MoveBy      = null;
		this.MoveTo      = null;	
		this.SetOnTop    = null;	
		this.GetRect		= null;
		this.SetPosition = null;					
		this.SetOverlay       = null;		
		this.ShowOverlay      = null;
		this.HideOverlay      = null;
		this.IsOverlayVisible = null;
		
		this.Show        = null;
		this.Hide        = null;
		this.IsVisible   = null;	
		
		this.IsResizing = null;
		this.IsMoving   = null;
		
		this.DragHelper  = null;
		
		this.OnDragStart= null;
		this.OnDragEnd  = null;		
		this.OnMouseUp	= null;
		this.OnResize	= null;
		this.OnShow		= null;
		this.OnHide		= null;						
		this.DragMode= null;
		this.GlobalDragHelper = null;	
		this.Overlay = null;						
		this.GeneralMouseUp = null;//new but does not seem to do any good
		this.GeneralMouseMove = null;
	}
}

/*************************************************
 *
 * GeneralMouseUp
 *
 *************************************************/
RadWindowNamespace.GeneralMouseUp = function (e)
{
	if (!RadWindowNamespace.CurrentDragTarget) return;
	
	if (!e) e = window.event;		
	
	var oDragTarget = RadWindowNamespace.CurrentDragTarget;
	oDragTarget.EndDrag(e);
	oDragTarget.DragMode = "";//TEKI !Do not put it before the EndDrag! TO DO: Can't we put it into the EndDrag method itself?
};

/*************************************************
 *
 * GeneralMouseMove
 *
 *************************************************/
 RadWindowNamespace.MoveCounter = 0;
  
RadWindowNamespace.GeneralMouseMove = function(e)
{
	var oTarget = RadWindowNamespace.CurrentDragTarget;
	if (!oTarget)return;//!
	if (RadWindowNamespace.MoveCounter++ % 2)//Optimize by a half
	{	
		oTarget.DoDrag(e);	
	}
	RadWindowNamespace.RadUtil_CancelEvent(e);//needed!
}

/*************************************************
 *
 * GetDragHelper
 *
 *************************************************/
RadWindowNamespace.GlobalDragHelper = null;

RadWindowNamespace.GetDragHelper = function()
{
	if (this.GlobalDragHelper)
	{
		return this.GlobalDragHelper;
	}		
	var dragHelper = document.createElement("DIV");	
	document.body.appendChild(dragHelper);						
	dragHelper.style.position = "absolute";
	dragHelper.style.top = 10;
	dragHelper.style.left = 10;
	dragHelper.style.width = 100;
	dragHelper.style.height = 100;			
	dragHelper.style.display = "none";	
	dragHelper.className = "RadWDragHelper";			
	RadWindowNamespace.MakeMoveable(dragHelper, false, false, true);
	
	this.GlobalDragHelper = dragHelper;	
	return dragHelper;
};


/*************************************************
 *
 * Transparent overlay frame
 *
 *************************************************/
RadWindowNamespace.EnableOverlayIframe = function (obj)
{	
	obj.SetOverlay = function()
	{
		var frm = document.createElement("IFRAME");
		frm = frm.cloneNode(true);
		frm.src = "javascript:'';";	
		frm.frameBorder = 0;	
		frm.scrolling = "no";		
		//frm.allowTransparency = true;//No! It kills the overlay, but the line below works just fine!
		frm.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=0)";
		
		var oStyle = frm.style;
		oStyle.overflow = "hidden";			
		this.Overlay = frm;
	};
	
	obj.ShowOverlay = function()
	{
		this.parentNode.insertBefore(this.Overlay, this);		
		var oStyle = this.Overlay.style;
		oStyle.display = "inline";
		oStyle.position = "absolute";
		
		var rect = this.GetRect();		
		oStyle.width = rect.width + "px";
		oStyle.height = rect.height + "px";
		oStyle.left = rect.left + "px";
		oStyle.top = rect.top + "px";	
	};
	
	obj.HideOverlay = function()
	{		
		this.Overlay.style.display = "none";		
	};
		
	if ("complete" == document.readyState)
	{	
		obj.SetOverlay();
	}
	else
	{	
		obj.NeedOverlay = true;	
	}
};


/*************************************************
 *
 * Transparent overlay image when moving a window
 *
 *************************************************/
RadWindowNamespace.GetOverlayImage = function()
{
	if (!this.OverlayImage)
	{								
		var img = document.createElement("IMG");						
				
		if (document.all)//IE only, to speed up eventhandling in Moz
		{
			var oCancelFun = new Function("return false"); 
					
			img.setAttribute("unselectable","on");		
			img.setAttribute("galleryimg","no");							
			img.onselectstart = oCancelFun;
			img.ondragstart = oCancelFun;			
			img.onmouseover = oCancelFun;
			img.onmousemove = oCancelFun;					
		}
			
		img.onmouseup = RadWindowNamespace.HideOverlayImage;//Hide in all cases!
							
		var oStyle = img.style;
		oStyle.display = "none";		
		oStyle.position = "absolute";
		oStyle.left = oStyle.top = "0px";		
						
		//TEKI The reason for the slow performance when Moving in Moz is the image! Better to remove it! But now in new Mozilla looks OK.
		//if (document.all)
		//{
			//If page is not loaded you cannot add elements to it
			if (null != document.readyState && "complete" != document.readyState)
			{		
				RadWindowNamespace.RadUtil_AttachEventEx(window, "load", function()
				{
					document.body.appendChild(img);
				});
			}
			else
			{
				document.body.appendChild(img);
			}
		//}		
				
		this.OverlayImage = img;
	}		
	return this.OverlayImage;
}

RadWindowNamespace.ShowOverlayImage = function(moveableObject)
{
	var overlayImage = RadWindowNamespace.GetOverlayImage();
		
	if (overlayImage)
	{
		var windowRect = RadWindowNamespace.RadUtil_GetBrowserInnerRect();
		
		var oStyle = overlayImage.style;		
		oStyle.display = "";						
		oStyle.width = parseInt(windowRect.width) + "px";
		oStyle.height = parseInt(windowRect.height) + "px";				
		oStyle.top  = RadWindowNamespace.RadGetScrollTop(overlayImage.ownerDocument);
		oStyle.left = RadWindowNamespace.RadGetScrollLeft(overlayImage.ownerDocument);
	
		//Set zIndex just as big as the one of the moved object!
		if (moveableObject && moveableObject.style.zIndex)
		{			
			var zIndex = moveableObject.style.zIndex;
			oStyle.zIndex = zIndex;
			moveableObject.style.zIndex = zIndex++;
		}
	}
};

RadWindowNamespace.HideOverlayImage = function(e)
{	
	var overlayImage = RadWindowNamespace.GetOverlayImage();
	if (overlayImage)
	{		
		overlayImage.style.display = "none";		
	}	
	RadWindowNamespace.GeneralMouseUp(e);//TEKI 
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