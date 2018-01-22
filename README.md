# EGO项目——网易前端微专业

## 项目介绍
> Ego 项目是一款动漫类的产品，本身有很多功能，这里主要做了五个功能模块，分别是首页、登录、注册、我的作品和创建作品，整体采用组件来搭建页面，通过原生JavaScript实现，简单看一下用到的组件和功能点。

+ 首页：Tab导航栏组件、搜索框、明日之星关注、登录和注册
+ 作品列表页：分页组件、用户创建的作品列表、作品编辑/删除组件、根据用户信息(注册模块需要写入生日和地所在地)计算用户星座和城市 
+ 作品创建页：设置作品风格标签、作品分类、作品权限、上传作品(支持单个上传、批量上传以及拖拽上传)


> 备注：原本有一个后端接口提供数据支持，但是github上必须要https的链接，访问http接口会被block，查找资料添加了一个
`<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">`转成https，但是网易这边又不给过，就先凑合看吧，如果想要完整的演示效果需要安装nei，访问[http://59.111.103.100/](http://59.111.103.100/)。

> 对于组件我打算再重新梳理一下，之前有的部分为了省事没有考虑到继承或者更优化的方法，所以尽量写的健壮、可复用一点。  [传送门](https://github.com/suminhohu/Component/)

## 实现的功能以及思路

### 1.首页 

#### 1.1 顶部tab

>  有选中效果
hover动画效果

点击相应的导航栏（tab）滑块变色且选中该位置，需要一个设定位置的方法和高亮滑块的方法。设定位置可以通过增加或者删除一个类来实现，当点击某个tab的时候设置一个z-active的类，标识这个tab被选中，然后高亮它；高亮的方法我们这里需要通过tab的offsetWidth和offsetLeft值来判断，这样就可以根据tab字的多少自适应宽度。

####  1.2 顶部搜索
> 输入非空进行搜索操作
 回车和点击图标都可进行搜索操作

搜索组件可以通过一个form表单来提交，这样我们就不需要单独为click事件和回车事件分开写，这里只需要判断输入内容不为空即可，阻止默认事件，满足条件后再触发submit事件提交。

####  1.3 登录后顶部展示用户信息
> 用户名很长…显示
hover出现下拉列表
点击“退出登录”退出，跳转到首页

用户名过长通过'...'显示，可以通过css中的{white-space:nowrap; overflow:hidden; text-overflow:ellipsis;}来实现；hover出现下拉列表，这里要注意的是顶栏的部分不能动，所以这里我是用的ul列表整体{padding-top: 90px;margin-top: -90px;}实现ul列表不会盖住顶栏，然后hover的时候通过.m-login-info:hover .menus{display: block;}实现；退出登录即隐藏个人信息，显示登录注册button，需要删除用户登录的cookie。

#### 1.4 轮播图
> 图片垂直剧中
 图片5s切换（500ms淡入淡出）
 点击指示器定位到指定图片
 hover上去轮播停止，hover退出轮播继续
 图片可以通过鼠标拖动切换

图片垂直居中可以通过top: 50%;和transform属性来实现；轮播组件比较复杂，会单独开一个issue来分解这个组件，轮播组件是这个项目中比较复杂的，因为涉及到的点比较多，有自动轮播，选中下标定位到指定图片，hover时要暂停并清空计时，还要拖拽可以轮播，这里我这是做了轮播图的组件，其实也可以把指示器也封装成组件，或者和分页器结合。

#### 1.5 明日之星
> 通过Ajax获取推荐关注列表
未登录时，点击关注，弹出登录弹窗
已登录时，关注和取消关注功能可用
侧边热门话题2行显示，文字太多直接截断

由于明日之星要渲染列表，还要渲染每个列表的数据，所以这里就比较复杂，关注和取消关注时候通过事件代理我无法获取同级节点的数据，因为子列表的数据不只是在button上，所以我是通过先向上找节点然后再去获取想要的子节点的数据，有的甚至通过正则来获取，其实应该有更好的方法的。ajax回头在工具类里说，已登录和未登录我们需要分开处理，我是通过cookie来判断的是否登录的，如果没有相应的cookie则触发登录事件，弹出登录框，这里用到了事件发射器，登录后就是取消和关注可以用即可，这里通过添加z-active类即可实现，其他的就是ajax相关操作。



### 2.登录
#### 2.1 数据验证
> 手机号非空，11位数字
密码非空
验证失败，相应输入框变红

通过正则表达式验证，输入错误通过新增类来实现输入框变色

#### 2.2  登录
> 登录功能可用
登录成功后，如果在首页，首页的明日之星列表需要刷新数据
登录不成功，显示错误
点击立即注册，关闭登录弹窗，弹出注册弹窗
点击关闭图标，弹窗关闭

登录modal继承通用modal，登录成功与否通过cookie判断，信息通过验证则写入登录成功的cookie来通知startList刷新，通过事件发射器触发注册弹窗。

###  3. 注册
#### 3.1 级联选择器可用
> 地区数据正确
生日数据，大小月30/31日，闰年2月29日数据正确

这里我们可以发现地区数据和日期数据的数据结构相似，这里需要处理成通用的数据格式来调用，最开始是模仿之前写过的级联操作，但是需要写多个组件，后面想将相同的操作提取，select组件做数据下拉列表更新和展开关闭行为以及选中和非选中等，级联组件则做一个父组件来触发级联关系渲染下一级数据即可。

#### 3.2 验证码
> 验证码显示正确
点击验证码更新

验证码比较简单，点击更新验证码则可以加一个随机时间戳，通过 '+new Date()'来实现。


#### 3.3 表单验证
> 手机号非空，11位数字
昵称中文英文数字均可，至少8个字符
密码长度6-16位字符
验证失败，相应输入框变红

和登录部分类似，加了一个昵称验证。

#### 3.4 注册
> 注册功能可用
注册成功关闭注册弹窗，打开登录弹窗
注册不成功，显示错误

调用注册接口，在success回调函数中注册登录事件，然后在初始化页面触发该登录事件即可在完成注册后打开登录弹窗，显示错误提示就是通过新增一个类，验证不通过将其显示，验证通过隐藏。

### 4. 我的作品
> 年龄、星座、城市名计算正确
作品列表加载正常，加载列表期间要显示loading图标，没有作品时有文案提示
 分页功能正常可用

我的作品页必须是登录状态，所以需要检测cookie，从work tab点击时候如果没有登录则需要弹出登录弹窗，我的作品页分三个部分，一个是用户个人信息的获取并转换成年龄和星座；用户作品列表数据的渲染，分页器组件。其中分页器和列表数据不要耦合，分页还是由后端分页，前端只做样式渲染，并规定好每页展示多少数据等。用户作品需要可编辑和删除，这里调用相应的接口，在初始化的时候注册相应的弹窗，然后点击相应的位置弹出对应的弹窗。

### 5. 上传作品
#### 5.1 表单元素行为正常：
> 作品分类按钮组状态互斥
权限设置按钮组状态互斥
作品授权的模拟下拉菜单

作品分类和权限设置这里是用的单选按钮实现互斥的，都是用css实现的，这里没有绑定相应的事件，需要修改；作品授权通过获取到相应的值，然后渲染到页面即可。

#### 5.2  图片上传功能可用：
> 实现上传图片本地预览
图片可以批量上传
设置封面功能正常
上传过程中可以添加新图片、取消未上传完成的旧图片
每张图片上传过程中均有进度条
单张图片的大小小于1MB
每次最多选择10张图片，超过10张要有弹窗提示

上传图片实现了，但是本地预览需要用HTML5的File API提供了File和FileReader两个主要对象，可以获得文件信息并读取文件。这里着急还没去实现，需要修改；图片批量上传可以设置一个请求队列实现 批量上传；上传过程中我是设置的不可添加新图片，也没有取消未上传的图片，这里没有注意到要求，需要改进；进度条使用HTML5原生进度条；后面两个通过检测文件大小和文件数量即可。


#### 5.3 标签组件功能可用：
> 加载系统推荐标签
标签可删除
标签可添加

标签组件需要可以新增标签和删除标签还有给标签添加各种自定义事件，这里逻辑不是那么复杂但是考虑的点比较多，标签需要支持字符串，还有判断标签添加位置等。

#### 5.4 表单可正常提交
> 不丢失任何数据信息
提交前需要检查作品名称是否为空

提交表单通过form实现，这里需要看接口文档，需要拿到所有字段才能上传成功，这里先建一个空对象，然后通过属性继承拿到所有字段，再去检查字段是否正确，最后在提交。


## 改进的地方
1、登录后个人信息需要组件化
2、图片上传需要实现本地预览
3、上传过程中可以暂停和取消
4、

## 预览效果

+ 首页：[https://suminhohu.github.io/ego/html/index.html](https://suminhohu.github.io/ego/html/index.html)
+ 作品列表页：[https://suminhohu.github.io/ego/html/works/myworks.html](https://suminhohu.github.io/ego/html/works/myworks.html)
+ 上传作品页：[https://suminhohu.github.io/ego/html/works/upload.html](https://suminhohu.github.io/ego/html/works/upload.html)


> 这里访问的时候有些地方就看不了，所以我也截图存放在'showImg'文件夹中，方便对比。如果你想看完整的交互你可以安装nei服务，具体步骤如下：

1. 通过npm安装nei，命令为 `npm install nei -g`
2. 然后在你的目录下创建ego项目，命令为 `nei build -k e389c52125abdd607c4455e4d448e5d3 -o ./ego`
3. 将源码放进public文件夹即可，修改server.config.js，然后启动nei，`nei server`



