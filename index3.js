// 主要用于爬取文章评论部分的代码
// 每次 100 条
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const { Creator, sleep } = require("./index2.js");
const AV = require("leancloud-storage");
// 从数据库中取出URL数组
let all = {
    succ: [],
    err: [],
};
let errCounter = 0;
async function main() {
    const query = new AV.Query("myfile");
    query.greaterThan("replyPageNumber", 0);
    let arr = await query.find().then((res) => {
        return res
            .map((item) => {
                return [...Array(item.attributes.replyPageNumber).keys()].map((index) => `${item.attributes.link}?start=${index * 100}`);
            })
            .flat();
    });
    let total = arr.length;
    console.log("总数", total);
    for (var i = 0; i < total; i++) {
        let link = arr[i];
        console.log("编号开始", i);
        await fetch(link, {
            referrer: link,
            method: "GET",
        })
            .then((res) => res.text())
            .then((res) => {
                $ = cheerio.load(res);
                let comments = $(".comment-item.reply-item");

                let obj = [...comments].map((item) => {
                    return {
                        ArticleLink: link.split("?")[0],
                        time: $(".pubtime", item).text(),
                        authorName: $(".bg-img-green a", item).text(),
                        authorLink: $(".bg-img-green a", item).attr("href"),
                        赞: parseInt($(".lnk-reply ", item).text().replace(/\D/g, "") || 0),
                        replyContent: $(".reply-content", item).text(),
                        replyToWhat: $(".reply-quote-content short", item).text(),
                        replyToWho: $(".reply-quote-content pubdate", item).text(),
                        replyToWhoLink: $(".reply-quote-content pubdate", item).attr("href"),
                    };
                });
                obj.length ? all.succ.push(obj) : (all.err.push(link), console.log("错误数", errCounter++));
            })
            .then((res) => {
                sleep(random(10, 20) * 1000);
            });
    }
}
main();
Creator("comment", all).save();
function random(n, m) {
    parseInt(Math.random() * (m - n) + n) + 1;
}
