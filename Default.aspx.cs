using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Data.Odbc;
public partial class _Default : System.Web.UI.Page 
{
    DropDownList cmbDOBDay;
    DropDownList cmbDegreeFrom;
    DropDownList cmbDegreeTo;

    DropDownList cmbDegreeFromYear;
    DropDownList cmbDegreeToYear;
    DropDownList cmbCountry_Uni;
    OdbcDataReader reader = null;
    TextBox txtLocalID;
    TextBox txtFirstName_1;
    TextBox txtFirstName_2;
    TextBox txtFatherName_1;
    TextBox txtFatherName_2;
    TextBox txtGrandFather_1;
    TextBox txtGrandFather_2;
    TextBox txtLastName_1;
    TextBox txtLastName_2;
    DropDownList cmbDOBMonth;
    DropDownList cmbDOBYear;
    TextBox txtBirthPlace_1;
    RadioButtonList RdioDisability;
    TextBox txtExplanation;
    TextBox txtDegree_1;
    DropDownList txtSpeciality_1;
    DropDownList txtCollege_1;
    TextBox txtUniversity_1;
    TextBox txtUniversityCity_1;
    DropDownList ddlFromMonth_1;
    DropDownList ddlToMonth_1;
    RadioButton out100;
    RadioButton out5;
    RadioButton out4;
    TextBox txtMark;
    TextBox txtPOBox_1;
    TextBox txtAreaCode_1;
    TextBox txtCity_1;
    TextBox txtResPhone_1;
    TextBox txtMobile_1;
    TextBox txtFax_1;
    TextBox txtEmail_1;
    TextBox txtAdditionalName_1;
    DropDownList cmbRelation_1;
    TextBox txtAdditionalContactPhone;
    TextBox txtAdditionalContactMobile;
    TextBox txtUserID;
    TextBox txtPassword;
    TextBox txtPassword_1;
    FileUpload fileUploadGraduationCertPic;
    Label lblFileUploadGraduationCert;
    FileUpload fileUploadExcellenceCert;
    Label lblExcellenceCertMessage;
    FileUpload fileUploadAcademicTranscript;
    Label FileUploadAcademicTranscriptMessage;
    protected void Page_Load(object sender, EventArgs e)
    {

        Control radControl = RadPanelbar2.FindItemByValue("per_info");        
        Control RadRadPanelbar1 = RadPanelbar1.FindItemByValue("menus");
        LinkButton lnkLogout = (LinkButton)RadRadPanelbar1.Controls[0].FindControl("lnkLogout");
        txtLocalID = (TextBox)radControl.Controls[0].FindControl("txtLocalID");
        if (Session["regid"] == null)
        {
            lnkLogout.Visible = false;
        }
        else
            txtLocalID.Enabled = false;

        
        
        txtFirstName_1 = (TextBox)radControl.Controls[0].FindControl("txtFirstName_1");
        txtFirstName_2 = (TextBox)radControl.Controls[0].FindControl("txtFirstName_2");
        txtFatherName_1 = (TextBox)radControl.Controls[0].FindControl("txtFatherName_1");
        txtFatherName_2 = (TextBox)radControl.Controls[0].FindControl("txtFatherName_2");
        txtGrandFather_1 = (TextBox)radControl.Controls[0].FindControl("txtGrandFather_1");
        txtGrandFather_2 = (TextBox)radControl.Controls[0].FindControl("txtGrandFather_2");
        txtLastName_1 = (TextBox)radControl.Controls[0].FindControl("txtLastName_1");
        txtLastName_2 = (TextBox)radControl.Controls[0].FindControl("txtLastName_2");
        cmbDOBDay = (DropDownList)radControl.Controls[0].FindControl("cmbDOBDay");
        cmbDOBMonth = (DropDownList)radControl.Controls[0].FindControl("cmbDOBMonth");
        cmbDOBYear = (DropDownList)radControl.Controls[0].FindControl("cmbDOBYear");
        txtBirthPlace_1 = (TextBox)radControl.Controls[0].FindControl("txtBirthPlace_1");
        RdioDisability = (RadioButtonList)radControl.Controls[0].FindControl("RdioDisability");
        txtExplanation = (TextBox)radControl.Controls[0].FindControl("txtExplanation");

        Control radContro2 = RadPanelbar2.FindItemByValue("aca");
        txtDegree_1 = (TextBox)radContro2.Controls[0].FindControl("txtDegree_1");
        txtSpeciality_1 = (DropDownList)radContro2.Controls[0].FindControl("ddlSpeciality");
        txtCollege_1 = (DropDownList)radContro2.Controls[0].FindControl("txtCollege_1");
        txtUniversity_1 = (TextBox)radContro2.Controls[0].FindControl("txtUniversity_1");
        txtUniversityCity_1 = (TextBox)radContro2.Controls[0].FindControl("txtUniversityCity_1");
        cmbCountry_Uni=(DropDownList)radContro2.Controls[0].FindControl("cmbCountry_Uni");
        cmbDegreeFrom=(DropDownList)radContro2.Controls[0].FindControl("cmbDegreeFrom");
        ddlFromMonth_1 = (DropDownList)radContro2.Controls[0].FindControl("ddlFromMonth_1");
        cmbDegreeFromYear = (DropDownList)radContro2.Controls[0].FindControl("cmbDegreeFromYear");
        cmbDegreeTo = (DropDownList)radContro2.Controls[0].FindControl("cmbDegreeTo");
        ddlToMonth_1 = (DropDownList)radContro2.Controls[0].FindControl("ddlToMonth_1");
        cmbDegreeToYear = (DropDownList)radContro2.Controls[0].FindControl("cmbDegreeToYear");
        out100 = (RadioButton)radContro2.Controls[0].FindControl("outof100");
        out5 = (RadioButton)radContro2.Controls[0].FindControl("outof5");
        out4 = (RadioButton)radContro2.Controls[0].FindControl("outof4");
        txtMark = (TextBox)radContro2.Controls[0].FindControl("txtMarks");
        Control radContro3 = RadPanelbar2.FindItemByValue("contact_information");
        txtPOBox_1 = (TextBox)radContro3.Controls[0].FindControl("txtPOBox_1");
        txtAreaCode_1 = (TextBox)radContro3.Controls[0].FindControl("txtAreaCode_1");
        txtCity_1 = (TextBox)radContro3.Controls[0].FindControl("txtCity_1");
        txtResPhone_1 = (TextBox)radContro3.Controls[0].FindControl("txtResPhone_1");
        txtMobile_1 = (TextBox)radContro3.Controls[0].FindControl("txtMobile_1");
        txtFax_1 = (TextBox)radContro3.Controls[0].FindControl("txtFax_1");
        txtEmail_1 = (TextBox)radContro3.Controls[0].FindControl("txtEmail_1");
        txtAdditionalName_1 = (TextBox)radContro3.Controls[0].FindControl("txtAdditionalName_1");
        cmbRelation_1 = (DropDownList)radContro3.Controls[0].FindControl("cmbRelation_1");
        txtAdditionalContactPhone = (TextBox)radContro3.Controls[0].FindControl("txtAdditionalContactPhone");
        txtAdditionalContactMobile = (TextBox)radContro3.Controls[0].FindControl("txtAdditionalContactMobile");

        Control radContro4 = RadPanelbar2.FindItemByValue("login_info");
        txtUserID = (TextBox)radContro4.Controls[0].FindControl("txtUserID");
        txtPassword = (TextBox)radContro4.Controls[0].FindControl("txtPassword");
        txtPassword_1= (TextBox)radContro4.Controls[0].FindControl("txtPassword_1");
        Control radContro5 = RadPanelbar2.FindItemByValue("per_upload");
        fileUploadGraduationCertPic = (FileUpload)radContro5.Controls[0].FindControl("fileUploadGraduationCertPic");
        lblFileUploadGraduationCert = (Label)radContro5.Controls[0].FindControl("lblFileUploadGraduationCert");
        fileUploadExcellenceCert = (FileUpload)radContro5.Controls[0].FindControl("fileUploadExcellenceCert");
        lblExcellenceCertMessage = (Label)radContro5.Controls[0].FindControl("lblExcellenceCertMessage");
        fileUploadAcademicTranscript = (FileUpload)radContro5.Controls[0].FindControl("fileUploadAcademicTranscript");
        FileUploadAcademicTranscriptMessage = (Label)radContro5.Controls[0].FindControl("FileUploadAcademicTranscriptMessage");
        if (cmbDOBDay != null)
        {
            for (int intI = 1; intI <= 31; intI++)
            {
                cmbDOBDay.Items.Add(intI.ToString());
            }
        }
        cmbDOBYear = (DropDownList)radControl.Controls[0].FindControl("cmbDOBYear");
        if (cmbDOBYear != null)
        {
            for (int intI = 1370; intI <= 1415; intI++)
            {
                cmbDOBYear.Items.Add(intI.ToString());                
            }
        }
        radControl = RadPanelbar2.FindItemByValue("aca");
        cmbDegreeFrom = (DropDownList)radControl.Controls[0].FindControl("cmbDegreeFrom");
        if (cmbDegreeFrom != null)
        {
            for (int intI = 1; intI <= 31; intI++)
            {
                cmbDegreeFrom.Items.Add(intI.ToString());
            }
        }
        cmbDegreeFromYear = (DropDownList)radControl.Controls[0].FindControl("cmbDegreeFromYear");
        if (cmbDegreeFromYear != null)
        {
            for (int intI = 1418; intI <= 1428; intI++)
            {
                cmbDegreeFromYear.Items.Add(intI.ToString());
            }
        }

        cmbDegreeTo = (DropDownList)radControl.Controls[0].FindControl("cmbDegreeTo");
        if (cmbDegreeTo != null)
        {
            for (int intI = 1; intI <= 31; intI++)
            {
                cmbDegreeTo.Items.Add(intI.ToString());
            }
        }
        cmbDegreeToYear = (DropDownList)radControl.Controls[0].FindControl("cmbDegreeToYear");
        if (cmbDegreeToYear != null)
        {
            for (int intI = 1425; intI <= 1429; intI++)
            {
                cmbDegreeToYear.Items.Add(intI.ToString());
            }
        }
        if (!IsPostBack)
        {
            cmbCountry_Uni = (DropDownList)radControl.Controls[0].FindControl("cmbCountry_Uni");

            if (cmbCountry_Uni != null)
            {
                try
                {
                    reader = GeneralClass.Program.gRetrieveRecord("SELECT * FROM t_country_preset");
                    while (reader.Read())
                    {
                        cmbCountry_Uni.Items.Add(reader["country_name"].ToString().Trim());
                        if (cmbCountry_Uni.Items[cmbCountry_Uni.Items.Count - 1].Text.Trim() == "SAUDI ARABIA")
                        {
                            cmbCountry_Uni.Items[cmbCountry_Uni.Items.Count - 1].Selected = true;
                        }
                    }
                    reader.Close();
                }
                catch (OdbcException exp_country_uni)
                {
                    if (null != reader)
                        reader.Close();
                }
            }
        
        //poulating the data from database to the respective field;
        if (Session["regid"] != null)
        {
            try
            {
                reader = GeneralClass.Program.gRetrieveRecord("SELECT * FROM t_registration WHERE id=" + Session["regid"].ToString());
                while (reader.Read())
                {
                    
                    txtLocalID.Text = reader["local_id"].ToString();  
                    txtFirstName_1.Text = reader["first_name_1"].ToString();
                    txtFirstName_2.Text = reader["first_name_2"].ToString();
                    txtFatherName_1.Text = reader["father_name_1"].ToString();
                    txtFatherName_2.Text = reader["father_name_2"].ToString();
                    txtGrandFather_1.Text = reader["grand_father_1"].ToString();
                    txtGrandFather_2.Text = reader["grand_father_2"].ToString();
                    txtLastName_1.Text = reader["last_name_1"].ToString();
                    txtLastName_2.Text = reader["last_name_2"].ToString();
                    cmbDOBDay.Text = reader["dob_day"].ToString();
                    cmbDOBMonth.Text = reader["dob_month"].ToString();
                    cmbDOBYear.Text = reader["dob_year"].ToString();
                    txtBirthPlace_1.Text = reader["birth_place"].ToString();
                    if (reader["disability_yn"].ToString() == "y")
                        RdioDisability.Items[1].Selected = true;
                    else
                        RdioDisability.Items[0].Selected = true;
                    txtExplanation.Text = reader["disability_explanation"].ToString();
                    txtDegree_1.Text = reader["degree"].ToString();
                    txtSpeciality_1.SelectedItem.Text = reader["speciality"].ToString();
                    txtCollege_1.SelectedItem.Text = reader["college"].ToString();
                    txtUniversity_1.Text = reader["university"].ToString();
                    txtUniversityCity_1.Text = reader["university_city"].ToString();
                    cmbCountry_Uni.Text = reader["university_country"].ToString();
                    cmbDegreeFrom.Text = reader["degree_from_day"].ToString();
                    ddlFromMonth_1.Text = reader["degree_from_month"].ToString();
                    cmbDegreeFromYear.Text = reader["degree_from_year"].ToString();
                    cmbDegreeTo.Text = reader["degree_to_day"].ToString();
                    ddlToMonth_1.Text = reader["degree_to_month"].ToString();
                    cmbDegreeToYear.Text = reader["degree_to_year"].ToString();
                    txtMark.Text = reader["mark"].ToString();
                    if (reader["options"].ToString().Trim() == "100")
                    {   
                        out100.Checked = true;
                        out5.Checked = false;
                        out4.Checked = false;
                    }
                    else if (reader["options"].ToString().Trim() == "5")
                    {
                        out5.Checked = true;
                        out100.Checked = false;                        
                        out4.Checked = false;
                    }
                    else if (reader["options"].ToString().Trim() == "4")
                    {
                        out4.Checked = true;
                        out100.Checked =false;
                        out5.Checked = false;                        
                    }
                    txtPOBox_1.Text = reader["po"].ToString();
                    txtAreaCode_1.Text = reader["area_code"].ToString();
                    txtCity_1.Text = reader["city"].ToString();
                    txtResPhone_1.Text = reader["res_phone"].ToString();
                    txtMobile_1.Text = reader["mobile"].ToString();
                    txtFax_1.Text = reader["fax"].ToString();
                    txtEmail_1.Text = reader["email"].ToString();
                    txtAdditionalName_1.Text = reader["add_contact_name"].ToString();
                    cmbRelation_1.Text = reader["add_contact_relation"].ToString();
                    txtAdditionalContactPhone.Text = reader["add_contact_phone"].ToString();
                    txtAdditionalContactMobile.Text = reader["add_contact_mobile"].ToString();
                    txtUserID.Text = reader["login"].ToString();
                    txtPassword.Attributes.Add("pass", reader["password"].ToString());
                    txtPassword_1.Attributes.Add("pass", reader["password"].ToString());
                    txtPassword.Text= reader["password"].ToString();
                    txtPassword_1.Text = reader["password"].ToString();
                }
                reader.Close();
            }
            catch (OdbcException exp_10)
            {
            
                if (null != reader)
                    reader.Close();
            }
            
            txtUserID.Enabled = false;            
        }
    }
    }
    protected void SaveClick(object o, EventArgs e)
    {
     
        //before save, check for login id availability.;

        try
        {
            if (Session["regid"] == null)
            {
                reader = GeneralClass.Program.gRetrieveRecord("SELECT ID FROM t_registration WHERE login='" + txtUserID.Text.Trim() + "'");
                reader.Read();
                if (reader.HasRows)
                {
                    GeneralClass.MessageBox.Show("اسم المستخدم المدخل موجود مسبقا الرجاء اختيار اسم مستخدم آخر");
                    reader.Close();
                    return;
                }
                if (reader != null)
                    reader.Close();

                reader = GeneralClass.Program.gRetrieveRecord("SELECT ID FROM t_registration WHERE LOCAL_ID='" + txtLocalID.Text.Trim() + "'");
                reader.Read();
                if (reader.HasRows)
                {
                    GeneralClass.MessageBox.Show("رقم بطاقة الأحوال المدخل مسجل مسبقا.");
                    reader.Close();
                    return;
                }
                if (reader != null)
                    reader.Close();

            }
        }
        catch (OdbcException exp_login_avail)
        {
            if (reader != null)
                reader.Close();
        }
        lblProgramInfor.ForeColor = System.Drawing.Color.Black;
        
        //validation for grade;
        Control radControl = RadPanelbar2.FindItemByValue("aca");
        Label lblMarkStat = (Label)radControl.Controls[0].FindControl("lblMarksStatus");
        if (txtMark.Text.Trim() == "")
        {
            lblMarkStat.Visible = true;
            lblMarkStat.Text = "المعدل غير مقبول";
            return;
        }
        double decMarks ;
        if (out100.Checked == true)//should have a minimum of 75%;
        {
            decMarks = double.Parse(txtMark.Text);
            if(decMarks<70.00)
            {
                lblMarkStat.Visible = true;
                lblMarkStat.Text = "المعدل غير مقبول";
                return;
            }
        }
        else if (out4.Checked == true)
        {
            decMarks = double.Parse(txtMark.Text);
            if (decMarks<2.0)
            {
                
                lblMarkStat.Visible = true;
                lblMarkStat.Text = "المعدل غير مقبول";
                return;

            }
        }
        else if (out5.Checked == true)
        {
            decMarks = double.Parse(txtMark.Text);
            if (decMarks < 3.0)
            {
                lblMarkStat.Visible = true;
                lblMarkStat.Text = "المعدل غير مقبول";
                return;

            }
        }
        radControl = RadPanelbar2.FindItemByValue("login_info");
        if (txtUserID.Text.Trim() == "")
        {
            Label lblUserName = (Label)radControl.Controls[0].FindControl("lblUserName");
            lblUserName.Visible = true;
            GeneralClass.MessageBox.Show("الرجاء ادخال اسم مستخدم");            
            return;
        }
        

        GeneralClass.Program.Add("local_id", txtLocalID.Text, "S");
        GeneralClass.Program.Add("full_name_1", txtFirstName_1.Text + " " + txtFatherName_1.Text + " " + txtGrandFather_1.Text + " " + txtLastName_1.Text, "S");
        GeneralClass.Program.Add("full_name_2", txtFirstName_2.Text + " " + txtFatherName_2.Text + " " + txtGrandFather_2.Text + " " + txtLastName_2.Text, "S");
        GeneralClass.Program.Add("first_name_1", txtFirstName_1.Text, "S");
        GeneralClass.Program.Add("first_name_2", txtFirstName_2.Text, "S");
        GeneralClass.Program.Add("father_name_1", txtFatherName_1.Text, "S");
        GeneralClass.Program.Add("father_name_2", txtFatherName_2.Text, "S");
        GeneralClass.Program.Add("grand_father_1", txtGrandFather_1.Text, "S");
        GeneralClass.Program.Add("grand_father_2", txtGrandFather_2.Text, "S");
        GeneralClass.Program.Add("last_name_1", txtLastName_1.Text, "S");
        GeneralClass.Program.Add("last_name_2", txtLastName_2.Text, "S");
        GeneralClass.Program.Add("dob_day", cmbDOBDay.Text, "S");
        GeneralClass.Program.Add("dob_month", cmbDOBMonth.Text, "S");
        GeneralClass.Program.Add("dob_year", cmbDOBYear.SelectedValue, "S");
        GeneralClass.Program.Add("birth_place", txtBirthPlace_1.Text, "S");
        //The following code to pick the disability selected value;
        if (RdioDisability.Items[0].Selected == true)
            GeneralClass.Program.Add("disability_yn", "n", "S");
        else
            GeneralClass.Program.Add("disability_yn", "y", "S");
        GeneralClass.Program.Add("disability_explanation", txtExplanation.Text, "S");
        GeneralClass.Program.Add("degree", txtDegree_1.Text, "S");
        GeneralClass.Program.Add("speciality", txtSpeciality_1.SelectedItem.Text, "S");
        GeneralClass.Program.Add("college", txtCollege_1.SelectedItem.Text, "S");
        GeneralClass.Program.Add("university", txtUniversity_1.Text, "S");
        GeneralClass.Program.Add("university_city", txtUniversityCity_1.Text, "S");
        GeneralClass.Program.Add("university_country", cmbCountry_Uni.Text, "S");
        GeneralClass.Program.Add("degree_from_day", cmbDegreeFrom.Text, "S");
        GeneralClass.Program.Add("degree_from_month", ddlFromMonth_1.Text, "S");
        GeneralClass.Program.Add("degree_from_year", cmbDegreeFromYear.SelectedValue, "S");
        GeneralClass.Program.Add("degree_to_day", cmbDegreeTo.Text, "S");
        GeneralClass.Program.Add("degree_to_month", ddlToMonth_1.Text, "S");
        GeneralClass.Program.Add("degree_to_year", cmbDegreeToYear.SelectedValue, "S");
        //The following code will determine the GPA kind to be picked;

        if(out100.Checked==true )
            GeneralClass.Program.Add("options","100","S");
        else if(out5.Checked ==true)
              GeneralClass.Program.Add("options","5","S");
        else if(out4.Checked==true)
             GeneralClass.Program.Add("options","4","S");
        GeneralClass.Program.Add("mark",txtMark.Text,"I");
        GeneralClass.Program.Add("po",txtPOBox_1.Text,"S");
        GeneralClass.Program.Add("area_code",txtAreaCode_1.Text,"S");
        GeneralClass.Program.Add("city",txtCity_1.Text,"S");
        GeneralClass.Program.Add("res_phone",txtResPhone_1.Text,"S");
        GeneralClass.Program.Add("mobile",txtMobile_1.Text,"S");
        GeneralClass.Program.Add("fax",txtFax_1.Text,"S");
        GeneralClass.Program.Add("email",txtEmail_1.Text,"S");
        GeneralClass.Program.Add("add_contact_name",txtAdditionalName_1.Text,"S");
        GeneralClass.Program.Add("add_contact_relation",cmbRelation_1.Text,"S");
        GeneralClass.Program.Add("add_contact_phone",txtAdditionalContactPhone.Text,"S");
        GeneralClass.Program.Add("add_contact_mobile",txtAdditionalContactMobile.Text,"S");
        GeneralClass.Program.Add("login", txtUserID.Text, "S");
        GeneralClass.Program.Add("password", txtPassword.Text, "S");
       
        
        GeneralClass.Program.Add("FLAG","n","S");
        if (Session["regid"] == null)
        {
            int intRegID = GeneralClass.Program.InsertRecordStatement("t_registration");
            if (intRegID > 0)
            {
                if (!System.IO.Directory.Exists(Server.MapPath("UFiles\\" + intRegID.ToString())))
                {
                    System.IO.Directory.CreateDirectory(Server.MapPath("UFiles\\" + intRegID.ToString()));
                }

                Session.Add("regid", intRegID.ToString());
                HttpContext.Current.Response.Redirect("ack.aspx?regid=" + intRegID);
            }
        }
        else
        {
            GeneralClass.Program.UpdateRecordStatement("t_registration", "id", Session["regid"].ToString());
            HttpContext.Current.Response.Redirect("default2.aspx");
        }
    }

