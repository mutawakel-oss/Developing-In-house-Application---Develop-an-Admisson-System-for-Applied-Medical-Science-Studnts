<%@ Page Language="C#" AutoEventWireup="true" CodeFile="t_c.aspx.cs" Inherits="t_c" %>
<%@ Register TagPrefix="radp" Namespace="Telerik.WebControls" Assembly="RadPanelbar.NET2" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>شروط القبول</title>
</head>
<body dir=rtl>
    <form id="form1" dir=rtl runat="server">
       <radp:RadPanelbar ID="RadPanelbar2" runat="server" Skin="Default" Width="100%">
                    <Items>
                        <radp:RadPanelItem runat="server" Value="per_info" Text="Terms and Condition">
                        <ItemTemplate><br />
                            <asp:Table  Font-Names="Traditional Arabic" Font-Size=medium Font-Bold=true ID="tb_terms" runat="server">
                                <asp:TableRow BackColor=ghostwhite >
                                    <asp:TableCell Font-Bold=true VerticalAlign=middle>1</asp:TableCell>
                                    <asp:TableCell VerticalAlign=top><br />
                                    أن يكون المتقدم سعودي الجنسية وحاصل على درجة البكالريوس تخصص علوم من احدى الجامعات السعودية أو جامعة اخرى معترف بها
                                    <br />&nbsp;
                                    </asp:TableCell>
                                </asp:TableRow>
                                <asp:TableRow >
                                    <asp:TableCell Font-Bold=true VerticalAlign=middle>2</asp:TableCell>
                                    <asp:TableCell ><br />
                                     أن يكون المتقدم حديث التخرج بحيث لا تزيد مدة حصوله على شهادة البكالوريوس من جامعة معترف بها عن 3 سنوات وبتقدير لايقل عن جيد مرتفع ومعدل تراكمي 3.5 من 5 أو 2.5 من 4 أو 75%
                                    <br />&nbsp;
                                    </asp:TableCell>
                                </asp:TableRow>
                                
                                <asp:TableRow BackColor=ghostwhite>
                                    <asp:TableCell Font-Bold=true VerticalAlign=middle>3</asp:TableCell>
                                    <asp:TableCell BackColor=ghostwhite><br />
                                        ان يجتاز امتحانات القبول  والمقابلة الشخصية والكشف الطبي
                                    <br />&nbsp;
                                    </asp:TableCell>
                                </asp:TableRow>
                                
                                
                                
                                <asp:TableRow >
                                    <asp:TableCell Font-Bold=true VerticalAlign=middle>4</asp:TableCell>
                                    <asp:TableCell ><br />
                                        أن يقوم بتعبئة نموذج الالتحاق في الوقت المحدد عبر الموقع الإلكتروني
                                    <br />&nbsp;
                                    </asp:TableCell>
                                </asp:TableRow>
                                
                                 <asp:TableRow BackColor=ghostwhite>
                                    <asp:TableCell Font-Bold=true VerticalAlign=middle>5</asp:TableCell>
                                    <asp:TableCell  ><br />
                                       يتم القبول حسب المفاضلة وتوفر المقاعد
                                    <br />&nbsp;
                                    </asp:TableCell>
                                </asp:TableRow>
                                
                            </asp:Table>
                        </ItemTemplate>
                        </radp:RadPanelItem>
                        </Items>
                        </radp:RadPanelbar>
   
    </form>
</body>
</html>
