function mySample37_1() {

  // フォルダ名を指定して取得する
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('フォルダ名取得シート');

  //変数folderに指定したフォルダーを格納する
  //★★★ フォルダーIDを記入 ★★★

  var key = '1i6wrttutHf2p8jTGNn2QQhPD8SkehLvM' //ヤフオク画像rootフォルダ
  var name = ""
  var i = 0 //フォルダを処理する行位置
  var j = 0 //サブフォルダを出力する行位置
  sheet.clear() //シートをクリア
  do {
    //フォルダ一覧を取得
    var folders = DriveApp.searchFolders("'"+key+"' in parents");
    //フォルダ一覧からフォルダを順に取り出す
    while(folders.hasNext()){
      //シートにフォルダ名称とIdを出力
      i++
      var folder = folders.next();
      sheet.getRange(i, 1).setValue(name + folder.getName());
      sheet.getRange(i, 2).setValue(folder.getId());
    }
    //シートからフォルダを取得し次へ
    j++;
    name = sheet.getRange(j, 1).getValue() + " > ";
    key = sheet.getRange(j, 2).getValue();
  } while (key != ""); //処理するフォルダがなくなるまで
}