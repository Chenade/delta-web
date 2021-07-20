require("dotenv-expand")(require("dotenv").config());
const boom = require("@hapi/boom");
const prisma = require("../instances/prisma");
const FormData = require('form-data');
const axios = require("axios");
const https = require("https");

axios.defaults.headers.common["Content-Type"] = "application/json";

exports.getTests = async (req, reply) => {
  // console.log('fastify: ', req.fastify);
  
  console.log('jwt: ', req.user);

  reply.send({result: 'ok'});

  // const CookieValues = req.cookies;
  // let cookieStr = '';
  // for (const key in CookieValues) {
  //   if (Object.hasOwnProperty.call(CookieValues, key)) {
  //     cookieStr += key + "=" + CookieValues[key] + ";";
  //   }
  // }

  // const agent = new https.Agent({
  //   rejectUnauthorized: false
  // });

  // let phpApiUrl = 'https://my.mdkforum.com/api.php?mod=login&do=status';
  // const res = await axios.get(phpApiUrl, {
  //   // withCredentials: true,
  //   httpsAgent: agent,
  //   headers: {
  //     Cookie: cookieStr
  //   }
  // });

  // reply.send(res.data);

  // call php api
  // let phpApiUrl = 'https://my.mdkforum.com/api.php?mod=login&uid=14425';

  // reply.setCookie(cookies).send(res.data);

  // console.log('cookie: ', cookies);

  // return res.data;

  // Google reCAPTCHA v2
  // const _token = req.body.token;
  // const _clientIp = req.body.ip;
  // let recaptcha_url = "https://www.google.com/recaptcha/api/siteverify";

  // let payload = {
  //   secret: '6LfzxugaAAAAAI4vJzhafsuWpDrAW2L1iRWkzHjc',
  //   response: _token,
  //   remoteip: _clientIp
  // };
  // let u = new URLSearchParams(payload).toString();
  // const res = await axios.post(recaptcha_url + '?' + u);

  // Google reCAPTCHA v3
  // const _token = req.body.token;
  // const _clientIp = req.ip;
  // let recaptcha_url = "https://www.google.com/recaptcha/api/siteverify";

  // let payload = {
  //   secret: '6LdTYeEaAAAAAOELwpI-njbPwXYVyyTGY7pNLS8O',
  //   response: _token,
  //   remoteip: _clientIp
  // };
  // let u = new URLSearchParams(payload).toString();
  // const res = await axios.post(recaptcha_url + '?' + u);
  // return res.data;

  // let _lastpost = parseInt(isNaN(req.query.lastpost) ? 9999999999 : req.query.lastpost || 9999999999, 10);
  // _lastpost = (_lastpost === 0) ? 9999999999 : _lastpost;

  // let _lastpost = 0;
  // if (req.query.lastpost) {
  //   console.log('yes');
  // }

  // return {"m:": process.env.DATABASE_URL};
  // process.exit(1);
  // throw new Error('AAAAAXXXXX');
  // return {"m:": ""};
  // const user = await prisma.wav_common_member.findUnique({
  //   where: {
  //     uId: 14425
  //   },
  //   select: {
  //     uId: true,
  //     userName: true,
  //     groupId: true,
  //     profile: {
  //       select: {
  //         realName: true,
  //         info: true
  //       }
  //     }
  //   }
  // });

  // for (const key in user) {
  //   if (Object.hasOwnProperty.call(user, key)) {
  //     console.log('user[key]:', user[key]);
  //     if (key == 'profile') {
  //       user[key].realName += '_ggg';
  //       console.log('realName...');
  //     }
  //   }
  // }

  // return params;
};


exports.deleteTest = async (req, reply) => {
  console.log('jwt: ', req.user);
  reply.send({result: 'delete'});
};

exports.putTest = async (req, reply) => {
  console.log('jwt: ', req.user);
  reply.send({result: 'put'});
};


/*
  // Get single car by ID
  exports.getSingleCar = async (req, reply) => {
    try {
      const id = req.params.id
      const car = await Car.findById(id)
      return car
    } catch (err) {
      throw boom.boomify(err)
    }
  }
  
  // Add a new car
  exports.addCar = async (req, reply) => {
    try {
      const car = new Car(req.body)
      return car.save()
    } catch (err) {
      throw boom.boomify(err)
    }
  }
  
  // Update an existing car
  exports.updateCar = async (req, reply) => {
    try {
      const id = req.params.id
      const car = req.body
      const { ...updateData } = car
      const update = await Car.findByIdAndUpdate(id, updateData, { new: true })
      return update
    } catch (err) {
      throw boom.boomify(err)
    }
  }
  
  // Delete a car
  exports.deleteCar = async (req, reply) => {
    try {
      const id = req.params.id
      const car = await Car.findByIdAndRemove(id)
      return car
    } catch (err) {
      throw boom.boomify(err)
    }
  }
  */
