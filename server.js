require('./Scripts/Utilities.js')();
const express = require('express');
const app = express();
app.use(express.json())
const data = new Map();

app.get('/', (req, res) => {
  let output = "<h1>Receipt Processor:</h1>";
  output += "<div>Commands: </div><ul>";
  output += `<li><a href="/receipts">/receipts - gets the list of processed receipts</a></li>`;
  output += `<li>/receipts/{ID}/points - gets the point values for a specific receipt</li>`;
  output += "</ul>";
  res.send(output);
});

//catch bad json
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      return res.status(400).json({ 'description': 'The receipt is invalid' });
  }
  next();
});

app.post('/receipts/process', (req, res) => {
    // generate receipt key based on hash of request body
    try {
      const hash = hashString(JSON.stringify(req.body));
      // if not a duplicate, calculate and store points
      if (!data.has(hash))
      {
        const points = calculatePoints(req.body);
        data.set(hash,points);
      }
      res.status(200).json({"id":hash});
    } catch (error){
      return res.status(400).json({ 'description': 'The receipt is invalid' });
    }
  });

app.get('/receipts', (req, res) => {
    let output = "<div><ul>";
    for (const key of data.keys())
    {
        output += `<li><a href="/receipts/${key}/points">${key}</a></li>`;
    };
    output += "</ul></div>";
    res.send(`Full receipt list here: ${output}`);
  });

app.get('/receipts/:id/points', (req, res) => {
  if (data.has(req.params.id.toString())){
    res.status(200).json({"points": data.get(req.params.id.toString())});
  }else{
    res.sendStatus(404).send({"description":"No receipt found for that id"});
  }
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });