var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: '140.123.4.74:9200',
  log: 'trace'
});


client.ping({
  // ping usually has a 3000ms timeout
  requestTimeout: 1000
}, function (error) {
  if (error) {
    console.trace('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});

client.search({
  index: 'news',
  type: 'fulltext',
  body: {
    query: {
      match: {
        content: '陳水扁'
      }
    },
    highlight : {
        fields : {
            content : {}
        }
    }
  }
  }).then(function (resp) {
    var hits = resp.hits.hits;
    //console.log(hits);
    console.log(resp);
  }, function (err) {
    console.trace(err.message);
});

var hyphen = "-";
console.log(hyphen.repeat(10000));
