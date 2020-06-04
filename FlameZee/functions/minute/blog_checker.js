var rss = require('rss-parser');
var parser = new rss();
var fetch = require("node-fetch");
var { URLSearchParams } = require("url");
var cheerio = require('cheerio');
var config = require('../config.json');
module.exports = {
  path: "minute/blogchecker",
  latest: 1,
  versions: [
    {
      version: 1,
      params: {},
      async function({ db }) {
        var data = (await db.collection('data').doc('blog').get()).data();
        if (!data.run) return;
        var update = {};
        async function check(x) {
          // Munzee
          var feed = await parser.parseURL('https://www.munzeeblog.com/feed/')
          if (feed.items[0].link !== data.munzee_blog) {
            data.munzee_blog = feed.items[0].link;
            update.munzee_blog = feed.items[0].link;

            console.log('New Munzee Blog', feed.items[0].link);
            let img = cheerio.load(feed.items[0]["content:encoded"] || '')('img')[0];
            fetch(config.discord.blog,{
              method: 'POST',
              body: new URLSearchParams({
                "payload_json": JSON.stringify({
                  embeds: [
                    {
                      title: feed.items[0].title,
                      url: feed.items[0].link + '#content',
                      description: feed.items[0].contentSnippet + `\n[Read More](<${feed.items[0].link}#content>)`,
                      image: img ? {
                        url: img ? img.attribs.src : ''
                      } : null
                    }
                  ],
                  content: feed.items[0].title
                })
              })
            })
          } else {
            console.log('Same Munzee Blog', feed.items[0].link);
          }

          if (x && Object.keys(update).length > 0) {
            await db.collection('data').doc('blog').update(update);
          }
        }
        check();
        await Promise.all([
          new Promise((resolve, reject) => {
            setTimeout(async function () {
              await check();
              resolve("Success!")
            }, 15000)
          }),
          new Promise((resolve, reject) => {
            setTimeout(async function () {
              await check();
              resolve("Success!")
            }, 30000)
          }),
          new Promise((resolve, reject) => {
            setTimeout(async function () {
              await check(true);
              resolve("Success!")
            }, 45000)
          })
        ])
        return {
          status: "success",
          data: update
        }
      }
    }
  ]
}