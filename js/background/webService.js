var MNTP = MNTP || {};

MNTP.WebService = (function () {

    var SWAYY_API_KEY = "oAzaPkUSvNxy4a4B";
    var SWAYY_API_SECRET = "fa998fbbc5433c3ded156cd39d60cc68d01bc686";
    var SWAYY_API_URL = "https://api.swayy.co/v1/";

    var MNTP2_API_URL = "http://localhost:53301/api/";
    //var MNTP2_API_URL = "http://mntp2ws.azurewebsites.net/api/";

    var LAST_SYNC = "lastSyncDate";

    var _feeds = [];

    return {

        getContent: function (includeBody, url, count) {

            return new Promise(function (success, fail) {

                var feedIndex = url || "featured";

                if (!_feeds[feedIndex]) {

                    getUserId().then(function (userId) {

                        var request;

                        if (!url) {

                            var query = "?user_id=" + userId + "&count=" + (count || 20) + "&include_body=" + ((includeBody === undefined ? false : includeBody) ? "true" : "false");

                            request = sendRequest("GET", SWAYY_API_URL + "users/content" + query, null, SWAYY_API_KEY, SWAYY_API_SECRET);

                        } else {

                            if (url.indexOf("feedburner") > 0 && url.indexOf("fmt=xml") < 0) {
                                if (url.indexOf("?") > 0)
                                    url += "&fmt=xml";
                                else
                                    url += "?fmt=xml";
                            }

                            var newUrl = "";

                            for (var i = 0; i < url.length; i++) {

                                var charCode = url.charCodeAt(i);

                                if ((charCode >= 48 && charCode <= 57) || (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122))
                                    newUrl += url[i];
                                else
                                    newUrl += "&#" + charCode + ";";

                            }

                            request = sendRequest("POST", MNTP2_API_URL + userId + "/feed/", newUrl);

                        }

                        request.then(function (response) {
                            _feeds[feedIndex] = response;

                            setTimeout(function (index) {
                                _feeds[index] = null;
                            }, 60 * 2000, feedIndex);

                            success(response);
                        });

                        request.catch(function (event) {
                            console.log(event);
                            fail(event);
                        });

                    }, fail);

                } else {

                    success(_feeds[feedIndex]);

                }

            });

        },

        getContentNodes: function (includeBody, url, count) {

            return new Promise(function (success, fail) {

                var request = MNTP.WebService.getContent(includeBody, url, count)

                request.then(function (feeds) {

                    var ul = document.createElement("ul");

                    if (feeds.items && feeds.items.results) {

                        for (var i = 0; i < feeds.items.results.length; i++) {

                            var feed = feeds.items.results[i];

                            var li = document.createElement("li");
                            var divImage = document.createElement("div");
                            var divItem = document.createElement("div");
                            var h4 = document.createElement("h4");
                            var divContent = document.createElement("div");

                            li.attributes["data-url"] = feed.url;
                            
                            divItem.classList.add("item");

                            if (feed.images && feed.images.thumbnail &&  feed.images.thumbnail.url) {
                                divImage.classList.add("image");
                                divImage.style.backgroundImage = "url('" + feed.images.thumbnail.url + "')";
                            } else {
                                divImage.classList.add("no-image");
                            }

                            h4.innerHTML = feed.title;
                            divContent.innerHTML = feed.body || "";
                            divContent.classList.add("item-description");

                            divItem.insertBefore(h4, null);
                            divItem.insertBefore(divContent, null);

                            li.insertBefore(divImage, null);
                            li.insertBefore(divItem, null);

                            ul.insertBefore(li, null);

                        }
                    }

                    success(ul);

                });

                request.catch(fail);

            });


        },

        sendSwayyEvent: function (items) {

            return new Promise(function (success, fail) {

                getUserId().then(function (userId) {

                    var itemList = [];

                    if (items instanceof Array)
                        itemList = items;
                    else
                        itemList.push(items);

                    var data = [];

                    for (var i = 0; i < itemList.length; i++) {

                        var item = itemList[i];

                        data.push({
                            user_id: userId,
                            url: item.url,
                            action: item.action || "click"
                        });

                    }

                    if (data.length > 1)
                        sendRequest("POST", SWAYY_API_URL + "users/events/bulk", data, SWAYY_API_KEY, SWAYY_API_SECRET).then(success, fail);
                    else if (data.length == 1)
                        sendRequest("POST", SWAYY_API_URL + "users/events", data[0], SWAYY_API_KEY, SWAYY_API_SECRET).then(success, fail);

                }, fail);

            });

        },

        save: function (collection, documents) {

            return new Promise(function (success, fail) {

                getUserId().then(function (userId) {

                    var url = MNTP2_API_URL + userId + "/" + collection.toLowerCase();

                    sendRequest("POST", url, documents).then(function (data) {

                        JSONLocalStorage.setItem(LAST_SYNC, data.syncDate);

                        success(data);

                    }, fail);

                }, fail);

            });

        },

        sync: function () {

            return new Promise(function (success, fail) {

                //getUserId().then(function (userId) {

                //    var url = MNTP2_API_URL + userId + "/sync";

                //    var data = {};

                //    data.lastSyncDate = JSONLocalStorage.getItem(LAST_SYNC);

                //    sendRequest("POST", url, data).then(function (data) {

                //        JSONLocalStorage.setItem(LAST_SYNC, data.syncDate);

                //        if (data.groups)
                //            MNTP.IDB.saveBatch(MNTP.IDB.OS.Group, data.groups);

                //        if (data.tiles)
                //            MNTP.IDB.saveBatch(MNTP.IDB.OS.Tile, data.tiles);

                //        if (data.images)
                //            MNTP.IDB.saveBatch(MNTP.IDB.OS.Image, data.images);

                //        if (data.config)
                //            MNTP.Config.replace(data.config);

                //    }, fail);

                //}, fail);

            });


        }

    }


})();