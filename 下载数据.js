const AV = require("leancloud-storage");
const XLSX = require("xlsx");
const { Creator, sleep } = require("./index2.js");
// 使用后会直接下载并创建两个文件
async function main() {
    // let query = new AV.Query("myfile");
    // await query.find().then((res) => {
    //     let result = res.map((i) => {
    //         let { link, title, text, authorName, authorLink, createAt, replyPageNumber } = i.attributes;
    //         return {
    //             link,
    //             title,
    //             text,
    //             authorName,
    //             authorLink,
    //             createAt,
    //             replyPageNumber,
    //         };
    //     });
    //     downloadSheet(result, "文章基本信息");
    // });
    let query = new AV.Query("comment");
    await query.find().then((res) => {
        let result = res
            .map((i) => {
                let { succ } = i.attributes;
                return succ;
            })
            .flat();
        downloadSheet(result, "文章基本信息");
    });
}
main();
function downloadSheet(afterParse, name, bookType = "xlsx") {
    afterParse.forEach((i) => {
        Object.entries(i).forEach(([key, value]) => {
            if (value instanceof Object) {
                i[key] = JSON.stringify(value);
            }
        });
        // 处理二层数据不能够写入的问题
    });

    let newbook = XLSX.utils.book_new();
    let sheet = XLSX.utils.json_to_sheet(afterParse);

    XLSX.utils.book_append_sheet(newbook, sheet, "爬取结果");
    console.log(newbook);
    XLSX.writeFile(newbook, name + "." + bookType, {
        bookType,
    });
}
