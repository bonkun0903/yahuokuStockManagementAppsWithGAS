//プログラム0｜プログラム名を付ける
function createFolders() {  

  //プログラム1｜スプレッドシートの情報を取得する
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheetname = '【触らない！】フォルダ一括作成シート';
  var sheet = spreadsheet.getSheetByName(sheetname);
  
  //プログラム2｜フォルダパスの情報を取得する
  var folderurl = sheet.getRange('B1').getValue();

  //プログラム3｜フォルダパスの情報を取得する
  var myArray= folderurl.split('/'); 
  var folderid = myArray[myArray.length-1];
  
  //プログラム4｜作成したいフォルダ名を取得する
  var Lastrow = sheet.getLastRow(); 
  var myRange = sheet.getRange(4, 1, Lastrow-3).getValues();
  
  //プログラム5｜作成先のフォルダを取得する
  var folder = DriveApp.getFolderById(folderid);

  //プログラム6｜フォルダを作成する
  for (var i = 0; i < myRange.length; i++) {
    if (myRange[i][0] !== "") {
      folder.createFolder(myRange[i][0]);
    }
  } 
}