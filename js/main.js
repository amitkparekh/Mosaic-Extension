/// <reference path="es6-promise-2.0.0.js" />
/// <reference path="util.js" />
/// <reference path="dragging.js" />
/// <reference path="config.js" />
/// <reference path="Tile.js" />
/// <reference path="TileGroup.js" />
/// <reference path="Image.js" />
/// <reference path="swayy.js" />
/// <reference path="Feed.js" />
/// <reference path="background/backgroundutils.js" />

var MNTP;

//(function () {

    var bingImagesSlider;

    var load = function () {

        return new Promise(function (success, fail) {

            loadBackgroundPage()
                .then(loadGroups)
                .then(loadTiles)
                .then(loadConfig)
                .then(loadFeeds)
                .then(enableDrag)
                .then(loadCustomComponents)
                .then(bindEvents)
                .then(success)
                .catch(function (error) {

                    console.error(error.stack);

                });

        });

    }

    var loadBackgroundPage = function () {

        return new Promise(function (success, fail) {

            var bgPage;

            var loadBgPage = function () {

                bgPage = chrome.extension.getBackgroundPage();

                if (bgPage &&
                    bgPage.MNTP &&
                    bgPage.MNTP.IDB &&
                    bgPage.MNTP.WebService &&
                    bgPage.MNTP.BGUtils &&
                    bgPage.MNTP.Config) {

                    MNTP = bgPage.MNTP;
                    success();

                } else
                    setTimeout(loadBgPage, 10);
            }

            if (MNTP)
                success();
            else
                loadBgPage();
        });

    }

    var loadGroups = function () {

        return new Promise(function (success, fail) {
            var request = TileGroup.select();

            request.then(function (data) {

                q("#container").innerHTML = "";

                for (var i = 0; i < data.length; i++) {

                    var group = data[i];

                    var groupNode = TileGroup.getNode(group);

                    q("#container").insertBefore(groupNode, null);

                }

                success();

            });

            request.catch(fail);

        });

    }

    var loadTiles = function () {

        return new Promise(function (success, fail) {

            var request = Tile.select(true);

            request.then(function (data) {

                for (var x = 0; x < data.length; x++) {

                    var tile = data[x];

                    var tileNode = Tile.getNode(tile);

                    var group = getGroupNodebyID(tile.idGroup);

                    if (group) {
                        group.insertBefore(tileNode, null);
                    }

                }

                success();

            });

            request.catch(fail);

        });

    };

    var resize = function (config) {

        return new Promise(function (success, fail) {

            config = config || MNTP.Config;

            var tiles1 = q(".tile.size1:not(.preview)", true);
            var tiles2 = q(".tile.size2:not(.preview)", true);
            var tiles3 = q(".tile.size3:not(.preview)", true);

            tiles1.forEach(function (element, index) {
                element.style.width = config.TileWidthSm + "px";
                element.style.height = config.TileHeightSm + "px";
            });

            tiles2.forEach(function (element, index) {
                element.style.width = config.TileWidthLg + "px";
                element.style.height = config.TileHeightSm + "px";
            });

            tiles3.forEach(function (element, index) {
                element.style.width = config.TileWidthLg + "px";
                element.style.height = config.TileHeightLg + "px";
            });

            reorder(config).then(success);

        });

    }

	var openingAnimation = true;
    var reorder = function (config) {
		
		config = config || MNTP.Config;
		
		if (config.TilePlacementMode == MNTP.Config.PLACEMENT_MODE.FLOW) 
			return reorderFlow(config);
		else
            return reorderFree(config);
    }
	
	var reorderFlow = function(config) {

        return new Promise(function (success, fail) {

            config = config || MNTP.Config;
			
			openingAnimation = openingAnimation && config.OpeningAnimation;

            var container = q("#container");
            var news = q("#news");
			var tiles = q(".tile", true);
			
            container.style.height = "100%";
			
			if (openingAnimation) {
			
				for (var i = 0; i < tiles.length; i++)
				    tiles[i].style.transition = "none";
							
				container.style.transition = "none";
			
			} else if (!config.OpeningAnimation) {
			
			    container.style.transition = "none";
				
			}

            var groupLeft = 0;

            var groups = q(".tile-group:not(.placeholder)", true);

            var group;

            var tallerGroup = 0;

            for (var g in groups) {

                group = groups[g];

                group.style.marginLeft = groupLeft + "px";

                groupLeft = config.GroupMargin;

                tiles = q(".tile:not(.dragging)", group, true);

                if (tiles) {

                    var top = 0;
                    var left = 0;

                    var collumnLeft = 0;

                    var lastSize = 2;
                    var nextSize = 0;

                    var row = 1;

                    var tile;

                    for (var i = 0; i < tiles.length; i++) {

                        tile = tiles[i];

                        var size = tile.data("size");

                        if (i < tiles.length - 1)
                            nextSize = tiles[i + 1].data("size");
                        else
                            nextSize = 0;

                        tile.style.top = top + "px";
                        tile.style.left = left + "px";


                        if (size == 1 && left == collumnLeft && nextSize == 1) {
                            left += (config.TileWidthSm + config.TileMargin);
                        } else {

                            var currentHeight = size == 3 ? config.TileHeightLg : config.TileHeightSm;
                            var nextHeight = nextSize == 3 ? config.TileHeightLg : config.TileHeightSm;

                            row += size == 3 ? 2 : 1;

                            top += currentHeight + config.TileMargin;

							if (openingAnimation)
								left = 0;
							else
								left = collumnLeft;

                            if (group.offsetHeight < top + nextHeight && i < tiles.length - 1)
                                group.style.height = (top + nextHeight) + "px";

                            if (group.offsetHeight < top + nextHeight || (row + (nextSize == 3 ? 1 : 0) > config.GroupRows && config.GroupRows > 0))
                                group.style.height = (top - config.TileMargin) + "px";

                        }

                        lastSize = size;

                        if (top > group.offsetHeight && i < tiles.length - 1) {
                            top = 0;
                            row = 1;
							
							if (openingAnimation) {
								collumnLeft = 0;
							} else {
								collumnLeft += (config.TileWidthLg + config.TileMargin);
							}
							
							left = collumnLeft;
                        }

                    }

                    group.style.width = (collumnLeft + config.TileWidthLg) + "px";

                }

                tallerGroup = Math.max(tallerGroup, group.offsetHeight);

            }

            if (tallerGroup > 0)
                container.style.height = tallerGroup + "px";


			//center verticaly
            if (config.GroupTop == -1) {
                var windowHeight = window.innerHeight;
                var containerHeight = container.offsetHeight;

                var containerTop = (windowHeight - containerHeight) / 2;

                container.style.top = containerTop + "px";
            } else {
                container.style.top = config.GroupTop + "px";
            }

            //center horizontaly
			if (!openingAnimation) {
			
				if (config.GroupLeft == -1) {
				
					var windowWidth = window.innerWidth;
					var containerWidth = container.offsetWidth;

					var containerLeft = (windowWidth - containerWidth) / 2;
					
					container.style.left = containerLeft + "px";
					
				} else {
				
					container.style.left = config.GroupLeft + "px";
					
				}
				
			} else {
				
				container.style.left = 0;
			
			}


            var containerOffset = container.getWindowOffset();
            var news = q("#news");

            q("body").style.width = (containerOffset.left + containerOffset.width + news.offsetWidth + 50) + "px";


			var tiles = q(".tile", true);

			if (openingAnimation) {
			
				openingAnimation = false;
				
				for (var i = 0; i < tiles.length; i++)
				    tiles[i].style.transition = "left " + config.OpeningAnimationTime + "ms";
							
				container.style.transition = "left " + config.OpeningAnimationTime + "ms";
				
				reorder(config).then(success);
				
			} else {
			
				for (var i = 0; i < tiles.length; i++)
				    tiles[i].style.transition = "";
							
				container.style.transition = "";
			
				success();
			}

        });

	}

	var reorderFree = function(config) {

		return new Promise(function (success, fail) {

	        config = config || MNTP.Config;

	        openingAnimation = openingAnimation && config.OpeningAnimation;

	        var container = q("#container");
	        var news = q("#news");
	        var tiles = q(".tile", true);

	        if (openingAnimation) {

	            for (var i = 0; i < tiles.length; i++)
	                tiles[i].style.transition = "none";

	        }

	        //container.style.transition = "none";

	        container.style.left = "0";
	        container.style.top = "0";
	        container.style.height = "";

			var screenCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

	        if (openingAnimation) {

	            for (var i = 0; i < tiles.length; i++) {

	                var tileNode = tiles[i];

	                tileNode.style.left = (screenCenter.x - (tileNode.offsetWidth / 2)) + "px";
	                tileNode.style.top = (screenCenter.y - (tileNode.offsetHeight / 2)) + "px";

	            }

	        } else {

	            for (var i = 0; i < tiles.length; i++) {

	                var tileNode = tiles[i];
	                var position = tileNode.data("position");

	                if (position) {

	                    tileNode.style.left = position.left + "px";
	                    tileNode.style.top = position.top + "px";

	                } else {
					
						tileNode.style.left = (screenCenter.x - (tileNode.offsetWidth / 2)) + "px";
						tileNode.style.top = (screenCenter.y - (tileNode.offsetHeight / 2)) + "px";
					
					}

	            };

	        }

	        if (openingAnimation) {

	            setTimeout(function () {

	                openingAnimation = false;

	                for (var i = 0; i < tiles.length; i++)
	                    tiles[i].style.transition = "left " + config.OpeningAnimationTime + "ms, top " + config.OpeningAnimationTime + "ms";

	                container.style.transition = "left " + config.OpeningAnimationTime + "ms, top " + config.OpeningAnimationTime + "ms";

	                reorder(config).then(success);

	            }, 10);

	        } else {

	            setTimeout(function () {
	                for (var i = 0; i < tiles.length; i++)
	                    tiles[i].style.transition = "";

	                container.style.transition = "";
	            }, config.OpeningAnimationTime);

	            success();
	        }

	    });

	}
	
    var enableDrag = function () {

        return new Promise(function (success, fail) {

            //tiles drag
            var request;
			
			if (MNTP.Config.TilePlacementMode == MNTP.Config.PLACEMENT_MODE.FLOW)
				request = q("body").enableCustomDragging(".tile:not(.placeholder)");
			else
				request = q("body").enableCustomDragging(".tile:not(.placeholder)", { translate: true });

			var placeHolderTile = null;
			var nextSibling = null;
			var dragGroup = null;

            request.dragstart(function (event) {

                q("#container").addClass("no-transition");

                event.dragElement.addClass("dragging");

                event.dragElement.style.transition = "";

                var size = event.dragElement.data("size");

                nextSibling = event.dragElement.nextElementSibling;
                dragGroup = event.dragElement.parentElement;

				if (MNTP.Config.TilePlacementMode == MNTP.Config.PLACEMENT_MODE.FLOW) {

					placeHolderTile = document.createElement("div");
					placeHolderTile.addClass("tile");
					placeHolderTile.addClass("placeholder");
					placeHolderTile.addClass("size" + size);
					placeHolderTile.style.width = (size == 1 ? MNTP.Config.TileWidthSm : MNTP.Config.TileWidthLg) + "px";
					placeHolderTile.style.height = (size == 3 ? MNTP.Config.TileHeightLg : MNTP.Config.TileHeightSm) + "px";
					placeHolderTile.data("size", size);

					event.dragElement.parentNode.insertBefore(placeHolderTile, event.dragElement);

					reorder();
					
				}

            });

            var lastTargetIndex = null;
            request.dragmove(function (event) {
				
				if (MNTP.Config.TilePlacementMode == MNTP.Config.PLACEMENT_MODE.FLOW) {
				
					if (event.toElement && event.toElement.matches(".tile")) {

						q(".tile-group.active-placeholder", true).forEach(function (element) {
							element.removeClass("active-placeholder");
							element.addClass("placeholder");
							element.removeAttribute("style");
						});

						var targetIndex = event.toElement.getIndex(".tile:not(.dragging)");

						if (targetIndex != lastTargetIndex) {

							lastTargetIndex = targetIndex;

							var dragElementIndex;

							if (placeHolderTile) {
								dragElementIndex = placeHolderTile.getIndex(".tile:not(.dragging)")

								placeHolderTile.remove();
								placeHolderTile = null;
							}

							var size = event.dragElement.data("size");

							placeHolderTile = document.createElement("div");
							placeHolderTile.addClass("tile");
							placeHolderTile.addClass("placeholder");
							placeHolderTile.addClass("size" + size);
							placeHolderTile.style.width = (size == 1 ? MNTP.Config.TileWidthSm : MNTP.Config.TileWidthLg) + "px";
							placeHolderTile.style.height = (size == 3 ? MNTP.Config.TileHeightLg : MNTP.Config.TileHeightSm) + "px";
							placeHolderTile.data("size", size);


							if (dragElementIndex > targetIndex) {
								event.toElement.parentNode.insertBefore(placeHolderTile, event.toElement);
								lastTargetIndex++;
							} else {
								event.toElement.parentNode.insertBefore(placeHolderTile, event.toElement.nextSibling);
								lastTargetIndex--;
							}

							reorder();

						}

					}
					
				}
            });

            request.dragend(function (event) {

                if (placeHolderTile) {

                    q(".tile-group.placeholder", true).forEach(function (element) {
                        element.remove();
                    });

                    q(".tile-group.active-placeholder", true).forEach(function (element) {
                        element.removeClass("active-placeholder");
                    });

                    var group = placeHolderTile.parentNode;

                    var groupOffset = group.getWindowOffset();
                    var elementOffset = event.dragElement.getWindowOffset();

                    event.dragElement.style.left = (elementOffset.left - groupOffset.left) + "px";
                    event.dragElement.style.top = (elementOffset.top - groupOffset.top) + "px";

                    event.dragElement.removeClass("dragging");

                    placeHolderTile.parentNode.insertBefore(event.dragElement, placeHolderTile);

                    placeHolderTile.remove();
                    placeHolderTile = null;

                    lastTargetIndex = null;

                } else if (dragGroup) {

                    event.dragElement.removeClass("dragging");

                    dragGroup.insertBefore(event.dragElement, nextSibling || null);

                    var dragElementOffset = event.dragElement.getWindowOffset();

                    var position = {};

                    position.left = dragElementOffset.left;
                    position.top = dragElementOffset.top;

                    event.dragElement.data("position", position);


                    nextSibling = null;
                    
                }

                reorder().then(function () {
                    q("#container").removeClass("no-transition");
                    saveTilesOrder();
                });

            });

            //resize news drag
            var news = q("#news");
            var request2 = q("body").enableCustomDragging("#news-resize", { translate: false, pixeldelay: 0 });
            var initialOffset;

            request2.dragstart(function (event) {
                initialOffset = { width: news.offsetWidth, height: news.offsetHeight };
            });

            request2.dragmove(function (event) {

                news.style.width = (initialOffset.width - event.deltaX) + "px";
                news.style.height = (initialOffset.height + (event.deltaY * 2)) + "px";

                resizeNews();
                reorder();
            });

            request2.dragend(function (event) {
                MNTP.Config.NewsWidth = news.offsetWidth;
                MNTP.Config.NewsHeight = news.offsetHeight;
            });


            //move configuration windows
            q("body").enableCustomDragging(".config", { dragInitiator: ".config .top-bar" });

            success();

        });

    }

    var bindEvents = function () {

        return new Promise(function (success, fail) {

            //close popups
            //q("#overlay").addEventListener("click", hideConfigs);

            //swith between configurations panels
            q("[data-panel-for]", true).forEach(function (element) {

                element.addEventListener("click", function () {

                    q("[data-panel]", true).forEach(function (element) {
                        element.style.display = "none";
                    });

                    q("[data-panel=" + element.data("panel-for") + "]", true).forEach(function (element) {
                        element.style.display = "block";
                    });

                    if (element.data("panel-for") == "config-sync" && !q("#iframe-dropbox").attributes["src"]) {
                        q("#iframe-dropbox").setAttribute("src", "http://localhost:63408/Dropbox/Default.aspx");
                    }

                });

            });

            //hides the loader when the iframe finishes loading
            q("#iframe-dropbox").addEventListener("load", function () {
                q("#dropbox-loader").style.display = "none";
            });

            //click on the preview tile does nothing
            q("#tile-config-preview-tile").addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();
                return false;
            });

            //avoid dragging the preview tile
            q("#tile-config-preview-tile").addEventListener("mousedown", function (event) {
                event.preventDefault();
                event.stopPropagation();
                return false;
            });

            //save tile configurations
            q("#tile-config-btn-ok").addEventListener("click", function () {
                saveTileConfig()
                    .then(function () {
                        hideConfigs();
						MNTP.Config.ReloadBackgroundImage = true;
                        load().then(saveTilesOrder);
                    })
                    .catch(function (error) {
                        console.log(error);
                        console.log(error.stack);
                    });
            });

            //cancel tile configurations
            q("#tile-config-btn-cancel").addEventListener("click", function () {
                hideConfigs();
            });

            //live update the preview tile
            q("#tile-config input, #tile-config select", true).forEach(function (element) {

                element.addEventListener(["keypress", "change"], function () {
                    setTimeout(function () {
                        loadPreviewTile();
                    }, 0);
                });

            });

            //remove tile image
            q("#tile-config-btn-removeImage").addEventListener("click", function () {

                q("input[data-property='removeImage']", "#tile-config").value = "true";
                q("input[data-property='image.data']", "#tile-config").value = ""

                loadPreviewTile();

                q("#tile-config-file-image").style.display = "";
                q("#tile-config-btn-removeImage").style.display = "none";

            });

            //right click on tiles
            q(".tile", true).forEach(function (element) {

                element.addEventListener("contextmenu", function (event) {

                    q("#options .context").style.display = "block";

                    this.toggleClass("selected");

                    var selectCount = q(".tile.selected", true).length;

                    q("#options").toggleClass("hidden", selectCount == 0);

                    q("#options-btn-edit").style.display = selectCount == 1 ? "block" : "none";

                    //this.style.borderColor = invertColor(MNTP.Config.AccentColor);

                    event.stopPropagation();
                    event.preventDefault();
                    return false;
                });

            });

            //right anywhere else shows the global options
            q("body").addEventListener("contextmenu", function (event) {

                if (event.target == q("body") || event.target.hasClass(["tile-group", "container"])) {

                    if (q(".tile.selected", true).length == 0) {

                        q("#options .context").style.display = "none";

                        q("#options").toggleClass("hidden");
                        q("#options-btn-edit").style.display = "none";

                    }
                }

                event.preventDefault();
                //return false;

            });

            //left click anywhere else closes the options popup
            q("body").addEventListener("click", function (event) {
                if (event.target == q("body") || event.target.hasClass(["tile-group", "container"])) {
                    hideOptions();
                }
            });

            //click on options button shows global options
            q("#button-options").addEventListener("click", function (event) {

                q("#options .context").style.display = "none";

                q("#options").toggleClass("hidden");
                q("#options-btn-edit").style.display = "none";

            });

            //resize tile - smaller
            q("#options-btn-resize-small").addEventListener("click", function () {

                var tiles = q(".tile.selected", true);

                for (var i = 0; i < tiles.length; i++) {

                    var tileNode = tiles[i];
                    var id = tileNode.data("id");
                    var size = tileNode.data("size");

                    if (size > 1) {
                        var newSize = size - 1;

                        tileNode.removeClass(["size1", "size2", "size3"]);
                        tileNode.addClass("size" + newSize);
                        tileNode.data("size", newSize);


                        Tile.get(id).then(function (tile) {

                            tile.size = tile.size - 1;
                            Tile.save(tile);

                        });
                    }

                }

                resize();

            });

            //resize tile - bigger
            q("#options-btn-resize-big").addEventListener("click", function () {

                var tiles = q(".tile.selected", true);

                for (var i = 0; i < tiles.length; i++) {

                    var tileNode = tiles[i];
                    var id = tileNode.data("id");
                    var size = tileNode.data("size");

                    if (size < 3) {
                        var newSize = size + 1;

                        tileNode.removeClass(["size1", "size2", "size3"]);
                        tileNode.addClass("size" + newSize);
                        tileNode.data("size", newSize);


                        Tile.get(id).then(function (tile) {

                            tile.size = tile.size + 1;
                            Tile.save(tile);

                        });
                    }

                }

                resize();

            });

            //edit tile
            q("#options-btn-edit").addEventListener("click", function () {
                var id = q(".tile.selected").data("id");
                showTileConfig(id);

                hideOptions();
            });

            //remove tiles
            q("#options-btn-remove").addEventListener("click", function () {

                var tiles = q(".tile.selected", true);

                for (var i = 0; i < tiles.length; i++) {

                    var tileNode = tiles[i];
                    var id = tileNode.data("id");

                    tileNode.remove();
                    Tile.remove(id);

                }

                reorder();

                hideOptions();

            });

            //add tile
            q("#options-btn-add-tile").addEventListener("click", function () {
                showTileConfig();
                hideOptions();
            });

            //settings
            q("#options-btn-settings").addEventListener("click", function () {
                loadConfig();
                showConfig();
                hideOptions();
            });

            //live update the configurations
            q("#config input, #config select", true).forEach(function (element) {

                element.addEventListener(["keypress", "change", "input"], function () {
                    setTimeout(function () {
                        getConfig().then(function (config) {
                            loadConfig(config);
                        });
                    }, 0);
                });

            });
			
			//reload background image only when changing the image
            q("#config input[data-reload-background]", true).forEach(function (element) {

                element.addEventListener("change", function () {
					setTimeout(function () {
						q("[data-property='ReloadBackgroundImage']").value = "true";
					}, 0);
                }, "reloadbg");

            });

			//tiles animation test
			q("#btn-speed-test").addEventListener("click", function() {
				
				openingAnimation = true;
				getConfig().then(function (config) {
					reorder(config);
				});
				
			});
				
            //save configurations changes and close popup
            q("#config-btn-ok").addEventListener("click", function () {
                saveConfig().then(hideConfigs());
            });

            //cancel configurations changes and close popup
            q("#config-btn-cancel").addEventListener("click", function () {
                hideConfigs();
                loadConfig();
            });

            //apply configurations changes
            q("#config-btn-apply").addEventListener("click", function () {
                saveConfig();
            });

            //change news view mode
            q("#news-btn-change-view").addEventListener("click", function () {

                var news = q("#news");
                news.toggleClass("list", "grid");

                MNTP.Config.NewsViewMode = news.hasClass("list") ? "list" : "grid";

                q("[data-property='NewsViewMode']", "#config").value = MNTP.Config.NewsViewMode;

                resizeNews();

            });

            //change show pictures on list mode 
            q("#news-btn-change-view-pictures").addEventListener("click", function () {

                var news = q("#news");
                news.toggleClass("hide-images");

                MNTP.Config.ShowImageNewsList = !news.hasClass("hide-images");

                q("[data-property='ShowImageNewsList']", "#config").value = (MNTP.Config.ShowImageNewsList ? "true" : "false");

            });

			//scroll through news titles
			var newsTitleScrollAnimation;
			q("#news-titles").addEventListener("mousewheel", function (e) {
				
				newsTitleScrollAnimation && clearInterval(newsTitleScrollAnimation);
				newsTitleScrollAnimation = null;
				
				this.scrollLeft -= e.wheelDeltaY;
				
			});
			
			//click on news titles
			q("#news-titles").addEventListener("click", function (e) {
				
				var p = event.target;

                while (p && p.tagName.toLowerCase() != "p")
                    p = p.parentElement;

                if (p && !p.hasClass("active")) {

                    loadFeed(p.data("url"));
					
					var titles = q("p", this, true);
					
					for (var i = 0; i < titles.length; i++)
						titles[i].removeClass("active");		
					
					p.addClass("active");
					
                    var left = p.offsetLeft;
					
					var that = this;
					
					newsTitleScrollAnimation && clearInterval(newsTitleScrollAnimation);

					newsTitleScrollAnimation = setInterval(function() {
						
						var lastScroll = that.scrollLeft;
						
						if (left - 60 > that.scrollLeft)
							that.scrollLeft += 1;
						else if (left - 60 < that.scrollLeft)
							that.scrollLeft -= 1;
						
						if (left - 60 == that.scrollLeft || that.scrollLeft == lastScroll)
							clearInterval(newsTitleScrollAnimation);
					
					}, 1);

                }
				
			});
			
            //click on news items
            q("#news").addEventListener("mousedown", function (event) {

                var li = event.target;

                while (li && li.tagName.toLowerCase() != "li")
                    li = li.parentElement;

                if (li) {

                    var list = li.parentElement.parentElement.parentElement;

                    if (event.target && event.target.tagName.toLowerCase() == "h4" || list.hasClass("grid")) {

                        var url = li.data("url");

						navigate(url, event);

                    } else if (event.button == 0) {
                        li.toggleClass("full");
                    }

                }

            });

            //navigate through bookmarks
            var bkmPrevious, bkmNext;
            //previous bookmarks
            q("#btn-previous-bookmarks").addEventListener("mouseover", function () {

                bkmPrevious = setInterval(function () {

                    var ul = q("#bookmarks-list > ul");

                    var currentLeft = parseInt(ul.style.left) || 0;
                    
                    if (currentLeft >= 0)
                        clearInterval(bkmPrevious);
                    else
                        ul.style.left = (currentLeft + 2) + "px";

                }, 3);

            });

            q("#btn-previous-bookmarks").addEventListener("mouseout", function () {
                clearInterval(bkmPrevious);
            });

            //next bookmarks
            q("#btn-next-bookmarks").addEventListener("mouseover", function () {

                bkmNext = setInterval(function () {

                    var ul = q("#bookmarks-list > ul");
                    
                    var currentLeft = parseInt(ul.style.left) || 0;

                    if (currentLeft + 440 < window.innerWidth * (-1))
                        clearInterval(bkmNext);
                    else 
                        ul.style.left = (currentLeft - 2) + "px";

                }, 3);

            });

            q("#btn-next-bookmarks").addEventListener("mouseout", function () {
                clearInterval(bkmNext);
            });

			//scroll through bookmarks bar
			q("#bookmarks-list").addEventListener("mousewheel", function (e) {
				
				var ul = q("#bookmarks-list > ul");
                    
				var currentLeft = parseInt(ul.style.left) || 0;
				
				var newLeft = 0;
				
				if ((currentLeft < 0) || (currentLeft + 440 >= window.innerWidth * (-1)))
					newLeft = (currentLeft + e.wheelDeltaY);
				
				if (newLeft > 0)
					newLeft = 0;
					
				if (newLeft + 440 < window.innerWidth * (-1))
					newLeft = window.innerWidth * (-1) - 440;
					
				ul.style.left = newLeft + "px";
						
			});
			
            //click on bookmarks
            q(".bookmarks li", true).forEach(function(element) {
                element.addEventListener("click", function (event) {

                    var url = this.data("url");

                    if (url)
                        navigate(url, event);

                });
            });

            //new feed
            q("#btn-add-feed").addEventListener("click", function () {
                editFeed();
            });

            //edit feed
            q(".btn-edit-feed", true).forEach(function (element) {
                element.addEventListener("click", function (event) {

                    var id = this.data("id");

                    editFeed(id);

                });
            });

            //delete feed
            q(".btn-remove-feed", true).forEach(function (element) {
                element.addEventListener("click", function (event) {

                    var id = this.data("id");

                    Feed.remove(id).then(function () {

                        q("#hdn-feed-id").value = "";
                        q("#txt-feed-name").value = "";
                        q("#txt-feed-url").value = "";

                        q("#feed-config").style.display = "none";

                        setTimeout(function () {
                            loadFeeds().then(bindEvents);
                        }, 0);

                    });

                });
            });

            //save feed
            q("#feed-config-btn-ok").addEventListener("click", function (event) {

                saveFeed().then(function () {

                    q("#hdn-feed-id").value = "";
                    q("#txt-feed-name").value = "";
                    q("#txt-feed-url").value = "";

                    q("#feed-config").style.display = "none";

                    setTimeout(function() {
                        loadFeeds().then(bindEvents);
                    }, 0);

                });

            });

            //cancel feed edit
            q("#feed-config-btn-cancel").addEventListener("click", function (event) {

                q("#hdn-feed-id").value = "";
                q("#txt-feed-name").value = "";
                q("#txt-feed-url").value = "";

                q("#feed-config").style.display = "none";

            });

            success();

        });

    }

    var saveTilesOrder = function () {

        return new Promise(function (success, fail) {

            Tile.select().then(function (tiles) {

                var tileNodes = q(".tile-group > .tile", true);

                var tilesToSave = [];

                for (var i = 0; i < tileNodes.length; i++) {

                    var tileNode = tileNodes[i];
                    var idTile = tileNode.data("id");

                    var groupNode = tileNode.offsetParent;
                    var idGroup = groupNode.data("id");

                    var tile = tiles.filter(function (e) { return e.id == idTile; });
                    tile = tile && tile[0];

                    if (tile) {
                        tile.order = i + 1;
                        tile.idGroup = idGroup;

						if (!tile.position || MNTP.Config.TilePlacementMode == MNTP.Config.PLACEMENT_MODE.FREE) {
						
							var tileOffset = tileNode.getWindowOffset();
						
							tile.position = {};
							tile.position.left = tileOffset.left;
							tile.position.top = tileOffset.top;

							tileNode.data("position", tile.position);
							
						}

                        tilesToSave.push(tile);
                    }

                }

                if (tilesToSave.length > 0)
                    Tile.saveBatch(tilesToSave).then(success, fail);

            });

        });

    }

    var showConfig = function () {

        q("[data-panel]", true).forEach(function (element) {
            element.style.display = "none";
        });

        q("[data-panel='config-general']").style.display = "block";

        q("#overlay").style.display = "block";
        q("#config").style.display = "block";
        q("#tile-config").style.display = "none";

    }

    var loadConfig = function (conf) {

        var config = conf || MNTP.Config;

        return new Promise(function (success, fail) {

            var inputs = q("input[data-property], select[data-property]", "#config", true);

            for (var i = 0; i < inputs.length; i++) {
                var input = inputs[i];
                var value = getPropertyValue(config, input.data("property"));

                if (input.type == "checkbox" || input.type == "radio")
                    input.checked = value || false;
                else if (input.type != "file")
                    input.value = (value !== undefined ? value : "");
            }

            //show news
            var news = q("#news");

            if (config.ShowNews) {

                news.removeClass("grid");
                news.removeClass("list");

                news.style.width = config.NewsWidth + "px";
                news.style.height = config.NewsHeight + "px";

                news.addClass(config.NewsViewMode);

                news.style.display = "block";

                if (config.ShowImageNewsList)
                    news.removeClass("hide-images");
                else
                    news.addClass("hide-images");


                var liList = q("li", news);

                if (!liList || liList.length == 0)
                    loadFeed();
                else
                    resizeNews();

                q("a[data-panel-for='config-feeds']").style.display = "block";

            } else {

                news.style.display = "none";

                q("a[data-panel-for='config-feeds']").style.display = "none";

            }

			//show bookmarks bar
			if (config.ShowBookmarksBar) {
				
				q(".bookmark-bar").style.display = "block";
				
				if (q("#bookmarks-list > ul > li", true).length == 0) {
					loadBookmarks().then(bindEvents);
				}
				
			} else {
			
				q(".bookmark-bar").style.display = "none";
			
			}
			
			//show options button
			if (config.ShowOptionsButton)
				q("#button-options").style.display = "block";
			else
				q("#button-options").style.display = "none";
			
            //tiles border radius, opacity & grayscale
            q(".tile", true).forEach(function (tileNode) {

                tileNode.style.borderRadius = config.TileBorderRadius + "px";
                tileNode.style.webkitFilter = "grayscale(" + config.TileGrayscale + ")";
				
				q(".tile-background", tileNode).style.opacity = config.TileOpacity;

            });

            //tiles accent color
            q(".accentbg", true).forEach(function (element) {
                element.style.backgroundColor = config.AccentColor;
            });

            //animation speed
            if (config.OpeningAnimation)
                q("#config-animation-speed").style.display = "block";
            else
                q("#config-animation-speed").style.display = "none";
				
			//tiles positioning
			if (config.TilePlacementMode == MNTP.Config.PLACEMENT_MODE.FLOW)
                q("#config-tiles-placement").style.display = "block";
            else
                q("#config-tiles-placement").style.display = "none";
			
				
            //background color
            q("body").style.backgroundColor = config.BackgroundColor;

            //background image -->
            if (config.HasBackgroundImage) {
                q("#config-loadBackgroundImage").style.display = "block";
                q("#config-backgroundImage-options").style.display = "block";
            }

            if (config.HasBackgroundImage && config.BackgroundImage && config.BackgroundImage.data) {

                bingImagesSlider && clearInterval(bingImagesSlider);
				bingImagesSlider = null;

                loadBackground(config.BackgroundImage, config);

            } else if (config.HasBackgroundImage) {

                bingImagesSlider && clearInterval(bingImagesSlider);
				bingImagesSlider = null;

                Image.get(Image.Type.Background).then(function (image) {

                    if (image) {

                        loadBackground(image, config);

                    } else {

                        q("#wallpaper").style.backgroundImage = "";

                        q(".tile .accentbg", true).forEach(function (tileNode) {
                            tileNode.style.backgroundImage = "";
                        });

                        q("#config-backgroundImage-options").style.display = "none";

                    }

                });

            } else if (config.BingBackgroundImage) {
				
				if ((config.ReloadBackgroundImage || !wallpaper.style.backgroundImage) && !bingImagesSlider) {

					MNTP.BGUtils.getNextBingImage().then(function (image) {	
							
						getConfig().then(function (config) {

							var imageUrl = image.url || dataURLtoObjectURL(image.data);
							config.ReloadBackgroundImage = true;
							loadBackground({ url: imageUrl }, config);

						});

					});
				
					bingImagesSlider = setInterval(function () {

						MNTP.BGUtils.getNextBingImage().then(function (image) {	
							
							getConfig().then(function (config) {

								var imageUrl = image.url || dataURLtoObjectURL(image.data);
								config.ReloadBackgroundImage = true;
								loadBackground({ url: imageUrl }, config);

							});
						});
						
					}, 10000);
				
					
				} else {

					loadBackground(null, config);

				}
					
                q("#config-loadBackgroundImage").style.display = "none";

                q("#config-backgroundImage-options").style.display = "";

            } else if (config.NoBackgroundImage) {

                bingImagesSlider && clearInterval(bingImagesSlider);
				bingImagesSlider = null;

                q("#wallpaper").style.backgroundImage = "";

                q(".tile .accentbg", true).forEach(function (tileNode) {

                    tileNode.style.backgroundImage = "";

                });

                q("#config-loadBackgroundImage").style.display = "none";

                q("#config-backgroundImage-options").style.display = "none";

            }
            //<--


            resize(config).then(success);

        });

    }

    var loadBackground = function (image, config) {

        config = config || MNTP.Config;

        var wallpaper = q("#wallpaper");

        var backgroundUrl = image && (image.url || dataURLtoObjectURL(image.data));

        if (!wallpaper.style.backgroundImage)
            config.ReloadBackgroundImage = true;

        if (config.ReloadBackgroundImage) {

			//pre-load the image for the fade effect to work
			var img = document.createElement("img");

			img.onload = function () {
				wallpaper.style.backgroundImage = "url('" + this.src + "')";

				q(".tile .accentbg", true).forEach(function (bgNode) {

					if (config.TileExtendBackground)
						bgNode.style.backgroundImage = wallpaper.style.backgroundImage;
					else if (!config.TileExtendBackground)
						bgNode.style.backgroundImage = "";

				});
			}

			img.src = backgroundUrl;

        }

        wallpaper.style.opacity = config.BackgroundOpacity || "";
        wallpaper.style.webkitFilter = config.BackgroundGrayscale > 0 ? "grayscale(" + config.BackgroundGrayscale + ")" : "";

        if (config.BackgroundFill)
            wallpaper.style.backgroundSize = "100% 100%";
        else if (config.BackgroundAdjust)
            wallpaper.style.backgroundSize = "100% auto";
        else
            wallpaper.style.backgroundSize = "";

        q(".tile .accentbg", true).forEach(function (bgNode) {

			if (config.TileExtendBackground) {
            
				if (config.BackgroundFill)
					bgNode.style.backgroundSize = "100% 100%";
				else if (config.BackgroundAdjust)
					bgNode.style.backgroundSize = "100% auto";
				else
					bgNode.style.backgroundSize = "";
				
			}

			if ((config.HasBackgroundImage || config.BingBackgroundImage) && config.TileExtendBackground)
				bgNode.parentNode.style.backgroundColor = config.BackgroundColor;
			else
				bgNode.parentNode.style.backgroundColor = "";

        });

        config.ReloadBackgroundImage = false;
        q("input[data-property='ReloadBackgroundImage']", "#config").value = "false";

    }

    var getConfig = function () {

        return new Promise(function (success, fail) {

            var inputs = q("input[data-property], select[data-property]", "#config", true);

            var config = {};

            for (var i = 0; i < inputs.length; i++) {

                var input = inputs[i];

                if (input.type == "file" && input.files.length > 0) {

                    assign(config, input.data("property"), input.files[0]);

                } else if (input.type == "checkbox" || input.type == "radio") {

                    assign(config, input.data("property"), input.checked);

                } else if (input.value) {

                    var propertyType = input.data("property-type") || "";

                    switch (propertyType.toLowerCase()) {
                        case "boolean":
                            assign(config, input.data("property"), (input.value.toLowerCase() == "true"))
                            break;
                        case "float":
                            assign(config, input.data("property"), parseFloat(input.value));
                            break;
                        case "int":
                            assign(config, input.data("property"), parseInt(input.value));
                            break;
                        default:
                            assign(config, input.data("property"), input.value);
                            break;
                    }

                }

            }
			
			config.TileWidthSm = (config.TileWidthLg / 2) - (config.TileMargin / 2);
			config.TileHeightSm = (config.TileHeightLg / 2) - (config.TileMargin / 2);

            //Background image -->
            if (config.ReloadBackgroundImage) {

                if (config.HasBackgroundImage) {

                    config.BackgroundImage = config.BackgroundImage || {};

                    q("#config-loadBackgroundImage").style.display = "";

                } else {

                    q("#config-loadBackgroundImage").style.display = "none";

                }

            }

            if (config.BackgroundImage && config.BackgroundImage.data) {

                getDataUrlFromFile(config.BackgroundImage.data).then(function (dataURL) {
                    config.BackgroundImage.data = dataURL;
                    success(config);
                });

            } else {
                success(config);
            }
            //<--
			
        });

    }

    var saveConfig = function () {

        return new Promise(function (success, fail) {

            getConfig().then(function (config) {

                new Promise(function (success, fail) {

                    //Background image -->
                    if (config.HasBackgroundImage && config.BackgroundImage) {

                        if (config.BackgroundImage.data) {

                            var image = config.BackgroundImage;
                            image.type = Image.Type.Background;
                            image.id = 1;
                            image.data = config.BackgroundImage.data;

                            config.BackgroundImage = undefined;

                            Image.save(image).then(success);

                        } else {

                            Image.get(Image.Type.Background).then(function (image) {

                                var data = image.data;

                                image = config.BackgroundImage;
                                image.type = Image.Type.Background;
                                image.id = 1;
                                image.data = data;

                                config.BackgroundImage = undefined;

                                Image.save(image).then(success);

                            });

                        }

                    } else if (!config.HasBackgroundImage) {

                        Image.remove(Image.Type.Background).then(success);

                    } else {

                        success();

                    }
                    //<--

                }).then(function () {

                    MNTP.Config.replace(config);

                });

            });

        });

    }

    var showTileConfig = function (idTile) {

        q("#overlay").style.display = "block";
        q("#config").style.display = "none";
        q("#tile-config").style.display = "block";

        q("[data-panel]", true).forEach(function (element) {
            element.style.display = "none";
        });

        q("[data-panel='tile-config-general']").style.display = "block";

        if (idTile) {

            Tile.get(idTile).then(function (tile) {
                loadTileConfig(tile);
            });

        } else {
            loadTileConfig(Tile.createNewTile());
        }

    }

    var loadPreviewTile = function (tile) {
        q("#tile-config-preview-tile").innerHTML = "";

        var tile = tile || getTileConfig();

        q("#tile-config-preview-tile").insertBefore(Tile.getNode(tile, true), null);
    }

    var loadTileConfig = function (tile) {

        var inputs = q("input[data-property], select[data-property]", "#tile-config", true);

        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];

            if (input.type == "checkbox" || input.type == "radio")
                input.checked = getPropertyValue(tile, input.data("property")) || false;
            else
                input.value = getPropertyValue(tile, input.data("property")) || "";
        }


        loadPreviewTile();

    }

    var getTileConfig = function () {

        var inputs = q("input[data-property], select[data-property]", "#tile-config", true);

        var tile = {};

        for (var i = 0; i < inputs.length; i++) {

            var input = inputs[i];

            if (input.type.toLowerCase() != "color") {

                if (input.type == "file" && input.files.length > 0) {

                    assign(tile, input.data("property"), input.files[0]);

                } else if (input.type == "checkbox" || input.type == "radio") {

                    assign(tile, input.data("property"), input.checked);

                } else if (input.value) {

                    var propertyType = input.data("property-type") || "";

                    switch (propertyType.toLowerCase()) {
                        case "boolean":
                            assign(tile, input.data("property"), (input.value.toLowerCase() == "true"))
                            break;
                        case "float":
                            assign(tile, input.data("property"), parseFloat(input.value));
                            break;
                        case "int":
                            assign(tile, input.data("property"), parseInt(input.value));
                            break;
                        default:
                            assign(tile, input.data("property"), input.value);
                            break;
                    }

                }

            }

        }

        if (tile.url && (tile.url.toLowerCase().indexOf("http://") < 0 && tile.url.toLowerCase().indexOf("https://") < 0)) {
            tile.url = "http://" + tile.url;
        }

        if (tile.image && tile.image.data) {
            tile.hasImage = true;
            tile.removeImage = false;

            q("input[data-property='hasImage']", "#tile-config").value = "true";
            q("input[data-property='removeImage']", "#tile-config").value = "false";
        }

        if (tile.hasImage && !tile.removeImage) {

            tile.image = tile.image || {};

            q("#tile-config-file-image").style.display = "none";

            q("#tile-config-btn-removeImage").style.display = "";
            q("#tile-config-imageSize").style.display = "";
        } else {
            q("#tile-config-file-image").style.display = "";

            q("#tile-config-btn-removeImage").style.display = "none";
            q("#tile-config-imageSize").style.display = "none";
        }

        if (tile.accentColor)
            q("#tile-config-backgroundColor").style.display = "none";
        else
            q("#tile-config-backgroundColor").style.display = "block";

		if (!tile.position && MNTP.Config.TilePlacementMode == MNTP.Config.PLACEMENT_MODE.FREE) {
		
			tile.position = { 
				left: (window.innerWidth / 2) - (MNTP.Config.TileWidthLg / 2), 
				top: (window.innerHeight / 2) - (MNTP.Config.TileHeightSm / 2), 
			};
			
		}
			
        return tile;

    }

    var saveTileConfig = function () {

        return new Promise(function (success, fail) {

            var tile = getTileConfig();

            tile.size = tile.size || 2;

            Tile.save(tile).then(success, fail);

        });

    }

    var hideConfigs = function () {

        q("#overlay").style.display = "none";
        q("#config").style.display = "none";
        q("#tile-config").style.display = "none";

    }

    var hideOptions = function () {

        q(".tile.selected", true).forEach(function (element) {
            element.removeClass("selected");
        });

        q("#options").addClass("hidden");
    }

    var getGroupNodebyID = function (idGroup) {

        var group = q(".tile-group", true).filter(function (element) { return element.data("id") == idGroup; });

        if (group.length > 0)
            return group[0];
        else
            return null;

    }

    var loadFeeds = function () {

        return new Promise(function (success, fail) {

            Feed.select().then(function (feeds) {

                var newsTitles = q("#news #news-titles");
                var divConfigFeeds = q("#config-feeds");

                newsTitles.innerHTML = "";
                divConfigFeeds.innerHTML = "";

                var p = document.createElement("p");
                p.innerHTML = "Featured";
                p.addClass("active");

                newsTitles.insertBefore(p, null);

                if (feeds) {

                    for (var i = 0; i < feeds.length; i++) {

                        var feed = feeds[i];

                        //news panel
                        var p = document.createElement("p");
                        p.innerHTML = feed.name;
                        p.data("url", feed.url);

                        newsTitles.insertBefore(p, null);

                        //config - feeds
                        var divFeed = document.createElement("div");
                        var spanName = document.createElement("span");
                        var spanUrl = document.createElement("span");
                        var btnEdit = document.createElement("a");
                        var btnRemove = document.createElement("a");

                        spanName.innerHTML = feed.name;

                        spanUrl.innerHTML = feed.url;
                        spanUrl.addClass("url");

                        btnEdit.addClass("btn-edit-feed");
                        btnEdit.data("id", feed.id);

                        btnRemove.addClass("btn-remove-feed");
                        btnRemove.data("id", feed.id);

                        divFeed.insertBefore(spanName, null);
                        divFeed.insertBefore(spanUrl, null);
                        divFeed.insertBefore(btnEdit, null);
                        divFeed.insertBefore(btnRemove, null);

                        divConfigFeeds.insertBefore(divFeed, null);

                    }

                }

                success();

            }, fail);

        });
        
    }

    var loadFeed = function (url) {

        return new Promise(function (success, fail) {

            q("#news .loader").style.display = "block";
            q("#news .items").style.display = "none";

            var request = MNTP.WebService.getContentNodes(true, url);

            request.then(function (list) {

                var divNews = q("#news-items");

                divNews.innerHTML = "";
                divNews.insertBefore(list, null);

                resizeNews();

                q("#news .loader").style.display = "none";
                q("#news .header").style.display = "block";
                q("#news .items").style.display = "block";

                success();

            });

            request.catch(function (error) {

                if (!url) 
                    q("#news").style.display = "none";

                console.error("Error loading news");
                fail(error);
            });

        });

    }

    var editFeed = function (id) {

        if (id) {

            Feed.get(id).then(function (feed) {

                if (feed) {

                    q("#hdn-feed-id").value = feed.id;
                    q("#txt-feed-name").value = feed.name;
                    q("#txt-feed-url").value = feed.url;

                }

            })

        }

        q("#feed-config").style.display = "block";

    }

    var saveFeed = function () {

        return new Promise(function (sucess, fail) {

            var feed = {};

            if (q("#hdn-feed-id").value)
                feed.id = parseInt(q("#hdn-feed-id").value);

            feed.name = q("#txt-feed-name").value;
            feed.url = q("#txt-feed-url").value;

            Feed.save(feed).then(sucess, fail);

        });

    }

    var resizeNews = function () {

        var news = q("#news");

        var liList = q("li", news);

        if (liList && liList.length > 0) {

            var minGridItemSize = 145;

            if (news.hasClass("grid")) {

                var colunas = Math.floor((news.offsetWidth - 26) / (minGridItemSize + 10));
                var size = Math.floor((news.offsetWidth - 26) / colunas) - 10;

                for (var i = 0; i < liList.length; i++) {
                    liList[i].style.width = size + "px";
                    liList[i].style.height = size + "px";
                }

            } else {

                for (var i = 0; i < liList.length; i++) {
                    liList[i].style.width = "";
                    liList[i].style.height = "";
                }

            }

        }

    }

    var loadCustomComponents = function () {

        return new Promise(function (success, fail) {

            //color inputs
            var colorInputs = q("input[type='color']", true);

            for (var i = 0; i < colorInputs.length; i++) {

                var colorInput = colorInputs[i];

                if (!colorInput.data("customized")) {

                    var text = document.createElement("input");

                    text.type = "text";
                    text.value = colorInput.value;

                    text.addEventListener([/*"keydown", */"change"], function () {
                        var that = this;
                        setTimeout(function () {
                            that.previousSibling.value = that.value;
                        }, 0);
                    }, "customColorInput");

                    colorInput.addEventListener("input", function () {
                        this.nextSibling.value = this.value;
                    }, "customColorInput");


                    var property = colorInput.data("property");
                    property && text.setAttribute("data-property", property);

                    colorInput.parentElement.insertBefore(text, colorInput.nextSibling);

                    colorInput.data("customized", true);

                }
            }

            //range inputs
            var rangeInputs = q("input[type='range']", true);

            for (var i = 0; i < rangeInputs.length; i++) {

                var rangeInput = rangeInputs[i];

                if (!rangeInput.data("customized")) {

                    var number = document.createElement("input");

                    number.type = "number";
                    number.value = rangeInput.value;

                    if (rangeInput.getAttribute("min"))
                        number.setAttribute("min", rangeInput.getAttribute("min"));

                    if (rangeInput.getAttribute("max"))
                        number.setAttribute("max", rangeInput.getAttribute("max"));

                    if (rangeInput.getAttribute("step"))
                        number.setAttribute("step", rangeInput.getAttribute("step"));

                    number.addEventListener([/*"keydown", */"change"], function () {
                        var that = this;
                        setTimeout(function () {
                            that.previousSibling.value = that.value;
                        }, 0);
                    }, "customRangeInput");

                    rangeInput.addEventListener("input", function () {
                        this.nextSibling.value = this.value;
                    }, "customRangeInput");


                    var property = rangeInput.data("property");
                    property && number.setAttribute("data-property", property);

                    var propertyType = rangeInput.data("property-type");
                    propertyType && number.setAttribute("data-property-type", propertyType);

                    rangeInput.parentElement.insertBefore(number, rangeInput.nextSibling);

                    rangeInput.data("customized", true);

                }
            }

            success();

        });
    }

    var loadBookmarks = function() {
        return new Promise(function (success, fail) {
		
			chrome.bookmarks.getTree(function (e) {
				var list = e[0].children;

				var bookmarkslist = q("#bookmarks-list > ul");
				var bookmarksmenu = q("#bookmarks-menu > ul > li > ul");

				bookmarkslist.innerHTML = "";
				bookmarksmenu.innerHTML = "";

				appendBookmarkNodes(list[0].children, bookmarkslist);
				appendBookmarkNodes(list, bookmarksmenu);

				q(".bookmark-bar").style.display = "block";
				
				success();

			});
		
        });
    }

    var appendBookmarkNodes = function (list, ul) {

        list.forEach(function (bookmark) {
            var li = document.createElement("li");
            var img = document.createElement("img");
            var span = document.createElement("span");

            img.setAttribute("src", "chrome://favicon/size/16@1x/" + bookmark.url);

            if (bookmark.url)
                li.data("url", bookmark.url);

            if (bookmark.title != "") {
                span.innerHTML = bookmark.title;
            } else {
                span.innerHTML = bookmark.url;
            }

            li.setAttribute("title", bookmark.title);

            li.insertBefore(img, null);
            li.insertBefore(span, null);

            if (bookmark.children) {

                var ulChildren = document.createElement("ul");

                appendBookmarkNodes(bookmark.children, ulChildren);

                li.addClass("folder");

                li.insertBefore(ulChildren, null);

            }

            ul.insertBefore(li, null);
        });
    }

    window.addEventListener("load", function() { load(); });

    window.addEventListener("resize", function() { resize(); });

    window.addEventListener("mousewheel", function (e) {
        if (e.target == q("body")) {
            document.body.scrollLeft -= e.wheelDeltaY;
        }
    });

//})();