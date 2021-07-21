const md5 = require('md5');

const crypto = require('crypto');
const prisma = require('../instances/prisma');
const axios = require("axios");
const https = require("https");
const { default: fastify } = require('fastify');

axios.defaults.headers.common["Content-Type"] = "application/json";

exports.addEvent = async (req, reply) => {
  try {

    const _uid = req.body.memberId;
    const _city = req.body.city;
    const _location = req.body.location;
    const _time = req.body.time;
    const _type = req.body.type;
    const _effectLane = req.body.effectLane;
    const _suggestion = req.body.suggestion;
    const _done = (req.body.done) ? req.body.done : 0;
    const _timestamp = Math.floor(Date.now() / 1000);
  
    const event = await prisma.event.create({
      data: {
          memberId: _uid,
          city: _city,
          lat: _location.split(',')[0],
          lng: _location.split(',')[1],
          location: _location,
          time: _time,
          type: _type,
          effectLane: _effectLane,
          suggestion: _suggestion,
          done: _done,
          timestamp: _timestamp
      }
    });
    
    reply.status(200).send({});
  } catch (err) {
    reply.status(500).send({'error': err});
  }
};

exports.getEventList = async (req, reply) => {
  try {
    const time = (req.url.includes("time")) ? req.url.split('=')[1] : 0;
    const _timestamp = Math.floor(Date.now() / 1000);
    const newEvent = await prisma.event.findMany({
      where:{
        AND:[
          {timestamp: { gt: parseInt(time)}},
          {done: { lt: 2}}
        ]
      },
      orderBy:{
        time: 'asc'
      }
    });

    const event = await prisma.event.findMany({
      where:{
        done: { lt: 2}
      },
      orderBy:{
        time: 'asc'
      }
    });
    const total = newEvent.length;

    reply.status(200).send({total: total, events: event})

    
  } catch (err) {
    reply.status(500).send({'error': err});
  }
};

exports.searchEvent = async (req, reply) => {
  try {
    
    const params = req.url.split('?')[1].split('&&');
    let query = '';
    for (const i in params){
      var condition = params[i].split("=");
      query += condition[0] + '="' + condition[1] + '"';
    }
    
    if(query)
      query = 'SELECT * FROM `event` WHERE '+ query;
    else
      query = 'SELECT * FROM `event` WHERE 1';

    const events = await prisma.$queryRaw(query);
    reply.status(200).send({total: events.length, events: events})

  } catch (err) {
    reply.status(500).send({'error': err});
  }
};

exports.putEvent = async (req, reply) => {
  try {
    const _eid = req.params.eid;
    const exist = await prisma.event.findUnique({
    where:{
      no: _eid
    }
    });
    
    if (exist){

      let query = '';
      if (req.body.memberId) query += '`memberId`="' + req.body.memberId + '"';
      if (req.body.city) query += (query ? ',' : '') + '`city`="' + req.body.city + '"';
      if (req.body.location) {
        query += (query ? ',' : '') + '`location`="' + req.body.location + '"';
        query += (query ? ',' : '') + '`lat`="' + req.body.location.split(',')[0] + '"';
        query += (query ? ',' : '') + '`lng`="' + req.body.location.split(',')[1] + '"';
      }
      if (req.body.time) query += (query ? ',' : '') + '`time`="' + req.body.time + '"';
      if (req.body.effectLane) query += (query ? ',' : '') + '`effectLane`="' + req.body.effectLane + '"';
      if (req.body.suggestion) query += (query ? ',' : '') + '`suggestion`="' + req.body.suggestion + '"';
      if (req.body.done) query += (query ? ',' : '') + '`done`="' + req.body.done + '"';
      query += (query ? ',' : '') + '`timestamp`="' + Math.floor(Date.now() / 1000) + '"';

      if(query){
        query = 'UPDATE `event` SET '+ query +' WHERE `no` = "' + _eid + '"';
        await prisma.$queryRaw(query);
      }

      return reply.status(204).send({});
    }else
      return reply.status(404).send({error: 'Evnet not Found'});
    

  } catch (err) {
    reply.status(500).send({'error': err});
  }
};

exports.eventNearby = async (req, reply) => {
  try {
    
    const _uuid = req.params.uuid;
    const _lat = parseFloat(req.params.lat);
    const _lng = parseFloat(req.params.lng);

    const query_lng = "`lng` > '" + (_lng - 0.005) + "' AND `lng` < '" + (_lng + 0.005) + "'";
    const query_lat = "`lat` > '" + (_lat - 0.005) + "' AND `lat` < '" + (_lat + 0.005) + "'";

    let query = "SELECT * FROM `event` WHERE" + query_lng + "AND" + query_lat;
    const events = await prisma.$queryRaw(query);

    let type = events.length;
    if(events.length) type = events[0].type;

    reply.status(200).send({type: type, events: events})
  } catch (err) {
    reply.status(500).send({'error': err});
  }
};
