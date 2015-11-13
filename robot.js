var http = require('http');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');

var MAX_CONCURRENCY = 25;
var POSITION = 1;
var TIME = 180; //in minutes
var UP_VOTES = 100;
var SPACE_BETWEEN = 5000;

function execute() {

  console.log("execute")

  var options = {
    url: 'http://pitchs-start.lesechos.fr/galerie',
  };
  request(options, function (error, response, html) {
    if (!error && response.statusCode == 200) {

      domTree = cheerio.load(html)
      votesStr = domTree('.pitch-votes')
      
      allVotes = []
      for(var i = 0; i < votesStr.length; i ++){
        allVotes.push(parseInt(domTree(votesStr[i]).text().split(' ')))
      }
      var myVotes = parseInt(domTree(domTree('.pitch-title:contains("Dream act")')[0]).next().text().split(' ')[0])
      
      function sortNumber(a,b) {
        return a - b;
      }

      var cleanedAllVotes = [];
      allVotes = allVotes.sort(sortNumber).map(function(elem, index) {
        if(index%2 == 0 && elem != myVotes) cleanedAllVotes.push(elem);
      })



      for(var max = 1; max < POSITION; max++) {
        var maxElem = Math.max.apply(null, cleanedAllVotes);
        cleanedAllVotes.splice(cleanedAllVotes.indexOf(maxElem), 1);
      }

      var neededVotes = cleanedAllVotes.reduce(function(acc, elem) {
        return acc > elem ? acc : elem
      }) - myVotes + SPACE_BETWEEN + UP_VOTES
      
      console.log(neededVotes)

      if(neededVotes < 0) neededVotes = 0

      if(neededVotes > 0) {
        
        async.times(MAX_CONCURRENCY, function(n, next){
          generateVote(Math.floor(neededVotes/MAX_CONCURRENCY))
        }, function(err) {
          console.log(err)
        });

        var moduloVotes = neededVotes % MAX_CONCURRENCY;
        generateVote(moduloVotes);
      } else console.log("no need to update votes")
    }
  });
}

function generateVote(neededVotes) {
    if(neededVotes > 0) {
      http.get('http://pitchs-start.lesechos.fr/movies/82', function(res) {

        console.log(res.headers['set-cookie'])
        console.log(res.statusCode)
          if(res.statusCode == 200) {
            var sessionIdVal = res.headers['set-cookie'][0].split(';')[0].split('=')[1];
            request({
              headers: {
                'GET': '/vote/82 HTTP/1.1',
                'Host': 'pitchs-start.lesechos.fr',
                'Connection': 'keep-alive',
                'Pragma': 'no-cache',
                'Cache-Control': 'no-cache',
                'Accept':'/*;q=0.5, text/javascript, application/javascript, application/ecmascript, application/x-ecmascript',
                'X-CSRF-Token': 'NrfRfRxyZYuZ00z/REVNoBoRQVfg5CIShMsGPbkSnaIswQFBuUUua/fyYQShCiXneAURoh9Dz0yo+jRG2dxzhA==',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36',
                'X-Requested-With': 'XMLHttpRequest',
                'Referer': 'http://pitchs-start.lesechos.fr/movies/82',
                'Accept-Encoding': 'gzip, deflate, sdch',
                'Accept-Language': 'fr-FR,fr;q=0.8,en-US;q=0.6,en;q=0.4',
                'Cookie': 'xtvrn=$561591$; _session_id=' + sessionIdVal + '; xtan561591=-; xtant561591=1'
              },
              uri: 'http://pitchs-start.lesechos.fr/vote/82',
              method: 'GET'
            }, function (err, res, body) {
              generateVote(neededVotes - 1)
            });
          } else generateVote(neededVotes)
      });
    }
}

execute();
setInterval(function(){ execute(); }, 60000 * TIME); //time in millisecond => 30 minutes here
