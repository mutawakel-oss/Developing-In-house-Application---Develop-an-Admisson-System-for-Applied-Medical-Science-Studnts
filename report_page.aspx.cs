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
using CrystalDecisions.CrystalReports.Engine;


public partial class report_page : System.Web.UI.Page
{
    
    protected void Page_Load(object sender, EventArgs e)
    {
        /*CrystalDecisions.Shared.TableLogOnInfo logOnInfo = new CrystalDecisions.Shared.TableLogOnInfo();
       
        logOnInfo.ConnectionInfo.ServerName = System.Configuration.ConfigurationManager.AppSettings["regBac"];
        logOnInfo.ConnectionInfo.DatabaseName = System.Configuration.ConfigurationManager.AppSettings["RegistrationBAC"];
        logOnInfo.ConnectionInfo.UserID = System.Configuration.ConfigurationManager.AppSettings["appuser"];
        
        logOnInfo.ConnectionInfo.Password = System.Configuration.ConfigurationManager.AppSettings["appuser"];
        logOnInfo.ReportName = "studnet_report";
        CrystalDecisions.Shared.TableLogOnInfos logOnInfo2 = new CrystalDecisions.Shared.TableLogOnInfos();
        logOnInfo2.Add(logOnInfo);*/
       // this.CrystalReportViewer1.LogOnInfo = logOnInfo;
         

    }
    protected void CrystalReportViewer1_Init(object sender, EventArgs e)
    {

      
    }
}
