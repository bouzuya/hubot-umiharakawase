# Description
#   A Hubot script that returns 海腹川背 videos
#
# Configuration:
#   HUBOT_UMIHARAKAWASE_API_KEY
#
# Commands:
#   hubot 海腹川背 F<N> - returns 海腹川背 videos
#
# Author:
#   bouzuya <m@bouzuya.net>
#
module.exports = (robot) ->
  request = require 'request-b'

  API_KEY = process.env.HUBOT_UMIHARAKAWASE_API_KEY

  robot.respond /(?:umi|うみ|海)(?:hara|はら|腹|原)(?:kawa|かわ|川)(?:se|せ|背|瀬) (F\d+)$/i, (res) ->
    field = res.match[1]
    keyword = 'さよなら海腹川背 ' + field
    options =
      method: 'GET'
      url: 'https://www.googleapis.com/youtube/v3/search'
      qs:
        part: 'id,snippet'
        q: keyword
        key: API_KEY
    request(options).then (r) ->
      json = JSON.parse r.body
      messages = json.items
        .filter (item) ->
          pattern = new RegExp(field)
          item.snippet.title.match pattern
        .filter (_, i) ->
          i < 3
        .map (item) ->
          """
          #{item.snippet.thumbnails.default.url}
          #{item.snippet.title}
            https://youtu.be/#{item.id.videoId}
          """
        .join '\n'
      res.send messages
