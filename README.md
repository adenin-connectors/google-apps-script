# Google Apps Script

To add script to your Google App go to 'Tools/Script' Editor,
this will open new tab in your browser from this repo in folder 'apps-script' you can copy
file appscript.js to the Google Script Editor and save.

After copy/pasting script you have to setup configuration.
It is on top of the script with fields such as '_type','url','secret', 'columnMap'.
This is necessary for script to run properly.

'_type' - field is type of the entity that script will generate,
 for e.g. 'task', 'event', 'issue', 'lead', 'document'...

 'url' - is link to the 'item-handler' activity to wich appscript 
 will make HTTP POST with your entity.

 'secret' - your custom value which must be the same in configuration file
 and your connector setup. It is used to verify that request is sent from right script.

 'columnMap' - optional field, here you can configure which column is representing
 which field in the entity, if not provided script will map first row as field names
 and second row will be your first entity.

After saving your script go to 'Edit/Current Project's Triggers',
in field 'Choose which function to run' select 'myOnEdit' function 
from dropdown menu, In 'Select event resource' dropdown select
'From Spreadsheet' and finaly, from 'Select event type' select
'On edit' from dropdown, click 'Save'.

After clicking save you will be asked to authorize script to run.