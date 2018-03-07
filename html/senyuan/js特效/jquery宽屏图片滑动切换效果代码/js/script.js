$(function() {

	$("#focusIndex1").show();
	$("#focusBar li").css("width",$(window).width());
	$("a.arrL").mouseover(function(){stopFocusAm();}).mouseout(function(){starFocustAm();});
	$("a.arrR").mouseover(function(){stopFocusAm();}).mouseout(function(){starFocustAm();});
	$("#focusBar li").mouseover(function(){stopFocusAm();}).mouseout(function(){starFocustAm();});
	starFocustAm();

});
	
/*------focus-------*/
$("#focusBar").hover(
	function () {
		$("#focusBar .arrL").stop(false,true);
		$("#focusBar .arrR").stop(false,true);
		$("#focusBar .arrL").animate({ left: 0}, { duration: 500 });
		$("#focusBar .arrR").animate({ right: 0}, { duration: 500 });
	}, function () {
		$("#focusBar .arrL").stop(false,true);
		$("#focusBar .arrR").stop(false,true);
		$("#focusBar .arrL").animate({ left: -52}, { duration: 500 });
		$("#focusBar .arrR").animate({ right: -52}, { duration: 500 });
	}
);

var timerFID;

function nextPage() {
	changeFocus(true);
}
function prePage() {
	changeFocus(false);
}

var currentFocusI=1;
var changeingFocus = false;
function changeFocus(dir) {
	if($("#focusBar li").length <= 1) return;
	if(changeingFocus) return;
	changeingFocus = true;
	
	$("#focusIndex"+nextI).stop(false,true);
	$("#focusIndex"+nextI+" .focusL").stop(false,true);
	$("#focusIndex"+nextI+" .focusR").stop(false,true);
	$("#focusIndex"+nextI+" .zhezhao").stop(false,true);
	var nextI = dir?currentFocusI+1:currentFocusI-1;
	nextI = nextI>$("#focusBar li").length?1:(nextI<1?$("#focusBar li").length:nextI);
	//var focusWidth = $(window).width()>1000?1000:$(window).width();
	$("#focusIndex"+currentFocusI).css("width",$(window).width());
	$("#focusIndex"+nextI).css("width",$(window).width());
	if(dir) {
		$("#focusIndex"+nextI).css("left",$(window).width());
		$("#focusIndex"+nextI+" .focusL").css("left",$(window).width()/2);
		$("#focusIndex"+nextI+" .focusR").css("left",$(window).width()/2);
		$("#focusIndex"+nextI+" .zhezhao").css("left",$(window).width()/2);
		$("#focusIndex"+currentFocusI).show();
		$("#focusIndex"+nextI).show();
		
		$("#focusIndex"+currentFocusI+" .focusL").animate({left: -($(window).width()/2+1000)},1200,'easeInExpo');
		$("#focusIndex"+currentFocusI+" .zhezhao").animate({left: -($(window).width()/2+1000)},1400,'easeInExpo');
		$("#focusIndex"+currentFocusI+" .focusR").animate({left: -($(window).width()/2+1000)},900,'easeInExpo',function(){
				$("#focusIndex"+nextI+" .focusL").animate({left: -960},1200,'easeInOutCirc');
				$("#focusIndex"+nextI+" .focusR").animate({left: -960},900,'easeInOutCirc');
				$("#focusIndex"+nextI+" .zhezhao").animate({left: -960},1400,'easeInOutCirc');
				
				$("#focusIndex"+currentFocusI).animate({left: -$(window).width()},1800,'easeOutExpo');
				$("#focusIndex"+nextI).animate({left: 0},1800,'easeOutExpo',function(){
						$("#focusIndex"+currentFocusI).hide();
						currentFocusI = nextI;
						changeingFocus = false;
				});
		});
	} else {
		$("#focusIndex"+nextI).css("left",-$(window).width());
		$("#focusIndex"+nextI+" .focusL").css("left",-($(window).width()/2+1200));
		$("#focusIndex"+nextI+" .focusR").css("left",-($(window).width()/2+900));
		$("#focusIndex"+nextI+" .zhezhao").css("left",-($(window).width()/2+1400));
		$("#focusIndex"+currentFocusI).show();
		$("#focusIndex"+nextI).show();
		
		$("#focusIndex"+currentFocusI+" .focusR").animate({left: $(window).width()/2},900,'easeInExpo');
		$("#focusIndex"+currentFocusI+" .zhezhao").animate({left: $(window).width()/2},1400,'easeInExpo');
		$("#focusIndex"+currentFocusI+" .focusL").animate({left: $(window).width()/2},1200,'easeInExpo',function(){
				$("#focusIndex"+nextI+" .focusL").animate({left: -960},1200,'easeInOutCirc');
				$("#focusIndex"+nextI+" .focusR").animate({left: -960},900,'easeInOutCirc');
				$("#focusIndex"+nextI+" .zhezhao").animate({left: -960},1400,'easeInOutCirc');
				
				$("#focusIndex"+currentFocusI).animate({left: $(window).width()},1800,'easeOutExpo');
				$("#focusIndex"+nextI).animate({left: 0},1800,'easeOutExpo',function(){
						$("#focusIndex"+currentFocusI).hide();
						currentFocusI = nextI;
						changeingFocus = false;
				});
		});
	}
}
function starFocustAm(){
	timerFID = setInterval("timer_tickF()",5000);
}
function stopFocusAm(){
	clearInterval(timerFID);
}
function timer_tickF() {
	changeFocus(true);
}
