const schemaAddEvent = {
  schema: {
    tags: ['事件相關'],
    description: '新增設備',
    summary: '...',
    body: {
      type: 'object',
      required: ['memberId', 'city','location', 'time'],
      properties: {
        memberId: { type: 'string', description: '車牌號碼' },
        city: { type: 'string', description: '設備類型' },
        location: { type: 'string', description: '設備類型' },
        time: { type: 'number', description: '設備類型' },
        type: { type: 'number', description: '1: 車禍, 2: 施工 ' },
        effectLane: { type: 'string', description: '設備類型' },
        suggestion: { type: 'string', description: '1: 小心駕駛, 2: 提前改道' },
        done: { type: 'number', description: '1: 小心駕駛, 2: 提前改道' },
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

const schemaEventSearch = {
  schema: {
    tags: ['事件相關'],
    description: '查詢事件',
    summary: '...',
    params:{
      uid: {type: 'string', description: '用戶ID'},
      city: {type: 'string', description: '事發城市'},
      start: {type: 'string', description: '事發城市'},
      end: {type: 'string', description: '事發城市'},
    },
    response: {
      '2xx': {
        type: 'object',
        properties: {
          total: { type: 'number', description: '總計' },
          events: { type: 'array', items: { type: 'object', properties: {
            no: { type: 'string', description: '設備uuid' },
            memberId: { type: 'string', description: '車牌號碼' },
            city: { type: 'string', description: '設備類型' },
            location: { type: 'string', description: '設備類型' },
            time: { type: 'string', description: '設備類型' },
            type: { type: 'string', description: '設備類型' },
            effectLane: { type: 'string', description: '設備類型' },
            suggestion: { type: 'string', description: '設備類型' },
            done: { type: 'number', description: '設備類型' },
            timestamp: { type: 'string', description: '設備類型' },
          } } },
        }
      }
    }
  }
};

const schemaEventList = {
  schema: {
    tags: ['事件相關'],
    description: '查詢事件',
    summary: '...',
    // params:{
    //   time: { type: 'number', description: '總計' },
    // },
    response: {
      '2xx': {
        type: 'object',
        properties: {
          total: { type: 'number', description: '總計' },
          events: { type: 'array', items: { type: 'object', properties: {
            no: { type: 'string', description: '設備uuid' },
            memberId: { type: 'string', description: '車牌號碼' },
            city: { type: 'string', description: '設備類型' },
            location: { type: 'string', description: '設備類型' },
            time: { type: 'string', description: '設備類型' },
            type: { type: 'string', description: '設備類型' },
            effectLane: { type: 'string', description: '設備類型' },
            suggestion: { type: 'string', description: '設備類型' },
            done: { type: 'number', description: '設備類型' },
            timestamp: { type: 'string', description: '設備類型' },
          } } },
        }
      }
    }
  }
  
};

const schemaEventControl = {
  schema: {
    get:{
      tags: ['事件相關'],
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
      tags: ['事件相關'],
      description: '編輯事件',
      summary: '...',
      params:{
        eid: { type: 'number', description: '設備類型' }
      },
      body: {
        type: 'object',
        properties: {
          memberId: { type: 'string', description: '車牌號碼' },
          city: { type: 'string', description: '設備類型' },
          location: { type: 'string', description: '設備類型' },
          time: { type: 'number', description: '設備類型' },
          type: { type: 'number', description: '1: 車禍, 2: 施工 ' },
          effectLane: { type: 'string', description: '設備類型' },
          suggestion: { type: 'string', description: '1: 小心駕駛, 2: 提前改道' },
          done: { type: 'number', description: '1: 小心駕駛, 2: 提前改道' },
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
  }
};

const schemaEventNearby = {
  schema: {
    tags: ['事件相關'],
    description: '查詢事件',
    summary: '...',
    params:{
      uuid: { type: 'string', description: '總計' },
      lat: { type: 'string', description: '總計' },
      lng: { type: 'string', description: '總計' },
    },
    response: {
      '2xx': {
        type: 'object',
        properties: {
          type: { type: 'number', description: '0: SAFE, 1: Traffic, 2: Construction' },
          events: { type: 'array', items: { type: 'object', properties: {
            no: { type: 'string', description: '設備uuid' },
            memberId: { type: 'string', description: '車牌號碼' },
            city: { type: 'string', description: '設備類型' },
            location: { type: 'string', description: '設備類型' },
            time: { type: 'string', description: '設備類型' },
            type: { type: 'string', description: '設備類型' },
            effectLane: { type: 'string', description: '設備類型' },
            suggestion: { type: 'string', description: '設備類型' },
            done: { type: 'number', description: '設備類型' },
            timestamp: { type: 'string', description: '設備類型' },
          } } },
        }
      }
    }
  }
  
};

module.exports = {
  schemaAddEvent,
  schemaEventControl,
  schemaEventSearch,
  schemaEventList,
  schemaEventNearby
};