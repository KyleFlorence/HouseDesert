require("dotenv").config();
const fetch = require('node-fetch');

// Route 1: GET /address/:address/*
const address = async function (req, res) {

  const urlArray = req.url.split("/").slice(3)
  // console.log(urlArray)
  const origin = req.params.address;

  // get the geocoded info for this passed address
  fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${origin}&key=${process.env.API_KEY}`)
    .then(res => res.json())
    .then(async resJson => {
      if (resJson.results.length === 0) {
        res.json({})
      } else {
        const lat = resJson.results[0].geometry.location.lat
        const lng = resJson.results[0].geometry.location.lng
        const storeLocationInfo = await Promise.all(urlArray.map(store => fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat + ',' + lng}&keyword=${store}&rankby=distance&key=${process.env.API_KEY}`)
          .then(res => res.json())
          .then(resJson => {
            if (resJson.results.length === 0) {
              return ({ 'location': null, 'name': store, 'place_id': null })
            }
            else {
              return ({ 'location': resJson.results[0].geometry.location, 'name': resJson.results[0].name, 'place_id': resJson.results[0].place_id})
            }
          })
        ))
        let storeLocationAndTime = await Promise.all(storeLocationInfo.map(s => {
          if (s.location === null) {
            return ({ 'name': s.name.replace(/%20/, ' '), 'time': 'None Found!', 'place_id': null, 'lat': null, 'lng': null })
          }
          else {
            return fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${lat + ',' + lng}&destination=${s.location.lat + ',' + s.location.lng}&key=${process.env.API_KEY}`)
              .then(res => res.json())
              .then(resJson =>
                ({ 'name': s.name, 'time': resJson.routes[0].legs[0].duration.text, 'place_id': s.place_id, 'lat': s.location.lat,'lng': s.location.lng})
              )
          }
        }))
        storeLocationAndTime = [{'name': origin, 'lat': lat, 'lng': lng}, ...storeLocationAndTime]
        res.json(storeLocationAndTime)
      }
    })
}



module.exports = {
  address,
}
