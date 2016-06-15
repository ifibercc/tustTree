var tustTree = function (options) {
    var me = this;
    if (options.id === undefined || options.id === '') {
        console.warn('tree id not set!!');
        return;
    }
    // tree setting
    var onRename = options._onEdit || null;
    var onClick = options._onClick || null;
    var onCheck = options._onCheck || null;
    var beforeRemove = options._beforerRemove || null;
    // 是否显示tree的checkbox
    var checkEnable = options.check || false;
    // 若显示checkbox且relate为true则父子关联，否则不关联
    var chkboxType = checkEnable && options.relate &&  { 'Y': 'ps', 'N': 'ps' } || { 'Y': '', 'N': '' };
    // 是否开启编辑模式
    var editEnable = options.edit !== '000' && true || false;
    if (options.edit && typeof options.edit === 'string') {
        var addBtnFlag = !!options.edit[0];
        var editBtnFlag = !!options.edit[1];
        var removeBtnFlag = !!options.edit[2];
    }
    var setting = {
        callback: {
            onRename: onRename,
            onClick: onClick,
            onCheck: onCheck,
            beforeRemove: beforeRemove
        },
        check: {
            enable: checkEnable,
            chkStyle: "checkbox",
            chkboxType: chkboxType
        },
        data: {
            key: {
                name: "Name",
                url: "Url",
                checked: "Checked"
            },
            simpleData: {
                enable: true,
                idKey: "Id",
                pIdKey: "PId"
            }
        },
        edit: {
            drag: {
                isCopy: false,
                prev: false,
                next: false
            },
            enable: editEnable,
            editNameSelectAll: true,
            showRemoveBtn: showRemoveBtn,
            showRenameBtn: showRenameBtn
        },
        view: {
            addHoverDom: showAddBtn,
            removeHoverDom: hiddeAddBtn,
            selectedMulti: false
        }
    };


// tree node
    var ctrlUrl,
        disUrl,
        editUrl,
        removeUrl;
    // url可以设置controller的地址然后后台拼接，也可传输指定字符数组
    if (options.url === undefined || options.url === '') {
        console.warn('data url not set!!');
        return;
    } else {
        if (typeof options.url === 'string') {
            ctrlUrl   = options.url;
            disUrl    = ctrlUrl + '/ztreeDis';
            addUrl    = ctrlUrl + '/ztreeAdd';
            editUrl   = ctrlUrl + '/ztreeEdit';
            removeUrl = ctrlUrl + '/ztreeRemove';
        } else {
            // 如果是字符数组，则1为显示2为新增3为编辑4为删除
            disUrl    = options.url[0] || '';
            addUrl    = options.url[1] || '';
            editUrl   = options.url[2] || '';
            removeUrl = options.url[3] || '';
        }
    }
    var zTreeObj;
    // zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
    $.post(disUrl, function (data) {
        var data = [
            {Name:"test1", Id: '1', PId: '0', open:true},
            {Name:"test1", Id: '2', PId: '1', open:true},
            {Name:"test1", Id: '3', PId: '1', open:true},
            {Name:"test1", Id: '4', PId: '1', open:true}
        ];
        zTreeObj = $.fn.zTree.init($('#' + options.id), setting, data);
        me.currentTree = zTreeObj;
    });
    // 新增按钮hover方法
    me.newCount = 1;
    function addHoverDom(treeId, treeNode) {
        var guid = guid();
        var sObj = $("#" + treeNode.tId + "_span");
        if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0)
            return;
        var addStr = "<span class='button add' id='addBtn_" + treeNode.tId + "' title='add' onfocus='this.blur();'></span>";
        sObj.after(addStr);
        var btn = $("#addBtn_" + treeNode.tId);
        if (btn) btn.bind("click", function () {
            var zTree = $.fn.zTree.getZTreeObj(options.id);
            zTree.addNodes(treeNode, { Id: guid, PId: treeNode.Id, Name: "新增" + (me.newCount++) });
            $.post(addUrl, { Id: guid, Name: "新增" + (me.newCount-1), PId: treeNode.Id }, function (data) {
                    DWZ.ajaxDone(data);
            });
            return false;
        });
        function guid() {
            function S4() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }
            return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        }
    }
    // 新增按钮blur方法
    function removeHoverDom(treeId, treeNode) {
        $("#addBtn_" + treeNode.tId).unbind().remove();
    };
    // 每个节点是否显示新增按钮
    function showAddBtn(treeId, treeNode) {
        if (addBtnFlag === true || treeNode.addBtnFlag === true) {
            console.info(1);
            return addHoverDom(treeId, treeNode);
        } else {
            return null;
        }
    }
    // 每个节点removehover方法
    function hiddeAddBtn(treeId, treeNode) {
        if (addBtnFlag === true || treeNode.addBtnFlag === true) {
            return removeHoverDom(treeId, treeNode);
        } else {
            return null;
        }
    }
    // 每个节点是否显示编辑按钮
    function showRenameBtn(treeId, treeNode) {
        // 若treeNode.editBtnFlag为空则是主树默认值，否则按节点值
        return treeNode.editBtnFlag || editBtnFlag;
    }
    // 每个节点是否显示删除按钮
    function showRemoveBtn(treeId, treeNode) {
        // 若treeNode.removeBtnFlag为空则是主树默认值，否则按节点值
        return treeNode.removeBtnFlag || removeBtnFlag;
    }
};
tustTree.prototype.constructor = tustTree;
