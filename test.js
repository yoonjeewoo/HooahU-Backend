const mysql = require('mysql');
const config = require('./config');
const conn = mysql.createConnection(config);
const obj = require('./ec.json');

let editorChoice = obj.editorChoice;
// console.log(editorChoice[0]);
editorChoice.forEach(element => {
  // let concept = element.concept.calm + "/" + element.concept.sightSeeing + "/" + element.concept.dandy + "/" + element.concept.food + "/" + element.concept.activity + "/" + element.concept.luxury + "/" + element.concept.love + "/" + element.concept.party
  // conn.query(
  //   "INSERT INTO PackageTrip VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)",
  //   [element.id, element.name, element.price, element.days, element.rating, element.area, element.distance, element.description, concept],
  //   (err, result) => {
  //     if(err) throw err;
  //     console.log(result)
  //   }
  // )
  element.places.forEach(place => {
    // console.log(url)
    // conn.query(
    //   "INSERT INTO PackageImage(picurl, trip_id) VALUES(?, ?)",
    //   [url, element.id],
    //   (err, result) => {
    //     if (err) throw err;
    //     console.log(result);
    //   }
    // )
    if(place.id == 1) {
      console.log(place);
    }
  })
  // console.log(element.id);
  // console.log(element.name);
  // console.log(element.place);
  // console.log(element.price);
  // console.log(element.days);
  // console.log(element.rating);
  // console.log(element.area);
  // console.log(element.distance);
  // console.log(element.description);
  // let concept = element.concept.calm + "/"+ element.concept.sightSeeing + "/"+ element.concept.dandy + "/"+ element.concept.food + "/"+ element.concept.activity + "/"+ element.concept.luxury + "/"+ element.concept.love + "/"+ element.concept.party
  // console.log(concept);
});