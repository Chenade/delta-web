const md5 = require('md5');

const crypto = require('crypto');
const prisma = require('../instances/prisma');
const axios = require("axios");
const https = require("https");
const boom = require("@hapi/boom");
const json = require('json-keys-sort'); 
const { default: fastify } = require('fastify');

axios.defaults.headers.common["Content-Type"] = "application/json";

exports.getStatus = async (req, reply) => {
  try {
    const _uid = req.params.uid;

    const user = await prisma.member.findUnique({
      where: {
        uid: _uid
      }
    });

    if(user)
      reply.status(403).send({error: 'Account already exist!'})
    else
      reply.status(200).send({})

  } catch (err) {
    throw boom.boomify(err);
  }
};
      
exports.postLogin = async (req, reply) => {
  try {    
    // get post data
    const _username = req.body.username;
    const _password = req.body.password;
    const _ip = req.body.ip;
    
    // Google reCAPTCHA v2
    // if (process.env.GOOGLE_RE_VALIDATE == 1) {
    //   const recaptcha_url = "https://www.google.com/recaptcha/api/siteverify";
    //   let payload = {
    //     secret: process.env.GOOGLE_RE_SEC,
    //     response: _GrToken,
    //     remoteip: _clientIp
    //   };
    //   let u = new URLSearchParams(payload).toString();
    //   const GreRespose = await axios.post(recaptcha_url + '?' + u);
  
    //   // Google reCAPTCHA validate fail
    //   if (!GreRespose.data.success) {
    //     returnResult.code = -1;
    //   }
      
    // }

    const user = await prisma.member.findUnique({
      where: {
        uid: _username
      }
    });

    if(user){
      if (user.password == _password){
      
        // const jwtToken = req.fastify.jwt.sign({
        //   uid: user.uid,
        //   username: user.username,
        //   email: user.account
        // }, {
        //   expiresIn: process.env.JWT_EXPIRY
        // });
        // console.log(fastify)

        reply.status(200).send({token: 'jwtToken'})
      }else
        reply.status(403).send({error: 'Wrong Password!'})

    }else
      reply.status(404).send({error: 'Account not Found!'})

  } catch (err) {
    reply.status(500).send({error: err})
  }
};

exports.postLogout = async (req, reply) => {
  try {

    reply.status(204);

  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.register = async (req, reply) => {
  try {
    
    const _uid = req.body.uid;

    const exist = await prisma.member.findUnique({
      where:{
        uid: _uid
      }
    });
    if (exist)
      return reply.status(403).send({error: 'account already exist'});

    const _username = req.body.username;
    const _account = req.body.account;
    const _passsword = req.body.password;
    const _authority = (req.body.authority) ? req.body.authority : 0;
    const _emergencyId = (req.body.emergency.id) ? req.body.emergency.id : '';
    const _emergencyName = (req.body.emergency.name) ? req.body.emergency.name :'';
    const _emergencyContact = (req.body.emergency.contact) ? req.body.emergency.contact : '';

    const _realname = req.body.realname;
    const _tel = (req.body.tel) ? req.body.tel :'';
    const _mobile = req.body.mobile;
    const _email = (req.body.email) ? req.body.email : _account;

    const user = await prisma.member.create({
      data: {
          uid: _uid,
          account: _account,
          password: _passsword,
          username: _username,
          authority: _authority,
          device:0,
          remainCount:0,
          emergencyId:  _emergencyId,
          emergencyName: _emergencyName,
          emergencyContact: _emergencyContact
      }
    });

    const user_profile = await prisma.member_profile.create({
      data: {
          uid: _uid,
          realname: _realname,
          tel: _tel,
          mobile: _mobile,
          email: _email,
      }
    });

    const member = await prisma.member.findUnique({
      where:{
        uid: _uid
      }
    });
    let profile = member;
    profile.emergency = {
      id: member.emergencyId,
      name: member.emergencyName,
      contact: member.emergencyContact,
    }
    
    reply.status(200).send({member: profile});
  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.putInfo = async (req, reply) => {
  try {
    const _uid = req.params.uid;
    const user = await prisma.member.findUnique({
      where: {
        uid: _uid
      }
    });

    if(user){
      let query = '', query2 = '';
      if (req.body.username) query += '`username`="' + req.body.username + '"';
      if (req.body.password) query += (query ? ',' : '') + '`password`="' + req.body.password + '"';
      if (req.body.authority && req.body.authority != null) query += (query ? ',' : '') + '`authority`="' + req.body.authority + '"';
      
      if (req.body.emergencyId) query += (query ? ',' : '') + '`emergencyId`="' + req.body.emergencyId + '"';
      if (req.body.emergencyName) query +=  (query ? ',' : '') + '`emergencyName`="' + req.body.emergencyName + '"';
      if (req.body.emergencyContact) query +=  (query ? ',' : '') + '`emergencyContact`="' + req.body.emergencyContact + '"';
      
      if (req.body.realname) query2 += (query2 ? ',' : '') + '`realname`="' + req.body.aurealnamethority + '"';
      if (req.body.mobile) query2 += (query2 ? ',' : '') + '`mobile`="' + req.body.mobile + '"';
      if (req.body.tel) query2 += (query2 ? ',' : '') + '`tel`="' + req.body.tel + '"';
      if (req.body.email) query2 += (query2 ? ',' : '') + '`email`="' + req.body.email + '"';
      
      if(query){
        query = 'UPDATE `member` SET '+ query +' WHERE `uid` = "' + _uid + '"';
        const member = await prisma.$queryRaw(query);
      }

      if(query2){
        query2 = 'UPDATE `member_profile` SET '+ query2 +' WHERE `uid` = "' + _uid + '"';
        const memberProfile = await prisma.$queryRaw(query2);
      }

      reply.status(200).send({});

    }else
      reply.status(404).send({error: 'Account not Found'});

    
  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.getInfo = async (req, reply) => {
  try {    
    const _uid = req.params.uid;

    const user = await prisma.member.findUnique({
      where: {
        uid: _uid
      }
    });

    if(user){
      let profile = user;
      profile.data = {
        remain: user.remainCount,
        help: user.helpCount,
        request: user.requestCount
      }
      profile.emergency = {
        id: user.emergencyId,
        name: user.emergencyName,
        contact: user.emergencyContact
      }

      profile.detail = await prisma.member_profile.findUnique({
        where:{
          uid: _uid
        }
      });

      reply.status(200).send({member: user})

    }else
      reply.status(404).send({error: 'Account not Found!'})

  } catch (err) {
    reply.status(500).send({error: err})
  }
};