function printLayout() {
  // アクティブなシートを取得
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  // 在庫一覧のシートを取得
  var inventryListSheet = spreadsheet.getSheetByName('ヤフオク出品在庫');
  // 商品データが存在する範囲を自動で取得
  var productRange = inventryListSheet.getRange("B2:H");
  // 仮の商品データを取得
  var productTempData = productRange.getValues();
  // 印刷データのから配列を定義
  var productData = [];
  // ダイヤログに渡す空配列を用意する。
  var rePrintedData = [];
  var invalidData = [];
  // チェックボックスTrueチェッカー：商品データ一覧のチェックボックスに１件でもチェックが入っていれば特定商品印刷、それ以外なら全件サーチ
  if (productTempData.some(function (array) {
      return (array[0] === true)
    })) {
    // 特定商品印刷：選択した商品＆条件を必須データが存在するもののみ印刷レイアウトに反映
    Logger.log('特定');
    productTempData.forEach(function (f, i) {
      // 選択されていないデータの場合はコンテニューする。
      if (f[0] !== true) {
        return;
      }
      dataAnyPushAndStatusChange(f, i, inventryListSheet, productData, invalidData, rePrintedData);
    });
  } else {
    // TODO 全件サーチ印刷:在庫全件中、必須データが存在＆印刷ステータスがNotYetのもののみ印刷レイアウトに反映
    Logger.log('全件サーチ');
    productTempData.forEach(function (f, i) {
      // 印刷済みのデータはコンティニューする
      if (f[6] !== 'NotYet') {
        return;
      }
      dataAnyPushAndStatusChange(f, i, inventryListSheet, productData, invalidData);
    });
  }
  // 印刷データを反映するシートを取得
  var printLayoutSheet = spreadsheet.getSheetByName('【編集不要】反映後レイアウト');
  //3. テンプレートレイアウトを取得
  var tmpRange = spreadsheet.getSheetByName('【編集不要】在庫シール原本').getRange("A1:B11");
  // 指定回数分繰り返す
  productData.forEach(function (f, i) {
    //4. コピー先の範囲を取得
    var pasteRange = printLayoutSheet.getRange(i * 11 + 1, 1, 11, 2);
    // テンプレートデータをコピーする
    tmpRange.copyTo(pasteRange);
    // コピー先のデータを編集する
    pasteRange.setValues(f);
  });
  // 不要なレイアウトはクリアする
  printLayoutSheet.getRange(productData.length * 11 + 1, 1, 10000, 2).clear();
  // ダイヤログメッセージがあれば通知する
  if (rePrintedData.length) {
    rePrintedAlert(rePrintedData);
  }
  if (invalidData.length) {
    invalidAlert(invalidData);
  }
}
// レイアウト反映成功商品の『レイアウト反映ステータス』をNot yet → Doneにする。
function changePrintStatus(inventryListSheet, i) {
  inventryListSheet.getRange('H' + (i + 2).toString()).setValue('Done');
}
// チェックボックス制御関数
// データの有効性は判断せずにデータの存在するもののみチェック状態にする
function AllCheck(button) {
  let spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName('ヤフオク出品在庫');
  sheet.activate();
  // ボタンによって処理を分ける
  if (button == 1) {
    // 商品データが存在する範囲を自動で取得
    var productRange = sheet.getRange("B2:H");
    // 仮の商品データを取得
    var productTempData = productRange.getValues();
    productTempData.forEach(function (f, i) {
      // 『商品名』か『棚番号』が入力されていれば、チェックボックスをチェックする
      if (f[2] !==　'' || f[3] !== '') {
        sheet.getRange('B' + (i + 2).toString()).check();
      }
    });
  } else {
    var range = sheet.getRange('B2:B');
    range.uncheck();
  }
}
// 全選択ボタン関数　←　不要なのでコメントアウト
// function checkButton() {
//   AllCheck(1);
// }
// 全選択解除ボタン関数
function unCheckButton() {
  AllCheck(0);
}
// 再印刷アラート関数
function rePrintedAlert(data) {
  var rePrintedData = data.join("\\n");
  var response = Browser.msgBox("以下のデータは再印刷になります。ご注意ください。", rePrintedData, Browser.Buttons.CLOSE);
}
// データ不備アラート関数
function invalidAlert(data) {
  var invalidData = data.join("\\n");
  var response = Browser.msgBox("以下のデータは不備があるため印刷ができません。データをご確認ください。", invalidData, Browser.Buttons.CLOSE);
}
// 印刷反映データと不正データ、再印刷データそれぞれにpush、印刷ステータスを変更する部分の共通化関数
function dataAnyPushAndStatusChange(f, i, sheet, productData, invalidData, rePrintedData = []) {
  if (f[2] !== '' && f[3] !== '') {
    // 特定から利用され、rePrintedDataが存在する場合はpush
    if (rePrintedData) {
      // 再印刷になるものはrePrintdata配列にpushしておく。
      if (f[6] == 'Done') {
        rePrintedData.push(f[1])
      };
    }
    // レイアウトに反映する商品データは『印刷ステータス』をDoneにする。 
    changePrintStatus(sheet, i);
    productData.push(
      [
        ["ヤフオク在庫", ""],
        ["管理番号", f[1]],
        ["商品名", f[2]],
        ["棚番号", f[3]],
        ["認定型式", f[4]],
        ["入庫番号", f[5]],
        ["", ""],
        ["管理番号", f[1]],
        ["商品名", f[2]],
        ["認定型式", f[4]],
        ["入庫番号", f[5]]
      ])
  } else {
    // データが完全に空かどうか判定する
    if (f[2] == '' && f[3] == '' && f[4] == '' && f[5] == '') {
      return;
    } else {
      invalidData.push(f[1]);
    }
  }
}