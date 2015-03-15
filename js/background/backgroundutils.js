/// <reference path="../util.js" />

var MNTP = MNTP || {};

MNTP.BGUtils = (function () {

    _bingBackgroundImagesLoaded = false;
	_index = 0;
	_length = 8;
	
    return {

        getNextBingImage: function () {

            return new Promise(function (success, fail) {

                if (!_bingBackgroundImagesLoaded) {

                    var request = new XMLHttpRequest();

                    request.open("GET", "http://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=8", true);

                    request.setRequestHeader("Content-Type", "application/json");

                    request.addEventListener("load", function (event) {

                        var baseUrl = "http://www.bing.com";

                        if (event.target.response) {

                            var response = JSON.parse(event.target.response);

                            if (response.images && response.images.length > 0) {

                                for (var i = 0; i < response.images.length; i++)
                                    response.images[i].url = baseUrl + response.images[i].url;

                                success(response.images[_index]);
								
								var worker = new Worker(chrome.extension.getURL("js/background/bingworker.js"));
								var saveCount = 0;
								
								worker.onmessage = function(event) {
									
									MNTP.IDB.save(MNTP.IDB.OS.Image, event.data, true).then(function() {
										
										saveCount++;
										
										if (saveCount >= response.images.length)
											_bingBackgroundImagesLoaded = true;
											
									});
									
								};

								worker.postMessage(response.images);

                            }
                        }
                    });

                    request.send();

                } else {
					
					MNTP.IDB.get(MNTP.IDB.OS.Image, ["BingBackground", _index + 1]).then(success, fail)

                }
				
				_index++;
				
				if (_index >= _length)
					_index = 0;

            });
        }
    }
})();