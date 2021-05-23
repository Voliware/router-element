const Path = require('path');
const Fastify = require('fastify')();
const FastifyStatic = require('fastify-static');
const Open = require('open');

Fastify.register(FastifyStatic, {
    root: __dirname
});

// Redirect any 404s to index.html
Fastify.setNotFoundHandler(
    {
        preValidation: (request, response, done) => {
            done()
        },
        preHandler: (request, response, done) => {
            done()
        }
    }, 
    (request, response) => {
        response.sendFile('/test/index.html');
    }
);

console.log('Running test server on http://localhost:3111/test/index.html');
Fastify.listen(3111, 'localhost');
Open('http://localhost:3111/test/index.html');