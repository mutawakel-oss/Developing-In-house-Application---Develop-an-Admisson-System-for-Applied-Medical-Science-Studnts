<%@ Page Language="C#" AutoEventWireup="true" CodeFile="index.aspx.cs" Inherits="runonce" %>
<%@ Register TagPrefix="radp" Namespace="Telerik.WebControls" Assembly="RadPanelbar.NET2" %>
<%@ Register Assembly="RadWindow.Net2" Namespace="Telerik.WebControls" TagPrefix="radW" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>مرحباً بك في نظام التسجيل الإلكتروني</title>
    
   
    
</head>
<body dir=rtl  style="background-color:DimGray" >
<center>

    <form id="form1"  runat="server" >
    <asp:ScriptManager ID="script_man" runat="server"></asp:ScriptManager>
    <div align=center id="" dir=rtl>

            
			<div id="body"  >	  
			    <img  id="Img1" src="Images/lastcopy.gif" runat="server" />
			  <font color=blue>
    <span  style="font-size:medium;font-weight:bold;font-family:Simplified Arabic">نظام التسجيل
                                                            الإلكترونـي لكليــة العلوم الطبية التطبيقيــة 
                                                       
                                                            للفصل الدراسي الثـاني من العام الــدراسي 1430-1431 هـ&nbsp; 2009-2010 م</span></font> 
			<div id="user_assistance" dir=rtl style="height:100%">
            <table  cellpadding="0" cellspacing="0"  class="top table_window">
            
            <tr >
            <td class="dialog_nw"></td>
            <td class="dialog_n">
            <div  class="dialog_title title_window"><b>
            </b></div><b>للذين سبق لهم التسجيل</b><br /><br /></td>
            <td class="dialog_ne"><b></b></td>
            </tr>  
            <tr>
            <td colspan=2 >
            <div align="justify" dir="rtl">
             إذا إستخدمت النظام من قبل وتريد إستخدامه مرة ً أخرى فضلا ً قم بكتابة إسم المستخدم وكلمة المرور التي قمت بإنشائها عند إستخدامك النظام لأول مرة ثم إضغط على زر تسجيل الدخول
             </div>
             </td>
             
            </tr>      
            <tr>
                <td colspan="3">
                   

                </td>
            </tr>
            </table>
             <h2 class="section">
				دخول</h2>				
                <p style="text-align: right" >
                    <span style="color: black;font-family:Traditional Arabic;font-size:medium">&nbsp;اسم المستخدم</span>
                    
                    <asp:TextBox ID="txtLoginname" runat="server" CssClass="textback" Width="146px"></asp:TextBox>
                    <asp:RequiredFieldValidator ID="req_id" runat="server" Display="Dynamic"
                     ErrorMessage="*" ControlToValidate="txtLoginname"></asp:RequiredFieldValidator>
                    <br />
                    <span style="color: black;font-family:Traditional Arabic;font-size:medium">كلمـة المرور</span><br />
                    <asp:TextBox  ID="txtPassword" runat="server" TextMode="Password" CssClass="textback" Width="146px"></asp:TextBox>
                    <asp:RequiredFieldValidator ID="req_pass" runat="server" Display="Dynamic" ErrorMessage="*"
                     ControlToValidate="txtPassword"></asp:RequiredFieldValidator>
                    <asp:Button ID="btnLogin" OnClick="CheckLogin" runat="server" Text="دخول" />
                    <br />
                    
                    
                    
                    <br />
                    <asp:Label ID="lblLoginStatus" ForeColor="Red"  Visible="False" runat="server"></asp:Label>
                    <br />
                     <hr />
                    <a href="mailto:regist-cams@ksau-hs.edu.sa" >اتصل بنا</a> 
                    
                    
                    
                </p> 
			</div>
		    <div id="col_main_right" align="center">
			   
			   	   
			     <radp:RadPanelbar ID="RadPanelbar2" CausesValidation=false runat="server" Skin="Default" Width="98%">
                    <Items>
                        <radp:RadPanelItem runat="server"   Value="per_info" Text="لمستخدمي النظام لأول مرة ">
                        <ItemTemplate>
                           <asp:Table  Font-Names="Traditional Arabic" Width="100%"  ID="tb_main" runat="server" >
                            <asp:TableRow>
                            <asp:TableCell>&nbsp;</asp:TableCell>
                                <asp:TableCell  HorizontalAlign=Center ColumnSpan=2>
                                   <font color=green size=5>
                <b>كلمة الجامعة </b>                                                                                             
                </font>
                <br /><b> <p align="justify"> 
                
			
			أعزاءنا.. طلاينا طالباتنا
			<br />
