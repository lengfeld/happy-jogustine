
// Import the page-mod API
var pageMod = require("page-mod");
 
// load my scripts
var self = require("self");



// Create a page mod
pageMod.PageMod({
	//include: "https://paul.uni-paderborn.de/scripts/mgrqispi.dll*",
	include: "https://jogustine.uni-mainz.de/scripts/mgrqispi.dll*",
	contentScriptWhen: 'end',
	contentScriptFile:  [ self.data.url("jquery.js"), self.data.url("add-js-to-menu.js") ]

});

// and now test my plugin

//debug
//var tabs = require("tabs");
//tabs.open("https://jogustine.uni-mainz.de/scripts/mgrqispi.dll?APPNAME=CampusNet&PRGNAME=STUDENT_RESULT&ARGUMENTS=-N647543084671984,-N000349,-N0,-N000000000000000,-N000000000000000,-N000000000000000,-N0,-N000000000000000");

