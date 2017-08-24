;(function($){
  /* 
  ** jquery.navSlide.js 水平导航 背景动画
  ** 如何使用： $(selector).navSlide(list[, options]);
  **
  ** @param list      [必传] <Array> 列表项
  ** @param options   [可选] <Obj>
  **   - index:          [可选] <Num> 默认0  当前高亮的item的索引值
  **   - ['data' + \d]:  [可选] <Arr> 渲染到标签上的数据，\d表示任意数字，可增加任意多条data数组，例如data3，data5，在标签上通过{$data3}、{$data5}获取该数组里对应索引值的值，数组长度应与@param：list的长度相同
  **   - move:          [可选] <Num> 默认10 鼠标划过时的左右晃动幅度
  **   - itemTag:        [可选] <Str> 默认<li> 每个item项的开始标签，可定义任意属性，可支持2个标签，如 <li data-id="xxx"><a href="xxx">
  **   - style:          [可选] <Obj> 高亮背景的样式
  **   - click:          [可选] <Func> 点击每个item时执行的函数，两个参数，第一个是点击的item（jQuery对象），第二个是该item的索引值
  **   - mouseenter:     [可选] <Func> 鼠标经过每个item时执行的函数，参数为点击item的索引值(该函数会在动画执行完后执行)
  **
  ** 注意： 布局时，item的宽高应该用width实现，而不要通过padding、margin实现
  ** from: https://github.com/wanghairong-i
  ** time: 2016.4.28
  */
  $.fn.extend({
    navSlide: (function(){
      var defaultOptions = {
        index: 0,
        move: 10,
        style: {
          position: 'absolute',
          zIndex: -1,
        }
      };
      function getEndTag(tag){ //传入开始标签，最多2个标签，如<li data-id="xxx"><a href="xxx">，返回值是根据开始标签生成的结束标签，如</a><li>
        return tag.replace(/\s*?<\s*?([A-z]+)\s*?.*?>\s*?(?:<\s*?([A-z]+)\s*?.*?>)?/gi, function($0, $1, $2){
          $1 = $1 || 'li';
          return ($2 ? ('</' + $2 + '>') : '') + '</' + $1 + '>';
        });
      }
      function getTagname(tag){
        var result = tag.match(/^<\s*?([A-z]+)/i);
        return result && result[1];
      }
      function addDataToTag(obj, i, tag){
        if(!tag || !obj)return '';
        tag = tag.replace(/\{\s*?\$data(?:\d*)?\s*?\}/gi, function($0){
          var prop = $0.substring(2, $0.length-1);
          if(obj[prop]){
            return obj[prop][i];
          }
        });
        return tag;
      }
      return function(list, options){
        var $t = $(this),
            options = options || {},
            itemTag = options && options.itemTag && options.itemTag.replace(/^\s*?|\s*?$/g, '') || '<li>', //最多支持两个标签
            iTagName = getTagname(itemTag) || 'li', //item的节点名，用于生成背景标签、绑定事件，默认为Li
            itemWidth,
            index;

        // 开始渲染
        render(list, function(){
          itemWidth = $t.find(iTagName).outerWidth(true);
          options = $.extend({}, defaultOptions, options);
          index = options.index;
          options.style.left = index*itemWidth + 'px';
        });

        var click = options.click,
            move = options.move,
            mouseenter = options.mouseenter,
            position = 0, //实时记录 背景元素 所在位置，值是 背景元素 距离容器左侧位置
            backdropStyle = options.style,
            $backdrop;//添加data-sign属性，方便在插件外选取该元素

        function render(list, call){
          var endTag = getEndTag(itemTag);
          $t.append(function(){
            if(list.map){
              return list.map(function(v, i){
                return addDataToTag(options, i, itemTag) + v + endTag;
              }).join('');
            }else{
              for(var i=0; i<list.length; i++){
                list[i] = addDataToTag(options, i, itemTag) + list[i] + endTag;
              }
              return list.join('');
            }
          });
          call && call();
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
            left: turnRight ? position - move : position + move
          }, 300, function(){
            $backdrop.stop().animate({
              left: position
            }, 100, function(){
              fn && fn($this, i);
            });
          });
        }

        if($t.css('position') === 'static')$t.css('position', 'relative');//如果容器没有position属性，则js增加
        $backdrop = $('<' + iTagName + '/>').css(backdropStyle).attr('data-sign','backdrop'); //滑动动画的背景标签
        $t.append($backdrop); //将 背景元素 添加到容器内
        events(); // 绑定事件

        return this;
      };
      
    }())
  });
}(jQuery));