باسم جامعة الملك سعود بن عبدالعزيز للعلوم الصحية نرحب بكم  جميعًا، ويسعدنا اصطحابكم في جولة للتعرف على نظام التسجيل الإلكتروني بالجامعة.. فباستيعابكم لكامل خطوات هذا النظام يمكنكم إجراء كل عمليات التسجيل عن بعد من أي ناحية من أنحاء المملكة بنجاح، ويكفيكم ذلك مؤونة عناء الحضور إلى كلياتنا.. وليترقب من تنطبق عليهم شروط الالتحاق بإحدى كلياتنا استدعاءً للمقابلة الشخصية باعتبار ذلك بشرى بالقبول المبدئي.. ومن لم تصلهم الدعوة فهم خارج المنافسة ونتمنى له التوفيق في مواقع آخرى.
وندعو الراغبين في الاستفسار، او في معلومات إضافية إلى الاتصال بعمادة القبول والتسجيل أو عن طريق البريد الإلكتروني كما هو مبين في الطلب.
			     <br />		
 
                                </asp:TableCell>
                                <asp:TableCell>
                                </asp:TableCell>
                            </asp:TableRow>
                           </asp:Table>
                        </ItemTemplate>
                        </radp:RadPanelItem>
                        </Items>
                        </radp:RadPanelbar>
                        
                        <br />
                        <radp:RadPanelbar ID="RadPanelbar3"   CausesValidation="false" 
                        runat="server" Skin="Default" Width="98%">
                    <Items>
                        <radp:RadPanelItem runat="server"   Value="per_info" Text="الشروط والتعليمات"  Font-Bold=true>
                        <ItemTemplate>
                            <asp:Table  Font-Names="Traditional Arabic"  ID="tb_terms" runat="server">
                                <asp:TableRow BackColor=ghostwhite >
                                    <asp:TableCell  VerticalAlign=middle>1</asp:TableCell>
                                    <asp:TableCell VerticalAlign=top>
                                     أن يكون المتقدم أو المتقدمة سعودي الجنسية 
                                   
                                    </asp:TableCell>
                                </asp:TableRow>
                                <asp:TableRow >
                                    <asp:TableCell  VerticalAlign=middle>2</asp:TableCell>
                                    <asp:TableCell >
                                      الحصول على درجة البكالوريوس في التمريض أو العلوم الطبية التطبيقية تخصص الأشعة أو العلاج الطبيعي .
                                    </asp:TableCell>
                                </asp:TableRow>
                                
                                <asp:TableRow BackColor=ghostwhite>
                                    <asp:TableCell  VerticalAlign=middle>3</asp:TableCell>
                                    <asp:TableCell BackColor=ghostwhite>
                                         الايكون قد مضى على الشهادة الجامعية 5 سنوات .
                                    
                                    </asp:TableCell>
                                </asp:TableRow>
                                
                                
                                
                                <asp:TableRow >
                                    <asp:TableCell  VerticalAlign=middle>4</asp:TableCell>
                                    <asp:TableCell >
                                         ألا يقل المعدل التراكمي عن 3 من 5 (70 %)
                                   
                                    </asp:TableCell>
                                </asp:TableRow>
                                  <asp:TableRow >
                                    <asp:TableCell  VerticalAlign=middle>5</asp:TableCell>
                                    <asp:TableCell >
                                         اجتياز اختبار القبول والمقابلة الشخصية والفحص الطبي .
                                   
                                    </asp:TableCell>
                                </asp:TableRow>
                                   
                            </asp:Table>
                        </ItemTemplate>
                        </radp:RadPanelItem>
                        </Items>
                        </radp:RadPanelbar>
                        <br />

                                
                          <radp:RadPanelbar ID="RadPanelbar1" CausesValidation=false runat="server" Skin="Default" Width="98%">
                    <Items>
                        <radp:RadPanelItem runat="server" Value="per_info" Text="ملاحظات غاية في الأهمية">
                        <ItemTemplate>
                          
                          <asp:Table Font-Names="Traditional Arabic" ID="tb_point" Font-Size=Large runat="server" Width="100%">
                            <asp:TableRow>
                                <asp:TableCell HorizontalAlign=justify>
                                <ul>
                              
                                <li>
                                     يبدأ التسجيل يوم السبت 25 ذو الحجة 1430هـ الموافق 12 ديسمبر 2009 م وينتهي يوم الجمعة 29 محرم 1431هـ
الموافق 15 يناير 2010 م .

                                </li>
                                <li>
                                    ننصح بشدة باستخدام متصفح انترنت اكسبلورر للاستفادة المثلى من مزايا النظام ، <br />و ألا تقل أبعاد الشاشة عن 1280*1204.
                                </li>
                                </ul>
                                </asp:TableCell>
                            </asp:TableRow>
                          </asp:Table>
                        </ItemTemplate>
                        </radp:RadPanelItem>
                        </Items>
                        </radp:RadPanelbar>
                        <asp:UpdatePanel ID="chk_terms" runat="server">
            <ContentTemplate>            
              <div align="center" >
              <asp:LinkButton ID="lnkhome" Font-Names="Traditional Arabic" Font-Size=Larger Text="معلومات حول البرامج المتاحة للتسجيل" CausesValidation=false runat="server" OnClick="proInfo" Visible=false ></asp:LinkButton>
              <br />
                <asp:CheckBox Font-Names="Traditional Arabic"  TextAlign="right" ID="chk_agree_terms" 
              Text="أوافق على الشروط والتعليمات المتعلقة بالقبول والتسجيل"
              AutoPostBack="true" OnCheckedChanged="chk_agree_terms_CheckedChanged"  runat="server"/>
              <asp:Button ID="btnAgree" Enabled="false" runat="server" Text="تابع " OnClick="gotoRegister" CausesValidation="false"   Width="47px" />
              </div>
              
              <hr />
              <font size="1">
              تطوير : جامعة الملك سعود بن عبدالعزيز للعلوم الصحية 2009 © - فريق تقانة المعلومات بكلية الطب </font><br /><br />
                          
              
			</ContentTemplate>
			<Triggers>
			    <asp:PostBackTrigger ControlID="lnkhome" />
			</Triggers>
            </asp:UpdatePanel>
			</div>
		    </div>  
        </div>
        
        
    
    </form>
    </center>
</body>
</html>
