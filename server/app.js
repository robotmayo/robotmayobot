'use strict';
const Hapi = require('hapi');
const config = require('../config');
const google = require('googleapis');
const Youtube = google.youtube('v3');
const OAuth2 = google.auth.OAuth2;
const server = new Hapi.Server();
const fetch = require('fetch');
const redirectUri = 'http://' + config.host + ':' + config.port + '/oauthcallback';
const oAuth2Client = new OAuth2(
  config.clientId,
  config.clientSecret,
  redirectUri
);
server.connection({port : 8080, host : config.host });

const getThisFuckingToken = function(code){
  const query = require('querystring').stringify({
    code : code,
    redirect_uri : redirectUri,
    client_id : config.clientId,
    clientSecret : config.clientSecret,
    grant_type : 'authorization_code'
  })
  return fetch('http://www.googleapis.com/oauth2/v3/token', {method : 'post', body : query})
}

server.start(err => {
  if(err) throw err;
  console.log('server running');
});

server.route({
  method : 'GET',
  path : '/oauthcallback',
  handler : (request, reply) => {
    getThisFuckingToken(request.query.code)
    .then(res =>{
      return res.json();
    })
    .then(json => {
      console.log(json);
    })
    .catch(err => {
      console.log(err);
    })
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