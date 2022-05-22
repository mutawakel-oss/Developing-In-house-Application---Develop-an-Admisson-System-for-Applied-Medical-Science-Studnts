using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Odbc;
using System.Collections.Specialized;
using System.Configuration;
using System.Data.SqlClient;
using System.Web;
using System.Web.Mail;
using System.Text;
using System.Web.UI;
using System.Collections;
namespace GeneralClass
{
    public static class Program
    {
        /*The timspan is used to findout the execution time
         * 
         * */
        public static DataTable dt = null;
        public static DataColumn dc = null;
        public static string strSql = "";
        public static string APP_MSG_TITLE = "";
        
        public static OdbcConnection REG_CONN = new OdbcConnection();

        //public static OdbcConnection REG_CONN = new OdbcConnection();
        
        public static SqlConnection KSUHS_CONN = new SqlConnection();
     
        public static NameValueCollection FieldValue = new NameValueCollection();

        //====these variables used to store current user name==========
        public static string strUserName;
        public static string strUserType;
        public static int intUserID;
        //=============================================================
        public static string UserName
        {
            get { return strUserName; }
            set { strUserName = value; }
        }

        public static string UserType
        {
            get { return strUserType; }
            set { strUserType = value; }
        }
        public static int UserID
        {
            get { return intUserID; }
            set { intUserID = value; }
        }

        public static char[] sep = { ',' };
        
        public static int DatabaseConnect()
        {
            try
            {

                string strDBConnectionString = "DSN=regBac;uid=sa;pwd=dbadmin";


                if (REG_CONN.State.ToString().Trim() == "Open")
                    {
                        return 1;
                    }

                    REG_CONN.ConnectionString = strDBConnectionString;
                    REG_CONN.Open();
                    if (REG_CONN.State.ToString().Trim() != "Open")//if database connection failed then
                    {
                        return 0; //return 1;
                    }
                    else//if database connection success then
                    {
                        return 1; // return 0;
                    }                
                
            }
            catch (SqlException SQLException)
            {  
                return -1;
            }

        }

        public static void AddComboItems(string p_tablename, string p_displaymember, string p_valuemember, System.Web.UI.WebControls.DropDownList Combo)
        {
            //This function used to get a dataset, which can be used to populate the control like combobox
            //Parameter: 
            //p_tablename. The table name from where the data need to popluate.
            //p_DisplayMember. The display field. This is the filed the combox will display.
            //p_ValueMember. The value member property. This stored the ID field we passed in.
            //Combo. The name of the combo box. This function fills the data in to this combo box
            //This function will only display one field value in the combbox
            //DatabaseConnect();
            //SqlDataAdapter dataadapter = new SqlDataAdapter("SELECT " + p_displaymember + "," + p_valuemember + " FROM " + p_tablename + " ORDER BY " + p_displaymember, REG_CONN);

            OdbcDataAdapter dataadapter = new OdbcDataAdapter("SELECT " + p_displaymember + "," + p_valuemember + " FROM " + p_tablename + " ORDER BY " + p_valuemember, REG_CONN);
            DataSet dataset = new DataSet();
            dataadapter.Fill(dataset, p_tablename);
            Combo.DataSource = dataset;
            Combo.DataTextField =  p_displaymember;
            Combo.DataValueField =  p_valuemember;
            Combo.DataBind();
        }

