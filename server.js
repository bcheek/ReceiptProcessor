require('./Scripts/Utilities.js')();
const express = require('express');
const app = express();
app.use(express.json())
const data=new Map();

app.get('/', (req, res) => {
  var output="<h1>Receipt Processor:</h1>"
  output+="<div>Commands: </div><ul>"
  output+=`<li><a href="/receipts">/receipts - gets the list of processed receipts</a></li>`
  output+=`<li>/receipts/{ID}/points - gets the point values for a specific receipt</li>`
  output+="</ul>"

  res.send(output)
});

app.post('/receipts/process', (req, res) => {
  //TODO validate input is valid json

    // generate receipt key based on hash of request body
    var hash=hashString(JSON.stringify(req.body))
    // if not a duplicate, calculate and store points
    if (!data.has(hash))
    {
      var points=calculatePoints(req.body);
      data.set(""+hash,""+points)
    }
    res.send(`{ "id:" "${hash}" }`)
  });

app.get('/receipts', (req, res) => {
    var output="<div><ul>"
    for (const key of data.keys())
    {
        output+=`<li><a href="/receipts/${key}/points">${key}</a></li>`;
    };
    output+=`<li><a href="/receipts/invalid/points">"invalid id"</a></li>`;
    output+="</ul></div>"
    res.send(`Full receipt list here: ${output}`);
  });

app.get('/receipts/:id/points', (req, res) => {
  if (data.has(""+req.params.id)){
    res.send(` {"points": "${data.get(""+req.params.id)}" }`);
  }else{
    res.send(` {"points": "0" }`);
  }
    
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });