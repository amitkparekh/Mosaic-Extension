/// <reference path="util.js" />
/// <reference path="idb.js" />

var _Image = Image;

var Image = function () {
    return new _Image();
}

Image.Type = {};
Image.Type.Tile = "Tile";
Image.Type.Background = "Background";
Image.Type.TileBackground = "TileBackground";
Image.Type.BingBackground = "BingBackground";

Image.save = function (image) {

    return new Promise(function (success, fail) {

        MNTP.IDB.save(MNTP.IDB.OS.Image, image).then(success, fail);

    });

};

Image.get = function (type, id) {

    return new Promise(function (success, fail) {

        id = id || 1;

        setTimeout(function () {
            MNTP.IDB.get(MNTP.IDB.OS.Image, [type, id]).then(success, fail);
        });

    });

};

Image.select = function () {

    return new Promise(function (success, fail) {

        var request;

        request = MNTP.IDB.select(MNTP.IDB.OS.Image);

        request.then(success, fail);

    });

};

Image.remove = function (type, id) {

    return new Promise(function (success, fail) {

        id = id || 1;

        var request = MNTP.IDB.remove(MNTP.IDB.OS.Image, [type, id]);

        request.then(success, fail);

    });

};

Image.getObjectURL = function (type, id) {

    return new Promise(function (success, fail) {

        id = id || 1;

        MNTP.IDB.get(MNTP.IDB.OS.Image, [type, id]).then(function (image) {
            var objectUrl = image && dataURLtoObjectURL(image.data);

            success(objectUrl);
        })
		.catch(fail);

    });

};