var initPos = {x:0,y:0};

function onMouseMove(moveEvent) {
    var scrollContainer = document.querySelector(".j-scroll-container");
    var scrollContent = document.querySelector(".j-scroll-container .content");
    var scrollBar = document.querySelector(".j-scroll-container .bar");
    var barRatio = scrollContent.clientHeight / scrollContent.scrollHeight;
    scrollBar.style.height = barRatio * scrollContent.clientHeight + 'px';
    var deltaY = moveEvent.clientY - initPos.y;
    scrollBar.style.top = deltaY + 'px';
}

function onMouseUp(upEvent) {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
}

function barMousedown(event) {
    initPos.x = event.clientX;
    initPos.y = event.clientY;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}