/*!
 * Title: Divas Slider jQuery plugin - jquery.divas-1.0.js
 * Author: Federica Sibella (@musingspuntoit) and Michela Chiucini (@webislove) - Coding Divas (@CodingDivas)
 * Author URI: http://www.musings.it - http://www.colazionedamichy.it - http://www.codingdivas.net/divasslider
 * Version: 1.0.dev
 * Date: 2014.07.23
 * 
 * Changelog:
 * 2014.07.23 initial release
 */

;(function($) {
	var divas = [],//array of Divas data
		instance = 0,//instance counter
		methods = {
			/**
			 * Divas slider initialization method
			 */
			init: function(options) {
				//defaults for the options
				var defaults = {
					sliderWidth:				"100%",//width of the slider with respect to its parent container
					mainImageWidth:				"60%",//width of the main image with respect to the slider
					start:						"manual",//manual or auto
					slideInterval:				4000,//msec interval between slides if start is "auto"
					
					slideTransitionClass:		"",//if you want to use CSS3 for slide transition
					//to be used in future releases
					slideTransitionParameter:	"",
					slideTransitionDuration:	600,
					slideTransitionEasing: 		"swing",
					slideTransitionStartValue:	null,
					slideTransitionStopValue:	null,
					
					titleTransitionClass:		"",//if you want to use CSS3 for slide transition
					titleTransitionParameter:	"",//jQuery fallback animation parameter if CSS3 is not available, can be an array ["","",...]
					titleTransitionDuration:	1000,
					titleTransitionEasing:		"swing",
					titleTransitionStartValue:	null,//start value(s) for jQuery fallback animation parameter(s)
					titleTransitionStopValue:	null,//stop value(s) for jQuery fallback animation parameter(s)
					
					startFrom:					"center",//left, center or right
					imagesToPreload:			3,//number of images to preload
					bullets:					"no",//yes or no
					wingsOverlayColor:			"",//color of the lateral panes
					placeholderImg:				"",//url of your placeholder img
					
					onImageClick:				function() {},//custom function to be executed on image click
					beforeSlide:				function() {},//custom function to be executed before slide
					afterSlide:					function() {}//custom function to be executed after slide
				},
				settings = $.extend({}, defaults, options);
				
				//for each Divas slider
				this.each(function() {
					//internal variables
					var $slider =					$(this),
						data =						$slider.data("divas"),
						current =					0,
						tot_slides =				0,
						images_to_preload = 		0,
						timer =						0,
						img_ratio =					0,
						$container =				$(),
						$slide =					$(),
						$navigation =				$(),
						$controls =					$(),
						$prev =						$(),
						$next =						$(),
						$start =					$(),
						$stop =						$(),
						$left_wing =				$(),
						$right_wing =				$(),
						$bullets_container = 		$(),
						mm = 						{},
						backup_img =				"images/backup_img.png",
						placeholder_img = 			"images/placeholder.gif",
						css3properties =			{},
						slideTransitionParameters = {},
						titleTransitionParameters = {};
					
					mm.swipeTreshold = 		100;
					mm.allowedTime = 		300;
					slideTransitionParameters.start = 	{};
					slideTransitionParameters.next  = 	{};
					slideTransitionParameters.prev  = 	{};
					
					//Divas objects initialization
					$slider.attr("data-id","divas-slider_"+instance);
					$container = $slider.children('.divas-slide-container').attr("data-id","divas-slide-container_"+instance);
					$slide = $container.children('.divas-slide');
					
					//for each slide
					$slide.each(function(index) {
						$(this).attr("data-position",index);
						$(this).attr("data-id","divas-slide-"+index+"_"+instance);
					});
					
					//append and start loader
					$slider.parent().append("<div id='loader'><div class='spin'></div></div>");
					
					//count slides and images to preload
					tot_slides = $slide.length;
					images_to_preload = settings.imagesToPreload;
					
					//vairous controls and alerts (if it is the case)
					//total number of slides must be > 3
					if(tot_slides < 3)
						alert("No Divas with less than 3 slides!\n Please add some slides");
					
					//slider width must be set
					if(parseInt(settings.sliderWidth) <= 0 || isNaN(parseInt(settings.sliderWidth)))
						alert("No Divas if the slider width is not correctly set!\n Please change 'sliderWidth' value");
					
					//main image width must be set	
					if(parseInt(settings.mainImageWidth) <= 0 || isNaN(parseInt(settings.mainImageWidth)))
						alert("No Divas if the main image width is not correctly set!\n Please change 'mainImageWidth' value");	
					
					//count images to preload (at least 3)
					if(images_to_preload < 3 || typeof(images_to_preload) != "number")
						images_to_preload = defaults.imagesToPreload;
					
					if(isEven(images_to_preload))
						images_to_preload ++;	
					
					if(images_to_preload > tot_slides)
						images_to_preload = tot_slides;
					
					//have you got your own placeholder image?
					if(settings.placeholderImg !== "")
						placeholder_img = settings.placeholderImg;
					
					//calculating widths for the different objects
					var slider_width = inpx(settings.sliderWidth,$slider.parent().width()),
						slide_width = inpx(settings.mainImageWidth,slider_width),
						container_width = tot_slides * slide_width,
						wing_width = Math.round((slider_width - slide_width)/2);
					
					//setting width for the slider and the slide container
					$slider.css({"width":slider_width,"box-sizing":"content-box"});
					$container.css({"width":container_width,"box-sizing":"content-box"});
					
					var $current_slides = $();
					
					//how shall we start?
					switch(settings.startFrom) {
						case "left":
							$current_slides = $slide.slice(0,images_to_preload);
							current = 1;
							break;
						
						case "center":
							var center = Math.floor(tot_slides / 2);
							if(isEven(tot_slides)) {
								center = tot_slides / 2;
							}
							
							current = center;
							$current_slides = $slide.slice(center-Math.floor(images_to_preload / 2),center+Math.ceil(images_to_preload / 2));
							break;
						
						case "right":
							$current_slides = $slide.slice(-images_to_preload);
							current = tot_slides - 2;
							break;
							
						default:
							$current_slides = $slide.slice(0,images_to_preload);
							current = 1;
							break;		
					}
					
					//check for css3 properties support
					css3properties = $.support.css3Properties;
					
					//css3properties.css3transition = false;
					
					//if css3 transitions ok
					if(css3properties.css3transition) {
						//if a transition class has been set for slides
						if(settings.slideTransitionClass !== "") {
							//array of default transitions for slides (to be used for future releases)
							var slideTransitionArray = ["divas-slide-transition-left"];
							//if our transition is in the defaults
							if($.inArray(settings.slideTransitionClass,slideTransitionArray) > -1) {
								switch(settings.slideTransitionClass) {
									//set the transition parameters
									case "divas-slide-transition-left":
										slideTransitionParameters.next.left = "-="+slide_width;
										slideTransitionParameters.prev.left = "+="+slide_width;
										break;
									default:
										break;	
								}
							}
							//TODO: this would be for custom slide transition: not yet available
							//since this is NOT one of the available slides transitions, fallback to default jQuery transition
							else {
								settings.slideTransitionClass = "";
								/**
								slideTransitionParameters["start"][settings.slideTransitionParameter] = settings.slideTransitionStartValue;
								$slide.css(slideTransitionParameters["start"]);
								if($.isArray(settings.slideTransitionStopValue)) {
									slideTransitionParameters["next"][settings.slideTransitionParameter] = settings.slideTransitionStopValue[0];
									slideTransitionParameters["prev"][settings.slideTransitionParameter] = settings.slideTransitionStopValue[1];
								}
								else {
									slideTransitionParameters["next"][settings.slideTransitionParameter] = settings.slideTransitionStopValue;
									slideTransitionParameters["prev"][settings.slideTransitionParameter] = settings.slideTransitionStopValue;
								}
								*/
							}
						}
						//no css3 transitions for slides, fallback to correspondant jQuery transition (only default by now)
						else {
							
						}
					}
					//no css3 transitions, fall back to default jQuery transition
					else {
						
					}
					
					//preload first "images_to_preload" images
					$("img",$current_slides).each(function(index) {
						var $image = $(this),
							relative_src = $image.attr("data-src");
						
						//only if we have something in the "data-src" attribute	
						if(relative_src) {
							var promise = preloadImage(relative_src);
						    promise.done(function(img_width, img_height) {
						        $image.attr("src", relative_src);
						        
						        //only once at the beginning
								if(index === 0) {
									//save the data for the images height/width ratio
						    		data.img_ratio = img_height / img_width;
						    		divas[instance] = data;
						    		//set the height for the slides and wings
						    		$left_wing.css("height",$image.height());
						       		$right_wing.css("height",$image.height());
						        	$slide.css("height",$image.height());
						        	//call resize for adjustments
						        	$slider.divas("resize");
						    	}
						        
						        //do we have an image callback?
						        if($.isFunction(settings.onImageClick))
						        	$image.on("click",settings.onImageClick);
						        
						        //if title attr exists and caption does not exist, create it
						        if($image.parent().find(".divas-caption").length === 0 && $image.attr("data-title") !== undefined && $image.attr("data-title") !== "") {
									$image.parent().append("<div class='divas-caption'>" + $image.attr("data-title") + "</div>");
									
									//if a transition class has been set for titles, chain it
									var $caption = $image.parent().find(".divas-caption");
									setTitleTransition($caption,css3properties,settings,titleTransitionParameters);
								}
								
								//only at the end
								if(index == $current_slides.length -1) {
									//remove loader
									$("#loader").remove();
									
									//because I have to wait for caption(s) to be appended
									setTimeout(function() {
										//show caption of the current slide if present
										if($slide.eq(current).find(".divas-caption").length !== 0) {
											var $caption = $slide.eq(current).find(".divas-caption");
											doTitleTransition($caption,css3properties,settings,titleTransitionParameters);
										}
									},200);
									
									//set "active" class to the current slide
									$slide.eq(current).addClass("divas-active");
								}
						    });
							
							//if images loading fails
						    promise.fail(function() {
						        console.log("Image loading failed!");
						        //try to use backup image
						        promise = preloadImage(backup_img);
						        promise.done(function() {
						            $image.attr('src', backup_img);
						        });
						    });
						}
					});
					
					//slide settings
					$slide.css({
							"box-sizing": "content-box",
							"position": "relative",
							"float": "left",
							"width": slide_width,
							"margin": 0,
							"padding": 0,
							"left": wing_width - (slide_width * current)
					});
					
					//wings (lateral panes) creation
					$left_wing = $("<div class='divas-wing'></div>").appendTo($slider);
					$left_wing.css({
						"position": "absolute",
						"top": 0,
						"left": 0,
						"width": wing_width,
						"background": settings.wingsOverlayColor
					});
					
					$right_wing = $left_wing.clone().appendTo($slider);
					$right_wing.css({
						"right": 0,
						"left": "auto"
					});
					
					//if navigation exists, set up and attach events
					if($slider.children('.divas-navigation').length > 0) {
						$navigation = $slider.children('.divas-navigation').attr("data-id","divas-navigation_"+instance);
						
						//prev and next buttons
						if($navigation.children('.divas-prev').length > 0 && $navigation.children('.divas-next').length > 0) {	
							$prev = $navigation.children('.divas-prev').attr("data-id","divas-prev_"+instance);
							$next = $navigation.children('.divas-next').attr("data-id","divas-next_"+instance);
						
							$prev.on("click touchstart touchend",function() {
								$(this).divas("prev");
							});
							
							$next.on("click touchstart touchend",function() {
								$(this).divas("next");
							});
						}
					}
					
					//if controls exist, set up and attach events
					if($slider.children('.divas-controls').length > 0 ) {
						$controls = $slider.children('.divas-controls').attr("data-id","divas-controls_"+instance);
						
						//start and stop buttons
						if($controls.children('.divas-start').length > 0 && $controls.children('.divas-stop').length > 0) {	
							$start = $controls.children('.divas-start').attr("data-id","divas-start_"+instance);
							$stop = $controls.children('.divas-stop').attr("data-id","divas-stop_"+instance);
							
							$start.on("click touchstart touchend",function() {
								$(this).divas("start");
							});
							
							$stop.on("click touchstart touchend",function() {
								$(this).divas("stop");
							});
							$stop.addClass("disabled");
						}
					}
					
					//initializing swipe-touch control
					$(document).on("touchstart", $slider, function(e) {
						var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
						if (e.originalEvent.touches === undefined) {
							touch = e;
						} 
						
						mm.ox = touch.pageX;
						mm.oy = touch.pageY;
						mm.startTime = new Date().getTime();
					});
					
					/**
					$(document).on("touchmove", $slider, function(e) {
					});	
					*/
					
					$(document).on("touchend", $slider, function(e) {
						var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
						if (e.originalEvent.touches === undefined) {
							touch = e;
						} 
						
						mm.dx = touch.pageX - mm.ox;
						mm.dy = touch.pageY - mm.oy;
						mm.endTime = new Date().getTime() - mm.startTime;
						
						if(mm.dx < -mm.swipeTreshold && mm.endTime < mm.allowedTime) {
							$slider.divas("next");
						}
						else if(mm.dx > mm.swipeTreshold && mm.endTime < mm.allowedTime) {
							$slider.divas("prev");
						}
					});
					
					//if bullets is "yes"
					if(settings.bullets == "yes") {
						//append bullets container
						$bullets_container = $("<div class='divas-bullets'><ul></ul></div>").appendTo($slider);
						//create bullets
						var $bullet = $("<li class='divas-bullet'></li>").appendTo($bullets_container.children("ul"));
						for(var i=1; i<tot_slides; i++) {
							$bullet.clone().appendTo($bullets_container.children("ul"));
						}
						$(".divas-bullet").eq(current).addClass("divas-bullet-current");
						$(".divas-bullet").each(function(index) {
							$(this).attr("data-position",index);
						});
						$slider.addClass("divas-has-bullets");
					}
					
					//saving divas data
					$slider.data("divas", {
						settings: settings,
						instance: instance,
						tot_slides: tot_slides,
						current: current,
						timer: timer,
						img_ratio: img_ratio,
						images_to_preload: images_to_preload,
						backup_img: backup_img,
						placeholder_img: placeholder_img,
						css3properties: css3properties,
						slider: $slider,
						container: $container,
						slide: $slide,
						left_wing: $left_wing,
						right_wing: $right_wing,
						bullets_container: $bullets_container, 
						prev: $prev,
						next: $next,
						start: $start,
						stop: $stop,
						slide_width: slide_width,
						slideTransitionParameters: slideTransitionParameters,
						titleTransitionParameters: titleTransitionParameters,
						mm: mm
					});
					
					data = $slider.data("divas");
					divas[instance] = data;
					
					//if automatic start, start divas
					if(settings.start == "auto") {
						$slider.divas("start");
					}
					
					instance ++;
					return divas;
				});	
			},
			/**
			 * moving slides forward 
			 */
			next: function() {
				var id = find_instance($(this).attr("data-id")),
					data = divas[id],
					current = data.current,
					settings = data.settings,
					$slider = data.slider,
					$slide = data.slide,
					to_be_loaded = current + Math.ceil(data.images_to_preload / 2),
					$next = data.next,
					$prev = data.prev,
					tot_slides = data.tot_slides,
					css3properties = data.css3properties,
					slide_width = data.slide_width,
					slideTransitionParameters = data.slideTransitionParameters,
					titleTransitionParameters = data.titleTransitionParameters;
				
				//unbinding prev and next button clicks	
				$next.off();
				$prev.off();
				$(document).off("touchend");
					
				//check for title transitions & reset values
				var $caption = $slide.find(".divas-caption");
				resetTitleTransition($caption,css3properties,settings,titleTransitionParameters);
				
				//find images to be loaded (if any)	
				if(to_be_loaded > data.tot_slides - 1)
					to_be_loaded -= data.tot_slides;
				
				var $to_be_loaded = $slide.eq(to_be_loaded);
				if($to_be_loaded.find("img").attr("src") != $to_be_loaded.find("img").attr("data-src")) {
					var $image = $to_be_loaded.find("img"),
						relative_src = $image.attr("data-src");
							
						if(relative_src) {
							var promise = preloadImage(relative_src);
						    promise.done(function() {
						        $image.attr('src', relative_src);
						        
						        //if there is a callback for images
						        if($.isFunction(settings.onImageClick)) {
						        	$image.on("click",settings.onImageClick);
						        }
						        
						        //if title attr exists and caption does not exist
						        if($image.parent().find(".divas-caption").length === 0 && $image.attr("data-title") !== undefined && $image.attr("data-title") !== "") {
									$image.parent().append("<div class='divas-caption'>" + $image.attr("data-title") + "</div>");
									//if a transition class has been set for titles
									var $caption = $image.parent().find(".divas-caption");
									setTitleTransition($caption,css3properties,settings,titleTransitionParameters);
								}
						    });
							
							//if image loading has failed, try with backup image
						    promise.fail(function() {
						        console.log("Image loading failed!");
						        promise = preloadImage(data.backup_img);
						        promise.done(function() {
						            $image.attr('src', data.backup_img);
						        });
						    });
						}
				}
				
				//before slide callback?
				if($.isFunction(settings.beforeSlide)) {
					settings.beforeSlide.call($slider);
				}
				
				//Slide transition (css3 if present and possible)
				var direction = "next",
					slide_counter = 1;
				if(css3properties.css3transition) {
					if(settings.slideTransitionClass !== "") {
						//add transition class for slides
						$slide.addClass(settings.slideTransitionClass).css(slideTransitionParameters.next)
						.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',   
		    			function() {
		    				//after all the transitions have finished
		    				if(slide_counter == tot_slides) {
		    					slide_counter ++;//otherwise Chrome keeps firing!
		    					//remove transition class for slides repositioning
								$slide.removeClass(settings.slideTransitionClass);
								data = afterSlideTransition(data,direction);
								divas[id] = data;
								return divas;
							}
							slide_counter ++;	
						});
					}
					else {//no css3 transition class for the slides (but maybe for titles)
						//do jQuery animation for slides
						$slide.animate({"left": "-="+slide_width}, settings.slideTransitionDuration, settings.slideTransitionEasing)
						.promise().done(function() {
							data = afterSlideTransition(data,direction);
							divas[id] = data;
							return divas;
						});
					}
				}
				else {//no css3 transition at all
					//do jQuery animation for slides
					$slide.animate({"left": "-="+slide_width}, settings.slideTransitionDuration, settings.slideTransitionEasing)
					.promise().done(function() {
						data = afterSlideTransition(data,direction);
						divas[id] = data;
						return divas;
					});
				}
			},
			/**
			 * moving slides backwards 
			 */
			prev: function() {
				var id = find_instance($(this).attr("data-id")),
					data = divas[id],
					current = data.current,
					settings = data.settings,
					$slider = data.slider,
					$slide = data.slide,
					to_be_loaded = current -Math.ceil(data.images_to_preload / 2),
					$next = data.next,
					$prev = data.prev,
					tot_slides = data.tot_slides,
					css3properties = data.css3properties,
					slide_width = data.slide_width,
					slideTransitionParameters = data.slideTransitionParameters,
					titleTransitionParameters = data.titleTransitionParameters;
				
				//unbinding prev and next button clicks
				$next.off();
				$prev.off();
				$(document).off("touchend");
					
				//check for title transitions & reset values
				var $caption = $slide.find(".divas-caption");
				resetTitleTransition($caption,css3properties,settings,titleTransitionParameters);
				
				//find images to be loaded (if any)		
				if(to_be_loaded < 0)
					to_be_loaded += data.tot_slides;
				
				var $to_be_loaded = $slide.eq(to_be_loaded);
				if($to_be_loaded.find("img").attr("src") != $to_be_loaded.find("img").attr("data-src")) {
					var $image = $to_be_loaded.find("img"),
						relative_src = $image.attr("data-src");
							
					if(relative_src) {
						var promise = preloadImage(relative_src);
					    promise.done(function() {
					        $image.attr('src', relative_src);
					        
					        //if there is a callback for images
					        if($.isFunction(settings.onImageClick)) {
						        $image.on("click",settings.onImageClick);
						    }
						        	
					        //if title attr exists and caption does not exist
					        if($image.parent().find(".divas-caption").length === 0 && $image.attr("data-title") !== undefined && $image.attr("data-title") !== "") {
								$image.parent().append("<div class='divas-caption'>" + $image.attr("data-title") + "</div>");
								//if a transition class has been set for titles
									var $caption = $image.parent().find(".divas-caption");
									setTitleTransition($caption,css3properties,settings,titleTransitionParameters);
							}
						});
						
						//if image loading has failed, try with backup image
						promise.fail(function() {
					        console.log("Image loading failed!");
					        promise = preloadImage(data.backup_img);
					        promise.done(function() {
					            $image.attr('src', data.backup_img);
					        });
					    });
					}
				}	
				
				//before slide callback?
				if($.isFunction(settings.beforeSlide)) {
					settings.beforeSlide.call($slider);
				}
				
				//slide transition (css3 if present and possible)
				var direction = "prev",
					slide_counter = 1;
				if(css3properties.css3transition) {
					if(settings.slideTransitionClass !== "") {
						$slide.addClass(settings.slideTransitionClass).css(slideTransitionParameters.prev)
						.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',   
		    			function() {
		    				if(slide_counter == tot_slides) {
		    					slide_counter ++;//otherwise Chrome keeps firing!
								$slide.removeClass(settings.slideTransitionClass);
								data = afterSlideTransition(data,direction);
								divas[id] = data;
								return divas;
							}
							slide_counter ++;	
						});
					}
					else {//no css3 transitions for slides (but maybe for titles?)
						//do jQuery animation for slides
						$slide.animate({"left": "+="+slide_width}, settings.slideTransitionDuration, settings.slideTransitionEasing)
						.promise().done(function() {
							data = afterSlideTransition(data,direction);
							divas[id] = data;
							return divas;
						});
					}
				}
				else {//no css3 transitions
					//do jQuery animation for slides
					$slide.animate({"left": "+="+slide_width}, settings.slideTransitionDuration, settings.slideTransitionEasing)
					.promise().done(function() {
						data = afterSlideTransition(data,direction);
						divas[id] = data;
						return divas;
					});
				}
			},
			/**
			 * method for starting automatic scrolling 
			 */
			start: function() {
				var id = find_instance($(this).attr("data-id")),
					data = divas[id],
					$slider = data.slider,
					$prev = data.prev,
					$next = data.next,
					$start = data.start,
					$stop = data.stop,
					interval = data.settings.slideInterval;
					
				if(data.timer !== 0) {
					clearInterval(data.timer);
					data.timer = 0;
				}
				
				$prev.off().addClass("disabled");
				$next.off().addClass("disabled");
				$start.off().addClass("disabled");
				$(document).off("touchend");
				
				if($stop.length > 0) {
					if($stop.hasClass("disabled"))
					{
						$stop.on("click",function() {
							$(this).divas("stop");
						}).removeClass("disabled");
					}
				}
				
				data.timer = setInterval(function(){$slider.divas("next");},interval);
				
				data.prev = $prev;
				data.next = $next;
				data.start = $start;
				data.stop = $stop;
				
				divas[id] = data;
				return divas;
			},
			/**
			 * method for stopping automatic scrolling 
			 */
			stop: function() {
				var id = find_instance($(this).attr("data-id")),
					data = divas[id],
					$prev = data.prev,
					$next = data.next,
					$start = data.start,
					$stop = data.stop,
					$slider = data.slider,
					mm = data.mm;
				
				$stop.off().addClass("disabled");
				
				if($prev.length > 0 && $next.length > 0 && data.timer !== 0) {
					$prev.on("click",function() {
						$(this).divas("prev");
					}).removeClass("disabled");
					
					$next.on("click",function() {
						$(this).divas("next");
					}).removeClass("disabled");
				}
				
				if($start.length > 0) {
					$start.on("click",function() {
						$(this).divas("start");
					}).removeClass("disabled");
				}
				
				$(document).on("touchend",function(e) {
					var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
					if (e.originalEvent.touches === undefined) {
						touch = e;
					} 
					
					mm.dx = touch.pageX - mm.ox;
					mm.dy = touch.pageY - mm.oy;
					mm.endTime = new Date().getTime() - mm.startTime;
					
					if(mm.dx < -mm.swipeTreshold && mm.endTime < mm.allowedTime) {
						$slider.divas("next");
					}
					else if(mm.dx > mm.swipeTreshold && mm.endTime < mm.allowedTime) {
						$slider.divas("prev");
					}
				});
				
				clearInterval(data.timer);
				
				data.timer = 0;
				data.prev = $prev;
				data.next = $next;
				data.start = $start;
				data.stop = $stop;
				data.slider = $slider;
				
				divas[id] = data;
				return divas;
			},
			/**
			 * method for resizing divas (responsive) 
			 */
			resize: function(id) {
				if(typeof(id) != "number")
					id = find_instance($(this).attr("data-id"));
					
				var data = divas[id];
				if(data !== undefined)
				{
					var $slider = data.slider,
						$slide = data.slide,
						$container = data.container,
						$left_wing = data.left_wing,
						$right_wing = data.right_wing,
						settings = data.settings,
						css3properties = data.css3properties,
						tot_slides = data.tot_slides,
						current = data.current,
						img_ratio = data.img_ratio,
						slider_width = inpx(settings.sliderWidth,$slider.parent().width()),
						slide_width = inpx(settings.mainImageWidth,slider_width),
						container_width = tot_slides * slide_width,
						wing_width = Math.round((slider_width - slide_width)/2),
						slide_height = Math.round(slide_width * img_ratio),
						slide_left = wing_width - (slide_width * current),
						slideTransitionParameters = data.slideTransitionParameters;
				
					$slider.css({"width": slider_width});
					$container.css({"width": container_width});
					$left_wing.css({"width": wing_width,"height": slide_height});
					$right_wing.css({"width": wing_width,"height": slide_height});
					$slide.css({"width": slide_width,"height": slide_height, "left": slide_left});
					
					if(css3properties.css3transition) {//css3 transitions ok
						//if a transition class has been set for slides
						if(settings.slideTransitionClass !== "") {
							var slideTransitionArray = ["divas-slide-transition-left"];
							if($.inArray(settings.slideTransitionClass,slideTransitionArray) > -1) {//if it's one of the available slide transitions
								switch(settings.slideTransitionClass) {
									case "divas-slide-transition-left":
										slideTransitionParameters.next.left = "-="+slide_width;
										slideTransitionParameters.prev.left = "+="+slide_width;
										break;
									default:
										break;	
								}
							}
							else {//TODO: this would be for custom slide transition: not yet available
								//since this is NOT one of the available slides transitions, fallback to default jQuery transition
								settings.slideTransitionClass = "";
							}
						}
						else {//no css3 transitions for slides, fallback to correspondant jQuery transition (only default by now)
							
						}
					}
					else {//no css3 transitions, fall back to default jQuery transition
						
					}
					
					data.slider = $slider;
					data.container = $container;
					data.slide = $slide;
					data.left_wing = $left_wing;
					data.right_wing = $right_wing;
					data.slide_width = slide_width;
					data.slideTransitionParameters = slideTransitionParameters;
					
					divas[id] = data;
					return divas;
				}
			},
			/**
			 * method for destroying divas instance
			 */
			destroy: function() {
				var id = find_instance($(this).attr("data-id")),
					data = divas[id];
					data.prev.off();
					data.next.off();
					$(document).off("touchend");
					data.slider.divas("stop");
					data.slider.removeClass("divas-has-bullets");
					data.slide.find(".divas-caption").remove();
					data.slide.children("img").attr("src",data.placeholder_img);
				//re-sort images the order they were at the beginning!
				$(".divas-slide").sort(function (a, b) {
				  return $(a).attr('data-position') - $(b).attr('data-position');
				}).each(function (slide) {
				  $(slide).parent().append(slide);
				});
				data.slide.removeClass("divas-active");
				data.left_wing.remove();
				data.right_wing.remove();
				data.bullets_container.remove();
	         	$.removeData(data,"divas");
			    this.unbind();
			    this.element = null;
	        },
	        /**    
	         * method for updating parameters
	         * on-the-fly 
	         */
	        update: function(options) {
				$(this).divas("destroy");
				$(this).divas("init",options);
	        }
		};
	
	/**
	 * function that finds divas instance
	 * @param id
	 */
	function find_instance(id) {
		if(typeof(id) === "string") {
			var position = id.indexOf("_");
			if(position != -1) {
				id = id.substr(position+1);  
			}
		}
		return id;
	}
	
	/**
	 * function to find measures in px
	 * from measures in % 
	 */
	function inpx(inpct, parent_width) {
		var container_width = parent_width,
			width_inpc = 0,
			width_inpx = 0;
			
			if(typeof(inpct) === "string") {
				var position = inpct.indexOf("%");
				if(position != -1)  {
					width_inpc = parseInt(inpct.slice(0,-1))/100;
					width_inpx = Math.round(container_width * width_inpc);
				}
			}
			else {
				width_inpx = inpct;
			}
			
		 return width_inpx;
	}
	
	/**
	 * controls if a number is even or odd
	 */
	function isEven(value) {
		if (value%2 === 0)
			return true;
		else
			return false;
	}
	
	/**
	 * function for preloading images via deferred object 
	 */
	function preloadImage(image) {
	    var $deferred = $.Deferred();
	
	    // create a new image to attempt loading the requested image
	    var img = new Image(),
	    	self = this;
	
	    img.onload = function() {
	        $deferred.resolveWith(self, [img.width, img.height, img.src]);
	    };
	
	    img.onerror = function() {
	        $deferred.rejectWith(self, [img.src]);
	    };
	
	    $deferred.fail(function() {
	        console.log('image failed to load: ' + img.src);
	    });
		
	    img.src = image;
	    return $deferred.promise();
	}
	
	/**
	 * function for setting title transitions
	 * @object $caption, titleTransitionParameters;
	 * @array css3properties, settings 
	 */
	function setTitleTransition($_caption,_css3properties,_settings,_titleTransitionParameters) {
		if(_css3properties.css3transition) {
			if(_settings.titleTransitionClass !== "") {
				$_caption.addClass(_settings.titleTransitionClass+"-start");
				$_caption.addClass(_settings.titleTransitionClass);
			}
			else {
				//default is NO transition: caption visible
			}
		}
		else {//no css3 transitions
			//jQuery fallback of if there are all parameters
			if(_settings.titleTransitionParameter !== "" && _settings.titleTransitionDuration !== "" && _settings.titleTransitionStartValue !== null && _settings.titleTransitionStopValue !== null) {
				if($.isArray(_settings.titleTransitionParameter)) {
					$.each(_settings.titleTransitionParameter, function(index) {
						_titleTransitionParameters[_settings.titleTransitionParameter[index]] = _settings.titleTransitionStartValue[index];
					});
				}
				else {
					_titleTransitionParameters[_settings.titleTransitionParameter] = _settings.titleTransitionStartValue;
				}
				$_caption.css(_titleTransitionParameters);
			}
			else {
				//default is NO transition: caption visible
			}										
		}
	}
	
	/**
	 * function for performing title transitions
	 * @object $caption, titleTransitionParameters;
	 * @array css3properties, settings  
	 */
	function doTitleTransition($_caption,_css3properties,_settings,_titleTransitionParameters) {
		if(_css3properties.css3transition) {
			if(_settings.titleTransitionClass !== "") {
				$_caption.addClass(_settings.titleTransitionClass+"-stop")
				.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',   
				function() {
					//after title transition?
				});
			}
			else {
				//fallback to jquery transition if there are all fallback parameters
				if(_settings.titleTransitionParameter !== "" && _settings.titleTransitionDuration !== "" && _settings.titleTransitionStartValue !== null && _settings.titleTransitionStopValue !== null) {
					if($.isArray(_settings.titleTransitionParameter)) {
						$.each(_settings.titleTransitionParameter, function(index) {
							_titleTransitionParameters[_settings.titleTransitionParameter[index]] = _settings.titleTransitionStopValue[index];
						});
					}
					else {
						_titleTransitionParameters[_settings.titleTransitionParameter] = _settings.titleTransitionStopValue;
					}
					$_caption.animate(_titleTransitionParameters, _settings.titleTransitionDuration, _settings.titleTransitionEasing, function() {
						//after title animation?
					});
				}
				else {
					//default no transition: title shown
				}
			}
		}
		else {//no css3 transitions
			//fallback to jquery transition if there are all fallback parameters
			if(_settings.titleTransitionParameter !== "" && _settings.titleTransitionDuration !== "" && _settings.titleTransitionStartValue !== null && _settings.titleTransitionStopValue !== null) {
				if($.isArray(_settings.titleTransitionParameter)) {
					$.each(_settings.titleTransitionParameter, function(index) {
						_titleTransitionParameters[_settings.titleTransitionParameter[index]] = _settings.titleTransitionStopValue[index];
					});
				}
				else {
					_titleTransitionParameters[_settings.titleTransitionParameter] = _settings.titleTransitionStopValue;
				}
				$_caption.animate(_titleTransitionParameters, _settings.titleTransitionDuration, _settings.titleTransitionEasing, function() {
					//after title animation?
				});
			}
			else {
				//default no transition: title shown
			}
		}
	}
	
	/**
	 * function that resets values for title transitions 
	 * @object $caption, titleTransitionParameters;
	 * @array css3properties, settings  
	 */
	function resetTitleTransition($_caption,_css3properties,_settings,_titleTransitionParameters) {
		if(_css3properties.css3transition) {
			if(_settings.titleTransitionClass !== "") {
				$_caption.removeClass(_settings.titleTransitionClass+"-stop");
			}
			else {
				//jquery animation?
				if(_settings.titleTransitionParameter !== "" && _settings.titleTransitionDuration !== "" && _settings.titleTransitionStartValue !== null && _settings.titleTransitionStopValue !== null) {
					if($.isArray(_settings.titleTransitionParameter)) {
						$.each(_settings.titleTransitionParameter, function(index) {
							_titleTransitionParameters[_settings.titleTransitionParameter[index]] = _settings.titleTransitionStartValue[index];
						});
					}
					else {
						_titleTransitionParameters[_settings.titleTransitionParameter] = _settings.titleTransitionStartValue;
					}
					$_caption.animate(_titleTransitionParameters,_settings.titleTransitionDuration);
				}
				else {
					//no transition for titles
				}
			}
		}
		else {//no css3 transitions: fallback to jquery
			if(_settings.titleTransitionParameter !== "" && _settings.titleTransitionDuration !== "" && _settings.titleTransitionStartValue !== null && _settings.titleTransitionStopValue !== null) {
				if($.isArray(_settings.titleTransitionParameter)) {
					$.each(_settings.titleTransitionParameter, function(index) {
						_titleTransitionParameters[_settings.titleTransitionParameter[index]] = _settings.titleTransitionStartValue[index];
					});
				}
				else {
					_titleTransitionParameters[_settings.titleTransitionParameter] = _settings.titleTransitionStartValue;
				}
				$_caption.animate(_titleTransitionParameters,_settings.titleTransitionDuration);
			}
			else {
				//no transition for titles
			}
		}
	}
	
	/**
	 * things to be performed after slide transition
	 * Array _data; String _direction 
	 */
	function afterSlideTransition(_data, _direction) {
		var $_slider = _data.slider,
			$_container = _data.container,
			$_slide = _data.slide,
			$_prev = _data.prev,
			$_next = _data.next,
			_current = _data.current,
			_settings = _data.settings,
			_slide_width = _data.slide_width,
			_timer = _data.timer,
			_css3properties = _data.css3properties,
			_titleTransitionParameters = _data.titleTransitionParameters,
			_mm = _data.mm,
			$_to_be_moved = $();
		
		//reposition slides
		if(_direction == "next") {//next	
			$_to_be_moved = $_container.children(".divas-slide").first();
			$_slide.css({"left":"+="+_slide_width});
			$_container.append($_to_be_moved);
		}
		else if(_direction == "prev") {//prev
			$_to_be_moved = $_container.children(".divas-slide").last();
			$_slide.css({"left":"-="+_slide_width});
			$_container.prepend($_to_be_moved);
		}
		$_slide = $_container.children(".divas-slide");
		
		//add class divas-active to the current slide
		$_slide.removeClass("divas-active").eq(_current).addClass("divas-active");
		
		//move bullets
		if(_settings.bullets == "yes") {
			var current_bullet = $(".divas-active").attr("data-position");
			$(".divas-bullet").removeClass("divas-bullet-current").eq(current_bullet).addClass("divas-bullet-current");
		}
		
		//only for the current slide: title animate
		if($_slide.eq(_current).find(".divas-caption").length !== 0) {
			var $_caption = $_slide.eq(_current).find(".divas-caption");
			doTitleTransition($_caption,_css3properties,_settings,_titleTransitionParameters);
		}	
		
		//after slide function
		if($.isFunction(_settings.afterSlide)) {
			_settings.afterSlide.call($_slider);
		}
		
		//re-attach prev and next buttons actions
		if($_prev.length > 0 && $_next.length > 0 && _timer === 0) {
			$_prev.on("click",function() {
				$(this).divas("prev");
			});
			
			$_next.on("click",function() {
				$(this).divas("next");
			});
		}
		
		//re-attach touchend actions to $(document)
		$(document).on("touchend", function(e) {
			var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
			if (e.originalEvent.touches === undefined) {
				touch = e;
			} 
			
			_mm.dx = touch.pageX - _mm.ox;
			_mm.dy = touch.pageY - _mm.oy;
			_mm.endTime = new Date().getTime() - _mm.startTime;
			
			if(_mm.dx < -_mm.swipeTreshold && _mm.endTime < _mm.allowedTime) {
				$_slider.divas("next");
			}
			else if(_mm.dx > _mm.swipeTreshold && _mm.endTime < _mm.allowedTime) {
				$_slider.divas("prev");
			}
		});
		
		_data.current = _current;
		_data.slide = $_slide;
		_data.container = $_container;
		_data.next = $_next;
		_data.prev = $_prev;
		_data.slider = $_slider;
		
		return _data;
	}
	
	/**
	 * function that sets timers for waiting till
	 * windows resize is complete 
	 */
	var waitForFinalEvent = (function () {
		var timers = {};
		return function (callback, ms, uniqueId) {
	    if (!uniqueId) {
	      uniqueId = "Don't call this twice without a uniqueId";
	    }
	    if (timers[uniqueId]) {
	      clearTimeout (timers[uniqueId]);
	    }
	    timers[uniqueId] = setTimeout(callback, ms);
	  };
	})();
	
	
	/**
	 * function that binds resize to 
	 * window resize for each divas instance
	 */
	$(window).resize(function() {
		waitForFinalEvent(function(){
		      for(var i=0; i<instance; i++) {
				$.fn.divas("resize",i);
			}
	    }, 100);
	});
	
	/**
	 * functions that checks if the browser supports CSS3 transitions
	 */
	$.support.css3Properties = (function() {
		var thisBody = document.body || document.documentElement,
			thisStyle = thisBody.style,
			support = {'css3transition':false, 'css3animation':false, 'css3transform':false};
		
		support.css3transition = thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined;
		support.css3animation  = thisStyle.animation !== undefined || thisStyle.WebkitAnimation !== undefined || thisStyle.MozAnimation !== undefined || thisStyle.MsAnimation !== undefined || thisStyle.OAnimation !== undefined;
		support.css3transform  = thisStyle.transform !== undefined || thisStyle.WebkitTransform !== undefined || thisStyle.MozTransform !== undefined || thisStyle.MsTransform !== undefined || thisStyle.OTransform !== undefined;
		
		return support;
	})();
	
	/**
	 * function that generates the plugin and instantiates its methods
	 * @param {Object} method
	 */
	$.fn.divas = function(method) {
	    if(methods[method]) {
	    	return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
	    } 
		else if (typeof method === 'object' || !method) {
	    	return methods.init.apply(this, arguments);
	    } 
		else {
	    	$.error('Method ' +  method + ' does not exist on jQuery.divas');
	    }
  	};	
		
})(jQuery);
