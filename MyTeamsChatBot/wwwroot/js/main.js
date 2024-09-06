//var authCookieEncoded = Cookies.get("authCookie");

//if (
//  authCookieEncoded == null ||
//  authCookieEncoded == undefined ||
//  authCookieEncoded == ""
//) {
//  //window.location.href = "./login.html";
//}

function onMarketingClick() {
  window.location.href = "Chat_page.html";
}

function onLogoutClick() {
  Cookies.remove("authCookie");
  window.location.href = "./login.html";
}

function toggleNav() {
  $(".specs").toggleClass("withmenu");
  let width = $("#mySidenav").width();
  let mgLeft = $("#main").css("margin-left");

  if (window.innerWidth < 440) {
    if (width === 0) {
      $("#mySidenav").css("width", "50%");
      $("#main").css("margin-left", "0");
    } else {
      $("#mySidenav").css("width", "0");
      $("#main").css("margin-left", "0");
    }
  } else if (window.innerWidth < 660) {
    if (width === 0) {
      $("#mySidenav").css("width", "40%");
      $("#main").css("margin-left", "0");
    } else {
      $("#mySidenav").css("width", "0");
      $("#main").css("margin-left", "0");
    }
  } else if (window.innerWidth < 767) {
    if (width === 0) {
      $("#mySidenav").css("width", "35%");
      $("#main").css("margin-left", "35%");
    } else {
      $("#mySidenav").css("width", "0");
      $("#main").css("margin-left", "0");
    }
  } else if (window.innerWidth < 980) {
    if (width === 0) {
      $("#mySidenav").css("width", "30%");
      $("#main").css("margin-left", "30%");
    } else {
      $("#mySidenav").css("width", "0");
      $("#main").css("margin-left", "0");
    }
  } else {
    if (width === 0) {
      $("#mySidenav").css("width", "20%");
      $("#main").css("margin-left", "20%");
    } else {
      $("#mySidenav").css("width", "0");
      $("#main").css("margin-left", "0");
    }
  }
  setTimeout(() => {
    if ($(".chatinput") != "undefined" && $(".chatinput") != null) {
      var widthVal = $("#main-content").width();
      $(".chatinput").css({ width: widthVal + "px" });
    }
  }, "600");

  //if ($(".chatinput")) $(".chatinput").toggleClass("panelActive");
}

function bodyLoadEvent() {
  if (window.innerWidth > 980) {
    toggleNav();
    //$(".chatinput").addClass("panelActive");
  }
}

// Attach click event to marketing element
$("#marketingElement").on("click", onMarketingClick);

// Call toggleNav on window resize
// $(window).on("resize", toggleNav);

// Call bodyLoadEvent on document ready
//bodyLoadEvent();

$(document).ready(function () {
  //var authCookieVal = JSON.parse(atob(authCookieEncoded));
  //$("#login_initials").html(authCookieVal[0].initials);

  //if ($("#login_username") != null && $("#login_username") != undefined) {
  //  $("#login_username").html(authCookieVal[0].username);
  //}
  $("#login_initials").click(function () {
    $(".menubar").slideToggle();
  });
});
