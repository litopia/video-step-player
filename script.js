window.onload = function() {

	// Video
	var video = document.getElementById("video");

	// Buttons
	var playButton = document.getElementById("play-pause");
	var lastStepBtn = document.getElementById('play-back');
	var muteButton = document.getElementById("mute");
	var fullScreenButton = document.getElementById("full-screen");

	// Sliders
	var seekBar = document.getElementById("seek-bar");
	var volumeBar = document.getElementById("volume-bar");


	// Event listener for the play/pause button
	playButton.addEventListener("click", function() {
		if (video.paused == true) {
			// Play the video
			video.play();
		} else {
			// Pause the video
			video.pause();
		}
	});


	// Event listener for the mute button
	muteButton.addEventListener("click", function() {
		if (video.muted == false) {
			// Mute the video
			video.muted = true;

			// Update the button text
			muteButton.innerHTML = "Unmute";
		} else {
			// Unmute the video
			video.muted = false;

			// Update the button text
			muteButton.innerHTML = "Mute";
		}
	});


	// Event listener for the full-screen button
	fullScreenButton.addEventListener("click", function() {
		if (video.requestFullscreen) {
			video.requestFullscreen();
		} else if (video.mozRequestFullScreen) {
			video.mozRequestFullScreen(); // Firefox
		} else if (video.webkitRequestFullscreen) {
			video.webkitRequestFullscreen(); // Chrome and Safari
		}
	});


	// Event listener for the volume bar
	volumeBar.addEventListener("change", function() {
		// Update the video volume
		video.volume = volumeBar.value;
	})



	var setupVideoPlayer = function(){
		var steps = document.getElementById('video-controls').getAttribute('data-stops').split(' '),
				currentStep = 1,
				isSectionEnded = false;

		$(lastStepBtn).hide();
		//Append step indicator to the video player's time track
		appendSteps(steps);

		//Step indicator onclick, set video's currentTime to the step time.
		//This part has the same logic with selecting an accordion
		$('.step-indicator').on('click', function(){
			var that = this;
			var step = that.getAttribute('data-step') -1;
			$('.accordion a')[step].click();
		})

		//
		$(lastStepBtn).on('click', function(){
			currentStep -= 1;
			video.currentTime = steps[currentStep];

			isSectionEnded = true;

			var accordion = currentStep + 1;
			toggleAccordion(accordion);

			_updatePlayBtnText();
		})

		// Keyup enter key to pause and play video
		document.addEventListener('keyup', function(e){
			if(e.keyCode === 32){
				video.paused ? video.play():video.pause();
			}
		})
		//Stop when it comes to next step
		video.addEventListener('timeupdate', function(){
			// Update the seek bar as the video plays

			// Calculate the slider value
			var value = (100 / video.duration) * video.currentTime;

			// Update the slider value
			seekBar.value = value;

			for (var i = 1; i < steps.length; i++) {
				if(Math.floor(video.currentTime) == steps[i] && currentStep == i){
					video.pause();
					_updatePlayBtnText();
					return isSectionEnded = true;
				}
			};
		})

		//Play to see next step
		video.addEventListener('play', function(){
			if(isSectionEnded){
				currentStep ++;
				isSectionEnded = false;
			}else{
				_calculateCurrentStep(video.currentTime);
				console.log(currentStep);
			}
			$('.play-container').addClass('hide');
			playButton.innerHTML = 'Pause';
			toggleAccordion(currentStep);
		})

		// Show play button on video pause
		video.addEventListener('pause', function(){
			$('.play-container').removeClass('hide');
			_updatePlayBtnText();
		})

		// Pause the video when the seek handle is being dragged
		seekBar.addEventListener("mousedown", function() {
			video.pause();
		});

		// Play the video when the seek handle is dropped
		seekBar.addEventListener("mouseup", function() {
			// Calculate the new time
			var time = video.duration * (seekBar.value / 100);

			// Update the video time
			video.currentTime = time;
			video.play();
		});

		//Select accordion to according point of the video
		$('.instruction').on('click', function(e){
			var target = e.target.text.trim().split(' ')[1] - 1;
			currentStep = target;
			isSectionEnded = true;
			video.pause();
			video.currentTime = steps[target];
			toggleAccordion(currentStep);
		})

		function _updatePlayBtnText(){
			if(currentStep > 0 && currentStep !== steps.length && isSectionEnded){
				playButton.innerHTML = 'Play Next Step';
				$(lastStepBtn).show();
			}else{
				playButton.innerHTML = 'Play';
				$(lastStepBtn).hide();
			}
		}

		function _calculateCurrentStep(time){
			//Calculate which step it is in
			if(video.currentTime !== 0){
				for (var i = steps.length - 1; i >= 0; i--) {
					if(time > steps[i]){
						return currentStep = i+1;
					}
				}
			}
			else{
				return currentStep = 1;
			}
		}

	}

	var appendSteps = function(array){
		for (var i = 0; i < array.length; i++) {
			var stepTime = array[i],
					stepPosition = stepTime/video.duration * 100 - 0.1,
					$tagSpan = $('<span class="step-indicator"/>').css('left', stepPosition + '%').text(i + 1).attr({'data-time':stepTime, 'data-step':i+1});
			$('.seekbar-container').append($tagSpan);
		};
	}

	//Toggle accordion with the according step
	var toggleAccordion = function(step){
		var accordion = $('.collapse')[step -1];
		$('.collapse').not(accordion).each(function(){
			var that = $(this);
			if(that.hasClass('in')){
				$(this).collapse('hide');
			}
		});
		if(!$(accordion).hasClass('in')){
			$(accordion).collapse('show');
		}
	}

	setupVideoPlayer();
}

// !function ($) {
// 	"use strict";

// 	/* STEP PLAYER PUBLIC CLASS DEFINITION
// 	 * =================================== */

// 	var StepPlayer = function(element, options){
// 		this.element = element;
// 	}

// 	StepPlayer.prototype = {
// 		constructor: StepPlayer,
// 		setup: function(){
// 			// Detect video player

// 			// Append video controller with step widgets

// 			// Establish relationship with the collapse sections
// 		},
// 		createVideoController: function(){

// 		}
// 	}

// 	/* STEP PLAYER PLUGIN DEFINITION
// 	 * ============================= */

// 	 var old = $.fn.stepplayer;

// 	 $.fn.stepplayer = function(option){
// 	 	return this.each(function(){
// 	 		var $this = $(this),

// 	 	})
// 	 }
// }(window.jQuery);

