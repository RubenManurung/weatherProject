require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const ejs = require("ejs");
const app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function(req, res){
  res.sendFile(__dirname+"/index.html")

});


app.post("/", function(req, res){
  const cityName = req.body.cityName;
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&appid="+process.env.API_KEY+"&lang=id&units=metric";

  https.get(url, function(response){
    console.log("Status code : "+response.statusCode);
    if(response.statusCode == 200){
      response.on("data", function(data){
        const weatherApp = JSON.parse(data);
        console.log(weatherApp);
        const temp = weatherApp.main.temp;
        const weatherDesc = weatherApp.weather[0].description;
        const iconCode = weatherApp.weather[0].icon;
        const imgIcon = "http://openweathermap.org/img/wn/"+iconCode+"@2x.png";

        res.render("weather", {
          cityName: cityName,
          temp: temp,
          weatherDesc: weatherDesc,
          imgIcon: imgIcon
        });
    });
    }else{
      res.render("error");
    }
      
  });
});


//belum implementasi jika nama kota salah dari client side





app.listen(3000, ()=>{
  console.log("Server is running in port 3000");
});
