var http    = require('http');
var spawn   = require('child_process').spawn;
var crypto  = require('crypto');
var argv = require('minimist')(process.argv.slice(2));

var secret  = argv['s'] ? argv['s'] : 'amazingkey'; // secret key of the webhook
var port    = Number(argv['p']); // port
var hookfile = argv['h'];

http.createServer(function(req, res){
    
    console.log("request received");
    res.writeHead(400, {"Content-Type": "application/json"});

    if(req.headers['x-github-event'] != 'push' || req.method != 'POST'){
       var data = JSON.stringify({"error": "invalid request"});
       console.log(req.method, req.headers)
       return res.end(data); 
    }


    var jsonString = '';
    req.on('data', function(data){
        jsonString += data;
    });

    req.on('end', function(){
      var hash = "sha1=" + crypto.createHmac('sha1', secret).update(jsonString).digest('hex');
      if(hash != req.headers['x-hub-signature']){
          console.log('invalid key');
          var data = JSON.stringify({"error": "invalid key", key: hash});
          return res.end(data);
      } 
       
      console.log("running hook.sh");
   
      var deploySh = spawn('sh', [hookfile]);
      deploySh.stdout.on('data', function(data){
          var buff = new Buffer(data);
          console.log(buff.toString('utf-8'));
      });

      
    res.writeHead(200, {"Content-Type": "application/json"});
    
    var data = JSON.stringify({"success": true});
      return res.end(data);
 
    });

    
}).listen(port);

console.log("Server listening at " + port, "Hookfile " + hookfile);
