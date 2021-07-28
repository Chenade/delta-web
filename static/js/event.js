$(document).ready(function () {

    if(checkLogin()) $('#notLogin').css('display', 'none');
    else $('#isLogin').css('display', 'none');

    const _uid = getCookie("username");
    

    var eventTable = $('#eventTable').DataTable( {
        responsive: true,
        "columns": [
            { "data": "city" },
            { "data": "location" },
            { "data": "type" },
            { "data": "effectLane" },
            { "data": "suggestion" },
            { "data": "time" },
            { "data": "done" }
        ],
        "lengthMenu": [15, 25, 50, 100],
        "iDisplayLength": 15,
        "ajax": "/node/event", 
        "drawCallback": function (settings) {
            $('#updateTime').text(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
            translateCoordinate()
        }
    });
    new $.fn.dataTable.FixedHeader( eventTable );
    
    var refresh = setInterval(() => {
        eventTable.ajax.url('/node/event').load();
    }, 30000);

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