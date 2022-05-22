<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<%@ Register Assembly="AjaxControlToolkit"
    Namespace="AjaxControlToolkit"
    TagPrefix="Ajax" %>

<%@ Register Assembly="RadTabStrip.Net2" Namespace="Telerik.WebControls" TagPrefix="radTS" %>
<%@ Register TagPrefix="radp" Namespace="Telerik.WebControls" Assembly="RadPanelbar.NET2" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server" >
    <title>Registrtaion</title>
    <link href="StyleSheet.css" rel="stylesheet" type="text/css" />
</head>
<body dir="rtl" style="background-color:DimGray">
    <form  id="form1" dir="rtl"  runat="server">
     <asp:ScriptManager ID="ScriptManager1" runat="server" />
      
          <div align="center" id="" dir="rtl">
           
            
			<div id="body"   ><img  id="Img1" src="Images/lastcopy.gif" runat="server" />  
			
			<div id="user_assistance" style="height:100%">
					<table  cellpadding="0" cellspacing="0"  class="top table_window">
        <tr >
          <td class="dialog_nw"></td>
          <td class="dialog_n">
          <div  class="dialog_title title_window"><b>
          </b></div></td>
          <td class="dialog_ne">&nbsp;</td>
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
		    <div id="col_main_right" align="right" dir="rtl">
			   
			   <div style="font-size:10;font-family:Tahoma" align=right>
			   
			   <br />
			   <asp:Label Font-Size=Small Font-Names=Tahoma ID="lblProgramInfor" runat="server" ></asp:Label>
			   <br />	
			   </div>
			   	
			  <asp:ValidationSummary runat="server" ID="vldSummary" ShowMessageBox="true"   ShowSummary="false" HeaderText=":يجب عليك ادخال الخانات الآتية بشكل صحيح" />
			   
                <radp:RadPanelbar ID="RadPanelbar2" runat="server" Skin="Default" Width="99%">
                    <Items>
                        <radp:RadPanelItem  runat="server" Font-Bold=true Value="per_info" Text="معلومات شخصيّة">
                        <ItemTemplate>
                           <asp:Table ID="tb_personal"  Font-Size="Smaller" runat="server" Width="100%">
                            <asp:TableRow Font-Size="Smaller">
                           <asp:TableCell Font-Size="10"  Font-Names="Tahoma">رقم بطاقة الاحوال </asp:TableCell>
                           <asp:TableCell ColumnSpan="3">
                           <asp:TextBox ID="txtLocalID" MaxLength=10  runat="server"></asp:TextBox>
                           <asp:RequiredFieldValidator ID="RequiredFieldValidator8" runat="server" ControlToValidate="txtLocalID" ErrorMessage="رقم بطاقة الأحوال" >*</asp:RequiredFieldValidator>
                           </asp:TableCell>
                           </asp:TableRow>        
                           
                           <asp:TableRow >
                           <asp:TableCell Width="150px" Font-Size="10"  Font-Names="Tahoma" >الإسم الأول </asp:TableCell>
                           <asp:TableCell>
                            <asp:TextBox ID="txtFirstName_1" MaxLength="50" runat="server"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" ControlToValidate="txtFirstName_1" ErrorMessage="الإسم الأول بالعربية" >*</asp:RequiredFieldValidator>
                           </asp:TableCell>                           
                           <asp:TableCell>
                            <asp:TextBox ID="txtFirstName_2"  MaxLength="50" runat="server"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator2" runat="server" ControlToValidate="txtFirstName_2" ErrorMessage="الإسم الأول بالإنجليزية" >*</asp:RequiredFieldValidator>
                           </asp:TableCell>
                           <asp:TableCell Font-Size="Smaller">First Name</asp:TableCell>                           
                           </asp:TableRow>
                           
                            <asp:TableRow Font-Size="Smaller">
                           <asp:TableCell Font-Size="10"  Font-Names="Tahoma" >إسـم الأب </asp:TableCell>
                           <asp:TableCell>
                            <asp:TextBox ID="txtFatherName_1"  MaxLength="50" runat="server"></asp:TextBox>
                            <asp:RequiredFieldValidator runat="server" ControlToValidate="txtFatherName_1" ErrorMessage="اسم الأب بالعربية" >*</asp:RequiredFieldValidator>
                           </asp:TableCell>                           
                           <asp:TableCell>
                            <asp:TextBox ID="txtFatherName_2"   MaxLength="50" runat="server"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator3" runat="server" ControlToValidate="txtFatherName_2" ErrorMessage="اسم الأب بالإنجليزية" >*</asp:RequiredFieldValidator>
                           </asp:TableCell>
                           <asp:TableCell>Father Name</asp:TableCell>                           
                           </asp:TableRow>
                           
                            <asp:TableRow Font-Size="Smaller">
                           <asp:TableCell Font-Size="10"  Font-Names="Tahoma">إسم الجد </asp:TableCell>
                           <asp:TableCell>
                            <asp:TextBox ID="txtGrandFather_1"  MaxLength="50" runat="server"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator4" runat="server" ControlToValidate="txtGrandFather_1" ErrorMessage="اسم الجد بالعربية" >*</asp:RequiredFieldValidator>
                           </asp:TableCell>                           
                           <asp:TableCell>
                            <asp:TextBox ID="txtGrandFather_2"  MaxLength="50" runat="server"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator5" runat="server" ControlToValidate="txtGrandFather_2" ErrorMessage="اسم الجد بالإنجليزية" >*</asp:RequiredFieldValidator>
                           </asp:TableCell>
                           <asp:TableCell>Grand Father</asp:TableCell>                           
                           </asp:TableRow>
                           
                            <asp:TableRow Font-Size="Smaller">
                           <asp:TableCell Font-Size="10"  Font-Names="Tahoma">اسم العـائلة </asp:TableCell>
                           <asp:TableCell>
                            <asp:TextBox ID="txtLastName_1"  MaxLength="50" runat="server"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator6" runat="server" ControlToValidate="txtLastName_1" ErrorMessage="اسم العائلة بالعربية" >*</asp:RequiredFieldValidator>
                           </asp:TableCell>                           
                           <asp:TableCell>
                            <asp:TextBox ID="txtLastName_2"  MaxLength="50" runat="server"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator7" runat="server" ControlToValidate="txtLastName_2" ErrorMessage="اسم العائلة بالإنجليزية" >*</asp:RequiredFieldValidator>
                           </asp:TableCell>
                           <asp:TableCell>Last Name</asp:TableCell>                           
                           </asp:TableRow>
                           
                                               
                           <asp:TableRow Font-Size="Smaller">
                           <asp:TableCell Font-Size="10"  Font-Names="Tahoma">تاريخ الميلاد</asp:TableCell>
                           <asp:TableCell>
                           <asp:DropDownList runat="server" ID="cmbDOBDay" Width="40px">
                           </asp:DropDownList>
                           <asp:RequiredFieldValidator ID="RequiredFieldValidator9" runat="server" ControlToValidate="cmbDOBDay" InitialValue="0" ErrorMessage="تاريخ الميلاد - اليوم">*</asp:RequiredFieldValidator>
                           <asp:DropDownList ID="cmbDOBMonth" runat="server" Width="60px">
                            <asp:ListItem >مُحَرَّم</asp:ListItem>
                            <asp:ListItem>صَقَر</asp:ListItem>
                            <asp:ListItem >رّبِيعُ الأوَّل</asp:ListItem>
                            <asp:ListItem >رَبيعُ الثّاني</asp:ListItem>
                            <asp:ListItem >جُمادى الأوَّل</asp:ListItem>
                            <asp:ListItem >جُمادى الثّاني</asp:ListItem>
                            <asp:ListItem >رَجَب</asp:ListItem>
                            <asp:ListItem >شَعْبانُ</asp:ListItem>
                            <asp:ListItem >رَمَضانُ</asp:ListItem>
                            <asp:ListItem >شَوّال</asp:ListItem>
                            <asp:ListItem >ذُو القَعدة</asp:ListItem>
                            <asp:ListItem >ذُو الحِجّة</asp:ListItem>
            
                           </asp:DropDownList>&nbsp;
                           <asp:DropDownList ID="cmbDOBYear" runat="server" Width="50px"></asp:DropDownList>    
                           <asp:RequiredFieldValidator ID="RequiredFieldValidator10" runat="server" ControlToValidate="cmbDOBYear" InitialValue="0" ErrorMessage="تاريخ الميلاد - السنة" >*</asp:RequiredFieldValidator>                       
                           </asp:TableCell>                           
                           <asp:TableCell>
                                             
                           </asp:TableCell>
                           <asp:TableCell></asp:TableCell>                           
                           </asp:TableRow>                           
                           
                           <asp:TableRow Font-Size="Smaller">
                           <asp:TableCell ID="birthplace" Font-Size="10"  Font-Names="Tahoma">مكان الميلاد </asp:TableCell>
                           <asp:TableCell>
                            <asp:TextBox ID="txtBirthPlace_1"  MaxLength="50" runat="server"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator11" runat="server" ControlToValidate="txtBirthPlace_1" ErrorMessage="مكان الميلاد" >*</asp:RequiredFieldValidator>                       
                           </asp:TableCell>                           
                           <asp:TableCell>
                            
                           </asp:TableCell>
                                                    
                           </asp:TableRow>
                           
                           <asp:TableRow Font-Size="Smaller">
                           <asp:TableCell ID="DoYouHaveAdisability" Font-Size="10"  Font-Names="Tahoma" >هل تعاني من حالة عجز</asp:TableCell>
                           <asp:TableCell ColumnSpan="3">
                            <asp:RadioButtonList runat="server" ID="RdioDisability" RepeatDirection ="Horizontal">
                            <asp:ListItem Selected=True Text="لا"></asp:ListItem>                            
                            <asp:ListItem Text="نعم"></asp:ListItem>
                            
                            </asp:RadioButtonList>
                           </asp:TableCell>                                                    
                           </asp:TableRow>
                           
                           <asp:TableRow Font-Size="Smaller">
                           <asp:TableCell ID="explanation" Font-Size="10"  Font-Names="Tahoma">شرح</asp:TableCell>
                           <asp:TableCell ColumnSpan="3">
                            <asp:TextBox ID="txtExplanation"  MaxLength="150" Width="330px" runat="server"></asp:TextBox>
                           </asp:TableCell>
                           </asp:TableRow>                                          
                           
                           </asp:Table>
                        </ItemTemplate>
                        </radp:RadPanelItem>
                        
                        <radp:RadPanelItem runat="server" Value="aca" Text="خلفيّة أكاديميّة">   <%--Academic background--%>
                        <ItemTemplate>                    
                        <asp:Table ID="tb_Academic" Font-Size="Smaller" runat="server" Width="100%">
                            <asp:TableRow Font-Size="Smaller">
                           <asp:TableCell Font-Size="10"  Font-Names="Tahoma" Width="150px" ID="degree">الدرجة العلمية</asp:TableCell>
                           <asp:TableCell>
                            <asp:TextBox ID="txtDegree_1"  MaxLength="50" runat="server"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator11" runat="server" ControlToValidate="txtDegree_1" ErrorMessage="الدرجة العلمية" >*</asp:RequiredFieldValidator>                       
                           </asp:TableCell>                           
                           <asp:TableCell>
                            
                           </asp:TableCell>
                           <asp:TableCell  ></asp:TableCell>                           
                           </asp:TableRow>                           
                           
                           <asp:TableRow Font-Size="Smaller">
                           <asp:TableCell >التخصص في درجة البكالوريوس </asp:TableCell>
                           <asp:TableCell>
                            <asp:DropDownList ID="ddlSpeciality" runat="server" Width="155px">
                                <asp:ListItem>التمريض</asp:ListItem>
                                <asp:ListItem>الأشعة</asp:ListItem>
                                <asp:ListItem>العلاج الطبيعي</asp:ListItem>
                            </asp:DropDownList>
                           </asp:TableCell>                           
                           <asp:TableCell>
                           </asp:TableCell>
                           <asp:TableCell></asp:TableCell>                           
                           </asp:TableRow>
                                                      
                           <asp:TableRow Font-Size="Smaller">
                           <asp:TableCell Font-Size="10"  Font-Names="Tahoma">اسم الكلية</asp:TableCell>
                           <asp:TableCell>
                            
                            <asp:DropDownList ID="txtCollege_1" runat="server" Width="155px">
                                <asp:ListItem>كلية التمريض</asp:ListItem>
                                <asp:ListItem>كلية العلوم الطبية التطبيقية</asp:ListItem>
                            </asp:DropDownList>
                           </asp:TableCell>                           
                           <asp:TableCell>
                           </asp:TableCell>
                           <asp:TableCell></asp:TableCell>                           
                           </asp:TableRow>
                           
                           <asp:TableRow Font-Size="Smaller">
                           <asp:TableCell Font-Size="10"  Font-Names="Tahoma">اســـم الجـامعة</asp:TableCell>
                           <asp:TableCell>
                            <asp:TextBox ID="txtUniversity_1"  MaxLength="50" runat="server"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator14" runat="server" ControlToValidate="txtUniversity_1" ErrorMessage="اسم الجامعة" >*</asp:RequiredFieldValidator>                       
                           </asp:TableCell>                           
                           <asp:TableCell>
                           </asp:TableCell>
                           <asp:TableCell></asp:TableCell>                           
                           </asp:TableRow>
                           
                           <asp:TableRow Font-Size="Smaller">
                           <asp:TableCell Font-Size="10"  Font-Names="Tahoma">المـديـنـة</asp:TableCell>
                           <asp:TableCell>
                            <asp:TextBox ID="txtUniversityCity_1"  MaxLength="50" runat="server"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator15" runat="server" ControlToValidate="txtUniversityCity_1" ErrorMessage="المدينة" >*</asp:RequiredFieldValidator>                       
                           </asp:TableCell>                           
                           <asp:TableCell>
                           </asp:TableCell>
                           <asp:TableCell></asp:TableCell>                           
                           </asp:TableRow>
                           
                           <asp:TableRow Font-Size="Smaller">
                           <asp:TableCell Font-Size="10"  Font-Names="Tahoma">الدولة</asp:TableCell>
                           <asp:TableCell>
                           <asp:DropDownList Font-Size="8" Font-Names="Tahoma" ID="cmbCountry_Uni" Width="156px" runat="server"></asp:DropDownList>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator26" runat="server" ControlToValidate="cmbCountry_Uni"
                             ErrorMessage="Country Name" >*</asp:RequiredFieldValidator>                       
                           </asp:TableCell>                           
                           <asp:TableCell>
                           </asp:TableCell>
                           <asp:TableCell></asp:TableCell>                           
                           </asp:TableRow>
                           
                           
                           <asp:TableRow Font-Size="Smaller">
                           <asp:TableCell ColumnSpan="2" Font-Bold="true" ID="universityAttendance" >فترة الدراسة </asp:TableCell>
                           <asp:TableCell ColumnSpan="2" HorizontalAlign="Left"></asp:TableCell>                           
                           </asp:TableRow>
                           
                           <asp:TableRow Font-Size="Smaller">
                           <asp:TableCell ID="fromDate" Font-Size="10"  Font-Names="Tahoma">من تاريخ</asp:TableCell>
                           <asp:TableCell>
                           <asp:DropDownList runat="server" ID="cmbDegreeFrom" Width="34px"></asp:DropDownList>&nbsp;
                           <asp:DropDownList ID="ddlFromMonth_1" runat="server" Width="60px">
                            <asp:ListItem >مُحَرَّم</asp:ListItem>
                            <asp:ListItem>صَقَر</asp:ListItem>
                            <asp:ListItem >رّبِيعُ الأوَّل</asp:ListItem>
                            <asp:ListItem >رَبيعُ الثّاني</asp:ListItem>
                            <asp:ListItem >جُمادى الأوَّل</asp:ListItem>
                            <asp:ListItem >جُمادى الثّاني</asp:ListItem>
                            <asp:ListItem >رَجَب</asp:ListItem>
                            <asp:ListItem >شَعْبانُ</asp:ListItem>
                            <asp:ListItem >رَمَضانُ</asp:ListItem>
                            <asp:ListItem >شَوّال</asp:ListItem>
                            <asp:ListItem >ذُو القَعدة</asp:ListItem>
                            <asp:ListItem >ذُو الحِجّة</asp:ListItem>
                           </asp:DropDownList>&nbsp;
                           <asp:DropDownList ID="cmbDegreeFromYear" runat="server" Width="50px"></asp:DropDownList>                           
                           </asp:TableCell>                           
                           <asp:TableCell>
                                                
                           </asp:TableCell>
                           <asp:TableCell></asp:TableCell>                           
                           </asp:TableRow>    
                           
                           <asp:TableRow Font-Size="Smaller">
                           <asp:TableCell ID="ToGradudationDate" Font-Size="10"  Font-Names="Tahoma">إلى تدرج تاريخ</asp:TableCell>
                           <asp:TableCell>
                           <asp:DropDownList runat="server" ID="cmbDegreeTo" Width="34px">
                            
                           </asp:DropDownList>&nbsp;
                           <asp:DropDownList ID="ddlToMonth_1" runat="server" Width="60px">
                            <asp:ListItem >مُحَرَّم</asp:ListItem>
                            <asp:ListItem>صَقَر</asp:ListItem>
                            <asp:ListItem >رّبِيعُ الأوَّل</asp:ListItem>
                            <asp:ListItem >رَبيعُ الثّاني</asp:ListItem>
                            <asp:ListItem >جُمادى الأوَّل</asp:ListItem>
                            <asp:ListItem >جُمادى الثّاني</asp:ListItem>
                            <asp:ListItem >رَجَب</asp:ListItem>
                            <asp:ListItem >شَعْبانُ</asp:ListItem>
                            <asp:ListItem >رَمَضانُ</asp:ListItem>
                            <asp:ListItem >شَوّال</asp:ListItem>
                            <asp:ListItem >ذُو القَعدة</asp:ListItem>
                            <asp:ListItem >ذُو الحِجّة</asp:ListItem>
                           </asp:DropDownList>&nbsp;
                           <asp:DropDownList ID="cmbDegreeToYear" runat="server" Width="50px"></asp:DropDownList>                           
                           </asp:TableCell>                           
                           <asp:TableCell>
                           </asp:TableCell>
                           <asp:TableCell></asp:TableCell>                           
                           </asp:TableRow>      
                           
                           <asp:TableRow Font-Size="Smaller">
                           <asp:TableCell ID="GpaScore" Font-Size="10"  Font-Names="Tahoma">المعـدل التـراكمي </asp:TableCell>
                           <asp:TableCell ColumnSpan="3">
                            
                            <asp:UpdatePanel ID="upd_grade" runat="server" ChildrenAsTriggers=true>
                                <ContentTemplate>                                
                                    <asp:RadioButton AutoPostBack=true OnCheckedChanged="grader" ID="outof100" GroupName="grp_out_of" TextAlign="Left" runat="server" Text="من 100" />
                                    <asp:RadioButton AutoPostBack=true Checked=true OnCheckedChanged="grader" ID="outof5" GroupName="grp_out_of" TextAlign="Left" runat="server" Text="من 5" />
                                    <asp:RadioButton AutoPostBack=true OnCheckedChanged="grader" ID="outof4" GroupName="grp_out_of" TextAlign="Left" runat="server" Text="من 4" />
                                </ContentTemplate>
                            </asp:UpdatePanel>
                            <asp:UpdateProgress   runat=server AssociatedUpdatePanelID="upd_grade" DynamicLayout=true>
                                <ProgressTemplate>
                                    <div style="background-color:Red;width:80px" id="st" runat="server">
                                    Please wait....
                                    </div>
                                    
                                </ProgressTemplate>
                            </asp:UpdateProgress>
                           </asp:TableCell>                  
                           </asp:TableRow>      
                           
                           <asp:TableRow Font-Size="Smaller">
                            <asp:TableCell Font-Size="10"  Font-Names="Tahoma">علامات</asp:TableCell>
                            <asp:TableCell ColumnSpan=2>
                                <asp:UpdatePanel ID="upd_pnl1" runat="server">
                                    <ContentTemplate>
                                    <asp:TextBox runat="server" ID="txtMarks"></asp:TextBox>                                
                                    <asp:Label ID="lblMarksStatus" ForeColor=Red runat="server" Visible=false></asp:Label>
                                    
                                    <Ajax:TextBoxWatermarkExtender ID="ajax_marks" runat="server" BehaviorID="marks_beha" 
                                    TargetControlID="txtMarks" WatermarkText="ادخل المعدل من 5" WatermarkCssClass="watermarked">                                    
                                    </Ajax:TextBoxWatermarkExtender>
                                    
                                    <asp:RequiredFieldValidator ID="RequiredFieldValidator16" runat="server" ControlToValidate="txtMarks" ErrorMessage="العلامات">*</asp:RequiredFieldValidator>   
                                   
                              </ContentTemplate>
                              </asp:UpdatePanel>
                            </asp:TableCell>
                           </asp:TableRow>
                           </asp:Table>
                        
                        </ItemTemplate>
                        </radp:RadPanelItem>
                        
                        <radp:RadPanelItem  runat="server"  Value="contact_information" Text="معلومات الإتصال">  <%--contact information--%>
                        <ItemTemplate>                    
                        <asp:Table ID="tb_Contact" Font-Size="Smaller" runat="server" Width="100%">
                            <asp:TableRow Font-Size="Smaller">
                           <asp:TableCell ColumnSpan="2" Font-Bold="true" ID="PermanentAddress">عنوان دائم</asp:TableCell>                           
                           <asp:TableCell ColumnSpan="2" HorizontalAlign="Left" Font-Bold="true"></asp:TableCell>                           
                           </asp:TableRow>
                           
                           <asp:TableRow Font-Size="Smaller">
                           <asp:TableCell Width="150px" Font-Size="10"  Font-Names="Tahoma">صندوق البريد </asp:TableCell>
                           <asp:TableCell>
                            <asp:TextBox ID="txtPOBox_1"  MaxLength="5" runat="server"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator16" runat="server" ControlToValidate="txtPOBox_1" ErrorMessage="صندوق البريد">*</asp:RequiredFieldValidator>   
                           </asp:TableCell>                                                      
                           <asp:TableCell  ColumnSpan="2" ></asp:TableCell>                           
                           </asp:TableRow>                           
                           
                            <asp:TableRow Font-Size="Smaller">
                           <asp:TableCell Font-Size="10"  Font-Names="Tahoma">مفتاح المدينة</asp:TableCell>
                           <asp:TableCell>
                            <asp:TextBox ID="txtAreaCode_1"  MaxLength="5" runat="server"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator17" runat="server" ControlToValidate="txtAreaCode_1" ErrorMessage="مفتاح المدينة">*</asp:RequiredFieldValidator>   
                           </asp:TableCell>                                                      
                           <asp:TableCell  ColumnSpan="2" ></asp:TableCell>                           
                           </asp:TableRow>  
                                                      
                           <asp:TableRow Font-Size="Smaller">
                           <asp:TableCell Font-Size="10"  Font-Names="Tahoma">المـديـنـة </asp:TableCell>
                           <asp:TableCell>
                            <asp:TextBox ID="txtCity_1"  MaxLength="50" runat="server"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator18" runat="server" ControlToValidate="txtCity_1" ErrorMessage="المدينة">*</asp:RequiredFieldValidator>   
                           </asp:TableCell>                           
                           <asp:TableCell>
                           </asp:TableCell>
                           <asp:TableCell></asp:TableCell>                           
                           </asp:TableRow>
                           
                           <asp:TableRow Font-Size="Smaller">
                           <asp:TableCell Font-Size="10"  Font-Names="Tahoma" ID="ResidentialPhoneNo">تلفون المنزل</asp:TableCell>
                           <asp:TableCell>
                            <asp:TextBox ID="txtResPhone_1"  MaxLength="15" runat="server"></asp:TextBox>
                             <asp:RequiredFieldValidator ID="RequiredFieldValidator19" runat="server" ControlToValidate="txtResPhone_1" ErrorMessage="تلفون المنزل">*</asp:RequiredFieldValidator>   
                           </asp:TableCell>                           
                           <asp:TableCell ColumnSpan="2"></asp:TableCell>                           
                           </asp:TableRow>
                           
                           <asp:TableRow Font-Size="Smaller">
                           <asp:TableCell Font-Size="10"  Font-Names="Tahoma">الجــوال </asp:TableCell>
                           <asp:TableCell>
                            <asp:TextBox ID="txtMobile_1"  MaxLength="10" runat="server"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator20" runat="server" ControlToValidate="txtMobile_1" ErrorMessage="الجــوال">*</asp:RequiredFieldValidator>   
                           </asp:TableCell>                           
                           <asp:TableCell ColumnSpan="2"></asp:TableCell>                           
                           </asp:TableRow>                           
                           <asp:TableRow Font-Size="Smaller">
                           <asp:TableCell Font-Size="10"  Font-Names="Tahoma">فاكس</asp:TableCell>
                           <asp:TableCell>
                           <asp:TextBox ID="txtFax_1"  MaxLength="15" runat="server"></asp:TextBox>
                            
                           </asp:TableCell>                           
                           <asp:TableCell ColumnSpan="2"></asp:TableCell>                           
                           </asp:TableRow>
                           <asp:TableRow Font-Size="Smaller">
                           <asp:TableCell Font-Size="10"  Font-Names="Tahoma">البريد الإكتروني</asp:TableCell>
                           <asp:TableCell ColumnSpan="2">
                           <asp:TextBox ID="txtEmail_1"  MaxLength="30" runat="server"></asp:TextBox>
                           <asp:RequiredFieldValidator ID="RequiredFieldValidator22" runat="server" 
                           ControlToValidate="txtEmail_1" ErrorMessage="البريد الإلكتروني">*</asp:RequiredFieldValidator>   
                           
                           <asp:RegularExpressionValidator ID=valEmailAddress
                            ControlToValidate=txtEmail_1	ValidationExpression=".*@.*\..*" ErrorMessage="البريد الإلكتروني غير مقبول" 
                            Display=Dynamic EnableClientScript=true Runat=server>*</asp:RegularExpressionValidator>


                           </asp:TableCell>                           
                           <asp:TableCell ColumnSpan="2"></asp:TableCell>                           
                           </asp:TableRow>    
                           <asp:TableRow Font-Size="Smaller">
                           <asp:TableCell ColumnSpan="2" Font-Bold="true" ID="DesignatedAdditionalContactPerson">شخص يمكن الإتصال به</asp:TableCell>                           
                           <asp:TableCell ColumnSpan="2" HorizontalAlign="Left" Font-Bold="true"></asp:TableCell>                           
                           </asp:TableRow>
                           
                           <asp:TableRow Font-Size="Smaller">
                           <asp:TableCell Font-Size="10"  Font-Names="Tahoma">الإسم</asp:TableCell>
                           <asp:TableCell>
                            <asp:TextBox ID="txtAdditionalName_1"  MaxLength="50" runat="server"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator23" runat="server" ControlToValidate="txtAdditionalName_1" ErrorMessage="اسم شخص للإتصال به عند الحاجة">*</asp:RequiredFieldValidator>   
                           </asp:TableCell> 
                           <asp:TableCell>
                           </asp:TableCell>                                                         
                           <asp:TableCell ></asp:TableCell>                           
                           </asp:TableRow> 
                           
                            <asp:TableRow Font-Size="Smaller">
                           <asp:TableCell Font-Size="10"  Font-Names="Tahoma">صلة القرابة</asp:TableCell>
                           <asp:TableCell>
                            <asp:DropDownList ID="cmbRelation_1" Width="156px" runat="server">
                                <asp:ListItem>جد</asp:ListItem>
                                <asp:ListItem>أب</asp:ListItem>
                                <asp:ListItem>عم</asp:ListItem>
                                <asp:ListItem>خال</asp:ListItem>
                                <asp:ListItem>أخ</asp:ListItem>
                                <asp:ListItem>شخص آخر</asp:ListItem>
                            </asp:DropDownList>
                           </asp:TableCell> 
                           <asp:TableCell>
                           </asp:TableCell>                                                         
                           <asp:TableCell ></asp:TableCell>                           
                           </asp:TableRow>      
                           
                            <asp:TableRow Font-Size="Smaller">
                           <asp:TableCell Font-Size="10"  Font-Names="Tahoma">تلفون</asp:TableCell>
                           <asp:TableCell>
                            <asp:TextBox ID="txtAdditionalContactPhone"  MaxLength="15" runat="server"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator24" runat="server" ControlToValidate="txtAdditionalContactPhone" ErrorMessage="تلفون شخص  للإتصال به عند الحاجة">*</asp:RequiredFieldValidator>   
                           </asp:TableCell>                           
                           <asp:TableCell ColumnSpan="2"></asp:TableCell>                           
                           </asp:TableRow>                               
                           
                             <asp:TableRow Font-Size="Smaller">
                           <asp:TableCell Font-Size="10"  Font-Names="Tahoma">الجــوال </asp:TableCell>
                           <asp:TableCell>
                            <asp:TextBox ID="txtAdditionalContactMobile"  MaxLength="10" runat="server"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator25" runat="server" ControlToValidate="txtAdditionalContactMobile" ErrorMessage="جوال شخص للإتصال به عند الحاجة">*</asp:RequiredFieldValidator>   
                           </asp:TableCell>                           
                           <asp:TableCell ColumnSpan="2"></asp:TableCell>                           
                           </asp:TableRow>  
                        </asp:Table>
                        </ItemTemplate>
                        </radp:RadPanelItem>
                         <radp:RadPanelItem  runat="server" Font-Bold=true Value="per_upload" Text="رفع المستندات">
                        <ItemTemplate>
                          <asp:Table ID="tblUploadptions" runat="server" align="rtl" >
                  <asp:TableRow>
                    <asp:TableCell>
                        <asp:Label ID="lblGraduationCert" runat="server" Text="شهادة التخرج " Font-Size="10"  Font-Names="Tahoma"></asp:Label>
                    </asp:TableCell>
                    <asp:TableCell>
                        <asp:FileUpLoad id="fileUploadGraduationCertPic" runat="server" />
                    </asp:TableCell>
                    <asp:TableCell >
                        <asp:Label ID="lblFileUploadGraduationCert" runat=server  ForeColor=red></asp:Label>
                    </asp:TableCell>
                    <asp:TableCell>
                    </asp:TableCell>
                  </asp:TableRow>
                  <asp:TableRow ID="rowExcellenceCert" runat="server">
                    <asp:TableCell >
                        <asp:Label ID="lblExcellenceCert" runat="server" Text="شهادة إتمام الامتياز  " Font-Size="10"  Font-Names="Tahoma"></asp:Label>
                    </asp:TableCell>
                    <asp:TableCell>
                        <asp:FileUpLoad id="fileUploadExcellenceCert" runat="server" />
                    </asp:TableCell>
                    <asp:TableCell >
                        <asp:Label ID="lblExcellenceCertMessage" runat=server  ForeColor=red></asp:Label>
                    </asp:TableCell>
                    <asp:TableCell>
                    </asp:TableCell>
                  </asp:TableRow>
                  <asp:TableRow>
                    <asp:TableCell>
                        <asp:Label ID="lblAcademicTranscriptPic" runat="server" Text="السجل الأكاديمي" Font-Size="10"  Font-Names="Tahoma"></asp:Label>
                    </asp:TableCell>
                    <asp:TableCell>
                        <asp:FileUpLoad id="fileUploadAcademicTranscript" runat="server" />
                    </asp:TableCell>
                    <asp:TableCell >
                        <asp:Label ID="FileUploadAcademicTranscriptMessage" runat=server  ForeColor=red></asp:Label>
                    </asp:TableCell>
                    <asp:TableCell>
                    </asp:TableCell>
                  </asp:TableRow>
                  <asp:TableRow>
                    <asp:TableCell>
                        <asp:Button ID="btnUploadDocuments" runat="server" Text="ارفع المستندات"   CausesValidation="false" OnClick="mUploadStudentFiles"/>
                    </asp:TableCell>
                  </asp:TableRow>
                </asp:Table>
                        </ItemTemplate>
                        </radp:RadPanelItem>
                        
                        <radp:RadPanelItem  runat="server" Font-Names="Tahoma" Value="login_info"  Text="معلومات الدخول">  <%--USER LOGIN information--%>
                        <ItemTemplate>                    
                        <asp:Table ID="tb_userlogin" Font-Size="Smaller" runat="server" Width="100%">
                            <asp:TableRow Font-Size="Smaller">
                           <asp:TableCell Width="150px" ID="userName" Font-Size="10"  Font-Names="Tahoma">اسم المستخدم</asp:TableCell>                           
                           <asp:TableCell>
                           <asp:TextBox runat="server"  MaxLength="15" ID= "txtUserID"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator28" runat="server" ControlToValidate="txtUserID" 
                           ErrorMessage="اسم المستخدم">*</asp:RequiredFieldValidator> 
                           
                           </asp:TableCell>                           
                           </asp:TableRow>
                           <asp:TableRow Font-Size="Smaller" >
                           <asp:TableCell ID="TableCell1" Font-Size="10"  Font-Names="Tahoma">كلمة السر</asp:TableCell>                           
                           <asp:TableCell>
                           <asp:TextBox runat="server" TextMode=Password  MaxLength="15" ID= "txtPassword"></asp:TextBox>
                           <asp:RequiredFieldValidator ID="RequiredFieldValidator27" runat="server" ControlToValidate="txtPassword" 
                           ErrorMessage="كلمة المرور">*</asp:RequiredFieldValidator>   
                           </asp:TableCell>                           
                           </asp:TableRow>
                            <asp:TableRow Font-Size="Smaller">
                           <asp:TableCell ID="TableCell2" Font-Size="10"  Font-Names="Tahoma">اعد كتابة كلمة السر</asp:TableCell>                           
                           <asp:TableCell>
                           <asp:TextBox runat="server"  MaxLength="15" TextMode=Password ID= "txtPassword_1"></asp:TextBox>
                           <asp:RequiredFieldValidator ID="RequiredFieldValidator25" runat="server" ControlToValidate="txtPassword_1" 
                           ErrorMessage="اعد كتابة كلمة المرور">*</asp:RequiredFieldValidator>   
                           <asp:CompareValidator ID="com_pass" runat="server" ControlToCompare="txtPassword" ControlToValidate="txtPassword_1"
                           ErrorMessage="اعادة كتابة كلمة المرور غير مطابقة لكلمة المرور الأصلية"
                           ></asp:CompareValidator>
                           </asp:TableCell>                           
                           </asp:TableRow>
                           </asp:Table>
                           </ItemTemplate>
                           </radp:RadPanelItem>
                                                
                    </Items>
                </radp:RadPanelbar>
                <asp:Table runat="server">
                <asp:TableRow>                 
                <asp:TableCell  Width="100%" HorizontalAlign="Center" ColumnSpan=2 >
                <br />
                <div dir=rtl >                    
                <asp:Button Text=" تسجيل " UseSubmitBehavior=true OnClick="SaveClick"  runat="server" ID="btnSave" />
                    <asp:Button Text=" الغاء "  OnClick="CancelClick" CausesValidation=false runat="server" ID="btnCancel" />
                    
                </div>
                </asp:TableCell>
               
                </asp:TableRow>
                </asp:Table>
                
			</div>
		    </div>  
        </div>
    </form>
</body>
</html>
