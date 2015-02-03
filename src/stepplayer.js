!function ($) {
	"use strict";

	/* STEP PLAYER PUBLIC CLASS DEFINITION
	 * =================================== */

	var StepPlayer = function(element, options){
		this.element = element;
	}

	StepPlayer.prototype = {
		constructor: StepPlayer,
		setup: function(){
			// Detect video player

			// Append video controller with step widgets

			// Establish relationship with the collapse sections
		},
		createVideoController: function(){

		}
	}

	/* STEP PLAYER PLUGIN DEFINITION
	 * ============================= */

	 var old = $.fn.stepplayer;

	 $.fn.stepplayer = function(option){
	 	return this.each(function(){
	 		var $this = $(this),

	 	})
	 }
}(window.jQuery);

