jQuery(function(){
//选项卡滑动切换通用
jQuery(function(){jQuery(".hoverTag .chgBtn").hover(function(){jQuery(this).parent().find(".chgBtn").removeClass("chgCutBtn");jQuery(this).addClass("chgCutBtn");var cutNum=jQuery(this).parent().find(".chgBtn").index(this);jQuery(this).parents(".hoverTag").find(".chgCon").hide();jQuery(this).parents(".hoverTag").find(".chgCon").eq(cutNum).show();})})

//选项卡点击切换通用
jQuery(function(){jQuery(".clickTag .chgBtn").click(function(){jQuery(this).parent().find(".chgBtn").removeClass("chgCutBtn");jQuery(this).addClass("chgCutBtn");var cutNum=jQuery(this).parent().find(".chgBtn").index(this);jQuery(this).parents(".clickTag").find(".chgCon").hide();jQuery(this).parents(".clickTag").find(".chgCon").eq(cutNum).show();})})

/*function autoCenter(){$(".keautoCon").css({"left":-($(".keautoCon").width()-$(document).width())/2});}
setInterval(autoCenter,1);*/
$(".jarc2_ul li").hover(function(){$(this).find(".jarc2_show").show()},function(){$(this).find(".jarc2_show").hide()});
$(".jarc2_ul:first").css("z-index",100);
$(".jar_selOption li").hover(function(){$(this).css("background","#C6C9CC")},function(){$(this).css("background","none")});
$(".jar_selOption li").click(function(){$(this).parents(".jar_pubSel").find(".jar_selHtml span").html($(this).text());$(".jar_selOption").hide();});
$(".jar_pubSel").hover(function(){$(this).find(".jar_selOption").show()},function(){$(this).find(".jar_selOption").hide()});

$(".jar_serOption li").hover(function(){$(this).css("background","#1C5295")},function(){$(this).css("background","none")});
$(".jar_serOption li").click(function(){$(this).parents(".jar_serSel").find(".jar_serHtml").html($(this).text());$(".jar_serOption").hide();});
$(".jar_serSel").hover(function(){$(this).find(".jar_serOption").show()},function(){$(this).find(".jar_serOption").hide()});
$(".jar2_nav li:last").css("background","none");
for(jar1=0; jar1<$(".jar2_subNav").size(); jar1++){
	$(".jar2_subNav").eq(jar1).find("dd:last").css("background","none");
}

$(".jar2_nav li:not('.jar2_cutLi')").hover(function(){$(this).find(".jar2_subNav").css({"display":"block","z-index":100});},function(){$(this).find(".jar2_subNav").css({"display":"none","z-index":0});});

$(".jar2r_u1 li:odd").addClass("jar2r_even");

})
//屏蔽页面错误
jQuery(window).error(function(){
  return true;
});
jQuery("img").error(function(){
  $(this).hide();
});