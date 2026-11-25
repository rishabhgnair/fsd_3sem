const http = require('http');

const server = http.createServer((req, res) => {
  const statusCode = 200;
  const headers = {
    'Content-Type': 'text/plain',
    'X-Custom-Header': 'FSD-Workshop',
  };

  res.writeHead(statusCode, headers);
  res.end(
    'Hello World\n\n' +
    `Status Code: ${statusCode}\n` +
    `Headers: ${JSON.stringify(headers, null, 2)}`
  );
});

server.listen(3000, () => console.log('Server running at http://localhost:3000'));