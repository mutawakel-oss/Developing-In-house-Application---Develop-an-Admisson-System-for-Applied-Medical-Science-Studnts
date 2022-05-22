function RadMultiPage(id, pageViews)
{
	var oldInstance = window[id];
	if (oldInstance != null && typeof(oldInstance.Dispose) == "function")
	{
		oldInstance.Dispose();
	}
	
	this.DomElement = document.getElementById(id);
	this.PageViews = pageViews;
	this.HiddenInput = document.getElementById(id + "_Selected");
	this.PageView = null;
}

RadMultiPage.prototype.Dispose = function()
{
	if (this.disposed == null)
		return;
	this.disposed = true;
	
	this.DomElement = null;
	this.HiddenInput = null;
}

RadMultiPage.prototype.GetSelectedIndex = function ()
{
    return parseInt(this.HiddenInput.value);
};

RadMultiPage.prototype.GetPageViewDomElement = function (index)
{
    return document.getElementById(this.PageViews[index].ClientID);
};


RadMultiPage.prototype.Show = function (element)
{
	if (this.NavigateAfterClick) return;
	
	element.style.display = "block";
	
	var children = element.getElementsByTagName("*");
	
	for (var i = 0, length = children.length; i < length; i++)
	{
		var child = children[i];
		if (child.RadShow)
		{
			child.RadShow();
		}
	}
}

RadMultiPage.prototype.Hide = function (element)
{
	if (this.NavigateAfterClick) return;
	element.style.display = "none";
}

RadMultiPage.prototype.SelectPageById = function(id)
{
	if (id == "Null")
	{
		return; 
	}
	
    var selected = -1;
    for (var i = 0; i < this.PageViews.length; i ++)
    {
		var pageViewDomElement = this.GetPageViewDomElement(i);
        if (this.PageViews[i].ID == id)
        {
			if (pageViewDomElement)
			{
				this.Show(this.GetPageViewDomElement(i));
			}
            selected = i;
        }
        else
        {
			if (pageViewDomElement)
			{
				this.Hide(this.GetPageViewDomElement(i));
			}        
            
        }
    }
    this.HiddenInput.value = selected;
};

RadMultiPage.prototype.SelectPageByIndex = function(index)
{
	
	if (index >= this.PageViews.length) 
	{
	    return; 
	}

    for (var i = 0; i < this.PageViews.length; i ++)
    {
		var pageViewDomElement = this.GetPageViewDomElement(i);
		if (pageViewDomElement)
		{
			if (i == index)
			{
				this.Show(pageViewDomElement);
			}
			else
			{
				this.Hide(pageViewDomElement);
			}
		}
    }
    
    this.HiddenInput.value = index;
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