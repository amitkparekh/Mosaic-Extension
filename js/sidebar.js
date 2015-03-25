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

var navNewTileButton = document.getElementById("nav-new-tile-button");
var navNewTileMenu = document.getElementById("nav-new-tile-menu");
var navNewTileClose = document.getElementById("nav-new-tile-close");

var navSettingsButton = document.getElementById("nav-settings-button");
var navSettingsMenu = document.getElementById("nav-settings-menu");
var navSettingsClose = document.getElementById("nav-settings-close");

var navSettingsTilesButton = document.getElementById("nav-settings-tiles-button");
var navSettingsTilesMenu = document.getElementById("nav-settings-tiles-menu");
var navSettingsTilesClose = document.getElementById("nav-settings-tiles-close");

var navSettingsBackupRestoreButton = document.getElementById("nav-settings-backup-restore-button");
var navSettingsBackupRestoreMenu = document.getElementById("nav-settings-backup-restore-menu");
var navSettingsBackupRestoreClose = document.getElementById("nav-settings-backup-restore-close");

var navBugButton = document.getElementById("nav-bug-button");
var navBugMenu = document.getElementById("nav-bug-menu");
var navBugClose = document.getElementById("nav-bug-close");

var navChangelogButton = document.getElementById("nav-changelog-button");
var navChangelogMenu = document.getElementById("nav-changelog-menu");
var navChangelogClose = document.getElementById("nav-changelog-close");

var navDonateButton = document.getElementById("nav-donate-button");
var navDonateMenu = document.getElementById("nav-donate-menu");
var navDonateClose = document.getElementById("nav-donate-close");

// -------------- // 

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

var navMainClose = function () {
    navMain.className = navMain.className.replace(/(?:^|\s)open(?!\S)/g, '');
}

// Settings
// -------------- // 

var settingsOpen = function () {
    navMainClose();
    setTimeout(function () {
        navSettingsMenu.className += " open";
        //        navSettingsMenu.className += " ext";
        //        extSidebarOpen();
    }, animaDelay);
}

var settingsClose = function () {
    navSettingsMenu.className = navSettingsMenu.className.replace(/(?:^|\s)open(?!\S)/g, '');
}

// Customise Tiles Submenu

var settingsTilesOpen = function () {
    settingsClose();
    setTimeout(function () {
        navSettingsTilesMenu.className += " open";
    }, animaDelay);
}

var settingsTilesClose = function () {
    navSettingsTilesMenu.className = navSettingsTilesMenu.className.replace(/(?:^|\s)open(?!\S)/g, '');
    settingsOpen();
}

var settingsBackupRestoreOpen = function () {
    settingsClose();
    setTimeout(function () {
        navSettingsBackupRestoreMenu.className += " open";
    }, animaDelay);
}

var settingsBackupRestoreClose = function () {
    navSettingsBackupRestoreMenu.className = navSettingsBackupRestoreMenu.className.replace(/(?:^|\s)open(?!\S)/g, '');
    settingsOpen();
}

var bugOpen = function () {
    settingsClose();
    setTimeout(function () {
        navBugMenu.className += " open";
        navBugMenu.className += " ext2";
        extSidebarOpen2();
    }, animaDelay);
}

var bugClose = function () {
    navBugMenu.className = navBugMenu.className.replace(/(?:^|\s)open(?!\S)/g, '');
    navBugMenu.className = navBugMenu.className.replace(/(?:^|\s)ext2(?!\S)/g, '');
    settingsOpen();
    extSidebarClose();
}

var changelogOpen = function () {
    settingsClose();
    setTimeout(function () {
        navChangelogMenu.className += " open";
        navChangelogMenu.className += " ext2";
        extSidebarOpen2();
    }, animaDelay);
}

var changelogClose = function () {
    navChangelogMenu.className = navChangelogMenu.className.replace(/(?:^|\s)open(?!\S)/g, '');
    navChangelogMenu.className = navChangelogMenu.className.replace(/(?:^|\s)ext2(?!\S)/g, '');
    settingsOpen();
    extSidebarClose();
}

navSettingsTilesButton.addEventListener("click", settingsTilesOpen);
navSettingsTilesClose.addEventListener("click", settingsTilesClose);

navSettingsBackupRestoreButton.addEventListener("click", settingsBackupRestoreOpen);
navSettingsBackupRestoreClose.addEventListener("click", settingsBackupRestoreClose);

navBugButton.addEventListener("click", bugOpen);
navBugClose.addEventListener("click", bugClose);

navChangelogButton.addEventListener("click", changelogOpen);
navChangelogClose.addEventListener("click", changelogClose);

// New Tile
// -------------- // 

