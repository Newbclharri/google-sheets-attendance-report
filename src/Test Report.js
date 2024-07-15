function myFunction(){
  //ALEX W. SPENCE MS
  testPasteDailyTotalsII("https://docs.google.com/spreadsheets/d/1H5B2TDj3TK7Oo_j2eh-7PF6zLPyV52WXVh-pDUUe4f8/edit#gid=340377798"); 
}
  
function testPasteDailyTotalsII(sourceUrl) {
  /**
   * paste daily totals for all attendance sheets at an afterschool site, not just for the current or previous day
   */

  //Source Information
  var sourceS = SpreadsheetApp.openByUrl(sourceUrl);
  var sourceSheets = sourceS.getSheets();
  var numSourceSheets = sourceS.getNumSheets();  
  //name of site to search for in report column
  var siteName = sourceS.getSheetByName("Registration").getRange("F4:F4").getValues();

 
  //target is the report spreadsheet with tab labeled Attendance Totals
  var targetS = SpreadsheetApp.getActive();
  var targetSheet = targetS.getSheetByName("Present");
  var targetSheetLastRow = targetSheet.getLastRow();
  var targetSheetLastCol = targetSheet.getLastColumn();
  var targetSiteNameValues = targetSheet.getRange("C:C").getValues();
  var headerDateValues = targetSheet.getRange(2,1,1,targetSheetLastCol).getValues();


  //find targeted after-school site row using var siteName
  for(var i = 0; i <= targetSheetLastRow - 1; i++){
    if(siteName[0][0] == targetSiteNameValues[i][0]){
      var targetRow = i+1;
      break;
    }
  }

  //destination range and values
  //var targetRange = targetSheet.getRange(targetRow,6,1,targetSheetLastCol);
  //var targetData = targetRange.getValues();


  for(i = 0; i <= numSourceSheets - 1; i++){
    var sourceTabDate = sourceSheets[i].getName();

    for(j = 0; j <= targetSheetLastCol-1; j++){
      var targetHeaderDate = Utilities.formatDate(new Date(headerDateValues[0][j]),targetS.getSpreadsheetTimeZone,"MM/dd/yyyy");
     
      if(sourceTabDate == targetHeaderDate){
        var attendanceSheet = sourceS.getSheetByName(sourceTabDate);
        var sourceData = attendanceSheet.getRange("K2:K2").getValues();
        //targetData[0][j] = sourceData;
        var targetRange = targetSheet.getRange(targetRow,j+1,1,1);
        targetRange.clearContent();
        targetRange.setValues(sourceData);                
      }       
    }     
  }  
}


