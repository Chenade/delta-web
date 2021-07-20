const prisma = require('../../instances/prisma');
const axios = require("axios");
const boom = require("@hapi/boom");
const json = require('json-keys-sort'); 
const fs = require('fs');
const { nanoid } = require('nanoid');
const sharp = require('sharp');
const { sort } = require('../../routes');

axios.defaults.headers.common["Content-Type"] = "application/json";

exports.postLike = async (req, reply) => {
  try {
    let ts = Math.floor(Date.now() / 1000);

    let returnResult = {
        result: true,
        code: 0,
        message: '',
    };

    // get post data
    const _linkId = req.body.linkId;
    const _uid = req.body.uid;
    const _isLike = req.body.isLike;
    const _postType = req.body.postType;

    const like = await prisma.social_posts_like.create({
        data: {
            linkId: _linkId,
            uid: _uid,
            isLike: _isLike,
            postType: _postType,
            dateline: ts
        }
    })

    reply.send(returnResult);

  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.postComment = async (req, reply) => {
  try {
    let ts = Math.floor(Date.now() / 1000);

    let returnResult = {
        result: true,
        code: 0,
        message: '',
    };

    // get post data
    const _linkId = req.body.linkId;
    const _uid = req.body.uid;
    const _comment = req.body.comment;
    const _postType = req.body.postType;

    const comment = await prisma.social_posts_comment.create({
        data: {
            linkId: _linkId,
            uid: _uid,
            comment: _comment,
            postType: _postType,
            dateline: ts
        }
    })
    // console.log(comment);

    reply.send(returnResult);

  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.postMessage = async (req, reply) => {
  try {
    const returnResult = {
      result: true,
      code: 0,
      message: '',
    };

    // 所有圖檔
    const imgFiles = await req.body.photos;

    // 所有表單欄位
    const input = Object.fromEntries(Object.keys(req.body).map((key) => [key, req.body[key].value]));

    const _uid = parseInt(input.uid, 10);
    const _fileType = parseInt(input.fileType, 10);  // 1=照片, 2=YT連結
    const _ytlink = input.ytlink;
    const _message = input.message;
    const _ts = Math.floor(Date.now() / 1000);

    // 先寫入 post 取 pid
    const post = await prisma.social_posts.create({
      data: {
        postType: 'p',
        uid: _uid,
        message: _message,
        dateline: _ts
      }
    });

    post.attachment = {
      fileType: _fileType
    };

    const _pid = post.id;

    const _datas = [];
    const d = new Date();
    let _yearAndMonth = d.getFullYear().toString() + (d.getMonth() + 1).toString().padStart(2, '0');
    let _day = d.getDate().toString().padStart(2, '0');
    let _savePath = process.env.PHOTO_SYSTEM_PATH + '/' + _yearAndMonth + '/' + _day;
    let _webPath = process.env.PHOTO_PATH + '/' + _yearAndMonth + '/' + _day;

    // 路徑目錄建立
    await fs.mkdirSync(_savePath, { recursive: true });

    let count = 0;
    if (_fileType === 1) {
      if (Array.isArray(imgFiles)) count = imgFiles.length;

      for (let idx = 0; idx < count; idx++) {
        const _file = (count > 1) ? imgFiles[idx] : imgFiles ;
        let _ext = _file.filename.replace(/^.+\./, '.').toLowerCase();
        let _fileName = _uid + nanoid(16) + _ext;
        let _savePathAndName = _savePath + '/' + _fileName;
        
        // 調整大小
        let _resizeWidth = (process.env.PHOTO_RESIZE_WIDTH) ? parseInt(process.env.PHOTO_RESIZE_WIDTH, 10) : 1024;
        let _reSize = await sharp(_file._buf).resize({ width: _resizeWidth, withoutEnlargement: true }).toBuffer();

        fs.writeFileSync(_savePathAndName, await _reSize);
  
        let _webPathAndName = _webPath + '/' + _fileName;
        _datas.push({
          pid: _pid,
          fileType: _fileType,
          resPath: _webPathAndName,
          dateline: _ts
        });
      }
      
    } else {
      // check youtube is embed link
      const getYtCode = function(ytlink) {
        let code = '';
    
        let reg1 = /https?:\/\/www\.youtube\.com\/watch\?v\=(\w+)/;
        let match1 = ytlink.match(reg1);
    
        if (match1) {
            code = match1[1];
            return code;
        }
    
        let reg2 = /https?:\/\/youtu\.be\/(\w+)/;
        let match2 = ytlink.match(reg2);
    
        if (match2) {
            code = match2[1];
            return code;
        }
    
        let reg3 = /https?:\/\/www\.youtube\.com\/embed\/(\w+)/;
        let match3 = ytlink.match(reg3);
    
        if (match3) {
            code = match3[1];
            return code;
        }
    
        return code;
      };
      if (_ytlink !== '') {
        let _ytCode = getYtCode(_ytlink);
        let _embedLink = `https://www.youtube.com/embed/${_ytCode}`
  
        _datas.push({
          pid: _pid,
          fileType: _fileType,
          resPath: _embedLink,
          dateline: _ts
        });
      }
      
    }

    if (count > 0 || _ytlink !== '') {
      const att = await prisma.social_posts_attachment.createMany({ data: _datas });
  
      if (att.count > 0) {
        const _attachmentData = await prisma.social_posts_attachment.findMany({
          where: {
            pid: _pid,
            del: false
          },
          select: {
            id: true,
            pid: true,
            fileType: true,
            resPath: true,
            dateline: true
          }
        });
  
        post.attachment.data = _attachmentData;
  
      } else {
        post.attachment.data = [];
      }
    }

    returnResult.post = post;

    const userProfile = await prisma.wav_common_member_profile.findUnique({
      where: {
        uid: _uid
      },
      select: {
        realName: true
      }
    });

    let _realName = userProfile.realName;

    returnResult.post.author = _realName;
    returnResult.post.authorAvatar = `/uc_server/avatar.php?uid=${_uid}&size=middle`;
    returnResult.post.authorid = _uid;
    returnResult.post.commentCount = 0;
    returnResult.post.comments = [];
    returnResult.post.coverImg = '';
    returnResult.post.fid = 0;
    returnResult.post.isLike = 0;
    returnResult.post.isShare = 0;
    returnResult.post.lastpost = _ts;
    returnResult.post.shareCount = 0;
    returnResult.post.subject = '';
    returnResult.post.tagList = [];
    returnResult.post.tags = '';
    returnResult.post.threadUrl = '';
    returnResult.post.tid = post.id;
    
    delete returnResult.post['uid'];
    delete returnResult.post['id'];
    delete returnResult.post['dateline'];
    
    reply.send(json.sort(returnResult));
  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.updateMessage = async (req, reply) => {
  try {
    const returnResult = {
      result: true,
      code: 0,
      message: '',
    };

    // 所有圖檔
    const imgFiles = await req.body.photos;

    // 所有表單欄位
    const input = Object.fromEntries(Object.keys(req.body).map((key) => [key, req.body[key].value]));

    const _pid = parseInt(input.pid, 10);
    const _uid = parseInt(input.uid, 10);
    const _fileType = parseInt(input.fileType, 10);  // 1=照片, 2=YT連結
    const _ytlink = input.ytlink;
    const _message = input.message;
    const _ts = Math.floor(Date.now() / 1000);

    // 修改update del = 1
    const _post = await prisma.social_posts.update({
      where: {
        id: _pid
      },
      data: {
        message: _message,
        dateline: _ts
      }
    });

    _post.attachment = {
      fileType: _fileType
    };

    const _datas = [];
    const d = new Date();
    let _yearAndMonth = d.getFullYear().toString() + (d.getMonth() + 1).toString().padStart(2, '0');
    let _day = d.getDate().toString().padStart(2, '0');
    let _savePath = process.env.PHOTO_SYSTEM_PATH + '/' + _yearAndMonth + '/' + _day;
    let _webPath = process.env.PHOTO_PATH + '/' + _yearAndMonth + '/' + _day;

    // 路徑目錄建立
    await fs.mkdirSync(_savePath, { recursive: true });

    let count = 0;
    if (_fileType === 1) {
      if (Array.isArray(imgFiles)) count = imgFiles.length;

      for (let idx = 0; idx < count; idx++) {
        const _file = (count > 1) ? imgFiles[idx] : imgFiles ;
        let _ext = _file.filename.replace(/^.+\./, '.').toLowerCase();
        let _fileName = _uid + nanoid(16) + _ext;
        let _savePathAndName = _savePath + '/' + _fileName;
        
        // 調整大小
        let _resizeWidth = (process.env.PHOTO_RESIZE_WIDTH) ? parseInt(process.env.PHOTO_RESIZE_WIDTH, 10) : 1024;
        let _reSize = await sharp(_file._buf).resize({ width: _resizeWidth, withoutEnlargement: true }).toBuffer();

        fs.writeFileSync(_savePathAndName, await _reSize);
  
        let _webPathAndName = _webPath + '/' + _fileName;
        _datas.push({
          pid: _pid,
          fileType: _fileType,
          resPath: _webPathAndName,
          dateline: _ts
        });
      }
      
    } else {
      // check youtube is embed link
      const getYtCode = function(ytlink) {
        let code = '';
    
        let reg1 = /https?:\/\/www\.youtube\.com\/watch\?v\=(\w+)/;
        let match1 = ytlink.match(reg1);
    
        if (match1) {
            code = match1[1];
            return code;
        }
    
        let reg2 = /https?:\/\/youtu\.be\/(\w+)/;
        let match2 = ytlink.match(reg2);
    
        if (match2) {
            code = match2[1];
            return code;
        }
    
        let reg3 = /https?:\/\/www\.youtube\.com\/embed\/(\w+)/;
        let match3 = ytlink.match(reg3);
    
        if (match3) {
            code = match3[1];
            return code;
        }
    
        return code;
      };
      if (_ytlink !== '') {
        let _ytCode = getYtCode(_ytlink);
        let _embedLink = `https://www.youtube.com/embed/${_ytCode}`
  
        _datas.push({
          pid: _pid,
          fileType: _fileType,
          resPath: _embedLink,
          dateline: _ts
        });
      }
      
    }

    if (count > 0 || _ytlink !== '') {
      // 標記刪除之前上傳的記錄
      const delBefore = await prisma.social_posts_attachment.updateMany({
        where: {
          pid: _pid
        }, data: {
          del: true
        }
      });

      const att = await prisma.social_posts_attachment.createMany({ data: _datas });
      if (att.count > 0) {
        const _attachmentData = await prisma.social_posts_attachment.findMany({
          where: {
            pid: _pid,
            del: false
          },
          select: {
            id: true,
            pid: true,
            fileType: true,
            resPath: true,
            dateline: true
          }
        });
  
        _post.attachment.data = _attachmentData;
  
      } else {
        _post.attachment.data = [];
      }
    }

    returnResult.post = _post;

    const userProfile = await prisma.wav_common_member_profile.findUnique({
      where: {
        uid: _uid
      },
      select: {
        realName: true
      }
    });

    let _realName = userProfile.realName;

    returnResult.post.author = _realName;
    returnResult.post.authorAvatar = `/uc_server/avatar.php?uid=${_uid}&size=middle`;
    returnResult.post.authorid = _uid;
    returnResult.post.commentCount = 0;
    returnResult.post.comments = [];
    returnResult.post.coverImg = '';
    returnResult.post.fid = 0;
    returnResult.post.isLike = 0;
    returnResult.post.isShare = 0;
    returnResult.post.lastpost = _ts;
    returnResult.post.shareCount = 0;
    returnResult.post.subject = '';
    returnResult.post.tagList = [];
    returnResult.post.tags = '';
    returnResult.post.threadUrl = '';
    returnResult.post.tid = _pid;
    
    delete returnResult.post['uid'];
    delete returnResult.post['id'];
    delete returnResult.post['dateline'];
    
    reply.send(json.sort(returnResult));
  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.delMessage = async (req, reply) => {
  try {
    let returnResult = {
      result: false,
      code: -1,
      message: '',
    };

    const _id = req.body.id;
    const _ts = Math.floor(Date.now() / 1000);

    // 標記刪除貼文 & 標記刪除附件
    const [_posts, _attachment] = await prisma.$transaction([
      prisma.social_posts.updateMany({
        where: {
          id: _id
        },
        data: {
          del: true
        }
      }),
      prisma.social_posts_attachment.updateMany({
        where: {
          pid: _id
        }, data: {
          del: true,
          dateline: _ts
        }
      })
    ]);

    if (_posts.count > 0) {
      returnResult.result = true;
      returnResult.code = 0;
    }

    reply.send(json.sort(returnResult));

  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.getPhotos = async (req, reply) => {
  try {
    const returnResult = {
      result: false,
      code: -1,
      message: '',
      photos: []
    };

    const _uid = parseInt(req.params.uid, 10);

    const _post = await prisma.social_posts.findMany({
      where: {
        uid: _uid,
        del: false,
        postType: 'p'
      },
      select: {
        id: true
      }
    });

    if (_post.length === 0) {
      returnResult.message = '無貼文';
      return json.sort(returnResult);
    }
    
    const _pidArr = _post.map(function(item, idx, arr) {
      return item.id;
    });
  
    const _attach = await prisma.social_posts_attachment.findMany({
      orderBy: [
        { dateline: 'desc' },
        { id: 'desc' }
      ],
      where: {
        pid: {
          in: _pidArr
        },
        fileType: 1,
        del: false
      },
      select: {
        id: true,
        resPath: true,
        dateline: true
      }
    });

    if (_attach.length === 0) {
      returnResult.message = '無照片';
      returnResult.code = -2;
      return json.sort(returnResult);
    }

    returnResult.code = 0;
    returnResult.result = true;
    returnResult.photos = _attach;

    reply.send(json.sort(returnResult));
  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.postBanner = async (req, reply) => {
  try {
    let returnResult = {
      result: true,
      code: 0,
      message: '',
    };

    // 所有圖檔
    const imgFiles = await req.body.photos;

    // 所有表單欄位
    const input = Object.fromEntries(Object.keys(req.body).map((key) => [key, req.body[key].value]));

    const _uid = parseInt(input.uid, 10);
    const _link = input.link
    const _start_date = parseInt(input.start_date, 10);
    const _end_date = parseInt(input.end_date, 10) || 0;
    const _ts = Math.floor(Date.now() / 1000);

    const d = new Date();
    let _yearAndMonth = d.getFullYear().toString() + (d.getMonth() + 1).toString().padStart(2, '0');
    let _day = d.getDate().toString().padStart(2, '0');
    let _savePath = process.env.BANNER_SYSTEM_PATH + '/' + _yearAndMonth + '/' + _day;
    let _webPath = process.env.BANNER_PATH + '/' + _yearAndMonth + '/' + _day;

    // 路徑目錄建立
    await fs.mkdirSync(_savePath, { recursive: true });

    const _file = imgFiles ;
    let _ext = _file.filename.replace(/^.+\./, '.').toLowerCase();
    let _fileName = nanoid(16) + _ext;
    let _savePathAndName = _savePath + '/' + _fileName;
    
    // 調整大小
    let _resizeWidth = (process.env.BANNER_RESIZE_WIDTH) ? parseInt(process.env.BANNER_RESIZE_WIDTH, 10) : 2048;
    let _reSize = await sharp(_file._buf).resize({ width: _resizeWidth, withoutEnlargement: true }).toBuffer();

    fs.writeFileSync(_savePathAndName, await _reSize);

    let _webPathAndName = _webPath + '/' + _fileName;

    const banner = await prisma.social_posts_banner.create({
      data: {
        uid: _uid,
        path:_webPathAndName,
        link:_link,
        start_date: _start_date,
        end_date: _end_date,
        dateline: _ts
      }
    });

    reply.send(returnResult);
  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.getBanner = async (req, reply) => {
  try {
    const returnResult = {
      result: true,
      code: 0,
      message: '',
      banner: []
    };

    const _ts = Math.floor(Date.now() / 1000);
    const _banner = await prisma.social_posts_banner.findMany({
      where:{
        AND: [
          { start_date: { lt: _ts } },
          {
            OR:[
              { end_date:{ gt: _ts }},
              { end_date:{ equals: 0 }},
              { end_date: null }
            ]
          }
        ]
      },
      select:{
        path:true,
        link: true,
        start_date: true,
        end_date: true
      },
      orderBy:{
        start_date:'asc'
      }
    });

    returnResult.banner = _banner;

    reply.send(json.sort(returnResult));
  } catch (err) {
    throw boom.boomify(err);
  }
};
