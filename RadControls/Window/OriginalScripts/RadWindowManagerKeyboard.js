/*************************************************************************************************************
*						Shortcut related code
**************************************************************************************************************/
RadWindowManagerClass.prototype.EnableShortcuts = function (oShortcutArray)
{			
	/*	//Shortcuts are a key-value collection passed as an argument! Default settings set from the server 
		oShortcutArray = [
			["FocusNextWindow","CTRL+TAB"],			
			["EscapeActiveWindow","ESC"]
		];
	}*/		
	try
	{
		this.KeyboardManager = {};
		Object.Extend(this.KeyboardManager, RadWindowNamespace.RadWindowKeyboardManager);
		
		for (var i=0; i < oShortcutArray.length; i++)
		{
			this.AddShortcut(oShortcutArray[i][0],oShortcutArray[i][1]);
		}		
		var oManager = this;
		RadWindowNamespace.RadUtil_AttachEventEx(document, "keydown", function(eventArgs) {oManager.OnKeyDown(eventArgs); });	
	}
	catch(e){;};	
};


RadWindowManagerClass.prototype.OnKeyDown = function(eventArgs)
{	
	var srcElement = RadWindowNamespace.RadUtil_GetEventSource(eventArgs);
	if (this.KeyboardManager && srcElement)
	{
		var shortCut = this.KeyboardManager.HitTest(eventArgs.keyCode
										, eventArgs.ctrlKey
										, (null != eventArgs.ctrlLeft ? eventArgs.ctrlLeft : eventArgs.ctrlKey)
										, eventArgs.shiftKey
										, (null != eventArgs.shiftLeft ? eventArgs.shiftLeft : eventArgs.shiftKey)
										, eventArgs.altKey
										, (null != eventArgs.altLeft ? eventArgs.altLeft : eventArgs.altKey));						
		if (null != shortCut)
		{				
			this.Fire(shortCut.Name);
			RadWindowNamespace.RadUtil_CancelEvent(eventArgs);
		}		
	}
};

RadWindowManagerClass.prototype.AddShortcut = function(shortcutName, shortcutString)
{
	if (this.KeyboardManager)
	{
		this.KeyboardManager.AddShortcut(shortcutName, shortcutString);
	}
};

RadWindowManagerClass.prototype.RemoveShortcut = function(shortcutName)
{
	if (this.KeyboardManager)
	{
		this.KeyboardManager.RemoveShortcut(shortcutName);
	}
};

RadWindowManagerClass.prototype.SetShortcut = function(shortcutName, shortcutString)
{
	if (this.KeyboardManager)
	{
		this.KeyboardManager.SetShortcut(shortcutName, shortcutString);
	}
};

/************************************************
 *
 *	RadWindowKeyboardManager class
 *
 ************************************************/
RadWindowNamespace.RadWindowKeyboardManager = 
{
	Shortcuts : [],
	
	Dispose : function()
	{		
		this.Shortcuts = null;
	},
	
	AddShortcut : function(shortcutName, shortcutString)
	{
		var rs = new RadWindowNamespace.RadShortcut(shortcutName, shortcutString);
		rs.HashValue = this.GetShortcutHashValue(rs);
		
		this.Shortcuts[rs.HashValue] = rs;
	},
	
	
	RemoveShortcut : function(shortcutName)
	{
		var shortcut = this.FindByName(shortcutName);
		if (shortcut)
		{
			this.Shortcuts[shortcut.HashValue] = null;
		}
	},
	
	SetShortcut : function(shortcutName, shortcutString)
	{
		this.RemoveShortcut(shortcutName);
		this.AddShortcut(shortcutName, shortcutString);
	},
	
	
	HitTest : function(keyCode, ctrlKey, leftCtrlKey, shiftKey, leftShiftKey, altKey, leftAltKey)
	{
		var hashValue = this.GetHashValue(keyCode
											, ctrlKey
											, leftCtrlKey
											, shiftKey
											, leftShiftKey
											, altKey
											, leftAltKey);
		return this.Shortcuts[hashValue];
	},
	

	GetHashValue : function(keyCode
						, ctrlKey, leftCtrlKey
						, shiftKey, leftShiftKey
						, altKey, leftAltKey)
	{
		var value = keyCode & 0xFFFF;		
		var flags = 0;	
		flags |= (ctrlKey	? RadWindowNamespace.KF_CTRL	: 0);	
		flags |= (shiftKey	? RadWindowNamespace.KF_SHIFT	: 0);	
		flags |= (altKey	? RadWindowNamespace.KF_LSHIFT	: 0);
		value |= (flags << 16);	
		return value;
	},
	

	GetShortcutHashValue : function(radShortcut)
	{
		return this.GetHashValue(radShortcut.KeyCode,		
								radShortcut.CtrlKey, radShortcut.LeftCtrlKey,							
								radShortcut.ShiftKey, radShortcut.LeftShiftKey,							
								radShortcut.AltKey, radShortcut.LeftAltKey);
	},	
	
	FindByName : function(shortcutName)
	{
		var shortcut;
		for (var shortcutKey in this.Shortcuts)
		{			
			shortcut = this.Shortcuts[shortcutKey];		
			if (null != shortcut			
				&& shortcut.Name == shortcutName)
			{
				return shortcut;
			}			
		}
		return null;
	}	
};


