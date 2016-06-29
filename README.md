# tustTree
version: 0.0.5  
tustTree是基于ztree的封装，利用组合继承等方式使开发人员可以更好的操作树。

## Useage
1. 在您的项目中引入以下CSS文件：  

 ``` html
    <link rel="stylesheet" href="css/zTreeStyle.css">
 ```
 **同级目录需包含ztree的img图标文件夹**

2. 在您的项目中引入以下JavaScript文件  

 ``` html
 <script type="text/javascript" src="js/jquery-1.4.4.min.js"></script>
 <script type="text/javascript" src="js/jquery.ztree.all.min.js"></script>
 <script type="text/javascript" src="js/tustTree.js"></script>
 ```
 - jquery为ztree的依赖文件，需要首先引入
 - ztree.all.js包含了core,check,edit等ztree的所有高级特性
 - tustTree.js为封装的主文件，需要最后引入

## 基础使用
1. 定义tree的容器  

 ``` html
    <div>
        <ul id="treeDemo" class="ztree"></ul>
    </div>
 ```
2. 初始化树
 - 声明配置项
 ``` javascript
    var options = {
        id: 'treeDemo',
        url: 'bsOrganize'
    };
 ```
 若简单使用，则只需要传入id,url两个属性即可，分别为div容器的id值，和后端的Controller名称，不需要包含'/'
 - 实例化tustTree对象  
 ``` javascript
    var myTree = new tustTree(options);
 ```

## 高级特性
``` javascript
   var options = {
       id: 'treeDemo',
       // String，必填，div容器的id值
       url: 'bsOrganize',
       // String/Array，必填
       // String： 后端Controller的名称，则其默认值action为ztreeDis, ztreeAdd, ztreeEdit, ztreeDel, ztreeDrag
       // Array： 若后端的方法不固定，则可以为每个操作传入不同的地址,分别为[disUrl, addUrl, editUrl, removeUrl, dragUrl]
       // 如：['/bsOrganize/myDis', '/bsOrganize/myAdd', '/bsOrganize/myEdit', '/bsOrganize/myDel', '/bsOrganize/myDrag']
       btn: '111',
       // String，默认值'000'，控制新增，编辑，删除三个按钮的显示，1代表显示，0代表隐藏，需要与每个节点的显示属性共同作用
       check: true,
       // Boolean，默认值false，控制是否显示节点的checkbox，true为显示
       relate: true,
       // Boolean，默认值false，控制是否父子节点相关，true为相关
       req: {
           id: '1234',
           content: 'xxx'
       },
       // Object，默认值为null，获取树节点post请求时的请求参数，为一个object类型，可以传入多个值
       _onCheck: Event,
       // Function，默认值null，节点的checkbox勾选事件，下面详细介绍
       _beforeClick: Event,
        // Function，默认值null，如果设置了_beforeClick且返回false，则_onClick不会触发
       _onClick: Event,
       // Function，默认值null，节点的click鼠标单机事件，下面详细介绍
       _onComplete: Event
       // Function，默认值null，树加载完毕的事件，非标准js事件对象
   };
```

## 事件
1. click事件  
 在options中指定相应的_onClick方法  

 ``` javascript
    function Event(event, treeId, treeNode) {
        console.info(e);
    }
 ```
 - event：js event对象，标准的js event对象
 - treeId：String，对应ztree的treeId，便于用户操作
 - treeNode：JSON，被点击的节点JSON数据对象

2. check事件  
 在options中指定相应的_onCheck方法  

 ``` javascript
    function Event(event, treeId, treeNode) {
        console.info(e);
    }
 ```
 - event：js event对象，标准的js event对象
 - treeId：String，对应ztree的treeId，便于用户操作
 - treeNode：JSON，被点击的节点JSON数据对象
3. beforeclick事件  
 在options中指定相应的_beforeClick方法  

 ``` javascript
    function Event(event, treeId, treeNode) {
        if (treeId === '123') {
            return true;
        } else {
            return false;
        }        
    }
 ```
 若指定了_beforeClick方法，且返回值为false，则_onClick不会执行
4. oncomplete事件  
 在options中指定相应的_onComplete方法  

 ``` javascript
    function Event() {
        treeObj.expandAll(true);
    }
 ```
 非js标准事件对象，无event返回值，可以用来展开全部节点等操作

## node数据
以下为与后端交互的JSON数据相关属性：
- Id：String，节点的guid
- PId：String，父节点的guid
- Url：String，节点的url属性
- open： Boolean，是否展开节点，true为展开
- addBtnFlag：Boolean，是否显示新增按钮，此值设置为true且option中第一位设置为'1'才会显示
- editBtnFlag：Boolean，是否显示编辑按钮，此值设置为true且option中第一位设置为'1'才会显示
- removeBtnFlag：Boolean，是否显示删除按钮，此值设置为true且option中第一位设置为'1'才会显示
