if (typeof(window.RadTabStripNamespace) == "undefined")
{
	window.RadTabStripNamespace = new Object();
};

RadTabStripNamespace.Box = 
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
		width -= this.GetHorizontalMarginValue(computedStyle);
		if (RadControlsNamespace.Browser.StandardsMode)
		{
		width -= this.GetHorizontalPaddingAndBorderValue(computedStyle);
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
		
		if (RadControlsNamespace.Browser.StandardsMode)
		{
			height -= this.GetVerticalPaddingAndBorderValue(computedStyle);
		}
		
		element.style.height = height + "px";
		
		var setHeight = this.GetOuterHeight(element);
		
		
		// ie table issue covered
		if (setHeight != intendedHeight)
		{
			var difference = (setHeight - intendedHeight);
			var newHeight = (intendedHeight - difference);
			
			if (newHeight > 0) 
			{
				element.style.height = newHeight + "px";
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
	}
}

//BEGIN_ATLAS_NOTIFY
if (typeof(Sys) != "undefined")
{
    if (Sys.Application != null && Sys.Application.notifyScriptLoaded != null)
    {
        Sys.Application.notifyScriptLoaded();
    }
}
//END_ATLAS_NOTIFY