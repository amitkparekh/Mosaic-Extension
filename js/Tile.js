/// <reference path="util.js" />
/// <reference path="idb.js" />
/// <reference path="swayy.js" />
/// <reference path="config.js" />
/// <reference path="Image.js" />
/// <reference path="TileGroup.js" />

var Tile = {}

Tile.save = function (tile) {

    return new Promise(function (success, fail) {

        var checkGroupAndOrder = function (success, fail) {

            return new Promise(function (success, fail) {
                if (!tile.idGroup || tile.order === undefined) {

                    Tile.select(true).then(function (tiles) {
                        if (tiles.length > 0) {

                            var lastTile = tiles[tiles.length - 1];

                            tile.idGroup = tile.idGroup || lastTile.idGroup;
                            tile.order = tile.order || lastTile.order + 1;

                            success();

                        } else {

                            tile.order = 1;

                            TileGroup.select().then(function (groups) {
                                if (groups.length == 0) {

                                    TileGroup.save({}).then(function (event) {
                                        tile.idGroup = event.target.result;
                                        success();
                                    });

                                } else {

                                    tile.idGroup = groups[groups.length - 1].id;
                                    success();
                                }

                            });
                        }
                    });

                } else {
                    success();
                }
            });

        }

        var checkImage = function () {

            return new Promise(function (success, fail) {

                if (tile.image && tile.image.data) {

                    getDataUrlFromFile(tile.image.data).then(function (dataURL) {
                        tile.image.data = dataURL;
                        success();
                    }, fail);

                } else if (tile.image && tile.image.url) {

                    getDataUrlFromUrl(tile.image.url).then(function (result) {
                        tile.image.data = result.dataURL;
                        success();
                    }, fail);

                } else {
                    success();
                }

            });

        }

        var save = function () {
            return new Promise(function (success, fail) {

                var image;

                if (tile.removeImage) {

                    Image.remove(Image.Type.Tile, tile.id);
                    tile.hasImage = false;
                    delete tile.image;

                } else if (tile.image) {

                    image = tile.image;
                    tile.hasImage = true;
                    delete tile.image;

                }

                //**
                tile.idGroup = 1;

                if (tile.id == 0) {
                    delete tile.id;
                }

                MNTP.IDB.save(MNTP.IDB.OS.Tile, tile).then(function (event) {
                    //send swayy data -->
                    if (!tile.id && MNTP.WebService)
                        MNTP.WebService.sendSwayyEvent({ url: tile.url, action: "bookmark" });
                    //<--

                    tile.id = event.target.result;

                    if (image && image.data) {

                        image.type = Image.Type.Tile;
                        image.id = tile.id;
                        image.siteurl = tile.url;
                        Image.save(image).then(success, fail);

                    } else {
                        success();
                    }

                }).catch(fail);

            });
        }

        checkGroupAndOrder().
			then(checkImage).
			then(save).
			then(success, fail);

    });

};

Tile.saveBatch = function (tiles) {

    return new Promise(function (success, fail) {

        MNTP.IDB.saveBatch(MNTP.IDB.OS.Tile, tiles).then(success, fail);

    });

}

Tile.remove = function (id) {

    return new Promise(function (success, fail) {

        Tile.get(id).then(function (tile) {

            if (tile) {

                MNTP.IDB.remove(MNTP.IDB.OS.Tile, tile.id).then(function () {

                    //remove tile image too
                    Image.remove(Image.Type.Tile, tile.id);

                    //send swayy data -->
                    if (MNTP.WebService)
                        MNTP.WebService.sendSwayyEvent({ url: tile.url, action: "remove" });
                    //<--

                    success();

                }, fail);


            }

        });
    });
};

Tile.get = function (id) {

    return new Promise(function (success, fail) {

        var request = MNTP.IDB.get(MNTP.IDB.OS.Tile, id);

        request.then(success, fail);

    });

};

Tile.select = function (ordered) {

    return new Promise(function (success, fail) {

        var request;

        if (ordered)
            request = MNTP.IDB.select(MNTP.IDB.OS.Tile, "order");
        else
            request = MNTP.IDB.select(MNTP.IDB.OS.Tile);

        request.then(success, fail);

    });

};

