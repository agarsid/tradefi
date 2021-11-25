const request = require("request-promise");
const cheerio = require("cheerio");


const scrapeData = async () => {

    const [a,b,c] = await Promise.all([scrapeXinde(),scrapeGazette(),scrapeMaritime()])
    const responseData = a.concat(b,c)
    return responseData

    
};

const scrapeXinde = async () => {
  const responseData = []
  const res = request(
    "https://www.xindemarinenews.com/en/list_65_1.html",
    (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);

        const baseUrl = "https://www.xindemarinenews.com/";
        const datarow = $(".item-inner");
        // console.log(datarow.length);
        datarow.each((i, data) => {
          const d = {};
          d.headline = $(data).find(".item-title > a").text();
          d.description = $(data).find(".item-text").text();
          d.date = new Date($(data).find(".item-update ").text().substring(0, 11)).toLocaleDateString();
          d.link = baseUrl + $(data).find(".item-title > a").attr("href");
          d.source = "Xinde Marine News";
        //   console.log(d);
        //   console.log(
        //     "---------------------------------------------------------------"
        //   );
          responseData.push(d)
        });
      }
    }
  ).then(()=> responseData);
  return res
}

const scrapeGazette = async () => {
  const responseData = [] 
  const res = request(
    "https://www.shippingazette.com/main.asp?encode=eng",
    (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);

        const baseUrl =
          "https://www.shippingazette.com/news/news_frame.asp?encode=eng&ctry=&bookmark=EN";
        const datarow = $(".news-block");

        let k = 1;
        datarow.each((i, data) => {
          const d = {};
          d.headline = $(data).find(".news-head").text();
          d.description = $(data).find(".news-txt").text();
          if (
            d.headline.toLowerCase().includes("gazette") ||
            d.headline.includes("Insurance & Claims Case Study") ||
            d.description.toLowerCase().includes("gazette")
          ) {
            return;
          }
          d.date = new Date($(data).find(".news-date ").text()).toLocaleDateString();
          d.link = baseUrl + "" + k;
          d.source = "Shipping Gazette";
          k += 1;
        //   console.log(d);
        //   console.log(
        //     "---------------------------------------------------------------"
        //   );
          responseData.push(d)
        });
      }
    }
  ).then(()=> responseData);
  return res
}

const scrapeMaritime = async () => {
  const responseData = []
  const res = request("https://www.seatrade-maritime.com/", (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html);

      const baseUrl = "https://www.seatrade-maritime.com/";
      const datarow = $(".article-eight-links__item a");
    //   console.log(datarow.length);

      datarow.each((i, data) => {
        request(baseUrl + $(data).attr("href"), (error, response, ht) => {
          if (!error && response.statusCode == 200) {
            // console.log($(data).attr('href'))
            const d = {};
            const article = cheerio.load(ht);
            d.headline = article(".big-article__top").find("h1").first().text();
            d.description = article(".article-content")
              .find("p")
              .first()
              .text();
            d.date = new Date(article(".big-article__top")
              .find(".author-and-date")
              .first()
              .text()
              .slice(-12)).toLocaleDateString();
            d.link = baseUrl + $(data).attr("href");
            d.source = "Seatrade Maritime";
            // console.log(d);
            // console.log(
            //   "---------------------------------------------------------------"
            // );
            responseData.push(d)
          }
        });
      });
    }
    
  }
  ).then(()=> responseData);
  return res
}

  // request("https://www.joc.com/news", (error, response, html) => {
  //     if(!error && response.statusCode==200) {
  //         const $= cheerio.load(html);

  //         // console.log($.html())

  //         const baseUrl = 'https://www.joc.com'
  //         const datarow= $("#panel-pane .views-field-title a");
  //         // console.log(datarow.length)
  //         let k = 1;
  //         datarow.each((i, data) => {
  //             console.log(baseUrl + $(data).attr('href'))
  //         });

  //         //     const headline= $(data).find(".news-head").text();
  //         //     const description= $(data).find(".news-txt").text();
  //         //     const date= $(data).find(".news-date ").text();
  //         //     const link= baseUrl + '' + k;
  //         //     k+=1
  //         //     console.log(headline,date,description,link);
  //         //     console.log("---------------------------------------------------------------")
  //         // })
  //     }

  // });
module.exports = scrapeData