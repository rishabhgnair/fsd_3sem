const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

function servePage(file) {
  return (req, res) => {
    const filePath = path.join(__dirname, 'views', file);
    fs.readFile(filePath, 'utf8', (err, html) => {
      if (err) return res.status(500).send('Server error');
      res.status(200).type('html').send(html);
    });
  };
}

app.get('/', servePage('index.html'));
app.get('/about', servePage('about.html'));
app.get('/contact', servePage('contact.html'));

// 404 handler (sabse last mein rakho)
app.use((req, res) => res.status(404).send('<h1>404 - Page Not Found</h1>'));

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));