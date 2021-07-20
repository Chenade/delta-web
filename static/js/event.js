var object = {
    updateTime: 0,
    table : ''
}

function refreshEvent(id){
    
    ajax('GET', '/node/event?time='+object.updateTime, {}, function(a){
        if(!a.error){
            object.updateTime = Math.floor(Date.now() / 1000);
            var dateString = moment.unix(object.updateTime).format("YYYY/MM/DD HH:mm:ss");
            $("#updateTime").text(dateString);
            if(a.total > 0){
                $('#eventCard').empty();
                $('#eventCard').append(object.table);
                for(const i in a.events){
                    var detail = '', event = a.events[i];
                    detail += '<td>'+ event.city +'</td>';
                    detail += '<td id="cood_'+i+'"></td>';
                    detail += '<td>'+ convert('type', event.type) +'</td>';
                    detail += '<td>'+ convert('lane', event.effectLane) +'</td>';
                    detail += '<td>'+ convert('suggestion', event.suggestion) +'</td>';
                    detail += '<td>'+ moment.unix(event.time).format("YYYY/MM/DD HH:mm:ss") +'</td>';
                    detail += '<td>'+ convert('progress', event.done) +'</td>';

                    detail = '<tr>' + detail + '</tr>';
                    $('#eventList').append(detail);

                    $.getJSON(GOOGLE_MAP_API_KEY + event.location, function( data ) {
                        if(!data.error_message)
                            $('#cood_'+i).text(data.results[0].formatted_address);  
                    });

                }
                $('#eventTable').DataTable({});
                $('.dataTables_length').addClass('bs-select');
            }
            setTimeout(refreshEvent, 3000);
        }
        else
            console.error(a.error);
    });    
}

$(document).ready(function () {

    const _uid = getCookie("username");
    if(!_uid) location.href = "./";

    object.table = $('#eventCard').html();
    refreshEvent(_uid);

    $('input[type=radio][name=addressType]').change(function() {
        if ($(this).val() == 'address') 
            $('#cord').css('display', 'none');
        else
            $('#address').css('display', 'none');
        
        $('#'+$(this).val()).css('display','block');
    });

    $('#Esubmit').on('click', function(){

        if(!$('#Elong').val() || !$('#Elat').val() || !$('#Ecity').val())
            return console.log('Missing require field');

        const cord = $('#Elong').val() + ',' + $('#Elat').val();
        const data = {
            "memberId": _uid,
            "city": $('#Ecity').val(),
            "location": cord,
            "time": $('#Etime').data('unix'),
            "type": $('#Etype').val(),
            "effectLane": "string",
            "suggestion": $('#Esuggestion').val(),
            "done": 1
        };

       ajax('POST', '/node/event', data, function(a){
           if(!a.error){
                $('#tab_nav').click();
           }
       });
    });
    
});