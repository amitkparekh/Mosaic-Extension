/// <reference path="util.js" />
/// <reference path="idb.js" />

var TileGroup = function () {

}

TileGroup.save = function (tileGroup) {

    return new Promise(function (success, fail) {

        var request = MNTP.IDB.save(MNTP.IDB.OS.Group, tileGroup);

        request.then(success, fail);

    });

};

TileGroup.remove = function (id) {

    return new Promise(function (success, fail) {

        MNTP.IDB.remove(MNTP.IDB.OS.Group, id).then(success, fail);
    });
};

TileGroup.get = function (id) {

    return new Promise(function (success, fail) {

        var request = MNTP.IDB.get(MNTP.IDB.OS.Group, id);

        request.then(success, fail);

    });

};

TileGroup.select = function() {
	return new Promise(function (success, fail) {

	    var request = MNTP.IDB.select(MNTP.IDB.OS.Group);

		request.then(success, fail);

	});
};

TileGroup.getNode = function (tileGroup) {

    //tile-group
    var groupNode = document.createElement("div");
    groupNode.addClass("tile-group");
    groupNode.data("id", tileGroup.id);

    //title
    if (tileGroup.name) {
        var h2 = document.createElement("h2");
        h2.innerHTML = tileGroup.name;

        groupNode.insertBefore(h2, null);
    }

    return groupNode;

};