const AV = require("leancloud-storage");
function Creator(where, what) {
    //创建一个数据库对象实例
    const Pos = AV.Object.extend(where);
    const pos = new Pos();
    Object.entries(what).forEach(([key, val]) => {
        pos.set(key, val);
    });
    // 将对象返回
    return pos;
}
function sleep(ms) {
    return new Promise((res) => {
        setTimeout(() => {
            res();
        }, ms);
    });
}
function saveMessage(listName, array) {
    const query = new AV.Query(listName);
    query.select(["link"]);
    query.descending("updatedAt");
    query.limit(1000);
    query.find().then((mark) => {
        let Mark = mark.map((i) => i.attributes.link);
        let needUpload = array
            .map((i) => {
                if (!Mark.includes(i.link)) {
                    return Creator(listName, i);
                } else {
                    return null;
                }
            })
            .filter((i) => i);
        console.log(needUpload.length + "个数据被保存");
        return AV.Object.saveAll(needUpload);
    });
}

AV.init({
    appId: "7o55uh5WGJtci5Y8dq2vtDGh-gzGzoHsz",
    appKey: "fSd20fAMeXzkCohBaqieWqCj",
    serverURL: "https://7o55uh5w.lc-cn-n1-shared.com",
});
module.exports = {
    saveMessage,
    Creator,
    sleep,
};
