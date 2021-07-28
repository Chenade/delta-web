var object = {
    'user':{},
    'device' : {}
};

function refreshApplyTable(uid){
    ajax('GET', '/node/video/apply/'+uid, {}, function(a){
        if(!a.error){
            console.log(a);
            $('#applyTable').empty();
            if(a.total > 0){
                for(const i in a.data){
                    const req = a.data[i];
                    var row = '', row2 ='';
                    row += '<h4><span class="badge badge-warning">' + convert('type', req.type) + '</span> | <span class="badge badge-secondary">'+ moment.unix(req.time).format('YYYY-MM-DD HH:mm') +'</span></h4>';
                    row += '<h6>Location: <span class="cood">'+ req.location +'</span></h6>';
                    row += '<h6>Availabe Video: '+ req.progress + '/' + req.valid +'</h6>';
                    row += '<span style="color:#bbb">Timestamp: '+ req.timestamp +'</span>';
                    row = '<div class="col-12 col-lg-8">' + row + '</div>';

                    if(req.progress > 0) row2 += '<button class="btn btn-primary applyView" style="margin:0.5em;" data-target="'+req.no+'">VIEW</button>';
                    if(req.progress != req.valid) row2 += '<button class="btn btn-danger applyCancel" style="margin:0.5em;" data-target="'+req.no+'">CANCEL</button>';
                    row2 = '<div class="col-12 col-lg-4 d-flex align-items-center">' + row2 + '</div>';

                    row = '<div class="col-12 d-flex flex-wrap" style="border: solid #bbb 1px; padding:0.5em;">' + row + row2 + '</div>';
                    $('#applyTable').append(row);
                }

                translateCoordinate()
            }else
                $('#applyTable').html('<h3>目前尚無申請紀錄</h3>');
        }
        else
            console.error(a.error);
    });  
}


function refreshAuthorizeTable(uid){
    
    ajax('GET', '/node/video/authorize/'+uid, {}, function(a){
        if(!a.error){
            console.log(a);
            $('#authorizeTable').empty();
            if(a.total > 0){
                for(const i in a.data){
                    const req = a.data[i];
                    var row = '', row2 ='';
                    row += '<h4><span class="badge badge-warning">' + convert('type', 1) + '</span> | <span class="badge badge-secondary">'+ moment.unix(1627189200).format('YYYY-MM-DD HH:mm') +'</span></h4>';
                    row += '<h6>Location: <span class="cood">25.09185517822253,121.45404756862821</span></h6>';
                    // row += '<h6>Availabe Video: '+ req.progress + '/' + req.valid +'</h6>';
                    row += '<span style="color:#bbb">Expire Date: '+ req.expireDate +'</span>';
                    row = '<div class="col-12 col-lg-8">' + row + '</div>';

                    row2 += '<button class="btn btn-primary authorizeView" style="margin:0.5em;" data-target="'+req.no+'">VIEW</button>&emsp;&emsp;&emsp;&emsp;';
                    if(req.authorize == 0) row2 += '<button class="btn btn-success authorizeAgree" style="margin:0.5em;" data-target="'+req.no+'">AGREE</button>' + '<button class="btn btn-danger authorizeDecline" style="margin:0.5em;" data-target="'+req.no+'">DECLINE</button>';
                    if(req.authorize == 1) row2 += '<h3 class="text-success">AGREED</h3>';
                    if(req.authorize == 2) row2 += '<h3 class="text-warning">DECLINED</h3>';
                    row2 = '<div class="col-12 col-lg-4 d-flex align-items-center flex-wrap">' + row2 + '</div>';

                    row = '<div class="col-12 d-flex flex-wrap" style="border: solid #bbb 1px; padding:0.5em;">' + row + row2 + '</div>';
                    $('#authorizeTable').append(row);
                }

                translateCoordinate()
            }else
                $('#authorizeTable').html('<h3>目前尚無歷史授權</h3>');
        }
        else
            console.error(a.error);
    });   
}

$(document).ready(function () {

    const _uid = getCookie("username");
    if(!_uid) {
        document.cookie = "page="+ window.location.href + ";";
        location.href = "./";
    }
        
    refreshApplyTable(_uid);
    refreshAuthorizeTable(_uid);

    $('#refreshApply').on('click', function(){
        refreshApplyTable(_uid);
    });

    $('#refreshAuthorize').on('click', function(){
        refreshAuthorizeTable(_uid);
    });



    $(document).on('click', '.applyView', function (e){
        $('#videoModal').modal({
            backdrop: 'static',
            keyboard: true,
            show: true
        });
    });

    $(document).on('click', '.authorizeView', function (e){
        $('#videoModal').modal({
            backdrop: 'static',
            keyboard: true,
            show: true
        });
    });

    $(document).on('click', '.authorizeAgree', function (e){
        ajax('PUT', '/node/video/authorize/' + $(this).data('target'), {
            "authorize": 1
          }, function(a){
            if(!a){
                refreshAuthorizeTable(_uid);
                // $('#applyNav').click();
            }
        });
    });

    $('#submit_apply').on('click', function(){
        const data ={
            "uid": _uid,
            "time": $('#time').data('DateTimePicker').date().unix(),
            "type": $('#applyType').val(),
            "location": $('#applyLong').val() + ',' + $('#applyLat').val(),
            "police": $('#applyIsPolice').val(),
            "trafficId":$('#policeNo').val()
        };
        // console.log(data);

       ajax('POST', '/node/video/apply', data, function(a){
           if(!a && a.error){
               refreshApplyTable(_uid);
               $('#applyNav').click();
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