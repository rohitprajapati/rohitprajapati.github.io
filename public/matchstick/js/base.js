$(document).ready(function() {
    $(document).on('click', 'img.gif', function () {
        $(this).attr('src', $(this).data('gif'));
    });
});
