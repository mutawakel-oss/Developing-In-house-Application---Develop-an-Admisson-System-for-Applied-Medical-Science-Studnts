if (typeof window.RadControlsNamespace == "undefined")
{
	window.RadControlsNamespace = {};
}

RadControlsNamespace.DomEventsMixin = function() {};
RadControlsNamespace.DomEventsMixin.Initialize = function(obj)
{
	obj.AttachDomEvent = this.AttachDomEvent;
	obj.DetachDomEvent = this.DetachDomEvent;
	obj.DisposeDomEvents = this.DisposeDomEvents;
	obj.ClearEventPointers = this.ClearEventPointers;
	obj.RegisterForAutomaticDisposal = this.RegisterForAutomaticDisposal;
	obj.AutomaticDispose = this.AutomaticDispose;
	obj.CreateEventHandler = this.CreateEventHandler;
	obj.private_AttachDomEvent = this.private_AttachDomEvent;
	obj.ClearEventPointers();
};

RadControlsNamespace.DomEventsMixin.CreateEventHandler = function (methodName)
{
	var instance = this;
	return function (e)
	{
		if (!e) e = window.event;
		return instance[methodName](e);
	}
};

RadControlsNamespace.DomEventsMixin.AttachDomEvent = function(domElement, eventName, eventHandlerName)
{
	var eventHandler = this.CreateEventHandler(eventHandlerName);
	this._eventPointers[this._eventPointers.length] = [domElement, eventName, eventHandler];
	this.private_AttachDomEvent(domElement, eventName, eventHandler);
};

RadControlsNamespace.DomEventsMixin.private_AttachDomEvent = function(domElement, eventName, eventHandler)
{
	if (domElement.attachEvent)
	{
		domElement.attachEvent("on" + eventName, eventHandler);
	}
	else if (domElement.addEventListener)
	{
		domElement.addEventListener(eventName, eventHandler, false);
	}
};

RadControlsNamespace.DomEventsMixin.DetachDomEvent = function(domElement, eventName, eventHandler)
{
    if (domElement.detachEvent)
    {
        domElement.detachEvent("on" + eventName, eventHandler);
    }
};

RadControlsNamespace.DomEventsMixin.DisposeDomEvents = function()
{
    for (var i=0; i<this._eventPointers.length; i++)
    {
        this.DetachDomEvent(this._eventPointers[i][0],this._eventPointers[i][1],this._eventPointers[i][2]);
    }
    this.ClearEventPointers();
};

RadControlsNamespace.DomEventsMixin.RegisterForAutomaticDisposal = function(customDisposeFunctionName)
{
	var me = this;
	var customDisposeFunction = this.CreateEventHandler(customDisposeFunctionName);
	var automaticDispose = function()
				{
					customDisposeFunction();
					me.DisposeDomEvents();
					me = null;
				};
	this.private_AttachDomEvent(window, "unload", automaticDispose);
};

RadControlsNamespace.DomEventsMixin.ClearEventPointers = function()
{
	this._eventPointers = [];
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