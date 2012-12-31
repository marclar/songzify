var sfl = {
	ready: false,
	data: null,
	song: null,
	el: null,
	logs: [],
	interval: null,
	song: null
};

function log(msg){
	if(sfl.el){
		sfl.el.find('.logs').append('<li>' + msg + '</li>');
	}
	else {
		var el = 
		$(function(){
			var el = $('#songzify');
			if(el.length){
				sfl.ready = true;
				sfl.el = el;
				sfl.logs.push(msg);
				for(var i = 0, j = logs.length; i < j; i++){
					log(sfl.logs[i]);
				}
				delete sfl.logs;

				//Try to parse data from DOM
				try{
					var data = document.getElementById('json-data');
					sfl.data = JSON.parse(data);
				}
				catch(e){
					//Do nothing
					sfl.data = null;
				}

			}
		});
	}
}


sfl.getSongInfo = function(){

	log('- sfl.getSongInfo() (9637137)');

	if(sfl.ready){

		var $song = sfl.el.find('.szi-current-song:visible');

		if($song.length){
			sfl.song = null;
			var $song = $song.find('.szi-song');
			var $artist = $song.find('.szi-artist:last');
			if($song.length && $artist.length && $song.html().length && $artist.html().length){
				sfl.song = {
					title: $song.html(),
					artist: $artist.html()
				};
			}
		}

	}

	return sfl.song;

};

sfl.pollForSongInfo = function(){
	
	if(sfl.interval){
		sfl.interval = setInterval(function(){

			var song = getSongInfo();
			if(song && !sfl.song && (song.title != sfl.song.title || song.artist != sfl.song.artist)){
				sfl.song = song;
				log('- NEW SONG: ' + JSON.stringify(sfl.song) + ' (7479285)');
			}

		}, 1000);
	}


};


$(function(){

	var html = ['<div id="songzify" style="width: 100%; background: black; padding: 10px; color: yellow; ">'];
	html.push('    <ul class="logs">');
	html.push('      <li>INSERTED BY CONTENT SCRIPT!!!!! (5250191)</li>')
	html.push('    </ul>');
	html.push('<script type="text/javascript">log("hi! (1240518)");</script>');
	html.push('</div>');
	$('body').prepend(html.join(''))


	//sfl.pollForSongInfo();
	setTimeout(function(){

		sfl.el.find('.logs').append('<li>... and den??? (1180318)</li>');

	}, 1000);


});