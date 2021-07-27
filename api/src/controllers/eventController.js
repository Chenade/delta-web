const md5 = require('md5');
const nodemailer = require('nodemailer');

const crypto = require('crypto');
const prisma = require('../instances/prisma');
const axios = require("axios");
const https = require("https");
const { default: fastify } = require('fastify');

const General = require('../functions/general.js');

axios.defaults.headers.common["Content-Type"] = "application/json";

exports.addEvent = async (req, reply) => {
  try {

    const _uid = req.body.memberId;
    const _city = req.body.city;
    const _location = req.body.location;
    const _lat =  _location.split(',')[0];
    const _lng =  _location.split(',')[1];
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
          lat: _lat,
          lng: _lng,
          location: _location,
          time: _time,
          type: _type,
          effectLane: _effectLane,
          suggestion: _suggestion,
          done: _done,
          timestamp: _timestamp
      }
    });

    if(req.body.done) General.BroadCast(_lat, _lng)
    
    reply.status(200).send({});
  } catch (err) {
    reply.status(500).send({'error': err});
  }
};

exports.getEventList = async (req, reply) => {
  try {
    const time = (req.url.includes("time")) ? req.url.split('=')[1] : 0;

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

    var eventList = []
    for(const i in event){
      const el = event[i];
      var detail ={
        no: el.no,
        memberId: el.memberId,
        city: el.city,
        location: '<span class="cood">'+el.location+'</span>',
        time: General.unix(el.time),
        type: General.convert('type', el.type),
        effectLane: General.convert('lane', el.effectLane),
        suggestion: General.convert('suggestion', el.suggestion),
        done: General.convert('progress', el.done),
        timestamp: el.timestamp,
      }
      eventList.push(detail)
    }

    const total = newEvent.length;
    console.log(eventList);

    reply.status(200).send({data: eventList})

    
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
    const _ts = Math.floor(Date.now() / 1000);

    await prisma.car.update({
      where: {
        licensePlate: _uuid
      },
      data: {
        lat: (_lat).toString(),
        lng: (_lng).toString(),
        timestamp: _ts
      }
    });

    const query_lng = "`lng` > '" + (_lng - 0.0027) + "' AND `lng` < '" + (_lng + 0.0027) + "'";
    const query_lat = "`lat` > '" + (_lat - 0.0027) + "' AND `lat` < '" + (_lat + 0.0027) + "'";

    let query = "SELECT * FROM `event` WHERE" + query_lng + "AND" + query_lat;
    const events = await prisma.$queryRaw(query);

    let type = events.length;
    if(events.length) type = events[0].type;
 
    reply.status(200).send({type: type})
  } catch (err) {
    reply.status(500).send({'error': err});
  }
};

exports.emergencyEvent = async (req, reply) => {
  try {

    const _lat = (req.params.lat);
    const _lng = (req.params.lng);
    const _uuid = req.params.uuid;
    const _ts = Math.floor(Date.now() / 1000);

    const user = await prisma.device.findUnique({
      where:{
        uuid: _uuid
      },
      select:{
        memberId: true
      }
    })

    const _uid = user.memberId;

    const event = await prisma.event.create({
      data: {
          memberId: _uid,
          city: '',
          lat: _lat,
          lng: _lng,
          location: _lat + ',' +_lng,
          time: _ts,
          type: 1,
          effectLane: '',
          suggestion: '1',
          done: 1,
          timestamp: _ts
      }
    });

    General.BroadCast(_lat, _lng)

    reply.status(200).send({});
  } catch (err) {
    reply.status(500).send({'error': err});
  }
};