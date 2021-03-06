﻿/* global Promise */
/// <reference path="util.js" />
/// <reference path="background/idb.js" />

var Feed = function () {

}

Feed.save = function (feed) {

    return new Promise(function (success, fail) {

        var request = MNTP.IDB.save(MNTP.IDB.OS.Feed, feed);

        request.then(success, fail);

    });

};

Feed.remove = function (id) {

    return new Promise(function (success, fail) {

        MNTP.IDB.remove(MNTP.IDB.OS.Feed, id).then(success, fail);
    });
};

Feed.get = function (id) {

    return new Promise(function (success, fail) {

        var request = MNTP.IDB.get(MNTP.IDB.OS.Feed, id);

        request.then(success, fail);

    });

};

Feed.getByTile = function (idTile) {

    return new Promise(function (success, fail) {

        var request = MNTP.IDB.get(MNTP.IDB.OS.Feed, idTile, "idTile");

        request.then(success, fail);

    });

};

Feed.select = function () {
    return new Promise(function (success, fail) {

        var request = MNTP.IDB.select(MNTP.IDB.OS.Feed);

        request.then(success, fail);

    });
};