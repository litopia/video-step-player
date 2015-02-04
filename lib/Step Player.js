/*! Step Player - v0.0.0 - 2015-2-3
 * Copyright (c) 2015 litopia
 * Licensed under the MIT license. */
(function($, videojs) {
  'use strict';

  var defaults = {
        accordion: true,
        classname: 'vjs-stepplayer',
        keyboard: true,
        onReachedCallback: null,
        steps: []
      },
      StepPlayer;

  /**
   * Initialize the plugin.
   * @param options (optional) {object} configuration for the plugin
   */
  StepPlayer = function(options) {
    var settings = videojs.util.mergeOptions(defaults, options),
        player = this,
        videoWrapper = $(this.el()),
        stepHandler = null,
        currentStep, isAtStepEnd;

    function sortStepLists(stepList){
      // sort the list by time in asc order
      stepList.sort(function(a, b){return a.time - b.time});
    }

    function attachStepHandlers(stepList){
      var duration = player.duration(),
          position;

      videoWrapper.find('.vjs-progress-control').append('<div class="vjs-stephandler"></div>');

      sortStepLists(stepList);
      stepList.forEach(function(item, index){
        //calculate position
        position = item.time/duration * 100 + '%';
        //attache step handlers to video control section
        stepHandler = $('<span class="vjs-tip"></span>').text(index + 1).css('left', position);
        videoWrapper.find('.vjs-stephandler').append(stepHandler);
      })
    }

    function setupKeyboardControl(){
      //setup keyboard control for play and pause
      $(document).on('keyup', function(e){
        if(e.keyCode === 32){
          player.paused() ? player.play():player.pause();
        }
      })
    }

    function onMarkerReached(stepsList){
      var currentTime;

      currentTime = player.currentTime();
      console.log(currentTime);
      stepsList.forEach(function(item, index){
        if(Math.floor(currentTime) == item.time && currentStep == index){
          console.log('reached: ' + currentTime);
        }
      })
    }

    function updateCurrentStep(stepsList){
      var currentTime = player.currentTime;

      if(currentTime !== 0){
        for (var i = stepsList.length - 1; i >= 0; i--) {
          if(currentTime >= stepsList[i].time){
            return currentStep = i+1;
          }
        }
      }else{
        return currentStep = 0;
      }
    }

    function setupStepplyer(){
      var stepsList = settings.steps;

      videoWrapper.addClass(settings.classname);

      attachStepHandlers(stepsList);

      if(settings.keyboard){
        setupKeyboardControl();
      }

      player.on('timeupdate', onMarkerReached(stepsList));
      //player.on('play', updateCurrentStep(stepsList));
      onMarkerReached(stepsList);
    }

    // setup the plugin after video meta data loaded
    player.on('loadedmetadata', function(){
      setupStepplyer();
    })

  };

  // register the plugin
  videojs.plugin('StepPlayer', StepPlayer);
})(jQuery, window.videojs);
