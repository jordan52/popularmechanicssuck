var ITEM_COUNT = 20;

var video = {
    items: [
    ]
};


var share = function(){
    var name = $('#share-name').val();
    var errorMessage = 'ENTER A NAME!';
    if(!name){
        $('#share-name').val( errorMessage);
    } else if (! (name == errorMessage) && !(name == 'default') ) {
        console.log('sharing as' + name);
        video.name = name;
        var jqxhr = $.ajax({
            type: "POST",
            url:'/videoshare/',
            data: JSON.stringify(video),
            contentType: "application/json"

        });
        jqxhr.done( function(data){$('#share').click();});
        jqxhr.fail(function(jqxhr, status){alert('failed' + status);});

    } else {
        alert('use a different name');
    }
}

var initShare = function(){

    var share = document.querySelector('#share');
    var shareContent = " type the name of the video here <br>" +
        "<div class='input-group'> " +
        "  <div class='input-group-addon'>NAME</div> " +
        "  <input id='share-name' type='text' class='form-control' aria-label='NAME' value='" + video.name + "'> " +
        "  <span class='input-group-addon'><a onClick='share()' class='glyphicon glyphicon-save'></a></span>" +
        "</div><br>" +
        "<button data-dismiss='clickover' >Exit</button>"

    share.setAttribute('data-content', shareContent);
    $('#share').clickover({html:true, width: 400});
}

var getParameterByName = function(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

var getRandom = function(id){
    $('#' + id).attr("src", '/img/spinner_32.gif');
    $.getJSON('/random_img_src/' + name, function(data) {
        $('#' + id).attr("src", data.img);
        _.find(video.items,{id: id}).img = data.img;
        console.dir(video.items);
    });
}

var getFromUrl = function(id){
    var location = encodeURIComponent($('#dropUrl_'+id).val());
    $('#' + id).attr("src", '/img/spinner_32.gif');
    $.getJSON('/proxy/' + location , function(data){
        $('#dropUrl_'+id).val('');
        $('#' + id).attr("src", data.img);
        _.find(video.items,{id: id}).img = data.img;
        console.dir(video.items);
    });
}
var resizeVideo = function () {
    var h = ($('#video').height()/ 5) - 10;
    var w = ($('#video').width() / 4) - 10;
    var size = Math.min(h, w);
    $('.viditem').height(size);
    $('.viditem').width(size);
    $('.vidimage').height(size);
    $('.vidimage').width(size);
}

var addVideoItemListeners = function (o) {
    o.addEventListener('click', function (e) {
        var elem = document.getElementById(this.id)
        if (elem.style['border-color']=='red'){
            elem.style['border-color']='transparent';
            _.find(video.items,{id: this.id}).selected = false;
        } else {
            elem.style['border-color']='red';
            _.find(video.items,{id: this.id}).selected = true;
        }
    });
    //o.addEventListener('dblclick', function (e) {
    //    var elem = document.getElementById(this.id);
    //});
}

var vidContainer = document.createElement("div");
vidContainer.className = 'vidcontainer';

var imgContainer = document.createElement("div");
imgContainer.className = 'imgcontainer';

var vidImg = document.createElement("img");
vidImg.className = 'vidimage';

var contContainer = document.createElement("div");
contContainer.className = 'contcontainer';

var vidEdit = document.createElement("i");
vidEdit.className = 'fa fa-pencil fa-1 videdit';
vidEdit.setAttribute('data-original-title', "Modify!");

var vidRefresh = document.createElement("i");
vidRefresh.className = 'fa fa-refresh fa-1 vidrefresh';
vidRefresh.setAttribute('data-original-title', "Refresh!");

var vidItem = document.createElement("li");
vidItem.className = 'viditem';
vidItem.draggable = 'true';

var addToVideo = function(item){
    //add item to video datastructure
    video.items.push(item);

    var frag = document.createDocumentFragment();
    var im = vidImg.cloneNode();
    im.src = item.img;
    im.id = item.id;
    if(item.selected){
        im.style['border-color']='red';
    }

    var edit = vidEdit.cloneNode();
    edit.id = 'edit_' +item.id

    var editContent = "<button onClick='getRandom(\"" + item.id +"\")'>Get Random</button><br>" +
        " or paste the url of a gif<br>" +
        "<div class='input-group'> " +
        "  <div class='input-group-addon'>URL</div> " +
        "  <input id='dropUrl_" + item.id +"' type='text' class='form-control' aria-label='URL'> " +
        "  <span class='input-group-addon'><a onClick='getFromUrl(\"" + item.id +"\")' class='glyphicon glyphicon-chevron-right'></a></span>" +
        "</div><br>" +
        "<button data-dismiss='clickover' >Done</button>"

    edit.setAttribute('data-content', editContent);

    var refresh = vidRefresh.cloneNode();
    refresh.id = 'refresh_' +item.id

    refresh.onclick = function(){
        getRandom( item.id );
    }

    // create the div that holds the image and edit icon and add them
    var container = vidContainer.cloneNode();

    var imgcontainer = imgContainer.cloneNode();
    imgcontainer.appendChild(im);


    var cont = contContainer.cloneNode();
    cont.appendChild(edit);
    cont.appendChild(refresh);
    container.appendChild(imgcontainer);
    container.appendChild(cont);

    // create an li and add it to the fragment.
    var li = vidItem.cloneNode();
    li.appendChild(container)
    frag.appendChild(li);
    addVideoItemListeners(im);

    //add the li to the video.
    $('#video').append(frag);

    $('#'+'edit_' +item.id).clickover({html:true, width: 400});
};

var initVideo = function(name) {
    $.getJSON('/videos/' + name, function(data){
        for(i=0; i < data.items.length && i<ITEM_COUNT ;i++) {
            video.name = data.name;
            video.user = data.user;
            addToVideo(data.items[i]);
        }
        resizeVideo();
        initShare();
    });

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
    $('#video').height((2 * third));
    $('#drop').height(sixth);

    //adjust the size of the playbutton
    $('#playgliph').css({'min-height': moviePix, 'line-height': moviePix, 'font-size': playPix,'text-align': 'center', color: '#216DD1'});

    resizeVideo();
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

}

$(function () {
    initAreas();
    var vName = getParameterByName('video');
    initVideo(vName? vName: 'default');
    initAudio();
    initAreas();
    initBootstrap();
});