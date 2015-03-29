/// <reference path="config.js" />

var MNTP = MNTP || {};

(function () {
    MNTP.IDB = {};

    MNTP.IDB.proccessQueue = [];
    MNTP.IDB.firstLoad = false;

    MNTP.IDB.process = function (callback) {
        if (MNTP.IDB.indexedDB && !MNTP.IDB.firstLoad)
            callback();
        else
            MNTP.IDB.proccessQueue.push(callback);
    };

    MNTP.IDB.version = 3;
    MNTP.IDB.OS = {
        Group: { objectStoreName: "Group" },
        Tile: { objectStoreName: "Tile", index: ["idGroup", "order"] },
        Image: { objectStoreName: "Image", keyPath: ["type", "id"], index: ["type"], autoIncrement: false },
        Feed: { objectStoreName: "Feed" }
    };


    (function () {

        if (window.indexedDB) {
            var shortName = 'MNTP2';

            var request = indexedDB.open(shortName, MNTP.IDB.version);

            request.onupgradeneeded = function (event) {
                console && console.log("Upgrading IdexedDB.");
                console && console.log(event);

                var db = event.target.result;

                if (event.oldVersion < MNTP.IDB.version) {

                    //Remove as object stores que não estão no "MNTP.IDB.OS"
                    var objectStoreNames = db.objectStoreNames;
                    for (var i = 0; i < objectStoreNames.length; i++) {

                        var deletar = true;

                        for (var o in MNTP.IDB.OS) {
                            if (MNTP.IDB.OS[o].objectStoreName == objectStoreNames[i]) {
                                deletar = false;
                            }
                        }

                        if (deletar) {
                            db.deleteObjectStore(objectStoreNames[i])
                        }
                    }

                    //Remove os indexes que não estão no "MNTP.IDB.OS"
                    for (var i = 0; i < db.objectStoreNames.length; i++) {

                        var objectStore = event.target.transaction.objectStore(db.objectStoreNames[i]);

                        var deletar = true;

                        var indexNames = objectStore.indexNames;

                        for (var x = 0; x < indexNames.length; x++) {

                            var os = MNTP.IDB.OS[db.objectStoreNames[i]];
                            if (!os.index || os.index.indexOf(indexNames[x]) == -1)
                                objectStore.deleteIndex(indexNames[x]);

                        }
                    }

                    //Cria as object stores e indexes de acordo com o "MNTP.IDB.OS"
                    for (var o in MNTP.IDB.OS) {

                        var os = MNTP.IDB.OS[o];
                        var objectStoreName = MNTP.IDB.OS[o].objectStoreName;

                        //Cria a Object Store se não tem no banco ainda
                        if (!db.objectStoreNames.contains(objectStoreName)) {

                            //cria a object store
                            var objectStore = db.createObjectStore(objectStoreName, {
                                keyPath: os.keyPath || "id",
                                autoIncrement: (os.autoIncrement === undefined ? true : os.autoIncrement)
                            });

                            //cria os indexes
                            if (os.index) {
                                for (var i = 0; i < os.index.length; i++) {
                                    var keys = os.index[i].split(", ");
                                    keys = keys.length == 1 ? keys[0] : keys;
                                    objectStore.createIndex(os.index[i], keys, { unique: false });
                                }
                            }

                        }
                            //Se já tiver, verifica se tem todos os indexes
                        else if (os.index) {
                            var objectStore = event.target.transaction.objectStore(objectStoreName);

                            for (var i = 0; i < os.index.length; i++) {
                                if (!objectStore.indexNames.contains(os.index[i])) {
                                    var keys = os.index[i].split(", ");
                                    keys = keys.length == 1 ? keys[0] : keys;
                                    objectStore.createIndex(os.index[i], keys, { unique: false });
                                }
                            }
                        }
                    }

                    if (event.oldVersion == 0) {
                        MNTP.IDB.firstLoad = true;
                    }

                    console && console.log("IdexedDB upgraded to version " + MNTP.IDB.version + ".");

                }

            };

            request.onsuccess = function (event) {

                MNTP.IDB.firstLoad && console && console.log("IndexedDB opended for the first time");

                MNTP.IDB.indexedDB = request.result;

                var executeQueue = function () {

                    for (var i = 0; i < MNTP.IDB.proccessQueue.length; i++) {
                        MNTP.IDB.proccessQueue[i].call();
                    };

                }

                if (MNTP.IDB.firstLoad)
                    MNTP.IDB.loadDefaultData().then(executeQueue);
                else
                    executeQueue();

            };

            request.onerror = function (event) {
                console && console.log("IndexedDB error: ");
                console && console.log(event);
            };
        }

    })();


    MNTP.IDB.select = function (os, index, keyRange) {
        return new Promise(function (success, error) {
            MNTP.IDB.process(function () {
                var objectStore = MNTP.IDB.indexedDB.transaction(os.objectStoreName).objectStore(os.objectStoreName);

                var itens = [];

                var cursorRequest;

                if (index)
                    cursorRequest = objectStore.index(index).openCursor(keyRange || null);
                else
                    cursorRequest = objectStore.openCursor(keyRange || null);

                cursorRequest.onsuccess = function (event) {
                    var cursor = event.target.result;
                    if (cursor) {
                        itens.push(cursor.value);
                        cursor.continue();
                    } else
                        success(itens);
                };

                cursorRequest.onerror = error || MNTP.IDB.genericErrorHandler;
            });
        });
    };

    MNTP.IDB.get = function (os, key) {
        return new Promise(function (success, error) {
            MNTP.IDB.process(function () {
                var objectStore = MNTP.IDB.indexedDB.transaction(os.objectStoreName).objectStore(os.objectStoreName);

                var getRequest = objectStore.get(key);

                getRequest.onsuccess = function (event) {
                    success(event.target.result);
                }

                getRequest.onerror = error || MNTP.IDB.genericErrorHandler;
            });
        });
    };

    MNTP.IDB.save = function (os, obj, noSync) {
        return new Promise(function (success, error) {
            MNTP.IDB.process(function () {
                obj = obj || os;

                var objectStore = MNTP.IDB.indexedDB.transaction(os.objectStoreName, "readwrite").objectStore(os.objectStoreName);

                var request;
                var keyPath = objectStore.keyPath;

                var update = true;

                if (keyPath instanceof DOMStringList) {
                    for (var i = 0; i < keyPath.length; i++) {
                        if (keyPath[i] === undefined) {
                            update = false;
                            break;
                        }
                    }
                } else if (obj[keyPath] === undefined) {
                    update = false;
                }

                if (update)
                    request = objectStore.put(obj); //update
                else
                    request = objectStore.add(obj); //new

                request.onerror = error || MNTP.IDB.genericErrorHandler;

                request.onsuccess = function (event) {

                    //send data to the sync web service
                    if (MNTP.WebService && !noSync)
                        MNTP.WebService.save(os.objectStoreName, obj);
                    //<--

                    if (success)
                        success(event);
                    else
                        MNTP.IDB.genericSuccessHandler(event);

                };

            });
        });
    };

    MNTP.IDB.saveBatch = function (os, objs, noSync) {
        return new Promise(function (success, error) {

            if (MNTP.IDB.indexedDB) {

                var saveCount = 0;

                for (var i = 0; i < objs.length; i++) {

                    var obj = objs[i];

                    var objectStore = MNTP.IDB.indexedDB.transaction(os.objectStoreName, "readwrite").objectStore(os.objectStoreName);

                    var request;
                    var keyPath = objectStore.keyPath;

                    var update = true;

                    if (keyPath instanceof DOMStringList) {
                        for (var x = 0; x < keyPath.length; x++) {
                            if (keyPath[x] === undefined) {
                                update = false;
                                break;
                            }
                        }
                    } else if (obj[keyPath] === undefined) {
                        update = false;
                    }

                    if (update)
                        request = objectStore.put(obj); //update
                    else
                        request = objectStore.add(obj); //new

                    request.onerror = error || MNTP.IDB.genericErrorHandler;

                    request.onsuccess = function (event) {

                        saveCount++;

                        if (saveCount >= objs.length)
                            success && success();

                    }

                }

                //send data to the sync web service
                if (MNTP.WebService && !noSync)
                    MNTP.WebService.save(os.objectStoreName, objs);
                //<--

            } else {

                error && error("IndexedDB not initialized.");

            }

        });
    };

    MNTP.IDB.remove = function (os, key) {
        return new Promise(function (success, error) {
            MNTP.IDB.process(function () {
                if (key) {
                    var objectStore = MNTP.IDB.indexedDB.transaction(os.objectStoreName, "readwrite").objectStore(os.objectStoreName);

                    var request = objectStore.delete(key);

                    request.onsuccess = success || MNTP.IDB.genericSuccessHandler;
                    request.onerror = error || MNTP.IDB.genericErrorHandler;
                }
            });
        });
    }

    MNTP.IDB.removeAll = function (os) {
        return new Promise(function (success, error) {
            MNTP.IDB.process(function () {
                var objectStore = MNTP.IDB.indexedDB.transaction(os.objectStoreName, "readwrite").objectStore(os.objectStoreName);

                var cursorRequest = objectStore.openCursor();

                cursorRequest.onsuccess = function (event) {
                    var cursor = event.target.result;
                    if (cursor) {
                        cursor.delete();
                        cursor.continue();
                    } else
                        success && success();
                };

                cursorRequest.onerror = error || MNTP.IDB.genericErrorHandler;
            });
        });
    };

    MNTP.IDB.sync = function () {

    }

    MNTP.IDB.loadDefaultData = function () {

        return new Promise(function (success, fail) {

            sendRequest("GET", chrome.extension.getURL("/js/defaultdata.json")).then(function (data) {

                MNTP.IDB.saveBatch(MNTP.IDB.OS.Group, data.Group)
                    .then(function () {
                        return MNTP.IDB.saveBatch(MNTP.IDB.OS.Tile, data.Tile);
                    })
                    .then(function () {
                        return MNTP.IDB.saveBatch(MNTP.IDB.OS.Image, data.Image);
                    })
                    .then(function () {
                        MNTP.IDB.firstLoad = false;
                        success();
                    });

            });

        });

    }

    MNTP.IDB.importData = function (data) {

        return new Promise(function (success, fail) {

            var newTiles = [];
            var newImages = [];
            var newFeeds = [];

            if (data.tiles) {

                for (var i = 0; i < data.tiles.length; i++) {

                    var tile = data.tiles[i];

                    var newTile = {};

                    newTile.id = tile.Id;
                    newTile.size = tile.Tamanho;
                    newTile.url = tile.Url;
                    newTile.name = tile.Nome;
                    newTile.accentColor = tile.Cor ? false : true;
                    newTile.backgroundColor = tile.Cor;
                    newTile.hasImage = tile.Imagem ? true : false;
                    newTile.idGroup = 1;
                    newTile.order = i + 1;

                    newTiles.push(newTile);

                    var newImage = {};

                    newImage.data = tile.Imagem;
                    newImage.type = "Tile";
                    newImage.id = tile.Id;

                    newImages.push(newImage);

                    var newFeed = {};

                    newFeed.idTile = tile.Id;
                    newFeed.name = tile.Nome;
                    newFeed.url = tile.RssUrl;

                    newFeeds.push(newFeed);

                }

            }

            if (data.backgroundImage) {

                var newImage = {};

                newImage.data = data.backgroundImage;
                newImage.type = "Background";
                newImage.id = 1;

                newImages.push(newImage);

                MNTP.Config.NoBackgroundImage = false;
                MNTP.Config.BingBackgroundImage = false;
                MNTP.Config.HasBackgroundImage = true;

            }

            MNTP.Config.OpeningAnimation = data.animacaoInicialTiles == "1";

            if (data.background) {

                MNTP.Config.BackgroundAdjust = data.background.Adjust;
                MNTP.Config.BackgroundFill = data.background.Fill;
                MNTP.Config.BackgroundNoRepeat = data.background.NoRepeat;

                if (data.background.Opacity)
                    MNTP.Config.BackgroundOpacity = parseFloat(data.background.Opacity);

            }

            if (data.temaPadrao) {

                MNTP.Config.BackgroundColor = data.temaPadrao.corPrimaria;
                MNTP.Config.AccentColor = data.temaPadrao.corSecundaria;

            }

            MNTP.IDB.removeAll(MNTP.IDB.OS.Tile);
            MNTP.IDB.removeAll(MNTP.IDB.OS.Image);

            MNTP.IDB.saveBatch(MNTP.IDB.OS.Tile, newTiles)
                .then(function () {
                    return MNTP.IDB.saveBatch(MNTP.IDB.OS.Image, newImages);
                })
                .then(function () {
                    return MNTP.IDB.saveBatch(MNTP.IDB.OS.Feed, newFeeds);
                })
                .then(function () {
                    success();
                })
                .catch(fail);

        });

    }

    MNTP.IDB.genericErrorHandler = function (event) {
        console && console.log("IndexedDB error: ");
        console && console.log(event);
    };

    MNTP.IDB.genericSuccessHandler = function (event) {
        console && console.log("IndexedDB success: ");
        console && console.log(event);
    };

})();