        public static OdbcDataReader gDataReader(string tablename, string fields, string Where)
        {
            try
            {
                //This fuction used to return the datareader object to the client form.
                //Parameter:
                //tablename: This is the table name used for command object
                //fields: This is the field name used for command object
                //return: DataReader object
                //->Start
                
                OdbcCommand odbcCommand = new OdbcCommand("SELECT " + fields + " FROM " + tablename + " WHERE " + Where, REG_CONN);
                OdbcDataReader datareader = null;
                datareader = odbcCommand.ExecuteReader();
                return datareader;
            }
            catch (Exception exp)
            {
                return null;
            }
            //->End
        }
        public static int InsertRecordStatement(string tablename)
        {
            try
            {   
                //Return generated insert statement
                GeneralClass.Program.DatabaseConnect();
                string strSQLStatement = PrepareInsertSQLStatement(tablename);
                //Accesing the stored procedure from the database.
                //SP Name: InsertStatement.
                //Parmeter: 
                //TableName
                //SQL Statement
                //Return Value from the stored procedure.
                //(?,?,?): accepting three parameter: 2 Input and 1 output parameter.
                OdbcCommand p_Command = new OdbcCommand("{ call InsertRecord (?, ?,?)}", REG_CONN);
                p_Command.CommandType = CommandType.StoredProcedure;
                OdbcParameter prm = p_Command.Parameters.Add("@tablename", OdbcType.VarChar);
                prm.Direction = ParameterDirection.Input;
                prm.Value = tablename;
                OdbcParameter prm1 = p_Command.Parameters.Add("@statement", OdbcType.VarChar);
                prm1.Direction = ParameterDirection.Input;
                prm1.Value = strSQLStatement;

                //Specify the Return Parameter
                OdbcParameter prm2 = p_Command.Parameters.Add("@ReturnValue", OdbcType.Int);
                prm2.Direction = ParameterDirection.ReturnValue;

                p_Command.ExecuteNonQuery();
                //return the value to the stored procedure.

                if (p_Command.Parameters[2].Value.ToString() != "")
                {
                    return (int)p_Command.Parameters[2].Value;
                }
                else
                    return 0;

            }
            catch (OdbcException odbcexp)
            {
                return 0;
            }
        }
        public static void Add(string p_fieldName, string p_fieldValue, string p_dataType)
        {
            //This function used to store the field name and the value for the table.
            //parameter:
            //p_fieldName: Database table field Name
            //p_fieldValue: field value
            //p_dataType: field data type
            //Return value: none
            p_fieldValue = p_fieldValue.Replace("'", "''");
            if (p_dataType == "I")
            {
                //If value type is Integer, then donot use the quots
                FieldValue.Add(p_fieldName, p_fieldValue);
            }
            if (p_dataType == "S" || p_dataType == "D")
            {
                //If value type is string or dare, then use the quots
                FieldValue.Add(p_fieldName, "'" + p_fieldValue + "'");
            }

        }
        private static string PrepareInsertSQLStatement(string tablename)
        {
            //This function allows you to Prepare an SQL Statement from the collection.
            //Parameter:
            //tablename
            //Return value: Insert Statement String
            string FieldNames = "INSERT INTO " + tablename + " (", FieldValues = "(";
            for (int i = 0; i <= FieldValue.Count - 1; i++)
            {
                FieldNames += FieldValue.GetKey(i).ToString() + ",";
                FieldValues += (FieldValue.GetValues(FieldValue.Keys[i])[0]).ToString() + ",";
            }
            FieldNames = FieldNames.Remove(FieldNames.Length - 1);
            FieldNames += ") VALUES";
            FieldValues = FieldValues.Remove(FieldValues.Length - 1);
            FieldValues += ")";

            FieldValue.Clear();

            return FieldNames + FieldValues;
        }
        public static int UpdateRecordStatement(string tablename, string p_keyField, string p_KeyValue)
        {
            
            string strSQLStatement = PrepareUpdateSQLStatement(tablename, p_keyField, p_KeyValue);

            //Accesing the stored procedure from the database.
            //SP Name: InsertStatement.
            //Parmeter: 
            //TableName
            //SQL Statement
            //Return Value from the stored procedure.
            //(?,?,?): accepting three parameter: 2 Input and 1 output parameter.
            OdbcCommand p_Command = new OdbcCommand("{ call UpdateRecord (?, ?,?)}", REG_CONN);
            p_Command.CommandType = CommandType.StoredProcedure;
            OdbcParameter prm = p_Command.Parameters.Add("@tablename", OdbcType.VarChar);
            prm.Direction = ParameterDirection.Input;
            prm.Value = tablename;
            OdbcParameter prm1 = p_Command.Parameters.Add("@statement", OdbcType.VarChar);
            prm1.Direction = ParameterDirection.Input;
            prm1.Value = strSQLStatement;

            //Specify the Return Parameter
            OdbcParameter prm2 = p_Command.Parameters.Add("@ReturnValue", OdbcType.Int);
            prm2.Direction = ParameterDirection.ReturnValue;

            p_Command.ExecuteNonQuery();
            //return the value to the stored procedure.

            return (int)p_Command.Parameters[2].Value;


        }
        public static string PrepareUpdateSQLStatement(string tablename, string p_keyField, string p_KeyValue)
        {
            //This function allows you to Prepare an SQL Statement from the collection.
            //Parameter:
            //tablename
            //Return value: Update Statement String
            string FieldNames = "UPDATE " + tablename + " SET ", FieldValues = "";
            //Generating the update statement by looping through the collection
            for (int i = 0; i <= FieldValue.Count - 1; i++)
            {
                FieldValues += FieldValue.GetKey(i).ToString() + "=" + (FieldValue.GetValues(FieldValue.Keys[i])[0]).ToString() + ",";
            }
            FieldValues = FieldValues.Remove(FieldValues.Length - 1);
            FieldValues += " WHERE " + p_keyField + "=" + p_KeyValue;

            FieldValue.Clear();
            //return the final statement.
            return FieldNames + FieldValues;
        }
        public static void AddComboItemX(string p_tablename, string p_LangName1, string p_LangName2, string p_orderby, System.Web.UI.WebControls.DropDownList combo)
        {   
            DataTable list = new DataTable();
            OdbcDataReader reader = null;
            int intRow = 0;
            int intCol = 0;
            list.Columns.Add(new DataColumn("Name", typeof(string)));
            list.Columns.Add(new DataColumn("Id", typeof(int)));

            reader = gDataReader(p_tablename, "Id," + p_LangName1 + "," + p_LangName2, " ID >0");
            while (reader.Read())
            {
                list.Rows.Add(list.NewRow());
                list.Rows[intRow][0] = reader[p_LangName1].ToString().Trim() + " - " + reader[p_LangName2].ToString().Trim();
                list.Rows[intRow][intCol + 1] = reader["Id"];
                intRow += 1;
            }

            combo.DataSource = list;
            combo.DataTextField = "Name";
            combo.DataValueField = "Id";
        }
        public static void gClearTable(string strTableName)
        {
            try
            {   
                strSql = "DELETE FROM " + strTableName;
                OdbcCommand objCommand = new OdbcCommand(strSql, REG_CONN);                
                objCommand.CommandType = CommandType.Text;
                objCommand.ExecuteNonQuery();
            }
            catch (OdbcException odbcexp)
            {
            }
        }
        public static DataSet gDataSet(string p_TableName, string p_FieldName, string p_Where)
        {
            try
            {                
                OdbcDataAdapter dataadapter = new OdbcDataAdapter("SELECT " + p_FieldName + " FROM " + p_TableName + p_Where, REG_CONN);
                DataSet dataset = new DataSet();
                dataadapter.Fill(dataset, p_TableName);
                return dataset;
            }
            catch (OdbcException odbcexp)
            {
                return null;
            }
        }
        public static DataTable gDataTable(string p_TableName, string p_FieldName, string p_Where)
        {
            try
            {
                OdbcDataAdapter dataadapter = new OdbcDataAdapter("SELECT " + p_FieldName + " FROM " + p_TableName + p_Where, REG_CONN);
                DataTable dtTemp = new DataTable();
                dataadapter.Fill(dtTemp);
                return dtTemp;                
            }
            catch (OdbcException odbcexp)
            {
                return null;
            }
        }
        public static DataTable gSqlDataTable(string strSql)
        {
            try
            {
                OdbcDataAdapter dataadapter = new OdbcDataAdapter(strSql, REG_CONN);
                DataTable dtTemp = new DataTable();
                dataadapter.Fill(dtTemp);
                return dtTemp;
            }
            catch (OdbcException odbcexp)
            {
                return null;
            }
        }
        public static OdbcDataReader gRetrieveRecord(string p_SQLStatement)
        {//->
            //This function used to return a recordset from the database stored procedure.
            //Paramerer: p_SQLStatement for @selectstatement
            try
            {
                //This function returns the recordset from the stored procedure
                
                OdbcCommand sp_Command = new OdbcCommand("{ call ReturnGeneralRecord(?)}", REG_CONN);
                OdbcParameter prm = sp_Command.Parameters.Add("@selectstatement", OdbcType.VarChar);
                prm.Direction = ParameterDirection.Input;
                prm.Value = p_SQLStatement;

                sp_Command.CommandType = CommandType.StoredProcedure;
                OdbcDataReader sp_Reader = sp_Command.ExecuteReader();
                return sp_Reader;
            }
            catch (OdbcException exp)
            {
                return null;
            }
        }

