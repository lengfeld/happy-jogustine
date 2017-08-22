
Happy Jogustine
===============

Firefox Addon to enhance the menus on Jogustine Portal
https://jogustine.uni-mainz.de with nice drop down menus.

*NOTE 2017-08-22*: This addon as reached *end of life* (EOL). With the upcoming
Firefox Release 57 only addons based on new API  *WebExtensions* are supported.
See [Firefox add-on technology is modernizing][webex].  Old Addons using XUL or
the [addon-sdk][addon-sdk], which is used by this project, are deprecated.
Since the usage count of this addon has dropped (only a few computers are
polling the update manifest) and I'm not using the addon myself anymore, I have
decided not to port the addon the new *WebExtensions* API. Nevertheless it
would be a fairly easy task to do it, but I don't have the free time anymore.

[webex]: https://support.mozilla.org/en-US/kb/firefox-add-technology-modernizing?as=u&utm_source=inproduct
[addon-sdk]: https://developer.mozilla.org/en-US/Add-ons/SDK


Coding
------

You need the new *jpm* tool from Mozilla that can be used since *Firefox 38*
for addon development. For installation instructions see

    https://developer.mozilla.org/en-US/Add-ons/SDK/Tools/jpm#Installation

I installed it locally (after installing *nodejs*) via

    $ mkdir ~/npm/
    $ cd ~/npm/
    $ npm install jpm
    $ ln -s ../npm/node_modules/jpm/bin/jpm  ~/bin/jpm

Previously the addon *happy-jogustine* was develop with the *cfx* tool.


Testing
-------

To run the plugin code in a browser execute

    $ jpm run    # or
    $ jpm run -b ~/bin/firefox/firefox   # for nightly or developer instance

in the root directory of the git repository.

Zum Testen kann es sinnvoll sein, ein Profil mit installiertem
Firebug zu starten

    # TODO
    $ cfx --profiledir /home/<user>/.mozilla/firefox/<your profile>/ run

Bei jedem Start von Firefox, muss man die Jogustine Seite aufrufen und sich bei
Jogustine neue anmelden. Bei Testen ist das schnell recht langsam und
nervtötend. Deswegen verwendet man die Eigenschaft von Jogustine, dass dort
keine Cookies für die Sessions, sondern eine ID in jeder URL verwendet wird.
Die Prozedur ist die folgende:

1. Man meldet sich in einem normalen Firefox bei Jogustine an.
   Kopiert dann die URL der Seite und schreibt sie in die Datei lib/main.js
   in den Aufruf, der einen neuen Tab mit dieser URL öffnet. Es kann jede
   Unterseite von Jogustine verwendet werden.
2. Bei jeden Test mit "$ cfx test" wird jetzt nicht nur das Addon geladen,
   sondern auch gleich ein Tab im Firefox mit der Jogustine-Seite geöffnet.
   Wenn zwischen zwei Tests nicht mehr als ungefähr 20 Minuten vergehen,
   dann wird man aus die Jogustine-Session nicht automatisch ausgelogt.
3. Falls die Session doch abläuft, muss man sich neu anmelden und die neue URL
   nach lib/main.js kopieren.


Building
--------

To create the xpi file execute

    $ jpm xpi

Since Mozilla has increased the security level, unsigned addons cannot be
installed in normal Firefox builds anymore. You need a nightly or developer
build for testing. Download it from:

    https://nightly.mozilla.org/


Use and Copyright
-----------------

Der Quellcode für das Addon (data/add-js-to-menu.js, lib/main.js) steht unter
GLPv3. Zu finden ist sie in der Datei COPYING oder online unter
https://www.gnu.org/licenses/gpl-3.0.txt

Der jquery-Code (data/jquery.js) steht unter der MIT Lizenz.
https://jquery.org/license/


Releasing
---------

Kurze Notizen (für mich), wie man das XPI erstellt und das Addon sauber
veröffentlicht.

1. Versionsnummer in package.json erhöhen und ChangeLog aktualisieren.  Noch
   nicht committen.

2. Das XPI erzeugen

        $ jpm xpi

3. Das XPI mit der richtigen Versionsnummer umbenennen und in das
   Verzeichnis xpi/ verschieben

        $ mv happy-jogustine.xpi xpi/happy-jogustine-1.X.Y-unsigned.xpi

4. Bei AMO (https://addons.mozilla.org/) einloggen und die neue Version
   des XPIs hochladen. Auf 'Upload A New Version' klicken. 'Full Test Report'
   ansehen.  Danach Datei 'happy_jogustine-1.X.Y-fx.xpi' herunterladen ('Save
   Link As...') und im Ordner 'xpi/' speichern. Die Datei enthält nur eine
   Signature.  Die Datei umbenennen. Sie enthält noch einen Unterstrich.

5. Die Datei xpi/update1.unsigned.rdf editieren und dort die neue Version
   eintragen. Dazu einfach einen alten Eintrag kopieren. minVersion und
   maxVersion findet man im install.rdf im XPI. Die sha512 Checksum generiert
   man mit

        $ sha512sum xpi/happy-jogustine-1.X.Y-fx.xpi

6. Das update1.unsigend.rdf zu update1.rdf kopieren, weil McCoy das update1.rdf
   gleich überschreibt. McCoy starten, Passwort eingeben und die Datei
   xpi/update1.rdf signieren.

        $ cp xpi/update1.unsigned.rdf xpi/update1.rdf
        $ ~/bin/mccoy/mccoy  # mccoy starten und signieren

7. Commiten, taggen und pushen

        $ git add package.json ChangeLog
        $ git add xpi/*
        $ git commit -s -m "release of version 1.X.Y"
        $ git tag -a -m "v1.X.Y" v1.X.Y
        $ git push --follow-tags --dry-run
        $ git push --follow-tags

8. Dateien aus xpi/ auf den webserver laden

9. Update Mechanisums in Firefox testen.
