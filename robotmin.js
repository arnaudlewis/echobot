function execute(){console.log("execute");var e={url:"http://pitchs-start.lesechos.fr/galerie"};request(e,function(e,t,o){function s(e,t){return e-t}if(!e&&200==t.statusCode){domTree=cheerio.load(o),votesStr=domTree(".pitch-votes"),allVotes=[];for(var r=0;r<votesStr.length;r++)allVotes.push(parseInt(domTree(votesStr[r]).text().split(" ")));var a=parseInt(domTree(domTree('.pitch-title:contains("Dream act")')[0]).next().text().split(" ")[0]),n=[];allVotes=allVotes.sort(s).map(function(e,t){t%2==0&&e!=a&&n.push(e)});for(var c=1;POSITION>c;c++){var i=Math.max.apply(null,n);n.splice(n.indexOf(i),1)}var l=n.reduce(function(e,t){return e>t?e:t})-a+SPACE_BETWEEN+UP_VOTES;if(console.log(l),0>l&&(l=0),l>0){async.times(MAX_CONCURRENCY,function(){generateVote(Math.floor(l/MAX_CONCURRENCY))},function(e){console.log(e)});var p=l%MAX_CONCURRENCY;generateVote(p)}else console.log("no need to update votes")}})}function generateVote(e){e>0&&http.get("http://pitchs-start.lesechos.fr/movies/82",function(t){if(console.log(t.headers["set-cookie"]),console.log(t.statusCode),200==t.statusCode){var o=t.headers["set-cookie"][0].split(";")[0].split("=")[1];request({headers:{GET:"/vote/82 HTTP/1.1",Host:"pitchs-start.lesechos.fr",Connection:"keep-alive",Pragma:"no-cache","Cache-Control":"no-cache",Accept:"/*;q=0.5, text/javascript, application/javascript, application/ecmascript, application/x-ecmascript","X-CSRF-Token":"NrfRfRxyZYuZ00z/REVNoBoRQVfg5CIShMsGPbkSnaIswQFBuUUua/fyYQShCiXneAURoh9Dz0yo+jRG2dxzhA==","User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36","X-Requested-With":"XMLHttpRequest",Referer:"http://pitchs-start.lesechos.fr/movies/82","Accept-Encoding":"gzip, deflate, sdch","Accept-Language":"fr-FR,fr;q=0.8,en-US;q=0.6,en;q=0.4",Cookie:"xtvrn=$561591$; _session_id="+o+"; xtan561591=-; xtant561591=1"},uri:"http://pitchs-start.lesechos.fr/vote/82",method:"GET"},function(){generateVote(e-1)})}else generateVote(e)})}var http=require("http"),request=require("request"),cheerio=require("cheerio"),async=require("async"),MAX_CONCURRENCY=25,POSITION=1,TIME=90,UP_VOTES=100,SPACE_BETWEEN=5e3;execute(),setInterval(function(){execute()},6e4*TIME);