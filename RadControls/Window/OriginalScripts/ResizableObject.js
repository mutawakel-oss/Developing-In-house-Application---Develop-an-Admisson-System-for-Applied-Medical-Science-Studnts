RadWindowNamespace.ThresholdX = 5;
RadWindowNamespace.ThresholdY = 5;
/************************************************* 
 * Custom HTML attributes to mark a HTML element as Resizable object 
 *		- resize - [nsew] - allowed direction to resize (North|South|East|West); 
 *		- minWidth - smallest width allowed 
 *		- minHeight - smallest height allowed 
 *		- maxWidth - largest width allowed 
 *		- maxHeight - larges height allowed 
 *************************************************/
RadWindowNamespace.ResizableObject = 
{		
	EnableResize : true,
	
	InitResizeElemsArray : function()
	{		
		if (this.ResizeInitialized) return;
		else this.ResizeInitialized = true;
		
		//Here we are supposed to have an array of elements belonging 		
		this.ResizeCursors = ["nw-resize", "n-resize", "ne-resize", "w-resize","e-resize", "sw-resize", "s-resize", "se-resize"];
		
		/*						
		var oThis = this;		
		var attachHandler  = function(oElem, oCursor,  oNum)
		{
			oElem.onmousemove = 			
			function(e)	
			{
				oThis.LastCursor = oCursor;
				this.style.cursor = oCursor;
			};
		}*/
								
		var oElems = [];					
		
		oElems[0] = this.rows[0].cells[0];
		oElems[1] = this.rows[0].cells[1].getElementsByTagName("DIV")[0];
		oElems[2] = this.rows[0].cells[this.rows[0].cells.length-1];
		
		var row1 = this.rows[1].getElementsByTagName("TABLE")[0].rows[0];
		oElems[3] = row1.cells[0];		
		oElems[4] = row1.cells[2];
		
		var lastRow = this.rows[this.rows.length-1].getElementsByTagName("TABLE")[0].rows[0];
		oElems[5] = lastRow.cells[0];
		oElems[6] = lastRow.cells[1];
		oElems[7] = lastRow.cells[2];
						
		for (var i=0; i < oElems.length; i++)
		{				
			obj = oElems[i];		
			if (obj)
			{
				//attachHandler(obj, this.ResizeCursors[i], i+1);
				//Avoid memory leak				
				obj.style.cursor = this.ResizeCursors[i];
				//obj.style.border = "1px solid green";
			}									
		};			
		this.ResizeElems = oElems;		
	},
	
	GetComputedStyle : function( element, propertyName, pseudoElement) 
	{
		if (element.ownerDocument.defaultView && element.ownerDocument.defaultView.getComputedStyle) 
		{
			try
			{
				return element.ownerDocument.defaultView.getComputedStyle(element, pseudoElement || null)[propertyName];
			} catch(ev){};
		}
		else if (element && element.currentStyle) 
		{
			return element.currentStyle[propertyName];
		}
		return null;
	},
	
	
	CalcResizeDir2 : function (eventArgs, thresholdX, thresholdY)
	{
		if (!this.EnableResize) return "";
		var srcElem = eventArgs.srcElement ? eventArgs.srcElement : eventArgs.target;											
		this.InitResizeElemsArray();	
								
		var oCursor = this.LastCursor;
		this.LastCursor = "";
		//Avoid memory leak			
		//"default" value MUST be changed to empty!	
		var oCursor = this.GetComputedStyle(srcElem, "cursor");		
		if (!oCursor || oCursor == "default") oCursor = "";		
		return oCursor;		
	},
	
	CalcResizeDir : function (eventArgs, thresholdX, thresholdY)
	{	
		if (this.tagName == "TABLE")
		{		
			return this.CalcResizeDir2(eventArgs, thresholdX, thresholdY);
		}
	
		if (!this.EnableResize) return "";

		var srcElem = eventArgs.srcElement ? eventArgs.srcElement : eventArgs.target;
		if (srcElem!= this)	return "";
		
		var rc = this.GetRect();
		var resizeDir = "";
		
		if (null == thresholdX)
			thresholdX = RadWindowNamespace.ThresholdX;
			
		if (null == thresholdY)
			thresholdY = RadWindowNamespace.ThresholdY;
			
		var offsetX, offsetY;
		if (null != eventArgs.offsetY)
		{
			offsetX = eventArgs.offsetX;
			offsetY = eventArgs.offsetY;		
		}
		else if (null != eventArgs.layerY)
		{
			offsetX = eventArgs.layerX;
			offsetY = eventArgs.layerY;
		}
				
		// calculate vertical direction
		if (offsetY <= thresholdY
			&& this.AllowNorth)
		{
			resizeDir += "n";
		}
		else if ((rc.height - offsetY) <= thresholdY
				&& this.AllowSouth)
		{
			resizeDir += "s";
		}					
		
		if (offsetX <= thresholdX
			&& this.AllowWest)
		{
			resizeDir += "w";
		}
		else if ((rc.width - offsetX) <= thresholdX
				&& this.AllowEast)
		{
			resizeDir += "e";
		}						
		return ("" != resizeDir ? (resizeDir + "-resize") : "");
	},
	
	
	Resize  : function (eventArgs)
	{
		var dX = eventArgs.clientX - this.MouseX;
		var dY = eventArgs.clientY - this.MouseY;
		
		this.style.cursor = this.ResizeDir;
				
		switch (this.ResizeDir)
		{
			case "n-resize":
				this.Inflate(0, dY, null, null);
				break;
				
			case "s-resize":
				this.Inflate(0, 0, 0, dY);
				break;
				
			case "w-resize":
				this.Inflate(dX, 0, null, null);
				break;
				
			case "e-resize":
				this.Inflate(0, 0, dX, 0);
				break;
				
			case "ne-resize":
				this.Inflate(0, dY, dX, null);
				break;
				
			case "nw-resize":
				this.Inflate(dX, dY, null, null);
				break;
				
			case "se-resize":
				this.Inflate(0, 0, dX, dY);
				break;
				
			case "sw-resize":
				this.Inflate(dX, 0, null, dY);
				break;
				
			default:
				break;
		}
	},	
			
	Inflate  : function (offsetLeft, offsetTop, offsetWidth, offsetHeight)
	{
		var rc = this.GetRect();
		
		var top = rc.top + offsetTop;	
		var left = rc.left + offsetLeft;

		if (top < 0)
		{
			offsetTop = -rc.top;
		}
		
		if (left < 0)
		{
			offsetLeft = -rc.left;
		}
		
		top = rc.top + offsetTop;	
		left = rc.left + offsetLeft;
		
		if (null == offsetWidth)
			offsetWidth = -offsetLeft;
		
		if (null == offsetHeight)
			offsetHeight = -offsetTop;
			
		var width = rc.width + offsetWidth;
		var height = rc.height + offsetHeight;
		
		width = Math.max(this.MinWidth, width);
		width = Math.min(this.MaxWidth, width);
		
		height = Math.max(this.MinHeight, height);
		height = Math.min(this.MaxHeight, height);
		
		var targetElement = (this.DragHelper ? this.DragHelper : this);
		if (rc.width != width && width  > 5)
		{		
			targetElement.MoveBy(offsetLeft, 0);
			targetElement.SetSize(width, null);
		}
		
		if (rc.height != height && height > 5)
		{			
			targetElement.MoveBy(0, offsetTop);	
			targetElement.SetSize(null, height);
		}
	},				
	
	
	SetResizeDirs : function (resizeFlags)
	{
		this.AllowNorth = (-1 != resizeFlags.indexOf("n"));
		this.AllowSouth = (-1 != resizeFlags.indexOf("s"));
		this.AllowEast  = (-1 != resizeFlags.indexOf("e"));
		this.AllowWest  = (-1 != resizeFlags.indexOf("w"));
	},
		
	InitResize : function ()
	{
		//Allowed resize directions
		var resizeFlags = this.getAttribute("resize");
		if ("string" == typeof(resizeFlags))
		{
			resizeFlags = resizeFlags.toLowerCase();
		}
		else
		{
			resizeFlags = "nsew";
		}
		
		this.SetResizeDirs(resizeFlags);
		
		//min/max allowed width
		this.MinWidth = RadWindowNamespace.RadUtil_GetIntValue(this.getAttribute("minWidth"));
		this.MaxWidth = RadWindowNamespace.RadUtil_GetIntValue(this.getAttribute("maxWidth"), 100000);
		
		//min/max allowed height
		this.MinHeight = RadWindowNamespace.RadUtil_GetIntValue(this.getAttribute("minHeight"));
		this.MaxHeight = RadWindowNamespace.RadUtil_GetIntValue(this.getAttribute("maxHeight"), 100000);
	}	
	/*,
	DisableResize : function()
	{
		this.onmousemove = null;		
		this.CalcResizeDir = null;
		this.Resize = null;	
		this.Inflate = null;
		this.InitResize = null;
		this.SetResizeDirs = null;
		
		this.AllowNorth = null;
		this.AllowSouth = null;
		this.AllowEast = null;
		this.AllowWest = null;
		this.MinWidth = null;
		this.MaxWidth = null;
		this.MinHeight = null;
		this.MaxHeight = null;
	}*/
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