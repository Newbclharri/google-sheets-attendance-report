function runDailyTotalsII(){

  //SCHOOL 1
  pasteDailyTotalsII("https://docs.google.com/spreadsheets/d/1LYtUUc-IsSs9bNnHZMFN6BcwbMDHxyq20SVwJ3euoWc/edit#gid=685223797");
}

function pasteDailyTotalsII(sourceUrl) {
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
  var targetSheet = targetS.getSheetByName("Attendance Report");
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
      var targetHeaderDate = Utilities.formatDate(new Date(headerDateValues[0][j]),"CST","MM/dd/yyyy");
     
      if(sourceTabDate == targetHeaderDate){
        var attendanceSheet = sourceS.getSheetByName(sourceTabDate);
        var sourceData = attendanceSheet.getRange("M2:M2").getValues();
        //targetData[0][j] = sourceData;
        var targetRange = targetSheet.getRange(targetRow,j+1,1,1);
        targetRange.clearContent();
        targetRange.setValues(sourceData);                
      }       
    }     
  }  
}

