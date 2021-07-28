const md5 = require('md5');

const crypto = require('crypto');
const prisma = require('../instances/prisma');
const axios = require("axios");
const https = require("https");
const { default: fastify } = require('fastify');

axios.defaults.headers.common["Content-Type"] = "application/json";

exports.addDevice = async (req, reply) => {
  try {
    
    const _uuid = req.body.uuid;
    let reg = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/;
    let match = _uuid.match(reg);
    if(match == null)  
      return reply.status(403).send({error: 'UUID Format Error!'});

    const exist = await prisma.device.findFirst({
      where:{
        AND:[
          {uuid: _uuid},
          {del: 0}
        ]
      }
    });
    
    if (exist)
      return reply.status(403).send({error: 'Device already exist'});

    const _uid = req.body.uid;
    const _licensePlate = req.body.licensePlate;
    const _type = req.body.type;
    const _ts = Math.floor(Date.now() / 1000);

    const device = await prisma.device.create({
      data: {
          memberId: _uid,
          licensePlate: _licensePlate,
          uuid: _uuid,
          type: _type,
      }
    });

    const car = await prisma.car.findUnique({
      where:{
        licensePlate: _licensePlate
      }
    });


    if(!car){
      await prisma.car.create({
        data:{
          licensePlate: _licensePlate, 
          memberId: _uid,
          tag: '',
          lat: '25.033493',
          lng: '121.564101',
          timestamp: _ts
        }
      });
    }

    
    reply.status(200).send({});
  } catch (err) {
    reply.status(500).send({'error': err});
  }
};

exports.getDeviceList = async (req, reply) => {
  try {
    const _uid = req.params.uid;
    const device = await prisma.device.findMany({
      where: {
        AND:[
          {memberId: _uid},
          {del: 0}
        ]
      },
      orderBy:{
        licensePlate: 'asc'
      }
    });
    const total = device.length;

    reply.status(200).send({total: total, devices: device})

    
  } catch (err) {
    reply.status(500).send({'error': err});
  }
};

exports.getDevice = async (req, reply) => {
  try {
    const _licensePlate = req.params.licensePlate;
    const device = await prisma.device.findMany({
      where: {
        AND:[
          {licensePlate: _licensePlate},
          {del: 0}
        ]
      }
    });
    const total = device.length;

    reply.status(200).send({total: total, devices: device})

    
  } catch (err) {
    reply.status(500).send({'error': err});
  }
};

exports.putDevice = async (req, reply) => {
  try {
    
    const _uuid = req.params.uuid;
    let reg = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/;
    let match = _uuid.match(reg);
    if(match == null)  
      return reply.status(403).send({error: 'UUID Format Error!'});

    const exist = await prisma.device.findUnique({
    where:{
      uuid: _uuid
    }
    });
    
    if (exist){

      let query = '';
      if (req.body.licensePlate) query += '`licensePlate`="' + req.body.licensePlate + '"';
      if (req.body.uid != null) query += (query ? ',' : '') + '`memberId`="' + req.body.uid + '"';
      if (req.body.type) query += (query ? ',' : '') + '`type`="' + req.body.type + '"';
      if (req.body.del) query += (query ? ',' : '') + '`del`="1"';
      
      if(query){
        query = 'UPDATE `device` SET '+ query +' WHERE `uuid` = "' + _uuid + '"';
        const member = await prisma.$queryRaw(query);
      }

      return reply.status(204).send({});
    }else
      return reply.status(404).send({error: 'Device not Found'});
    
    reply.status(200).send({});

  } catch (err) {
    reply.status(500).send({'error': err});
  }
};

exports.getDeviceGPS = async (req, reply) => {
  try {
    const _licensePlate = req.params.licensePlate;
    const device = await prisma.car.findUnique({
      where: {
        licensePlate: _licensePlate
      },
      select:{
        lat: true,
        lng: true,
        timestamp: true
      }
    });

    reply.status(200).send({'lat': device.lat, 'lng': device.lng, 'timestamp': device.timestamp})

    
  } catch (err) {
    reply.status(500).send({'error': err});
  }
};
