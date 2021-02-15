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

AV.init({
    appId: "7o55uh5WGJtci5Y8dq2vtDGh-gzGzoHsz",
    appKey: "fSd20fAMeXzkCohBaqieWqCj",
    serverURL: "https://7o55uh5w.lc-cn-n1-shared.com",
});
module.exports = {
    Creator,
    sleep,
};
