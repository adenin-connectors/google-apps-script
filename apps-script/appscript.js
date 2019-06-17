// custom properties of the script for user to edit
configuration = {
  "_type": "Task",
  "url": "https://ivan.eu.ngrok.io/api/adenin.GateKeeper.Connector/google-apps-script/item-handler",
  "secret": "12345678",
  columnMap: {
    "id": "A",
    "title": "B",
    "description": "C",
    "link": "D",
    "date": "E",
    "roles": "F",
    "assignedTo": "G",
    "DONE": "H"
  }
};

function myOnEdit(e) {
  var payload = null;
  if (configuration.columnMap) {
    // if there is columnMap provided we use it to map data
    payload = MapDataByColumnMap(e);
  } else if (e.range.rowStart != 1) {
    // if there is no columnMap provided we map data based on first row
    payload = MapDataByFirstRow(e);
  } else {
    return;
  }

  // if payload was not generated we do not send request
  if (payload == null) return;

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
//** maps data with keys provided in first row */
function MapDataByFirstRow(e) {
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
      if (currentValue == "" && key != "done") return null;

      // if it's date convert it to Json ISO date format
      if (key == "date") {
        var timestamp = Date.parse(cell.getValue());

        // if it is not valid date we return
        if (isNaN(timestamp)) return null;

        // if it is valid we convert it to json iso string
        payload[key] = new Date(currentValue.getValue()).toISOString();
      } else {
        payload[key] = currentValue;
      }
    }
  }
  return payload;
}
//** maps data with keys provided in configuration.columnMap */
function MapDataByColumnMap(e) {
  // get current sheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0];

  // Json object that we will send as body
  var payload = {};

  //set entity of the item to be title of the sheet
  payload._type = configuration._type.toLowerCase();

  // gets entity properties (title,description,date...)
  var properties = Object.keys(configuration.columnMap);

  // loops through properties to get value for each from corresponding cell
  for (var i = 0; i < properties.length; i++) {
    var property = properties[i].toLowerCase();
    // reads column name(A,B,C...) from column map, gets number of the row that was last edited
    // and reads cell value
    var cell = sheet.getRange(configuration.columnMap[properties[i]] + e.range.rowStart);

    // if cell value is empty we do not generate entity
    // if done is empty we ignore it, (done == (null || "")) => entity == open
    if (cell.getValue() == "" && property != "done") return null;

    // if it's date convert it to Json ISO date format
    if (property == "date") {
      var timestamp = Date.parse(cell.getValue());

      // if it is not valid date we return
      if (isNaN(timestamp)) return null;

      // if it is valid we convert it to json iso string
      payload[property] = new Date(timestamp).toISOString();
    } else {
      // assign values to the entity
      payload[property] = cell.getValue();
    }
  }

  return payload;
}