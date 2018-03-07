/**
 *页面轮播
 */
$(()=>{
    let imgArr=["b5","b4","b3","b2","b1"];
    let index=0;
    let timer=null;

    /*
     *播放下一张
     */
    function nextImg(){
        imgArr.push(imgArr[0]);
        imgArr.shift();
        $("#show li").each((i,e)=>$(e).removeClass().addClass(imgArr[i]));
        index++;
        if(index>4) index=0;
    }

    /**
     *播放上一张
     */
    function prevImg(){
        imgArr.unshift(imgArr[imgArr.length-1]);
        imgArr.pop();
        $("#show li").each((i,e)=>$(e).removeClass().addClass(imgArr[i]));
        index--;
        if(index<0) index=5;
    }
    //上一张绑定点击和移入移出事件
    $("#prev").click(()=>prevImg()).mouseover(()=>{

            clearInterval(timer);
            timer=null;
    }).mouseleave(()=>timer=setInterval(nextImg,3000));

    //下一张绑定点击和移入移出事件
    $("#next").click(()=>nextImg()).mouseover(()=>{
        clearInterval(timer);
        timer=null;
    }).mouseleave(()=>timer=setInterval(nextImg,3000));

    //鼠标移入清除定时器,鼠标移出开始定时器
    $("#show").mouseover(()=>{
        clearInterval(timer);
        timer=null;
    }).mouseleave(()=>timer=setInterval(nextImg,3000));

    //进入页面后自动开始定时器
    nextImg();
    timer=setInterval(nextImg,3000);
});
