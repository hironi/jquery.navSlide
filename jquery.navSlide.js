;(function($){
  /* 
  ** 水平导航 背景动画
  ** 如何使用： $(boxSelector).navSlide(opt);
  **
  ** @param opt        [可选] <Obj>
  **   - index:        [可选] <Num> 默认0  当前高亮的item的索引值
  **   - style:        [可选] <Obj> 高亮背景的样式
  **   - click:        [可选] <Func> 点击每个item时执行的函数，参数为点击item的索引值
  **   - mouseenter:   [可选] <Func> 鼠标经过每个item时执行的函数，参数为点击item的索引值(该函数会在动画执行完后执行)
  **
  ** 注意： 布局时，item的宽高应该用width实现，而不要通过padding、margin实现
  ** from: https://github.com/wanghairong-i
  ** time: 2016.4.28
  */
  $.fn.extend({
    navSlide: function(opt){
      var $box = $(this),
          boxCss_position = $box.css('position'),
          $item = $box.children(),
          iNodeName = $item[0].tagName, //item的节点名，用于生成背景标签、绑定事件
          itemWidth = $item.outerWidth(true);
      opt = $.extend({
        index: 0, //高亮item的索引值
        style: {
          position: 'absolute',
          zIndex: -1,
          background: '#eee',
          left: index*itemWidth + 'px'
        }
      }, opt || {});
      var index = opt.index,
          click = opt.click,
          mouseenter = opt.mouseenter,
          position = 0, //实时记录 背景元素 所在位置，值是 背景元素 距离容器左侧位置
          backdropStyle = opt.style,
          $backdrop = $('<' + iNodeName + '/>').css(backdropStyle).attr('data-sign','backdrop');//添加data-sign属性，方便在插件外选取该元素

      function events(){
        var enents = {
          mouseenter: function(){
            slider($(this).index(), mouseenter);
          },
          click: function(){
            index = $(this).index();
            click && click(index);
            return false;
          }
        };
        $box
        .on(enents, iNodeName)
        .on('mouseleave', function(){
          slider(index);
        });
      }

      function slider(i, fn){
        var floatWitch = 10,
            turnWidth = i*itemWidth,
            turnRight = position > turnWidth ? true : false; //判断是否是向右滚动，false则为向左滚动
        position = turnWidth;
        $backdrop.stop().animate({
          left: turnRight ? position - floatWitch : position + floatWitch
        }, 300, function(){
          $backdrop.stop().animate({
            left: position
          }, 100, function(){
            fn && fn(i);
          });
        });
      }

      if(boxCss_position === 'static')$box.css('position', 'relative');//如果容器没有position属性，则js增加
      $box.append($backdrop); //将 背景元素 添加到容器内
      events(); // 绑定事件

      return this;
    }
  });
}(jQuery));
