var _       = require('lodash-node');
var fs      = require('fs');

exports = module.exports = function (app){

    fs.readFile('./public/writable/videos.json', 'utf8', function (err, data) {
        console.log(data);
        app.locals.videos = JSON.parse(data);
    });

    return {
        getVideoNames: function() {
            return _.map(_.filter(app.locals.videos,function(video) {return true;}), function(video) { return video.name;});
        },
        getAllVideos: function () {
            // app.locals.videos is set when the persist directory is crawled
            return app.locals.videos;
        },
        getVideoByName : function (name){
            var match = _.where(app.locals.videos,{ name:name });

            if(match.length < 1){
                console.error(name + ' video not found');
                match = _.where(app.locals.videos,{ name:'default' });
            }

            return match[0];
        },
        saveVideo : function (v){
            //TODO: scrub input here!
            console.log('TODO: scrub input in video.saveVideo before you push it onto the struct');

            // overwrite if exists
            _.extend(_.findWhere(app.locals.videos, {name: v.name}), v);
            // if it is still not in there, you need to push it on the end.
            if(! _.findWhere(app.locals.videos, {name: v.name})) {
                app.locals.videos.push(v);
            }
        },
        checkpoint : function(){
            try {
                str = JSON.stringify(app.locals.videos) + '\n'
            } catch (err) {
                throw Error('unable to stringify videos');
            }
            fs.writeFile('./public/writable/videos.json', str)
        }
    }

}