// TODO
// 1. js+css滚动到底部后无法触发外部容器的滚动
// 2. 封装Angular组件
// 3. 可选：jQuery实现（使用mCustomScrollbar）
var initPos = {
        x: 0,
        y: 0
    },
    scrollBar = document.querySelector(".scroll-container .bar"),
    scrollContent = document.querySelector(".scroll-container .content"),
    barHeight,
    scrolledHeight = 0,
    sampleRatio = 2; // TODO how to set the best sample ratio


function clearTextSelection() {
    if (document.selection) {
        document.selection.empty();
    } else {
        window.getSelection().removeAllRanges();
    }
}

function setScrollBarHeight() {
    //var scrollContainer = document.querySelector(".j-scroll-container");
    //var scrollContent = document.querySelector(".j-scroll-container .content");
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

// mousedown event for bar-dragging event
scrollBar.addEventListener("mousedown", barMousedown);

// scroll is triggered only when it can be scrolled
scrollContent.addEventListener("wheel", function(event) {
    scrolledHeight += event.deltaY / sampleRatio;
    scrolledHeight = restrictScrollDelta(scrolledHeight);
    doScrollY(scrolledHeight);
    event.preventDefault();
    event.stopPropagation();
    return false;
});

// set init bar height
setScrollBarHeight();


