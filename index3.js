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
    // const query = new AV.Query("myfile");
    // query.greaterThan("replyPageNumber", 0);
    // let arr = await query.find().then((res) => {
    //     return res
    //         .map((item) => {
    //             return [...Array(item.attributes.replyPageNumber).keys()].map((index) => `${item.attributes.link}?start=${index * 100}`);
    //         })
    //         .flat();
    // });
    let arr = ["https://www.douban.com/group/topic/106408653/?start=0"];
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
                try {
                    let match = res.match(/(?<=commentsVotes[\s\s]*?=[\s\S]*?')[\s\S]+?(?=')/);
                    var matchMessage = JSON.parse(match[0]);
                } catch (err) {}
                $ = cheerio.load(res);
                let comments = $(".clearfix.comment-item.reply-item ");

                let obj = [...comments].map((item) => {
                    let results = {
                        ArticleLink: link.split("?")[0],
                        time: $(".pubtime", item).text(),
                        authorName: $(".bg-img-green a", item).text(),
                        authorLink: $(".bg-img-green a", item).attr("href"),

                        replyContent: $(".reply-content", item).text(),
                        replyToWhat: $(".reply-quote-content short", item).text(),
                        replyToWho: $(".reply-quote-content pubdate", item).text(),
                        replyToWhoLink: $(".reply-quote-content pubdate", item).attr("href"),
                    };
                    if (matchMessage && matchMessage.length) {
                        results["赞"] = matchMessage["c" + $(item).data("cid")];
                    } else {
                        results["赞"] = 0;
                    }
                    return results;
                });
                obj.length ? all.succ.push(obj) : (all.err.push(link), console.log("错误数", errCounter++));
            });
        await sleep(500);
    }
    console.log(all.err);
    console.log(all.succ);
    // if (all.succ) Creator("comment", all).save();
}
main();
