//ocho.js
var q = function (query, context, array) {

    if (context === true && !array) {
        array = true;
        context = document;
    } else {
		array = array || false;
	}

	if (typeof(context) === "string") {
		context = q(context);
	} else {
		context = context || document;
	}
	
    var result;
    var match = query.match(/^#([^\s,\.,#,\[]+)$/); //if #elementId then use getElementById
    if (match) {
        if (!context.getElementById) context = document;
        return context.getElementById(match[1]);
    } else {
        result = context.querySelectorAll(query);
        if (result.length > 1 || array) return Array.prototype.slice.call(result);
        else if (result.length == 1) return (array ? [result[0]] : result[0]);
        else return null;
    }
}

var assign = function(obj, prop, value) {
    if (typeof prop === "string")
        prop = prop.split(".");

    if (prop.length > 1) {
        var e = prop.shift();
        assign(obj[e] = Object.prototype.toString.call(obj[e]) === "[object Object]" ? obj[e] : {}, prop, value);
    } else
        obj[prop[0]] = value;
}

var getPropertyValue = function(obj, prop) {
 
    if (typeof prop === "string")
        prop = prop.split(".");

    if (prop.length > 1) {
        var e = prop.shift();
        
        if (obj[e] === undefined)
            return undefined;
        else
            return getPropertyValue(obj[e] = Object.prototype.toString.call(obj[e]) === "[object Object]" ? obj[e] : {}, prop);
    } else
        return obj[prop[0]];
    
    
}

var invertColor = function(hexColor) {
    var color = hexColor;
    color = color.substring(1);           // remove #
    color = parseInt(color, 16);          // convert to integer
    color = 0xFFFFFF ^ color;             // invert three bytes
    color = color.toString(16);           // convert to hex
    color = ("000000" + color).slice(-6); // pad with leading zeros
    color = "#" + color;                  // prepend #
    return color;
}

var JSONLocalStorage = {

    getItem: function (key) {
        var value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    },

    setItem: function (key, value) {
        var string = JSON.stringify(value);
        localStorage.setItem(key, string);
    }

};

var createTab = function (url) {

    new Promise(function (success, fail) {

        if (!window.lastTabIndex) {
            chrome.tabs.getCurrent(function (currentTab) {
                window.lastTabIndex = currentTab.index + 1;
                success(window.lastTabIndex);
            });
        } else {
            window.lastTabIndex++;
            success(window.lastTabIndex);
        }

    }).then(function (index) {
        chrome.tabs.create({ url: url, active: false, index: index });
    });

};

var navigate = function (url, mouseEvent) {

    if (url) {

        //Swayy
        if (MNTP.WebService)
            MNTP.WebService.sendSwayyEvent({ url: url, action: "click" });
        //<--

        if (mouseEvent && (mouseEvent.button == 1 || mouseEvent.ctrlKey)) {

            mouseEvent.preventDefault();
            createTab(url);

        } else {

            window.location = url;

        }


    }
}

var sendRequest = function (method, url, data, login, password) {

    return new Promise(function (success, fail) {

        var request = new XMLHttpRequest();

        if (login && password)
            request.open(method, url, true, login, password);
        else
            request.open(method, url, true);

        request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        //request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        request.addEventListener("load", function (event) {
            var response = event.target.response && JSON.parse(event.target.response);

            console.log("---------");
            console.log("XMLHttpRequest succeeded.");
            console.log(method + " " + url);

            data && console.log("Data sent:")
            data && console.log(JSON.parse(data));

            console.log("Status: " + event.target.status);
            console.log("Status text: " + event.target.statusText);

            response && console.log("Response received:")
            response && console.log(response);
            console.log("---------");

            success(response);
        });

        request.addEventListener("error", fail, false);

        if (data) {
            data = JSON.stringify(data);
            request.send(data);
        } else {
            request.send();
        }


    });

};

var getUserId = function () {

    return new Promise(function (success, fail) {

        if (!document.user_id) {
            chrome.identity.getProfileUserInfo(function (userInfo) {

                if (userInfo.id) {
                    document.user_id = userInfo.id;
                    success(userInfo.id);
                } else {
                    fail("error loading user id");
                }
            });
        } else {
            success(document.user_id);
        }

    });

};

var getDataUrlFromFile = function (file) {
    return new Promise(function (success, fail) {
        try {
            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = function (e) {
                success(e.target.result);
            };

            // Read in the image file as a data URL.
            reader.readAsDataURL(file);
        }
        catch (e) {
            fail(e);
        }
    });
};

var getDataUrlFromUrl = function (url, options) {
    return new Promise(function (success, fail) {

        try {

            var image = new Image();

            var canvas = document.createElement("canvas");
            var canvasContext = canvas.getContext("2d");

            image.onload = function () {

                canvas.width = image.width;
                canvas.height = image.height;

                canvasContext.drawImage(image, 0, 0, image.width, image.height);

                var dataURL = canvas.toDataURL();

                success({ dataURL: dataURL, options: options });
            };

            image.src = url;

        }
        catch (e) {
            fail(e);
        }

    });
};

var dataURLtoObjectURL = function (dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    var b = new Blob([ia], { type: mimeString });

    return URL.createObjectURL(b);
};


