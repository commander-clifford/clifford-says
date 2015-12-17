// GLOBAL VARS
var timer = 0, //this is the timer var, used for the game timer
	gameTimer = true,
	gameIO = false, // this is the on / off indicator
	flash = 200, // this is how fast the game buttons flash on during play
	series = [], // this is where the game series is stored

	curPlay = 0,
	numButtons = 4, // this is the number of game buttons, 4 is default

	bColors = ['red','green','yellow','blue'],
	buttons = $('.gameButton'), // these are the game buttons
	rButton = '', // this is the randomly chosen button on each turn
	stopButton = $('#stopButton'),
	playButton = $('#playButton');
	

//SOUND REGISTER
	// createjs.Sound.registerSound("dir/file.mp3", "soundName", true);


// GAME PLAY	
function spin(){
	setInterval(function(){
		// $('#gameButtons').css('-webkit-transform: rotate(10deg); -moz-transform: rotate(10deg); -ms-transform: rotate(10deg); transform: rotate(10deg);');
		$('#gameButtons').css('transform: rotate(0deg);');
	},1000);	
}


// Message Popup
function messagePop(message){
	$('#message').slideDown().text(message);
	setTimeout(function(){ $('#message').slideUp() },1500);
	// setTimeout(function(){ $('#message').text('') },2000);
}

// Browser Sniffr
(function(){
	var ua = navigator.userAgent,isMobile = /Mobile/.test(ua);
	if(isMobile){$('html').addClass('mobile');}else{$('html').addClass('desktop');}
})();



// BUTTON TRIGGERS
(function(){
	var ua = navigator.userAgent,isMobile = /Mobile/.test(ua);
	if(isMobile){
		playButton.bind('touchend',function(){ gamePlay('play') });
		stopButton.bind('touchend',function(){ gamePlay('stop') });
		buttons.bind('touchstart',function(e){ e.stopPropagation(); e.preventDefault(); buttons.removeClass('active'); $(this).addClass('active'); });
		buttons.bind('touchend',function(e){ e.stopPropagation(); e.preventDefault(); $(this).removeClass('active'); gamePlay(this); });
	}else{
		// buttons.bind('click',function(e){ e.stopPropagation(); e.preventDefault(); gamePlay(this) });
		playButton.bind('mouseup',function(){ gamePlay('play') });
		stopButton.bind('mouseup',function(){ gamePlay('stop') });
		buttons.bind('mousedown',function(e){ e.stopPropagation(); e.preventDefault(); buttons.removeClass('active'); $(this).addClass('active'); });
		buttons.bind('mouseup',function(e){ e.stopPropagation(); e.preventDefault(); $(this).removeClass('active'); gamePlay(this); });
	}
})();



// BUTTON SERIALS
$.each(buttons,function(i){ buttons.eq(i).addClass(bColors[i]).attr('buttonnum',i) });

// GAME PLAY
function gamePlay(pButton){
	
// PLAY BUTTON - GAME ON
	if( pButton == 'play' ){ 
		gameIO = true;
		setTimeout(timerCounter, 1000);
		$('#playButton').slideUp(); 
		$('#stopButton').slideDown(); 
		aiChooser();
	} else 
	
// STOP BUTTON - GAME OFF
	if( pButton == 'stop' ){
		gameIO = false; 
		series = [];

		curPlay = 0;
		resetTimer();
		$('#stopButton').slideUp(); 
		$('#playButton').slideDown(); 

		$('#series').html(series);
		$('#length').html(series.length);
		$('#step').html(curPlay);
	} else {  

// GAME BUTTON - GAME PLAY
		// alert( $(pButton).attr('buttonnum') );

		// Push the button styles
		// $(buttons).removeClass('active');
		// $(pButton).addClass('active');setTimeout(function(){$(pButton).removeClass('active')},flash);

		if(gameIO==true){

			// if the pressed button is the same as the new series number
			if($(pButton).attr('buttonnum')==series[curPlay] ){
				
				// update and display current turn variable
				curPlay++; $('#step').html(curPlay);

				// if last turn
				if( curPlay == series.length ){	
					// alert('good');

					messagePop('Great Job!');
					
					curPlay = 0;
					// reset and start timer
					resetTimer();
					
					// setTimeout(timerCounter, 1000);
					
					// start the next series
					setTimeout(function(){
						aiChooser();
					},2000);
					
				} else {
					// keep playing till last  turn
					// alert('keep going');
				}
			} else {
				// wrong button ( didn't match the series )
				// alert('WRONG IDIOT!!');
				messagePop('WRONG !!');
				gamePlay('stop');
			}
		}
	} // end if Buttons
} // end gamePlay function 

// AI CHOOSER
// if series exists - animate the series - then choose the next random button
function aiChooser(){
	var timeDelay = 400;//speed of random generation for looping button animation
	for (var i =  0; i <= series.length; i++) {
		// run the random chooser
		if(i==series.length){ 
			// run new choice
			setTimeout(function(){
				// choose the next random button
				var rButton = Math.floor(Math.random() * numButtons);
				// alert('chooser button: '+rButton);
				// flash the new random button
				buttons.eq(rButton).addClass('active');setTimeout(function(){ buttons.removeClass('active') },flash);
				// save the new random button to the series variable
				series.push(rButton);
				// update the display elements
				$('#step').html(curPlay); // the current side of the ratio
				$('#length').html(series.length); // the goal side of thr ratio
				$('#series').html(series);// the cheat code at the bottom	
				// re start timer 
				gameTimer = true;
				setTimeout(timerCounter, 1000);
				// end the loop - or get stuck in an infinite loop
				return;
			},timeDelay);
		}
		// run series animation
		(function(i){
			//slow down the series animation so each flash happens 400 milliseconds apart 
			setTimeout(function(){
				buttons.eq(series[i]).addClass('active');setTimeout(function(){ buttons.eq(series[i]).removeClass('active') },flash);
			},timeDelay);
			timeDelay+=400;//speed increments - same as timeDelay original var
		})(i);
	};
} // end aiChooser





/* =========================== */

//==TIMER
	/* add <div id="timer"></div> to document  */ 
	var timerCounter = function timerCounter(){
		if(true == gameIO && true == gameTimer){
			timer++;
			var seconds = timer %60;
			if(seconds<10){seconds = '0'+seconds;}
			var totalMinutes = Math.floor(timer/60);
			var minutes = totalMinutes%60;
			var hours = Math.floor(totalMinutes/60);
			if(hours<1){//if hours is 0
				var cvtimer =minutes+':'+seconds;
			}else if(hours>=1){//if hours is 1 or more
				var cvtimer =hours+':'+minutes+':'+seconds;
			}
			$('#timer').html(cvtimer);
			setTimeout(timerCounter, 1000);
		}
	}
	function resetTimer(){
		timer=0;//reset clicks counter back to 0
		$('#timer').html(timer+':00');//display the new timer position
		gameTimer = false;
	}

// FITUI
	$(window).ready(function(){
	// fitUI();	
});

$(window).resize(function(){
	// fitUI();	
});

function fitUI(){
	
	winwid = $(window).width();
	winhit = $(window).height();
	
	if(winhit > winwid){winhit = winwid * 1.6}
	if(winwid > winhit){winwid = winhit * 1.6}
	
	$('#gamePad').height(winhit);
	$('#gamePad').width(winwid);
	
	// $('.gameButton').height(winhit/2);
	// $('.gameButton').width(winwid/2);	
}