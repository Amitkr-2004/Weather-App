const http = require("http");
const fs = require("fs");
var requests = require('requests');

const homefile = fs.readFileSync("index.html", "utf-8");

const replaceVal = (tempVal,orgVal) =>{
    let temperature=tempVal.replace("{%tempval%}",orgVal.main.temp);
     temperature=temperature.replace("{%tempmin%}",orgVal.main.temp_min);
     temperature=temperature.replace("{%tempmax%}",orgVal.main.temp_max);
     temperature=temperature.replace("{%location%}",orgVal.name);
     temperature=temperature.replace("{%country%}",orgVal.sys.country);
     temperature=temperature.replace("{%tempstatus%}",orgVal.weather[0].main);
    return temperature;
}
const server = http.createServer((req, res) => {
    if(req.url=="/"){
    requests("http://api.openweathermap.org/data/2.5/weather?q=West%20Bengal&units=metric&appid=ba5947824121d34696bb0149878c08c9")
        .on('data', (chunk) =>{
            let objData = JSON.parse(chunk);
            let arrData=[objData];
            let realTimeData=arrData.map((val)=>
                replaceVal(homefile,val)).join("") 
                res.write(realTimeData);
        })
        .on('end', (err) =>{
            if (err) return console.log('connection closed due to errors', err);
            res.end();
        });
    }
})

server.listen(8000,"127.0.0.1");