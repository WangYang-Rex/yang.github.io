define(function(require, exports, module) {

    // 首页js
    exports.index = function() {
        require('superSlide');
        require('quietflow');

        var banner = $('#banner');
        var bannerBg = $('#bannerBg');
        var items  = banner.find('.bd-item');
        var colors = ['#4131d5', '#53c580', '#ff6363', '#a06bff'];
        var delayTime = $.support.opacity ? 0 : 500;

        if(!$.support.opacity){
            delayTime = 500;
        }

        bannerBg.quietflow({
            theme : "bouncingBalls",
            specificColors : [
            "rgba(65, 235, 255, .2)", 
            "rgba(80, 197, 121, .4)", 
            "rgba(125, 255, 119, .25)", 
            "rgba(255, 120, 120, .65)",
            "rgba(45, 109, 255, .65)",
            "rgba(128, 65, 255, .80)",
            "rgba(110, 168, 255, 1)",
            "rgba(110, 168, 255, 1)",
            "rgba(110, 168, 255, 1)",
            "rgba(82, 82, 82, 1)",
            "rgba(66, 255, 124, 1)",
            ],
            speed : 30,
            bounceBallCount : 12,
            backgroundCol: colors[0]
        });
        banner.slide({
            titCell: ".hd ul",
            mainCell: ".bd",
            effect: "fade",
            delayTime: delayTime,
            interTime: 5000,
            autoPlay: true,
            trigger: 'click',
            autoPage: true,
            defaultIndex: 0,
            mouseOverStop: false,
            startFun: function(i){
                banner.css({background: colors[i]});
                items.removeClass('on').eq(i).addClass('on');

                if(i === 0){
                    bannerBg.fadeIn();                   
                }else{
                    bannerBg.fadeOut();     
                }
            }            
        });        
    }

    // banner svg
    exports.drawSvg = function(){
        if(!$.support.opacity){
            return this;
        }

        require('snap');
        var svg = Snap('#svg'), paper = svg.paper;

        // 三角形
        paper.image("statics/assets/images/index/triangle10.png", 980, 135, 228, 119).attr({'class': 'triangle triangle1'});
        paper.image("statics/assets/images/index/triangle11.png", 1375, 475, 129, 85).attr({'class': 'triangle triangle2'});

        // 三角形背景
        // paper.polyline(660, 760, 1300, 410, 1510, 760).attr({
        //     fill: '#aa7bff'
        // });
        // var sjx = paper.polyline(1300, 410, 1510, 760, 660, 760, 1303, 410).attr({
        //     stroke: "#fff",
        //     strokeWidth: 5,
        //     fill: 'none'
        // });

        // sjx.animate({
        //     points: '1160, 385, 1295, 615, 840, 565, 1163, 385'
        // }, 1000);

        // paper.polyline(1160, 385, 1295, 615, 840, 565, 1163, 385).attr({
        //     stroke: "#fff",
        //     strokeWidth: 5,
        //     fill: 'none'
        // });

        // paper.polyline(1145, 450, 1195, 540, 1025, 520, 1148, 450).attr({
        //     stroke: "#fff",
        //     strokeWidth: 5,
        //     fill: 'none'
        // });

        // Snap.animate(130, 10000, function (val) {
        //     circles[0].attr({
        //         "fill-opacity": 1,
        //         'fill': 'blue'
        //     });
        // });

        // 圆
        var circles = paper.g();
        var data = [
            { x: 155,  y :610, r: 39, color: '#fff843', opacity: 1 },
            { x: 110,  y :580, r: 43, color: '#ffa646', opacity: 0.25 },            
            { x: 695,  y :625, r: 63, color: '#45f4ff', opacity: 1 },
            { x: 1055, y :420, r: 61, color: '#ff5555', opacity: 0.5 },
            { x: 1220, y :265, r: 40, color: '#fff950', opacity: 0.7 },

            { x: 1880, y :315, r: 119, color: '#fdff5a', opacity: 1 },
            { x: 1750, y :400, r: 100, color: '#4df5ff', opacity: 0.5 },
            { x: 1740, y :255, r: 107, color: '#feffb7', opacity: 0.48 }
        ];        
        data.forEach(function(c, i){
            var circle = paper.circle(c.x, c.y, c.r).attr({
                'fill': c.color,
                "fill-opacity": c.opacity,
                'class': 'circle circle'+ i
            })
            circles.add(circle);
        });
    }

    // 关于我们
    exports.about = function(){
        require('superSlide');
        require('layer');
        var focus = $('#aboutFocus');
        var items = focus.find('.bd li');
        focus.slide({
            titCell: ".hd ul",
            mainCell: ".bd ul",
            effect: "leftLoop",
            interTime: 5000,
            autoPlay:true,
            autoPage: true,
            startFun: function(i){
                setTimeout(function(){
                    items.removeClass('on').eq(i).addClass('on');
                }, 50)
            }         
        });

        if($.support.opacity){
            $('.about-benefits').addClass('transition');
        }
        
    }

    // 小皮产品
    exports.product = function(){
        require('mousewheel');
        require('carousel');

        // banner
        var focus = $('#productFocus'),            
            count = focus.find('.slideItem');

        //焦点图
        focus.carousel({
            directionNav:true,
            carouselWidth:1420,
            carouselHeight:485,
            frontWidth:600,
            frontHeight:485,
            autoplay:true,
            speed:500, 
            autoplayInterval:5000,
            backZoom: 0.58,
            hMargin: 1.18,
            init: function(carousel){
                setPageState(carousel);
            }, 
            after: function(carousel){
                setPageState(carousel);
            }
        });
        focus.addClass('running');

        function setPageState(carousel){
            $('#pageState').html('<span>'+ (carousel.current + 1) +'</span>/'+carousel.length);
        }
    }

    exports.product2 = function(){
        var positionTop = 328, timer = 0;
        $('#product .bd-item').hover(function(){
            var t = $(this),
                c = t.find('.con'),
                h = t.height(),
                ch = c.height();

            clearTimeout(timer);
            timer = setTimeout(function(){
                t.addClass('on');
                c.stop(true, false).animate({top: h - ch}, 300);
            }, 100)            
        }, function(){
            clearTimeout(timer);
            $(this).removeClass('on').find('.con').stop(true, false).animate({top: positionTop}, 300);
        })
    }

    // 加入我们
    exports.join = function(){
        require('superSlide');
        $('#joinRecruit').slide({
            titCell: ".hd ul",
            mainCell: ".bd ul",
            effect: "leftLoop",
            vis: 3,
            autoPlay: true,
            // delayTime: 500,
            interTime: 5000
        });
        
        $('#joinRecruit .recruit-item-cover').hover(function(){
            $(this).parent().addClass('hover');
        }, function(){
            $(this).parent().removeClass('hover');
        })
    }

    // 回到顶部
    exports.totop = function(page){
        var sidebar = {
            init: function(){
                
                var totop = $('#totop'),
                    isScroll = false,
                    timer = 0;

                // 回到顶部
                totop.on('click', function(){
                    totop.fadeOut(200);
                    isScroll = true;

                    $('html, body').animate({scrollTop: 0}, 500, function(){
                        isScroll = false;
                    });
                })

                // 滚动定位
                $(document).on("scroll", _scrollTo); 
                _scrollTo();
                function _scrollTo(){
                    if(!isScroll){
                        clearTimeout(timer);
                        timer = setTimeout(function(){
                            var scrollTop = $(document).scrollTop();

                            // 指定位置显示/隐藏                        
                            if(scrollTop >= 400){
                                totop.fadeIn(200);
                            }else{
                                totop.fadeOut(200);
                            }
                        }, 100)                        
                    }
                }         
            }
        }
        sidebar.init();
    }

    // placeholder兼容
    exports.placeholder = function(options) {
        // var placeholderSupport = "placeholder" in document.createElement("input");
        if (!("placeholder" in document.createElement("input"))) {
            var defaults = {
                color: '#999',
                cursor: "text"
            };
            var params = $.extend({}, defaults, options || {});
            var inputs = $('[placeholder]');

            inputs.each(function(i) {
                var element = $(this),
                    placeholder = element.attr('placeholder');
                if (placeholder == "") return;

                // 状态初始化
                var elementLabel = $('<label class="placeholder" style="display: inline-block; line-height: 1.42857143; ">' + placeholder + '</label>').css({
                    position: "absolute",
                    color: params.color,
                    cursor: params.cursor,
                    marginLeft: element.css("marginLeft"),
                    marginTop: element.css("marginTop"),
                    paddingLeft: element.css("paddingLeft"),
                    paddingTop: element.css("paddingTop"),
                    fontSize: element.css("fontSize")
                }).insertBefore(element);

                elementLabel.click(function() {
                    element.focus();
                })

                element.focus(function() {
                        elementLabel.hide();
                    })
                    .blur(function() {
                        if (this.value === "") {
                            elementLabel.show();
                        } else {
                            elementLabel.hide();
                        }
                    })
                    // .trigger('blur');
                    // 延迟触发，解决输入框为空时，F5刷新页面，无法显示placeholder
                setTimeout(function() {
                    element.blur();
                }, 0)
            });

            // 表单重置
            $('input[type=reset]').click(function() {
                setTimeout(function() {
                    inputs.blur();
                }, 0)
            })
        }
    }
})
