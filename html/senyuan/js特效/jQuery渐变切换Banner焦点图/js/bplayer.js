// JavaScript Document
jQuery(function($){
	var index = 0;
	var maximg = 5;
	//$('<div id="flow"></div>').appendTo("#myjQuery");

	//滑动导航改变内容	
	$("#myjQueryNav li").hover(function(){
		if(MyTime){
			clearInterval(MyTime);
		}
		index  =  $("#myjQueryNav li").index(this);
		MyTime = setTimeout(function(){
		ShowjQueryFlash(index);
		$('#myjQueryContent').stop();
		} , 400);

	}, function(){
		clearInterval(MyTime);
		MyTime = setInterval(function(){
		ShowjQueryFlash(index);
		index++;
		if(index==maximg){index=0;}
		} , 3000);
	});
	//滑入 停止动画，滑出开始动画.
	 $('#myjQueryContent').hover(function(){
			  if(MyTime){
				 clearInterval(MyTime);
			  }
	 },function(){
				MyTime = setInterval(function(){
				ShowjQueryFlash(index);
				index++;
				if(index==maximg){index=0;}
			  } , 3000);
	 });
	//自动播放
	var MyTime = setInterval(function(){
		ShowjQueryFlash(index);
		index++;
		if(index==maximg){index=0;}
	} , 3000);
});
function ShowjQueryFlash(i) {
$("#myjQueryContent div").eq(i).animate({opacity: 1},1000).css({"z-index": "1"}).siblings().animate({opacity: 0},1000).css({"z-index": "0"});
//$("#flow").animate({ left: 652+(i*76) +"px"}, 300 ); //滑块滑动
$("#myjQueryNav li").eq(i).addClass("current").siblings().removeClass("current");
}