        public static OdbcDataReader gRetrieveHistory(string p_student_id, string p_exam_year)
        {
            try
            {
                OdbcCommand sp_command = new OdbcCommand("{ call RetrieveHistory(?,?)}", REG_CONN);
                OdbcParameter prm1 = sp_command.Parameters.Add("@student_id", OdbcType.VarChar);
                prm1.Direction = ParameterDirection.Input;
                prm1.Value = p_student_id;

                OdbcParameter prm2 = sp_command.Parameters.Add("@p_exam_year", OdbcType.VarChar);
                prm2.Direction = ParameterDirection.Input;
                prm2.Value = p_exam_year;

                sp_command.CommandType = CommandType.StoredProcedure;
                OdbcDataReader sp_Reader = sp_command.ExecuteReader();
                
                return sp_Reader;

            }
            catch(OdbcException exp)
            {
                return null;
            }
        }

        public static void gDeleteRecord(string p_SQLStatement)
        {
            try
            {
                //This function returns the recordset from the stored procedure                
                OdbcCommand sp_Command = new OdbcCommand("{ call execsql(?)}", REG_CONN);
                OdbcParameter prm = sp_Command.Parameters.Add("@sql", OdbcType.VarChar);
                prm.Direction = ParameterDirection.Input;
                prm.Value = p_SQLStatement;

                sp_Command.CommandType = CommandType.StoredProcedure;
                OdbcDataReader sp_Reader = sp_Command.ExecuteReader();
                sp_Reader.Close();

            }
            catch (OdbcException exp)
            {
            }
        }
        public static DataSet gDataSetGridView(string strSQL, string p_TableName)
        {
            try
            {
                DatabaseConnect();
                OdbcDataAdapter dataadapter = new OdbcDataAdapter(strSQL, REG_CONN);
                DataSet dataset = new DataSet();
                dataadapter.Fill(dataset, p_TableName);
                return dataset;
            }
            catch (OdbcException odbcexp)
            {
                return null;
            }
        }
        //====================EMAIL communication======================
        public static void SendMail(string FROM, string TO, string SUBJECT, string BODY)
        {
            //================FROM and TO==================//
            MailMessage mail = new MailMessage();
            mail.To = TO;
            mail.From = FROM;
            mail.Subject = SUBJECT;
            mail.Body = "<div dir='rtl'>" + BODY +"</div>";
            mail.BodyFormat = MailFormat.Html;
            mail.BodyEncoding = System.Text.Encoding.UTF8; 
            //MailAttachment objAttachment = new MailAttachment(HttpContext.Current.Server.MapPath("images//logo.jpg"));                                  
            //mail.Attachments.Add(objAttachment);                      
            

            mail.Fields.Add("http://schemas.microsoft.com/cdo/configuration/smtpauthenticate", "1");
            mail.Fields.Add("http://schemas.microsoft.com/cdo/configuration/sendusername", "med/wtest");
            mail.Fields.Add("http://schemas.microsoft.com/cdo/configuration/sendpassword", "test123");
            
            //=============SMTP Server==================/
            SmtpMail.SmtpServer = "mail.med.ksuhs.edu.sa";
            //==========================================/
            //====Sending email to the email address====/
            try
            {
                SmtpMail.Send(mail);
            }
            catch (Exception exp)
            {

            }
        }

