    * 實裝 fastify-jwt
    * token 跟 cookie 存 7天
    * 告知前端取狀態時要傳送Cookie
        Cookie名稱包含以下字串:

    fastify https://www.fastify.io/ecosystem/
    

    Datebase:

        device {
            no       Int    @id @default(autoincrement())
            uuid     String @db.VarChar(50)
            memberId @db.VarChar(50)
            type     String @db.VarChar(15)         // front, back, side
        }

        event {
            no         Int    @id @default(autoincrement())
            memberId   String @db.VarChar(50)
            location   String @db.VarChar(50)       // 座標資訊
            time       Int                          // 事發時間
            type       Int    @default(1)           // 1: 車禍, 2: 施工
            effectLane String @db.VarChar(50)
            suggestion String @db.Text              // 1: 小心駕駛, 2: 提前改道
            timestamp  Int
        }

        member {
            no               Int    @id @default(autoincrement())
            id               String @db.VarChar(50)     // md5 hash account
            account          String @db.VarChar(50)     // E-mail
            password         String @db.VarChar(50)
            username         String @db.VarChar(50)
            authority        Int    @default(1)         // 1: member, 5: gov, 7:root
            helpCount        Int    @default(0)
            remainCount      Int    @default(4)
            emergencyId      Int                        // memberId if exist
            emergencyName    String @db.VarChar(15)
            emergencyContact String @db.VarChar(50)
        }

        video {
            id          Int    @id @default(autoincrement())
            memberId    String @db.VarChar(50)
            deviceId    String @db.VarChar(50)      // device-uuid
            videoFile   String @db.VarChar(150)     // filename, location: data/memberId/video
            location    String @db.VarChar(50)      // Start
            gpsFile     String @db.VarChar(150)     // filename, location: data/memberId/gps
            start       Int                         // Unix timestamp
            duration    Int                         // Sec
            accessCount Int    @default(0)
        }

        videoshare {
        no         Int    @id @default(autoincrement())
        vid        Int                              // video index
        owner      String @db.VarChar(50)           // member Id
        user       String @db.VarChar(50)           // member Id
        authorize  Int    @default(0)               // 0: unknown, 1: authorize, 2: decline
        expireDate Int                              // Unix timestamp, default 30 days
        }
