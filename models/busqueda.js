const fs = require('fs');

const axios = require("axios").default;

class Busquedas {

  historial = [];
  dbPath = './db/database.json';
  constructor() {
    // TODO: Leer DB si existe
    this.leerDB();
  }

  get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: "es",
    };
  }

  get paramsOpenweat() {
    return {
      appid: process.env.OPEN_WEAT,
      limit: 5,
      lang: "es",
      units: "metric",
    };
  }

  get historialCapitalizado() {


    return this.historial.map(lugar => {
      let palabras = lugar.split(' ');

      palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1));

      return palabras.join(' ');
    });
   
    
  }

  async ciudad(lugar) {
    try {
      const intance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: this.paramsMapbox,
      });

      const resp = await intance.get();

      return resp.data.features.map((lugar) => ({
        id: lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1],
      }));
    } catch (error) {
      console.log(error);

      return [];
    }
  }

  async climaLugar(lat, lon) {
    try {
      const intance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: { ...this.paramsOpenweat, lat, lon },
      });

      const resp = await intance.get();

      const { weather, main } = resp.data;

      return {
        desc: weather[0].description,
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp,
      };
    } catch (error) {
      console.log(error);
    }
  }

  agregarHistorial(lugar = "") {
    //TODO: prevenir dupicado

    if(this.historial.includes(lugar.toLocaleLowerCase())){
        return;
    }

    this.historial.unshift(lugar.toLocaleLowerCase());

    //grabar en DB
    this.guardarBD();
  }

  guardarBD(){

    const payload = {
        historial: this.historial
    }

    fs.writeFileSync(this.dbPath, JSON.stringify(payload));

  }

  leerDB(){
    if(!fs.existsSync(this.dbPath)) return;

      const info = fs.readFileSync(this.dbPath, { encoding:'utf-8' });
      const data = JSON.parse(info);

      this.historial= data.historial;

  }
}

module.exports = Busquedas;
