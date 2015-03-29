/// <reference path="util.js" />

// Sidebar toggle
//
// -------------------
var sidebar = document.getElementById("sidebar");
var menuButton = document.getElementById("menu-button");

var sidebarToggle = function() {
    if ( sidebar.className.match(/(?:^|\s)open(?!\S)/) ) {
        sidebar.className = sidebar.className.replace( /(?:^|\s)open(?!\S)/g , '' );
    } else {
        sidebar.className += " open";
    };

    if ( menuButton.className.match(/(?:^|\s)active(?!\S)/) ) {
        menuButton.className = menuButton.className.replace( /(?:^|\s)active(?!\S)/g , '' )
    } else {
        menuButton.className += " active";
    }      
};

menuButton.addEventListener("click", sidebarToggle);

// Open sub menus
//
// -------------------
var animaDelay = 300;

var navMain = document.getElementById("nav-main");

var navSettingsButton = document.getElementById("nav-settings-button");
var navSettingsMenu = document.getElementById("nav-settings-menu");
var navSettingsClose = document.getElementById("nav-settings-close");

var navNewTileButton = document.getElementById("nav-new-tile-button");
var navNewTileMenu = document.getElementById("nav-new-tile-menu");
var navNewTileClose = document.getElementById("nav-new-tile-close");

var settingsOpen = function() {
    navMain.className = navMain.className.replace( /(?:^|\s)open(?!\S)/g , '' );
    setTimeout(function() {
        navSettingsMenu.className += " open";
    }, animaDelay);
}

var newTileOpen = function() {
    navMain.className = navMain.className.replace( /(?:^|\s)open(?!\S)/g , '' );
    setTimeout(function() {
        navNewTileMenu.className += " open";
    }, animaDelay);
}

var subMenuClose = function() {
    navNewTileMenu.className = navNewTileMenu.className.replace( /(?:^|\s)open(?!\S)/g , '' );
    navSettingsMenu.className = navSettingsMenu.className.replace( /(?:^|\s)open(?!\S)/g , '' );
    setTimeout(function() {
            navMain.className += " open";
        }, animaDelay);
}

navSettingsButton.addEventListener("click", settingsOpen);
navSettingsClose.addEventListener("click", subMenuClose);

navNewTileButton.addEventListener("click", newTileOpen);
navNewTileClose.addEventListener("click", subMenuClose);



// Import tiles and configurations
//
// -------------------
q("#nav-settings-import-button").addEventListener("click", function (event) {

    var input = q("#nav-settings-import-file");

    var file = input.files[0];

    if (file) {

        var reader = new FileReader();

        reader.onload = (function (file) {

            return function (e) {

                var data = JSON.parse(e.target.result);

                if (data.tiles)
                    data.tiles = JSON.parse(data.tiles);

                if (data.background)
                    data.background = JSON.parse(data.background);

                if (data.temaPadrao)
                    data.temaPadrao = JSON.parse(data.temaPadrao);

                MNTP.IDB.importData(data);

            };

        })(file);

        reader.readAsText(file);
    }


});