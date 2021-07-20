const schemaSocialPost = {
  schema: {
    tags: ['動態相關'],
    description: '貼文',
    summary: '...',
    security: [
      {
        Bearer: []
      }
    ],
    body: {
      type: 'object',
      // required: ['message', 'uid', 'fileType'],
      // properties: {
      //   fileType: { type: 'number', description: '附件類型, 1=照片, 2=YT影片連結' },
      //   message: { type: 'string', description: '貼文訊息' },
      //   photos: { description: '照片圖檔' },
      //   uid: { type: 'number', description: '用戶Id' },
      //   ytlink: { type: 'string', description: 'YouTube連結' }
      // }
    },
    response: {
      '2xx': {
        type: 'object',
        properties: {
          code: { type: 'number', description: '錯誤代碼,0:正常,-1:失敗' },
          message: { type: 'string', description: '說明訊息' },
          post: { type: 'object', properties: {
            attachment: { type: 'object', properties: {
              fileType: { type: 'number', description: '附件類型, 1=照片, 2=YT影片連結' },
              data: { type: 'array', items: { type: 'object', properties: {
                dateline: { type: 'number', description: '建立時間' },
                fileType: { type: 'number', description: '附件類型, 1=照片, 2=YT影片連結' },
                id: { type: 'number', description: '照片id' },
                pid: { type: 'number', description: '貼文id' },
                resPath: { type: 'string', description: '附件內容, 照片路徑 or YT影片連結' }
              } } }
            } },
            author: { type: 'string', description: '用戶名稱' },
            authorAvatar: { type: 'string', description: '用戶頭像' },
            authorid: { type: 'number', description: '用戶id' },
            commentCount: { type: 'number', description: '留言總數' },
            comments: { type: 'array', items: {
              type: 'object',
              properties: {
                comment: { type: 'string', description: '用戶留言內容' },
                dateline: { type: 'number', description: '留言時間' },
                uid: { type: 'number', description: '留言用戶id' },
                username: { type: 'string', description: '留言用戶名稱' },
                avatar: { type: 'string', description: '留言用戶頭像' }
              }
            }},
            coverImg: { type: 'string', description: '貼文封面圖' },
            fid: { type: 'number', description: '論壇版塊id' },
            isLike: { type: 'number', description: '用戶是否有點讚(1:是/0:否)' },
            isShare: { type: 'number', description: '用戶是否有分享(1:是/0:否)' },
            lastpost: { type: 'number', description: '貼文最發表時間' },
            likeCount: { type: 'number', description: '貼文點讚總數' },
            message: { type: 'string', description: '貼文內容' },
            postType: { type: 'string', description: 'PO文來源,t=論壇貼文, p=動態牆貼文' },
            shareCount: { type: 'number', description: '貼文分享讚總數' },
            subject: { type: 'string', description: '貼文標題' },
            tagList: { type: 'array', items: { type: 'string', description: '標籤名稱' } },
            tags: { type: 'string', description: '所有標籤字串' },
            threadUrl: { type: 'string', description: '論壇貼文連結' },
            tid: { type: 'number', description: '論壇貼文id' }
          } },
          result: { type: 'boolean', description: '執行結果,true=成功,false=失敗' }
        }
      }
    }
  }
};

const schemaSocialPostUpdate = {
  schema: {
    tags: ['動態相關'],
    description: '更新貼文',
    summary: '...',
    security: [
      {
        Bearer: []
      }
    ],
    body: {
      type: 'object',
      // required: ['message'],
      // properties: {
      //   message: { type: 'string', description: '貼文訊息' },
      //   photos: { type: 'array', items: { type: 'object', properties: {} }, description: '照片圖檔' },
      //   uid: { type: 'number', description: '用戶Id' },
      //   fileType: { type: 'number', description: '附件類型, 1=照片, 2=YT影片連結' },
      //   ytlink: { type: 'string', description: 'YouTube連結' }
      // }
    },
    response: {
      '2xx': {
        type: 'object',
        properties: {
          code: { type: 'number', description: '錯誤代碼,0:正常,-1:失敗' },
          message: { type: 'string', description: '說明訊息' },
          post: { type: 'object', properties: {
            attachment: { type: 'object', properties: {
              fileType: { type: 'number', description: '附件類型, 1=照片, 2=YT影片連結' },
              data: { type: 'array', items: { type: 'object', properties: {
                dateline: { type: 'number', description: '建立時間' },
                fileType: { type: 'number', description: '附件類型, 1=照片, 2=YT影片連結' },
                id: { type: 'number', description: '照片id' },
                pid: { type: 'number', description: '貼文id' },
                resPath: { type: 'string', description: '附件內容, 照片路徑 or YT影片連結' }
              } } }
            } },
            author: { type: 'string', description: '用戶名稱' },
            authorAvatar: { type: 'string', description: '用戶頭像' },
            authorid: { type: 'number', description: '用戶id' },
            commentCount: { type: 'number', description: '留言總數' },
            comments: { type: 'array', items: {
              type: 'object',
              properties: {
                comment: { type: 'string', description: '用戶留言內容' },
                dateline: { type: 'number', description: '留言時間' },
                uid: { type: 'number', description: '留言用戶id' },
                username: { type: 'string', description: '留言用戶名稱' },
                avatar: { type: 'string', description: '留言用戶頭像' }
              }
            }},
            coverImg: { type: 'string', description: '貼文封面圖' },
            fid: { type: 'number', description: '論壇版塊id' },
            isLike: { type: 'number', description: '用戶是否有點讚(1:是/0:否)' },
            isShare: { type: 'number', description: '用戶是否有分享(1:是/0:否)' },
            lastpost: { type: 'number', description: '貼文最發表時間' },
            likeCount: { type: 'number', description: '貼文點讚總數' },
            message: { type: 'string', description: '貼文內容' },
            postType: { type: 'string', description: 'PO文來源,t=論壇貼文, p=動態牆貼文' },
            shareCount: { type: 'number', description: '貼文分享讚總數' },
            subject: { type: 'string', description: '貼文標題' },
            tagList: { type: 'array', items: { type: 'string', description: '標籤名稱' } },
            tags: { type: 'string', description: '所有標籤字串' },
            threadUrl: { type: 'string', description: '論壇貼文連結' },
            tid: { type: 'number', description: '論壇貼文id' }
          } },
          result: { type: 'boolean', description: '執行結果,true=成功,false=失敗' }
        }
      }
    }
  }
};

