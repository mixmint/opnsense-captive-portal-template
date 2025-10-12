/* ---------------------------------------------------------------------- */
/* "Polyglot" Language Switcher
/* ----------------------------------------------------------------------
Version: 2.2
Original Author: Ixtendo
Original Author URI: http://www.ixtendo.com
Modified by: Mirosław Majka
Modification Date: 2025-10-09
License: MIT License
License URI: http://www.opensource.org/licenses/mit-license.php
------------------------------------------------------------------------- */

/**
 * MODIFICATIONS by Mirosław Majka:
 * - Added "mouse-scroll" indicator for overflowing dropdowns.
 * - Mouse-scroll fades in/out with smooth animations.
 * - Arrows (.arrow) initially paused and opacity 0; start on dropdown open (.active).
 */

/* ---------------------------------------------------------------------- */
/* jquery.timer.js
/* ----------------------------------------------------------------------
Copyright (c) 2011 Jason Chavannes <jason.chavannes@gmail.com>
Original License: MIT
This part of the code remains unmodified.
------------------------------------------------------------------------- */

(function ($) {
    $.timer = function(func, time, autostart) {
        this.set = function(func, time, autostart) {
            this.init = true;
            if (typeof func == 'object') {
                var paramList = ['autostart', 'time'];
                for (var arg in paramList) {
                    if (func[paramList[arg]] != undefined) {
                        eval(paramList[arg] + " = func[paramList[arg]]");
                    }
                };

                func = func.action;
            }

            if (typeof func == 'function') {
                this.action = func;
            }

            if (!isNaN(time)) {
                this.intervalTime = time;
            }

            if (autostart && !this.active) {
                this.active = true;
                this.setTimer();
            }

            return this;
        };

        this.once = function(time) {
            var timer = this;
            if (isNaN(time)) {
                time = 0;
            }

            window.setTimeout(function() {timer.action();}, time);
            
            return this;
        };

        this.play = function(reset) {
            if (!this.active) {
                if(reset) {
                    this.setTimer();
                } else {
                    this.setTimer(this.remaining);
                }

                this.active = true;
            }

            return this;
        };

        this.pause = function() {
            if (this.active) {
                this.active     = false;
                this.remaining -= new Date() - this.last;

                this.clearTimer();
            }

            return this;
        };

        this.stop = function() {
            this.active    = false;
            this.remaining = this.intervalTime;

            this.clearTimer();

            return this;
        };

        this.toggle = function(reset) {
            if (this.active) {
                this.pause();
            } else if (reset) {
                this.play(true);
            } else {
                this.play();
            }

            return this;
        };

        this.reset = function() {
            this.active = false;
            this.play(true);

            return this;
        };

        this.clearTimer = function() {
            window.clearTimeout(this.timeoutObject);
        };

        this.setTimer = function(time) {
            var timer = this;
            if (typeof this.action != 'function') {
                return;
            }

            if (isNaN(time)) {
                time = this.intervalTime;
            }

            this.remaining = time;
            this.last      = new Date();

            this.clearTimer();
            
            this.timeoutObject = window.setTimeout(function() {timer.go();}, time);
        };

        this.go = function() {
            if (this.active) {
                this.action();
                this.setTimer();
            }
        };

        if (this.init) {
            return new $.timer(func, time, autostart);
        } else {
            this.set(func, time, autostart);
            return this;
        }
    };

    $.fn.polyglotLanguageSwitcher = function (op) {
        var ls              = $.fn.polyglotLanguageSwitcher;
        var rootElement     = $(this);
        var rootElementId   = $(this).attr('id');
        var ulElement       = $("<ul class=\"dropdown\">");
        var length          = 0;
        var isOpen          = false;
        var liElements      = [];
        var settings        = $.extend({}, ls.defaults, op);
        var isStaticWebSite = settings.websiteType == 'static';
        var aElement,
            closePopupTimer;
        
        init();
        installListeners();

        function triggerEvent(evt) {
            if (settings[evt.name]) {
                settings[evt.name].call($(this), evt);
            }
        }

        function open() {
            if (!isOpen) {
                triggerEvent({name: 'beforeOpen', element: rootElement, instance: ls});
                aElement.addClass("active");
                doAnimation(true);
                addMouseScroll();

                setTimeout(function () {
                    isOpen = true;
                    triggerEvent({name: 'afterOpen', element: rootElement, instance: ls});
                }, 100);
            }
        }

        function close() {
            if (isOpen) {
                triggerEvent({name: 'beforeClose', element: rootElement, instance: ls});
                removeMouseScroll();
                doAnimation(false);
                aElement.removeClass("active");
                isOpen = false;

                if (closePopupTimer && closePopupTimer.active) {
                    closePopupTimer.clearTimer();
                }

                triggerEvent({name: 'afterClose', element: rootElement, instance: ls});
            }
        }

        function suspendCloseAction() {
            if (closePopupTimer && closePopupTimer.active) {
                closePopupTimer.pause();
            }
        }

        function resumeCloseAction() {
            if (closePopupTimer) {
                closePopupTimer.play(false);
            }
        }

        function addMouseScroll() {
            const layoutType = settings.layout?.lang_layout || 'select';
            if (layoutType === 'flags-list') {
                return;
            }

            const ul            = ulElement;
            const contentHeight = ul[0].scrollHeight;
            const maxHeightStr  = window.getComputedStyle(ul[0]).maxHeight;
            let maxHeight       = parseFloat(maxHeightStr);

            if (maxHeightStr === 'none') {
                maxHeight = Infinity;
            }

            if (contentHeight <= maxHeight) {
                return;
            }

            if (ul.next(".mouse-scroll").length === 0) {
                const scrollEl = $(`
                    <div class="mouse-scroll" style="display:none;">
                        <div class="mouse">
                            <div class="wheel"></div>
                        </div>
                        <div>
                            <span class="arrow item1"></span>
                            <span class="arrow item2"></span>
                            <span class="arrow item3"></span>
                        </div>
                    </div>
                `);

                ul.after(scrollEl);
                scrollEl.fadeIn(settings.animSpeed, function() {
                    scrollEl.addClass('active');
                });
            }
        }

        function removeMouseScroll() {
            var ul = ulElement;
            var scrollEl = ul.next(".mouse-scroll");

            if (scrollEl.length > 0) {
                scrollEl.stop(true, true).fadeOut(settings.animSpeed, function() {
                    scrollEl.remove();
                });
            }
        }

        function doAnimation(open) {
            if (settings.effect == 'fade') {
                if (open) {
                    ulElement.fadeIn(settings.animSpeed);
                } else {
                    ulElement.fadeOut(settings.animSpeed);
                }
            } else {
                if (open) {
                    ulElement.slideDown(settings.animSpeed);
                } else {
                    ulElement.slideUp(settings.animSpeed);
                }
            }
        }

        function doAction(item) {
            close();
            var selectedAElement  = $(item).children(":first-child");
            var selectedId        = $(selectedAElement).attr("id");
            var selectedAriaLabel = $(selectedAElement).attr("aria-label");
            var selectedTitle     = $(selectedAElement).attr("title");
            var selectedText      = $(selectedAElement).text();

            $(ulElement).children().each(function () {
                $(this).detach();
            });

            for (var i = 0; i < liElements.length; i++) {
                if ($(liElements[i]).children(":first-child").attr("id") != selectedId) {
                    ulElement.append(liElements[i]);
                }
            }
            var innerSpanElement = aElement.children(":first-child");
            aElement.attr("id", selectedId);
            aElement.attr("aria-label", selectedAriaLabel);
            aElement.attr("title", selectedTitle);
            aElement.text(selectedText);
            aElement.append(innerSpanElement);
        }

        function installListeners() {
            $(document).click(function () {
                close();
            });

            $(document).keyup(function (e) {
                if (e.which == 27) {
                    close();
                }
            });

            if (settings.openMode == 'hover') {
                closePopupTimer = $.timer(function () {
                    close();
                });

                closePopupTimer.set({ time:settings.hoverTimeout, autostart:true });
            }
        }

        function init() {
            var selectedItem;
            var options = $("#" + rootElementId + " > form > select > option");
            if (isStaticWebSite) {
                var selectedId;
                var url = window.location.href;
                options.each(function(){
                    var id = $(this).attr("id");
                    if (url.indexOf('/'+id+'/')>=0) {
                        selectedId = id;
                    }
                });
            }
            options.each(function () {
                var id = $(this).attr("id");
                var selected;

                if (isStaticWebSite) {
                    selected = selectedId === id;
                } else {
                    selected = $(this).attr("selected");
                }

                var liElement = toLiElement($(this));
                if (selected) {
                    selectedItem = liElement;
                }

                liElements.push(liElement);
                if (length > 0) {
                    ulElement.append(liElement);
                } else {
                    let triggerLabel = rootElement.attr('data-trigger-label') || $(this).attr('aria-label');
                    aElement = $("<a id=\"" + $(this).attr("id") + "\" class=\"current\" href=\"javascript:void(0);\" title=\"" + $(this).attr("data-title") + "\" aria-label=\"" + $(this).attr("aria-label") + "\" tabindex=\"0\">" + $(this).text() + " <span class=\"trigger\" role=\"button\" tabindex=\"0\" aria-label=\"" + triggerLabel + "\"></span></a>");

                    if (settings.openMode == 'hover') {
                        aElement.hover(function () {
                            open();
                            suspendCloseAction();
                        }, function () {
                            resumeCloseAction();
                        });
                    } else {
                        aElement.click(
                            function () {
                                open();
                            }
                        );
                    }
                }

                length++;
            });

            $("#" + rootElementId + " form:first-child").remove();
            rootElement.append(aElement);
            rootElement.append(ulElement);

            if (selectedItem) {
                doAction(selectedItem);
            }
        }

        function toLiElement(option) {
            var id = $(option).attr("id");
            var value = $(option).attr("value");
            var aria_label = $(option).attr("aria-label");
            var title = $(option).attr("data-title");
            var text = $(option).text();
            var liElement;

            if (isStaticWebSite) {
                var url = window.location.href;
                var page = url.substring(url.lastIndexOf("/")+1);
                var urlPage = 'http://' + document.domain + '/' + settings.pagePrefix + id + '/' + page;
                liElement = $("<li><a id=\"" + id + "\" href=\"" + urlPage + "\" title=\"" + title + "\" aria-label=\"" + aria_label + "\" tabindex=\"0\">" + text + "</a></li>");
            } else {
                var href = document.URL.replace('#', '');
                var params = parseQueryString();
                params[settings.paramName] = value;
                if (href.indexOf('?') > 0) {
                    href = href.substring(0, href.indexOf('?'));
                }
                href += toQueryString(params);
                liElement = $("<li><a id=\"" + id + "\" href=\"" + href + "\" title=\"" + title + "\" aria-label=\"" + aria_label + "\" tabindex=\"0\">" + text + "</a></li>");
            }

            liElement.bind('click', function () {
                triggerEvent({name:'onChange', selectedItem: $(this).children(":first").attr('id'), element:rootElement, instance:ls});
                doAction($(this));
            });

            if (settings.openMode == 'hover') {
                liElement.hover(function () {
                    suspendCloseAction();
                }, function () {
                    resumeCloseAction();
                });
            }

            return liElement;
        }

        function parseQueryString() {
            var params = {};
            var query = window.location.search.substr(1).split('&');
            if (query.length > 0) {
                for (var i = 0; i < query.length; ++i) {
                    var p = query[i].split('=');
                    if (p.length != 2) {
                        continue;
                    }
                    params[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
                }
            }
            return params;
        }

        function toQueryString(params) {
            var queryString = '?';
            var i = 0;
            for (var param in params) {
                var x = '';
                if (i > 0) {
                    x = '&';
                }
                queryString += x + param + "=" + params[param];
                i++;
            }
            if (settings.noRefresh) {
                queryString += '#';
            }
            return queryString;
        }

        ls.open = function () {
            open();
        };

        ls.close = function () {
            close();
        };

        triggerEvent({
            name:'afterLoad',
            element:rootElement,
            instance:ls
        });

        return ls;
    };

    var ls = $.fn.polyglotLanguageSwitcher;
    ls.defaults = {
        openMode:'click',
        hoverTimeout:1500,
        animSpeed:200,
        effect:'slide',
        paramName:'lang',
        pagePrefix:'',
        websiteType:'dynamic',
        noRefresh:false,
        onChange:NaN,
        afterLoad:NaN,
        beforeOpen:NaN,
        afterOpen:NaN,
        beforeClose:NaN,
        afterClose:NaN
    };
})(jQuery);
