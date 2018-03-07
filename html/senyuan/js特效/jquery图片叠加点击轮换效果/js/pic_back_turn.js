$(function(){
	//获取节点
	var img = $('#wrap img');//每张图片

	/*用于计算的部分变量*/
	var imgNow = 0;//记录当前的排头图片，默认0
	var imgNum = img.size();//记录图片总数量
                                                                                                                                       
	//排头图片的相关信息
	var imgTop = img.eq(0).position().top;//距离顶部的距离
	var imgMaxHeight = img.eq(0).outerHeight(true);//排头图片的高度,300px
	var imgMaxWidth = img.eq(0).outerWidth(true);//排头图片的宽度,300px
	//待操作的图片的相关信息
	var waitImg = 0;//记录待操作的图片小标
	var waitImgWidth = 0;//待操作图片的宽度
	var waitImgHeight = 0;//待操作图片的高度
	var waitImgTop = 0;//待操作图片的顶部距离
	var waitImgLeft = 0;//待操作图片的左端距离
	var waitImgZindex = 0;//待操作图片的立体高度

	var xDistance = 80;//相邻图片x方向上的间隔
	var yDistance = 10;//相邻图片y方向上的间隔
	var sizeDistance = 20;//相邻图片的大小差异

/*******方法********/
	/*设置x,y方向上相邻图片的间隔*/
	function distance(x,y){
		xDistance = x;
		yDistance = y;
	}

	/*排头，图片向下移动并隐藏 方法*/
	function moveDown(obj){
		obj.animate({
			'top':imgTop+imgMaxHeight+'px'
		},500);
	}

	/*排头图片属性改变 方法*/
	function changeAttr(){
		img.eq(imgNow).css({
			'width':imgMaxWidth-(imgNum-1)*sizeDistance + 'px',
			'height':imgMaxHeight-(imgNum-1)*sizeDistance + 'px',
			'top':imgMaxHeight + 'px',			
			'left':0,
			'z-index':0
		});
	}	

	/*中间的图片移动 方法*/
	function picMidMove(){
		for(var i=1;i<imgNum;i++){
			if(imgNow+i<imgNum){
				waitImg = imgNow+i;
			}else{
				waitImg = imgNow+i-imgNum;
			}
			//获得图片当前的属性
			waitImgWidth = img.eq(waitImg).outerWidth(true);
			waitImgHeight = img.eq(waitImg).outerWidth(true);
			waitImgTop = img.eq(waitImg).position().top;
			waitImgLeft = img.eq(waitImg).position().left;
			waitImgZindex = img.eq(waitImg).css('z-index');
			//计算移动后的属性
			waitImgWidth += sizeDistance;
			waitImgHeight += sizeDistance;
			waitImgTop -= yDistance;
			waitImgLeft += xDistance;
			if(waitImgZindex == (img.length - 1)){
				waitImgZindex = 0;
			}else{
				waitImgZindex ++;
			}			
			//设置属性
			img.eq(waitImg).animate({
				'width':waitImgWidth + 'px',
				'height':waitImgHeight + 'px',
				'top':waitImgTop + 'px',			
				'left':waitImgLeft + 'px',
				'z-index':waitImgZindex			
			},500);
		}
	}

	/*排尾，图片出现并向上移动 方法*/
	function moveUp(obj){
		obj.animate({
			'top':imgTop+(imgNum-1)*yDistance+'px'
		},500,function(){
			/*重置图片标记，确定下一张排头图片*/
			if(imgNow == imgNum-1){
				imgNow = 0;
			}else{
				imgNow ++;
			}
		});
	}


/*******事件********/

	//图片-鼠标事件
	img.bind('click',function(){
		//遮罩显示
		$('#wrap').append('<div id="layer" style="width:620px;height:300px;position:absolute;top:0;left:0;z-index:5;opacity:0;filter:Alpha(opacity=0);"></div>');
		// $('#layer').show();
		/*排头图片从行首隐藏*/
		moveDown(img.eq(imgNow));
		setTimeout(function(){
			changeAttr();
		},500);

		/*之后的图片运动顶替*/
		setTimeout(function(){
			picMidMove();
		},500);
		
		/*排头图片在行尾出现*/
		setTimeout(function(){
			moveUp(img.eq(imgNow));
		},1200);	

		//遮罩隐藏
		setTimeout(function(){
			// $('#layer').hide();
			$('#layer').remove();
		},1800);		
	});


});