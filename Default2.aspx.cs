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
using System.Data.Odbc;
public partial class Default2 : System.Web.UI.Page
{
    OdbcDataReader reader;
    protected void Page_Load(object sender, EventArgs e)
    {
        Control RadRadPanelbar1 = RadPanelbar1.FindItemByValue("menus");
        LinkButton lnkLogout = (LinkButton)RadRadPanelbar1.Controls[0].FindControl("lnkLogout");
        if (Session["regid"] == null) 
        {
            lnkLogout.Visible = false;
        }
        if (!IsPostBack)
        {
            if (Session["regid"] != null)
            {
                try
                {
                    reader = GeneralClass.Program.gRetrieveRecord("SELECT id,full_name_1,login FROM t_registration WHERE id=" + Session["regid"].ToString());
                    while (reader.Read())
                    {
                        RadPanelbar2.Items[0].Text = "مرحباً:  "+reader["full_name_1"].ToString() ;
                    }
                    reader.Close();
                }
                catch (OdbcException exp_2)
                {
                    if (null != reader)
                        reader.Close();
                }
            }
            Control radControl = RadPanelbar2.FindItemByValue("per_info");
            Label lblStatus = (Label)radControl.Controls[0].FindControl("lblCurrentstats");
            if (lblStatus != null)
            {
                lblStatus.Text = "Submitted";
            }
        }
    }
    
    protected void PBack(object o, EventArgs e)
    {
        HttpContext.Current.Response.Redirect("default.aspx");
    }
    protected void GotoHome(object o, EventArgs e)
    {
        if (Session["regid"] != null)
            HttpContext.Current.Response.Redirect("index.aspx");
        else
            HttpContext.Current.Response.Redirect("index.aspx");
    }
    protected void GoLogout(object o, EventArgs e)
    {
        Session.Abandon();
        HttpContext.Current.Response.Redirect("index.aspx");
    }
}
