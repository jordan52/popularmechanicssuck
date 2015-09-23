var ITEM_COUNT = 20;

var library = {
    items: [
    ]
};

var resizeLibrary = function () {
    var h = ($('#library').height()/ 5) - 10;
    var w = ($('#library').width() / 4) - 10;
    var size = Math.min(h, w);
    $('.libitem').height(size);
    $('.libitem').width(size);
    $('.libimage').height(size);
    $('.libimage').width(size);
}

var addLibraryItemListeners = function (o) {
    o.addEventListener('click', function (e) {
        console.log(e);
        console.log(o);
        console.log(this)
        var elem = document.getElementById(this.id)
        if (elem.style['border-color']=='red'){
            elem.style['border-color']='transparent';
        } else {
            elem.style['border-color']='red';
        }

    });

}

var libImg = document.createElement("img");
libImg.className = 'libimage';
var libItem = document.createElement("li");
libItem.className = 'libitem';
libItem.draggable = 'true';

var addToLibrary = function(item){
    library.items.push(item);
    var frag = document.createDocumentFragment();
    var im = libImg.cloneNode();
    im.src = item.img;
    var li = libItem.cloneNode();
    li.id = item.id;
    li.appendChild(im);
    frag.appendChild(li);
    addLibraryItemListeners(li);
    $('#library').append(frag);
};

var initLibrary = function() {
    $.getJSON('/library', function(data){
        for(i=0; i < data.items.length && i<ITEM_COUNT ;i++) {
            addToLibrary(data.items[i]);
        }
    });
    resizeLibrary();
};


var initAreas = function(){
    var height = ($( window ).height()) - 50; //the 50 is an adjustment for dev

    var third = (height / 3);
    var sixth = (height / 6);
    var twelph = (height / 12);

    var movieHeight = (3 * third);
    var moviePix = movieHeight + 'px';
    var playPix = (movieHeight / 4) + 'px'

    $('#movie').height(movieHeight);
    $('#library').height((2 * third));
    $('#drop').height(sixth);

    //adjust the size of the playbutton
    $('#playgliph').css({'min-height': moviePix, 'line-height': moviePix, 'font-size': playPix,'text-align': 'center', color: '#216DD1'});

    resizeLibrary();
};
window.onresize = function() {
    initAreas();
}
$(function () {
    initAreas();
    initLibrary();
});