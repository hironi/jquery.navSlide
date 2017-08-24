# jquery.navSlide

`jQuery`插件，水平导航背景动画效果

### [点我预览效果吧](https://wanghairong-i.github.io/jquery.navSlide/)

## 介绍

-   封装完善的导航条 `jQuery`插件
-   可自定义多层标签
-   可向标签上绑定任意多组数据，使用简单（类似`artTemplate`模板引擎的使用）
-   可自定义标签的动画晃动幅度
-   生命周期完善，可在多个阶段添加回调函数


## 如何使用

```html

<ul id="box"></ul>

```

```javascript

var list = ['首页', '频道', '促销', '关于我们']
$('#box').navSlide(list);


<!-- 亦可指定标签，并向标签上绑定数据 -->

$('#box').navSlide(list, {
  data: ['1', '2', '3', '4', '5', '6'],
  data3: ['111', '222', '333', '444', '555', '666'],
  itemTag: '<li data-id="{$data}"><a href="{$data3}">'
});

```
