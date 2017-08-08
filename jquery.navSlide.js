;(function($){
  /* 
  ** 水平导航 背景动画
  ** 如何使用： $(boxSelector).navSlide(opt);
  ** @param list       [必传] <Array> 列表项
  ** @param opt        [可选] <Obj>
  **   - index:        [可选] <Num> 默认0  当前高亮的item的索引值
  **   - style:        [可选] <Obj> 高亮背景的样式
  **   - float:        [可选] <Num> 默认10 鼠标划过时的左右晃动幅度
  **   - itemTag:      [可选] <Str> 默认<li> 每个item项的开始标签，可定义任意属性，可支持2个标签，如 <li data-id="xxx"><a href="xxx">
  **   - click:        [可选] <Func> 点击每个item时执行的函数，两个参数，第一个是点击的item（jQuery对象），第二个是该item的索引值
  **   - mouseenter:   [可选] <Func> 鼠标经过每个item时执行的函数，参数为点击item的索引值(该函数会在动画执行完后执行)
  **
  ** 注意： 布局时，item的宽高应该用width实现，而不要通过padding、margin实现
  ** from: https://github.com/wanghairong-i
  ** time: 2016.4.28
  */
  $.fn.extend({
    navSlide: function(list, opt){
      var $t = $(this),
          boxCss_position = $t.css('position'),
          iTagName = 'li', //item的节点名，用于生成背景标签、绑定事件，默认为Li
          itemTag = opt && opt.itemTag || '<li>', //最多支持两个标签
          itemWidth,
          index;

      // 开始渲染
      render(function(){
        itemWidth = $t.find(iTagName).outerWidth(true);
        opt = $.extend({
          index: 0, //高亮item的索引值
          float: 10,
          style: {
            position: 'absolute',
            zIndex: -1,
          }
        }, opt || {});
        index = opt.index;
        opt.style.left = index*itemWidth + 'px';
      });

      var index = opt.index,
          click = opt.click,
          float = opt.float,
          mouseenter = opt.mouseenter,
          position = 0, //实时记录 背景元素 所在位置，值是 背景元素 距离容器左侧位置
          backdropStyle = opt.style,
          $backdrop;//添加data-sign属性，方便在插件外选取该元素

      function render(call){
        $t.append(function(){
          return list.map(function(v){
            return itemTag + v + endTag(itemTag)
          }).join('');
        });
        call && call();
      }

      function endTag(tag){ //完善tag标签，参数为true时说明是结束标签
        return tag.replace(/\s*?<\s*?(\w+)\s*?.*?>\s*?(?:<\s*?(\w+)\s*?.*?>)?/gi, function($0, $1, $2){
          $1 ? iTagName = $1 : '';
          return '</' + iTagName + '>' + ($2 ? ('</' + $2 + '>') : '');
        })
      }

      function events(){
        var enents = {
          mouseenter: function(){
            var $this = $(this);
            slider($this.index(), mouseenter, $this);
          },
          click: function(){
            var $this = $(this);
            index = $this.index();
            click && click($this, index);
            return false;
          }
        };
        $t
        .on(enents, iTagName)
        .on('mouseleave', function(){
          slider(index);
        });
      }

      function slider(i, fn, $this){
        var turnWidth = i*itemWidth,
            turnRight = position > turnWidth ? true : false; //判断是否是向右滚动，false则为向左滚动
        position = turnWidth;
        $backdrop.stop().animate({
          left: turnRight ? position - float : position + float
        }, 300, function(){
          $backdrop.stop().animate({
            left: position
          }, 100, function(){
            fn && fn($this, i);
          });
        });
      }

      if(boxCss_position === 'static')$t.css('position', 'relative');//如果容器没有position属性，则js增加
      $backdrop = $('<' + iTagName + '/>').css(backdropStyle).attr('data-sign','backdrop'); //滑动动画的背景标签
      $t.append($backdrop); //将 背景元素 添加到容器内
      events(); // 绑定事件

      return this;
    }
  });
}(jQuery));
