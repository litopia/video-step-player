/*! Step Player - v0.0.0 - 2015-2-3
 * Copyright (c) 2015 litopia
 * Licensed under the MIT license. */
(function(window, videojs) {
  'use strict';

  var defaults = {
        option: true
      },
      StepPlayer;

  /**
   * Initialize the plugin.
   * @param options (optional) {object} configuration for the plugin
   */
  StepPlayer = function(options) {
    var settings = videojs.util.mergeOptions(defaults, options),
        player = this;

    // TODO: write some amazing plugin code
  };

  // register the plugin
  videojs.plugin('StepPlayer', StepPlayer);
})(window, window.videojs);
