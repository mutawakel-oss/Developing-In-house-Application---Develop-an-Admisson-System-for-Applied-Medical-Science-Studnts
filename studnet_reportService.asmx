<%@ webservice language="C#" class="studnet_reportService" %>

using System;
using System.Web.Services;
using CrystalDecisions.Shared;
using CrystalDecisions.CrystalReports.Engine;
using CrystalDecisions.ReportSource;
using CrystalDecisions.Web.Services;

[ WebService( Namespace="http://crystaldecisions.com/reportwebservice/9.1/" ) ]
public class studnet_reportService : ReportServiceBase
{
    public studnet_reportService()
    {
        //
        // TODO: Add any constructor code required
        //
    
        
        this.ReportSource = this.Server.MapPath( "studnet_report.rpt" );
    }
}


