// angularJs scroll
angular.module('app', []).directive('jScroll', function() {
    var initPos = {
            x: 0,
            y: 0
        },
        scrollBar, scrollContent,
        barHeight,
        wheelDeltaSum = 0,
        scrolledHeight = 0,
        sampleRatio = 2; // TODO how to set the best sample ratio

    function init(scope, element, attrs) {
        scrollContent = element;
        var scrollDom = document.createElement("DIV");
        scrollDom.innerHTML = `<style>
        .j-scroll-container {
            position: relative;
        }
        
        .j-scroll-container .content {
            overflow: hidden;
            padding-right: 8px;
        }
        
        .j-scroll-container .scroll {
            position: absolute;
            right: 0;
            top: 0;
            width: 8px;
            background-color: #fff;
            box-shadow: inset 0 0 6px 1px rgba(244, 158, 66,.5);
            height: 100%;
            border-radius: 4px;
        }
        
        .j-scroll-container .scroll .bar {
            position: absolute;
            right: 0;
            top: 0;
            background-color: #f49e42;
            width: 8px;
            height: 60px;
            border-radius: 4px;
        }
        </style>
        <div class="bar"></div>`;
        scrollDom.classList.add("scroll");
        scrollContent.parentNode.classList.add("j-scroll-container");
        scrollContent.parentNode.insertBefore(scrollDom, scrollContent);

        // mousedown event for bar-dragging event
        scrollBar = scrollContent.parentNode.querySelector('.bar');
        scrollBar.addEventListener("mousedown", barMousedown);

        // scroll is triggered only when it can be scrolled
        scrollContent.addEventListener("wheel", function(event) {
            // sample for nice UX
            wheelDeltaSum += event.deltaY;
            scrolledHeight += event.deltaY / sampleRatio;
            scrolledHeight = restrictScrollDelta(scrolledHeight);
            doScrollY(scrolledHeight);
            event.preventDefault();
            event.stopPropagation();
            return false;
        });

        // set init bar height
        setScrollBarHeight();
    }

    function clearTextSelection() {
        if (document.selection) {
            document.selection.empty();
        } else {
            window.getSelection().removeAllRanges();
        }
    }

    function setScrollBarHeight() {
        var barRatio = scrollContent.clientHeight / scrollContent.scrollHeight;
        barHeight = barRatio * scrollContent.clientHeight;
        scrollBar.style.height = barHeight + "px";
    }

    function onMouseMove(moveEvent) {
        clearTextSelection();
        setScrollBarHeight();

        var deltaY = restrictScrollDelta(moveEvent.clientY - initPos.y);
        doScrollY(deltaY);
    }

    function restrictScrollDelta(deltaY) {
        if (deltaY < 0) {
            deltaY = 0;
        }

        if (deltaY > scrollContent.clientHeight - barHeight) {
            deltaY = scrollContent.clientHeight - barHeight;
        }
        return deltaY;
    }

    function doScrollY(deltaY) {
        scrollBar.style.top = deltaY + "px";
        scrollContent.scrollTop = deltaY;
    }

    function onMouseUp(upEvent) {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    }

    function barMousedown(event) {
        initPos.y = event.clientY;
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }

    return {
        restrict: 'A',
        "link": function(scope, element, attrs) {
            init(scope, element[0], attrs);
        },
        replace: false
    }
});