var newTileOpen = function () {
    navMainClose();
    setTimeout(function () {
        navNewTileMenu.className += " open";
        navNewTileMenu.className += " ext";
        extSidebarOpen();
    }, animaDelay);
}

// -------------- // 


var donateOpen = function () {
    navMainClose();
    setTimeout(function () {
        navDonateMenu.className += " open";
        navDonateMenu.className += " ext2";
        extSidebarOpen2();
    }, animaDelay);
}

var subMenuClose = function () {
    navNewTileMenu.className = navNewTileMenu.className.replace(/(?:^|\s)open(?!\S)/g, '');
    navNewTileMenu.className = navNewTileMenu.className.replace(/(?:^|\s)ext(?!\S)/g, '');
    newTileReset();
    settingsClose();
    settingsTilesClose();
    settingsBackupRestoreClose();
    bugClose();
    changelogClose();
    navDonateMenu.className = navDonateMenu.className.replace(/(?:^|\s)open(?!\S)/g, '');
    navDonateMenu.className = navDonateMenu.className.replace(/(?:^|\s)ext2(?!\S)/g, '');

    extSidebarClose();
    setTimeout(function () {
        settingsClose();
        navMainOpen();
    }, animaDelay);
}

// -------------- // 

navNewTileButton.addEventListener("click", newTileOpen);
navNewTileClose.addEventListener("click", subMenuClose);

navSettingsButton.addEventListener("click", settingsOpen);
navSettingsClose.addEventListener("click", subMenuClose);

navDonateButton.addEventListener("click", donateOpen);
navDonateClose.addEventListener("click", subMenuClose);

// Form Elements
//
// -------------------

