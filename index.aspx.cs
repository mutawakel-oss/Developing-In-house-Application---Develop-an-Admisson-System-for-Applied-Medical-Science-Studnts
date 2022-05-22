using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using Telerik.RadWindowUtils;
using System.Data.Odbc;
public partial class runonce : System.Web.UI.Page
{
    OdbcDataReader reader;
    protected void chk_agree_terms_CheckedChanged(object sender, EventArgs e)
    {
        if (chk_agree_terms.Checked == true)
            btnAgree.Enabled = true;
        else
            btnAgree.Enabled = false;
    }
    protected void gotoRegister(object o, EventArgs e)
    {
        HttpContext.Current.Response.Redirect("default.aspx");
    }
    protected void Page_Load(object sender, EventArgs e)
    {
    }

    protected void CheckLogin(object sender, EventArgs e)
    {
        try
        {
            reader = GeneralClass.Program.gRetrieveRecord("SELECT id,login,full_name_1 FROM t_registration WHERE login='" + txtLoginname.Text + "' AND password='" + txtPassword.Text + "'");

            while (reader.Read())
            {
                Session.Add("regid", reader["id"].ToString());
                Session.Add("login", reader["login"].ToString());
                Session.Add("fullname", reader["full_name_1"].ToString());
                
                reader.Close();
                HttpContext.Current.Response.Redirect("Default2.aspx");
            }
            if (reader != null)
                reader.Close();
        }
        catch (OdbcException exp_1)
        {
            if (null != reader)
                reader.Close();
        }        
    }
    protected void proInfo(object o, EventArgs e)
    {
        try
        {
           
                string FileName = AppDomain.CurrentDomain.BaseDirectory+ "PBMLprogram.doc";
                Response.ContentType = "application/msword";
                Response.AppendHeader("Content-Disposition", "attachment; filename=PBML program.doc");
                Response.TransmitFile(FileName);
            
           // System.Diagnostics.Process.Start("C:'\'PBML program.doc");
           
        }
        catch (Exception exp)
        {
           
            
        }
    }
    protected void mContactUs(object sender, EventArgs e)
    {

        //=====================================================//
        /// <summary>
        /// Description:This function will be used to open the email account to send an email
        /// Author: mutawakelm
        /// Date :11/25/2009 8:44:19 AM
        /// Parameter:
        /// input:
        /// output:
        /// Example:
        /// <summary>
        //=====================================================//
        try
        {

        }
        catch (Exception exp)
        {
        }
    }
}
