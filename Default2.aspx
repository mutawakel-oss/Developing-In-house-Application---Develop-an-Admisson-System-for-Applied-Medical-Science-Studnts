<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default2.aspx.cs" Inherits="Default2" %>
<%@ Register TagPrefix="radp" Namespace="Telerik.WebControls" Assembly="RadPanelbar.NET2" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title>تعهد و إقرار</title>
    <link href="StyleSheet.css" rel="stylesheet" type="text/css" />
</head>
<body dir=rtl  style="background-color:DimGray">
    <form id="form1"  runat="server">
    <asp:ScriptManager ID="script_man" runat="server"></asp:ScriptManager>
    <div align=center id="" dir=rtl>
           
            
			<div id="body"   >	  <img  id="Img1" src="Images/lastcopy.gif" runat="server" /> 
			
			<div id="user_assistance" style="height:100%">
					<table  cellpadding="0" cellspacing="0"  class="top table_window">
        <tr >
          <td class="dialog_nw"></td>
          <td class="dialog_n">
          <div  class="dialog_title title_window"><b>
          </b></div></td>
          <td class="dialog_ne">Menus</td>
        </tr>        
      </table>
                 <br />                           
              
               <radp:RadPanelbar ID="RadPanelbar1" CausesValidation=False  runat="server" Skin="Default" Width="99%">
                    <Items>
                        <radp:RadPanelItem   runat="server" Font-Bold=True Value="menus" Text="&#160;">
                        <ItemTemplate>
                             <asp:LinkButton ID="lnkhome" CausesValidation=false Text="الصفحة الرئيسية" runat="server" OnClick="GotoHome"></asp:LinkButton>
                             <br />
                                <asp:LinkButton ID="lnkLogout" CausesValidation=false  Text="تسجيل الخروج" runat="server" OnClick="GoLogout"></asp:LinkButton>
              
                        </ItemTemplate>
                        </radp:RadPanelItem>
                       </Items>
                </radp:RadPanelbar>
			</div>
		    <div align=center id="col_main_right" dir=rtl >
			   
			   	   
			     <radp:RadPanelbar ID="RadPanelbar2" runat="server" Skin="Default" Width="98%">
                    <Items>
                        <radp:RadPanelItem runat="server" Value="per_info" Text="Welcome..">
                        <ItemTemplate><br />
                         <asp:Table Font-Size=Small ID="table_user" runat="server" Width="98%">
                            <asp:TableRow BackColor="ghostWhite">
                                <asp:TableCell  VerticalAlign=Middle>
                                    عزيزي المتقدم ، إن حالة طلبك الحالية هي: <asp:Label Font-Bold=true ForeColor=red ID="lblCurrentstats" runat="server">
                                    
                                    </asp:Label> <br /><br />
                                </asp:TableCell>
                            </asp:TableRow>
                            
                            <asp:TableRow>
                                <asp:TableCell>
                                    <asp:LinkButton ID="lnkProfile" OnClick="PBack" runat="server" 
                                    Text="لتغيير ملفك الشخصي اضغط هنا"></asp:LinkButton>
                                </asp:TableCell>
                            </asp:TableRow>
                            
                         
                            
                         </asp:Table>  
                        </ItemTemplate>
                        </radp:RadPanelItem>
                        </Items>
                        </radp:RadPanelbar>
                        <br />
                      
			</div>
		    </div>  
        </div>
        
        
    
    </form>
</body>
</html>
