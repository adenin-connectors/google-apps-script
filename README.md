# Google Apps Script

To add script to your Google App go to 'Tools/Script' Editor,
this will open new tab in your browser where you can paste appscript.

After copy/pasting appscript you have to setup configuration.
It is on top of the script with fields such as '_type','url','secret'.
This is necessary for script to run properly.

After saving your script go to 'Edit/Current Project's Triggers',
in field 'Choose which function to run' select 'myOnEdit' function 
from dropdown menu, In 'Select event resource' dropdown select
'From Spreadsheet' and finaly, from 'Select event type' select
'On edit' from dropdown, click 'Save'.

After clicking save you will be asked to authorize script to run.