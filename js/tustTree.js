/**
 *  author: Lemoo
 *  email: ifibercc@gmail.com
 *  date: 2016-06-15
 *  version: 0.0.1
 */
'use strict';
var tustTree = function (options) {
    var me = this;
    if (options.id === undefined || options.id === '') {
        console.warn('tree id not set!!');
        return;
    }
    if (options.url === undefined || options.url === '') {
        console.warn('tree url not set!!');
        return;
    }
    // tree setting
    var onClick = options._onClick || null;
    var onCheck = options._onCheck || null;
    // 是否显示tree的checkbox
    var checkEnable = options.check || false;
    // 若显示checkbox且relate为true则父子关联，否则不关联
    var chkboxType = checkEnable && options.relate && { 'Y': 'ps', 'N': 'ps' } || { 'Y': '', 'N': '' };
    // 是否开启编辑模式
    var editEnable = options.btn !== '000' && true || false;
    if (options.btn && typeof options.btn === 'string') {
        var addBtnFlag = options.btn[0] === '0' ? false : true;
        var editBtnFlag = options.btn[1] === '0' ? false : true;
        var removeBtnFlag = options.btn[2] === '0' ? false : true;
    }
    var drag = options.drag || true;
    var setting = {
        callback: {
            beforeRename: beforeRename,
            onRename: onRename,
            onClick: onClick,
            onCheck: onCheck,
            beforeRemove: beforeRemove,
            onRemove: onRemove
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
        addUrl,
        editUrl,
        removeUrl,
        dragUrl;
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
            removeUrl = ctrlUrl + '/ztreeDel';
            dragUrl   = ctrlUrl + '/ztreeDrag';
        } else {
            // 如果是字符数组，则1为显示2为新增3为编辑4为删除
            disUrl    = options.url[0] || '';
            addUrl    = options.url[1] || '';
            editUrl   = options.url[2] || '';
            removeUrl = options.url[3] || '';
            dragUrl   = options.url[4] || '';
        }
    }
    var zTreeObj;
    // zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
    $.post(disUrl, function (data) {
        // var data = [
        //     {Name:"test1", Id: '1', PId: '0', open:true, addBtnFlag: false},
        //     {Name:"test1", Id: '2', PId: '1', open:true, editBtnFlag: false},
        //     {Name:"test1", Id: '3', PId: '1', open:true, removeBtnFlag: false},
        //     {Name:"test1", Id: '4', PId: '1', open:true}
        // ];
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
            $.post(addUrl, {
                Id: guid,
                Name: "新增" + (me.newCount-1), PId: treeNode.Id
                }, function (data) {
                    DWZ && DWZ.ajaxDone(data);
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
        if (treeNode.addBtnFlag !== null && treeNode.addBtnFlag !== undefined) {
            if (treeNode.addBtnFlag === true) {
                return addHoverDom(treeId, treeNode);
            } else {
                return null;
            }
        } else {
            if (addBtnFlag) {
                return addHoverDom(treeId, treeNode);
            } else {
                return null;
            }
        }
    }
    // 每个节点removehover方法
    function hiddeAddBtn(treeId, treeNode) {
        if (treeNode.addBtnFlag !== null && treeNode.addBtnFlag !== undefined) {
            if (treeNode.addBtnFlag === true) {
                return removeHoverDom(treeId, treeNode);
            } else {
                return null;
            }
        } else {
            if (addBtnFlag) {
                return removeHoverDom(treeId, treeNode);
            } else {
                return null;
            }
        }
    }
    // 每个节点是否显示编辑按钮
    function showRenameBtn(treeId, treeNode) {
        // 若treeNode.editBtnFlag为空则是主树默认值，否则按节点值
        if (treeNode.editBtnFlag !== null && treeNode.editBtnFlag !== undefined) {
            if (treeNode.editBtnFlag === true) {
                return true;
            } else {
                return false;
            }
        } else {
            if (editBtnFlag) {
                return true;
            } else {
                return false;
            }
        }
    }
    // 每个节点是否显示删除按钮
    function showRemoveBtn(treeId, treeNode) {
        // 若treeNode.removeBtnFlag为空则是主树默认值，否则按节点值
        if (treeNode.removeBtnFlag !== null && treeNode.removeBtnFlag !== undefined) {
            if (treeNode.removeBtnFlag === true) {
                return true;
            } else {
                return false;
            }
        } else {
            if (editBtnFlag) {
                return true;
            } else {
                return false;
            }
        }
    }
    // 修改保存前判断是否合法
    function beforeRename(treeId, treeNode, newName) {
        if (newName === '') {
            alert("节点名称不能为空.");
            var zTree = $.fn.zTree.getZTreeObj(options.id);
            setTimeout(function () { zTree.editName(treeNode) }, 10);
            return false;
        }
        return true;
    }
    // 保存数据
    function onRename(e, treeId, treeNode, isCancel) {
        $.post(editUrl, {
            Id: treeNode.Id,
            Name: treeNode.Name
        }, function (data) {
                // DWZ && DWZ提示框的方法
                DWZ && DWZ.ajaxDone(data);
        });
    }
    // 删除前弹框确认
    function beforeRemove(treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj(options.id);
        zTree.selectNode(treeNode);
        return confirm("确认删除节点 -- " + treeNode.Name + " 吗？");
    }
    // 保存数据
    function onRemove(e, treeId, treeNode) {
        $.post(removeUrl, {
            Id: treeNode.Id
            }, function (data) {
                DWZ && DWZ.ajaxDone(data);
        });
    }
    // 判断是否允许拖拽
    function beforeDrag(treeId, treeNodes) {
        return drag;
    }
    // 拖拽完成的事件
    function beforeDrop(treeId, treeNodes, targetNode, moveType) {
        $.post(dragUrl, {
            Id: treeNodes[0].Id,
            PId: targetNode.Id
            }, function (data) {
                DWZ && DWZ.ajaxDone(data);
                if (true) {
                    // todo 判断是否允许放下，根据返回值判断
                }
        });
        return true;
    }
};
tustTree.prototype.constructor = tustTree;
