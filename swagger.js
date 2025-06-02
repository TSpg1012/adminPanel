const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Edinify API',
    description: 'API documentation'
  },
  host: 'localhost:3000',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];  // əsas entry point və ya router-lar

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./app.js'); // serveri buradan işə salırsan
});

swaggerAutogen(outputFile, endpointsFiles, doc);