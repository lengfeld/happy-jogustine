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

    Copyright (c) 2012,2013 Christ Stefan <contact@stefanchrist.eu>

*/


/* NOTES and Documentation:
 * - die Ausgaben von console.log sind beim normalen Starten von Firefox nicht auf
 *   der Konsole sichtbar. Sie funktionieren nur bei '$ cfx run'
 *
 * - Alle Elemente, die wir verändern wollen liegen unter
 *   dem UL-Tag mit den Klassen: nav depth_2 linkItemContainer
 *
 * - Das Hovern soll nur auf Elementen aktiviert werden, die man bis jetzt noch nicht sieht.
 *   Die normalen statischen Ausklappungen im linken Menü sollen erhalten bleiben.
 *
 * */

var happy_jogustine_init = function() {

	// Helper Functions
	var in_array = function(list, obj) {
		for( var i = 0; i < list.length; i++) {
			if( list[i] === obj)
				return true;
		}
		return false;
	}


	// global variables
	var uls_to_show_hide = []; // these are all ul-tags, which this scripts controls
	// NOTE: ul_tree isn't a tree, it's the path in the menu-tree. So its logically only a list.
	var ul_tree = [];// contains ul-tags which are currently seen on the screen
	var ul_timer;

	// Functions

	// update_ul_tree return value:
	// boolean, that indicates whether parameter cur_ul was the "child-UL" of the
	// last element of ul_tree. If true, that indicates a fast open event
	var update_ul_tree = function( cur_ul ) {

		// if the cur_ul is in the ul_tree, don't change the ul_tree
		// if the mouse enters an li, it also enters the ul, so
		// both functions onhoverULin, onhoverLIin are called.
		// if the call to onhoverULin is after onhoverLIin, then only the ul,
		// but not the menu of the il is shown
		// -> avoid this, because the mouse is over the li
		//    -> the submenu of the li should be shown
		if( in_array(ul_tree, cur_ul ))
			// ul_tree wasn't changed at all
			return false;

		// FEATURE: show cur_ul at once, no delay
		// -> this is for faster menu-navigation, if the user hits the correct
		//    menu the first time he enters an li
		// if the last element in the ul_tree is just the parent of cur_ul
		// -> this means, that non of the silbings ul are currently shown
		if( ul_tree.length > 0 ) {
			if( ul_tree[ul_tree.length-1] === cur_ul.parentNode.parentNode) {
				ul_tree.push(cur_ul)
				return true;
			}
		} else {
			// ul_tree is empty, so currently nothing is shown
			// -> show the cur_ul immediately
			ul_tree.push(cur_ul);
			return true;
		}

		ul_tree = []; // clear tree

		// walk up the tree until we dont have a ul-element anymore
		// -> the top end of the menu is reached
		while(cur_ul.tagName == 'UL') {
			//console.log('cur_ul ' + cur_ul.id);
			ul_tree.push(cur_ul);
			cur_ul = cur_ul.parentNode.parentNode;
		}
		ul_tree.reverse();// bring in correct order, #pageTopNavi is the first element now
		return false;
	}

	var show_ul_tree = function(ul_tree) {
		//console.log("show_ul_tree called");

		// print tree
		/*
		var s = "";
		for( var i = 0; i<ul_tree.length; i++ )  {
			if( ul_tree[i].my_note != undefined) {
				s+= " (my_note) "
			}
			s += ul_tree[i].parentNode.id +"("+ul_tree[i].parentNode.firstChild.innerHTML+ ") <- ";
		}
		console.log( ul_tree.length + ":" +  s );
		*/



		// show the menu-tree, hide all others uls
		var ul;
		for( var i = 0; i < uls_to_show_hide.length; i++ ) {
			ul = uls_to_show_hide[i];
			//console.log("show_ul_tree each: " + ul.parentNode.id);
			if( in_array( ul_tree, ul) )
				ul.style.display = 'block';
			else
				ul.style.display = 'none';
		}

		ul_timer = undefined; // close timer, so my code don't call clearTimeout()
	}

	// ul_tree anzeigen, at once or with delay
	// the default action is to open with a delay, because some other
	// menu will be closed.
	var trigger_ul_timer = function(timeout) {
		if( ul_timer != undefined) {
			//console.log("clearTimeout " + ul_timer);
			window.clearTimeout(ul_timer);
			ul_timer = undefined;
		}
		if(timeout === 0) // do it at once
			show_ul_tree( ul_tree );
		else
			ul_timer = window.setTimeout(function () { show_ul_tree(ul_tree);}, timeout);

	}

	var onhoverLIin = function() {
		// object in 'this' is an li-element
		//console.log( 'hover in LI ' + this.id + "(" + this.firstChild.innerHTML + ")" );

		// NOTE: in the Jogustine-HTML each li has two children
		// the first is the a-tag with the name and link to the webpage
		// the second is the ul-tag with the submenu
		// -> this code relies on this property
		if( this.children[1].tagName != 'UL')
			return; // ERROR no ul-tag found in this li

		var cur_ul = this.children[1];

		var is_sub_menu = update_ul_tree(cur_ul)
		// FEATURE: wenn noch kein Menu auf dieser Ebene ausgeklappt ist
		// dann soll des Menu sofort ausgeklappt werden. Damit kann man sehr schnell
		// durch die Menus navigieren.
		if( is_sub_menu )
			trigger_ul_timer(0); // sofort ausklappen
		else
			trigger_ul_timer(200); // menu anzeigen, with delay, since a other menu will be closed
	}

	var onhoverULin = function() {
		//console.log( 'hover in UL ' + this.parentNode.id + "(" + this.parentNode.firstChild.innerHTML + ")" );
		// Dieses UL und sein ganzer Menü-Pfad soll angezeigt werden
		update_ul_tree( this );
		window.clearTimeout(ul_timer);
		show_ul_tree(ul_tree);
	}

	var onhoverULout = function() {
		//console.log( 'hover out UL ' + this.parentNode.id + "(" + this.parentNode.firstChild.innerHTML + ")" );

		// when the mouse pointer leaves, the ul should hide away im some secs
		// -> remove our menu from the ul_tree and schedule the menu_update event

		// this loop can potenially remove the complete ul_tree
		// this is ok, because the new menu is shown, as the user excepts
		// - walk from the last to the first element in ul_tree
		for( var i = ul_tree.length - 1; i >= 0; i--) {
			//console.log("for "+ ul_tree.length + " " + i + " " + (ul_tree[i] == this));
			if( ul_tree[i] == this) {
				// delete and go out
				ul_tree.length = i; // remove the last element
				break;
			} else
				ul_tree.length = i; // remove the last element
			// JAVASCRIPT BRAINFUCK!!!!!
			// code: delete ul_tree[i];
			// delete doesn't decrement the length of the array; the length
			// stays the same, only the element slot becomes undefined
		}

		// closing an ul should be slower, than opening
		// so the complete menu_path doens't disappear so fast
		trigger_ul_timer(1000); // menu anzeigen
	}

	// Start up Code
	// -> integrate functions into html
	// -> change some css attributes of the elements

	// Alle Elemente, die wir verändern wollen liegen unter
	// dem UL-Tag mit den Klassen: nav depth_2 linkItemContainer
	// Das sind den Menü's die logisch unter 'Home', 'Vorlesungen', 'Einrichtungen', etc
	// angezeigt werden.
	// Wenn ein einzelnes von ihnen sichtbar ist, befindet es sich auf der linken Seite
	// css: left: 0px;
	// Die aktuell nicht sichtbaren Menüs befinden sich sehr viel weiter links
	// css: left: -1000px;
	// Warum haben die Jogustine-Entwickler nicht "display: none;" verwendet?

	// $("ul.nav.depth_2.linkItemContainer")
	// Das sind 4 Menüs, die auf der linken Seite angezeigt werden können.
	// nämlich: 'Home','Vorlesungen','Einrichtungen','Fachwechsel'
	//var side_menus = $("ul.nav.depth_2.linkItemContainer");
	var side_menus = $("ul");

	// Aus den 4 seitlichen Menüs, das gerade aktive auswählen
	var side_menu = side_menus.filter( function(i)		{
				//console.log(this.offsetLeft);
				return  this.offsetLeft === 0 ;
			}).first() ;

	//console.log("side menu is "+ side_menu.css('left'));
	//console.log(side_menu);

	// Ab jetzt passen wir nur noch das gerade aktive Menü an

	// das menu außerhalb des ursprünglichen ul's sichtbar machen
	side_menu.css("overflow","visible");
	side_menu.find("ul").css("overflow","visible");

	// Alle LIs sammeln, die wir verändern wollen
	// diese LIs bekommen das nette Ausklapp-Feature
	var lis = side_menu.find("li").filter( function(i) {
			if( this.childNodes.length >=2 ) { // this selects li having an ul-tag as a children
				//console.log( 'li ' + this.childNodes[1].offsetHeight );
				// now we have to check, if the ul under this li is
				// already shown on the screen.
				// Since we only want to add eventhandlers to li's with
				// hidden uls.
				return this.childNodes[1].offsetHeight === 0;
			}
			return false; // this li has only an a-tag inside, no ul-tag

		 });

	lis.css("position","relative");
	lis.mouseenter( onhoverLIin ); // use 'mouseenter' instead of 'hover'

	// Die Menüs/uls unter den li's mit dem Ausklapp-Feature müssen
	// angepasst werden:
	// - Position des Menüs einstellen. Rechts vom ursprünglichen li

	//var uls = side_menu.find('ul').filter(function(i) { return this.offsetHeight === 0;});
	var uls = lis.find("ul");

	// top: -1px; because the li element has a border-top: 1px;
	// left 255px; since the li is 255px width and the ul should be shown on the
	// lis right side
	uls.css("position","absolute").css("top","-1px").css("left","255px");
	// this is the same width given indirectly in the jogustine css
	// we have to enforce it for all ul and sub ul-elements
	uls.css("width","255px");
	uls.hide();

	uls.hover( onhoverULin, onhoverULout);
	// otherwise menus aren't closed, if the mouse moves out of side_menu ul.
	side_menu.mouseleave( onhoverULout );

	// Bei den Menüs, die jetzt mit Javascript ausklappen können, macht es keine Sinn
	// den a-Tag, je nach Tiefe des Menübaums, einzurücken.
	// Es ist sogar nervig, wenn man erst noch mit der Maus, weiter in den Menueintrag
	// hineinfahren muss, bis man auf den Link klicken kann.

	uls.find("a").css("margin-left", "8px"); // jogustine default is 4px, 8px looks nicer

	// save all of the modified uls
	uls.each( function() { uls_to_show_hide.push( this); } ); // save a list of all our uls
	//uls.each( function() { this.my_note = 'happy';})


	// Add Footnote to page: the Happy Jogustine Brand
	$("#pageFootControlsLeft").append("<a class=\"img\" href=\"http://stefanchrist.eu/projects/happy_jogustine/\">Menu by Addon Happy Jogustine</a>");
};

// use onload instead of script tag with defer attribute in head, because opera wasn't working
if (window.addEventListener) {
	window.addEventListener("load", happy_jogustine_init, false);
} else if (window.attachEvent) {
	window.attachEvent("onload", happy_jogustine_init);
} else {
	window.onload = happy_jogustine_init;
}
