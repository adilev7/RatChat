$(document).ready(function () {
  $(".button-collapse").sideNav();
  $(".dropdown-trigger").dropdown({ belowOrigin: true });
  $("input").addClass("browser-default");
  $(".tabs").tabs();

  $(window).on("load", () => {
    setTimeout(() => {
      $("#loader").addClass("hidden");
    }, 800);
  });
  // $(".fixed-action-btn").floatingActionButton();
  // $(".modal").modal();
});
