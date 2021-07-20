require("dotenv-expand")(require("dotenv").config());

exports.options = {
  routePrefix: "/node/documentation",
  exposeRoute: true,
  swagger: {
    info: {
      title: "MDK動態牆 API",
      description: "使用 Node.js, Fastify, Prisma... 製作",
      version: "0.0.1",
    },
    externalDocs: {
      url: "https://swagger.io",
      description: "Find more info here",
    },
    host: `${process.env.SERVER_HOST}`,
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
    // security: [{ Bearer: [] }],
    securityDefinitions: {
      Bearer: {
        type: "apiKey",
        name: "Authorization",
        in: "header"
      }
    }

    
  },
};
