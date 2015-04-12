/// <reference path="util.js" />

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

var navSettingsThemeButton = document.getElementById("nav-settings-theme-button");
var navSettingsThemeMenu = document.getElementById("nav-settings-theme-menu");
var navSettingsThemeClose = document.getElementById("nav-settings-theme-close");

var navSettingsBackupRestoreButton = document.getElementById("nav-settings-backup-restore-button");
var navSettingsBackupRestoreMenu = document.getElementById("nav-settings-backup-restore-menu");
var navSettingsBackupRestoreClose = document.getElementById("nav-settings-backup-restore-close");

var navSettingsLanguageButton = document.getElementById("nav-settings-language-button");
var navSettingsLanguageMenu = document.getElementById("nav-settings-language-menu");
var navSettingsLanguageClose = document.getElementById("nav-settings-language-close");

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
    navOverview.className = navOverview.className.replace(/(?:^|\s)ext2(?!\S)/g, '');
    navOverview.className = navOverview.className.replace(/(?:^|\s)ext(?!\S)/g, '');
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

var settingsThemeOpen = function () {
    settingsClose();
    setTimeout(function () {
        navSettingsThemeMenu.className += " open ext";
        extSidebarOpen();
    }, animaDelay);
}

var settingsThemeClose = function () {
    navSettingsThemeMenu.className = navSettingsThemeMenu.className.replace(/(?:^|\s)open(?!\S)/g, '');
    navSettingsThemeMenu.className = navSettingsThemeMenu.className.replace(/(?:^|\s)ext(?!\S)/g, '');
    settingsOpen();
    extSidebarClose();
}

var settingsLanguageOpen = function() {
    settingsClose();
    setTimeout(function() {
        navSettingsLanguageMenu.className += " open ext";
        extSidebarOpen();
    }, animaDelay);
}

