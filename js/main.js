var portfolios = [
//    { name: 'jewishru', title: 'Jewish.ru' },
    { name: 'myhouse', title: 'Мой Дом' },
    { name: 'lyrsense', title: 'Lyrsense' },
    { name: 'scheduler', title: 'Расписание' }
];

function addPortfolioItem(name, title) {
    var id = 'portfolio_item_' + name;
    var iconStyle = "background-image: url('" + name + "/app_icon.png');"
    var onClick = "showPortfolioPage('" + name + "');";

    var html = '<div data-name="' + name + '" class="portfolio_item" onClick="' + onClick + '">' +
               '<div class="portfolio_item_icon" style="' + iconStyle + '"></div>' +
               '<span>' + title + '</span>';

    $('#portfolio_items').append(html);
}

function showPortfolioPage(name) {
    $('.portfolio_item').removeClass('active');
    $('.portfolio_item[data-name=' + name + ']').addClass('active');

    var loc = window.location;
    var url = loc.protocol + "//" + loc.host + "/" + loc.pathname + "/" + name + "/portfolio_page.html"

    $.ajax({
        url: url,
        type: "GET",
        dataType : "html",
    })
    .done(function(data) {
        $('.portfolio_inner .screens_slider').slick('unslick');

        $('.portfolio_inner').html(data);
        $('.portfolio_inner .screens_slider').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            dots: false,
            fade: true,
            autoplay: true,
            autoplaySpeed: 5000,
            prevArrow: $('.portfolio_inner .screens_arrow_left'),
            nextArrow: $('.portfolio_inner .screens_arrow_right')
        });

        $('.portfolio_inner .device_screen a').click(function() {
            var index = $(this).index()
            //console.log("gallery index: " + index);
            showGallery(index);
            return false;
        });
    })
    .fail(function( xhr, status, errorThrown ) {
        alert( "Sorry, there was a problem!" );
        console.log( "Error: " + errorThrown );
        console.log( "Status: " + status );
        console.dir( xhr );
    })
    .always(function( xhr, status ) {
        //alert( "The request is complete!" );
    });
}

function showGallery(index) {
    var current;
    var items = $('.portfolio_inner .device_screen a').map(function(i, el){
        var jel = $(el);
        if (i == index) {
            current = el;
        }
        var size = jel.attr('data-size').split('x');
        var url = jel.attr('href');
        var murl = jel.find('img').attr('src');
        return { msrc: murl, src: url, w: size[0], h: size[1] };
    })

    var currentRect = current.getBoundingClientRect(); 

    var options = { 
        index: index,
        getThumbBoundsFn: function(index) {
            var pageYScroll = window.pageYOffset || document.documentElement.scrollTop; 
            return {x:currentRect.left, y:currentRect.top + pageYScroll, w:currentRect.width};
        }
    };

    var pswpElement = document.querySelectorAll('.pswp')[0];
    var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
}

portfolios.forEach(function(it){
    addPortfolioItem(it.name, it.title);
});

showPortfolioPage(portfolios[0].name);

$(document).ready(function() {
});

$('a[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
        var navBarHeight = $('.nav_bar').height();
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
        if (target.length) {
        $('html, body').animate({
            scrollTop: target.offset().top - navBarHeight
        }, 500);
        return false;
        }
    }
});