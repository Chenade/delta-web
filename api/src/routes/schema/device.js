const schemaAddDevice = {
  schema: {
    tags: ['設備相關'],
    description: '新增設備',
    summary: '...',
    body: {
      type: 'object',
      required: ['uuid', 'uid','type'],
      properties: {
        uuid: { type: 'string', description: '設備uuid' },
        licensePlate: {type: 'string', description: '車牌號碼'},
        uid: { type: 'string', description: '用戶ID' },
        type: { type: 'string', description: '設備類型' },
      }
    },
    response: {
      '2xx': {
        type: 'object',
        properties: {
          // error: { type: 'string', description: '' },
        }
      },
      '4xx': {
        type: 'object',
        properties: {
          error: { type: 'string', description: '' },
        }
      }
    }
  }
};

const schemaDeviceList = {
  schema: {
    tags: ['設備相關'],
    description: '取得設備清單',
    summary: '...',
    params:{
      uid: {type: 'string', description: '用戶ID'}
    },
    response: {
      '2xx': {
        type: 'object',
        properties: {
          total: { type: 'number', description: '總計' },
          devices: { type: 'array', items: { type: 'object', properties: {
            uuid: { type: 'string', description: '設備uuid' },
            licensePlate: { type: 'string', description: '車牌號碼' },
            type: { type: 'string', description: '設備類型' }
          } } },
        }
      }
    }
  }
};

const schemaDeviceControl = {
  schema: {
    get:{
      tags: ['設備相關'],
      description: '透過車牌號碼取得設備資訊',
      summary: '...',
      params:{
        licensePlate: {type: 'string', description: '車牌號碼'}
      },
      response: {
        '2xx': {
          type: 'object',
          properties: {
            total: { type: 'number', description: '總計' },
            devices: { type: 'array', items: { type: 'object', properties: {
              uuid: { type: 'string', description: '設備uuid' },
              licensePlate: { type: 'string', description: '車牌號碼' },
              type: { type: 'string', description: '設備類型' }
            } } },
          }
        }
      }
    },
    put:{
      tags: ['設備相關'],
      description: '更新設備資訊',
      summary: '...',
      params:{
        uuid: {type: 'string', description: '設備UUID'}
      },
      body: {
        type: 'object',
        properties: {
          licensePlate: { type: 'string', description: '車牌號碼' },
          uid: { type: 'string', description: '用戶ID' },
          type: { type: 'string', description: '設備類型' },
          del: { type: 'number', description: '設備類型' },
        }
      },
      response: {
        '2xx': {
          type: 'object',
          properties: {
    
          }
        }
      }
    }
  }
};


const schemaDeviceGPS = {
  schema: {
    tags: ['設備相關'],
    description: '取得設備位置',
    summary: '...',
    params:{
      licensePlate: {type: 'string', description: '用戶ID'}
    },
    response: {
      '2xx': {
        type: 'object',
        properties: {
          lat: { type: 'string', description: '經度' },
          lng: { type: 'string', description: '緯度' },
          timestamp: { type: 'number', description: '時間戳記' },
        }
      }
    }
  }
};


module.exports = {
  schemaAddDevice,
  schemaDeviceControl,
  schemaDeviceList,
  schemaDeviceGPS
};