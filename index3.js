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
    let arr = [
        "https://www.douban.com/group/topic/175234705/?start=800",
        "https://www.douban.com/group/topic/175234705/?start=900",
        "https://www.douban.com/group/topic/175234705/?start=1000",
        "https://www.douban.com/group/topic/175234705/?start=1200",
        "https://www.douban.com/group/topic/175234705/?start=1300",
        "https://www.douban.com/group/topic/207324203/?start=0",
        "https://www.douban.com/group/topic/207324203/?start=100",
        "https://www.douban.com/group/topic/196853161/?start=100",
        "https://www.douban.com/group/topic/205641024/?start=100",
        "https://www.douban.com/group/topic/175394317/?start=400",
        "https://www.douban.com/group/topic/175394317/?start=500",
        "https://www.douban.com/group/topic/175394317/?start=700",
        "https://www.douban.com/group/topic/192973942/?start=0",
        "https://www.douban.com/group/topic/192973942/?start=200",
        "https://www.douban.com/group/topic/182637256/?start=0",
        "https://www.douban.com/group/topic/182637256/?start=400",
        "https://www.douban.com/group/topic/182637256/?start=500",
        "https://www.douban.com/group/topic/182637256/?start=600",
        "https://www.douban.com/group/topic/208783008/?start=300",
        "https://www.douban.com/group/topic/194264769/?start=300",
        "https://www.douban.com/group/topic/194264769/?start=400",
        "https://www.douban.com/group/topic/194264769/?start=500",
        "https://www.douban.com/group/topic/205432489/?start=200",
        "https://www.douban.com/group/topic/205432489/?start=300",
        "https://www.douban.com/group/topic/205432489/?start=400",
        "https://www.douban.com/group/topic/205432489/?start=500",
        "https://www.douban.com/group/topic/205432489/?start=600",
        "https://www.douban.com/group/topic/170388876/?start=0",
        "https://www.douban.com/group/topic/170388876/?start=400",
        "https://www.douban.com/group/topic/170361210/?start=0",
        "https://www.douban.com/group/topic/170361210/?start=100",
        "https://www.douban.com/group/topic/170361210/?start=200",
        "https://www.douban.com/group/topic/160335228/?start=200",
        "https://www.douban.com/group/topic/175341701/?start=0",
        "https://www.douban.com/group/topic/175341701/?start=100",
        "https://www.douban.com/group/topic/175341701/?start=200",
        "https://www.douban.com/group/topic/175341701/?start=300",
        "https://www.douban.com/group/topic/181091439/?start=0",
        "https://www.douban.com/group/topic/181091439/?start=100",
        "https://www.douban.com/group/topic/181091439/?start=200",
        "https://www.douban.com/group/topic/181091439/?start=300",
        "https://www.douban.com/group/topic/207864339/?start=0",
        "https://www.douban.com/group/topic/207864339/?start=100",
        "https://www.douban.com/group/topic/205556608/?start=0",
        "https://www.douban.com/group/topic/205556608/?start=100",
        "https://www.douban.com/group/topic/205556608/?start=200",
        "https://www.douban.com/group/topic/175187663/?start=100",
        "https://www.douban.com/group/topic/175187663/?start=200",
        "https://www.douban.com/group/topic/206340320/?start=0",
        "https://www.douban.com/group/topic/206340320/?start=200",
        "https://www.douban.com/group/topic/192917081/?start=0",
        "https://www.douban.com/group/topic/192917081/?start=100",
    ];
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
            .then((res) => sleep(random(1, 10) * 1000));
    }
    Creator("comment", all).save();
}
main();

function random(n, m) {
    parseInt(Math.random() * (m - n) + n) + 1;
}
