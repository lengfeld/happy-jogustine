/*
    This file is part of Happy Jogustine.

    Happy Jogustine is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Happy Jogustine is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Happy Jogustine.  If not, see <http://www.gnu.org/licenses/>.

    Copyright (c) 2012,2013,2015 Christ Stefan <contact@stefanchrist.eu>

*/

// Import the page-mod API
var pageMod = require("sdk/page-mod");

// load my scripts
var self = require("sdk/self");

// Create a page mod
pageMod.PageMod({
	// Die Universität Paderborn verwendet das gleiche System wie die Uni-Mainz.
	// Aber dieses Plugin kann dort nicht so verwendet werden, weil die
	// linke Spalte mit den Menüs keine feste Breite hat.
	//include: "https://paul.uni-paderborn.de/scripts/mgrqispi.dll*",

	include: "https://jogustine.uni-mainz.de/scripts/mgrqispi.dll*",
	contentScriptWhen: 'end',
	contentScriptFile: [self.data.url("../node_modules/jquery/dist/jquery.min.js"),
				self.data.url("add-js-to-menu.js")]
});

// This is for easy and fast testing, see the README for instructions
//var tabs = require("sdk/tabs");
//tabs.open("https://jogustine.uni-mainz.de/scripts/mgrqispi.dll?APPNAME=CampusNet&PRGNAME=EXTERNALPAGES&ARGUMENTS=-N660991873730569,-N000330,-A1stud_home");
