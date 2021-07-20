const schemaUserLogin = {
  schema: {
    tags: ['用戶相關'],
    description: '用戶登入',
    summary: '...',
    body: {
      type: 'object',
      required: ['password', 'username', 'ip'],
      properties: {
        username: { type: 'string', description: '用戶帳號' },
        password: { type: 'string', description: '用戶密碼' },
        ip: { type: 'string', default: '127.0.0.1', description: '用戶來源IP' },
      }
    },
    response: {
      '2xx': {
        type: 'object',
        properties: {
          error: { type: 'string', description: '' },
          message: { type: 'string', description: '' },
          token: { type: 'string', description: 'JWT token(登入失敗回傳空值)' },
        }
      }
    }
  }
};

const schemaUserLogout = {
  schema: {
    tags: ['用戶相關'],
    description: '用戶登出',
    summary: '...',
    response: {
      '2xx': {
        type: 'object',
        properties: {
          code: { type: 'number', description: '錯誤代碼,0:正常,-1:失敗' },
          message: { type: 'string', description: '說明訊息' },
          result: { type: 'boolean', description: '執行結果' }
        }
      }
    }
  }
};

const schemaUserRegister = {
  schema: {
    tags: ['用戶相關'],
    description: '註冊新用戶',
    summary: '...',
    body: {
      type: 'object',
      required: ['username','account', 'password'],
      properties: {
        uid: { type: 'string', description: '用戶ID' },
        username: { type: 'string', description: '用戶名稱' },
        account: { type: 'string', description: '用戶帳號 (Email)' },
        password: { type: 'string', description: '用戶密碼' },
        authority: { type: 'number', description: '用戶權限', default: 0 },
        realname: { type: 'string', description: '用戶真實姓名' },
        mobile: { type: 'string', description: '用戶手機號碼' },
        tel: { type: 'string', description: '用戶電話' },
        email: { type: 'string', description: '用戶EMAIL'},
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
          member: { type: 'object',properties: {
            uid: { type: 'string', description: '用戶ID' },
            account: { type: 'string', description: '帳號(EMAIL)' },
            username: { type: 'string', description: '用戶名稱' },
            authority: { type: 'number', description: '用戶權限' },
            emergency: { type: 'object',properties: {
              id: { type: 'string', description: '緊急聯絡人ID' },
              name: { type: 'string', description: '緊急聯絡人名稱' },
              contact: { type: 'string', description: '緊急聯絡人聯絡方式' },
            }}              
          }}
        }
      }
    }
  }
};


const schemaUserRegisterCheck = {
  schema: {
    tags: ['用戶相關'],
    description: '撿查新用戶ID',
    summary: '...',
    params:{
      uid: { type: 'string', description: '用戶ID' },
    },
    response: {
      '2xx': {
        type: 'object',
        properties: {
        }
      }
    }
  }
};

const schemaUserControl = {
  schema: {
    get: {
      tags: ['用戶相關'],
      description: '取得用戶資訊',
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
      response: {
        '2xx': {
          type: 'object',
          properties: {
            error: { type: 'string', description: '' },
            message: { type: 'string', description: '' },
            member: { type: 'object',properties: {
              uid: { type: 'string', description: '用戶ID' },
              account: { type: 'string', description: '帳號(EMAIL)' },
              username: { type: 'string', description: '用戶名稱' },
              authority: { type: 'number', description: '用戶權限' },
              detail: { type: 'object',properties: {
                realname: { type: 'string', description: '設備數量' },
                tel: { type: 'string', description: '設備數量' },
                mobile: { type: 'string', description: '設備數量' },
                email: { type: 'string', description: '設備數量' },
              }},
              data: { type: 'object',properties: {
                remain: { type: 'number', description: '當月剩餘次數' },
                help: { type: 'number', description: '授權影片次數' },
                request: { type: 'number', description: '請求授權次數' },
              }},
              emergency: { type: 'object',properties: {
                id: { type: 'string', description: '緊急聯絡人ID' },
                name: { type: 'string', description: '緊急聯絡人名稱' },
                contact: { type: 'string', description: '緊急聯絡人聯絡方式' },
              }}              
            }}
          }
        }
      }
    },
    put:{
      tags: ['用戶相關'],
      description: '更新用戶資訊',
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
          realname: { type: 'string', description: '用戶權限' },
          mobile: { type: 'string', description: '用戶權限' },
          tel: { type: 'string', description: '用戶權限' },
          email: { type: 'string', description: '用戶權限' },
          password: { type: 'string', description: '用戶權限' },
          emergencyId: { type: 'string', description: '用戶權限' },
          emergencyName: { type: 'string', description: '用戶權限' },
          emergencyContact: { type: 'string', description: '用戶權限' },
        }
      },
      response: {
        '2xx': {
          type: 'object',
          properties: {
            error: { type: 'string', description: '' }
          }
        }
      }
    }
  }
};

module.exports = {
  schemaUserLogin,
  schemaUserLogout,
  schemaUserRegister,
  schemaUserRegisterCheck,
  schemaUserControl,
};