// custom properties of the script for user to edit
configuration = {
  "_type": "Task",
  "url": "https://ivan.eu.ngrok.io/api/adenin.GateKeeper.Connector/google-apps-script/item-handler",
  "secret": "12345678"
};

function myOnEdit(e) {
  // do not send data if properties are edited
  if (e.range.rowStart == 1) {
    return;
  }

  // get current sheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0];

  // Json object that we will send as body
  var payload = {};

  //set entity of the item to be title of the sheet
  payload._type = configuration._type.toLowerCase();

  // get row of edited cell, select 1 row, start from fist column, and get last column that has entry
  var range = sheet.getRange(e.range.rowStart, 1, 1, sheet.getLastColumn());

  // get first row so we can map data (we read keys for json from this row)
  var firstRow = sheet.getRange(1, 1, 1, sheet.getLastColumn());

  // iterate through each cell in range and check if it has data
  var numRows = range.getNumRows();
  var numCols = range.getNumColumns();
  for (var i = 1; i <= numRows; i++) {
    for (var j = 1; j <= numCols; j++) {
      var currentValue = range.getCell(i, j).getValue();

      // if there is no data in the cell we do not send any request except for 'done' column
      var key = firstRow.getCell(1, j).getValue().toLowerCase();
      if (currentValue == "" && key != "done") return;

      payload[key] = currentValue;
    }
  }

  // options for request
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload)
  };

  // add webhook secret to headers
  options.headers = {
    "secret": configuration.secret
  };

  // send post request to the url from configuration
  UrlFetchApp.fetch(configuration.url, options);
}