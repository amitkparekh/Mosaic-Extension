function e(elementId) {
    return document.getElementById(elementId);
};

function setCountry() {
    var country = window.localStorage.getItem("country");
    
    // If country is not found in localstorage or default value is selected in dropdown menu
    
    if ((!country) || country == "noCountry") {
        
        // XMLHttpRequest object that tries to load the feed for the purpose of retreiving the country value out of feed.
        var req = new XMLHttpRequest();
        req.onload = handleResponse;
        req.onerror = handleError;
        req.open("GET", DEFAULT_NEWS_URL, true);
        req.send(null);
        
        // Sets country to default country
        function handleError() {
            e("countrylist").value = "noCountry";
        };
        
        // handles parsing the feed data got back from XMLHttpRequest
        function handleResponse() {
            // Feed doc retrieved from URL
            var doc = req.responseXML;
            if (!doc) {
                handleError();
                return;
            }
            var imageLink = doc.querySelector("image link");
            if (imageLink) {
                // Stores link to set value of country
                var newsUrl = imageLink.textContent;
            }
            
        }
    }
}

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
    e("text_customise_rss_feed").innerText = getI18nMsg("customise_rss_feed");
    e("text_profile_settings").innerText = getI18nMsg("profile_settings");
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
}

window.onload = function() {
    setLocalisedTopicList();
}