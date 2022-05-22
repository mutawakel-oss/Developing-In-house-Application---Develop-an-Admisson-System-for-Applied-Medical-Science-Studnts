//Copy this code to a (child) page where you want to access its (parent)radWindow

//The RadWindow object can be used to 
//1) read arguments
//2) set status, size, anything
//3) set a return value and close the window. 
//Will replace the current cumbersome RadWindow mechanism 
/*
function GetRadWindow()
{
	var oWindow = null;
	if (window.radWindow) oWindow = window.radWindow; //Will work in Moz in all cases, including clasic dialog
	else if (window.frameElement.radWindow) oWindow = window.frameElement.radWindow;//IE (and Moz az well)
				
	return oWindow;
}
*/