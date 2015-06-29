/// <reference path="util.js" />
/// <reference path="Tile.js" />
/// <reference path="main.js" />

// Sidebar toggle
//
// -------------------
var sidebar = q("#sidebar");
var menuButton = q("#menu-button");

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

var navMain = q("#nav-main");

var navNewTileButton = q("#nav-new-tile-button");
var navNewTileMenu = q("#nav-new-tile-menu");
var navNewTileClose = q("#nav-new-tile-close");

var navSettingsButton = q("#nav-settings-button");
var navSettingsMenu = q("#nav-settings-menu");
var navSettingsClose = q("#nav-settings-close");

var navSettingsTilesButton = q("#nav-settings-tiles-button");
var navSettingsTilesMenu = q("#nav-settings-tiles-menu");
var navSettingsTilesClose = q("#nav-settings-tiles-close");

var navSettingsThemeButton = q("#nav-settings-theme-button");
var navSettingsThemeMenu = q("#nav-settings-theme-menu");
var navSettingsThemeClose = q("#nav-settings-theme-close");

var navSettingsRSSFeedButton = q("#nav-settings-rss-feed-button");
var navSettingsRSSFeedMenu = q("#nav-settings-rss-feed-menu");
var navSettingsRSSFeedClose = q("#nav-settings-rss-feed-close");

var navSettingsBackupRestoreButton = q("#nav-settings-backup-restore-button");
var navSettingsBackupRestoreMenu = q("#nav-settings-backup-restore-menu");
var navSettingsBackupRestoreClose = q("#nav-settings-backup-restore-close");

var navSettingsLanguageButton = q("#nav-settings-language-button");
var navSettingsLanguageMenu = q("#nav-settings-language-menu");
var navSettingsLanguageClose = q("#nav-settings-language-close");

var navBugButton = q("#nav-bug-button");
var navBugMenu = q("#nav-bug-menu");
var navBugClose = q("#nav-bug-close");

var navChangelogButton = q("#nav-changelog-button");
var navChangelogMenu = q("#nav-changelog-menu");
var navChangelogClose = q("#nav-changelog-close");

var navDonateButton = q("#nav-donate-button");
var navDonateMenu = q("#nav-donate-menu");
var navDonateClose = q("#nav-donate-close");

// -------------- //

var extSidebarOpen = function () {
    sidebar.className += " ext";
}

var extSidebarOpen2 = function () {
    sidebar.className += " ext2";
}

