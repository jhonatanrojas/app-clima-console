const axios = require('axios').default;



class Busquedas {

    historial = [];

    constructor() {
        // TODO: Leer DB si existe

    }

    get paramsMapbox() {

        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'

        }
    }

     paramsOpenweat(lat, long) {

        return {
            'appid': process.env.OPEN_WEAT,
            'limit': 5,
            'lang': 'es',
            'lat': lat,
            'long': long

        }
    }

    async ciudad(lugar) {
        try {

            const intance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });

            const resp = await intance.get();


            return resp.data.features.map(lugar => ({

                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]

            }))


        } catch (error) {
            console.log(error)

            return []

        }

    }


    async climaLugar(lat, long) {
        try {

            const intance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {
                    'appid': process.env.OPEN_WEAT,
                    'limit': 5,
                    'lang': 'es',
                    units: 'metric',
                    'lat': lat,
                    'lon': long
        
                }
            });

            const resp = await intance.get();


            const { weather,main} = resp.data;


          
             return {

                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp

            }

        } catch (error) {
            console.log(error)

        }

    }
}

module.exports = Busquedas