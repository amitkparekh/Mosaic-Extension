// Sidebar toggle
//
// -------------------
var sidebar = document.getElementById("sidebar");
var menuButton = document.getElementById("menu-button");

var sidebarToggle = function () {
    if (sidebar.className.match(/(?:^|\s)open(?!\S)/)) {
        sidebar.className = sidebar.className.replace(/(?:^|\s)open(?!\S)/g, '');
    } else {
        sidebar.className += " open";
    };

    if (menuButton.className.match(/(?:^|\s)active(?!\S)/)) {
        menuButton.className = menuButton.className.replace(/(?:^|\s)active(?!\S)/g, '')
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

var settingsOpen = function () {
    navMain.className = navMain.className.replace(/(?:^|\s)open(?!\S)/g, '');
    setTimeout(function () {
        navSettingsMenu.className += " open";
    }, animaDelay);
}

var newTileOpen = function () {
    navMain.className = navMain.className.replace(/(?:^|\s)open(?!\S)/g, '');
    setTimeout(function () {
        navNewTileMenu.className += " open";
    }, animaDelay);
}

var subMenuClose = function () {
    navNewTileMenu.className = navNewTileMenu.className.replace(/(?:^|\s)open(?!\S)/g, '');
    navSettingsMenu.className = navSettingsMenu.className.replace(/(?:^|\s)open(?!\S)/g, '');
    setTimeout(function () {
        navMain.className += " open";
    }, animaDelay);
}

navSettingsButton.addEventListener("click", settingsOpen);
navSettingsClose.addEventListener("click", subMenuClose);

navNewTileButton.addEventListener("click", newTileOpen);
navNewTileClose.addEventListener("click", subMenuClose);

// Form Elements
//
// -------------------

// Add new tile
$(document).ready(function () {

    // URL
    $("#new-tile-URL").focusin(function () {
        $(this).focusout(function () {
            
            /*if (  ) {
                // if false
                console.log("not url")
                $(".bar", this).addClass("error");
                $("label", this).addClass("error");
            } else {
                // if true
                console.log("url")
                $(".bar", this).removeClass("error");
                $("label", this).removeClass("error");
            }; */

        });
    });

    // Text
    $("#new-tile-name").focusin(function () {
        $(this).focusout(function () {
            if ($("input", this).val() == '') {
                // if false
                $(".bar", this).addClass("error");
                $("label", this).addClass("error");
            } else {
                // if true
                $(".bar", this).removeClass("error");
                $("label", this).removeClass("error");
            };
        });
    });

});