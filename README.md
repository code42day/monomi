[![Build Status](https://img.shields.io/travis/pirxpilot/monomi.svg)](http://travis-ci.org/pirxpilot/monomi)
[![Dependency Status](https://img.shields.io/gemnasium/pirxpilot/monomi.svg)](https://gemnasium.com/pirxpilot/monomi)
[![NPM version](https://img.shields.io/npm/v/@pirxpilot/monomi.svg)](https://npmjs.org/package/@pirxpilot/monomi)

# @pirxpilot/monomi

**Please note**: this is a gently modernized clone of [monomi](https://github.com/jamesgpearce/monomi)

A.K.A. MObile NOde MIddleware

monomi is middleware for node.js/[Connect](http://github.com/senchalabs/connect)
that provides tools for handling mobile (and other types of) browsers.

monomi detects which type of browser the client is using to access the node.js
server, by providing the 'detectBrowserType' middleware. It places the type of
browser (as a string) in the request.monomi.browserType property:

````javascript
var connect = require('connect');
var http = require('http');
var monomi = require("./lib/monomi");

var app = connect();

app.use(monomi());
app.use(function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.write('Hello World, ');
    response.end('and thanks for using a '
        + request.monomi.browserType + ' browser');
});

http.createServer(app).listen(8080);
````

For example, if this server is accessed with an iPad, the browser type is
'tablet'; if accessed with an iPhone or Android handset, the result is 'touch';
if accessed by any other mobile device, it is 'mobile'; and it defaults to
'desktop'.

monomi is sensitive to mobile carrier transcoders that move device headers
into their 'x-device-*' equivalents.

## Changing groupings

Over time, and as new mobile browsers come out, monomi will continue to provide
support for recognizing them. In the meantime, applications can override how
they wish the recognition to work.

For instance, the browser types that can be returned (and the recognition rules
used for each) can be overridden and configured by passing an options object to
the function.

The options can be passed like this:

````javascript
{
    'order': ['tablet', 'touch', 'mobile', 'desktop'],
    'default':'unknown',

    'tablet': {
        'user-agent': new RegExp('ipad', 'i')
    },

    ...

    'desktop': function (request, userAgent) {
        return true;
    }

}
````

The 'order' property tells monomi which order to run the recognitions, looking
for a positive result. For example, the iPhone will match both the 'touch' and
'mobile' groups by default, but the ordering ensures that the first, 'touch', is
returned.

The 'default' property specifies what string should be returned if none of the
other browser types match. (However, monomi's default desktop recognition
returns true, so unless you alter that algorithm, 'unknown' will never get
returned.)

The remainder of the options should have names that correspond to the browser
types (that were in the 'order' property). These should be functions (which
return a boolean result based on some recognition algorithm or other), or an
options object which looks like this:

````javascript
'tablet': {
    'user-agent': new RegExp('ipad', 'i')
}
````

This indicates that any user-agent matching the 'ipad' regular expression will
indicate that the device is a tablet.

Other headers can also be matched against regular expressions, but you must also
provide an 'order' property that indicates which order to apply the regex
conditions in. For example:

````javascript
'mobile': {
    'order':['x-wap-profile', 'profile', 'accept', 'user-agent'],
    'x-wap-profile': new RegExp('.+'),
    'profile': new RegExp('.+'),
    'accept': new RegExp('wap', 'i'),
    'user-agent': new RegExp('^(w3c |w3c-|acs-|alav|alca|amoi...)', 'i')
}
````

This will look for the presence of an x-wap-profile or profile header, then, if
not present, look for 'wap' in the accept header. Failing that, it will run a
longer regex against the user-agent to figure out if the browser is mobile or
not.
