import http from 'http';

const options = {
  hostname: '127.0.0.1',
  port: 4322,
  path: '/keystatic',
  method: 'GET',
};

const req = http.request(options, (res) => {
  console.log('STATUS:', res.statusCode);
  console.log('HEADERS:', res.headers);
  let body = '';
  res.on('data', (chunk) => (body += chunk.toString()));
  res.on('end', () => {
    console.log('BODY LENGTH:', body.length);
    console.log(body.slice(0, 400));
  });
});

req.on('error', (e) => {
  console.error('REQUEST ERROR', e);
});
req.end();
