function pageY(elem) {
    return elem.offsetParent ? (elem.offsetTop + pageY(elem.offsetParent)) : elem.offsetTop;
}
var buffer = 0; //scroll bar buffer
function resizeIframe() {
    var height = document.documentElement.clientHeight;
    height -= pageY(document.getElementById('eventweek-iframe'))+ buffer ;
    height = (height < 0) ? 0 : height;
    document.getElementById('eventweek-iframe').style.height = height + 'px';
}
document.getElementById('eventweek-iframe').onload=resizeIframe;
window.onresize = resizeIframe;