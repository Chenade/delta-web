$("#memberBtn").on('click',function () {

    if($("#member_password").val() == $("#member_pwd").val()){
        var data = "db=member";
        data += '&&member_id=' + $("#member_id").val();
        data += '&&name=' + $("#member_name").val();
        data += '&&gender=' + $("#member_gender").val();
        data += '&&password=' + $("#member_password").val();
        data += '&&email=' + $("#member_email").val();
        window.location.href = "./action.php?"+data;
    }else{
        alert('兩次輸入密碼不相符');
    }

});

$("#incomeBtn").on('click',function () {

    var data = "db=income";
    data += '&&member_id=' + $("#income_member_id").val();
    data += '&&date=' + $("#income_date").val();
    data += '&&category=' + $("#income_category").val();
    data += '&&name=' + $("#income_name").val();
    data += '&&amount=' + $("#income_amount").val();
    window.location.href = "./action.php?"+data;

});


$("#expenseBtn").on('click',function () {

    var data = "db=expense";
    data += '&&member_id=' + $("#expense_member_id").val();
    data += '&&date=' + $("#expense_date").val();
    data += '&&category=' + $("#expense_category").val();
    data += '&&name=' + $("#expense_name").val();
    data += '&&amount=' + $("#expense_amount").val();
    window.location.href = "./action.php?"+data;

});