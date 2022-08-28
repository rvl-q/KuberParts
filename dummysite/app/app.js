const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

let served_content = "Dummy site default response, website_url not yet utilized.\nOr error in fetching!\n";
let url =  process.env.URL || 'https://example.com';

app.get("/", (req, res) => {
  res.send(served_content);
});

const _foo = fetch( url )
  .then((response) => response.text())
  .then((body) => {
      console.log(body)
      served_content = body
      return body
  })
  .catch(function (err) {
    console.log("Unable to fetch -", err);
  })
 
console.log('almost there...');

app.listen(PORT, () => {
  console.log("Application started and Listening on port", PORT);
});
