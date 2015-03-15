/// <reference path="util.js" />

(function () {

    HTMLElement.prototype.enableCustomDragging = function (selector, options) {

        var defaultOptions = {
            pixeldelay: 10,
            translate: true,
            dragInitiator: ""
        };

        if (options) {
            for (var o in defaultOptions) {
                if (options[o] === undefined)
                    options[o] = defaultOptions[o];
            };
        } else {
            options = defaultOptions;
        }

        var dragEvent = {
            dragElement: null,
            toElement: null,
            closestElement: null,
            mouseDown: false,
            dragging: false,
            initialOffsetX: 0,
            initialOffsetY: 0,
            initialMouseX: 0,
            initialMouseY: 0,
            deltaX: 0,
            deltaY: 0
        };

        var dispatch = function (event) {
            var detail = {};

            for (var i in dragEvent)
                detail[i] = dragEvent[i];

            event && event(detail);
        };

        var request = {
            dragstart: function (callback) { response.dragstart = callback; },
            dragmove: function (callback) { response.dragmove = callback; },
            dragend: function (callback) { response.dragend = callback; }
        };

        var response = {
            dragstart: null,
            dragmove: null,
            dragend: null
        }

        var mouseEvents = {

            mousedown: function (event) {

                if (event.button == 0) {
                    var activateDrag = false;
                    var dragInitiatorSelector = options.dragInitiator || selector;

                    if (event.target && event.target.matches(dragInitiatorSelector)) {

                        activateDrag = true;

                    } else if (event.path) {

                        for (var i = 0; i < event.path.length; i++) {
                            if (event.path[i].nodeType == Node.ELEMENT_NODE && event.path[i].matches(dragInitiatorSelector)) {
                                activateDrag = true;
                                break;
                            }
                        }

                    } else {

                        var parent = event.target.offsetParent;

                        while (parent) {
                            if (parent.matches(dragInitiatorSelector)) {
                                activateDrag = true;
                                break;
                            } else {
                                parent = parent.offsetParent;
                            }
                        }

                    }

                    if (activateDrag) {

                        var target = event.target;

                        while (target) {
                            if (target.matches(selector)) {
                                break;
                            } else {
                                target = target.offsetParent;
                            }
                        }

                        if (target) {

                            var targetOffset = target.getWindowOffset();

                            dragEvent.dragElement = target;
                            dragEvent.mouseDown = true;

                            dragEvent.initialMouseX = event.pageX;
                            dragEvent.initialMouseY = event.pageY;

                            dragEvent.initialOffsetX = targetOffset.left;
                            dragEvent.initialOffsetY = targetOffset.top;

                        }
                    }
                }
            },

            mousemove: function (event) {

                if (dragEvent.mouseDown) {

                    dragEvent.deltaX = event.pageX - dragEvent.initialMouseX;
                    dragEvent.deltaY = event.pageY - dragEvent.initialMouseY;

                    if (Math.abs(dragEvent.deltaX) + Math.abs(dragEvent.deltaY) > options.pixeldelay) {

                        if (!dragEvent.dragging) {
                            dragEvent.dragging = true;

                            dispatch(response.dragstart);

                            if (options.translate) {
                                var elementOffset = dragEvent.dragElement.getWindowOffset();

                                dragEvent.dragElement = q("body").insertBefore(dragEvent.dragElement, null);

                                dragEvent.dragElement.style.top = elementOffset.top + "px";
                                dragEvent.dragElement.style.left = elementOffset.left + "px";
                            }

                        }
                    }

                    if (dragEvent.dragging) {

                        if (options.translate) {
                            dragEvent.dragElement.style.left = (dragEvent.initialOffsetX + dragEvent.deltaX) + "px";
                            dragEvent.dragElement.style.top = (dragEvent.initialOffsetY + dragEvent.deltaY) + "px";
                        }

                        dragEvent.toElement = collisionEvents.getToElement();

                        if (!dragEvent.toElement)
                            dragEvent.closestElement = collisionEvents.getClosestElement();

                        dispatch(response.dragmove);
                    }
                }

            },

            mouseup: function (event) {

                if (dragEvent.dragging) {

                    dragEvent.deltaX = event.pageX - dragEvent.mouseX;
                    dragEvent.deltaY = event.pageY - dragEvent.mouseY;

                    if (options.translate) {
                        //dragEvent.dragElement.style.position = "";
                    }

                    dispatch(response.dragend);

                }

                dragEvent.dragging = false;
                dragEvent.mouseDown = false;

            }

        }

        var collisionEvents = {

            getToElement: function () {

                var targets = q(selector, true);

                var dragElementOffset = dragEvent.dragElement.getWindowOffset();

                var winner = null;

                for (var i = 0; i < targets.length; i++) {

                    var target = targets[i];

                    if (target != dragEvent.dragElement) {

                        //target.style.background = "";
                        //target.style.border = "";

                        var targetOffset = target.getWindowOffset();

                        //Center of the element colids with the center of another
                        if ((dragElementOffset.centerX > targetOffset.left) &&
                            (dragElementOffset.centerX < targetOffset.left + targetOffset.width) &&
                            (dragElementOffset.centerY > targetOffset.top) &&
                            (dragElementOffset.centerY < targetOffset.top + targetOffset.height)) {
                            winner = target;
                        }

                    }
                }

                //if (winner)
                //    winner.style.border = "2px solid blue";

                return winner;

            },

            getClosestElement: function () {

                var targets = q(selector, true);

                var dragElementOffset = dragEvent.dragElement.getWindowOffset();

                var closest = null;
                var closestDistance = null;

                for (var i = 0; i < targets.length; i++) {

                    var target = targets[i];

                    if (target != dragEvent.dragElement) {

                        //target.style.background = "";
                        target.style.border = "";

                        var targetOffset = target.getWindowOffset();

                        //a² + b² = c²
                        var a = Math.abs(dragElementOffset.centerX - targetOffset.centerX);
                        var b = Math.abs(dragElementOffset.centerY - targetOffset.centerY);
                        var c = Math.sqrt((a * a) + (b * b));

                        //var rgb = 255 - Math.round(c * 0.5);
                        //target.style.background = 'rgb(' + rgb + ',' + rgb + ',' + rgb + ')';

                        if (!closest || c < closestDistance) {
                            closest = target;
                            closestDistance = c;
                        }

                    }
                }

                //if (closest)
                //    closest.style.border = "2px solid red";

                return closest;

            }

        }


        this.addEventListener("mousedown", mouseEvents.mousedown, "dragmousedown" + selector);

        this.addEventListener("mousemove", mouseEvents.mousemove, "dragmousemove" + selector);

        this.addEventListener("mouseup", mouseEvents.mouseup, "dragmouseup" + selector);

        return request;
    };


})();