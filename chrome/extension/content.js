sfl = {
	ready: false,
	data: null,
	song: null,
	logs: [],
	interval: null,
	slideInterval: null,
	song: null,
	photos: [],
	ui: {

		container: [
			'<section id="songzify">',
			'',
			'   <div class="frame">',
			'     ',
			'     <img class="img" src="//www.songzify.com/public/img/clear.gif">',
			'     ',
			'   </div>',
			'',
			'   <div class="cols">',
			'	  <div class="songza">',
			'       ',
			'       <div class="songinfo">',
			'         <span class="title"></span><br>',
			'         <span class="text"></span>',
			'         <span class="artist"></span>',
			'         <div class="links"></div>',
			'       ',
			'         <button data-action="playpause" class="on">Play / Pause</button>',
			'         <button data-action="skip">Skip</button>',
			'         <button data-action="ewskip">Ew</button>',
			'        ',
			'       </div>',
			'       ',
			'     </div>',
			'	  <div class="spotify">Spotify</div>',
			'	  <div class="flickr">Flickr</div>',
			'     <div style="clear: both; ">&nbsp;</div>',
			'   </div>',
			'',
			'   <ul class="logs"></ul>',
			'',
			'</section>'
		]
	}
};

function log(msg){
	if(sfl.ready){

		//Use console
		console.log(msg);

		//Add HTML to page?
		var $logs = $('#songzify').find('.logs');
		var $li = $('<li>' + msg + ' <span>' + (new Date()).getTime() + '</span></li>');
		$logs.append($li);
		if($logs.find('li:last').html().indexOf('4564773') != -1){
			
			//NOTE!! idk why but the interval stops without the log() message within the interval,
			// but these messages are annoying so hide them.
			$li.hide(); 

		}
		
		//Hide early ones
		if($logs.find('li:visible').length > 10){
			var $lis = $logs.find('li:visible');
			$($lis[0]).hide();
		}

	}
	else {
		var el = 
		$(function(){
			var el = $('#songzify');
			if(el.length){
				sfl.ready = true;
				sfl.logs.push(msg);
				for(var i = 0, j = sfl.logs.length; i < j; i++){
					log(sfl.logs[i]);
				}

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

//Shuffle function from http://goo.gl/wu1B7
sfl.shuffle = function(array){ 
	var i = array.length;
	if ( i == 0 ) return false;
	while ( --i ) {
		var j = Math.floor( Math.random() * ( i + 1 ) );
		var tempi = array[i];
	    var tempj = array[j];
	    array[i] = tempj;
	    array[j] = tempi;
    }
};

/**
	Gets photos from Flickr
	@return {Object} jQuery Deferred
*/
sfl.getPhotos = function(){

	var $result = $.Deferred();

	$.getJSON('http://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=ba85a562d715bf4f03475b533e174ef1&perpage=1000&format=json&nojsoncallback=1').done(function(data){

		if(data && data.photos && data.photos.total && data.photos.total > 0){
			log('Photos returned from Flickr! (6975966)');
			sfl.photos = data.photos.photo;
			sfl.shuffle(sfl.photos);
			$result.resolve(sfl.photos);
		}

	});


	return $result;

};

sfl.getPhotoUrls = function(photo){

	// See: http://www.flickr.com/services/api/misc.urls.html
	var url = '//www.songzify.com/public/img/clear.gif';
	var urls = {
		sq75: '',
		sq150: '',
		max240: '',
		max320: '',
		max640: '',
		max800: '',
		max1024: '',
		orig: ''
	};

	//If there's a valid photo parameter,
	if(photo && photo.farm && photo.server && photo.id && photo.secret){

		//Return flickr URLs for each size
		url = 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_{size}.jpg'
		for(name in urls){
			var sizes = ['m','s','t','z','b'];
			for(var i = 0, j = sizes.length; i < j; i++){
				urls[name] = url.replace('{size}', sizes[i]);
			}
		}

	}
	else {

		//Return clear gifs for each size
		for(name in urls){
			urls[name] = url;
		}

	}

	return urls;

};

sfl.showPhoto = function(){
	if(sfl.photos.length){

		var photo = sfl.photos.pop();
		if(photo){
			var urls = sfl.getPhotoUrls(photo);

			//Set the img src
			log('show this photo! (3285950)');
			log(JSON.stringify(photo));
			var $img = $('#songzify .img:visible');
			var $frame = $img.closest('.frame');
			$img.addClass('faded');
			setTimeout(function(){
				$img.hide();
				//$('body').css({backgroundSize: '100% 100%'}).css({background: 'url(' + urls.max1024 + ')'});
				$frame.append('<img class="img faded new" src="' + urls.orig + '"/>');
				$img.remove();
				setTimeout(function(){
					$frame.find('.img.new').removeClass('faded').removeClass('new');
				}, 1);
			}, 1000);
			
		}
	
	}
	else{

		//Get more photos
		sfl.getPhotos().done(function(){
			sfl.showPhoto();
		});

	}
};

sfl.getSongInfo = function(){

	//log('- sfl.getSongInfo() (9637137)');
	var result = null;

	if(sfl.ready){

		//log('  - sfl.ready (2915163)');

		var $playing = $('.szi-current-song:visible');

		if($playing.length){

			//log('    - $song.length (6985406)');
			var $song = $playing.find('.szi-song');
			var $artist = $playing.find('.szi-artist:last');
			if($song.length && $artist.length && $song.html().length && $artist.html().length){
				result = {
					title: $song.html(),
					artist: $artist.html()
				};
				//log('      - sfl.song: ' + JSON.stringify(sfl.song) + ' (5777570)');
			}
			else{
				//log('      - song didn\'t pass test.. (7244368)');
			}
		}
		else {
			//log('     - NOT $song.length (4306835)');
		}

	}

	return result;

};

sfl.pollForSongInfo = function(cb){
	
	if(!sfl.interval){
		sfl.interval = setInterval(function(){

			log('interval... (4564773)');

			//Show logs?
			var url = document.location.toString();
			$('#songzify ul.logs').toggleClass('show', (url.indexOf('logs=true') != -1));

			var song = sfl.getSongInfo();
			if(song){
				
				if(!sfl.song || (JSON.stringify(song) != JSON.stringify(sfl.song))){
					
					//Store the song
					sfl.song = song;

					//Display the song
					$('#songzify .songinfo').removeClass('linked').find('.title').html(song.title).end().find('.text').html(' by ').end().find('.artist').html(song.artist);

					//Add links to search results
					var searchLink = ('https://www.google.com/search?q={song}+site%3A{site}').replace('{song}', encodeURIComponent(song.title + ' by ' + song.artist));
					var spotifyLink = searchLink.replace('{site}', 'spotify.com');
					var youtubeLink = searchLink.replace('{site}', 'youtube.com');
					$('#songzify .songinfo').find('.links').html('<a href="' + spotifyLink + '" target="_blank">on Spotify</a><br><a href="' + youtubeLink + '" target="_blank">on YouTube</a>');

					//Ensure the Songza page is off-screen
					$('#body-delegate').addClass('sfl-songza').css({
						position: 'absolute',
						left: '0px',
						top: ($(window).height() + 100) + 'px',
					});

					//Callback
					cb(sfl.song);

				}
			}

			//Not returning anything seems to stop it
			return true;

		}, 1000);
	}


};

/**
	Checks Spotify API for this song using the song title and artist name	
	@param {Object} song (.title, .artist)
	@return {Object} jQuery Deferred
*/
sfl.getSpotifyLink = function(song){
	log('sfl.getSpotifyLink() (4180730)');
	var $result = $.Deferred(function($d){

		var url = 'http://ws.spotify.com/search/1/track.json?q={song}';

		$.getJSON(url.replace('{song}', encodeURIComponent(song.title + ' - ' + song.artist))).done(function(data){


			log('Spotify returned! (8464420)');
			//log(JSON.stringify(data));

			//Resolve outer deferred
			$d.resolve(data);

		});


	});
	return $result;
};


sfl.bindControls = function(){

	//Bind the image itself
	/*
	$('#songzify .img').click(function(){

		var $img = $(this).toggleClass('on');
		if($img.length){
			if($img.hasClass('on')){
				$img[0].webkitRequestFullScreen();
			}
			else{
				$img[0].webkitCancelFullScreen();
			}
		}

	});
	*/

	//Fade out controls when not in use
	sfl.controlTimeout = setTimeout(function(){$('#songzify .songinfo').addClass('faded'); }, 5000);
	$('#songzify').mousemove(function(){
		clearTimeout(sfl.controlTimeout);
		$(this).find('.songinfo').removeClass('faded');
		sfl.controlTimeout = setTimeout(function(){$('#songzify .songinfo').addClass('faded'); }, 5000);
	});

	//Bind Songza controls
	var $songza = $('.sfl-songza');
	var $buttons = $('#songzify .songza button');

	$buttons.click(function(){

		var $btn = $(this);
		var $controls = $songza.find('.szi-controls');
		var selector = '';

		switch($btn.data('action')){
			case 'playpause':

				$btn.toggleClass('on');
				$controls = $songza.find('.szi-control');
				if($btn.hasClass('on')){
					selector = '.szi-play';
				}
				else{
					selector = '.szi-pause';
				}

				break;
			case 'skip':

				selector = '.szi-skip-button';

				break;
			case 'ewskip':

				selector = '.szi-vote-down-button';

				break;
		}

		//Click Songza's button
		$controls.find(selector).click();

	});


};

$(function(){

	//Add Songzify container if we're on a Songza.com page (since we're authorized for multiple domains)
	if(document.location.toString().indexOf('songza.com') != -1){

		$('body').prepend(sfl.ui.container.join(''));

		//Start checking for song changes
		sfl.pollForSongInfo(function(song){

			//Bind controls
			sfl.bindControls();

			//If it's a new song,
			if(song){

				sfl.getSpotifyLink(song).done(function(){

					log('.... INDEED! (9107242)');

				});

			}

		});

		//Get photos...
		sfl.getPhotos().done(function(data){

			log('.... INDEED 2! (4767809)');

			//Show a photo and request fullscreen
			sfl.showPhoto();
			//$('#songzify #img')[0].requestFullScreen();

			//Start a slideshow interval 
			sfl.slideInterval = setInterval(function(){

				sfl.showPhoto();

			}, 10000);

		});
		
	}

});