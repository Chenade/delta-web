var object = {
    updateTime: 0,
    table : ''
}

function refreshEvent(uid){
    ajax('GET', '/node/event/search?memberId='+uid, {}, function(a){
        if(!a.error){
            console.log(a);
            if(a.total > 0) {
                $('#selfEmpty').css('display', 'none');
                $('#selfEvent').css('display', 'block');

                $('#selfEvent tbody').empty();
                for (const i in a.events){
                    const event = a.events[i];
                    var detail = '';

                    detail += '<h4><span class="badge badge-secondary">'+convert('type', event.type)+'</span> | <span class="badge badge-secondary">'+convert('suggestion', event.suggestion)+'</span></h4>';
                    detail += '<span id="add_'+i+'"></span><br>'
                    detail += '<span>影響車道：'+ convert('lane', event.type) +'</span><br>';
                    detail += '<span>時間：'+ moment.unix(event.time).format("YYYY/MM/DD HH:mm:ss") +'</span><br>';
                    detail = '<td>' + detail + '</td>';
                    
                    if(event.done == 1)
                        detail += '<td class="col-3"><button class="btn btn-warning eventEnd" data-id="'+event.no+'">已結束</button></td>';
                    else if(event.done == 0)
                        detail += '<td class="col-3"><button class="btn btn-info eventStart" data-id="'+event.no+'">已開始</button></td>';
                    else
                        detail += '<td class="col-3"><td>';


                    $.getJSON(GOOGLE_MAP_API_KEY + event.location, function( data ) {
                        if(!data.error_message && data.status == 'OK')
                            $('#add_'+i).text(data.results[0].formatted_address);  
                    });

                    detail = '<tr>' + detail + '</tr>';

                    $('#selfEvent tbody').append(detail);
                }
            }else{
                $('#selfEmpty').css('display', 'block');
                $('#selfEvent').css('display', 'none');
            }
            
        }
        else
            console.error(a.error);
    });
}

$(document).ready(function () {

    const _uid = getCookie("username");
    if(!_uid) location.href = "./";

    refreshEvent(_uid);

    object.table = $('#eventCard').html();

    $('input[type=radio][name=EaddressType]').change(function() {
        if ($(this).val() == 'address') 
            $('#Ecord').css('display', 'none');
        else
            $('#Eaddress').css('display', 'none');
        
        $('#E'+$(this).val()).css('display','block');
    });

    $('input[type=radio][name=SaddressType]').change(function() {
        if ($(this).val() == 'address') 
            $('#Scord').css('display', 'none');
        else
            $('#Saddress').css('display', 'none');
        
        $('#S'+$(this).val()).css('display','block');
    });

    $('#Esubmit').on('click', function(){

        if(!$('#Elong').val() || !$('#Elat').val() || !$('#Ecity').val())
            return console.log('Missing require field');

        const cord = $('#Elong').val() + ',' + $('#Elat').val();
        var lane = '';
        $('.Eeffect').each(function () {
            if ($(this).prop('checked'))
                lane += $(this).data('id') + '_';
        });

        const data = {
            "memberId": _uid,
            "city": $('#Ecity').val(),
            "location": cord,
            "time": $('#Etime').data('unix'),
            "type": $('#Etype').val(),
            "effectLane": lane,
            "suggestion": $('#Esuggestion').val(),
            "done": 1
        };

       ajax('POST', '/node/event', data, function(a){
           if(!a.error){
                location.href = "./event.html";
           }
       });
    });

    $('#SSubmit').on('click', function(){

        if(!$('#Slong').val() || !$('#Slat').val() || !$('#Scity').val())
            return console.log('Missing require field');

        const cord = $('#Slong').val() + ',' + $('#Slat').val();
        var lane = '';
        $('.Seffect').each(function () {
            if ($(this).prop('checked'))
                lane += $(this).data('id') + '_';
        });

        const data = {
            "memberId": _uid,
            "city": $('#Scity').val(),
            "location": cord,
            "time":$('#Stime').data('DateTimePicker').date().unix(),
            "type": $('#Stype').val(),
            "effectLane": lane,
            "suggestion": $('#SSuggestion').val(),
            "done": 0
        };

       ajax('POST', '/node/event', data, function(a){
           if(!a.error){
                location.href = "./event.html";
           }
       });
    });
    
    
    $(document).on('click', '.eventEnd', function (e){
        const btn = $(this), tid = btn.data('id');

        ajax('PUT', '/node/event/'+tid, {done:2}, function(a){
            if(!a)
                refreshEvent(_uid);
            else
                console.log(a.error);
        });
    });
    
    $(document).on('click', '.eventStart', function (e){
        const btn = $(this), tid = btn.data('id');
        const time = moment(new Date()).unix();
        
        ajax('PUT', '/node/event/'+tid, {done:1, time: time}, function(a){
            if(!a)
                refreshEvent(_uid);
            else
                console.log(a.error);
        });
    });

});