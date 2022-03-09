
 require('dotenv').config();
 
 const { leerInput,inquirerMenu,pausa, listarLugares} = require('./helpers/inquirer');
 const Busquedas = require('./models/busqueda');


const main= async ()=>{


    let opt = "";

    const busquedas = new Busquedas();

    do {
                 //imprime el menu
     opt = await inquirerMenu();
     
     switch (opt) {
  
       case 1:
           //mostrar mensaje
         const termino = await leerInput('Ciudad:');
         
           //buscar lugaes
         const lugares = await busquedas.ciudad(termino);
       
         //seleccionar el lugar de la busqueda
        const id_lugar = await listarLugares(lugares);
        const lugarSelect = lugares.find(l => l.id === id_lugar);

        console.log("Ciudad",lugarSelect.nombre );
           //console.log("Lat:", lugarSelect.lng);
           //console.log("Lng:",lugarSelect.lat);


           // mostra clima
          const clima = await busquedas.climaLugar(lugarSelect.lat,lugarSelect.lng);


         console.log("\n informacion de la ciudad\n".green);
   
           console.log("Temperatura", clima.temp);
           console.log("Minima", clima.min);
           console.log("Maxima",clima.max );
           console.log('Como está el clima:',  clima.desc.green );

  
       case 2:
     
        break;
  
       case 0:
        
          break;
     }

  
     
  

  
      if(opt !== 0) await pausa();
  
    } while (opt !== 0);
  
 
  

}
main();