Tile.getNode = function (tile, preview) {

    //tile
    var tileNode = document.createElement("div");
    tileNode.data("id", tile.id);
    tileNode.data("size", tile.size || 2);
    tileNode.data("position", tile.position);

    tileNode.addClass("tile");

    preview && tileNode.addClass("preview");
    tile.hasFeed && tileNode.addClass("hasFeed");

    tileNode.addClass("size" + tile.size);

    if (tile.fontColor && !tile.accentColor)
        tileNode.style.color = tile.fontColor;
    else
        tileNode.style.color = MNTP.Config.TileFontColor;

    if (tile.url && !preview) {
        tileNode.addEventListener("click", function (event) {
            navigate(tile.url, event);
        });
    }

    if (!preview) {

        if (tile.size == 1) {
            tileNode.style.width = MNTP.Config.TileWidthSm + "px";
            tileNode.style.height = MNTP.Config.TileHeightSm + "px";
        } else if (tile.size == 2) {
            tileNode.style.width = MNTP.Config.TileWidthLg + "px";
            tileNode.style.height = MNTP.Config.TileHeightSm + "px";
        } else if (tile.size == 3) {
            tileNode.style.width = MNTP.Config.TileWidthLg + "px";
            tileNode.style.height = MNTP.Config.TileHeightLg + "px";
        }

    }

    //tile > background
    var tileBackgroundNode = document.createElement("div");

    tileBackgroundNode.addClass("tile-background");

    if (tile.accentColor) {

        tileBackgroundNode.addClass("accentbg");

        tileBackgroundNode.style.backgroundColor = MNTP.Config.AccentColor;

    } else if (tile.backgroundColor) {

        tileBackgroundNode.style.backgroundColor = tile.backgroundColor;

    }

    tileNode.insertBefore(tileBackgroundNode, null);

    //tile > tile-content
    var tileContentNode = document.createElement("div");

    tileContentNode.addClass("tile-content");

    //if (tile.feed)
    if (tile.rss)
        tileContentNode.addClass("lg");
    else
        tileContentNode.addClass("sm");

    tileNode.insertBefore(tileContentNode, null);

    //tile > tile-content > logo
    var logoNode = document.createElement("div");

    logoNode.addClass("logo");

    tileContentNode.insertBefore(logoNode, null);

    //tile > tile-content > cell 1 > image
    if (tile.hasImage && !tile.removeImage) {

        new Promise(function (success, fail) {

            if (tile.image && tile.image.data) {

                getDataUrlFromFile(tile.image.data).then(function (dataURL) {
                    tile.image.data = dataURL;
                    success(tile.image);
                }, fail);

            } else if (tile.image && tile.image.url) {

                getDataUrlFromUrl(tile.image.url).then(function (result) {
                    tile.image.data = result.dataURL;
                    success(tile.image);
                });

            } else if (tile.id > 0) {

                Image.get(Image.Type.Tile, tile.id).then(function (obj) {
                    var image = tile.image || obj;
                    image.data = obj.data;
                    success(image);
                }, fail);

            }

        }).then(function (image) {

            var tileImageNode = document.createElement("img");
            tileImageNode.src = dataURLtoObjectURL(image.data);

            if (tile.imageWidth && tile.imageWidth.value && tile.imageWidth.unit)
                tileImageNode.style.width = tile.imageWidth.value + tile.imageWidth.unit;
            else if (image.width && image.width.value && image.width.unit)
                tileImageNode.style.width = image.width.value + image.width.unit;

            if (tile.imageHeight && tile.imageHeight.value && tile.imageHeight.unit)
                tileImageNode.style.height = tile.imageHeight.value + tile.imageHeight.unit;
            else if (image.height && image.height.value && image.height.unit)
                tileImageNode.style.height = image.height.value + image.height.unit;

            tileImageNode.addEventListener("load", function () {
                URL.revokeObjectURL(this.src);
            });

            logoNode.insertBefore(tileImageNode, null);

        });

    } else if (tile.name) {

        //tile > tile-content > cell 1 > label
        var tileLabel = document.createElement("label");
        tileLabel.innerText = tile.name;

        logoNode.insertBefore(tileLabel, null);

    }

    //tile > tile-content > feed
    if (tile.rss) {

        var feedNode = document.createElement("div");

        feedNode.addClass("feed");

        tileContentNode.insertBefore(feedNode, null);

    }

    return tileNode;

}

Tile.createNewTile = function () {

    return {
        id: 0,
        size: 2, //[1, 2, 3]
        url: 'http://',
        name: '',
        accentColor: true,
        backgroundColor: '',
        fontColor: '',
        hasImage: false,
        removeImage: false,
        opacity: 0.3,
        imageWidth: {
            value: 0,
            unit: '' //['px', '%']
        },
        imageHeight: {
            value: 0,
            unit: '' //['px', '%']
        },
        position: {
            left: 0,
            right: 0
        }
    }

}