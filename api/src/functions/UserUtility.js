const prisma = require("../instances/prisma");

class UserUtility {
  constructor() {}

  static myMethod() {
    console.log("myMethod");
  }

  // 取用戶投票相關資訊
  static async getUserVoteInfo(uid) {
    let result = null;

    let voteData = await prisma.$queryRaw(
      `
        SELECT v.vid, v.title, vd.aid, vd.uid
        FROM wav_alu_voted AS v
            INNER JOIN (
                SELECT vv.aid,
                      vv.vid,
                      vv.uid,
                      vv.dateline
                FROM wav_alu_votedata AS vv
            ) AS vd ON v.vid = vd.vid
        WHERE v.dateline < UNIX_TIMESTAMP(NOW())
            AND v.enddate > UNIX_TIMESTAMP(NOW())
            AND vd.uid = ?
        ORDER BY v.dateline DESC
        LIMIT 1;
      `,
      uid
    );

    if (voteData.length > 0) {
      // 投票頁 /plugin.php?id=voted&ac=view&vid=16
      let _link = `${process.env.FORUM_URL}/plugin.php?id=voted&ac=view&vid=${voteData[0].vid}`;

      let voteCount = await prisma.$queryRaw(
        `
          SELECT a.rank as 'Rank',
                a.vid,
                a.uid,
                a.title,
                a.num
          FROM (
              SELECT v.title,
                    v.num,
                    v.vid,
                    v.uid,
                    @prev := @curr,
                    @curr := v.num,
                    @rank := IF(@prev = @curr, @rank, @rank + 1) AS rank
              FROM wav_alu_votedata AS v,
                  (
                      SELECT @curr := null,
                            @prev := null,
                            @rank := 0
                  ) s
              WHERE v.vid = ?
              ORDER BY v.num DESC
          ) a WHERE a.uid = ?;
        `,
        voteData[0].vid,
        uid
      );

      let _rank = voteCount[0].Rank;
      let _num = voteCount[0].num;

      result = {
        link: _link,
        rank: _rank,
        num: _num,
      };
    }

    return result;
  }

// 取讚(用戶於目前貼文的讚狀/總讚數), 留言, 分享
  static async getPostInfo(postType, tid, uid) {
    const [isLike, likeCount, comments, commentCount, isShare, shareCount] = await prisma.$transaction([
      prisma.social_posts_like.findMany({
        take:1,
        where: {
          postType: postType,
          linkId: tid,
          uid: uid
        },
        select: {
          isLike: true
        },
        orderBy: [
          { dateline: 'desc' }
        ]
      }),
      prisma.social_posts_like.groupBy({
        by: ['linkId'],
        where: {
          postType: postType,
          linkId: tid
        },
        _sum: {
          isLike: true
        }
      }),
      prisma.$queryRaw(`
        SELECT
          c.uid,
          (SELECT IF( p.realname IS NULL OR p.realname = '' , m.username , p.realname) AS username FROM wav_common_member AS m INNER JOIN( SELECT pp.uid , pp.realname FROM wav_common_member_profile AS pp) AS p ON m.uid = p.uid WHERE m.uid = c.uid) as username,
          CONCAT('/uc_server/avatar.php?uid=', c.uid ,'&size=middle') as avatar,
          c.comment,
          c.dateline
        FROM
          social_posts_comment AS c
        WHERE
          c.postType = '${postType}'
        AND c.del = FALSE
        AND c.linkId = ?
      `, tid),
      prisma.social_posts_comment.count({
        where: {
          postType: postType,
          del: false,
          linkId: tid
        }
      }),
      prisma.social_posts_share.findMany({
        where: {
          postType: postType,
          linkId: tid,
          uid: uid
        },
        select: {
          isShared: true
        }
      }),
      prisma.social_posts_share.count({
        where: {
          postType: postType,
          linkId: tid
        }
      })
    ]);

    return {isLike, likeCount, comments, commentCount, isShare, shareCount};  
  }

  // 移除貼文內容標籤
  static removeTextTag(message) {
    let result = '';

    //移除 i
    result = message.replace(/\[(i).*\](.*?)\[\/\1\]/gm, '');
    
    //移除 img
    result = result.replace(/\[(img).*\](.*?)\[\/\1\]/gm, '');

    //移除 attach
    result = result.replace(/\[(attach).*\](.*?)\[\/\1\]/gm, '');

    //移除空行
    result = result.replace(/\r?\n|\r/gm, '');

    //移除剩餘標籤
    result = result.replace(/(\[([^\]]+)\])/gm, '');

    return result;
  }
  

}

module.exports = UserUtility;