        public static void DbTable()
        {
            dc = new DataColumn("Type");
            dt.Columns.Add(dc);
            dc = new DataColumn("DegreeName");
            dt.Columns.Add(dc);
        }
    }

    public static class MessageBox
    {
        //Author:   Somashekhar
        //Date:     10-Sep-2007
        //Usage:    MessageBox.Show("Completed successfully")
        private static Hashtable m_executingPages = new Hashtable();



        public static void Show(string sMessage)
        {
            // If this is the first time a page has called this method then
            if (!m_executingPages.Contains(HttpContext.Current.Handler))
            {
                // Attempt to cast HttpHandler as a Page.
                Page executingPage = HttpContext.Current.Handler as Page;

                if (executingPage != null)
                {
                    // Create a Queue to hold one or more messages.
                    Queue messageQueue = new Queue();

                    // Add our message to the Queue
                    messageQueue.Enqueue(sMessage);

                    // Add our message queue to the hash table. Use our page reference
                    // (IHttpHandler) as the key.
                    m_executingPages.Add(HttpContext.Current.Handler, messageQueue);

                    // Wire up Unload event so that we can inject some JavaScript for the alerts.
                    executingPage.Unload += new EventHandler(ExecutingPage_Unload);
                }
            }
            else
            {
                // If were here then the method has allready been called from the executing Page.
                // We have allready created a message queue and stored a reference to it in our hastable. 
                Queue queue = (Queue)m_executingPages[HttpContext.Current.Handler];

                // Add our message to the Queue
                queue.Enqueue(sMessage);
            }

        }


        // Our page has finished rendering so lets output the JavaScript to produce the alert's
        private static void ExecutingPage_Unload(object sender, EventArgs e)
        {
            // Get our message queue from the hashtable
            Queue queue = (Queue)m_executingPages[HttpContext.Current.Handler];

            if (queue != null)
            {
                StringBuilder sb = new StringBuilder();

                // How many messages have been registered?
                int iMsgCount = queue.Count;

                // Use StringBuilder to build up our client slide JavaScript.
                sb.Append("<script language='javascript'>");

                // Loop round registered messages
                string sMsg;
                while (iMsgCount-- > 0)
                {
                    sMsg = (string)queue.Dequeue();
                    sMsg = sMsg.Replace("\n", "\\n");
                    sMsg = sMsg.Replace("\"", "'");
                    sb.Append(@"alert( """ + sMsg + @""" );");
                }

                // Close our JS
                sb.Append(@"</script>");

                // Were done, so remove our page reference from the hashtable
                m_executingPages.Remove(HttpContext.Current.Handler);

                // Write the JavaScript to the end of the response stream.
                HttpContext.Current.Response.Write(sb.ToString());
            }
        }
    }
}