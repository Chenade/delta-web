const crypto = require('crypto');
const prisma = require('../../instances/prisma');
const axios = require("axios");
const https = require("https");
const boom = require("@hapi/boom");
const json = require('json-keys-sort'); 
const userUtility = require("../../functions/UserUtility");
const UserUtility = require('../../functions/UserUtility');

axios.defaults.headers.common["Content-Type"] = "application/json";

exports.getStatus = async (req, reply) => {
  try {
    // 用 jwt 取出用戶資料
    const _uid = parseInt(req.user.uid, 10);
    const _username = req.user.username;
    const _email = req.user.email;

    const user = await prisma.wav_common_member.findUnique({
      where: {
        uId: _uid
      },
      select: {
        uId: true,
        userName: true,
        email: true,
        groupId: true,
        profile: {
          select: {
            realName: true,
            info: true
          }
        }
      }
    });

    delete user.profile['info'];
    delete user['groupId'];
    user.avatar = `/uc_server/avatar.php?uid=${_uid}&size=middle`;
    user.result = true;
    reply.send(user);
    // 用cookie去mdk論壇取回
    // const CookieValues = req.cookies;
    // let cookieStr = '';
    // for (const key in CookieValues) {
    //   if (Object.hasOwnProperty.call(CookieValues, key)) {
    //     cookieStr += key + "=" + CookieValues[key] + ";";
    //   }
    // }
    // const options = {};
    // // do this in development
    // if (process.env.NODE_ENV == 'development') {
    //   const agent = new https.Agent({  
    //     rejectUnauthorized: false
    //   });
    //   options.httpsAgent = agent;
    // }
    // options.headers = {
    //   Cookie: cookieStr
    // };
    // let phpApiUrl = 'https://my.mdkforum.com/api.php?mod=login&do=status';
    // const res = await axios.get(phpApiUrl, options);
    
    // reply.send(res.data);

  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.postLogin = async (req, reply) => {
  try {
    const returnResult = {
      result: false,
      code: 0,
      message: '',
      member: null
    };
    
    // get post data
    const _GrToken = req.body['g-recaptcha-response'];
    const _clientIp = req.body.ip;
    const _loginfield = req.body.loginfield;
    const _username = req.body.username;
    const _password = req.body.password;
    const _questionid = req.body.questionid;
    const _answer = req.body.answer;
    
    // Google reCAPTCHA v2
    if (process.env.GOOGLE_RE_VALIDATE == 1) {
      const recaptcha_url = "https://www.google.com/recaptcha/api/siteverify";
      let payload = {
        secret: process.env.GOOGLE_RE_SEC,
        response: _GrToken,
        remoteip: _clientIp
      };
      let u = new URLSearchParams(payload).toString();
      const GreRespose = await axios.post(recaptcha_url + '?' + u);
  
      // Google reCAPTCHA validate fail
      if (!GreRespose.data.success) {
        returnResult.code = -1;
      }
      
    }

    if (returnResult.code == 0) {
      // call php api
      let phpApiUrl = process.env.FORUM_URL + '/api.php?mod=login&do=signin';
      
      const options = {};
      
      // do this in development
      if (process.env.NODE_ENV == 'development') {
        const agent = new https.Agent({  
          rejectUnauthorized: false
        });
        options.httpsAgent = agent;
      }

      payload = {
        loginfield: _loginfield,
        username: _username,
        password: _password,
        questionid: _questionid,
        answer: _answer,
        ip: _clientIp
      };
      
      // call mdk php
      const res = await axios.post(phpApiUrl, payload, options);

      // return res.data;

      if (res.data.status == 1) {
        // 登入成功

        // Set Cookie
        let setCookies = res.headers["set-cookie"];
        setCookies.forEach(item => {
          reply.header('set-cookie', item);
        });

        const tokenPayload = {
          uid: res.data.member.uid,
          username: res.data.member.username,
          email: res.data.member.email
        };

        const jwtToken = req.fastify.jwt.sign(tokenPayload, {
          expiresIn: process.env.JWT_EXPIRY
        });

        // format return object
        returnResult.result = true;
        const _uid = parseInt(res.data.member.uid, 10);
        const _username = res.data.member.username;
        const _email = res.data.member.email;

        // get realName
        const user = await prisma.wav_common_member.findUnique({
          where: {
            uId: _uid
          },
          select: {
            uId: true,
            userName: true,
            groupId: true,
            profile: {
              select: {
                realName: true,
                info: true
              }
            }
          }
        });
        const _realName = user.profile.realName;
        
        returnResult.member = {
          avatar: `/uc_server/avatar.php?uid=${_uid}&size=middle`,
          uId: _uid,
          userName: _username,
          password: '',
          profile: {
            realName: _realName,
          },
          email: _email,
          token: jwtToken
          // TODO: 看還要添加什麼資料
        };

      } else {
        // 登入失敗
        returnResult.code = -2;
      }
    }

    // Error Return Object Format
    if (returnResult.code < 0) {
      let _err = returnResult.code;

      returnResult.member = {
        avatar: '',
        uId: (_err == -2) ? res.data.ucresult.uid : 0,
        userName: (_err == -2) ? res.data.ucresult.username: '',
        profile: {
          realName: '',
        },
        password: (_err == -2) ? res.data.ucresult.password : '',
        email: (_err == -2) ? res.data.ucresult.email : '',
        token: ''
      };
    }


    let jsonStr = json.sort(returnResult);
    reply.send(jsonStr);
  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.getLogout = async (req, reply) => {
  try {
    let returnResult = {
      result: false,
      code: 0,
      message: ''
    };
    
    const options = {};
    
    // do this in development
    if (process.env.NODE_ENV == 'development') {
      const agent = new https.Agent({  
        rejectUnauthorized: false
      });
      options.httpsAgent = agent;
    }

    let phpApiUrl = process.env.FORUM_URL + '/api.php?mod=login&do=logout';
    const res = await axios.get(phpApiUrl, options);
    
    if (res.data.status == 1) {
      returnResult.result = true;
    }

    reply.send(returnResult);

  } catch (err) {
    throw boom.boomify(err);
  }
};

// 取個人資料 /node/social/user/:uid
exports.getUserData = async (req, reply) => {
  try {
    // 用戶uid
    const _uid = parseInt(req.params.uid, 10);

    // 取用戶資料 & 設定給所有用戶的fid集合
    const [user, set] = await prisma.$transaction([
      prisma.wav_common_member.findUnique({
        where: {
          uId: _uid
        },
        select: {
          uId: true,
          userName: true,
          groupId: true,
          profile: {
            select: {
              realName: true,
              info: true,
              fb: true,
              ig: true
            }
          }
        }
      }),
      prisma.social_newest_posts.findMany({
        where: {
          postType: 1,
          del: false
        },
        select: {
          fid: true
        }
      })
    ]);

    // 頭像
    user.authorAvatar = `/uc_server/avatar.php?uid=${_uid}&size=middle`;

    const userGroup = await prisma.wav_common_usergroup.findUnique({
      where: {
        groupid: user.groupId
      },
      select: {
        grouptitle: true
      }
    });

    user.groupName = userGroup.grouptitle;

    // 判斷是否有參加投票 & 取投票資訊 & 排名 & 票數
    user.voteInfo = await userUtility.getUserVoteInfo(_uid);

    // 取論壇來帶有用戶名稱標籤的貼文
    let fidArray = set.map(function(v, i, a) {
      return v.fid;
    });

    let _username = user.userName;
    let _realname = user.profile.realName;
    let sql_tags = (_realname) ? `OR INSTR(fp.tags, '${_realname}') > 0` : '';
    let _sql = `
      SELECT COUNT(1) AS count
      FROM   wav_forum_thread AS t
          INNER JOIN(
              SELECT p.tid,
                     p.authorid,
                     p.tags
              FROM   wav_forum_post AS p
          ) AS fp ON t.tid = fp.tid
      WHERE t.fid IN(${fidArray.join(',')})
          AND t.displayorder IN('0', '1', '2', '3', '4')
          AND t.cover > 0
          AND(
              INSTR(fp.tags, '${_username}') > 0
              ${sql_tags}
          )
      ORDER BY t.displayorder DESC, t.lastpost DESC
      LIMIT 0, 8;
    `;

    // 相關貼文總數字(來源:論壇 / 個人貼文)
    const [_threads, _posts] = await prisma.$transaction([
      prisma.$queryRaw(_sql),
      prisma.social_posts.count({
        where: {
          uid: _uid,
          del: false
        }
      })
    ]);
    user.feeds = _threads[0].count + _posts;
    
    return json.sort(user); // json key 排序
  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.setUserData = async (req, reply) => {
  try {
    const returnResult = {
      result: false,
      code: -1,
      message: '',
      member: {}
    };
    
    const _uid = parseInt(req.user.uid, 10);
    const _realName = req.body.realName;
    const _info = req.body.info;
    const _fb = req.body.fb;
    const _ig = req.body.ig;

    // 先檢查用戶是否存在
    const checkUser = await prisma.wav_common_member_profile.findUnique({
      where: {
        uid: _uid
      },
      select: {
        uid: true
      }
    });

    if (checkUser) {
      // udpate
      const updateProfile = await prisma.wav_common_member_profile.update({
        where: { uid: _uid },
        data: {
          realName: _realName,
          info: _info,
          fb: _fb,
          ig: _ig,
        }
      });

      // get user
      const user = await prisma.wav_common_member.findUnique({
        where: {
          uId: _uid
        },
        select: {
          uId: true,
          profile: {
            select: {
              realName: true,
              info: true,
              fb: true,
              ig: true
            }
          }
        }
      });

      returnResult.result = true;
      returnResult.code = 0;
      returnResult.member = user;
    }
    
    reply.send(returnResult);
  } catch (err) {
    throw boom.boomify(err);
  }
};

// 取個人相關貼文 /node/social/userposts/:uid
exports.getUserPosts = async (req, reply) => {
  try {
    // 最後筆發表時間
    let _lastpost = isNaN(req.query.lastpost) ? 9999999999 : req.query.lastpost || 9999999999;
    _lastpost = (_lastpost === 0) ? 9999999999 : _lastpost;
    
    // 用戶id
    const _uid = parseInt(req.params.uid, 10);

    // 取用戶資料 & 設定給所有用戶的fid集合
    const [user, set] = await prisma.$transaction([
      prisma.wav_common_member.findUnique({
        where: {
          uId: _uid
        },
        select: {
          uId: true,
          userName: true,
          groupId: true,
          profile: {
            select: {
              realName: true,
              info: true
            }
          }
        }
      }),
      prisma.social_newest_posts.findMany({
        where: {
          postType: 1,
          del: false
        },
        select: {
          fid: true
        }
      })
    ]);

    let fidArray = set.map(function(v, i, a) {
      return v.fid;
    });

    // 取論壇來帶有用戶名稱標籤的貼文 + 用戶自己的貼文
    let _username = user.userName;
    let _realname = user.profile.realName;
    let sql_tags = (_realname) ? `OR INSTR(fp.tags, '${_realname}') > 0` : '';
    let _sql = `
      SELECT u.tid ,
             u.postType ,
             u.fid ,
             u.authorid ,
             (SELECT pp.realname FROM wav_common_member_profile AS pp WHERE pp.uid = u.authorid) AS author ,
             u.subject ,
             u.lastpost ,
             u.message ,
             u.tags
      FROM (
      (
      SELECT t.tid,
             't' AS postType,
             t.fid,
             t.authorid,
             t.author,
             t.subject,
             t.lastpost,
             fp.message,
             fp.tags
      FROM   wav_forum_thread AS t
          INNER JOIN(
              SELECT p.tid,
                     p.authorid,
                     p.message,
                     p.tags
              FROM   wav_forum_post AS p
          ) AS fp ON t.tid = fp.tid 
      WHERE t.fid IN(${fidArray.join(',')})
      AND t.displayorder IN('0', '1', '2', '3', '4')
      AND t.cover > 0
      AND(
          INSTR(fp.tags, '${_username}') > 0
          ${sql_tags}
      )
      AND t.lastpost < ?
      ORDER BY t.displayorder DESC, t.lastpost DESC
      LIMIT 0, 8
      )
      UNION ALL
      (
      SELECT  p.id AS tid ,
              p.postType ,
              0 AS fid ,
              p.uid AS authorid ,
              '' AS author ,
              '' AS subject ,
              p.dateline AS lastpost ,
              p.message ,
              '' AS tags
      FROM    social_posts AS p
      WHERE   p.dateline < ?
      AND     p.uid = ?
      AND     p.del = 0
      ORDER BY p.dateline DESC
      LIMIT 0, 8
      )
      ) AS u
      ORDER BY u.lastpost DESC
      LIMIT 0, 8;
    `;
    const threads = await prisma.$queryRaw(_sql, _lastpost, _lastpost, _uid);

    // 加入論壇貼文連結, 作者頭像, 貼文封面路徑, 將tags陣列化至tagList
    for (let i = 0; i < threads.length; i++) {
      const item = threads[i];
      const _postType = item.postType;
      const _tid = item.tid;
      const _uid = item.authorid;

      if (_postType === 't') {
        let tags = item.tags;
        let md5tid = crypto.createHash('md5').update(_tid.toString()).digest('hex');
        let _formatMessage = item.message;
        
        item.message = UserUtility.removeTextTag(_formatMessage);
        item.threadUrl = `${process.env.FORUM_URL}/forum.php?mod=viewthread&tid=${_tid}`;
        item.coverImg = `/data/attachment/forum/threadcover/${md5tid.substr(0, 2)}/${md5tid.substr(2, 2)}/${_tid}.jpg`;
        item.tagList = (tags) ? tags.replace(/\t$/g, '').replace(/\d+,/g, '#').split(/\t/g) : [];
        item.attachment = {};
      } else {
        item.threadUrl = '';
        item.coverImg = '';
        item.tagList = [];

        const _attachmentData = await prisma.social_posts_attachment.findMany({
          where: {
            pid: _tid,
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

        let _fileType = 0;
        let _data = [];
        if (_attachmentData.length > 0) {
          _fileType = _attachmentData[0].fileType;
          _data = _attachmentData;
        }

        item.attachment = {
          fileType: _fileType,
          data: _data
        };
      }
      item.authorAvatar = `/uc_server/avatar.php?uid=${_uid}&size=middle`;
    }
        
    // 取讚(用戶於目前貼文的讚狀/總讚數), 留言, 分享
    for (let i = 0; i < threads.length; i++) {
      const res = await userUtility.getPostInfo(threads[i].postType, threads[i].tid, threads[i].uid);
      threads[i].isLike = (res.isLike[0]) ? res.isLike[0].isLike : 0;
      threads[i].likeCount = (res.likeCount[0]) ? res.likeCount[0]._sum.isLike : 0;
      threads[i].comments = res.comments;
      threads[i].commentCount = res.commentCount;
      threads[i].isShare = (res.isShare[0]) ? res.isShare[0].isShared : 0;;
      threads[i].shareCount = res.shareCount;
    }
    
    return json.sort(threads);

  } catch (err) {
    throw boom.boomify(err);
  }
};

// 取推送給所有用戶的最近動態
exports.getNewPostsForUsers = async (req, reply) => {
  try {
    // get query string for lastpost
    let _lastpost = isNaN(req.query.lastpost) ? 9999999999 : req.query.lastpost || 9999999999;
    _lastpost = (_lastpost === 0) ? 9999999999 : _lastpost;

    // 取設定給所有用戶的fid集合
    const set = await prisma.social_newest_posts.findMany({
      where: {
        postType: 1,
        del: false
      },
      select: {
        fid: true
      }
    });

    let fidArray = set.map(function(v, i, a) {
      return v.fid;
    });

    // 取論壇來帶有用戶名稱標籤的貼文
    let _sql = `
      SELECT u.tid ,
             u.postType ,
             u.fid ,
             u.authorid ,
             (SELECT pp.realname FROM wav_common_member_profile AS pp WHERE pp.uid = u.authorid) AS author ,
             u.subject ,
             u.lastpost ,
             u.message ,
             u.tags
      FROM (
      (
      SELECT t.tid,
             't' AS postType,
             t.fid,
             t.authorid,
             t.author,
             t.subject,
             t.lastpost,
             fp.message,
             fp.tags
      FROM   wav_forum_thread AS t
          INNER JOIN(
              SELECT p.tid,
                     p.authorid,
                     p.message,
                     p.tags
              FROM   wav_forum_post AS p
          ) AS fp ON t.tid = fp.tid 
      WHERE t.fid IN(${fidArray.join(',')})
      AND t.displayorder IN('0', '1', '2', '3', '4')
      AND t.cover > 0
      AND(
          INSTR(fp.tags, '爆乳') > 0
      )
      AND t.lastpost < ?
      ORDER BY t.displayorder DESC, t.lastpost DESC
      LIMIT 0, 8
      )
      UNION ALL
      (
      SELECT  p.id AS tid ,
              p.postType ,
              0 AS fid ,
              p.uid AS authorid ,
              '' AS author ,
              '' AS subject ,
              p.dateline AS lastpost ,
              p.message ,
              '' AS tags
      FROM    social_posts AS p
      WHERE   p.dateline < ?
      AND     p.del = 0
      ORDER BY p.dateline DESC
      LIMIT 0, 8
      )
      ) AS u
      ORDER BY u.lastpost DESC
      LIMIT 0, 8;
    `;
    const threads = await prisma.$queryRaw(_sql, _lastpost, _lastpost);

    // 加入作者頭像,貼文封面路徑
    for (let i = 0; i < threads.length; i++) {
      const item = threads[i];
      const _postType = item.postType;
      const _tid = item.tid;
      const _uid = item.authorid;

      if (_postType === 't') {
        let tags = item.tags;
        let md5tid = crypto.createHash('md5').update(_tid.toString()).digest('hex');
        let _formatMessage = item.message;
        
        item.message = UserUtility.removeTextTag(_formatMessage);
        item.threadUrl = `${process.env.FORUM_URL}/forum.php?mod=viewthread&tid=${_tid}`;
        item.coverImg = `/data/attachment/forum/threadcover/${md5tid.substr(0, 2)}/${md5tid.substr(2, 2)}/${_tid}.jpg`;
        item.tagList = (tags) ? tags.replace(/\t$/g, '').replace(/\d+,/g, '#').split(/\t/g) : [];
        item.attachment = {};
      } else {
        item.threadUrl = '';
        item.coverImg = '';
        item.tagList = [];

        const _attachmentData = await prisma.social_posts_attachment.findMany({
          where: {
            pid: _tid,
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

        let _fileType = 0;
        let _data = [];
        if (_attachmentData.length > 0) {
          _fileType = _attachmentData[0].fileType;
          _data = _attachmentData;
        }

        item.attachment = {
          fileType: _fileType,
          data: _data
        };
      }
      item.authorAvatar = `/uc_server/avatar.php?uid=${_uid}&size=middle`;
    }

    // 取讚(用戶於目前貼文的讚狀/總讚數), 留言, 分享
    for (let i = 0; i < threads.length; i++) {
      const res = await userUtility.getPostInfo(threads[i].postType, threads[i].tid, threads[i].uid);
      threads[i].isLike = (res.isLike[0]) ? res.isLike[0].isLike : 0;
      threads[i].likeCount = (res.likeCount[0]) ? res.likeCount[0]._sum.isLike : 0;
      threads[i].comments = res.comments;
      threads[i].commentCount = res.commentCount;
      threads[i].isShare = (res.isShare[0]) ? res.isShare[0].isShared : 0;;
      threads[i].shareCount = res.shareCount;
    }

    return json.sort(threads);

  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.getUserList = async (req, reply) => {
  try {

    // 71-鄰家女孩,72-知性美女,73-冰山冷豔,74-狂野火辣
    const tag = await prisma.wav_common_tagitem.findMany({
      where:{
        idtype: 'uid',
        tagid: {
          in: [71, 72, 73, 74]
        }
      },
      select:{
        tagid:true,
      },
      orderBy:{
        tagid:'asc'
      }
    });
    let arr=[];
    tag.forEach(el => {arr.push(el.tagid);});
    const tagList = arr.filter( (ele,pos)=>arr.indexOf(ele) == pos);
  
    const userList = await prisma.$queryRaw(`
      SELECT
          p.uid ,
          p.realname ,
          tg.tagid ,
          tg.tagname ,
          tg.itemid
      FROM
          wav_common_member_profile AS p
      INNER JOIN(
        SELECT
          t.tagid ,
          t.tagname ,
          ti.itemid
        FROM
          wav_common_tag AS t
        INNER JOIN wav_common_tagitem AS ti ON t.tagid = ti.tagid
        WHERE
          ti.idtype = 'uid'
      ) AS tg ON p.uid = tg.itemid
      where tg.tagid in (${tagList.join(',')})
      ORDER BY tg.tagid ASC;
    `);
    
    let returnResult = [], tid = 0;
    userList.forEach(el => {
      if (el.tagid != tid)
      {
        tid = el.tagid;
        returnResult.push({
          tagId: tid,
          tagName: el.tagname,
          member:[]
        })
      }
      returnResult[returnResult.length-1].member.push({
        uid: el.uid,
        realName: el.realname,
        avatar: `/uc_server/avatar.php?uid=${el.uid}&size=middle`
      });
    });

    reply.send(returnResult);
   
  } catch (err) {
    throw boom.boomify(err);
  }
};