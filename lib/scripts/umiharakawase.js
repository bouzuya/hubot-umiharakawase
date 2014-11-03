// Description
//   A Hubot script that returns 海腹川背 videos
//
// Configuration:
//   HUBOT_UMIHARAKAWASE_API_KEY
//
// Commands:
//   hubot 海腹川背 F<N> - returns 海腹川背 videos
//
// Author:
//   bouzuya <m@bouzuya.net>
//
module.exports = function(robot) {
  var API_KEY, request;
  request = require('request-b');
  API_KEY = process.env.HUBOT_UMIHARAKAWASE_API_KEY;
  return robot.respond(/(?:umi|うみ|海)(?:hara|はら|腹|原)(?:kawa|かわ|川)(?:se|せ|背|瀬) (F\d+)$/i, function(res) {
    var field, keyword, options;
    field = res.match[1];
    keyword = 'さよなら海腹川背 ' + field;
    options = {
      method: 'GET',
      url: 'https://www.googleapis.com/youtube/v3/search',
      qs: {
        part: 'id,snippet',
        q: keyword,
        key: API_KEY
      }
    };
    return request(options).then(function(r) {
      var json, messages;
      json = JSON.parse(r.body);
      messages = json.items.filter(function(item) {
        var pattern;
        pattern = new RegExp(field);
        return item.snippet.title.match(pattern);
      }).filter(function(_, i) {
        return i < 3;
      }).map(function(item) {
        return "" + item.snippet.thumbnails["default"].url + "\n" + item.snippet.title + "\n  https://youtu.be/" + item.id.videoId;
      }).join('\n');
      return res.send(messages);
    });
  });
};
