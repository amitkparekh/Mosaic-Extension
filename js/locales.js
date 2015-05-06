/// <reference path="util.js" />

/**
 * Retrives locale values from locale files
 */

var getI18nMsg = chrome.i18n.getMessage;

function setLocalisedTopicList() {
    
    // Nav main menu
    q("#text_add_new_tile").innerText = getI18nMsg("add_new_tile");
    q("#text_show_hide_sections").innerText = getI18nMsg("show_hide_sections");
    q("#text_show_apps").innerText = getI18nMsg("show_apps");
    q("#text_show_bookmarks_bar").innerText = getI18nMsg("show_bookmarks_bar");
    q("#text_show_recently_closed_tabs").innerText = getI18nMsg("show_recently_closed_tabs");
    
    if ( getI18nMsg("show_recently_closed_tabs").length < 26 ) {
        q("#text_show_recently_closed_tabs").innerText = getI18nMsg("show_recently_closed_tabs");
    } else {
        if ( getI18nMsg("show_recently_closed").length < getI18nMsg("show_recently_closed_tabs").length ) {
            q("#text_show_recently_closed_tabs").innerText = getI18nMsg("show_recently_closed");
        } else {
            q("#text_show_recently_closed_tabs").innerText = getI18nMsg("show_recently_closed_tabs");
        }
    }
    
    q("#text_settings").innerText = getI18nMsg("settings");
    q("#text_help").innerText = getI18nMsg("help");
    q("#text_donate").innerText = getI18nMsg("donate");
    
    // Add new tile menu
    q("#text_add_new_tile_2").innerText = getI18nMsg("add_new_tile");
    q("#text_site_url").innerText = getI18nMsg("site_url");
    q("#text_site_name").innerText = getI18nMsg("site_name");
    q("#text_site_rss").innerText = getI18nMsg("site_rss");
    q("#text_customise_tile_color").innerText = getI18nMsg("customise_tile_color");
    q("#text_tile_color").innerText = getI18nMsg("tile_color");
    q("#text_font_color").innerText = getI18nMsg("font_color");
    q("#text_tile_image").innerText = getI18nMsg("tile_image");
    
    if ( getI18nMsg("select_from_our_database").length < 26 ) {
        q("#text_select_from_our_database").innerText = getI18nMsg("select_from_our_database");
    } else {
        if ( getI18nMsg("choose_from_the_database").length < getI18nMsg("select_from_our_databse").length ) {
            q("#text_select_from_our_database").innerText = getI18nMsg("choose_from_the_database");
        } else {
            q("#text_select_from_our_database").innerText = getI18nMsg("select_from_our_database");
        }
    }
    
    if ( getI18nMsg("select").length > 7 ) {        
        if ( getI18nMsg("choose").length < 8 ) {
            q("#text_select").innerText = getI18nMsg("choose");
        } else {
            q("#text_select").innerText = getI18nMsg("select");
        }
    } else {
        q("#text_select").innerText = getI18nMsg("select");
    }
    
    q("#text_add_from_url").innerText = getI18nMsg("add_from_url");
    
    if ( getI18nMsg("add_url").length > 7 ) {
        q("#text_add_url").innerText = getI18nMsg("add");
    } else {
        q("#text_add_url").innerText = getI18nMsg("add_url"); 
    }
    
    q("#text_add_url_2").innerText = getI18nMsg("add_url");
    q("#text_upload_from_computer").innerText = getI18nMsg("upload_from_computer");
    
    
    if ( getI18nMsg("upload").length > 8 ) {
        q("#text_upload").innerText = getI18nMsg("get");
    } else {
        q("#text_upload").innerText = getI18nMsg("upload");
    }
    
    q("#text_remove_image").innerText = getI18nMsg("remove_image");
    q("#text_remove").innerText = getI18nMsg("remove");
    
    var newTileBtnContainerFix = function() {
        var length_Reset = getI18nMsg("reset").length;
        var length_Cancel = getI18nMsg("cancel").length;
        var length_AddNewTile = getI18nMsg("add_new_tile").length;
        var length_AddTile = getI18nMsg("add_tile").length;
        var length_Combined = length_Reset + length_AddNewTile;
        var length_Combined_2 = length_Reset + length_AddTile;
        var length_Combined_3 = length_Cancel + length_AddNewTile;
        var length_Combined_4 = length_Cancel + length_AddTile;
        
        if ( length_Combined < 21 ) {
            q("#text_reset").innerText = getI18nMsg("reset");
            q("#text_add_new_tile_3").innerText = getI18nMsg("add_new_tile");
        } else {
            if ( length_Combined_2 < 21 ) {
                q("#text_reset").innerText = getI18nMsg("reset");
                q("#text_add_new_tile_3").innerText = getI18nMsg("add_tile");
            } else {
                if ( length_Combined_3 < 21 ) {
                    q("#text_reset").innerText = getI18nMsg("cancel");
                    q("#text_add_new_tile_3").innerText = getI18nMsg("add_new_tile");
                } else {
                    if ( length_Combined_4 < 21 ) {
                        q("#text_reset").innerText = getI18nMsg("cancel");
                        q("#text_add_new_tile_3").innerText = getI18nMsg("add_tile");
                    } else {
                        q("#text_reset").innerText = getI18nMsg("reset");
                        q("#text_add_new_tile_3").innerText = getI18nMsg("add"); 
                    }
                }
            }
        }
    }
    newTileBtnContainerFix();
    
    // Settings menu
    q("#text_settings_2").innerText = getI18nMsg("settings");
    q("#text_customise_tiles").innerText = getI18nMsg("customise_tiles");
    q("#text_customise_theme").innerText = getI18nMsg("customise_theme");
//    q("#text_customise_rss_feed").innerText = getI18nMsg("customise_rss_feed");
//    q("#text_profile_settings").innerText = getI18nMsg("profile_settings");
//    q("#text_change_language").innerText = getI18nMsg("change_language");
    q("#text_backup_restore_settings").innerText = getI18nMsg("backup_restore_settings");
    q("#text_report_a_bug").innerText = getI18nMsg("report_a_bug");
    q("#text_changelog").innerText = getI18nMsg("changelog");
    
    // Customise tiles menu
    q("#text_customise_tiles_2").innerText = getI18nMsg("customise_tiles");
    
    if ( getI18nMsg("show_tile_animation_on_load").length > 28 ) {
        q("#text_show_tile_animation_on_load").innerText = getI18nMsg("show_tile_animation");
    } else {
        q("#text_show_tile_animation_on_load").innerText = getI18nMsg("show_tile_animation_on_load");
    }
    
    q("#text_default_tile_color").innerText = getI18nMsg("default_tile_color");
    q("#text_background_color").innerText = getI18nMsg("background_color");
    q("#text_text_color").innerText = getI18nMsg("text_color");
    q("#text_tile_positioning").innerText = getI18nMsg("tile_positioning");
    q("#text_tile_layout").innerText = getI18nMsg("tile_layout");
    q("#text_grid").innerText = getI18nMsg("grid");
    q("#text_free").innerText = getI18nMsg("free");
    q("#text_number_of_rows").innerText = getI18nMsg("number_of_rows");
    q("#text_number_of_columns").innerText = getI18nMsg("number_of_columns");
    q("#text_horizontal_align").innerText = getI18nMsg("horizontal_align");
    q("#text_left").innerText = getI18nMsg("left");
    q("#text_centre").innerText = getI18nMsg("centre");
    q("#text_right").innerText = getI18nMsg("right");
    q("#text_vertical_align").innerText = getI18nMsg("vertical_align");
    q("#text_top").innerText = getI18nMsg("top");
    q("#text_centre_2").innerText = getI18nMsg("centre");
    q("#text_bottom").innerText = getI18nMsg("bottom");
    q("#text_tile_flow_direction").innerText = getI18nMsg("tile_flow_direction");
    q("#text_top_to_bottom").innerText = getI18nMsg("top_to_bottom");
    q("#text_left_to_right").innerText = getI18nMsg("left_to_right");
    
    if ( getI18nMsg("reset_to_default".length < 24 ) ) {
        q("#text_reset_to_default").innerText = getI18nMsg("reset_to_default");
    } else {
        if ( getI18nMsg("reset_settings").length < 24 ) {
            q("#text_reset_to_default").innerText = getI18nMsg("reset_settings");
        } else {
            q("#text_reset_to_default").innerText = getI18nMsg("reset");
        }
    }
    
    // Customise theme menu
    q("#text_customise_theme_2").innerText = getI18nMsg("customise_theme");
    q("#text_background_color_2").innerText = getI18nMsg("background_color");
    q("#text_choose_background_image").innerText = getI18nMsg("choose_background_image");
    q("#text_get_from_wikimedia_commons").innerText = getI18nMsg("get_from_wikimedia_commons");
    
    if ( getI18nMsg("select").length > 7 ) {        
        if ( getI18nMsg("choose").length < 8 ) {
            q("#text_select_2").innerText = getI18nMsg("choose");
        } else {
            q("#text_select_2").innerText = getI18nMsg("select");
        }
    } else {
        q("#text_select_2").innerText = getI18nMsg("select");
    }
    
    q("#text_add_from_url_2").innerText = getI18nMsg("add_from_url");
    
    if ( getI18nMsg("add_url").length > 7 ) {
        q("#text_add_url_3").innerText = getI18nMsg("add");
    } else {
        q("#text_add_url_3").innerText = getI18nMsg("add_url"); 
    }
    
//    q("#text_add_url_4").innerText = getI18nMsg("add_url");
    q("#text_upload_from_computer_2").innerText = getI18nMsg("upload_from_computer");
    q("#text_upload_2").innerText = getI18nMsg("upload");
    q("#text_remove_image_2").innerText = getI18nMsg("remove_image");
    q("#text_remove_2").innerText = getI18nMsg("remove");
    
    if ( getI18nMsg("reset_to_default".length < 24 ) ) {
        q("#text_reset_to_default_2").innerText = getI18nMsg("reset_to_default");
    } else {
        if ( getI18nMsg("reset_settings").length < 24 ) {
            q("#text_reset_to_default_2").innerText = getI18nMsg("reset_settings");
        } else {
            q("#text_reset_to_default_2").innerText = getI18nMsg("reset");
        }
    }
    
    // Customise RSS feed menu
    
    // Backup / Restore menu
    q("#text_backup_restore_settings_2").innerText = getI18nMsg("backup_restore_settings");
    q("#text_import_settings").innerText = getI18nMsg("import_settings");
    q("#text_import").innerText = getI18nMsg("import");
    q("#text_export_settings").innerText = getI18nMsg("export_settings");
    q("#text_export").innerText = getI18nMsg("export");
    q("#text_reset_settings").innerText = getI18nMsg("reset_settings");
    q("#text_reset_2").innerText = getI18nMsg("reset");
    
    // Edit tile menu
    q("#text_edit_tile").innerText = getI18nMsg("edit_tile");
    q("#text_make_tile_bigger").innerText = getI18nMsg("make_tile_bigger");
    q("#text_make_tile_smaller").innerText = getI18nMsg("make_tile_smaller");
    q("#text_edit_tile_info").innerText = getI18nMsg("edit_tile_info");
    q("#text_customise_tile_color_2").innerText = getI18nMsg("customise_tile_color");
    q("#text_edit_tile_image").innerText = getI18nMsg("edit_tile_image");
    
    q("#text_edit_tile_info_2").innerText = getI18nMsg("edit_tile_info");
    q("#text_site_url_2").innerText = getI18nMsg("site_url");
    q("#text_site_name_2").innerText = getI18nMsg("site_name");
    q("#text_site_rss_2").innerText = getI18nMsg("site_rss");
    
    q("#text_customise_tile_color_3").innerText = getI18nMsg("customise_tile_color");
    q("#text_customise_tile_color_4").innerText = getI18nMsg("customise_tile_color");
    q("#text_tile_color_2").innerText = getI18nMsg("tile_color");
    q("#text_font_color_2").innerText = getI18nMsg("font_color");
    
    q("#text_edit_tile_image_2").innerText = getI18nMsg("edit_tile_image");
    
    if ( getI18nMsg("select_from_our_database").length < 26 ) {
        q("#text_select_from_our_database_2").innerText = getI18nMsg("select_from_our_database");
    } else {
        if ( getI18nMsg("choose_from_the_database").length < getI18nMsg("select_from_our_databse").length ) {
            q("#text_select_from_our_database_2").innerText = getI18nMsg("choose_from_the_database");
        } else {
            q("#text_select_from_our_database_2").innerText = getI18nMsg("select_from_our_database");
        }
    }
    
    if ( getI18nMsg("select").length > 7 ) {        
        if ( getI18nMsg("choose").length < 8 ) {
            q("#text_select_3").innerText = getI18nMsg("choose");
        } else {
            q("#text_select_3").innerText = getI18nMsg("select");
        }
    } else {
        q("#text_select_3").innerText = getI18nMsg("select");
    }
    
    q("#text_add_from_url_3").innerText = getI18nMsg("add_from_url");
    
    if ( getI18nMsg("add_url").length > 7 ) {
        q("#text_add_url_5").innerText = getI18nMsg("add");
    } else {
        q("#text_add_url_5").innerText = getI18nMsg("add_url"); 
    }
    
    q("#text_add_url_6").innerText = getI18nMsg("add_url");
    q("#text_upload_from_computer_3").innerText = getI18nMsg("upload_from_computer");
    q("#text_upload_3").innerText = getI18nMsg("upload");
    q("#text_remove_image_3").innerText = getI18nMsg("remove_image");
    q("#text_remove_3").innerText = getI18nMsg("remove");
    
    q("#text_delete").innerText = getI18nMsg("delete");
    q("#text_save_changes").innerText = getI18nMsg("save_changes");
    
    var editTileBtnContainerFix = function() {
        var length_Delete = getI18nMsg("delete").length;
        var length_Remove = getI18nMsg("remove").length;
        var length_SaveChanges = getI18nMsg("save_changes").length;
        var length_Confirm = getI18nMsg("confirm").length;
        var length_Save = getI18nMsg("save").length;
        
        var length_Combined = length_Delete + length_SaveChanges;
        var length_Combined_2 = length_Remove + length_SaveChanges;
        var length_Combined_3 = length_Delete + length_Save;
        var length_Combined_4 = length_Remove + length_Save;
        var length_Combined_5 = length_Delete + length_Confirm;
        var length_Combined_6 = length_Remove + length_Confirm;
        
        if ( length_Combined < 21 ) {
            q("#text_delete").innerText = getI18nMsg("delete");
            q("#text_save_changes").innerText = getI18nMsg("save_changes");
        } else {
            if ( length_Combined_2 < 21 ) {
                q("#text_delete").innerText = getI18nMsg("remove");
                q("#text_save_changes").innerText = getI18nMsg("save_changes");
            } else {
                if ( length_Combined_3 < 21 ) {
                    q("#text_delete").innerText = getI18nMsg("delete");
                    q("#text_save_changes").innerText = getI18nMsg("save");
                } else {
                    if ( length_Combined_4 < 21 ) {
                        q("#text_delete").innerText = getI18nMsg("remove");
                        q("#text_save_changes").innerText = getI18nMsg("save");
                    } else {
                        if ( length_Combined_5 < 21 ) {
                            q("#text_delete").innerText = getI18nMsg("delete");
                            q("#text_save_changes").innerText = getI18nMsg("confirm");
                        } else {
                           if ( length_Combined_6 < 21 ) {
                                q("#text_delete").innerText = getI18nMsg("remove");
                                q("#text_save_changes").innerText = getI18nMsg("confirm");
                           }
                        }
                    }
                }
            }
        }
    }
    editTileBtnContainerFix();
}

