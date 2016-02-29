'use strict';
const Hapi = require('hapi');
const config = require('../config');
const google = require('googleapis');
const Youtube = google.youtube('v3');
const OAuth2 = google.auth.OAuth2;
const server = new Hapi.Server();

server.connection({port : 8080});

server.start(err => {
  if(err) throw err;
  console.log('server running');
});

server.route({
  method : 'GET',
  path : '/oauthcallback',
  handler : (request, reply) => {
    reply(200);
    console.log(request);
    console.log(request.query);
  }
});

server.route({
  method : 'GET',
  path : '/',
  handler : (request, reply) => {
    const oAuth2Client = new OAuth2(config.clientId, config.clientSecret, server.info.uri + '/oauthcallback');
    const url = oAuth2Client.generateAuthUrl({
      access_type : 'offline',
      scope : 'https://www.googleapis.com/auth/youtube'
    });
    console.log(server.info.uri)
    reply(`SOME URL\n <a href=${url}>OAUTH URL</a>`);
  }
})