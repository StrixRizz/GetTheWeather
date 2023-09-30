import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
let url = "";

const cityCoordinates = {
  london: {
    longitude: "51.5072",
    latitude: "0.1276",
  },
  paris: {
    longitude: "48.8566",
    latitude: "2.3522",
  },
  berlin: {
    longitude: "52.5200",
    latitude: "13.4050",
  },
};

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/get-weather", async (req, res) => {
  console.log(req.body);

  if (req.body.city === "other") {
    url = `https://api.open-meteo.com/v1/forecast?latitude=${parseFloat(
      req.body.longitude
    )}&longitude=${parseFloat(req.body.latitude)}&current_weather=true`;
  } else {
    url = `https://api.open-meteo.com/v1/forecast?latitude=${parseFloat(
      cityCoordinates[req.body.city].longitude
    )}&longitude=${parseFloat(
      cityCoordinates[req.body.city].latitude
    )}&current_weather=true`;
  }

  try {
    const result = await axios.get(url);

    res.locals = {
      temperature: result.data.current_weather.temperature,
      windspeed: result.data.current_weather.windspeed,
    };
  } catch (error) {
    res.locals = {
      error: error.response.data.reason,
    };
  }

  res.render("index.ejs");
});

app.listen(port, () => {});
