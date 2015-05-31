/// <reference path="util.js" />

/**
 * Retrives locale values from locale files
 */

var getI18nMsg = chrome.i18n.getMessage;

function setLocalisedTopicList() {


    q("[data-message]", true).forEach(function (element) {

        var message = getI18nMsg(element.data("message"));
        var maxLength = parseInt(element.data("message-max-length") || "0");
        var messageAlt = element.data("message-alt") && getI18nMsg(element.data("message-alt"));

        if (maxLength && messageAlt &&
            message.length > maxLength &&
            messageAlt.length < message.length) {

            element.innerText = messageAlt;

        } else {

            element.innerText = message;

        }

        !message && console.log("Missing localization string: " + element.data("message"))
        !messageAlt && element.data("message-alt") && console.log("Missing localization string: " + element.data("message-alt"))

    });

    var newTileBtnContainerFix = function () {

        var length_Reset = getI18nMsg("reset").length;
        var length_Cancel = getI18nMsg("cancel").length;
        var length_AddNewTile = getI18nMsg("add_new_tile").length;
        var length_AddTile = getI18nMsg("add_tile").length;
        var length_Combined = length_Reset + length_AddNewTile;
        var length_Combined_2 = length_Reset + length_AddTile;
        var length_Combined_3 = length_Cancel + length_AddNewTile;
        var length_Combined_4 = length_Cancel + length_AddTile;

        if (length_Combined < 21) {
            q("#text_reset").innerText = getI18nMsg("reset");
            q("#text_add_new_tile_3").innerText = getI18nMsg("add_new_tile");
        } else {
            if (length_Combined_2 < 21) {
                q("#text_reset").innerText = getI18nMsg("reset");
                q("#text_add_new_tile_3").innerText = getI18nMsg("add_tile");
            } else {
                if (length_Combined_3 < 21) {
                    q("#text_reset").innerText = getI18nMsg("cancel");
                    q("#text_add_new_tile_3").innerText = getI18nMsg("add_new_tile");
                } else {
                    if (length_Combined_4 < 21) {
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


    var editTileBtnContainerFix = function () {

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

        if (length_Combined < 21) {
            q("#text_delete").innerText = getI18nMsg("delete");
            q("#text_save_changes").innerText = getI18nMsg("save_changes");
        } else {
            if (length_Combined_2 < 21) {
                q("#text_delete").innerText = getI18nMsg("remove");
                q("#text_save_changes").innerText = getI18nMsg("save_changes");
            } else {
                if (length_Combined_3 < 21) {
                    q("#text_delete").innerText = getI18nMsg("delete");
                    q("#text_save_changes").innerText = getI18nMsg("save");
                } else {
                    if (length_Combined_4 < 21) {
                        q("#text_delete").innerText = getI18nMsg("remove");
                        q("#text_save_changes").innerText = getI18nMsg("save");
                    } else {
                        if (length_Combined_5 < 21) {
                            q("#text_delete").innerText = getI18nMsg("delete");
                            q("#text_save_changes").innerText = getI18nMsg("confirm");
                        } else {
                            if (length_Combined_6 < 21) {
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

window.onload = function () {
    setLocalisedTopicList();
    setTimeout(function () { fixSizes() }, animaDelay);
}

// Fix sizes for languages
var fixSizes = function () {

    // Get browser locale
    var browserLocale = chrome.i18n.getUILanguage();
    console.log(browserLocale);

    // Fix "Edit Tile Menu Btn Container"
    var editTile_ResetButton_a = document.getElementById("edit-tile-delete").getElementsByTagName("a")[0].innerText.length;
    var editTile_SubmitButton_a = document.getElementById("edit-tile-submit").getElementsByTagName("a")[0].innerText.length;
    var editTileBtnLength = editTile_ResetButton_a + editTile_SubmitButton_a;

    if (editTileBtnLength > 20) {
        q("#edit-tile-delete").className += " btn-wide";
        q("#edit-tile-submit").className += " btn-wide";
    };

    // Fix "Add Tile Menu Btn Container"
    var newTile_ResetButton_a = document.getElementById("new-tile-reset").getElementsByTagName("a")[0].innerText.length;
    var newTile_SubmitButton_a = document.getElementById("new-tile-submit").getElementsByTagName("a")[0].innerText.length;
    var newTileBtnLength = newTile_ResetButton_a + newTile_SubmitButton_a;

    if (newTileBtnLength > 20) {
        q("#new-tile-reset").className += " btn-wide";
        q("#new-tile-submit").className += " btn-wide";
    };
}
