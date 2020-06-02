var { request, retrieve } = require('../util');

var data = {
  87: {
    1349: [
      "purplecourgette",
      "maxi72",
      "sidcup",
      "cambridgehannons",
      "benandlou",
      "vike91"
    ],
    457: [
      "thegenie18",
      "moppett85",
      "boompa",
      "babydane",
      "writeandmane",
      "stacybuckwyk"
    ],
    2042: [
      "sohcah",
      "gunnersteve",
      "iallyanne",
      "tecmjrb",
      "tzaruba",
      "franca"
    ],
    1441: [
      "chameleon42",
      "chipperlarter",
      "ajb777",
      "pelicanrouge",
      "armchair",
      "godzilla73",
      "lolbot"
    ],
    1902: [
      "mankybadger",
      "j20",
      "ujio",
      "mlec",
      "iicydiamonds",
      "tia67uk"
    ],
    1870: [
      "shellie1210",
      "founditwherenext",
      "fiwn",
      "chuckysback",
      "boomgal8",
      "bingbonglong",
      "beanieflump"
    ],
    "-1": [
      "mary",
      "unicornpink",
      "reart",
      "maattmoo",
      "barrowman1",
      "amyjoy",
      "shaunem",
      "terryd",
      "chefmummyyummy",
      "oldun",
      "oldlass",
      "signal77"
    ]
  }
}

module.exports = {
  path: "clan/shadow/generate",
  latest: 1,
  versions: [
    {
      version: 1,
      params: {},
      async function({ db, params: { game_id, clan_id } }) {
        var token = await retrieve(db, {user_id:455935,teaken:false},60);
        var clandata = data[game_id][clan_id];
        var arr = [];
        for(var member of clandata) {
          arr.push(request('user',{username:member},token.access_token));
        }
        var userdata = await Promise.all(arr);
        var d = (await db.collection(`shadow_${game_id}`).doc((clan_id || "1349").toString()).get()).data();
        if(d) {
          await db.collection(`shadow_${game_id}`).doc((clan_id || "1349").toString()).update({
            _members: userdata.map(i=>({
              user_id: Number(i.user_id),
              username: i.username
            })),
            _updated_at: 0
          })
        } else {
          await db.collection(`shadow_${game_id}`).doc((clan_id || "1349").toString()).set({
            _members: userdata.map(i=>({
              user_id: Number(i.user_id),
              username: i.username
            })),
            _updated_at: 0
          })
        }
        return {
          status: "success",
          data: true
        }
      }
    }
  ]
}