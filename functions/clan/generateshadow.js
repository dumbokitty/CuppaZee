var { request, retrieve } = require('../util');
var config = require('../config.json');
var Airtable = require('airtable');

const groupsdata = {
  cuppaclans: {
    base_id: 'app3rWUMkDuHTUIAo',
    admins: ["125914","51311"],
    90: {
      name: "September 2020",
      clans: [
        { clan_id: 1349, clan_name: "coffee" },
        { clan_id: 457, clan_name: "tea" },
        { clan_id: 2042, clan_name: "mocha" },
        { clan_id: 1441, clan_name: "cocoa" },
        { clan_id: 1902, clan_name: "hot choc" },
        { clan_id: 1870, clan_name: "horlicks" },
        { clan_id: -1, clan_name: "shadow", shadow_name: "CuppaClans Shadow Crew" },
      ]
    },
    91: {
      name: "October 2020",
      clans: [
        { clan_id: 1349, clan_name: "coffee" },
        { clan_id: 457, clan_name: "tea" },
        { clan_id: 2042, clan_name: "mocha" },
        { clan_id: 1441, clan_name: "cocoa" },
        { clan_id: 1902, clan_name: "hot choc" },
        { clan_id: 1870, clan_name: "horlicks" },
        { clan_id: -1, clan_name: "shadow", shadow_name: "CuppaClans Shadow Crew" },
      ]
    }
  },
  kcat: {
    base_id: 'appXMRIBV4VeCWprW',
    admins: ["16968","15078","125914"],
    90: {
      name: "September 2020",
      clans: [
        { clan_id: 1064, clan_name: "kcat" },
        { clan_id: 2049, clan_name: "cream on first" },
      ]
    },
    91: {
      name: "October 2020",
      clans: [
        { clan_id: 1064, clan_name: "kcat" },
        { clan_id: 2049, clan_name: "cream on first" },
      ]
    }
  }
}

module.exports = {
  path: "clan/shadow/generate",
  latest: 2,
  versions: [
    // {
    //   version: 1,
    //   params: {},
    //   async function({ db, params: { game_id, clan_id } }) {
    //     var token = await retrieve(db, {user_id:455935,teaken:false},60);
    //     var clandata = data[game_id][clan_id];
    //     var arr = [];
    //     for(var member of clandata) {
    //       arr.push(request('user',{username:member},token.access_token));
    //     }
    //     var userdata = await Promise.all(arr);
    //     var d = (await db.collection(`shadow_${game_id}`).doc((clan_id || "1349").toString()).get()).data();
    //     if(d) {
    //       await db.collection(`shadow_${game_id}`).doc((clan_id || "1349").toString()).update({
    //         _members: userdata.map(i=>({
    //           user_id: Number(i.user_id),
    //           username: i.username
    //         })),
    //         _updated_at: 0
    //       })
    //     } else {
    //       await db.collection(`shadow_${game_id}`).doc((clan_id || "1349").toString()).set({
    //         _members: userdata.map(i=>({
    //           user_id: Number(i.user_id),
    //           username: i.username
    //         })),
    //         _updated_at: 0
    //       })
    //     }
    //     return {
    //       status: "success",
    //       data: true
    //     }
    //   }
    // },
    {
      version: 2,
      params: {},
      async function({ db, params: { game_id, group = "cuppaclans" } }) {
        const clansdata = groupsdata[group];
        var base = new Airtable({apiKey: config.airtable_key}).base(clansdata.base_id);
        var token = await retrieve(db, {user_id:455935,teaken:false},60);
        var all_users = (await base(clansdata[game_id].name).select({
          view: 'Table'
        }).all()).map(i => ({
          ...i.fields
        }));
        for(let {clan_id, clan_name, shadow_name} of clansdata[game_id].clans) {
          var d = (await db.collection(`shadow_${game_id}`).doc((clan_id).toString()).get()).data();
          var users = all_users.filter(i=>(i.Clan||"").toLowerCase().includes(clan_name));
          var user_list = await Promise.all(users.map(async user => {
            if(d && d._members && d._members.find(i=>i.username.toLowerCase()===user.Username.toLowerCase())) {
              return d._members.find(i=>i.username.toLowerCase()===user.Username.toLowerCase());
            }
            let user_data = (await request('user',{username:user.Username},token.access_token));
            return {
              username: user_data.username,
              user_id: Number(user_data.user_id),
            }
          }))
          let final = {
            _members: user_list,
            _updated_at: 0,
            _details: {
              group: group,
              group_admins: clansdata.admins,
            }
          };
          if(shadow_name) final._details.name = shadow_name;
          if(d) {
            await db.collection(`shadow_${game_id}`).doc((clan_id).toString()).update(final)
          } else {
            await db.collection(`shadow_${game_id}`).doc((clan_id).toString()).set(final)
          }
        }
        return {
          status: "success",
          data: all_users
        }
      }
    }
  ]
}