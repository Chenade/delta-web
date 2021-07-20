const GOOGLE_MAP_API_KEY = 'https://maps.googleapis.com/maps/api/geocode/json?language=zh-TW&key=AIzaSyD1oMT5EFeOqDmaMdb6YlWacWvyWWH6a-E&latlng=';
console.log(GOOGLE_MAP_API_KEY);
w3.includeHTML();

var clock = setInterval(() => {
    $('.time_now').each(function () {
        $(this).text(moment.unix(Date.now()/1000).format("YYYY/MM/DD HH:mm:ss"));
        $(this).attr('data-unix', parseInt(Date.now()/1000));
    });
   
}, 1000);

$('.form_datetime').datetimepicker({
    format:"YYYY-MM-DD HH:mm:ss",
    minDate: new Date()
});

function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
}

function ajax(method, url, data, callback) {
    // data['_token'] = $('[name="_token"]').attr('content');
    if(method == 'GET'){
        $.ajax({
            type: method,
            url: url,
            contentType: "application/json; charset=utf-8",
            success: function (res) {
                callback(res);
            }, error: function (res) {
                callback(res.responseJSON);
            }
        });
    }else{
        $.ajax({
            type: method,
            url: url,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            success: function (res) {
                callback(res);
            }, error: function (res) {
                callback(res.responseJSON);
            }
        });
    }
}


function convert(type, index){
    if(type == 'type'){
        switch(index){
            case '1':
                return '車禍';
            case '2':
                return '施工';
        }
    }
    if(type == 'suggestion'){
        console.log(index);
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