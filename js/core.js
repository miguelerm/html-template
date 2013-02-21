var isLocalRequest = window.location.hostname === 'localhost';

// Inclusion de jQuery
(function (w, d) {
isLocalRequest || d.write('<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"><\/script>');
w.jQuery || d.write('<script src="js/vendor/jquery-1.9.0.min.js"><\/script>');
})(window, document);

// Google Analytics Script
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-38455713-1']);
_gaq.push(['_trackPageview']);
(function (d, t) {
    if (!isLocalRequest) {
        var g = d.createElement(t); g.type = 'text/javascript'; g.async = true;
        g.src = ('https:' == d.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = d.getElementsByTagName(t)[0]; s.parentNode.insertBefore(g, s);
    }
})(document, 'script');