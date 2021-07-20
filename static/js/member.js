var object = {
    'user':{},
    'device' : {}
};

function refreshDevice(id){
    ajax('GET', '/node/device/user/'+id, {}, function(a){
        if(!a.error){
            $('#deviceList').empty();
            for (const i in a.devices){
                const device = a.devices[i];
                var detail = '';
                detail += '<h6 class="deviceTitle" data-id="'+i+'">' + device.licensePlate + '&emsp;|&emsp;' + device.type +'</h6>';
                detail += '<span class="deviceUUID" data-id="'+i+'" style="color:#BBB">'+ device.uuid +'</span><br>';

                detail += '<div class="d-flex justify-content-center">';
                detail += '<button class="btn btn-primary editDevice" data-id="'+i+'">編輯</button>&emsp;';
                detail += '<button class="btn btn-danger deleteDevice" data-id="'+i+'">刪除</button>&emsp;';
                detail += '</div>';
        
                detail = '<div style="padding:0.5em; border: solid #bbb 1px">'+detail+'</div>';
                $('#deviceList').append(detail);
            }
        }
        else
            console.error(a.error);
    });    
}

function refreshMember(uid){
    ajax('GET', '/node/user/'+uid, {} ,function(a){
        if(!a.error){
            const user = a.member;
            object.user = a.member;
            $('#uid').text(user.uid);
            $('#account').text(user.account);
            $('#username').text(user.username);
            $('#realname').text(user.detail.realname);
            $('#mobile').text(user.detail.mobile);
            $('#tel').text(user.detail.tel);
            $('#email').text(user.detail.email);
            $('#emergencyName').text(user.emergency.name);
            $('#emergencyContact').text(user.emergency.contact);
            $('#remainCount').text(user.data.remain);

            $('#edit_uid').val(user.uid);
            $('#edit_account').val(user.account);
            $('#edit_username').val(user.username);
            $('#edit_realname').val(user.detail.realname);
            $('#edit_mobile').val(user.detail.mobile);
            $('#edit_tel').val(user.detail.tel);
            $('#edit_email').val(user.detail.email);
            $('#edit_emergencyId').val(user.emergency.id);
            $('#edit_emergencyName').val(user.emergency.name);
            $('#edit_emergencyContact').val(user.emergency.contact);
            $('#edit_remainCount').val(user.data.remain);
        }
        else
            console.error(a.error);
    });
}

function refreshEvent(uid){
    
    ajax('GET', '/node/event/search?memberId='+uid, {}, function(a){
        if(!a.error){
            console.log(a);
            if(a.total > 0) {
                $('#eventEmpty').css('display', 'none');
                $('#eventList').empty();
                for (const i in a.events){
                    const event = a.events[i];
                    var detail = '';

                    detail += '<h4><span class="badge badge-secondary">'+convert('type', event.type)+'</span> | <span class="badge badge-secondary">'+convert('suggestion', event.suggestion)+'</span></h4>';
                    detail += '<span id="add_'+i+'"></span><br>'
                    detail += '<span>影響車道：'+ convert('lane', event.type) +'</span><br>';
                    detail += '<span>時間：'+ moment.unix(event.time).format("YYYY/MM/DD HH:mm:ss") +'</span><br>';
                    detail = '<div class="col-9">' + detail + '</div>';

                    if(event.done == 1)
                        detail += '<div class="col-3"><button class="btn btn-warning eventEnd" data-id="'+event.no+'">已結束</button></div>';
                    else if(event.done == 0)
                        detail += '<div class="col-3"><button class="btn btn-info eventStart" data-id="'+event.no+'">已開始</button></div>';
                    else
                        detail += '<div class="col-3"><div>';

                    $.getJSON(GOOGLE_MAP_API_KEY + event.location, function( data ) {
                        if(!data.error_message && data.status == 'OK')
                            $('#add_'+i).text(data.results[0].formatted_address);  
                    });

                    detail = '<div class="d-flex col-12" style="padding:0.5em; border: solid #bbb 1px">' + detail + '</div>';

                    $('#eventList').append(detail);
                }
            }else{
                $('#eventEmpty').css('display', 'block');
                $('#eventList').css('display', 'none');
            }
            
        }
        else
            console.error(a.error);
    });  
}

