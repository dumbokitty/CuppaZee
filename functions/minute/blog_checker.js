var rss = require('rss-parser');
var parser = new rss();
var fetch = require("node-fetch");
var { URLSearchParams } = require("url");
var cheerio = require('cheerio');
var config = require('../config.json');
var notification = require('../util/notification');
var sendEmail = require('../util/nodemailer');

async function sendNotifications({ link, title }, db) {
  var tokens = (await db.collection('push').where('munzee_blog','==',true).get()).docs;
  await notification(db, tokens.map(i=>({
    to: i.data().token,
    sound: 'default',
    title: 'Munzee Blog Post',
    body: title,
    data: {
      type: 'blog',
      link: link
    },
  })))
}

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
          if (feed.items[0].guid !== data.munzee_blog) {
            data.munzee_blog = feed.items[0].guid;
            update.munzee_blog = feed.items[0].guid;

            console.log('New Munzee Blog', feed.items[0].guid);
            let img = cheerio.load(feed.items[0]["content:encoded"] || '')('img')[0];
            if(!data.dev) sendNotifications(feed.items[0], db);
            if(!feed.items[0].title.match(/clan/i) || !feed.items[0].title.match(/requirement/i)) {
              for(var email of config.emails.munzeeblog) {
                sendEmail({
                  to: email,
                  subject: feed.items[0].title,
                  text: feed.items[0].link + '#content'
                })
              }
            }
            fetch(config.discord.blog, {
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
            console.log('Same Munzee Blog', feed.items[0].guid);
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