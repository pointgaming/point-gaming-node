$(function () {
    $(".autofocus").first().focus();

    $(".tabbable .nav-tabs li a").click(function (e) {
        e.preventDefault();
        $(this).tab("show");
    });
});