window.onload = function() {
    setLocalisedTopicList();
    setTimeout(function(){ fixSizes() }, animaDelay);
}

// Fix sizes for languages
var fixSizes = function() {
    
    // Get browser locale
    var browserLocale = chrome.i18n.getUILanguage();
    console.log(browserLocale);
    
    // Fix "Edit Tile Menu Btn Container"
    var editTile_ResetButton_a = document.getElementById("edit-tile-delete").getElementsByTagName("a")[0].innerText.length;
    var editTile_SubmitButton_a = document.getElementById("edit-tile-submit").getElementsByTagName("a")[0].innerText.length;
    var editTileBtnLength = editTile_ResetButton_a + editTile_SubmitButton_a;
    
    if ( editTileBtnLength > 20 ) {
        q("#edit-tile-delete").className += " btn-wide";
        q("#edit-tile-submit").className += " btn-wide";
    };
    
    // Fix "Add Tile Menu Btn Container"
    var newTile_ResetButton_a = document.getElementById("new-tile-reset").getElementsByTagName("a")[0].innerText.length;
    var newTile_SubmitButton_a = document.getElementById("new-tile-submit").getElementsByTagName("a")[0].innerText.length;
    var newTileBtnLength = newTile_ResetButton_a + newTile_SubmitButton_a;
    
    if ( newTileBtnLength > 20 ) {
        q("#new-tile-reset").className += " btn-wide";
        q("#new-tile-submit").className += " btn-wide";
    };
}
