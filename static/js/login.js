
    $('#register').on('click', function(){
        $('#step1').css('display', 'block');
        $('#step2').css('display', 'none');
        $('#step3').css('display', 'none');
        $('#register1').css('display', 'block');
        $('#register2').css('display', 'none');
        $('#registerSubmit').css('display', 'none');

        $('#registerModal').modal({
            backdrop: 'static',
            keyboard: true,
            show: true
        });
    });

    $('#register1').on('click', function(){
        if(!$('#id').val() || !$('#account').val() || !$('#password').val() || !$('#password2').val())
            return console.log('Missing require field');
        
        ajax('POST', '/node/register/'+$('#id').val().trim(), {} ,function(a){
            if(!a.error){
                if($('#password').val() == $('#password2').val()){
                    $('#step1').css('display', 'none');
                    $('#step2').css('display', 'block');
                    $('#register1').css('display', 'none');
                    $('#register2').css('display', 'block');
                }else
                    console.error('Different Password');
            }
            else
                console.log('Account already Exist');
        });
    });

    $('#register2').on('click', function(){
        if(!$('#username').val() || !$('#realname').val() || !$('#mobile').val())
            return console.log('Missing require field');

        $('#step2').css('display', 'none');
        $('#step3').css('display', 'block');
        $('#register2').css('display', 'none');
        $('#registerSubmit').css('display', 'block');
    });

    $('#registerSubmit').on('click', function(){
        if(!$('#emergencyName').val() || !$('#emergencyContact').val())
            return console.log('Missing require field');

        const data = {
            "uid": $('#id').val(),
            "username": $('#username').val(),
            "account": $('#account').val(),
            "password": $('#password').val(),
            "authority": 0,
            "realname": $('#realname').val(),
            "mobile": $('#mobile').val(),
            "tel": $('#tel').val(),
            "email": $('#email').val(),
            "emergency":{
                id: $('#emergencyId').val(),
                NAme: $('#emergencyName').val(),
                Contact: $('#emergencyContact').val()
            }
        };

        ajax('POST', '/node/register', data, function(a){
            if(!a.error){
                $('#registerModal').modal('hide');
            }
            else
                console.log(a.error);
        });  
    });

    $('#login').on('click', function(){
        const data = {
            'username': $('#acc').val(),
            'password': $('#pwd').val()
        };
        ajax('POST', '/node/login', data, function(a){
            if(!a.error){
                var now = new Date();
                now.setTime(now.getTime() + 4 * 3600 * 1000);
                document.cookie = "username="+ $('#acc').val() +";expires=" + now.toUTCString() + ";";
                document.cookie = "jwt="+ a.token +";expires=" + now.toUTCString() + ";";
                location.href = "./member.html"
            }
            else
                console.log(a.error);
        });        
    });