const schemaSocialPostDelete = {
  schema: {
    tags: ['動態相關'],
    description: '刪除貼文',
    summary: '...',
    security: [
      {
        Bearer: []
      }
    ],
    body: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'number', description: '貼文Id' }
      }
    },
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

const schemaSocialLike = {
  schema: {
    tags: ['動態相關'],
    description: '按讚',
    summary: '...',
    security: [
      {
        Bearer: []
      }
    ],
    body: {
      type: 'object',
      required: ['linkId', 'uid', 'isLike', 'postType'],
      properties: {
        linkId: { type: 'number', description: 'PO文Id' },
        uid: { type: 'number', description: '用戶Id' },
        isLike: { type: 'number', description: '按讚/取消讚,1=讚,-1=倒讚' },
        postType: { type: 'string', description: 'PO文來源,t=論壇貼文, p=動態牆貼文' }
      }
    },
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

const schemaSocialComment = {
  schema: {
    tags: ['動態相關'],
    description: '留言',
    summary: '...',
    security: [
      {
        Bearer: []
      }
    ],
    body: {
      type: 'object',
      required: ['linkId', 'uid', 'comment', 'postType'],
      properties: {
        linkId: { type: 'number', description: 'PO文Id' },
        uid: { type: 'number', description: '用戶Id' },
        comment: { type: 'string', description: '用戶Id' },
        postType: { type: 'string', description: 'PO文來源,t=論壇貼文, p=動態牆貼文' }
      }
    },
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

const schemaSocialBannerPost = {
  schema: {
    tags: ['動態相關'],
    description: '新增Banner',
    summary: '...',
    security: [
      {
        Bearer: []
      }
    ],
    body: {
      type: 'object',
      // required: ['photos'],
      // properties: {
      //   uid: { type: 'string', description: '用戶Id' },
      //   link: { type: 'string', description: '連結' },
      //   photos: { type: 'array', items: { type: 'object', properties: {} }, description: '照片圖檔' },
      //   start_date:{ type: 'string', description: '啟用日期'},
      //   end_date:{ type: 'string', description: '過期日期'}
      // }
    },
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

const schemaSocialGetPhotos = {
  schema: {
    tags: ['動態相關'],
    description: '取個人相片',
    summary: '...',
    security: [
      {
        Bearer: []
      }
    ],
    params: {
      type: 'object',
      required: ['uid'],
      properties: {
        uid: { type: 'number', description: '用戶Id' }
      }
    },
    response: {
      '2xx': {
        type: 'object',
        properties: {
          code: { type: 'number', description: '錯誤代碼,0:正常,-1:失敗' },
          message: { type: 'string', description: '說明訊息' },
          photos: { type: 'array', items: { type: 'object', properties: {
            dateline: { type: 'number', description: '建立時間' },
            id: { type: 'number', description: '流水序號' },
            resPath: { type: 'string', description: '照片路徑' }
          } } },
          result: { type: 'boolean', description: '執行結果' }
        }
      }
    }
  }
};

const schemaSocialBannerGet = {
  schema: {
    tags: ['動態相關'],
    description: '取得Banner列表',
    summary: '...',
    security: [
      {
        Bearer: []
      }
    ],
    response: {
      '2xx': {
        type: 'object',
        properties: {
          code: { type: 'number', description: '錯誤代碼,0:正常,-1:失敗' },
          message: { type: 'string', description: '說明訊息' },
          banner: { type: 'array', items: { type: 'object', properties: {
            end_date: { type: 'number', description: '到期時間戳章' },
            link: { type: 'string', description: '點擊連結' },
            path: { type: 'string', description: '圖片路徑' },
            start_date: { type: 'number', description: '啟用時間戳章' }
          } } },
          result: { type: 'boolean', description: '執行結果' }
        }
      }
    }
  }
};

module.exports = {
  schemaSocialPost,
  schemaSocialPostUpdate,
  schemaSocialPostDelete,
  schemaSocialLike,
  schemaSocialComment,
  schemaSocialBannerPost,
  schemaSocialBannerGet,
  schemaSocialGetPhotos
};