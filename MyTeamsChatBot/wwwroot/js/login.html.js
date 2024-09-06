
function checkLogin(e) {
    e.preventDefault();
    $.getJSON("./asset/user.json", function (data) {
        var userdataJSON = data.userdata;

        const username = $("#username").val();
        const password = $("#password").val();

        let foundData = $.grep(userdataJSON, function (n, i) {
            return n.userId.toLowerCase() == username.toLowerCase() && n.password == password;
        });

        if (foundData != null && foundData != undefined && foundData.length > 0) {
            $("#alertCred").removeClass("d-none");

            if (!$("#alertCred").hasClass("d-none"))
                $("#alertCred").addClass("d-none");

            Cookies.set('authCookie', btoa(JSON.stringify(foundData)))
            window.location.href = "./index.html";
        }
        else {
            $("#password").val("");

            if ($("#alertCred").hasClass("d-none"))
                $("#alertCred").removeClass("d-none");
        }
    });

}