var settingsLanguageClose = function() {
    navSettingsLanguageMenu.className = navSettingsLanguageMenu.className.replace(/(?:^|\s)open(?!\S)/g, '');
    navSettingsLanguageMenu.className = navSettingsLanguageMenu.className.replace(/(?:^|\s)ext(?!\S)/g, '');
    settingsOpen();
    extSidebarClose();
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
        navBugMenu.className += " open ext2";
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
        navChangelogMenu.className += " open ext2";
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

navSettingsThemeButton.addEventListener("click", settingsThemeOpen);
navSettingsThemeClose.addEventListener("click", settingsThemeClose);

navSettingsBackupRestoreButton.addEventListener("click", settingsBackupRestoreOpen);
navSettingsBackupRestoreClose.addEventListener("click", settingsBackupRestoreClose);

//navSettingsLanguageButton.addEventListener("click", settingsLanguageOpen);
//navSettingsLanguageClose.addEventListener("click", settingsLanguageClose);

navBugButton.addEventListener("click", bugOpen);
navBugClose.addEventListener("click", bugClose);

navChangelogButton.addEventListener("click", changelogOpen);
navChangelogClose.addEventListener("click", changelogClose);

// New Tile
//
// -------------------

var newTileOpen = function () {
    navMainClose();
    setTimeout(function () {
        navNewTileMenu.className += " open ext";
        extSidebarOpen();
    }, animaDelay);
}

// -------------- // 

var donateOpen = function () {
    navMainClose();
    setTimeout(function () {
        navDonateMenu.className += " open ext2";
        extSidebarOpen2();
    }, animaDelay);
}

// Edit menu
//
// -------------------
var editTileMenu = document.getElementById("edit-tile-menu");
var editTileClose = document.getElementById("edit-tile-close");

var editTile_OptionsMenu = document.getElementById("edit-tile-options-menu");

var editTile_TileInfoButton = document.getElementById("edit-tile-info-button");
var editTile_TileInfoClose = document.getElementById("edit-tile-info-close");
var editTile_TileInfoMenu = document.getElementById("edit-tile-info-menu");

var editTile_TileColorButton = document.getElementById("edit-tile-color-button");
var editTile_TileColorClose = document.getElementById("edit-tile-color-close");
var editTile_TileColorMenu = document.getElementById("edit-tile-color-menu");

var editTile_TileImageButton = document.getElementById("edit-tile-image-button");
var editTile_TileImageClose = document.getElementById("edit-tile-image-close");
var editTile_TileImageMenu = document.getElementById("edit-tile-image-menu");

var editMenuClose = function() {
    editTileMenu.className = editTileMenu.className.replace(/(?:^|\s)open(?!\S)/g, '');
    editTileMenu.className = editTileMenu.className.replace(/(?:^|\s)ext(?!\S)/g, '');
};

var editTile_ChoicesClose = function() {
    
    editTile_OptionsMenu.className = editTile_OptionsMenu.className.replace(/(?:^|\s)fadeInLeft(?!\S)/g, '');
    editTile_OptionsMenu.className += " animated fadeOutLeft";
    
    setTimeout(function() {
        editTile_OptionsMenu.className += " hidden";
    }, animaDelay);
};

var editTile_ChoicesOpen = function() {
    editTile_OptionsMenu.className = editTile_OptionsMenu.className.replace(/(?:^|\s)hidden(?!\S)/g, '');
    editTile_OptionsMenu.className = editTile_OptionsMenu.className.replace(/(?:^|\s)fadeOutLeft(?!\S)/g, '');
    editTile_OptionsMenu.className += " fadeInLeft";
    
    setTimeout(function() {
        editTile_OptionsMenu.className = editTile_OptionsMenu.className.replace(/(?:^|\s)animated(?!\S)/g, '');
    }, animaDelay);
};

var editTile_InfoOpen = function() {
    editTile_ChoicesClose();
    
    setTimeout(function() {
        editTile_TileInfoMenu.className = editTile_TileInfoMenu.className.replace(/(?:^|\s)hidden(?!\S)/g, '');
        editTile_TileInfoMenu.className = editTile_TileInfoMenu.className.replace(/(?:^|\s)fadeOutLeft(?!\S)/g, '');
        editTile_TileInfoMenu.className += " fadeInLeft animated";
    }, animaDelay);
};

var editTile_InfoClose = function() {
    editTile_TileInfoMenu.className = editTile_TileInfoMenu.className.replace(/(?:^|\s)fadeInLeft(?!\S)/g, '');
    editTile_TileInfoMenu.className += " fadeOutLeft";
    
    setTimeout(function() {
        editTile_TileInfoMenu.className += " hidden";
        editTile_TileInfoMenu.className = editTile_TileInfoMenu.className.replace(/(?:^|\s)animated(?!\S)/g, '');
        editTile_ChoicesOpen();
    }, animaDelay);
};

var editTile_ColorOpen = function() {
    editTile_ChoicesClose();
    
    setTimeout(function() {
        editTile_TileColorMenu.className = editTile_TileColorMenu.className.replace(/(?:^|\s)hidden(?!\S)/g, '');
        editTile_TileColorMenu.className = editTile_TileColorMenu.className.replace(/(?:^|\s)fadeOutLeft(?!\S)/g, '');
        editTile_TileColorMenu.className += " fadeInLeft animated";
    }, animaDelay);
};

var editTile_ColorClose = function() {
    editTile_TileColorMenu.className = editTile_TileColorMenu.className.replace(/(?:^|\s)fadeInLeft(?!\S)/g, '');
    editTile_TileColorMenu.className += " fadeOutLeft";
    
    setTimeout(function() {
        editTile_TileColorMenu.className += " hidden";
        editTile_TileColorMenu.className = editTile_TileColorMenu.className.replace(/(?:^|\s)animated(?!\S)/g, '');
        editTile_ChoicesOpen();
    }, animaDelay);
};

var editTile_ImageOpen = function() {
    editTile_ChoicesClose();
    
    setTimeout(function() {
        editTile_TileImageMenu.className = editTile_TileImageMenu.className.replace(/(?:^|\s)hidden(?!\S)/g, '');
        editTile_TileImageMenu.className = editTile_TileImageMenu.className.replace(/(?:^|\s)fadeOutLeft(?!\S)/g, '');
        editTile_TileImageMenu.className += " fadeInLeft animated";
    }, animaDelay);
};

var editTile_ImageClose = function() {
    editTile_TileImageMenu.className = editTile_TileImageMenu.className.replace(/(?:^|\s)fadeInLeft(?!\S)/g, '');
    editTile_TileImageMenu.className += " fadeOutLeft";
    
    setTimeout(function() {
        editTile_TileImageMenu.className += " hidden";
        editTile_TileImageMenu.className = editTile_TileImageMenu.className.replace(/(?:^|\s)animated(?!\S)/g, '');
        editTile_ChoicesOpen();
    }, animaDelay);
};

// Validation

$(document).ready(function() {
    // URL
    $("#edit-tile-url").focusin(function () {

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
    $("#edit-tile-name").focusin(function () {

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
    $("#edit-tile-rss").focusin(function () {

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
    
    // Add image from URL
    $("#edit-tile-add-url div").click(function() {
        
        if( $("#edit-tile-add-url-text").hasClass("active") ) {
            // if open
            $("#edit-tile-add-url-text").removeClass("fadeInLeft active").addClass("fadeOutLeft");
            
            setTimeout(function() {
                $("#edit-tile-add-url-text").addClass("hidden").removeClass("animated")
            }, animaDelay);
            
        } else {
            // if closed
            $("#edit-tile-add-url-text").removeClass("hidden fadeOutLeft").addClass("fadeInLeft animated active");
        }; 
    });
});

// -------------- // 

var subMenuClose = function () {
    navNewTileMenu.className = navNewTileMenu.className.replace(/(?:^|\s)open(?!\S)/g, '');
    navNewTileMenu.className = navNewTileMenu.className.replace(/(?:^|\s)ext(?!\S)/g, '');
    newTileReset();
    settingsClose();
    settingsTilesClose();
    settingsThemeClose();
    settingsBackupRestoreClose();
//    settingsLanguageClose();
    bugClose();
    changelogClose();
    navDonateMenu.className = navDonateMenu.className.replace(/(?:^|\s)open(?!\S)/g, '');
    navDonateMenu.className = navDonateMenu.className.replace(/(?:^|\s)ext2(?!\S)/g, '');
    editMenuClose();

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

editTileClose.addEventListener("click", subMenuClose);

editTile_TileInfoButton.addEventListener("click", editTile_InfoOpen);
editTile_TileInfoClose.addEventListener("click", editTile_InfoClose);

editTile_TileColorButton.addEventListener("click", editTile_ColorOpen);
editTile_TileColorClose.addEventListener("click", editTile_ColorClose);

editTile_TileImageButton.addEventListener("click", editTile_ImageOpen);
editTile_TileImageClose.addEventListener("click", editTile_ImageClose);

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
            }, 250);

            setTimeout(function () {
                $("#new-tile-customise-color, #new-tile-customise-font-color").addClass("hidden").removeClass("animated fadeOutLeft");
                $("#new-tile-customise-tile-divider").removeClass("tile-divider-move-2");
            }, 600);

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

// Activate Dropdown
//
// -------------------

$(document).ready(function() {
    
    setTimeout(function() {
        $('select').material_select();
    }, 1000);
    
});
            

navNewTileButton.addEventListener("click", newTileOpen);
navNewTileClose.addEventListener("click", subMenuClose);



// Import tiles and configurations
//
// -------------------
q("#nav-settings-import-file").addEventListener("change", function (event) {

    var file = this.files[0];

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

                MNTP.IDB.importData(data).then(window.location.reload());

            };

        })(file);

        reader.readAsText(file);
    }


});