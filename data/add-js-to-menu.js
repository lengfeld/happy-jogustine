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

    Copyright (c) 2012 Christ Stefan <anti@stcim.de>

*/


console.log("my modules started" );

// NOTES:
// Das Hovern soll nur auf element aktiviert werden, die man bis jetzt noch nicht sieht.
// Die normalen Ausklappungen im linken Menü sollen erhalten bleiben.

// Alle Elemente, die wir verändern wollen liegen unter
// dem UL-Tag mit den Klassen: nav depth_2 linkItemContainer
//




var onhoverIn= function() {
	// object in 'this' is an li-element
	console.log( 'hover in ' + this.id +  " "+  this.firstChild.innerHTML );

	$( '#' + this.id +' > ul').show();
}

var onhoverOut = function() {
	console.log( 'hover out ' + this.id +  " "+  this.firstChild.innerHTML );

	$( '#' + this.id+' > ul').hide()
}


// Das sind den Menü's die logisch unter 'Home', 'Vorlesungen', 'Einrichtungen', etc
// angezeigt werden. 
// Wenn ein einzelnes von ihnen sichtbar ist, befindet es sich auf der linken Seite
// css: left: 0px;
// Die aktuell nicht sichtbaren Menüs befinden sich sehr viel weiter links
// css: leftp -1000px;
// Warum haben die Jogustine-Entwickler nicht "display: none;" verwendet?
// Das sind 4 Menüs, die auf der linken Seite angezeigt werden können.
// nämlich: 'Home','Vorlesungen','Einrichtungen','Fachwechsel'
var side_menus = $("ul.nav.depth_2.linkItemContainer");
console.log("menu length " + side_menus.length);

// Aus den 4 seitlichen Menüs, das gerade aktive auswählen
var side_menu = side_menus.filter( function(i)		{ 
			console.log(this.offsetLeft);
			return  this.offsetLeft === 0 ;
		}).first() ;

console.log("side menu is "+ side_menu.css('left'));
console.log(side_menu);

// Ab jetzt passen wir nur noch das gerade aktive Menü an

// das menu außerhalb des ursprünglichen ul's sichtbar machen
side_menu.css("overflow","visible");

// diese li's bekommen das nette Ausklapp-Feature
var lis = side_menu.find("li").filter( function(i) {
		if( this.childNodes.length >=2 ) {
			console.log( 'li ' + this.childNodes[1].offsetHeight );
			return this.childNodes[1].offsetHeight === 0;	
		} else {
			return false;
		}
	 }); 
console.log('lis ' + lis.length );
lis.css("position","relative");
lis.hover( onhoverIn, onhoverOut);

// Die Menüs/uls unter den li's mit dem Ausklapp-Feature müssen 
// angepasst werden:
// - Position des Menüs einstellen. Rechts vom ursprünglichen li

//var uls = side_menu.find('ul').filter(function(i) { return this.offsetHeight === 0;});
var uls = lis.find("ul");
uls.each( function(i) { console.log("ul text " + this.parentNode.id ); } );
console.log("uls " + uls.length);

// top: -1px; because the li element has a border-top: 1px; 
uls.css("position","absolute").css("top","-1px").css("left","255px");
// this is the same width given indirectly in the jogustine css
// we have to enforce it for all ul and sub ul-elements
uls.css("width","255px");
uls.hide();


side_menu.find("ul").css("overflow","visible");

// Bei den Menüs, die jetzt mit Javascript ausklappen können, macht es keine Sinn
// den a-Tag, je nach Tiefe des Menubaums, einzurücken.
// Es ist sogar nervig, wenn man erst noch mit der Maus, weiter in den Menueintrag 
// hineinfahren muss, bis man auf den Link klicken kann.

uls.find("a").css("margin-left", "8px"); // jogustine default is 4px, 8px looks nicer



// Add Footnote to page
$("#pageFootControlsLeft").append("<a class=\"img\" href=\"http://stefanchrist.eu/projects/happy_jogustine/\">Menu by Addon Happy Jogustine</a>");