/************************************************
 *	Key flags
 ************************************************/
RadWindowNamespace.KF_CTRL		= (1 << 0);
RadWindowNamespace.KF_CTRL		= (1 << 1);
RadWindowNamespace.KF_SHIFT		= (1 << 2);
RadWindowNamespace.KF_LSHIFT	= (1 << 3);
RadWindowNamespace.KF_LSHIFT	= (1 << 4);
RadWindowNamespace.KF_LALT		= (1 << 5);

/************************************************
 *
 *	RadShortcut class
 *
 ************************************************/
RadWindowNamespace.RadShortcut = function (shortcutName, shortcutString)
{
	this.CtrlKey		= false;
	this.ShiftKey		= false;
	this.AltKey		= false;
	this.KeyCode		= 0;
	this.Name = shortcutName;	
	this.ParseShortcutString(shortcutString);
};


RadWindowNamespace.RadShortcut.prototype.ParseShortcutString = function(shortcutString)
{
	if ("string" == typeof(shortcutString))
	{
		this.CtrlKey		= false;
		this.LeftCtrlKey	= false;		
		this.ShiftKey		= false;
		this.LeftShiftKey	= false;		
		this.AltKey			= false;
		this.LeftAltKey		= false;		
		this.KeyCode		= 0;
	
		shortcutString = shortcutString.replace(/\s*/gi, "");	// strip all WS
		shortcutString = shortcutString.replace(/\+\+/gi, "+PLUS");	//++ --> +PLUS
		
		var tokens = shortcutString.split("+");
		var token = "";
		for (var i = 0; i < tokens.length; i++)
		{
			token = tokens[i].toUpperCase();			
			switch (token)
			{
				case "LCTRL": 
					this.LeftCtrlKey = true;
				case "CTRL":
					this.CtrlKey = true;		
					break;
								
				case "LSHIFT":		
					this.LeftShiftKey = true;	
				case "SHIFT":	
					this.ShiftKey = true;	
					break;
				
				case "LALT":	
					this.LeftAltKey = true;		
				case "ALT":		
					this.AltKey = true;
					break;
			
				case "F1":	this.KeyCode = 112; break;
				case "F2":	this.KeyCode = 113; break;
				case "F3":	this.KeyCode = 114; break;
				case "F4":	this.KeyCode = 115; break;
				case "F5":	this.KeyCode = 116; break;
				case "F6":	this.KeyCode = 117; break;
				case "F7":	this.KeyCode = 118; break;
				case "F8":	this.KeyCode = 119; break;
				case "F9":	this.KeyCode = 120; break;
				case "F10":	this.KeyCode = 121; break;
				case "F11":	this.KeyCode = 122; break;
				case "F12":	this.KeyCode = 123; break;					
				case "ENTER":		this.KeyCode = 13; break;
				case "HOME":		this.KeyCode = 36; break;
				case "END":			this.KeyCode = 35; break;
				case "LEFT":		this.KeyCode = 37; break;
				case "RIGHT":		this.KeyCode = 39; break;
				case "UP":			this.KeyCode = 38; break;
				case "DOWN":		this.KeyCode = 40; break;
				case "PAGEUP":		this.KeyCode = 33; break;
				case "PAGEDOWN":	this.KeyCode = 34; break;				
				case "SPACE":		this.KeyCode = 32; break;
				case "TAB":			this.KeyCode = 9; break;
				case "BACK":		this.KeyCode = 8; break;
				case "CONTEXT":		this.KeyCode = 93; break;	
				
				case "ESCAPE":
				case "ESC":
					this.KeyCode = 27; 
					break;
				
				case "DELETE":	
				case "DEL":		
					this.KeyCode = 46; 
					break;
				
				case "INSERT":	
				case "INS":
					this.KeyCode = 45; 
					break;
					
				case "PLUS":
					this.KeyCode = "+".charCodeAt(0);
					break;
				
				default:
					this.KeyCode = token.charCodeAt(0);
					break;
			}
		}
	}
	else
	{
		throw { description : "Invalid shortcut string" };
	}
};

/*
RadWindowNamespace.RadShortcut.prototype.ToString = function()
{
	var str = this.Name + " : ";
	
	if (this.CtrlKey)
	{
		str += "CTRL+";
	}
		
	if (this.LeftCtrlKey)
	{
		str += "LCTRL+";
	}
	
	if (this.ShiftKey)
	{
		str += "SHIFT+";
	}
	
	if (this.LeftShiftKey)
	{
		str += "LSHIFT+";
	}
	
	if (this.AltKey)
	{
		str += "ALT+";
	}
	
	if (this.LeftAltKey)
	{
		str += "LALT+";
	}
	
	if (this.KeyCode)
	{
		str += this.KeyCode;
	}
	
	str += " [" + this.HashValue + "]";
	
	return str;
};*/

//BEGIN_ATLAS_NOTIFY
if (typeof(Sys) != "undefined")
{
    if (Sys.Application != null && Sys.Application.notifyScriptLoaded != null)
    {
        Sys.Application.notifyScriptLoaded();
    }
}
//END_ATLAS_NOTIFY