    protected void grader(object o, EventArgs e)
    {
        System.Threading.Thread.Sleep(1000);
        txtMark.Text = "";
        RadioButton radMarks = (RadioButton)o;
        Control radControl = RadPanelbar2.FindItemByValue("aca");
        AjaxControlToolkit.TextBoxWatermarkExtender txtMarksExt = (AjaxControlToolkit.TextBoxWatermarkExtender)radMarks.FindControl("ajax_marks");
        if (txtMarksExt == null) return;
        if (radMarks.ID.ToString() == "outof100")
        {
            txtMarksExt.WatermarkText = "ادخل المعدل من 100";
        }
        else if (radMarks.ID.ToString() == "outof5")
        {
            txtMarksExt.WatermarkText = "ادخل المعدل من 5";
        }
        else if (radMarks.ID.ToString() == "outof4")
        {
            txtMarksExt.WatermarkText = "ادخل المعدل من 4";
        }

        UpdatePanel upd_pnl1 = (UpdatePanel)radMarks.FindControl("upd_pnl1");
        if (upd_pnl1 != null)
        {
            RangeValidator rng_gpa = (RangeValidator)upd_pnl1.ContentTemplateContainer.FindControl("rng_gpa");
            if (rng_gpa != null)
            {
               
                if (radMarks.ID.ToString() == "outof5")
                {
                    rng_gpa.MinimumValue = "3.00";
                    rng_gpa.MaximumValue = "5.00";
                }
                else if (radMarks.ID.ToString() == "outof4")
                {
                    rng_gpa.MinimumValue = "2.00";
                    rng_gpa.MaximumValue = "4.00";
                }
                else if (radMarks.ID.ToString() == "outof100")
                {
                    rng_gpa.MinimumValue = "70.00";
                    rng_gpa.MaximumValue = "100.00";
                }
            }
        }
    }

