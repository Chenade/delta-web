const prisma = require("../instances/prisma");
const nodemailer = require('nodemailer');

class General {
  constructor() {}

  static myMethod() {
    console.log("myMethod");
  }

  static async BroadCast(lat, lng){
    const f_lat =  parseFloat(lat);
    const f_lng =  parseFloat(lng);

    const query_lat = " `lat` BETWEEN '"+ (f_lat - 0.005) +"' AND '"+ (f_lat + 0.005) +"'";
    const query_lng = " `lng` BETWEEN '"+ (f_lng - 0.005) +"' AND '"+ (f_lng + 0.005) +"'";

    let query = "SELECT * FROM `car` WHERE" + query_lng + "AND" + query_lat;
    const car = await prisma.$queryRaw(query);
    
    if(car.length){
      let arr=[];
      let users = '';
      car.forEach(el => { users += '"' + el.memberId + '"';});
        
      let query2 = `SELECT * FROM member WHERE uid IN (${users})`;
      const user = await prisma.$queryRaw(query2);

      let email= '';
      for (const i in user){ email += ((email) ? ',' : '') + user[i].account;  }

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          // naturally, replace both with your real credentials or an application-specific password
          user: 'chenade0312@gmail.com',
          pass: 'Yangchi*0312' 
        }
      });

      const mailOptions = {
        from: 'kuoyangchi@gmail.com',
        to: email,
        subject: '[System Mail] Emergency Alert',
        text: 'There is a emergency accident at ('+lat+','+lng+'). Please be aware'
      };

      await transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }
  }
  
  static convert(type, index){
    if(type == 'type'){
        switch(index){
            case 1:
                return '車禍';
            case 2:
                return '施工';
        }
    }
    if(type == 'suggestion'){
        switch(index){
            case '1':
                return '提前改道';
            case '2':
                return '小心駕駛';
            default:
                return index
        }
    }
    if(type == 'progress'){
        switch(index){
            case 0:
                return '';
            case 1:
                return '進行中';
            case 2:
                return '已結束';
            default:
                return index
        }
    }
    if(type == 'lane'){
        var lane = index.split('_');
        var result = '';
        for (const i in lane){
            switch(lane[i]){
                case '1':
                    result += '雙向車道, ';
                    break;
                case '2':
                    result += '單向車道, ';
                    break;
                case '3':
                    result += '內1車道, ';
                    break;
                case '4':
                    result += '內2車道, ';
                    break;
                case '5':
                    result += '中線道, ';
                    break;
                case '6':
                    result += '外線道, ';
                    break;
                case '7':
                    result += '路肩, ';
                    break;
            }
        }
        return result
    }
  }

  // static

  static unix(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = a.getMonth().toString().padStart(2, "0");
    var date = a.getDate();
    var hour = a.getHours().toString().padStart(2, "0");
    var min = a.getMinutes().toString().padStart(2, "0");
    var sec = a.getSeconds().toString().padStart(2, "0");
    var time = year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec;
    return time;
  }

}

module.exports = General;