$(document).ready(function () {

    const _uid = getCookie("username");
    if(!_uid) location.href = "./";

    refreshDevice(_uid);
    refreshMember(_uid);
    refreshEvent(_uid);

    $('#addDevice').on('click', function(){
        $('#uuid').val('');
        $('#uuid').prop('disabled', false);
        $('#licensePlate').val('');
        $('#type').val('front');
        $('#deviceModalTitle').text('新增設備');
        $('#deviceSubmit').css('display', 'block');
        $('#deviceSave').css('display', 'none');
        $('#deviceModal').modal({
            backdrop: 'static',
            keyboard: true,
            show: true
        });
    });

    $(document).on('click', '.editDevice', function (e){
        const btn = $(this), tid = btn.data('id');
        const title = $('.deviceTitle[data-id="'+tid+'"]').text().split('|');

        object.device={
            licensePlate: title[0].trim(),
            type: title[1].trim()
        };

        $('#uuid').val($('.deviceUUID[data-id="'+tid+'"]').text());
        $('#uuid').prop('disabled', true);
        $('#licensePlate').val(title[0].trim());
        $('#type').val(title[1].trim());
        $('#deviceModalTitle').text('編輯設備');
        $('#deviceSave').css('display', 'block');
        $('#deviceSubmit').css('display', 'none');

        $('#deviceModal').modal({
            backdrop: 'static',
            keyboard: true,
            show: true
        });
    });

    $(document).on('click', '.deleteDevice', function (e){
        const btn = $(this), tid = btn.data('id');
        const _uuid = $('.deviceUUID[data-id="'+tid+'"]').text();

        ajax('PUT', '/node/device/'+_uuid, {del:1}, function(a){
            if(!a)
                refreshDevice(_uid);
            else
                console.log(a.error);
        });
    });

    $('#deviceSubmit').on('click', function(){
        const data = {
            "uid": _uid,
            "uuid": $('#uuid').val(),
            "licensePlate": $('#licensePlate').val(),
            "type": $('#type').val(),
        };

       ajax('POST', '/node/device', data, function(a){
           if(!a.error){
            $('#deviceModal').modal('hide');

            refreshDevice(_uid);
           }
       });
    });

    $('#deviceSave').on('click', function(){
        var data = {}, condition = false;
        const uuid = $('#uuid').val().trim();

        $('#licensePlate').val().trim() != object.device.licensePlate && (data['licensePlate'] = $('#licensePlate').val().trim(), condition = true);
        $('#type').val().trim() != object.device.type && (data['type'] = $('#type').val().trim(), condition = true);
        
        if(condition){
             ajax('PUT', '/node/device/'+uuid, data, function(a){
                if(!a){
                    $('#deviceModal').modal('hide');
                    refreshDevice(_uid);
                }
                else
                    console.log(a.error);
            });  
        }else
            console.warn('Nothing changed');
    });

    $('#editUser').on('click', function(){
        $('#userModal').modal({
            backdrop: 'static',
            keyboard: true,
            show: true
        });
    });

    $('#UserSave').on('click', function(){
        var data = {}, condition = false;

        $('#edit_username').val().trim() != object.user.username && (data['username'] = $('#edit_username').val().trim(), condition = true);
        $('#edit_realname').val().trim() != object.user.detail.realname && (data['realname'] = $('#edit_realname').val().trim(), condition = true);
        $('#edit_mobile').val().trim() != object.user.detail.mobile && (data['mobile'] = $('#edit_mobile').val().trim(), condition = true);
        $('#edit_tel').val().trim() != object.user.detail.tel && (data['tel'] = $('#edit_tel').val().trim(), condition = true);
        $('#edit_email').val().trim() != object.user.detail.email && (data['email'] = $('#edit_email').val().trim(), condition = true);
        
        $('#edit_emergencyId').val().trim() != object.user.emergency.id && (data['emergencyId'] = $('#edit_emergencyId').val().trim(), condition = true);
        $('#edit_emergencyName').val().trim() != object.user.emergency.name && (data['emergencyName'] = $('#edit_emergencyName').val().trim(), condition = true);
        $('#edit_emergencyContact').val().trim() != object.user.emergency.contact && (data['emergencyContact'] = $('#edit_emergencyContact').val().trim(), condition = true);

        if(condition){
             ajax('PUT', '/node/user/'+_uid, data, function(a){
                if(!a.error){
                    $('#userModal').modal('hide');
                    refreshMember(_uid);
                }
                else
                    console.log(a.error);
            });  
        }else
            console.warn('Nothing changed');
    });

    $('#emergencySearch').on('click', function(){
        const target = $('#edit_emergencyId').val().trim();
        if(target != _uid){
            ajax('GET', '/node/user/'+target, {}, function(a){
                if(!a.error){
                    console.log(a);
                    $('#edit_emergencyName').val(a.member.detail.realname)
                    $('#edit_emergencyContact').val(a.member.detail.mobile)
    
                }
                else
                    console.log(a.error);
            });  
        }else
            console.error('Cannot set self');
        
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