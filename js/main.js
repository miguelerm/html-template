function getBoxFromElement(element) {
    /// <summary>Obtiene un objeto con las coordenadas de un elemento de jQuery.</summary>
    /// <param name="element" type="Object">Objeto con las coordenas (pointA: esquina superior izquierda; pointB: esquina inferior derecha).</param>

    var box = {
        pointA: {
            x: element.offset().left,
            y: element.offset().top
        },
        pointB: {
            x: element.offset().left + element.width(),
            y: element.offset().top + element.height()
        }
    }
    return box;
}

function getPointFromEventArgs(e) {
    /// <summary>Obtiene un punto (x, y) con las coordenadas del mouse con respecto al documento.</summary>
    /// <param name="e" type="Object">{x: 0, y: 0}</param>

    var point = {
        x: e.pageX,
        y: e.pageY
    }
    return point;
}

function pointIsInsideBox(point, box) {
    return point.x >= box.pointA.x &&
           point.y >= box.pointA.y &&
           point.x <= box.pointB.x &&
           point.y <= box.pointB.y;
}

function mousePositionIsInsideElement(element, mouseMoveEventArgs) {
    var box = getBoxFromElement(element);
    var point = getPointFromEventArgs(mouseMoveEventArgs);
    return pointIsInsideBox(point, box);

}

function hideSubMenusInCascade($element) {
    $.each($element.find('[data-submenu-id]'), function () {
        var subMenuId = '#' + $(this).attr('data-submenu-id');
        hideSubMenusInCascade($(subMenuId));
    });
    $element.find('.current').removeClass('current');
    $element.hide();
}

function hideMenuContainer(e) {
    var $this = $(this);
    var $thisId = $this.attr('id');
    var $parentItem = null;

    var mainMenuDivHeight = $('.main-menu-container').height();
    var thisHeight = $this.height();

    if (mainMenuDivHeight > thisHeight) {
        var box = getBoxFromElement($this);
        var point = getPointFromEventArgs(e);

        box.pointB.y += mainMenuDivHeight - thisHeight;

        if (pointIsInsideBox(point, box)) {
            return false;
        }

    }

    if ($thisId !== null && $thisId.length > 0) {
        $parentItem = $('[data-submenu-id="' + $thisId + '"]').first();
        if (mousePositionIsInsideElement($parentItem, e)) {
            return false;
        } else {
            var $subMenus = $('[data-parentsubmenu-id="' + $thisId + '"]');
            var hide = true;
            $.each($subMenus, function (i, item) {
                if (mousePositionIsInsideElement($(item), e)) {
                    hide = false;
                    return false;
                }
            });
            if (!hide) {
                return false;
            }
        }
    }

    if ($parentItem !== null && $parentItem.length && $parentItem.length > 0) {
        $parentItem.removeClass('current');
    }

    hideSubMenusInCascade($this);
}

var $elements = $('body>nav>ul:first-child li').has('ul').mouseenter(function () {

    var subMenuId = $(this).attr('data-submenu-id');
    var $subMenu = $('#' + subMenuId);

    var containerDiv = $('div.main-menu-container>div');

    var totalWidth = $subMenu.is(':visible') ? 0 : $subMenu.width(); //1px

    containerDiv.find('div:visible').each(function (i, item) {
        totalWidth += $(item).width();
    });

    containerDiv.width(totalWidth);

    $subMenu.show();

}).mouseleave(function (e) {

    var $this = $(this);
    var subMenuId = $this.attr('data-submenu-id');
    var $subMenu = $('#' + subMenuId);

    console.log('mouseleave... ' + mousePositionIsInsideElement($this, e))
    console.log($(this));

    if (!mousePositionIsInsideElement($subMenu, e)) {
        console.log('mouseleave hide...')
        hideSubMenusInCascade($subMenu);
    }
    else {
        $this.addClass('current');
    }

});

$.each($elements, function (i, item) {

    var subMenuId = "subMenu-" + i;

    var $item = $(item).attr('data-submenu-id', subMenuId);
    var $subItem = $item.children('ul,ol').detach();
    var $newDiv = $('<div>').addClass('menu-container').append($subItem);

    if (i == 0) {
        $newDiv = $('<div>').addClass('main-menu-container').append($('<div>').append($newDiv));
    }

    $parentDiv = $item.parents('div[id]').first()

    console.log($parentDiv);

    if ($parentDiv !== null && $parentDiv.length && $parentDiv.length > 0) {
        $newDiv.attr('data-parentsubmenu-id', $parentDiv.attr('id'));
    }

    $newDiv.attr('id', subMenuId)
    $newDiv.mouseleave(hideMenuContainer);

    $root = $item.parents('div.main-menu-container>div').first();
    $root = $root.length > 0 ? $root : $('body');

    $root.append($newDiv);

});