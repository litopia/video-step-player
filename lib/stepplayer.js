/*! Step Player - v0.0.0 - 2015-2-3
 * Copyright (c) 2015 litopia
 * Licensed under the MIT license. */
(function($, videojs) {
  'use strict';

  var defaults = {
        hasAccordion       : true,
        accordionCtl    : true,
        classname       : 'vjs-stepplayer',
        keyboard        : true,
        steps           : [],
        onReachedCallback: null
      },
      StepPlayer;

  /**
   * Initialize the plugin.
   * @param options (optional) {object} configuration for the plugin
   */
  StepPlayer = function(options) {
    var settings      = videojs.util.mergeOptions(defaults, options),
        player        = this,
        videoWrapper  = $(this.el()),
        stepHandler   = null,
        currentStep   = 0,
        stepsList     = [],
        isAtStepEnd;

    function sortStepLists(stepsList){
      // sort the list by time in asc order
      stepsList.sort(function(a, b){return a.time - b.time});
    }

    function attachStepHandlers(){
      var duration = player.duration(),
          position;

      videoWrapper.find('.vjs-progress-control').append('<div class="vjs-stephandler"></div>');

      stepsList.forEach(function(item, index){
        //calculate position
        position = item.time/duration * 100 + '%';
        //attache step handlers to video control section
        stepHandler = $('<span class="vjs-tip"></span>').text(index + 1).css('left', position);
        videoWrapper.find('.vjs-stephandler').append(stepHandler);
        stepHandler.on('click', function(){
          player.currentTime(item.time);
        });
      });
    }
    function setupKeyboardControl(){
      //setup keyboard control
      $(document).on('keyup', function(e){
        if(e.keyCode === 32){
          //space bar to control play and pause
          player.paused() ? player.play():player.pause();
        }
        else if(e.keyCode === 39){
          //right arrow key to move to next stop point
          moveToNext();
        }
        else if(e.keyCode === 37){
          moveToPrev();
        }
      });
    }

    function onMarkerReached(){
      var currentTime;

      player.on('timeupdate', function checkTimeline(){
        currentTime = player.currentTime();

        for (var i = 0; i < stepsList.length; i++) {
          if(Math.floor(currentTime) === stepsList[i].time && currentStep === i){
            if(stepsList[i].time !== 0){
              player.pause();
            }

            settings.onReachedCallback? settings.onReachedCallback() : null;

            isAtStepEnd = true;

            console.log('reached ' + currentStep + ' ' + i);
            break;
          }
        }
        updateCurrentStep(currentTime);

        showHidePlayBtn();
      });
    }

    function updateCurrentStep(currentTime){
      if(isAtStepEnd){
        currentStep++;
        isAtStepEnd = !isAtStepEnd;
      }
      else{
        if(currentTime !== 0){
          for (var i = stepsList.length - 1; i >= 0; i--) {
            if(currentTime >= stepsList[i].time){
              currentStep = i+1;
              break;
            }
          }
        }
      }
    }
    function moveToNext() {
      var currentTime =  player.currentTime();
      for (var i = 0; i < stepsList.length; i++) {
        if(currentTime < stepsList[i].time){
          player.currentTime(stepsList[i].time);
          return false;
        }
      }
    }
    function moveToPrev(){
      var currentTime =  player.currentTime();
      for (var i = stepsList.length -1; i >= 0; i--) {
        if(currentTime > stepsList[i].time + 0.5){
          player.currentTime(stepsList[i].time);
          return false;
        }
      }
      //only get trigger when the lowest start time is not 0
      resetPlayerData();
      player.currentTime(0);
    }
    function initialAccordion(){
      $('.collapse').not(':first').hide();
      $('.accordion-heading').on('click', function(e){
        var target = $(this).parent(),
            targetStep = parseInt(target.attr('data-step'));

        if(settings.accordionCtl){
          if(targetStep > 0){
            player.currentTime(stepsList[targetStep-1].time);
          } else{
            player.currentTime(0.5); resetPlayerData();
          }
        }
        toggleAccordion(target.find('.collapse'));
      });
    }
    //TODO: figure out accordion toggle methods
    function toggleAccordion(element){
      var target = element || $('[data-step="' + (currentStep) + '"]').find('.collapse');
      // to toggle accordion accordingly
      target.slideDown(600);
      $('.collapse').not(target).slideUp(600);
    }
    function resetPlayerData(){
      currentStep = 0;
      isAtStepEnd = false;
      stepsList   = settings.steps;
      sortStepLists(stepsList);
    }
    function showHidePlayBtn(description){
      var playBtn = videoWrapper.find('.vjs-big-play-button'),
          playText = description || 'play next';

      if(player.paused() && !player.ended()){
        playBtn.attr('data-content', playText);
        playBtn.css('display', 'inherit');
      }else{
        playBtn.css('display', 'none');
      }
    }
    function setupStepplyer(){
      resetPlayerData();

      videoWrapper.addClass(settings.classname);

      if(settings.keyboard){
        setupKeyboardControl();
      }
      if(settings.hasAccordion){
        initialAccordion();
      }
      attachStepHandlers();
      onMarkerReached();

      // on video ended, reset data
      player.on('ended', function(){
        resetPlayerData();
      });
      player.on('play', function(){
        if(currentStep > 0){
          toggleAccordion();
        }
      });
    }

    // setup the plugin after video meta data loaded
    player.on('loadedmetadata', function(){
      setupStepplyer();
    });

    //exposed plugin api
    player.stepplayer = {
      prev: function(){
        moveToPrev();
      },
      next: function(){
        moveToNext();
      },
      destroy: function(){
        player.stepplayer.removeAll();
        stepHandler.remove();
        player.off('timeupdate', checkTimeline());
        delete player.stepplayer;
        delete player.getStepplayer;
      }
    };
  };

  // register the plugin
  videojs.plugin('stepplayer', StepPlayer);

})(jQuery, window.videojs);
