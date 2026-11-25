const http = require('http');

let items = [{ id: 1, name: 'Pen' }];
let nextId = 2;

const send = (res, code, data) => {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

const getBody = (req) =>
  new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch (e) { reject(e); }
    });
  });

const server = http.createServer(async (req, res) => {
  const [, base, idStr] = req.url.split('/'); // "/items/1"
  const id = Number(idStr);

  if (base !== 'items') return send(res, 404, { error: 'Not found' });

  try {
    // GET all / GET one
    if (req.method === 'GET') {
      if (!idStr) return send(res, 200, items);
      const item = items.find((i) => i.id === id);
      return item ? send(res, 200, item) : send(res, 404, { error: 'Not found' });
    }

    // POST create
    if (req.method === 'POST') {
      const body = await getBody(req);
      const item = { id: nextId++, name: body.name };
      items.push(item);
      return send(res, 201, item);
    }

    // PUT update
    if (req.method === 'PUT') {
      const body = await getBody(req);
      const item = items.find((i) => i.id === id);
      if (!item) return send(res, 404, { error: 'Not found' });
      item.name = body.name;
      return send(res, 200, item);
    }

    // DELETE
    if (req.method === 'DELETE') {
      const before = items.length;
      items = items.filter((i) => i.id !== id);
      return items.length < before
        ? send(res, 200, { message: 'Deleted' })
        : send(res, 404, { error: 'Not found' });
    }

    send(res, 405, { error: 'Method not allowed' });
  } catch {
    send(res, 400, { error: 'Invalid JSON' });
  }
});

server.listen(3000, () => console.log('http://localhost:3000/items'));