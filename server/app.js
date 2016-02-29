'use strict';
const Hapi = require('hapi');
const config = require('../config');
const google = require('googleapis');
const Youtube = google.youtube('v3');
const OAuth2 = google.auth.OAuth2;
const server = new Hapi.Server();
const oAuth2Client = new OAuth2(
  config.clientId,
  config.clientSecret,
  'http://' + config.host + ':' + config.port + '/oauthcallback',
  {tokenUrl : 'http://www.googleapis.com/oauth2/v3/token'}
);
server.connection({port : 8080, host : config.host });

server.start(err => {
  if(err) throw err;
  console.log('server running');
});

server.route({
  method : 'GET',
  path : '/oauthcallback',
  handler : (request, reply) => {
    oAuth2Client.getToken(config.accessToken, (err, tokens) => {
      if(err) throw err;
      console.log(tokens);
    });
    reply(200);
    console.log(request);
    console.log(request.query);
  }
});

server.route({
  method : 'GET',
  path : '/',
  handler : (request, reply) => {
    const url = oAuth2Client.generateAuthUrl({
      access_type : 'offline',
      scope : 'https://www.googleapis.com/auth/youtube'
    });
    reply(`SOME URL\n <a href=${url}>OAUTH URL</a>`);
  }
})