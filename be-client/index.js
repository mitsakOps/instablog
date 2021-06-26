// express application adding the parse-server module to expose Parse

const express = require('express');
const path = require('path');
const args = process.argv || [];
const test = args.some(arg => arg.includes('jasmine'));
const cors = require('cors');
require('dotenv').config();

const port = process.env.SERVER_PORT;
const ParseServer = require('parse-server').ParseServer;
var ParseDashboard = require('parse-dashboard');
const { nextTick } = require('process');

var app = express();
app.use(cors());

// TODO: Add fallback
// const databaseUri = process.env.DB_URI || process.env.MONGODB_URI;
const databaseUri = process.env.DB_URI;

try {
  var api = new ParseServer({
    databaseURI: databaseUri,
    appId: process.env.APP_ID,
    masterKey: process.env.MASTER_KEY,
    fileKey: process.env.FILE_KEY,
    serverURL: process.env.SERVER_URL,
  });

  var dashboard = new ParseDashboard({
    apps: [
      {
        serverURL: process.env.SERVER_URL,
        appId: process.env.APP_ID,
        masterKey: process.env.MASTER_KEY,
        appName: process.env.APP_NAME,
      },
    ],
    users: [
      {
        user: process.env.APP_USER,
        pass: process.env.APP_PASS,
      },
    ],
  });

  // Serve the Parse API on the /parse URL prefix, using the pre-defined api config
  app.use('/parse', api);

  // make the Parse Dashboard available at /dashboard, , using the pre-defined dashboard config
  app.use('/dashboard', dashboard);

  app.use('/api/landmarks', (req, res, next) => {
    const landmarksBeMock = [
      {
        objectId: '01',
        title: 'NNNN',
        shortInfo: 'SHORTTTT',
        description:
          'THE BIG DESCRIPTION IS HERE | THE BIG DESCRIPTION IS HERE | THE BIG DESCRIPTION IS HERE | THE BIG DESCRIPTION IS HERE | THE BIG DESCRIPTION IS HERE',
        location: { latitude: 0.01, longitude: 0.02 },
        url: 'www.website.se',
        photo: { url: '' },
        photo_thumb: { url: '' },
      },
      {
        objectId: '02',
        title: 'MMMM',
        shortInfo: 'SHORTTTT2',
        description:
          '2222THE BIG DESCRIPTION IS HERE | THE BIG DESCRIPTION IS HERE | THE BIG DESCRIPTION IS HERE | THE BIG DESCRIPTION IS HERE | THE BIG DESCRIPTION IS HERE',
        location: { latitude: 0.01, longitude: 0.02 },
        url: 'www.website2.se',
        photo: { url: '' },
        photo_thumb: { url: '' },
      },
    ];
    res.json(
      // message: "Posts fetched successfully!",
      landmarksBeMock
    );
  });

  const httpServer = require('http').createServer(app);

  httpServer.listen(port, function () {
    console.log('Initializing parse-server on port ' + port + '!');
  });
} catch (error) {
  console.log('\n>>> Parse Server/Dashboard init failed with:', error, '\n');
}

module.exports = {
  app,
};
