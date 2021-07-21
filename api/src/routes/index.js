// Schema
const { 
  schemaUserLogin, 
  schemaUserLogout,
  schemaUserRegister,
  schemaUserRegisterCheck,
  schemaUserControl,
} = require('./schema/user');

const { 
  schemaGetVideo, 
  
} = require('./schema/video');

const {
  schemaAddDevice,
  schemaDeviceControl,
  schemaDeviceList
} = require('./schema/device');

const {
  schemaAddEvent,
  schemaEventControl,
  schemaEventSearch,
  schemaEventList,
  schemaEventNearby
} = require('./schema/event');

const testController = require('../controllers/testController');
const userController = require('../controllers/userController');
const videoController = require('../controllers/videoController');
const deviceController = require('../controllers/deviceController');
const eventController = require('../controllers/eventController');

const routes = [
  {
    method: 'POST',
    url: '/node/tests',
    prefix: '/node',
    handler: testController.getTests
  },
  {
    method: 'DELETE',
    url: '/node/tests',
    prefix: '/node',
    handler: testController.deleteTest
  },
  {
    method: 'PUT',
    url: '/node/tests',
    prefix: '/node',
    handler: testController.putTest
  },
  //user
  {
    method: 'POST',
    url: '/node/login',
    prefix: '/node',
    handler: userController.postLogin,
    schema: schemaUserLogin.schema
  },
  {
    method: 'POST',
    url: '/node/logout',
    prefix: '/node',
    handler: userController.postLogout,
    schema: schemaUserLogout.schema
  },
  {
    method: 'POST',
    url: '/node/register',
    prefix: '/node',
    handler: userController.register,
    schema: schemaUserRegister.schema
  },
  {
    method: 'POST',
    url: '/node/register/:uid',
    prefix: '/node',
    handler: userController.getStatus,
    schema: schemaUserRegisterCheck.schema
  },
  {
    method: 'GET',
    url: '/node/user/:uid',
    prefix: '/node',
    handler: userController.getInfo,
    schema: schemaUserControl.schema.get
  },
  {
    method: 'PUT',
    url: '/node/user/:uid',
    prefix: '/node',
    handler: userController.putInfo,
    schema: schemaUserControl.schema.put
    
  },
  //device
  {
    method: 'POST',
    url: '/node/device',
    prefix: '/node',
    handler: deviceController.addDevice,
    schema: schemaAddDevice.schema
  },
  {
    method: 'GET',
    url: '/node/device/user/:uid',
    prefix: '/node',
    handler: deviceController.getDeviceList,
    schema: schemaDeviceList.schema
  },
  {
    method: 'GET',
    url: '/node/device/licensePlate/:licensePlate',
    prefix: '/node',
    handler: deviceController.getDevice,
    schema: schemaDeviceControl.schema.get
  },
  {
    method: 'PUT',
    url: '/node/device/:uuid',
    prefix: '/node',
    handler: deviceController.putDevice,
    schema: schemaDeviceControl.schema.put
  },
  //event
  {
    method: 'POST',
    url: '/node/event',
    prefix: '/node',
    handler: eventController.addEvent,
    schema: schemaAddEvent.schema
  },
  {
    method: 'GET',
    url: '/node/event',
    prefix: '/node',
    handler: eventController.getEventList,
    schema: schemaEventList.schema
  },
  {
    method: 'GET',
    url: '/node/event/search',
    prefix: '/node',  
    handler: eventController.searchEvent,
    schema: schemaEventSearch.schema
  },
  {
    method: 'PUT',
    url: '/node/event/:eid',
    prefix: '/node',
    handler: eventController.putEvent,
    schema: schemaEventControl.schema.put
  },
  //location
  {
    method: 'POST',
    url: '/node/location/:uuid/:lat/:lng',
    prefix: '/node',
    handler: eventController.eventNearby,
    schema: schemaEventNearby.schema
  },
]

module.exports = routes