(function() {

    HTMLElement.prototype.hasClass = function (cssClass) {

        var contains = false;
        var classList = [];

        if (cssClass instanceof Array)
            classList = cssClass;
        else
            classList.push(cssClass);


        for (var i = 0; i < classList.length; i++) {
            if (this.classList.contains(classList[i])) {
                contains = true;
                break;
            }
        }

        return contains;

	};

	HTMLElement.prototype.addClass = function (cssClass) {
	    var classList = [];

	    if (cssClass instanceof Array)
	        classList = cssClass;
	    else
	        classList.push(cssClass);

	    for (var i = 0; i < classList.length; i++)
	        this.classList.add(classList[i]);
	    
		return this;
	};

	HTMLElement.prototype.removeClass = function (cssClass) {
	    var classList = [];

	    if (cssClass instanceof Array)
	        classList = cssClass;
	    else
	        classList.push(cssClass);

	    for (var i = 0; i < classList.length; i++)
	        this.classList.remove(classList[i]);

		return this;
	};

	HTMLElement.prototype.toggleClass = function (cssClass, toggle) {
	    
	    if (toggle !== undefined) {

	        if (typeof (toggle) === "string") {

	            if (this.hasClass(cssClass)) {
	                this.removeClass(cssClass);
	                this.addClass(toggle);
	            } else {
	                this.removeClass(toggle);
	                this.addClass(cssClass);
	            }

	        } else if (toggle === true) {
	            this.classList.add(cssClass);
	        } else {
	            this.classList.remove(cssClass);
	        }

	    } else {

	        if (this.hasClass(cssClass))
	            this.classList.remove(cssClass);
	        else
	            this.classList.add(cssClass);

	    }

	    return this;
	};

	HTMLElement.prototype.getIndex = function (cssClass) {
		if (this.offsetParent) {
			var nodeList = this.offsetParent.childNodes;

			for (var x = 0, y = 0; x < nodeList.length; x++) {
				if (nodeList[x].nodeType == Node.ELEMENT_NODE && (!cssClass || nodeList[x].matches(cssClass))) {
					if (nodeList[x] == this)
						return y;
					else
						y++;
				}
			}

		}

		return -1;

	};

	HTMLElement.prototype.getWindowOffset = function () {
		var e = this;

		var regex = "^(-?[0-9]+) ?px[;]?$";
		
		var matchHeight = e.style.height.match(regex);
		var height = matchHeight && parseInt(matchHeight[1]);
		
		var matchWidth = e.style.width.match(regex);
		var width = matchWidth && parseInt(matchWidth[1]);
		
		var matchLeft = e.style.left.match(regex);
		var left = matchLeft && parseInt(matchLeft[1]);
		
		var matchTop = e.style.top.match(regex);
		var top = matchTop && parseInt(matchTop[1]);

		var offset = {
			height: height || e.offsetHeight,
			width: width || e.offsetWidth,
			left: left || e.offsetLeft,
			top: top || e.offsetTop,
			centerX: 0,
			centerY: 0
		}

		while (e.offsetParent) {
			//var parentOffset = e.offsetParent.getWindowOffset();
			
			offset.left += e.offsetParent.offsetLeft;
			offset.top += e.offsetParent.offsetTop;

			e = e.offsetParent;
		}

		offset.centerX = Math.round(offset.left + (offset.width / 2));
		offset.centerY = Math.round(offset.top + (offset.height / 2));

		if (this.style.transform) {
			var match = this.style.transform.match("^translate\\((-?[0-9]+)px, (-?[0-9]+)px\\)$");

			if (match) {
				var translateX = parseInt(match[1]);
				var translateY = parseInt(match[2]);

				offset.left += translateX;
				offset.top += translateY;
				offset.centerX += translateX;
				offset.centerY += translateY;
			}
		}

		return offset;
	};

	HTMLElement.prototype.data = function (key, value) {

		if (key !== undefined && value !== undefined) {
			this.attributes["data-" + key] = value;
		} else if (key !== undefined) {
			var attr = this.attributes["data-" + key];
			if (attr) 
				return attr.value || attr;
		} else if (!key && !value) {
			
			var attrs = { };
			for (var attr in this.attributes) {
				if (attr.indexOf("data-") == 0) {
					attrs[attr] = this.attributes[attr];
				}
			}
			
			return attrs;
		}

	};

	HTMLElement.prototype.__addEventListener = HTMLElement.prototype.addEventListener;
	HTMLElement.prototype.addEventListener = function (event, func, id) {

        this.eventListeners = this.eventListeners || [];

	    var events = [];

	    if (event instanceof Array)
	        events = event;
	    else
	        events.push(event);

	    for (var i = 0; i < events.length; i++) {
	        var e = events[i];

	        var eventId;

	        if (id)
	            eventId = e + "_" + id;
	        else
	            eventId = e;

	        if (this.eventListeners.indexOf(eventId) == -1) {
	            this.__addEventListener(e, func);
	            this.eventListeners.push(eventId);
	        }
	    }
	}

	HTMLElement.prototype.remove =
		HTMLElement.prototype.remove ||
		HTMLElement.prototype.removeNode;

	HTMLElement.prototype.matches = 
		HTMLElement.prototype.matches || 
		HTMLElement.prototype.msMatchesSelector ||
		HTMLElement.prototype.mozMatchesSelector || 
		HTMLElement.prototype.webkitMatchesSelector;

})();