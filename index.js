const timetables = require('./timetablesOut.json');


/*

This script takes the list of routes & stops from timetablesOut.json
it looks all the stops up on the RTPI and adds their coordinates
then saves them in what (not a good name!).json

*/
//const timetables = require('./timetablesOut.json');
const axios = require('axios');
const fs = require('fs')


function lookUpStop(stopid) {
  return new Promise((resolve,reject) => {
    //let routeUrl = `https://rtpiapp.rtpi.openskydata.com/RTPIPublicService_v2/service.svc/routeinformation?routeid=${routeid}&operator=be&format=json`
    let stopUrl = `https://rtpiapp.rtpi.openskydata.com/RTPIPublicService_v2/service.svc/busstopinformation?stopid=${stopid}`
    axios.get(stopUrl)
    .then(response=>{
      console.log("something")
      resolve(response.data.results)
    })
    .catch(e=>reject("getRouteError stop not found ", e, stopid, stopUrl))
  });
}


async function f(){
  return await Promise.all(timetables.map(async (route) => {
     await Promise.all(route.stops.map(async (stop) =>{
      try {
        let m = await lookUpStop(stop.bestopid)

                stop.latitude= m[0].latitude;
                stop.longitude=m[0].longitude;
               return stop;

  
        
        } catch(err) {
           console.log("e ", err);
        }
        
    }))
   return route;
  }))

}

async function a(){
  let data = await f();
  console.log("data", data.length)
  let json = JSON.stringify(data, null, 1); 
    fs.writeFile('wtf.json', json, 'utf8', (err,d)=>{
      if(err) console.log("error writing ", err)
      console.log("written")
    
    });
}
a()


  