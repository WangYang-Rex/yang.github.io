

var VIVO_UIMIX = {
	i : 0,
	init: function(c) {
		var c = c ? c : VIVO_UIMIX;
		for (var i in c) {if (c[i] && c[i].init) {c[i].init();}}
	},
	html5 : function(){
		var thisBody = document.body || document.documentElement,
	    thisStyle = thisBody.style,
	    support = thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined;
		if(support!==undefined) {return true}else{return false}
	},
	scroll : function(n,speed){
		$("body,html").stop().animate({scrollTop:n},speed);
	},
	browser : function(n){
		var e = window.navigator.userAgent,
		b="",ie=0;
		if (e.indexOf("MSIE") >= 0){
			b="ie";
			if(e.indexOf("MSIE 6.0")>0) ie=6;
			if(e.indexOf("MSIE 7.0")>0) ie=7;
			if(e.indexOf("MSIE 8.0")>0) ie=8;
			if(e.indexOf("MSIE 9.0")>0) ie=9;
			if(e.indexOf("MSIE 10.0")>0) ie=10;
			if(e.indexOf("MSIE 11.0")>0) ie=11;
			if(e.indexOf("MSIE 12.0")>0) ie=12;
		}
		else if (e.indexOf("Firefox") >= 0) {b="firefox"}
		else if(e.indexOf("Chrome") >= 0){b="chrome"}
		else if(e.indexOf("Opera") >= 0){b="opera"}
		else if(e.indexOf("Safari") >= 0){b="safari"}
		if(n){
			if(b=="ie"){return ie}else{return b}
		}else{return b}
	},
	iepng : function(){
		
		if(VIVO_UIMIX.browser(1)==6){
			for(var j=0; j<document.images.length; j++)
			{
				var img = document.images[j];
				var imgName = img.src.toUpperCase();
				if (imgName.substring(imgName.length-3, imgName.length) == "PNG")
				{
				 var imgID = (img.id) ? "id='" + img.id + "' " : "";
				 var imgClass = (img.className) ? "class='" + img.className + "' " : "";
				 var imgTitle = (img.title) ? "title='" + img.title + "' " : "title='" + img.alt + "' ";
				 var imgAlt = (img.alt) ? "alt='" + img.alt + "' " : "alt='" + img.title + "' ";
				 var imgStyle = "display:inline-block;" + img.style.cssText;
				 if (img.align == "left") imgStyle = "float:left;" + imgStyle;
				 if (img.align == "right") imgStyle = "float:right;" + imgStyle;
				 if (img.parentElement.href) imgStyle = "cursor:hand;" + imgStyle;
				 var strNewHTML = "<i " + imgID + imgClass + imgTitle +  " style=\"" + "width:" + img.width + "px; height:" + img.height + "px;" + imgStyle + ";filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'" + img.src + "\', sizingMethod='scale');\"></i>";
				 img.outerHTML = strNewHTML;
				 j = j-1;
				}
			}
		}
	}
};

// PC official website

VIVO_UIMIX.main = {
	init : function(){
		VIVO_UIMIX.init(VIVO_UIMIX.main);
		// VIVO_UIMIX.main.fixcontain();
		VIVO_UIMIX.iepng();
		if(VIVO_UIMIX.browser(1)==6){setTimeout(function(){$("[href]").focus(function() {this.blur()})},1000)}
		jQuery.easing.def="easeOutCubic";
		$("img").mousedown(function(e){return false});
	},
	fixcontain: function(){
		if($("#vivo-contain").size()<=0) return;
		$(window).resize(function(){
			var wh=$(this).height(),vw=$("#vivo-wrap"),ct=$("#vivo-contain"),hd=$("#vivo-head"),fd=$("#vivo-foot");
			if(wh<vw.height()) return;
			ct.css({height:wh-hd.height()-fd.height()});
		}).resize();
	}
};





$(document).ready(function() {VIVO_UIMIX.init()});
