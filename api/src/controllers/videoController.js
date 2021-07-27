const prisma = require('../instances/prisma');
const axios = require("axios");
const boom = require("@hapi/boom");
const json = require('json-keys-sort'); 
const fs = require('fs');
const { nanoid } = require('nanoid');
const sharp = require('sharp');
// const { sort } = require('../routes');

axios.defaults.headers.common["Content-Type"] = "application/json";

exports.videoApply = async (req, reply) => {
  try {
    
    const _uid = req.body.uid;
    const _time = req.body.time;
    const _type = req.body.type;
    const _location = req.body.location;
    const _police = req.body.police;
    const _trafficId = req.body.trafficId;
    const _ts = Math.floor(Date.now() / 1000);

    const apply = await prisma.videoapply.create({
      data: {
        uid: _uid,
        time: _time,
        type: _type,
        location: _location,
        police: _police,
        trafficId: _trafficId,
        progress: 0,
        valid: 1,
        timestamp: _ts
      }
    });

    reply.status(204).send({});

  } catch (err) {
    reply.status(500).send({error: err.message});
  }
};

exports.getvideoApply = async (req, reply) => {
  try {
    
    const _uid = req.params.uid;

    const apply = await prisma.videoapply.findMany({
      where:{
        uid: _uid
      },
      orderBy:{
        time: 'asc'
      }
    });

    reply.send({total: apply.length, data: apply});

  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.videoAuthorize = async (req, reply) => {
  try {
    
    const _uid = req.body.uid;
    const _time = req.body.time;
    const _type = req.body.type;
    const _location = req.body.location;
    const _police = req.body.police;
    const _trafficId = req.body.trafficId;
    const _ts = Math.floor(Date.now() / 1000);

    const apply = await prisma.videoapply.create({
      data: {
        uid: _uid,
        time: _time,
        type: _type,
        location: _location,
        police: _police,
        trafficId: _trafficId,
        progress: 0,
        valid: 0,
        timestamp: _ts
      }
    });

    reply.status(204).send({});

  } catch (err) {
    reply.status(500).send({error: err.message});
  }
};

exports.getvideoAuthorize = async (req, reply) => {
  try {
    
    const _uid = req.params.uid;

    const shared = await prisma.videoshare.findMany({
      where:{
        owner: _uid
      },
      orderBy:{
        expireDate: 'asc'
      }
    });

    reply.send({total: shared.length, data: shared});

  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.putvideoAuthorize = async (req, reply) => {
  try {
    
    const _rid = parseInt(req.params.rid);
    const _authorize = parseInt(req.body.authorize);

    const shared = await prisma.videoshare.update({
      where:{
        no: _rid
      },
      data:{
        authorize: _authorize
      }
    });

    reply.status(204).send({});

  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.videoList = async (req, reply) => {
  try {
    let returnResult = {
      result: false,
      code: -1,
      message: '',
    };

    const _id = req.body.id;
    const _ts = Math.floor(Date.now() / 1000);

    // 標記刪除貼文 & 標記刪除附件
    const [_posts, _attachment] = await prisma.$transaction([
      prisma.social_posts.updateMany({
        where: {
          id: _id
        },
        data: {
          del: true
        }
      }),
      prisma.social_posts_attachment.updateMany({
        where: {
          pid: _id
        }, data: {
          del: true,
          dateline: _ts
        }
      })
    ]);

    if (_posts.count > 0) {
      returnResult.result = true;
      returnResult.code = 0;
    }

    reply.send(json.sort(returnResult));

  } catch (err) {
    throw boom.boomify(err);
  }
};