    protected void CancelClick(object o, EventArgs e)
    {
        if(Session["regid"]!=null)
        {
        HttpContext.Current.Response.Redirect("Default2.aspx");
        }
        else
        {
            HttpContext.Current.Response.Redirect("index.aspx");        
        }
        
    }

    protected void GotoHome(object o, EventArgs e)
    {
        if (Session["regid"] != null)
            HttpContext.Current.Response.Redirect("Default2.aspx");
        else
            HttpContext.Current.Response.Redirect("index.aspx");
    }
    protected void GoLogout(object o, EventArgs e)
    {
        Session.Abandon();
        HttpContext.Current.Response.Redirect("index.aspx");
    }
    protected void mUploadStudentFiles(object sender, EventArgs e)
    {

        //=====================================================//
        /// <summary>
        /// Description:This function will be used to upload the documents of the register to the server specified folder
        /// Author: mutawakelm
        /// Date :03/03/2008 11:06:45 AM
        /// Parameter:
        /// input:
        /// output:
        /// Example:
        /// <summary>
        //=====================================================//
        try
        {


            //The following code will be used to create a new folder fot the student with the local id name
            if (txtLocalID.Text == "")
            {
                Page.Controls.Add(new LiteralControl("<script language='javascript'> window.alert('الرجاء ادخال رقم بطاقة الأحوال قبل محاولة رفع المستندات')</script>"));

                return;
            }

            if (!string.IsNullOrEmpty(txtLocalID.Text.ToString()))
            {

                System.IO.Directory.CreateDirectory(Server.MapPath("uploads\\") + txtLocalID.Text.ToString() + "\\");

            }

            if (fileUploadGraduationCertPic.Enabled == true)
            {
                if ((!(fileUploadGraduationCertPic.PostedFile.ContentType.Equals("image/pjpeg")) || (fileUploadGraduationCertPic.PostedFile.ContentLength / 1048576 > 4)))
                {
                    if (fileUploadGraduationCertPic.HasFile)
                        lblFileUploadGraduationCert.Text = "يجب ان يكون امتداد الصورة .jpg وأن يكون حجمها اقل من 4ميجا بايت";

                }
                else
                    if (fileUploadGraduationCertPic.HasFile)
                    {

                        string pictureImageSplitter = fileUploadGraduationCertPic.FileName.ToString();

                        fileUploadGraduationCertPic.SaveAs(Server.MapPath("uploads\\") + txtLocalID.Text.ToString() + "\\graduation_certificate." + pictureImageSplitter.Substring(pictureImageSplitter.Length - 3, 3).ToString());
                        fileUploadGraduationCertPic.Enabled = false;
                        lblFileUploadGraduationCert.Text = "";

                    }
            }
            if (fileUploadExcellenceCert.Enabled == true)
            {
                if ((!(fileUploadExcellenceCert.PostedFile.ContentType.Equals("image/pjpeg")) || (fileUploadExcellenceCert.PostedFile.ContentLength / 1048576 > 4)))
                {
                    if (fileUploadExcellenceCert.HasFile)
                        lblExcellenceCertMessage.Text = "يجب ان يكون امتداد الصورة .jpg وأن يكون حجمها اقل من 4ميجا بايت";

                }
                else
                    if (fileUploadExcellenceCert.HasFile)
                    {

                        string pictureImageSplitter = fileUploadExcellenceCert.FileName.ToString();

                        fileUploadExcellenceCert.SaveAs(Server.MapPath("uploads\\") + txtLocalID.Text.ToString() + "\\Excellence_certificate." + pictureImageSplitter.Substring(pictureImageSplitter.Length - 3, 3).ToString());
                        fileUploadExcellenceCert.Enabled = false;
                        lblExcellenceCertMessage.Text = "";

                    }
            }
            if (fileUploadAcademicTranscript.Enabled == true)
            {
                string fileUploadType = fileUploadAcademicTranscript.PostedFile.ContentType.ToString();
                if (!(fileUploadType == "application/octet-stream" || fileUploadType == "application/zip" || fileUploadType == "application/x-zip-compressed" || fileUploadType == "application/x-zip") || (fileUploadAcademicTranscript.PostedFile.ContentLength / 1048576 > 4))
                {
                    if (fileUploadAcademicTranscript.HasFile)
                        FileUploadAcademicTranscriptMessage.Text = "يجب ان يكون امتداد الملف .zip وأن يكون حجمه اقل من 4ميجا بايت";

                }
                else
                    if (fileUploadAcademicTranscript.HasFile)
                    {

                        string pictureImageSplitter = fileUploadAcademicTranscript.FileName.ToString();

                        fileUploadAcademicTranscript.SaveAs(Server.MapPath("uploads\\") + txtLocalID.Text.ToString() + "\\Academic_Transcript." + pictureImageSplitter.Substring(pictureImageSplitter.Length - 3, 3).ToString());
                        fileUploadAcademicTranscript.Enabled = false;
                        FileUploadAcademicTranscriptMessage.Text = "";

                    }
            }




        }
        catch (Exception mUploadStudentFiles_Exp)
        {

        }
    }
}