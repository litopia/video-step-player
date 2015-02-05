# Step Player

A plugin for video

## Getting Started

Once you've added the plugin script to your page, you can use it with any video:

```html
<script src="video.js"></script>
<script src="stepplayer.js"></script>
<script>
  videojs(document.querySelector('video')).stepplayer({
  	steps:[
  		{time: x},
  		{time: y},
  		{time: z},
  		...
  	]
  });
</script>
```

There's also a [working example](example.html) of the plugin you can check out if you're having trouble.

## Documentation
### Plugin Options

You may pass in an options object to the plugin upon initialization. This
object may contain any of the following properties:

#### hasAccordion
Type: `boolean`
Default: true

It initiates the default accordion state and toggle method. Set `hasAccordion: false` to disable the default collapse function.

If `hasAccordion: true`, set up your accordion using `data-step` attribute with according step number, see below:
``` HTML
	<div class="accordion">
		// If the first time value in steps is not equal to 0,
		// add an introduction section by setting the data-step to 0
    <div class="accordion-group" data-step="0">
      <div class="accordion-heading">
        <a class="accordion-toggle"> Introduction</a>
      </div>
      <div id="step0" class="accordion-body collapse in">
        <div class="accordion-inner">some description</div>
      </div>
    </div>
    <div class="accordion-group" data-step="1">
      <div class="accordion-heading">
        <a class="accordion-toggle"> Step 1</a>
      </div>
      <div id="step1" class="accordion-body collapse in">
        <div class="accordion-inner">some description</div>
      </div>
    </div>
```

### accordionCtrl
Type: `boolean`
Default: true

This propoty controls the click event of accordions. If it is set to `true`, toogling accordion will jump the video to its according point. Otherwise, it will not interfere with the video player.

### classname
Type: `String`
Default: "vjs-stepplayer"

Set your own classname to customize the css of video player control bar.

### keyboard
Type: `boolean`
Default: true

It enables/disables the keyboard control of video player. Currently enabled keyboard controls includes:

 * __Space key__ to play/pause video
 * __Left arrow key__ to the previous section
 * __right arrow key__ to the next section

### steps
Type: `array`
Default: []

The `steps` propoty takes in a array of objects, each of which should at least contains a `time` propoty, like this: `{time: 10}`

### onReachedCallback
Type: `function`
Default: null

This propoty takes a callbck function. It fires when the video player is reached preset stop points.

## Release History

 - 0.1.0: Initial release