var extSidebarClose = function () {
    sidebar.className = sidebar.className.replace(/(?:^|\s)ext2(?!\S)/g, '');
    sidebar.className = sidebar.className.replace(/(?:^|\s)ext(?!\S)/g, '');
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

var settingsRSSFeedOpen = function () {
    settingsClose();
    setTimeout(function () {
        navSettingsRSSFeedMenu.className += " open";
    }, animaDelay);
}

var settingsRSSFeedClose = function () {
    navSettingsRSSFeedMenu.className = navSettingsRSSFeedMenu.className.replace(/(?:^|\s)open(?!\S)/g, '');
    settingsOpen();
}

var settingsLanguageOpen = function () {
    settingsClose();
    setTimeout(function () {
        navSettingsLanguageMenu.className += " open ext";
        extSidebarOpen();
    }, animaDelay);
}

var settingsLanguageClose = function () {
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

//navSettingsRSSFeedButton.addEventListener("click", settingsRSSFeedOpen);
//navSettingsRSSFeedClose.addEventListener("click", settingsRSSFeedClose);

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

    $("#new-tile-customise-color a.color-preview").css("background-color", MNTP.Config.AccentColor);
    $("#new-tile-customise-color input").val(MNTP.Config.AccentColor);

    $("#new-tile-customise-font-color a.color-preview").css("background-color", MNTP.Config.TileFontColor);
    $("#new-tile-customise-font-color input").val(MNTP.Config.TileFontColor);

    loadPreviewTile();

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
var editTileMenu = q("#edit-tile-menu");
//var editTileClose = q("#edit-tile-close");

var editTile_OptionsMenu = q("#edit-tile-options-menu");

var editTile_TileInfoButton = q("#edit-tile-info-button");
var editTile_TileInfoClose = q("#edit-tile-info-close");
var editTile_TileInfoMenu = q("#edit-tile-info-menu");

var editTile_TileColorButton = q("#edit-tile-color-button");
var editTile_TileColorClose = q("#edit-tile-color-close");
var editTile_TileColorMenu = q("#edit-tile-color-menu");

var editTile_TileImageButton = q("#edit-tile-image-button");
var editTile_TileImageClose = q("#edit-tile-image-close");
var editTile_TileImageMenu = q("#edit-tile-image-menu");

var editTile_TileResetButton = q("#edit-tile-reset");

var editMenuOpen = function () {
    sidebar.addClass("open");
    menuButton.addClass("active");

    editTile_TileInfoMenu.addClass("fadeOutLeft");
    editTile_TileColorMenu.addClass("fadeOutLeft");
    editTile_TileImageMenu.addClass("fadeOutLeft");

    editTile_OptionsMenu.removeClass("fadeOutLeft")

    editTileMenu.addClass("open ext");
    extSidebarOpen();
};

var editMenuClose = function () {
    editTileMenu.className = editTileMenu.className.replace(/(?:^|\s)open(?!\S)/g, '');
    editTileMenu.className = editTileMenu.className.replace(/(?:^|\s)ext(?!\S)/g, '');
};

var editTile_ChoicesClose = function () {
    editTile_OptionsMenu.removeClass("fadeInLeft").addClass("fadeOutLeft");

    editTile_animateBtnContainer();
};

var editTile_ChoicesOpen = function () {
    editTile_OptionsMenu.removeClass("fadeOutLeft").addClass("fadeInLeft");

    editTile_animateBtnContainer();
};

var editTile_InfoOpen = function () {
    editTile_ChoicesClose();

    setTimeout(function () {
        editTile_TileInfoMenu.removeClass("fadeOutLeft").addClass("fadeInLeft");
    }, animaDelay);

    editTile_animateBtnContainer();
};

var editTile_InfoClose = function () {
    editTile_TileInfoMenu.removeClass("fadeInLeft").addClass("fadeOutLeft");

    setTimeout(function () {
        editTile_ChoicesOpen();
    }, animaDelay);

    editTile_animateBtnContainer();
};

var editTile_ColorOpen = function () {
    editTile_ChoicesClose();

    setTimeout(function () {
        editTile_TileColorMenu.removeClass("fadeOutLeft").addClass("fadeInLeft");
    }, animaDelay);

    editTile_animateBtnContainer();
};

var editTile_ColorClose = function () {
    editTile_TileColorMenu.removeClass("fadeInLeft").addClass("fadeOutLeft");

    setTimeout(function () {
        editTile_ChoicesOpen();
    }, animaDelay);

    editTile_animateBtnContainer();
};

var editTile_ImageOpen = function () {
    editTile_ChoicesClose();

    setTimeout(function () {
        editTile_TileImageMenu.removeClass("fadeOutLeft").addClass("fadeInLeft");
    }, animaDelay);

    editTile_animateBtnContainer();
};

var editTile_ImageClose = function () {
    editTile_TileImageMenu.removeClass("fadeInLeft").addClass("fadeOutLeft");

    setTimeout(function () {
        editTile_ChoicesOpen();
    }, animaDelay);

    editTile_animateBtnContainer();
};

var editTile_animateBtnContainer = function () {
    q("#edit-tile-btn-container").addClass("hidden fadeOutLeft").removeClass("fadeInLeft");

    setTimeout(function () {
        q("#edit-tile-btn-container").removeClass("hidden");

        setTimeout(function () {
            q("#edit-tile-btn-container").removeClass("fadeOutLeft").addClass("fadeInLeft");
        }, 0);

    }, animaDelay);

}

// Validation

$(document).ready(function () {

    // URL
    $("#edit-tile-url").focusout(function () {

        var url = $("input", this).val();

        $("label", this).removeClass("error").addClass("valid");

        //if (url.match(/[\s\S]+\.[\s\S]+/g)) {
        //	$(".bar", this).removeClass("error");
        //	$("label", this).removeClass("error");
        //} else {
        //	$(".bar", this).addClass("error");
        //	$("label", this).addClass("error").addClass("valid");
        //}

    });

    // Text
    $("#edit-tile-name").focusout(function () {

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

    // RSS
    $("#edit-tile-rss").focusout(function () {

        if ($("input", this).val() == '') {
            // if false
            $("label", this).removeClass("valid");
        } else {
            // if true
            $(".bar", this).removeClass("error");
            $("label", this).removeClass("error").addClass("valid");
        };

    });

    // Customise tile color
    $("#edit-tile-color-switch input").click(function () {

        if (this.hasClass("active")) {

            q("#edit-tile-color-switch input").removeClass("active");
            q("#edit-tile-customise-color").fadeOutLeft();
            q("#edit-tile-customise-font-color").fadeOutLeft();

        } else {

            q("#edit-tile-color-switch input").addClass("active");
            q("#edit-tile-customise-color").fadeInLeft();
            q("#edit-tile-customise-font-color").fadeInLeft();

        }

    });

    // Add image from URL
    $("#edit-tile-add-url div").click(function () {

        $("#edit-tile-add-url-text").removeClass("hidden fadeOutLeft").addClass("fadeInLeft animated active");

        $("input[data-property='removeImage']", "#edit-tile-menu").val("true");
        $("input[data-property='image.data']", "#edit-tile-menu").val("");

        loadPreviewTile(null, true);

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

//editTileClose.addEventListener("click", subMenuClose);

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

    });

    $("#new-tile-url").focusout(function () {

        var url = $("input", this).val();

        $("label", this).removeClass("error").addClass("valid");

        //if (url.match(/[\s\S]+\.[\s\S]+/g)) {
        //	$(".bar", this).removeClass("error");
        //	$("label", this).removeClass("error").addClass("valid");
        //} else {
        //	$(".bar", this).addClass("error");
        //	$("label", this).addClass("error");
        //}

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
        //$("#new-tile-remove-image").fadeInFromHidden();
        $("#new-tile-submit-container").fadeInFromHidden();

    });

    $("#new-tile-name").focusout(function () {

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

    // RSS
    $("#new-tile-rss").focusout(function () {

        if ($("input", this).val() == '') {
            // if false
            $("label", this).removeClass("valid");
        } else {
            // if true
            $(".bar", this).removeClass("error");
            $("label", this).removeClass("error").addClass("valid");
        };

    });

    // Customise tile color
    $("#customise-tile-color-switch input").click(function () {
        if ($(this).hasClass("active")) {

            $("#customise-tile-color-switch input").removeClass("active");

            $("#new-tile-customise-color, #new-tile-customise-font-color").addClass("fadeOutLeft").removeClass("fadeInLeft");

        } else {


            $("#customise-tile-color-switch input").addClass("active");
            $("#new-tile-customise-color, #new-tile-customise-font-color").removeClass("fadeOutLeft").addClass("fadeInLeft");


        }

    });

    // Tile Logo - Select from database
    $("#new-tile-select-logo").click(function () {

        $("#new-tile-add-url-text").addClass("fadeOutLeft");

    });

    // Tile Logo - Add URL
    $("#new-tile-add-url").click(function () {

        q("#new-tile-add-url-text").toggleClass("fadeOutLeft", "fadeInLeft");

        $("input[data-property='removeImage']", "#nav-new-tile-menu").val("true");
        $("input[data-property='image.data']", "#nav-new-tile-menu").val("");

        loadPreviewTile();

    });

    // Tile Logo - Add URL validation
    $("#new-tile-add-url-text").focusin(function () {
        //$(this).focusout(function () {

        //    var url = $("input", this).val();

        //    if (url.match(/[\s\S]+\.[\s\S]+/g) || url == "") {
        //        $(".bar", this).removeClass("error");
        //        $("label", this).removeClass("error");
        //    } else {
        //        $(".bar", this).addClass("error");
        //        $("label", this).addClass("error").addClass("valid");
        //    }
        //});
    });

    $("#new-tile-add-url-text").focusout(function () {

        var url = $("input", this).val();

        if (url == "")
            $("label", this).removeClass("valid");
        else
            $("label", this).addClass("valid");
    });

    // Tile Logo - Upload
    $("#new-tile-upload-logo").click(function () {

        $("#new-tile-add-url-text").addClass("fadeOutLeft");

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

    $("#new-tile-url .bar, #new-tile-url label, #new-tile-name .bar, #new-tile-name label, #new-tile-rss .bar, #new-tile-rss label, #new-tile-add-url").removeClass("error");
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

    $("#new-tile-customise-color").addClass("fadeOutLeft").removeFadeIn();
    $("#new-tile-customise-font-color").addClass("fadeOutLeft").removeFadeIn();

    $("#new-tile-choice-title").makeHidden();
    $("#new-tile-choice-title").removeFadeIn();

    $("#new-tile-select-logo").makeHidden();
    $("#new-tile-select-logo").removeFadeIn();
    $("#new-tile-select-logo").removeClass("fadeOutLeft");

    $("#new-tile-add-url").makeHidden();
    $("#new-tile-add-url").removeFadeIn();
    $("#new-tile-add-url").removeClass("fadeOutLeft tile-divider-move-1");
    $("#new-tile-add-url").removeInput();

    if ($("#new-tile-add-url-text").hasClass("hidden")) {
        jQuery.noop();
    } else {
        $("#new-tile-add-url-text").removeClass("tile-divider-move-1 fadeInLeft").addClass("fadeOutLeft");
    }

    $("#new-tile-add-url-text input").removeInput();

    $("#new-tile-upload-logo").makeHidden();
    $("#new-tile-upload-logo").removeFadeIn();
    $("#new-tile-upload-logo").removeClass("fadeOutLeft tile-divider-move-2");
    $("#new-tile-upload-logo input").removeInput();

    $("#new-tile-remove-image").makeHidden();
    $("#new-tile-remove-image").removeFadeIn();
    $("#new-tile-remove-image").removeClass("fadeOutLeft");

    $("#new-tile-submit-container").makeHidden();
    $("#new-tile-submit-container").removeFadeIn();

    $("#new-tile-btn-divider").removeClass("tile-divider-move-2, tile-divider-move-3");

    $("#new-tile-divider-2, #new-tile-divider-3, #new-tile-divider-4").removeFadeIn();
    $("#new-tile-divider-2, #new-tile-divider-3, #new-tile-divider-4").makeHidden();

    $("#nav-new-tile-menu input[type='hidden']").val("");
};

// Activate Dropdown
//
// -------------------

$(document).ready(function () {

    setTimeout(function () {
        $('select').material_select();
    }, 1000);

});


navNewTileButton.addEventListener("click", newTileOpen);
navNewTileClose.addEventListener("click", subMenuClose);
