window.onload = function() {

	// Video
	var video = document.getElementById("video");

	// Buttons
	var playButton = document.getElementById("play-pause");
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


	// Event listener for the seek bar
	seekBar.addEventListener("change", function() {
		// Calculate the new time
		var time = video.duration * (seekBar.value / 100);

		// Update the video time
		video.currentTime = time;
	});


	// Update the seek bar as the video plays
	video.addEventListener("timeupdate", function() {
		// Calculate the slider value
		var value = (100 / video.duration) * video.currentTime;

		// Update the slider value
		seekBar.value = value;
	});


	// Pause the video when the seek handle is being dragged
	seekBar.addEventListener("mousedown", function() {
		video.pause();
	});

	// Play the video when the seek handle is dropped
	// TODO: track the current step on handler release
	seekBar.addEventListener("mouseup", function() {
		video.play();
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

		//Append step indicator to the video player's time track
		appendSteps(steps);

		//Step indicator onclick, set video's currentTime to the step time
		$('.step-indicator').on('click', function(){
			var that = this;
			video.currentTime = that.getAttribute('data-time')
			currentStep = that.textContent - 1;
			isSectionEnded = true;
		})

		//Stop when it comes to next step
		video.addEventListener('timeupdate', function(){
			for (var i = 1; i < steps.length; i++) {
				if(Math.floor(video.currentTime) == steps[i] && currentStep == i){
					video.pause();
					$(playButton).text('Next Step');
					isSectionEnded = true;
				}
			};
		})

		//Play to see next step
		video.addEventListener('play', function(){
			if(isSectionEnded){
				currentStep ++;
				toggleAccordion(currentStep);
				isSectionEnded = false;
			}
		})

		// Show play button on video pause
		video.addEventListener('pause', function(){
			$(playButton).removeClass('hide');
			if(isSectionEnded){
				playButton.innerHTML = "Next Step"
			}else{
				playButton.innerHTML = 'Play';
			}
		})

		// Hide play button on video playing
		video.addEventListener('playing', function(){
			$(playButton).addClass('hide');
			playButton.innerHTML = 'Pause';
		})
		//Select accordion to according point of the video
		selectAccordion(steps)
	}

	var appendSteps = function(array){
		for (var i = 0; i < array.length; i++) {
			var stepTime = array[i],
					stepPosition = stepTime/video.duration * 100,
					$tagSpan = $('<span class="step-indicator"/>').css('left', stepPosition + '%').text(i + 1).attr('data-time',stepTime);
			$('.seekbar-container').append($tagSpan);
		};
	}

	//Toggle accordion with the according step
	var toggleAccordion = function(step){
		var accordion = $('.collapse')[step -1];
		$('.collapse').not(accordion).removeClass('in');
		if(!$(accordion).hasClass('in')){
			$(accordion).addClass('in');
		}
	}

	//Select steps to go to the video point
	var selectAccordion = function(steps){
		$('.instruction').on('click', function(e){
			var target = e.target.text.trim().split(' ')[1] - 1;
			$('.step-indicator')[target].click();
		})
	}

	setupVideoPlayer();
}



