function e(elementId) {
    return document.getElementById(elementId);
};

/**
 * Retriives locale values from locale files
 */

function setLocalisedTopicList() {
    var getI18nMsg = chrome.i18n.getMessage;
    
    // Nav main menu
    e("text_add_new_tile").innerText = getI18nMsg("add_new_tile");
    e("text_show_hide_sections").innerText = getI18nMsg("show_hide_sections");
    e("text_show_apps").innerText = getI18nMsg("show_apps");
    e("text_show_bookmarks_bar").innerText = getI18nMsg("show_bookmarks_bar");
    e("text_show_recently_closed_tabs").innerText = getI18nMsg("show_recently_closed_tabs");
    e("text_settings").innerText = getI18nMsg("settings");
    e("text_help").innerText = getI18nMsg("help");
    e("text_donate").innerText = getI18nMsg("donate");
    
    // Add new tile menu
    e("text_add_new_tile_2").innerText = getI18nMsg("add_new_tile");
    e("text_site_url").innerText = getI18nMsg("site_url");
    e("text_site_name").innerText = getI18nMsg("site_name");
    e("text_site_rss").innerText = getI18nMsg("site_rss");
    e("text_customise_tile_color").innerText = getI18nMsg("customise_tile_color");
    e("text_tile_color").innerText = getI18nMsg("tile_color");
    e("text_font_color").innerText = getI18nMsg("font_color");
    e("text_tile_image").innerText = getI18nMsg("tile_image");
    e("text_select_from_our_database").innerText = getI18nMsg("select_from_our_database");
    e("text_select").innerText = getI18nMsg("select");
    e("text_add_from_url").innerText = getI18nMsg("add_from_url");
    e("text_add_url").innerText = getI18nMsg("add_url");
    e("text_add_url_2").innerText = getI18nMsg("add_url");
    e("text_upload_from_computer").innerText = getI18nMsg("upload_from_computer");
    e("text_upload").innerText = getI18nMsg("upload");
    e("text_remove_image").innerText = getI18nMsg("remove_image");
    e("text_remove").innerText = getI18nMsg("remove");
    e("text_reset").innerText = getI18nMsg("reset");    
    e("text_add_new_tile_3").innerText = getI18nMsg("add_new_tile");
    
    // Settings menu
    e("text_settings_2").innerText = getI18nMsg("settings");
    e("text_customise_tiles").innerText = getI18nMsg("customise_tiles");
    e("text_customise_theme").innerText = getI18nMsg("customise_theme");
//    e("text_customise_rss_feed").innerText = getI18nMsg("customise_rss_feed");
//    e("text_profile_settings").innerText = getI18nMsg("profile_settings");
//    e("text_change_language").innerText = getI18nMsg("change_language");
    e("text_backup_restore_settings").innerText = getI18nMsg("backup_restore_settings");
    e("text_report_a_bug").innerText = getI18nMsg("report_a_bug");
    e("text_changelog").innerText = getI18nMsg("changelog");
    
    // Customise tiles menu
    e("text_customise_tiles_2").innerText = getI18nMsg("customise_tiles");
    e("text_show_tile_animation_on_load").innerText = getI18nMsg("show_tile_animation_on_load");
    e("text_default_tile_color").innerText = getI18nMsg("default_tile_color");
    e("text_background_color").innerText = getI18nMsg("background_color");
    e("text_text_color").innerText = getI18nMsg("text_color");
    e("text_tile_positioning").innerText = getI18nMsg("tile_positioning");
    e("text_tile_layout").innerText = getI18nMsg("tile_layout");
    e("text_grid").innerText = getI18nMsg("grid");
    e("text_free").innerText = getI18nMsg("free");
    e("text_number_of_rows").innerText = getI18nMsg("number_of_rows");
    e("text_number_of_columns").innerText = getI18nMsg("number_of_columns");
    e("text_horizontal_align").innerText = getI18nMsg("horizontal_align");
    e("text_left").innerText = getI18nMsg("left");
    e("text_centre").innerText = getI18nMsg("centre");
    e("text_right").innerText = getI18nMsg("right");
    e("text_vertical_align").innerText = getI18nMsg("vertical_align");
    e("text_top").innerText = getI18nMsg("top");
    e("text_centre_2").innerText = getI18nMsg("centre");
    e("text_bottom").innerText = getI18nMsg("bottom");
    e("text_tile_flow_direction").innerText = getI18nMsg("tile_flow_direction");
    e("text_top_to_bottom").innerText = getI18nMsg("top_to_bottom");
    e("text_left_to_right").innerText = getI18nMsg("left_to_right");
    e("text_reset_to_default").innerText = getI18nMsg("reset_to_default");
    
    // Customise theme menu
    e("text_customise_theme_2").innerText = getI18nMsg("customise_theme");
    e("text_background_color_2").innerText = getI18nMsg("background_color");
    e("text_choose_background_image").innerText = getI18nMsg("choose_background_image");
    e("text_get_from_wikimedia_commons").innerText = getI18nMsg("get_from_wikimedia_commons");
    e("text_select_2").innerText = getI18nMsg("select");
    e("text_add_from_url_2").innerText = getI18nMsg("add_from_url");
    e("text_add_url_3").innerText = getI18nMsg("add_url");
//    e("text_add_url_4").innerText = getI18nMsg("add_url");
    e("text_upload_from_computer_2").innerText = getI18nMsg("upload_from_computer");
    e("text_upload_2").innerText = getI18nMsg("upload");
    e("text_remove_image_2").innerText = getI18nMsg("remove_image");
    e("text_remove_2").innerText = getI18nMsg("remove");
    e("text_reset_to_default_2").innerText = getI18nMsg("reset_to_default");
    
    // Customise RSS feed menu
    
    // Backup / Restore menu
    e("text_backup_restore_settings_2").innerText = getI18nMsg("backup_restore_settings");
    e("text_import_settings").innerText = getI18nMsg("import_settings");
    e("text_import").innerText = getI18nMsg("import");
    e("text_export_settings").innerText = getI18nMsg("export_settings");
    e("text_export").innerText = getI18nMsg("export");
    e("text_reset_settings").innerText = getI18nMsg("reset_settings");
    e("text_reset_2").innerText = getI18nMsg("reset");
    
    // Edit tile menu
    e("text_edit_tile").innerText = getI18nMsg("edit_tile");
    e("text_make_tile_bigger").innerText = getI18nMsg("make_tile_bigger");
    e("text_make_tile_smaller").innerText = getI18nMsg("make_tile_smaller");
    e("text_edit_tile_info").innerText = getI18nMsg("edit_tile_info");
    e("text_customise_tile_color_2").innerText = getI18nMsg("customise_tile_color");
    e("text_edit_tile_image").innerText = getI18nMsg("edit_tile_image");
    
    e("text_edit_tile_info_2").innerText = getI18nMsg("edit_tile_info");
    e("text_site_url_2").innerText = getI18nMsg("site_url");
    e("text_site_name_2").innerText = getI18nMsg("site_name");
    e("text_site_rss_2").innerText = getI18nMsg("site_rss");
    
    e("text_customise_tile_color_3").innerText = getI18nMsg("customise_tile_color");
    e("text_tile_color_2").innerText = getI18nMsg("tile_color");
    e("text_font_color_2").innerText = getI18nMsg("font_color");
    
    e("text_edit_tile_image_2").innerText = getI18nMsg("edit_tile_image");
    e("text_select_from_our_database_2").innerText = getI18nMsg("select_from_our_database");
    e("text_select_3").innerText = getI18nMsg("select");
    e("text_add_from_url_3").innerText = getI18nMsg("add_from_url");
    e("text_add_url_5").innerText = getI18nMsg("add_url");
    e("text_add_url_6").innerText = getI18nMsg("add_url");
    e("text_upload_from_computer_3").innerText = getI18nMsg("upload_from_computer");
    e("text_upload_3").innerText = getI18nMsg("upload");
    e("text_remove_image_3").innerText = getI18nMsg("remove_image");
    e("text_remove_3").innerText = getI18nMsg("remove");
    
    e("text_delete").innerText = getI18nMsg("delete");
    e("text_save_changes").innerText = getI18nMsg("save_changes");
}

window.onload = function() {
    setLocalisedTopicList();
}