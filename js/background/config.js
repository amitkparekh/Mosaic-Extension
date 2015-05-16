/// <reference path="../util.js" />

var MNTP = MNTP || {};

MNTP.Config = (function () {

    var CONFIG = "config";

    var defaultConfig = {
        BackgroundColor: "#000000",
        AccentColor: "#333333",
        TileMargin: 2,
        TileHeightLg: 250,
        TileWidthLg: 250,
        TileOpacity: 1,
        TileBorderRadius: 0,
        TileGrayscale: 0,
        TileExtendBackground: true,
        TilePlacementMode: "flow",
        TileFlowDirection: "vertical",
        TileFontColor: "#FFFFFF",
        GroupMargin: 250,
        GroupTop: -1,
        GroupLeft: 120,
        GroupColumns: 0,
        GroupRows: 3,
        ShowNews: true,
        NewsViewMode: "list",
        NewsWidth: 392,
        NewsHeight: 626,
        ShowImageNewsList: false,
        NoBackgroundImage: false,
        HasBackgroundImage: false,
        BingBackgroundImage: true,
        BackgroundOpacity: 0.2,
        BackgroundGrayscale: 0,
        BackgroundNoRepeat: true,
        BackgroundFill: false,
        BackgroundAdjust: true,
		ShowBookmarksBar: true,
		ShowOptionsButton: true,
		OpeningAnimation: true,
		OpeningAnimationTime: 700,
        LastSyncDate: null
    };


    var _config = JSONLocalStorage.getItem(CONFIG);

    if (!_config)
        _config = defaultConfig;
    else {

        for (var item in defaultConfig) {

            if (_config[item] == undefined)
                _config[item] = defaultConfig[item];

        }

    }

    JSONLocalStorage.setItem(CONFIG, _config);

    var val = function (key, value) {

        //set
        if (key !== undefined && value !== undefined) {

            _config[key] = value;

            JSONLocalStorage.setItem(CONFIG, _config);

            //send data to sync web service
            MNTP.WebService.save("config", _config);

        //get
        } else if (key !== undefined && value === undefined) {

            return _config[key];

        }

    }

    return {

		PLACEMENT_MODE: {
			
			FLOW: "flow",
			FREE: "free"
			
		},

		FLOW_DIRECTION: {

		    VERTICAL: "vertical",
		    HORIZONTAL: "horizontal"

		},
	
        replace: function (config) {
            if (config) {
                JSONLocalStorage.setItem(CONFIG, config);
                _config = config;

                //send data to sync web service
                MNTP.WebService.save("config", _config);
            }
        },

        reset: function() {
            JSONLocalStorage.setItem(CONFIG, defaultConfig);
            _config = defaultConfig;

            //send data to sync web service
            MNTP.WebService.save("config", _config);
        },

        setDefaultValue: function(option) {

            if (defaultConfig[option]) 
                MNTP.Config[option] = defaultConfig[option];

        },

        //BackgroundColor
        get BackgroundColor() {
            return val("BackgroundColor");
        },

        set BackgroundColor(value) {
            val("BackgroundColor", value);
        },

        //AccentColor
        get AccentColor() {
            return val("AccentColor");
        },

        set AccentColor(value) {
            val("AccentColor", value);
        },

        //TileMargin
        get TileMargin() {
            return val("TileMargin");
        },

        set TileMargin(value) {
            val("TileMargin", value);
        },

        //TileHeightLg
        get TileHeightLg() {
            return val("TileHeightLg");
        },

        set TileHeightLg(value) {
            val("TileHeightLg", value);
        },

        //TileHeightSm
        get TileHeightSm() {
            return (this.TileHeightLg / 2) - (this.TileMargin / 2);
        },

        set TileHeightSm(value) {
            this.TileHeightLg = (value + (this.TileMargin / 2)) * 2;
        },

        //TileWidthLg
        get TileWidthLg() {
            return val("TileWidthLg");
        },

        set TileWidthLg(value) {
            val("TileWidthLg", value);
        },

        //TileWidthSm
        get TileWidthSm() {
            return (this.TileWidthLg / 2) - (this.TileMargin / 2);
        },

        set TileWidthSm(value) {
            this.TileWidthLg = (value + (this.TileMargin / 2)) * 2;
        },

        //TileOpacity
        get TileOpacity() {
            return val("TileOpacity");
        },

        set TileOpacity(value) {
            val("TileOpacity", value);
        },

        //TileBorderRadius
        get TileBorderRadius() {
            return val("TileBorderRadius");
        },

        set TileBorderRadius(value) {
            val("TileBorderRadius", value);
        },
		
        //TileGrayscale
        get TileGrayscale() {
            return val("TileGrayscale");
        },

        set TileGrayscale(value) {
            val("TileGrayscale", value);
        },

        //TileExtendBackground
        get TileExtendBackground() {
            return val("TileExtendBackground");
        },

        set TileExtendBackground(value) {
            val("TileExtendBackground", value);
        },
		
		//TilePlacementMode
        get TilePlacementMode() {
            return val("TilePlacementMode");
        },

        set TilePlacementMode(value) {
            val("TilePlacementMode", value);
        },

        //TileFlowDirection
        get TileFlowDirection() {
            return val("TileFlowDirection");
        },

        set TileFlowDirection(value) {
            val("TileFlowDirection", value);
        },

        //TileFontColor
        get TileFontColor() {
            return val("TileFontColor");
        },

        set TileFontColor(value) {
            val("TileFontColor", value);
        },

        //GroupMargin
        get GroupMargin() {
            return val("GroupMargin");
        },

        set GroupMargin(value) {
            val("GroupMargin", value);
        },

        //GroupTop
        get GroupTop() {
            return val("GroupTop");
        },

        set GroupTop(value) {
            val("GroupTop", value);
        },

        //GroupLeft
        get GroupLeft() {
            return val("GroupLeft");
        },

        set GroupLeft(value) {
            val("GroupLeft", value);
        },

        //GroupColumns
        get GroupColumns() {
            return val("GroupColumns");
        },

        set GroupColumns(value) {
            val("GroupColumns", value);
        },

        //GroupRows
        get GroupRows() {
            return val("GroupRows");
        },

        set GroupRows(value) {
            val("GroupRows", value);
        },

        //ShowNews
        get ShowNews() {
            return val("ShowNews");
        },

        set ShowNews(value) {
            val("ShowNews", value);
        },

        //NewsViewMode
        get NewsViewMode() {
            return val("NewsViewMode");
        },

        set NewsViewMode(value) {
            val("NewsViewMode", value);
        },

        //NewsWidth
        get NewsWidth() {
            return val("NewsWidth");
        },

        set NewsWidth(value) {
            val("NewsWidth", value);
        },

        //NewsHeight
        get NewsHeight() {
            return val("NewsHeight");
        },

        set NewsHeight(value) {
            val("NewsHeight", value);
        },

        //ShowImageNewsList
        get ShowImageNewsList() {
            return val("ShowImageNewsList");
        },

        set ShowImageNewsList(value) {
            val("ShowImageNewsList", value);
        },

        //NoBackgroundImage
        get NoBackgroundImage() {
            return val("NoBackgroundImage");
        },

        set NoBackgroundImage(value) {
            val("NoBackgroundImage", value);
        },

        //HasBackgroundImage
        get HasBackgroundImage() {
            return val("HasBackgroundImage");
        },

        set HasBackgroundImage(value) {
            val("HasBackgroundImage", value);
        },

        //BingBackgroundImage
        get BingBackgroundImage() {
            return val("BingBackgroundImage");
        },

        set BingBackgroundImage(value) {
            val("BingBackgroundImage", value);
        },

        //BackgroundOpacity
        get BackgroundOpacity() {
            return val("BackgroundOpacity");
        },

        set BackgroundOpacity(value) {
            val("BackgroundOpacity", value);
        },
		
        //BackgroundGrayscale
        get BackgroundGrayscale() {
            return val("BackgroundGrayscale");
        },

        set BackgroundGrayscale(value) {
            val("BackgroundGrayscale", value);
        },

        //BackgroundNoRepeat
        get BackgroundNoRepeat() {
            return val("BackgroundNoRepeat");
        },

        set BackgroundNoRepeat(value) {
            val("BackgroundNoRepeat", value);
        },

        //BackgroundFill
        get BackgroundFill() {
            return val("BackgroundFill");
        },

        set BackgroundFill(value) {
            val("BackgroundFill", value);
        },

        //BackgroundAdjust
        get BackgroundAdjust() {
            return val("BackgroundAdjust");
        },

        set BackgroundAdjust(value) {
            val("BackgroundAdjust", value);
        },

		//ShowBookmarksBar
        get ShowBookmarksBar() {
            return val("ShowBookmarksBar");
        },

        set ShowBookmarksBar(value) {
            val("ShowBookmarksBar", value);
        },
		
		//ShowOptionsButton
        get ShowOptionsButton() {
            return val("ShowOptionsButton");
        },

        set ShowOptionsButton(value) {
            val("ShowOptionsButton", value);
        },
		
		//OpeningAnimation
        get OpeningAnimation() {
            return val("OpeningAnimation");
        },

        set OpeningAnimation(value) {
            val("OpeningAnimation", value);
        },
		
		//OpeningAnimationTime
        get OpeningAnimationTime() {
            return val("OpeningAnimationTime");
        },

        set OpeningAnimationTime(value) {
            val("OpeningAnimationTime", value);
        },
				
        //LastSyncDate
        get LastSyncDate() {
            return val("LastSyncDate");
        },

        set LastSyncDate(value) {
            val("LastSyncDate", value);
        }

    }


})();