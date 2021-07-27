const schemaVideoList = {
  schema: {
    tags: ['影片相關'],
    description: '取得影片資訊',
    summary: '...',
    params: {
      type: 'object',
      required: ['uid'],
      properties: {
        uid: { type: 'string', description: '用戶Idd' },
        deviceId: { type: 'string', description: '用戶密碼' },
        liscensePlate: { type: 'string', default: '127.0.0.1', description: '用戶來源IP' },
      }
    },
    response: {
      '2xx': {
        type: 'object',
        properties: {
          error: { type: 'string', description: '' },
          total: { type: 'string', description: '' },
          videos: { type: 'array', items: { type: 'object', properties: {
            vid: { type: 'string', description: '設備uuid' },
            deviceId: { type: 'string', description: '設備類型' },
            videoFile: { type: 'string', description: '設備類型' },
            location: { type: 'string', description: '設備類型' },
            gpsFile: { type: 'string', description: '設備類型' },
            start: { type: 'number', description: '設備類型' },
            duration: { type: 'number', description: '設備類型' },
            acccessCount: { type: 'number', description: '設備類型' },
          } } },
        }
      }
    }
  }
};
const schemaVideoApply = {
  schema: {
    get: {
      tags: ['影片相關'],
      description: '申請影片',
      summary: '...',
      // security: [{ Bearer: [] }],
      params: {
        type: 'object',
        properties: {
          uid: { type: 'string', description: 'uid'}
        }
      },
      response: {
        '2xx': {
          type: 'object',
          properties: {
            total: { type: 'number', description: '' },
            data: { type: 'array', items: { type: 'object', properties: {
              no: { type: 'number', description: '用戶名稱' },
              uid: { type: 'string', description: '用戶名稱' },
              time: { type: 'number', description: '用戶權限' },
              timestamp: { type: 'number', description: '用戶權限' },
              type: { type: 'number', description: '用戶權限' },
              location: { type: 'string', description: '用戶權限' },
              police: { type: 'number', description: '用戶權限' },
              trafficId: { type: 'string', description: '用戶權限' },
              progress: { type: 'number', description: '用戶權限' },
              valid: { type: 'number', description: '用戶權限' }
            } } },          
          }
        }
      }
    },
    post:{
      tags: ['影片相關'],
      description: '申請影片',
      summary: '...',
      // security: [{ Bearer: [] }],
      body: {
        type: 'object',
        properties: {
          uid: { type: 'string', description: '用戶名稱' },
          time: { type: 'number', description: '用戶權限' },
          type: { type: 'number', description: '用戶權限' },
          location: { type: 'string', description: '用戶權限' },
          police: { type: 'number', description: '用戶權限' },
          trafficId: { type: 'string', description: '用戶權限' },
          // progress: { type: 'number', description: '用戶權限' },
          // valid: { type: 'number', description: '用戶權限' },
        }
      },
      response: {
        '2xx': {
          type: 'object',
          properties: {
            // error: { type: 'string', description: '' },         
          }
        }
      }
    }
  }
};

const schemaVideoAuthorize = {
  schema: {
    get: {
      tags: ['影片相關'],
      description: '歷史授權',
      summary: '...',
      // security: [{ Bearer: [] }],
      params: {
        type: 'object',
        properties: {
          uid: { type: 'string', description: 'uid'}
        }
      },
      response: {
        '2xx': {
          type: 'object',
          properties: {
            total: { type: 'number', description: '' },
            data: { type: 'array', items: { type: 'object', properties: {
              no: { type: 'number', description: '用戶名稱' },
              vid: { type: 'string', description: '用戶名稱' },
              owner: { type: 'string', description: '用戶權限' },
              user: { type: 'string', description: '用戶權限' },
              authorize: { type: 'number', description: '用戶權限' },
              expireDate: { type: 'number', description: '用戶權限' },      
            } } },          
          }
        }
      }
    },
    post:{
      tags: ['影片相關'],
      description: '申請影片授權',
      summary: '...',
      // security: [ {Bearer: []} ],
      body: {
        type: 'object',
        properties: {
          vid: { type: 'string', description: '用戶名稱' },
          owner: { type: 'string', description: '用戶權限' },
          user: { type: 'string', description: '用戶權限' },
          authorize: { type: 'number', description: '用戶權限' },
          expireDate: { type: 'number', description: '用戶權限' },   
        }
      },
      response: {
        '2xx': {
          type: 'object',
          properties: {
            error: { type: 'string', description: '' },    
          }
        }
      }
    },
    put:{
      tags: ['影片相關'],
      description: '回復影片授權',
      summary: '...',
      // security: [ {Bearer: []} ],
      params: {
        type: 'object',
        properties: {
          rid: { type: 'string', description: 'Request Id'}
        }
      },
      body: {
        type: 'object',
        properties: {
          authorize: { type: 'number', description: '1: Agree, 2: Decline' },   
        }
      },
      response: {
        '2xx': {
          type: 'object',
          properties: {
            error: { type: 'string', description: '' },    
          }
        }
      }
    }
  }
};

module.exports = {
  schemaVideoApply,
  schemaVideoAuthorize,
  schemaVideoList
};