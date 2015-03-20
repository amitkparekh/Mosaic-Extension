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
        menuButton.className = menuButton.className.replace(/(?:^|\s)active(?!\S)/g, '');
        subMenuClose();
        setTimeout(function () {
            navMain.className = navMain.className.replace(/(?:^|\s)open(?!\S)/g, '');;
        }, animaDelay);
    } else {
        menuButton.className += " active";
        navMainOpen();
    }
};

menuButton.addEventListener("click", sidebarToggle);

// Open sub menus
//
// -------------------
var animaDelay = 510;

var navOverview = document.getElementById("sidebar");
var navMain = document.getElementById("nav-main");

var navSettingsButton = document.getElementById("nav-settings-button");
var navSettingsMenu = document.getElementById("nav-settings-menu");
var navSettingsClose = document.getElementById("nav-settings-close");

var navNewTileButton = document.getElementById("nav-new-tile-button");
var navNewTileMenu = document.getElementById("nav-new-tile-menu");
var navNewTileClose = document.getElementById("nav-new-tile-close");

var navDonateButton = document.getElementById("nav-donate-button");
var navDonateMenu = document.getElementById("nav-donate-menu");
var navDonateClose = document.getElementById("nav-donate-close");

var navBugButton = document.getElementById("nav-bug-button");
var navBugMenu = document.getElementById("nav-bug-menu");
var navBugClose = document.getElementById("nav-bug-close");

var extSidebarOpen = function () {
    navOverview.className += " ext";
}

var extSidebarOpen2 = function () {
    navOverview.className += " ext2";
}

var extSidebarClose = function () {
    navOverview.className = navOverview.className.replace(/(?:^|\s)ext(?!\S)/g, '');
    navOverview.className = navOverview.className.replace(/(?:^|\s)ext2(?!\S)/g, '');
}

var navMainOpen = function () {
    navMain.className += " open";
}

var navMainClose = function() {
    navMain.className = navMain.className.replace(/(?:^|\s)open(?!\S)/g, '');
}

var settingsOpen = function () {
    navMainClose();
    setTimeout(function () {
        navSettingsMenu.className += " open";
        //        navSettingsMenu.className += " ext";
        //        extSidebarOpen();
    }, animaDelay);
}

var newTileOpen = function () {
    navMainClose();
    setTimeout(function () {
        navNewTileMenu.className += " open";
        navNewTileMenu.className += " ext";
        extSidebarOpen();
    }, animaDelay);
}

var bugOpen = function() {
    navMainClose();
    setTimeout(function() {
        navBugMenu.className += " open";
        navBugMenu.className += " ext2";
        extSidebarOpen2();
    }, animaDelay);
}

var donateOpen = function() {
    navMainClose();
    setTimeout(function() {
        navDonateMenu.className += " open";
        navDonateMenu.className += " ext2";
        extSidebarOpen2();
    }, animaDelay);
}

var subMenuClose = function () {
    navNewTileMenu.className = navNewTileMenu.className.replace(/(?:^|\s)open(?!\S)/g, '');
    navNewTileMenu.className = navNewTileMenu.className.replace(/(?:^|\s)ext(?!\S)/g, '');
    navSettingsMenu.className = navSettingsMenu.className.replace(/(?:^|\s)open(?!\S)/g, '');
    navSettingsMenu.className = navSettingsMenu.className.replace(/(?:^|\s)ext(?!\S)/g, '');    navDonateMenu.className = navDonateMenu.className.replace(/(?:^|\s)open(?!\S)/g, '');
    navDonateMenu.className = navDonateMenu.className.replace(/(?:^|\s)ext2(?!\S)/g, '');
    navBugMenu.className = navBugMenu.className.replace(/(?:^|\s)open(?!\S)/g, '');
    navBugMenu.className = navBugMenu.className.replace(/(?:^|\s)ext2(?!\S)/g, '');
    extSidebarClose();
    setTimeout(function () {
        navMainOpen();
    }, animaDelay);
}

navSettingsButton.addEventListener("click", settingsOpen);
navSettingsClose.addEventListener("click", subMenuClose);

navNewTileButton.addEventListener("click", newTileOpen);
navNewTileClose.addEventListener("click", subMenuClose);

navDonateButton.addEventListener("click", donateOpen);
navDonateClose.addEventListener("click", subMenuClose);

navBugButton.addEventListener("click", bugOpen);
navBugClose.addEventListener("click", subMenuClose);

// Form Elements
//
// -------------------

// Add new tile
$(document).ready(function () {

    // URL
    $("#new-tile-URL").focusin(function () {
        $(this).focusout(function () {

            var url = $("input", this).val();

            if (/^(http:\/\/www\.|https:\/\/www\.)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(url)) {
                $(".bar", this).removeClass("error");
                $("label", this).removeClass("error");
            } else {
                $(".bar", this).addClass("error");
                $("label", this).addClass("error").addClass("valid");
            }

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
                $("label", this).removeClass("error").addClass("valid");
            };
        });
    });

    // RSS
    $("#new-tile-RSS").focusin(function () {

        $(this).focusout(function () {

            if ($("input", this).val() == '') {
                // if false
                $("label", this).removeClass("valid");
            } else {
                // if true
                $(".bar", this).removeClass("error");
                $("label", this).removeClass("error").addClass("valid");
            };
        });
    });

    // Customise tile color


});