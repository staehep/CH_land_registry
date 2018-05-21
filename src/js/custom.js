$(document).ready(function() {
    var $ctx = $('body');

    $ctx.on('click', '.js-layout-anchor', function(e) {
        var $link = $(this),
            href = $link.attr('href'),
            $content = $(href);

        console.log($content);

        e.preventDefault();

        $('html, body').animate({
            scrollTop: $content.offset().top
        }, 400);

    });
});