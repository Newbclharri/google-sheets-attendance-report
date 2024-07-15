/**
 * Code pulls data for total students present from each afterschool campus spreadsheet document.
 * URL and date to pull date (var dayToReport) are passed to the function pasteDailyTotals
 */
function runDailyTotals(){

  /**
   *Passes params url and date to the function pasteDailyTotals() from campus registration spreadsheet doc to retrieve attendance data  (total students present on a particular date) 
   */


  var MILLI_SECS_PER_DAY = 24*60*60*1000
  var MONDAY = 1;

  var todaysDate = new Date();  
  var today = todaysDate;
  var yesterday;
  var timezone = "CST";  

  if(today.getDay() == MONDAY){ //accounts for the weekend: If today is Monday yesterday will be the Friday before.
    yesterday = Utilities.formatDate(new Date(today.valueOf() - (3 * MILLI_SECS_PER_DAY)),timezone, "MM/dd/yyyy");
    //Logger.log(yesterday);
  }else{
    yesterday = Utilities.formatDate(new Date(today.valueOf() - (MILLI_SECS_PER_DAY)),timezone, "MM/dd/yyyy");
    //Logger.log(yesterday)
  }

  today = Utilities.formatDate(todaysDate, timezone, "MM/dd/yyyy");

  var dayToReport = today; //select between  variables "yesterday" and "today" depending on when the report should be triggered

  Logger.log(today);


  //SCHOOL 1
  pasteDailyTotals("https://docs.google.com/spreadsheets/d/1LYtUUc-IsSs9bNnHZMFN6BcwbMDHxyq20SVwJ3euoWc/edit#gid=685223797",dayToReport);

  

}

function pasteDailyTotals(sourceUrl,date) {
  /**
   * @Param 
   * sourceUrl = String
   * date = Date
   * pulls total students present data from all afterschool campus spreadsheet documents above by url
   * each document has an attendance sheet titled by date.
   * This title is used to pull data from attendance sheet with the targeted date
   */

  //Source info
  var sourceS = SpreadsheetApp.openByUrl(sourceUrl);
  var attendanceWasFound = false;

  //find attendance sheet with today's date as sheet name
  var sheets = sourceS.getSheets();
  var attendanceDate = date; //Utilities.formatDate(new Date(date),sourceS.getSpreadsheetTimeZone(),"MM/dd/yyyy");
  //Logger.log(attendanceDate);

  for(var i = 0; i <= sheets.length - 1; i++){
    var sheetDate = sheets[i].getName();    

    if(sheetDate == attendanceDate){
      var mostCurrentSheet = sheetDate;
      attendanceWasFound = true;
      //Logger.log(mostCurrentSheet);
      //break;
    }
  }

  if(attendanceWasFound){
    
    //get attendance data from most current attendance sheet
    var sourceSheet = sourceS.getSheetByName(mostCurrentSheet);
    var sourceData = sourceSheet.getRange("M2:M2").getValues();
    
    //Find Afterschool site row to add attendance data in the appropiately dated column
    var targetSite = sourceS.getSheetByName("Registration").getRange("F4:F4").getValues();
    
    //Start target info
    var targetS = SpreadsheetApp.getActive();
    var targetSheet = targetS.getSheetByName("Attendance Report");
    var targetLastRow = targetSheet.getLastRow();
    var allSites = targetSheet.getRange("A:A").getValues();

    for(var i = 0; i <= targetLastRow - 1; i++){
      if(allSites[i][0] == targetSite){
        var siteRow = i+1;
        //break;
      }      
    }   
  

  //find column with today's or yesterday's date

  var targetLastCol = targetSheet.getLastColumn();
  var dateRowValues = targetSheet.getRange(2,1,1,targetLastCol).getValues();

  for (var j = 0; j <= targetLastCol - 1; j++){
    var dateHeader = Utilities.formatDate(new Date(dateRowValues[0][j]),targetS.getSpreadsheetTimeZone(),"MM/dd/yyyy");
    if(mostCurrentSheet == dateHeader){
      var dateCol = j + 1;
      //Logger.log(dateCol);
    }
  }
  var targetRange = targetSheet.getRange(siteRow,dateCol,1,1).setValues(sourceData);

  }
}