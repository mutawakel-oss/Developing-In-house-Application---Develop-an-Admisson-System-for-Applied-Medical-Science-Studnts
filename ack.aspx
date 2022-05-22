<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ack.aspx.cs" Inherits="ack" %>
<%@ Register TagPrefix="radp" Namespace="Telerik.WebControls" Assembly="RadPanelbar.NET2" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>تعهد و إقرار</title>
</head>
<body dir=rtl  style="background-color:DimGray">
    <form id="form1"  runat="server">
    <asp:ScriptManager ID="script_man" runat="server"></asp:ScriptManager>
    <div align=center id="" dir=rtl>
			<div id="body"   >	  
			<img  id="Img1" src="Images/lastcopy.gif" runat="server" /> 
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
               
			</div>
		    <div id="col_main_right" align="left">
			     <radp:RadPanelbar ID="RadPanelbar2" runat="server" Skin="Default" Width="98%">
                    <Items>
                        <radp:RadPanelItem runat="server" Value="per_info" Text="تعهد و إقرار">
                        <ItemTemplate><br />
                            <asp:Table  Font-Names="Tahoma" Width="100%" Font-Size=10  ID="tb_terms" runat="server">
                             <asp:TableRow >
                                    <asp:TableCell ColumnSpan=2  VerticalAlign=middle>أقر أنا الطالب:&nbsp;&nbsp;&nbsp;
                                    <asp:Label ID="lblFullName" runat="server" Text="أقر أنا الطالب"> </asp:Label>
                                    </asp:TableCell>
                                    </asp:TableRow>
                                <asp:TableRow BackColor=ghostwhite >
                                    <asp:TableCell  VerticalAlign=middle>1</asp:TableCell>
                                    <asp:TableCell VerticalAlign=top>
                                    أنني على علم بأن استلام قسم القبول والتسجيل لملفي لا يعني قبولي في البرنامج لأن ذلك مروهن بانطباق الشروط وتوافر
المقاعد والمنافسة المطبقة للقبول بالبرنامج.

                                    </asp:TableCell>
                                </asp:TableRow>
                                <asp:TableRow >
                                    <asp:TableCell  VerticalAlign=middle>2</asp:TableCell>
                                    <asp:TableCell >
                                         أنني على علم بأنه سيتم تسجيل مقررات المستوى الدراسي آلياً في بداية الفصل الدراسي و أن ألتزم بالدراسة وا لانتظام و
تأدية الامتحان فيها أو الاعتذار عن الفصل ( حسب اللوائح المعلنة ) وإلا أعد راسباً في تلك المقررات.

                                    </asp:TableCell>
                                </asp:TableRow>
                                
                                <asp:TableRow BackColor=ghostwhite>
                                    <asp:TableCell  VerticalAlign=middle>3</asp:TableCell>
                                    <asp:TableCell BackColor=ghostwhite>
                                    أتعهد بالمحافظة على جميع مقتنيات الجامعة والمستشفى من مبان و أجهزة وغيرها و خصوصاً الأجهزة والأدوات والمواد
في المختبرات و أوعية المعلومات في المكتبة و في حالة مخالفتي فللجامعة اتخاذ ما تراه من عقوبة حسب أنظمتها.

                                    </asp:TableCell>
                                </asp:TableRow>
                                
                                
                                
                                <asp:TableRow >
                                    <asp:TableCell  VerticalAlign=middle>4</asp:TableCell>
                                    <asp:TableCell >أتعهد بأن أكون حسن السيرة والسلوك و أن أتقيد بأنظمة ولوائح الجامعة.
                                    </asp:TableCell>
                                </asp:TableRow>
                                
                                 <asp:TableRow BackColor=ghostwhite>
                                    <asp:TableCell  VerticalAlign=middle>5</asp:TableCell>
                                    <asp:TableCell  >
                                    
                                    أتعهد بأن امتنع عن التدخين داخل الجامعة والمستشفى وللجامعة الحق في اتخاذ ما يلزم إذا حدث خلاف ذلك.
                                    </asp:TableCell>
                                </asp:TableRow>
                                
                                <asp:TableRow >
                                    <asp:TableCell  VerticalAlign=middle>6</asp:TableCell>
                                    <asp:TableCell >أتعهد بأنه لم يسبق لي أن فصلت من الدراسة أو العمل ولم أرتكب أية مخالفة جنائية.
                                    </asp:TableCell>
                                </asp:TableRow>
                                
                                
                                <asp:TableRow BackColor=ghostwhite>
                                    <asp:TableCell  VerticalAlign=middle>7</asp:TableCell>
                                    <asp:TableCell  >
                                    
                                   أتعهد بأنني لست موظفاً أو طالباً في جهة أخرى و إذا كنت موظفاً فسوف أتفرغ كلياً للدراسة و أن أحضر موافقة خطية من
مرجعي بالتفرغ لذلك في حالة قبولي في البرنامج، وإذا ثبت خلاف ذلك فللجامعة اتخاذ الإجراءات النظامية التي تراها.

                                    </asp:TableCell>
                                </asp:TableRow>
                                
                                 <asp:TableRow >
                                    <asp:TableCell VerticalAlign=middle>8</asp:TableCell>
                                    <asp:TableCell >أتعهد بأنه في حالة تغير أي من المعلومات المدرجة ضمن هذا الطلب ( وخاصة الحالة الوظيفية ) أن أقوم ( خطياً ) بإبلاغ
قسم القبول والتسجيل لاتخاذ اللازم و إذا ثبت خلاف ذلك فإن للجامعة الحق في اتخاذ ما تراه مناسباً.

                                    </asp:TableCell>
                                </asp:TableRow>
                                
                                
                                <asp:TableRow BackColor=ghostwhite>
                                    <asp:TableCell  VerticalAlign=middle>9</asp:TableCell>
                                    <asp:TableCell  >
                                    أتعهد بصحة جميع البيانات ا لتي دونتها في هذا الطلب وإذا تبين خلاف ذلك لأي معلومة من المعلومات فيعتبر هذا الطلب
وكل ما يترتب عليه لاغياً و للجامعة الحق،باتخاذ ما تراه نظاماً.

                                    </asp:TableCell>
                                </asp:TableRow>
                                
                            </asp:Table>
                        </ItemTemplate>
                        </radp:RadPanelItem>
                        </Items>
                        </radp:RadPanelbar>
                        <br />
                        <asp:UpdatePanel ID="upd_check" runat="server" ChildrenAsTriggers=true>
                        <ContentTemplate>
                            <asp:CheckBox AutoPostBack=true OnCheckedChanged="CheckedChanged"  ID="chk_Agreed" 
                            Font-Names="Tahoma" Font-Size="10" runat="server" 
                            Text=" أوافق على الشروط والتعليمات المتعلقة بالقبول والتسجيل"/>
                            <asp:Button ID="btnSave" OnClick="SaveRecord" Enabled=false runat="server" Text="اعتمد التسجيل" />
                        </ContentTemplate>
                        </asp:UpdatePanel>
			</div>
		    </div>  
        </div>
        
        
    
    </form>
</body>
</html>
