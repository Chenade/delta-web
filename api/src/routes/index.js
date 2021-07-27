// Schema
const { 
  schemaUserLogin, 
  schemaUserLogout,
  schemaUserRegister,
  schemaUserRegisterCheck,
  schemaUserControl,
} = require('./schema/user');

const { 
  schemaVideoApply,
  schemaVideoAuthorize,
  schemaVideoList
} = require('./schema/video');

const {
  schemaAddDevice,
  schemaDeviceControl,
  schemaDeviceList,
  schemaDeviceGPS
} = require('./schema/device');

const {
  schemaAddEvent,
  schemaEventControl,
  schemaEventSearch,
  schemaEventList,
  schemaEventNearby,
  schemaEmergencyNearby
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
  {
    method: 'GET',
    url: '/node/gps/:licensePlate',
    prefix: '/node',
    handler: deviceController.getDeviceGPS,
    schema: schemaDeviceGPS.schema
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
  //video
  {
    method: 'POST',
    url: '/node/video/apply',
    prefix: '/node',
    handler: videoController.videoApply,
    schema: schemaVideoApply.schema.post
  },
  {
    method: 'GET',
    url: '/node/video/apply/:uid',
    prefix: '/node',
    handler: videoController.getvideoApply,
    schema: schemaVideoApply.schema.get
  },
  {
    method: 'POST',
    url: '/node/video/authorize',
    prefix: '/node',
    handler: videoController.videoAuthorize,
    schema: schemaVideoAuthorize.schema.post
  },
  {
    method: 'GET',
    url: '/node/video/authorize/:uid',
    prefix: '/node',
    handler: videoController.getvideoAuthorize,
    schema: schemaVideoAuthorize.schema.get
  },
  {
    method: 'PUT',
    url: '/node/video/authorize/:rid',
    prefix: '/node',
    handler: videoController.putvideoAuthorize,
    schema: schemaVideoAuthorize.schema.put
  },
  {
    method: 'GET',
    url: '/node/video/:uid',
    prefix: '/node',
    handler: videoController.videoList,
    schema: schemaVideoList.schema
  },
  //location
  {
    method: 'GET',
    url: '/node/location/:uuid/:lat/:lng',
    prefix: '/node',
    handler: eventController.eventNearby,
    schema: schemaEventNearby.schema
  },
  {
    method: 'GET',
    url: '/node/emergency/:uuid/:lat/:lng',
    prefix: '/node',
    handler: eventController.emergencyEvent,
    schema: schemaEmergencyNearby.schema
  }
  
]

module.exports = routes