// Add new tile
$(document).ready(function () {

    // URL
    $("#new-tile-url").focusin(function () {

        $("#new-tile-name").parent().fadeInFromHidden();

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

        $("#new-tile-rss").parent().fadeInFromHidden();
        $("#new-tile-divider-2").fadeInFromHidden();
        $("#new-tile-divider-3").fadeInFromHidden();
        $("#new-tile-divider-4").fadeInFromHidden();
        $("#customise-tile-color-switch").fadeInFromHidden();
        $("#new-tile-choice-title").fadeInFromHidden();
        $("#new-tile-select-logo").fadeInFromHidden();
        $("#new-tile-add-url").fadeInFromHidden();
        $("#new-tile-upload-logo").fadeInFromHidden();
        $("#new-tile-remove-image").fadeInFromHidden();
        $("#new-tile-submit-container").fadeInFromHidden();

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
    $("#new-tile-rss").focusin(function () {

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
    $("#customise-tile-color-switch input").click(function () {
        if ($(this).hasClass("active")) {

            $("#customise-tile-color-switch input").removeClass("active");

            $("#new-tile-customise-color, #new-tile-customise-font-color").addClass("fadeOutLeft").removeClass("fadeInLeft");

            setTimeout(function () {
                $("#new-tile-customise-tile-divider").addClass("tile-divider-move-2");
            }, 350);

            setTimeout(function () {
                $("#new-tile-customise-color, #new-tile-customise-font-color").addClass("hidden").removeClass("animated fadeOutLeft");
                $("#new-tile-customise-tile-divider").removeClass("tile-divider-move-2");
            }, 700);

        } else {

            $("#new-tile-customise-tile-divider").removeClass("tile-divider-move-2").addClass("tile-divider-move--2");

            setTimeout(function () {
                $("#customise-tile-color-switch input").addClass("active");
                $("#new-tile-customise-color, #new-tile-customise-font-color").removeClass("fadeOutLeft hidden").addClass("animated fadeInLeft");
                $("#new-tile-customise-tile-divider").removeClass("tile-divider-move--2");
            }, 350);
        }
    });

    // Tile Logo - Select from database
    $("#new-tile-select-logo").click(function () {
        $("#new-tile-add-url").addClass("fadeOutLeft");
        setTimeout(function () {
            $("#new-tile-upload-logo").addClass("fadeOutLeft");
        }, 100);
        setTimeout(function () {
            $("#new-tile-remove-image").addClass("fadeOutLeft");
            $("#new-tile-btn-divider").addClass("tile-divider-move-3");
        }, 200);
    });

    // Tile Logo - Add URL
    $("#new-tile-add-url").click(function () {
        $("#new-tile-select-logo").addClass("fadeOutLeft");
        setTimeout(function () {
            $("#new-tile-add-url").addClass("tile-divider-move-1");
            $("#new-tile-upload-logo").addClass("fadeOutLeft");
            $("#new-tile-add-url-text").removeClass("hidden").addClass("fadeInLeft animated");
        }, 100);
        setTimeout(function () {
            $("#new-tile-add-url-text").removeClass("animated").addClass("tile-divider-move-1");
        }, 400);
        setTimeout(function () {
            $("#new-tile-remove-image").addClass("fadeOutLeft");
            $("#new-tile-btn-divider").addClass("tile-divider-move-3");
        }, 200);
    });

    // Tile Logo - Add URL validation
    $("#new-tile-add-url-text").focusin(function () {
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


    // Tile Logo - Upload
    $("#new-tile-upload-logo").click(function () {

        $("#new-tile-select-logo").addClass("fadeOutLeft");

        setTimeout(function () {
            $("#new-tile-add-url").addClass("fadeOutLeft");
            $("#new-tile-upload-logo").addClass("tile-divider-move-2");
        }, 100);

        setTimeout(function () {
            $("#new-tile-remove-image").addClass("fadeOutLeft");
            $("#new-tile-btn-divider").addClass("tile-divider-move-3");
        }, 200);
    });

    $.fn.removeInput = function () {
        this.val('');
    }

    $.fn.makeHidden = function () {
        this.addClass("hidden");
    }

    $("#new-tile-reset, #nav-new-tile-close > div").click(function () {
        newTileReset();
    });

});

// Remove hidden
$.fn.removeHidden = function () {
    this.parent().removeClass("hidden");
}

// Reset menu 
$.fn.resetNewTile = function () {
    this.children(".bar").removeClass("error");
    this.children("label").removeClass("error").removeClass("valid");
    this.parent().addClass("hidden");
}

$.fn.fadeInFromHidden = function () {
    this.removeClass("hidden").addClass("animated fadeIn");
}

$.fn.removeFadeIn = function () {
    this.removeClass("animated fadeIn");
}

$.fn.removeInput = function () {
    this.val('');
}

$.fn.makeHidden = function () {
        this.addClass("hidden");
    }

// Reset Entire Menu

var newTileReset = function () {

    $("#new-tile-url .bar, #new-tile-url label, #new-tile-name .bar, #new-tile-name label, #new-tile-rss .bar, #new-tile-rss label").removeClass("error");
    $("#new-tile-url label, #new-tile-name label, #new-tile-rss label").removeClass("valid");

    $("#new-tile-url input").removeInput();

    $("#new-tile-name").parent().makeHidden();
    $("#new-tile-name").parent().removeFadeIn();
    $("#new-tile-name input").removeInput();

    $("#new-tile-rss").parent().makeHidden();
    $("#new-tile-rss").parent().removeFadeIn();
    $("#new-tile-rss input").removeInput();

    $("#customise-tile-color-switch").makeHidden();
    $("#customise-tile-color-switch").removeFadeIn();
    $("#customise-tile-color-switch input").removeClass("active").attr('checked', false);

    $("#new-tile-customise-color").addClass("hidden fadeOut").removeFadeIn();
    $("#new-tile-customise-font-color").addClass("hidden fadeOut").removeFadeIn();
    setTimeout(function () {
        $("#new-tile-customise-color").removeClass("animated fadeOut");
        $("#new-tile-customise-font-color").removeClass("animated fadeOut");
    }, 400);

    $("#new-tile-choice-title").makeHidden();
    $("#new-tile-choice-title").removeFadeIn();

    $("#new-tile-select-logo").makeHidden();
    $("#new-tile-select-logo").removeFadeIn();
    $("#new-tile-select-logo").removeClass("fadeOutLeft");

    $("#new-tile-add-url").makeHidden();
    $("#new-tile-add-url").removeFadeIn();
    $("#new-tile-add-url").removeClass("fadeOutLeft tile-divider-move-1");

    if ($("#new-tile-add-url-text").hasClass("hidden")) {
        jQuery.noop();
    } else {
        $("#new-tile-add-url-text").removeInput();
        $("#new-tile-add-url-text").removeClass("tile-divider-move-1 fadeInLeft").addClass("hidden");
    }

    $("#new-tile-upload-logo").makeHidden();
    $("#new-tile-upload-logo").removeFadeIn();
    $("#new-tile-upload-logo").removeClass("fadeOutLeft tile-divider-move-2");

    $("#new-tile-remove-image").makeHidden();
    $("#new-tile-remove-image").removeFadeIn();
    $("#new-tile-remove-image").removeClass("fadeOutLeft");

    $("#new-tile-submit-container").makeHidden();
    $("#new-tile-submit-container").removeFadeIn();

    $("#new-tile-btn-divider").removeClass("tile-divider-move-2, tile-divider-move-3");

    $("#new-tile-divider-2, #new-tile-divider-3, #new-tile-divider-4").removeFadeIn();
    $("#new-tile-divider-2, #new-tile-divider-3, #new-tile-divider-4").makeHidden();
};