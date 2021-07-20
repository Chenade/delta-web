require("dotenv-expand")(require("dotenv").config());
const boom = require("@hapi/boom");
const swagger = require("../config/swagger");

const fastify = require("fastify")({
  logger: true,
});

// Global cors Setting
// TODO: 正式環境要限制網域
fastify.register(require('fastify-cors'), (instance) => (req, callback) => {
  let corsOptions;
  // // do not include CORS headers for requests from localhost
  // if (/localhost/.test(origin)) {
  //   corsOptions = { origin: false }
  // } else {
  //   corsOptions = { origin: true }
  // }
  callback(null, corsOptions) // callback expects two parameters: error and options
})

// JWT
fastify.register(require('fastify-jwt'), {
  secret: process.env.SECRET_KEY
})

fastify.register(require('fastify-multipart'), { 
  limits: {
    // fileSize: 52428800, // 52428800
    files: 10
  },
  attachFieldsToBody: true 
});

// Cookie setting
fastify.register(require('fastify-cookie'), {
  // secret: "my-secret", // for cookies signature
  // parseOptions: {}     // options for parsing cookies
})

// Global Error Handle
fastify.setErrorHandler(function (error, request, reply) {
  
  let errMsg = error.message;
  let statusCode = 500;

  // boom 錯誤
  if (boom.isBoom(error)) {
    let errPayload = error.output.payload;
    statusCode = errPayload.statusCode;
    errMsg = 'boom: ' + errPayload.message;
  }

  reply.type('application/json').status(statusCode).send({
    result: false,
    status: statusCode,
    message: errMsg
  });
})

// set not found handler
fastify.setNotFoundHandler(function (request, reply) {
  reply.code(404).type('application/json').send({
    result: false,
    status: 404,
    message: 'web api not found'
  });
})

// jwt validate path handler
const excludeValidatePath = [
  // '/node/tests',
  '/node/login',
  '/node/register',
  '/node/register/:uid',
  '/node/user/:uid',
  '/node/device',
  '/node/device/:licensePlate',
  '/node/event',
  '/node/documentation'
];
fastify.addHook("onRequest", async (request, reply) => {
  try {
    // 陣列路徑以外的要驗證JWT
    let result = excludeValidatePath.find(function(item, index, array) {
      return request.routerPath.includes(item);
    }) || '';
    if (result === '') await request.jwtVerify();

    // if (!excludeValidatePath.includes(request.routerPath)) {
    //   await request.jwtVerify();
    // }
  } catch (err) {
    reply.send(err); // 格式統一在 fastify.setErrorHandler 處理
  }
});

fastify.register(require("fastify-swagger"), swagger.options);

// 注入物件到特定路徑
fastify.decorateRequest('fastify', null);
const includeFastifyObjPath = [
  // '/node/tests',
  '/node/social/userlogin'
];
fastify.addHook('preHandler', (req, reply, next) => {
  if (includeFastifyObjPath.includes(req.routerPath)) {
    req.fastify = fastify;
  }
  next();
});

const routes = require("./routes");
routes.forEach((route, index) => {
  fastify.route(route);
});

// Declare a route
// fastify.get('/', async (request, reply) => {
//     return { hello: 'world' };
// })

// Run the server!
// TODO: where to log error?
const start = async () => {
  try {
    await fastify.listen(process.env.SERVER_PORT);
    fastify.swagger();
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
    // console.log('fastify: ', fastify);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
