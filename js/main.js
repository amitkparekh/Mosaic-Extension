/// <reference path="util.js" />
/// <reference path="dragging.js" />
/// <reference path="background/config.js" />
/// <reference path="Tile.js" />
/// <reference path="TileGroup.js" />
/// <reference path="Image.js" />
/// <reference path="Feed.js" />
/// <reference path="background/backgroundutils.js" />
/// <reference path="sidebar.js" />

var MNTP;

//(function () {

	var bingImagesSlider;

	var load = function () {

		return new Promise(function (success, fail) {

			loadBackgroundPage()
				.then(loadGroups)
				.then(loadTiles)
				.then(loadConfig)
				.then(loadFeedsPanel)
				.then(enableDrag)
				.then(loadCustomComponents)
				.then(bindEvents)
				.then(loadTileFeeds)
				.then(loadExternalResources)
				.then(checkVersion)
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

			var fontSize = config.TileWidthLg * 0.004
			fontSize = fontSize < 0.7 ? 0.7 : fontSize;

			var tiles1 = q(".tile.size1:not(.preview)", true);
			var tiles2 = q(".tile.size2:not(.preview)", true);
			var tiles3 = q(".tile.size3:not(.preview)", true);

			tiles1.forEach(function (element, index) {
				element.style.width = config.TileWidthSm + "px";
				element.style.height = config.TileHeightSm + "px";
				element.style.fontSize = fontSize + "em";
			});

			tiles2.forEach(function (element, index) {
				element.style.width = config.TileWidthLg + "px";
				element.style.height = config.TileHeightSm + "px";
				element.style.fontSize = fontSize + "em";
			});

			tiles3.forEach(function (element, index) {
				element.style.width = config.TileWidthLg + "px";
				element.style.height = config.TileHeightLg + "px";
				element.style.fontSize = fontSize + "em";
			});

			reorder(config).then(success);

		});

	}

	var openingAnimation = true;
	var reorder = function (config) {

		config = config || MNTP.Config;

		if (config.TilePlacementMode == MNTP.Config.PLACEMENT_MODE.FLOW &&
			config.TileFlowDirection == MNTP.Config.FLOW_DIRECTION.VERTICAL)
			return reorderFlowVeritical(config);
		else if (config.TilePlacementMode == MNTP.Config.PLACEMENT_MODE.FLOW &&
				config.TileFlowDirection == MNTP.Config.FLOW_DIRECTION.HORIZONTAL)
			return reorderFlowHorizontal(config);
		else
			return reorderFree(config);
	}

	var reorderFlowVeritical = function (config) {

		return new Promise(function (success, fail) {

			config = config || MNTP.Config;

			openingAnimation = openingAnimation && config.OpeningAnimation;

			var container = q("#container");
			var news = q("#news");
			var tiles = q(".tile", true);

			container.style.height = "";

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

				group.removeClass("horizontal");

				group.style.marginLeft = groupLeft + "px";
				group.style.height = "";

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
								group.style.height = (top - (config.TileMargin || 1)) + "px";

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

	var reorderFlowHorizontal = function (config) {

		return new Promise(function (success, fail) {

			config = config || MNTP.Config;

			q("body").style.width = "";

			var container = q("#container");
			var news = q("#news");

			container.style.height = "";

			var tiles = q(".tile", true);

			if (openingAnimation) {

				for (var i = 0; i < tiles.length; i++)
					tiles[i].style.transition = "none";

				container.style.transition = "none";
				container.style.left = "0";

			} else if (!config.OpeningAnimation) {

				container.style.transition = "none";

			}

			var groupLeft = 0;

			var groups = q(".tile-group:not(.placeholder)", true);

			var tallerGroup = 0;

			groups.forEach(function (group) {

				group.addClass("horizontal");

				var margin = config.TileMargin;

				var t = config.TileWidthSm + margin;

				var columns = config.GroupColumns;
				var rows = config.GroupRows;

				var column = 0;
				var row = 0;
				var skipThese = [];

				q(".tile:not(.dragging)", group, true).forEach(function (tileNode) {

					var size = tileNode.data("size") == 1 ? 1 : 2;

					if (column + size > columns) {
						row++;
						column = 0;
					}

					for (var i = 0; i < skipThese.length; i++) {

						var skip = skipThese[i];

						if (row == skip.r && (column == skip.c || (size == 2 && column + 1 == skip.c))) {
							column = skip.c + 2;
						}

						if (column + size > columns) {
							row++;
							column = 0;
						}

					}

					if (tileNode.data("size") == 3)
						skipThese.push({ c: column, r: row + 1 });

					var left = openingAnimation ? 0 : column * t;
					var top = row * t;

					tileNode.style.left = left + "px";
					tileNode.style.top = top + "px";

					column += (size == 1 ? 1 : 2);

				});

				group.style.width = ((columns * config.TileWidthSm) + ((columns - 1) * margin)) + "px";
				group.style.height = ((rows * config.TileHeightSm) + ((rows - 1) * margin)) + "px";

			});



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


			success();

		});

	}

	var reorderFree = function (config) {

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

			container.style.left = "0";
			container.style.top = "0";
			container.style.height = "";

			var groups = q(".tile-group:not(.placeholder)", true);

			var tallerGroup = 0;

			groups.forEach(function (group) {

				group.removeClass("horizontal");

				group.style.width = "";
				group.style.height = "";

			});

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

							setTimeout(function () {
								lastTargetIndex = null;
							}, 300);

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
			var request2 = q("body").enableCustomDragging(".news .resize", { translate: false, pixeldelay: 0 });
			var initialOffset;

			request2.dragstart(function (event) {
				initialOffset = { width: news.offsetWidth, height: news.offsetHeight, left: news.offsetLeft };
			});

			request2.dragmove(function (event) {

				var direction = 1;

				if (event.dragElement.hasClass("left")) {

					var width = news.offsetWidth;

					if (width > 340 && width < 800)
						news.style.left = (initialOffset.left + event.deltaX) + "px";

					direction = -1;
				}

				news.style.width = (initialOffset.width + (event.deltaX * direction)) + "px";
				news.style.height = (initialOffset.height + event.deltaY) + "px";

				resizeNews();
				reorder();
			});

			request2.dragend(function (event) {
				MNTP.Config.NewsWidth = news.offsetWidth;
				MNTP.Config.NewsHeight = news.offsetHeight;
				MNTP.Config.NewsLeft = news.offsetLeft;
				MNTP.Config.NewsTop = news.offsetTop;
			});

			//move news panel
			var request3 = q("body").enableCustomDragging(".news", { dragInitiator: ".news .top-bar" });

			request3.dragend(function (event) {
				MNTP.Config.NewsLeft = news.offsetLeft;
				MNTP.Config.NewsTop = news.offsetTop;
			})


			//move configuration windows
			q("body").enableCustomDragging(".config", { dragInitiator: ".config .top-bar" });

			success();

		});

	}

	var bindEvents = function () {

		return new Promise(function (success, fail) {

			//-- click on the preview tile does nothing
			q("#nav-new-tile-menu #tile-preview").addEventListener("click", function (event) {
				event.preventDefault();
				event.stopPropagation();
				return false;
			});

			//-- avoid dragging the preview tile
			q("#nav-new-tile-menu #tile-preview").addEventListener("mousedown", function (event) {
				event.preventDefault();
				event.stopPropagation();
				return false;
			});

			//-- save tile configurations (new)
			q("#new-tile-submit a").addEventListener("click", function () {

				if (validateForms(q("#nav-new-tile-menu"))) {

					saveTileConfig()
						.then(function () {
							MNTP.Config.ReloadBackgroundImage = true;
							sidebarToggle();
							load().then(saveTilesOrder);
						})
						.catch(function (error) {
							console.log(error);
							console.log(error.stack);
						});

				}

			});

			//-- save tile configurations (edit)
			q("#edit-tile-submit a").addEventListener("click", function () {

				if (validateForms(q("#edit-tile-menu"))) {

					saveTileConfig(true)
						.then(function () {
							MNTP.Config.ReloadBackgroundImage = true;
							sidebarToggle();
							load().then(saveTilesOrder);
						})
						.catch(function (error) {
							console.log(error);
							console.log(error.stack);
						});

				}

			});

			//-- live update the preview tile (new)
			q("#nav-new-tile-menu input, #nav-new-tile-menu select", true).forEach(function (element) {

				element.addEventListener(["keypress", "change", "input"], function () {
					setTimeout(function () {
						loadPreviewTile();
					}, 0);
				});

			});

			//-- live update the preview tile (edit)
			q("#edit-tile-menu input, #edit-tile-menu select", true).forEach(function (element) {

				element.addEventListener(["keypress", "change", "input"], function () {
					setTimeout(function () {
						loadPreviewTile(null, true);
					}, 0);
				});

			});

			//-- remove tile image (new)
			q("#new-tile-remove-image a").addEventListener("click", function () {

				q("input[data-property='removeImage']", "#nav-new-tile-menu").value = "true";
				q("input[data-property='image.data']", "#nav-new-tile-menu").value = ""
				q("input[data-property='image.url']", "#nav-new-tile-menu").value = ""

				loadPreviewTile();

				q("#new-tile-remove-image").removeClass("fadeIn").addClass("fadeOut");

				q("#new-tile-add-url-text").removeClass("fadeInLeft").addClass("fadeOutLeft");

			});

			//-- remove tile image (edit)
			q("#edit-tile-remove-image a").addEventListener("click", function () {

				q("input[data-property='removeImage']", "#edit-tile-menu").value = "true";
				q("input[data-property='image.data']", "#edit-tile-menu").value = ""
				q("input[data-property='image.url']", "#edit-tile-menu").value = ""

				loadPreviewTile(null, true);

				q("#edit-tile-remove-image").removeClass("fadeIn").addClass("fadeOut");

				q("#edit-tile-add-url-text").addClass("fadeOutLeft");

			});

			//-- right click on tiles
			q(".tile", true).forEach(function (element) {

				element.addEventListener("contextmenu", function (event) {

					q(".tile.selected", true).forEach(function (tileNode) {
						tileNode.removeClass("selected");
					});

					this.addClass("selected");

					q(".context-menu li", true).forEach(function (element) {
						element.style.display = "block";
					});

					var contextMenu = q(".context-menu");

					contextMenu.addClass("hidden");

					setTimeout(function () {

						contextMenu.removeClass("hidden");
						contextMenu.style.top = event.y + "px";
						contextMenu.style.left = event.x + "px";

					}, 50);

					event.stopPropagation();
					event.preventDefault();
					return false;
				});

			});

			//-- right anywhere else shows the global options
			q("body").addEventListener("contextmenu", function (event) {

				if (event.target == q("body") || event.target.hasClass(["wrapper", "container", "wallpaper", "tile-group"])) {

					q(".tile.selected", true).forEach(function (tileNode) {
						tileNode.removeClass("selected");
					});

					q(".context-menu li", true).forEach(function (element) {
						element.style.display = element.hasClass("global") ? "block" : "none";
					});

					var contextMenu = q(".context-menu");

					contextMenu.addClass("hidden");

					setTimeout(function () {

						contextMenu.removeClass("hidden");
						contextMenu.style.top = event.y + "px";
						contextMenu.style.left = event.x + "px";

					}, 50);

				}

				event.preventDefault();
				return false;
			});

			//-- left click anywhere else closes the context menu and the sidebar
			q("body").addEventListener("click", function (event) {

				if (event.target == q("body") || event.target.hasClass(["wrapper", "container", "wallpaper", "tile-group"])) {

					q(".context-menu").addClass("hidden");

					q(".tile.selected", true).forEach(function (tileNode) {
						tileNode.removeClass("selected");
					});

					sidebar.removeClass("open");
					menuButton.removeClass("active");
					subMenuClose();

					setTimeout(function () {
						navMain.removeClass("open");
					}, animaDelay);

				}
			});

			//-- resize tile - smaller
			q("#edit-tile-make-smaller, #context-make-tile-smaller", true).forEach(function(element) {

				element.addEventListener("click", function () {

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

			});

			//-- resize tile - bigger
			q("#edit-tile-make-bigger, #context-make-tile-bigger", true).forEach(function (element) {

				element.addEventListener("click", function () {

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

			});

			//-- edit tile (context menu)
			q("#context-edit-tile").addEventListener("click", function (event) {

				closeAllSubmenus().then(function () {

					q(".context-menu").addClass("hidden");

					var id = q(".tile.selected").data("id");
					showTileConfig(id);

				});

				event.preventDefault();
				event.stopPropagation();
				return false;

			});

			//-- remove tile (context menu and sidebar)
			q("#context-remove-tile, #edit-tile-delete", true).forEach(function (element) {

				element.addEventListener("click", function () {

					q(".context-menu").addClass("hidden");

					var tiles = q(".tile.selected", true);

					for (var i = 0; i < tiles.length; i++) {

						var tileNode = tiles[i];
						var id = tileNode.data("id");

						tileNode.remove();
						Tile.remove(id);

					}

					reorder();

					sidebar.removeClass("open");
					menuButton.removeClass("active");
					subMenuClose();

					setTimeout(function () {
						navMain.removeClass("open");
					}, animaDelay);

					event.preventDefault();
					event.stopPropagation();
					return false;

				});

			});

			//-- add tile (context menu)
			q("#context-add-tile").addEventListener("click", function () {

				closeAllSubmenus().then(function () {

					sidebar.addClass("open");
					menuButton.addClass("active");

					navNewTileMenu.addClass("open ext");
					extSidebarOpen();

					loadPreviewTile();

					q("#new-tile-customise-color a.color-preview").style.backgroundColor = MNTP.Config.AccentColor;
					q("#new-tile-customise-color input").value = MNTP.Config.AccentColor;

					q("#new-tile-customise-font-color a.color-preview").style.backgroundColor = MNTP.Config.TileFontColor;
					q("#new-tile-customise-font-color input").value = MNTP.Config.TileFontColor;

					q(".context-menu").addClass("hidden");

					q(".tile.selected", true).forEach(function (tileNode) {
						tileNode.removeClass("selected");
					});

				});

				event.preventDefault();
				event.stopPropagation();
				return false;

			});

			//-- settings (context menu)
			q("#context-settings").addEventListener("click", function () {

				closeAllSubmenus().then(function () {

					sidebar.addClass("open");
					menuButton.addClass("active");

					navMainOpen();

					q(".context-menu").addClass("hidden");

					q(".tile.selected", true).forEach(function (tileNode) {
						tileNode.removeClass("selected");
					});

				});

				event.preventDefault();
				event.stopPropagation();
				return false;

			});

			//-- live update the configurations
			q("input[data-config], select[data-config]", true).forEach(function (element) {

				element.addEventListener(["keypress", "change", "input"], function () {

					var that = this;

					setTimeout(function () {

						setConfig(that);

						loadConfig();

					}, 0);
				});

			});

			//-- tiles animation preview
			var animationpreview;
			q("[data-config='OpeningAnimationTime']").addEventListener("input", function () {

				var that = this;

				animationpreview && clearTimeout(animationpreview);

				animationpreview = setTimeout(function () {

					MNTP.Config.OpeningAnimationTime = parseInt(that.value);

					openingAnimation = true;

					reorder();

				}, 500);

			}, "animationPreview");

			q("[data-config='OpeningAnimation']").addEventListener("change", function () {

				var that = this;

				setTimeout(function () {

					if (that.checked) {

						MNTP.Config.OpeningAnimation = true;

						openingAnimation = true;

						reorder();

					}

				});

			}, "animationPreview");

			//-- get background from bing
			q("#btn-bing-background").addEventListener("click", function () {

				MNTP.Config.HasBackgroundImage = false;
				MNTP.Config.BingBackgroundImage = true;
				MNTP.Config.NoBackgroundImage = false;

				MNTP.Config.ReloadBackgroundImage = true;

				q("#background-url").fadeOutLeft();

				loadConfig();

			});

			//-- add background from URL
			q("#btn-background-url").addEventListener("click", function () {

				q("#background-url").toggleFadeLeft();

			});

			//-- get background from URL
			q("#txt-background-url").addEventListener("keydown", function () {

				var that = this;

				setTimeout(function () {

					var img = new Image();

					img.onload = function () {

						getDataUrlFromUrl(this.src).then(function (opt) {

							var image = {};
							image.type = Image.Type.Background;
							image.id = 1;
							image.data = opt.dataURL;

							Image.save(image).then(function () {

								MNTP.Config.HasBackgroundImage = true;
								MNTP.Config.BingBackgroundImage = false;
								MNTP.Config.NoBackgroundImage = false;

								MNTP.Config.ReloadBackgroundImage = true;

								q("#background-url").fadeOutLeft();

								loadConfig();

							});

						});

					}

					img.src = that.value;

				}, 0);

			});

			q("#txt-background-url").addEventListener("blur", function () {

				q("label", this.parentElement).toggleClass("valid", this.value.length > 0);

			});

			//-- upload background
			q("#file-background").addEventListener("change", function () {

				if (this.files) {

					var that = this;

					setTimeout(function () {

						getDataUrlFromFile(that.files[0]).then(function (dataURL) {

							var image = {};
							image.type = Image.Type.Background;
							image.id = 1;
							image.data = dataURL;

							Image.save(image).then(function () {

								MNTP.Config.HasBackgroundImage = true;
								MNTP.Config.BingBackgroundImage = false;
								MNTP.Config.NoBackgroundImage = false;

								MNTP.Config.ReloadBackgroundImage = true;

								q("#background-url").fadeOutLeft();

								loadConfig();

							});

						});

					}, 0);

				}

			});

			// -- background fit
			q("#select-background-fit").addEventListener("change", function () {

				var that = this;

				setTimeout(function () {

					MNTP.Config.BackgroundFill = false;
					MNTP.Config.BackgroundAdjust = false;

					if (that.value == "adjust")
						MNTP.Config.BackgroundAdjust = true;
					else if (that.value == "fill")
						MNTP.Config.BackgroundFill = true;

					loadConfig();

				}, 0);

			}, "fitChange");

			//-- remove background
			q("#btn-remove-background").addEventListener("click", function () {

				MNTP.Config.HasBackgroundImage = false;
				MNTP.Config.BingBackgroundImage = false;
				MNTP.Config.NoBackgroundImage = true;

				MNTP.Config.ReloadBackgroundImage = true;

				q("#background-url").fadeOutLeft();

				loadConfig();

			});

			//-- reset default setting (tiles)
			q("#btn-reset-tiles-config").addEventListener("click", function () {

				var inputs = q("[data-config]", "#nav-settings-tiles-menu");

				for (var i = 0; i < inputs.length; i++) {

					var input = inputs[i];
					var config = input.data("config");

					MNTP.Config.setDefaultValue(config);

				}

				loadConfig();

			});

			//-- change news view mode
			q("#news-btn-change-view").addEventListener("click", function () {

				var news = q("#news");
				news.toggleClass("list", "grid");

				MNTP.Config.NewsViewMode = news.hasClass("list") ? "list" : "grid";

				resizeNews();

			});

			//-- change show pictures on list mode
			q("#news-btn-change-view-pictures").addEventListener("click", function () {

				var news = q("#news");
				news.toggleClass("hide-images");

				MNTP.Config.ShowImageNewsList = !news.hasClass("hide-images");

			});

			//-- scroll through news titles
			var newsTitleScrollAnimation;
			q("#news-titles").addEventListener("mousewheel", function (e) {

				newsTitleScrollAnimation && clearInterval(newsTitleScrollAnimation);
				newsTitleScrollAnimation = null;

				this.scrollLeft -= e.wheelDeltaY;

			});

			//-- click on news titles
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

					newsTitleScrollAnimation = setInterval(function () {

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

			//-- click on news items
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

			//-- navigate through bookmarks
			var bkmPrevious, bkmNext;
			//-- previous bookmarks
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

			//-- next bookmarks
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

			//-- scroll through bookmarks bar
			q("#bookmarks-list").addEventListener("mousewheel", function (e) {

				//var ul = q("#bookmarks-list > ul");

				//var currentLeft = parseInt(ul.style.left) || 0;

				//var newLeft = 0;

				//if ((currentLeft < 0) || (currentLeft + 440 >= window.innerWidth * (-1)))
				//    newLeft = (currentLeft + e.wheelDeltaY);

				//if (newLeft > 0)
				//    newLeft = 0;

				//if (newLeft + 440 < window.innerWidth * (-1))
				//    newLeft = window.innerWidth * (-1) - 440;

				//ul.style.left = newLeft + "px";

			});

			//-- click on bookmarks
			q(".bookmarks li", true).forEach(function (element) {
				element.addEventListener("click", function (event) {

					var url = this.data("url");

					if (url)
						navigate(url, event);

				});
			});

			//-- import tiles and configurations
			q("#nav-settings-import-file").addEventListener("change", function (event) {

				var file = this.files[0];

				if (file) {

					var reader = new FileReader();

					reader.onload = (function (file) {

						return function (e) {

							var data = JSON.parse(e.target.result);

							if (data.tiles)
								data.tiles = JSON.parse(data.tiles);

							if (data.background)
								data.background = JSON.parse(data.background);

							if (data.temaPadrao)
								data.temaPadrao = JSON.parse(data.temaPadrao);

							MNTP.IDB.importData(data).then(function () { window.location.reload(); });

						};

					})(file);

					reader.readAsText(file);
				}


			});

			//-- export tiles and configurations
			q("#nav-settings-export-file").addEventListener("click", function (event) {

				var that = this;

				if (!that.href) {

					MNTP.IDB.exportData().then(function (data) {

						var blob = new Blob([JSON.stringify(data)]);
						that.href = window.URL.createObjectURL(blob);
						that.download = "data.mosaic";

						var clickEvent = new Event("click");
						that.dispatchEvent(clickEvent);

						console.log("teste");

					});

				} else {

					setTimeout(function () {
						that.href = "";
					}, 0);

				}

			});


			success();

		});

	}

	var closeAllSubmenus = function () {

		return new Promise(function (success, fail) {

			extSidebarClose();

			var subMenus = q(".sidebar-nav.open", true);

			for (var i = 0; i < subMenus.length; i++)
				subMenus[i].removeClass("open ext");

			if (subMenus.length > 0)
				setTimeout(success, animaDelay);
			else
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

	var setConfig = function (input) {

		var config = input.data("config");

		if (input.type == "file" && input.files.length > 0) {

			//assign(config, config, input.files[0]);

		} else if (input.type == "checkbox" || input.type == "radio") {

			MNTP.Config[config] = input.checked;

		} else if (input.value) {

			var configType = input.data("config-type") || "";

			switch (configType.toLowerCase()) {
				case "boolean":
					MNTP.Config[config] = input.value.toLowerCase() == "true";
					break;
				case "float":
					MNTP.Config[config] = parseFloat(input.value);
					break;
				case "int":
					MNTP.Config[config] = parseInt(input.value);
					break;
				default:
					MNTP.Config[config] = input.value;
					break;
			}

		}

		if (config == "TileWidthLg")
			MNTP.Config.TileHeightLg = parseInt(input.value);

	}

	var loadConfig = function (conf) {

		var config = conf || MNTP.Config;

		return new Promise(function (success, fail) {

			var inputs = q("input[data-config], select[data-config]", true);

			for (var i = 0; i < inputs.length; i++) {
				var input = inputs[i];
				var value = getPropertyValue(config, input.data("config"));

				if (input.tagName.toLowerCase() == "select") {

					input.value = (value !== undefined ? value : "");

					var text = q("input[type=text]", input.parentElement)

					if (text) {
					    var option = q("option[value='" + input.value + "']", input);
					    text.value = option ? option.innerText : "";
					}

				} else if (input.type == "checkbox" || input.type == "radio") {

					input.checked = value || false;

				} else if (input.type != "file") {

					input.value = (value !== undefined ? value : "");

				}
			}

			//dark theme
			q("body").toggleClass("dark", config.DarkTheme);

			//show news
			var news = q("#news");

			//if (config.ShowNews) {
			if (false) {

				news.removeClass("grid");
				news.removeClass("list");

				news.style.width = config.NewsWidth + "px";
				news.style.height = config.NewsHeight + "px";

				if (config.NewsLeft == -1 || config.NewsRight == -1) {

					news.style.right = "2em";
					news.style.top = "calc(50% - " + (config.NewsHeight / 2) + "px)";

				} else {

					news.style.left = config.NewsLeft + "px";
					news.style.top = config.NewsTop + "px";

				}

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

			} else {

				news.style.display = "none";

			}

			//show bookmarks bar
			if (config.ShowBookmarksBar) {

				q(".bookmark-bar").style.display = "block";

				if (q("#bookmarks-list > ul > li", true).length == 0) {
					loadBookmarks().then(bindEvents);
				}

				q("#menu-button").style.top = "60px";

			} else {

				q(".bookmark-bar").style.display = "none";

				q("#menu-button").style.top = "";

			}

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

			if (config.TileExtendBackground) {
				q("#tile-background-color").fadeOutLeft();
			} else {
				q("#tile-background-color").fadeInLeft();
			}


			//animation speed
			if (config.OpeningAnimation)
				q("#animation-speed").fadeInLeft();
			else
				q("#animation-speed").fadeOutLeft();

			//tiles positioning
			if (config.TilePlacementMode == MNTP.Config.PLACEMENT_MODE.FLOW)
				q("#tile-grid-configs").fadeInLeft();
			else
				q("#tile-grid-configs").fadeOutLeft();

			//flow direction
			if (config.TileFlowDirection == MNTP.Config.FLOW_DIRECTION.HORIZONTAL)
				q("#tile-columns").fadeInLeft();
			else
				q("#tile-columns").fadeOutLeft();


			//background color
			q("body").style.backgroundColor = config.BackgroundColor;


			if (config.HasBackgroundImage && config.BackgroundImage && config.BackgroundImage.data) {

				bingImagesSlider && clearInterval(bingImagesSlider);
				bingImagesSlider = null;

				loadBackground(config.BackgroundImage, config);

				q("#remove-background").fadeInLeft();
				q("#background-options").fadeInLeft();

			} else if (config.HasBackgroundImage) {

				bingImagesSlider && clearInterval(bingImagesSlider);
				bingImagesSlider = null;

				Image.get(Image.Type.Background).then(function (image) {

					if (image) {

						loadBackground(image, config);

						q("#remove-background").fadeInLeft();
						q("#background-options").fadeInLeft();

					} else {

						q("#wallpaper").style.backgroundImage = "";

						q(".tile .accentbg", true).forEach(function (tileNode) {
							tileNode.style.backgroundImage = "";
						});

					}

				});

			} else if (config.BingBackgroundImage) {

				if ((config.ReloadBackgroundImage || !wallpaper.style.backgroundImage) && !bingImagesSlider) {

					MNTP.BGUtils.getNextBingImage().then(function (image) {

							var imageUrl = image.url || dataURLtoObjectURL(image.data);
							MNTP.Config.ReloadBackgroundImage = true;
							loadBackground({ url: imageUrl });

							q("#remove-background").fadeInLeft();
							q("#background-options").fadeInLeft();

					});

					bingImagesSlider = setInterval(function () {

						MNTP.BGUtils.getNextBingImage().then(function (image) {

							var imageUrl = image.url || dataURLtoObjectURL(image.data);
							config.ReloadBackgroundImage = true;
							loadBackground({ url: imageUrl }, config);

							q("#remove-background").fadeInLeft();
							q("#background-options").fadeInLeft();

						});

					}, 20000);


				} else {

					loadBackground(null, config);

					q("#remove-background").fadeInLeft();
					q("#background-options").fadeInLeft();

				}

			} else if (config.NoBackgroundImage) {

				bingImagesSlider && clearInterval(bingImagesSlider);
				bingImagesSlider = null;

				q("#wallpaper").style.backgroundImage = "";

				q(".tile .accentbg", true).forEach(function (tileNode) {

					tileNode.style.backgroundImage = "";

				});

				q("#remove-background").fadeOutLeft();
				q("#background-options").fadeOutLeft();

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

		if (config.ReloadBackgroundImage && backgroundUrl) {

			//pre-load the image for the fade effect to work
			var img = document.createElement("img");

			img.onload = function () {

				wallpaper.style.backgroundImage = "url('" + this.src + "')";

				q(".tile .accentbg", true).forEach(function (bgNode) {

					if (config.TileExtendBackground)
						bgNode.style.backgroundImage = wallpaper.style.backgroundImage;
					else
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

				if (wallpaper.style.backgroundImage && !bgNode.style.backgroundImage)
					bgNode.style.backgroundImage = wallpaper.style.backgroundImage;

				if (config.BackgroundFill)
					bgNode.style.backgroundSize = "100% 100%";
				else if (config.BackgroundAdjust)
					bgNode.style.backgroundSize = "100% auto";
				else
					bgNode.style.backgroundSize = "";

			} else {

				bgNode.style.backgroundImage = "";

			}

			if ((config.HasBackgroundImage || config.BingBackgroundImage) && config.TileExtendBackground)
				bgNode.parentNode.style.backgroundColor = config.BackgroundColor;
			else
				bgNode.parentNode.style.backgroundColor = "";

		});

		config.ReloadBackgroundImage = false;

	}

	var showTileConfig = function (idTile) {

		editMenuOpen();

		if (idTile) {

			Tile.get(idTile).then(function (tile) {
				loadTileConfig(tile);
			});

		}
	}

	var loadPreviewTile = function (tile, isEdit) {

		var idMenu = isEdit ? "#edit-tile-menu" : "#nav-new-tile-menu";

		q(".tile-preview", idMenu).innerHTML = "";

		var tile = tile || getTileConfig(isEdit);

		q(".tile-preview", idMenu).insertBefore(Tile.getNode(tile, true), null);

		if (q("#wallpaper").style.backgroundImage && MNTP.Config.TileExtendBackground && tile.accentColor) {
			q(".tile-preview .tile-background", idMenu).style.backgroundImage = q("#wallpaper").style.backgroundImage;
		}
	}

	var loadTileConfig = function (tile) {

		var inputs = q("input[data-property], select[data-property]", "#edit-tile-menu", true);

		for (var i = 0; i < inputs.length; i++) {
			var input = inputs[i];

			if (input.type == "checkbox" || input.type == "radio") {

				input.checked = getPropertyValue(tile, input.data("property")) || false;

			} else {

				input.value = getPropertyValue(tile, input.data("property")) || "";

				if (input.type == "text")
					q("label", input.parentNode).toggleClass("valid", input.value != "");

			}

		}

		q("input[data-property=accentColor]", "#edit-tile-menu").checked = !tile.accentColor;
		q("input[data-property=accentColor]", "#edit-tile-menu").toggleClass("active", !tile.accentColor);


		if (tile.accentColor) {
			q("#edit-tile-customise-color").fadeOutLeft();
			q("#edit-tile-customise-font-color").fadeOutLeft();
		} else {
			q("#edit-tile-customise-color").fadeInLeft();
			q("#edit-tile-customise-font-color").fadeInLeft();
		}

		var colorInputs = q("input[type=color]", "#edit-tile-menu", true);

		for (var i = 0; i < colorInputs.length; i++)
			q(".color-preview", colorInputs[i].parentNode).style.backgroundColor = colorInputs[i].value;


		loadPreviewTile(null, true);

	}

	var getTileConfig = function (isEdit) {

		var idMenu = isEdit ? "#edit-tile-menu" : "#nav-new-tile-menu";

		q("#tile-preview", idMenu).innerHTML = "";

		var inputs = q("input[data-property], select[data-property]", idMenu, true);

		var tile = {};

		for (var i = 0; i < inputs.length; i++) {

			var input = inputs[i];


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

		tile.accentColor = !tile.accentColor;

		if (tile.url && (tile.url.toLowerCase().indexOf("http://") < 0 && tile.url.toLowerCase().indexOf("https://") < 0)) {
			tile.url = "http://" + tile.url;
		}

		if (tile.image && (tile.image.data || tile.image.url)) {
			tile.hasImage = true;
			tile.removeImage = false;

			if (tile.image.data)
				q("input[data-property='image.url']", idMenu).value = ""

			q("input[data-property='hasImage']", idMenu).value = "true";
			q("input[data-property='removeImage']", idMenu).value = "false";
		}

		if (tile.hasImage)
			q("[id*=tile-remove-image]", idMenu).removeClass("fadeOut").addClass("fadeIn");
		else
			q("[id*=tile-remove-image]", idMenu).removeClass("fadeIn").addClass("fadeOut");

		if (!tile.position && MNTP.Config.TilePlacementMode == MNTP.Config.PLACEMENT_MODE.FREE) {

			tile.position = {
				left: (window.innerWidth / 2) - (MNTP.Config.TileWidthLg / 2),
				top: (window.innerHeight / 2) - (MNTP.Config.TileHeightSm / 2),
			};

		}

		return tile;

	}

	var saveTileConfig = function (isEdit) {

		return new Promise(function (success, fail) {

			var tile = getTileConfig(isEdit);

			tile.size = tile.size || 2;

			Tile.save(tile).then(success, fail);

		});

	}

	var getGroupNodebyID = function (idGroup) {

		var group = q(".tile-group", true).filter(function (element) { return element.data("id") == idGroup; });

		if (group.length > 0)
			return group[0];
		else
			return null;

	}

	var getTileNodeById = function (idTile) {

		var tile = q(".tile", true).filter(function (element) { return element.data("id") == idTile; });

		if (tile.length > 0)
			return tile[0];
		else
			return null;

	}

	var loadTileFeeds = function () {

		return new Promise(function (success, fail) {

			Tile.select().then(function (tiles) {

				var newArray = [];

				for (var i = 0; i < tiles.length; i++) {

					var tile = tiles[i];

					if (tile.rss)
						newArray.push(tile);

				}

				tiles = shuffleArray(newArray);

				for (var i = 0; i < tiles.length; i++) {

					var tile = tiles[i];

					var tileNode = getTileNodeById(tile.id);

					var showFeed = function (tile, tileNode) {

						var feedCount = tileNode.hasClass("size3") ? 4 : 1;

						if (q(".feed p", tileNode, true).length != feedCount) {

							MNTP.WebService.getContent(false, tile.rss, feedCount).then(function (feeds) {

								if (feeds.items && feeds.items.results && feeds.items.results.length > 0) {

									var feedNode = q(".tile-content .feed", tileNode);

									feedNode.innerHTML = "";

									var h4 = document.createElement("h4");

									h4.innerText = tile.name;

									feedNode.insertBefore(h4, null);

									for (var i = 0; i < feeds.items.results.length && i < feedCount; i++) {

										var feed = feeds.items.results[i];

										var p = document.createElement("p");

										p.innerText = feed.title;
										p.data("url", feed.url);

										p.addEventListener("click", function (event) {
											navigate(this.data("url"), event);
											event.stopPropagation();
										});

										feedNode.insertBefore(p, null);

									}

									q(".tile-content", tileNode).addClass("feed-loaded");
									q(".tile-content", tileNode).style.webkitAnimationName = "tileAnimation";

								}

							});

						} else {

							q(".tile-content", tileNode).style.webkitAnimationName = "tileAnimation";

						}

					}

					tileNode.feedTimeout && clearTimeout(tileNode.feedTimeout);
					tileNode.feedInterval && clearInterval(tileNode.feedInterval);

					tileNode.feedTimeout = setTimeout(function (tile, tileNode) {

						showFeed(tile, tileNode);

						tileNode.feedInterval = setInterval(function (tile, tileNode) {

							showFeed(tile, tileNode);

						}, 5000 * tiles.length, tile, tileNode);

					}, 5000 * i, tile, tileNode);

					q(".tile-content", tileNode).addEventListener("webkitAnimationEnd", function () {
						this.style.webkitAnimationName = "";
					});

				}

				success();

			});

		});

	}

	var loadFeedsPanel = function () {

		return new Promise(function (success, fail) {

			Feed.select().then(function (feeds) {

				var newsTitles = q("#news #news-titles");
				newsTitles.innerHTML = "";

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

			var updateColor = function (colorInput) {

				if (colorInput.previousElementSibling && colorInput.previousElementSibling.tagName.toLowerCase() == "div") {

					var a = q("a", colorInput.previousElementSibling);

					a && (a.style.backgroundColor = colorInput.value);

				}

			}

			for (var i = 0; i < colorInputs.length; i++) {

				var colorInput = colorInputs[i];

				colorInput.addEventListener("change", function () {

					updateColor(this);

				}, "customColorChange");

				updateColor(colorInput);

			}

			success();

		});
	}

	var loadBookmarks = function () {
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

	var loadExternalResources = function () {

		return new Promise(function (success, fail) {

			q("#paypal-pixel").setAttribute("src", "https://www.paypalobjects.com/pt_BR/i/scr/pixel.gif");
			q("#link-roboto").setAttribute("href", "http://fonts.googleapis.com/css?family=Roboto:500,300,400,400italic");

			//analytics
			var _gaq = _gaq || [];
			_gaq.push(['_setAccount', 'UA-61018966-1']);
			_gaq.push(['_trackPageview']);

			(function () {
				var ga = document.createElement('script');
				ga.type = 'text/javascript';
				ga.async = true;
				ga.src = 'https://ssl.google-analytics.com/ga.js';
				var s = document.getElementsByTagName('script')[0];
				s.parentNode.insertBefore(ga, s);
			})();

			_gaq.push(['_trackPageview']);

			success();

		});

	}

	var checkVersion = function () {

		var key = "checkedVersion";
		var checkedVersion = JSONLocalStorage.getItem(key);
		var currentVersion = chrome.runtime.getManifest().version;


		if (!checkedVersion || checkedVersion != currentVersion) {

			JSONLocalStorage.setItem(key, currentVersion);

			sidebarToggle();
			extSidebarOpen2();
			navMainClose();

			navChangelogMenu.addClass("open ext2");

		}

	}

	window.addEventListener("load", function () { load(); });

	window.addEventListener("resize", function () { MNTP && resize(); });

	window.addEventListener("mousewheel", function (e) {
		if (e.target == q("body")) {
			document.body.scrollLeft -= e.wheelDeltaY;
		}
	});

//})();
