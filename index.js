const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const axios = require("axios");

const app = express();

app.get("/api/hello", async (req, res) => {
  const { visitor_name } = req.query;
  const visitorName = visitor_name || "User";
  const userIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  // const ip = userIp && "8.8.8.8";

  try {
    const ipInfo = await axios.get(
      `https://ipinfo.io/${userIp}?token=${process.env.IP_TOKEN}`
    );

    const weatherInfo = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${ipInfo.data.city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );

    res.status(200).json({
      client_ip: ipInfo.ip,
      location: ipInfo.city,
      greeting: `Hello, ${visitorName}, the temperature is ${weatherInfo.data.main.temp} degress celcius in ${ipInfo.data.city}`,
    });
  } catch (err) {
    console.log("IP ERROR", err);
    res.status(403).json({
      status: "fail",
      message: "Error occurs",
    });
  }

  //   const weather = await axios.get("url");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
