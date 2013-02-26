var $elements = $('body>nav>ul li').has('ul,ol').mouseenter(function () {

    var subMenuId = $(this).attr('data-submenu-id');
    $('#' + subMenuId).show();

    var containerDiv = $('div.main-menu-container>div');

    var totalWidth = 1; //1px

    containerDiv.find('div:visible').each(function (i, item) {
        totalWidth += $(item).width();
    });

    containerDiv.width(totalWidth);

});

$.each($elements, function (i, item) {

    var subMenuId = "subMenu-" + i;

    var $item = $(item).attr('data-submenu-id', subMenuId);
    var $subItem = $item.children('ul,ol').detach();
    var $newDiv = $('<div>').addClass('menu-container').append($subItem);

    if (i == 0) {
        $newDiv = $('<div>').addClass('main-menu-container').append($('<div>').append($newDiv));
    }

    $newDiv.attr('id', subMenuId);

    $root = $item.parents('div.main-menu-container>div').first();
    $root = $root.length > 0 ? $root : $('body');

    $root.append($newDiv);

});