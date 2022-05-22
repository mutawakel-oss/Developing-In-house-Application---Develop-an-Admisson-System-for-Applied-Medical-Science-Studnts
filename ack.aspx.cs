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

public partial class ack : System.Web.UI.Page
{
    
    protected void Page_Load(object sender, EventArgs e)
    {
    
    }
    protected void CheckedChanged(object o, EventArgs e)
    {
        CheckBox chk = (CheckBox)o;
        Button btnSave = (Button)upd_check.FindControl("btnSave");
        if (chk.Checked == true)        
            btnSave.Enabled = true;
        else
            btnSave.Enabled = false;
    }

    protected void SaveRecord(object o, EventArgs e)
    {
        if (HttpContext.Current.Request.QueryString["regid"] != null)
        {
            //update the record WHERE Id=HttpContext.Current.Request.QueryString["regid"]
            GeneralClass.Program.Add("flag", "y", "S");
            GeneralClass.Program.UpdateRecordStatement("t_registration", "id", HttpContext.Current.Request.QueryString["regid"].ToString());
            HttpContext.Current.Response.Redirect("Default2.aspx");
        }
    }
}
