const fs = require("fs");
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const { Creator, sleep } = require("./index2.js");
// 用于爬取 文章主要部分的爬虫代码
async function main() {
    let res = fs.readFileSync("./init.json");
    var arr = JSON.parse(res).map((i) => i.link);
    var total = arr.length;
    for (let i = 0; i < total; i++) {
        let link = arr[i];
        await fetch(link, {
            headers: {
                accept: "*/*",
                "accept-language": "zh-CN,zh;q=0.9",
                "cache-control": "no-cache",
                pragma: "no-cache",
                "sec-ch-ua": '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
                "sec-ch-ua-mobile": "?0",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
            },
            referrer: "https://www.douban.com/group/search?start=100&cat=1013&group=248952&sort=relevance&q=%E5%86%A0%E5%A7%93%E6%9D%83",
            body: null,
            method: "GET",
        })
            .then((res) => res.text())
            .then((res) => {
                $ = cheerio.load(res);
                let num = $(".paginator > a");

                let obj = {
                    link,
                    title: $(".article > h1").text(),
                    text: $(".topic-content").html(),
                    authorName: $(".from a").text(),
                    authorLink: $(".from a").attr("href"),
                    createAt: $(".create-time").text(),
                    replyPageNumber: num && num.length ? parseInt($(num[num.length - 1]).text()) : 0,
                };
                console.log("编号", i, i / total);

                return Creator("myfile", obj).save();
            });
        await sleep(200);
    }
}
main();
