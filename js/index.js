var options = {
    id: 'treeDemo',
    url: 'xx',
    btn: '111',
    check: true,
    relate: true,
    req: {
        glfid: '123'
    },
    _onCheck: Event,
    _onClick: Event
};
var myTree = new tustTree(options);
function Event(e) {
    console.info(e);
}
