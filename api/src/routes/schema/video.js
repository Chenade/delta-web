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
          uid: {
            type: 'string',
            description: 'uid'
          }
        }
      },
      response: {
        '2xx': {
          type: 'object',
          properties: {
            total: { type: 'number', description: '' },
            data: { type: 'array', items: { type: 'object', properties: {
              uid: { type: 'string', description: '用戶名稱' },
              time: { type: 'number', description: '用戶權限' },
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
      description: '申請影片',
      summary: '...',
      // security: [{ Bearer: [] }],
      params: {
        type: 'object',
        properties: {
          uid: {
            type: 'string',
            description: 'uid'
          }
        }
      },
      response: {
        '2xx': {
          type: 'object',
          properties: {
            error: { type: 'string', description: '' },
            total: { type: 'number', description: '' },
            data: { type: 'array', items: { type: 'object', properties: {
              uuid: { type: 'string', description: '設備uuid' },
              type: { type: 'string', description: '設備類型' }
            } } },          
          }
        }
      }
    },
    post:{
      tags: ['影片相關'],
      description: '申請影片紀錄',
      summary: '...',
      // security: [
      //   {
      //     Bearer: []
      //   }
      // ],
      params: {
        type: 'object',
        properties: {
          uid: {
            type: 'string',
            description: 'uid'
          }
        }
      },
      body: {
        type: 'object',
        properties: {
          username: { type: 'string', description: '用戶名稱' },
          authority: { type: 'number', description: '用戶權限' },
          emergency: { type: 'object',properties: {
            id: { type: 'string', description: '緊急聯絡人ID' },
            name: { type: 'string', description: '緊急聯絡人名稱' },
            contact: { type: 'string', description: '緊急聯絡人聯絡方式' },
          }}      
        }
      },
      response: {
        '2xx': {
          type: 'object',
          properties: {
            error: { type: 'string', description: '' },
            total: { type: 'number', description: '' },
            data: { type: 'array', items: { type: 'object', properties: {
              uuid: { type: 'string', description: '設備uuid' },
              type: { type: 'string', description: '設備類型' }
            } } },          
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