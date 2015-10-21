var ITEM_COUNT = 20;

var library = {
    items: [
    ]
};

var getParameterByName = function(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

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
        var elem = document.getElementById(this.id)
        if (elem.style['border-color']=='red'){
            elem.style['border-color']='transparent';
            _.find(library.items,{id: this.id}).selected = false;
        } else {
            elem.style['border-color']='red';
            _.find(library.items,{id: this.id}).selected = true;
        }
    });
    //o.addEventListener('dblclick', function (e) {
    //    var elem = document.getElementById(this.id);
    //});
}

var libContainer = document.createElement("div");
libContainer.className = 'libcontainer';

var libImg = document.createElement("img");
libImg.className = 'libimage';

var libEdit = document.createElement("i");
libEdit.className = 'fa fa-pencil-square-o fa-1';

var libItem = document.createElement("li");
libItem.className = 'libitem';
libItem.draggable = 'true';

var addToLibrary = function(item){
    library.items.push(item);
    var frag = document.createDocumentFragment();
    var im = libImg.cloneNode();
    im.src = item.img;
    im.id = item.id;

    var edit = libEdit.cloneNode();

    if(item.selected){
        im.style['border-color']='red';
    }
    var li = libItem.cloneNode();
    li.appendChild(im);
    li.appendChild(edit);
    frag.appendChild(li);
    addLibraryItemListeners(im);
    $('#library').append(frag);

    var options = {
        trigger: 'click',
        title: 'hello',
        content: 'craaaaap'
    }
    $('#'+item.id).popover(options);
};

var initLibrary = function(name) {
    $.getJSON('/videos/' + name, function(data){
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
};
var clockVideo = function(curSlot) {
    console.log(curSlot);
    //var slot = Math.floor(Math.random() * (video.items.length));
    //var data = video.items[slot];
    //var img = $("<img />").attr('src', data.img).attr('class','videoImage');
    //$('#movie').empty().append(img);
};
var initAudio = function(){
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    var source;
    audio = new Audio();
    audio.src = '/audio/alwaysDown.mp3';
    audio.controls = true;
    audio.autoplay = false;
    audio.loop = false;
    source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    var currenTimeNode = document.querySelector('#current-time');

    audio.addEventListener('timeupdate', function(e) {
        var currTime = audio.currentTime;
        currenTimeNode.textContent = currTime;
        clockVideo(currTime);
    }, false);

    $('#movie').on( "click", function(){
        if(audio.paused) {
            audio.play();
            $('#playgliph').hide();
        } else {
            audio.pause();
            $('#playgliph').show();
        }
    } );
    document.querySelector('#audio-controls').appendChild(audio);
}

var initBootstrap = function(){
    $('[data-toggle="popover"]').popover();
}

$(function () {
    initAreas();
    var vName = getParameterByName('video');
    initLibrary(vName? vName: 'default');
    initAudio();
    initAreas();
    initBootstrap();
});