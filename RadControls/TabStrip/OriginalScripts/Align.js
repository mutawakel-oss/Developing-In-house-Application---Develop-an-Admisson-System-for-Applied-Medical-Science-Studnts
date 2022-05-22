if (typeof(window.RadTabStripNamespace) == "undefined")
{
	window.RadTabStripNamespace = new Object();
};


RadTabStripNamespace.ItemGroup = function (sizeProperty, sizeMethod)
{
	this.Size = 0;
	this.ExpandableSize = 0;
	this.FixedSize = 0;
	this.Items = [];
    this.SizeMethod = sizeMethod;
    this.SizeProperty = sizeProperty;
}

RadTabStripNamespace.ItemGroup.prototype.RegisterItem = function (item, skipFixedSize)
{
	var isSeparator = item.className.indexOf("separator") > -1;
	if (isSeparator)
	{
		skipFixedSize = true;
	}
	else
	{
		item = item.firstChild;
	}
	
	this.Size += RadTabStripNamespace.Box[this.SizeMethod](item);

	if (isSeparator || (skipFixedSize && item.firstChild.firstChild.style[this.SizeProperty]))
	{
		this.FixedSize += RadTabStripNamespace.Box[this.SizeMethod](item);

		return;
	}

	this.ExpandableSize += RadTabStripNamespace.Box[this.SizeMethod](item); 		
	this.Items[this.Items.length] = item;
}



RadTabStripNamespace.Align = function (element, orientation, skipFixedSize)
{
	this.Element = element;
	this.ItemGroups = [];
	if (orientation == "horizontal")
	{
		this.OuterSizeMethod = "GetOuterWidth";
		this.InnerSizeMethod = "GetInnerWidth";
		this.SetSizeMethod = "SetOuterWidth";
		this.OffsetProperty = "offsetTop";
		this.SizeProperty = "width";
	}
	else
	{
		this.OuterSizeMethod = "GetOuterHeight";
		this.InnerSizeMethod = "GetInnerHeight";
		this.SetSizeMethod = "SetOuterHeight";
		this.OffsetProperty = "offsetLeft";
		this.SizeProperty = "height";
	}
	
	this.SkipFixedSize = skipFixedSize;
	
	if (!this.Element.ItemGroups)
	{
		this.BuildItemGroups();
		this.Element.ItemGroups = this.ItemGroups;
	}
	else
	{
		this.ItemGroups = this.Element.ItemGroups;
	}
}

RadTabStripNamespace.Align.prototype.CreateItemGroup = function ()
{
	return new RadTabStripNamespace.ItemGroup(this.SizeProperty, this.OuterSizeMethod);
}

RadTabStripNamespace.Align.prototype.BuildItemGroups = function ()
{
	var textNodeType = 3;
	var children = this.Element.childNodes;
	var groupIndex = 0;

	var groupOffset = -1;
	this.ItemGroups[0] = this.CreateItemGroup();    
	for (var i = 0; i < children.length; i ++)
	{
		var item = children[i];
	    var itemOffset = item[this.OffsetProperty];
		if (item.nodeType == textNodeType) 
		{ 
			continue; 
		}
	    
		if (groupOffset == -1)
		{
			groupOffset = itemOffset;
		}
	    
		if (itemOffset > groupOffset + 1)
		{
			groupIndex ++;
			this.ItemGroups[groupIndex] = this.CreateItemGroup();
			groupOffset = itemOffset;
		}
		
		this.ItemGroups[groupIndex].RegisterItem(item);
	}
	
	this.CalculateItemSizePercentage();
}
	
RadTabStripNamespace.Align.prototype.CalculateItemSizePercentage = function ()
{
	for (var j = 0; j < this.ItemGroups.length; j ++)
	{
		var group = this.ItemGroups[j];
		for (var i = 0; i < group.Items.length; i ++)
		{
			var item = group.Items[i];
			if (this.SkipFixedSize && item.style[this.SizeProperty])
			{
				continue; 
			}
			
			var outerItemSize = RadTabStripNamespace.Box[this.OuterSizeMethod](item);
			var innerItemSize = RadTabStripNamespace.Box[this.OuterSizeMethod](item.firstChild.firstChild);
			
			if (group.ExpandableSize == 0)
			{
				item.Percentage = 0;
			}
			else
			{
				item.Percentage =  outerItemSize / group.ExpandableSize;
			}
			item.PaddingDiff = outerItemSize - innerItemSize;
		}
	}	
}

RadTabStripNamespace.Align.prototype.InterateOverRows = function (closure)
{
	var wrapWidth = RadTabStripNamespace.Box[this.InnerSizeMethod](this.Element);
	for (var j = 0; j < this.ItemGroups.length; j ++)
	{
		if (!this.ItemGroups[j].Items.length) continue;
		closure(this.ItemGroups[j], wrapWidth);
	}
}


// static methods

RadTabStripNamespace.Align.Justify = function (element)
{
	var align = new RadTabStripNamespace.Align(element, "horizontal", true);
	var closure = function (row, wrapWidth)
	{
		for (var i = 0; i < row.Items.length; i ++)
		{
			var item = row.Items[i];
			var newWidth = item.Percentage * (wrapWidth - row.FixedSize) - item.PaddingDiff;
			var innerMostElement = item.firstChild.firstChild;
			RadTabStripNamespace.Box.SetOuterWidth(innerMostElement, Math.floor(newWidth));
		}
	};
	align.InterateOverRows (closure);
}



RadTabStripNamespace.Align.Right = function (element)
{
	var align = new RadTabStripNamespace.Align(element, "horizontal");
	var closure = function (row, wrapWidth)
	{
		var firstItem = row.Items[0];
	    
		firstItem.style.marginLeft = (wrapWidth - row.Size - 1) + "px";
		firstItem.style.cssText = firstItem.style.cssText;
	}
	align.InterateOverRows (closure);
}



RadTabStripNamespace.Align.Center = function (element)
{
	var align = new RadTabStripNamespace.Align(element, "horizontal");
	var closure = function (row, wrapWidth)
	{
		var firstItem = row.Items[0];
		var margin = Math.floor((wrapWidth - row.Size) / 2) + "px"
		firstItem.style.marginLeft = margin;
		firstItem.style.cssText = firstItem.style.cssText;
	}
	align.InterateOverRows (closure);
}

RadTabStripNamespace.Align.VJustify = function (element)
{
	var align = new RadTabStripNamespace.Align(element, "vertical", true);
	var closure = function (row, wrapHeight)
	{
		for (var i = 0; i < row.Items.length; i ++)
		{
			var item = row.Items[i];
			var newHeight = item.Percentage * (wrapHeight - row.FixedSize) - item.PaddingDiff;
			var innerMostElement = item.firstChild.firstChild;
			RadTabStripNamespace.Box.SetOuterHeight(innerMostElement, Math.floor(newHeight));
		}
	};
	align.InterateOverRows (closure);
}

RadTabStripNamespace.Align.Bottom = function (element)
{
	var align = new RadTabStripNamespace.Align(element, "vertical");
	var closure = function (row, wrapHeight)
	{
		var firstItem = row.Items[0];
	    
		firstItem.style.marginTop = (wrapHeight - row.Size - 1) + "px";
	}
	align.InterateOverRows (closure);
}

RadTabStripNamespace.Align.Middle = function (element)
{
	var align = new RadTabStripNamespace.Align(element, "vertical");
	var closure = function (row, wrapHeight)
	{
		var firstItem = row.Items[0];
		var margin = Math.floor((wrapHeight - row.Size) / 2) + "px"
		firstItem.style.marginTop = margin;
	}
	align.InterateOverRows (closure);
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