var monomi = require('../lib/monomi');


var agents = [
	'Mozilla/5.0 (Linux; U; Android 4.0.3; de-ch; HTC Sensation Build/IML74K) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
	'Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0)',
	'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.111 Safari/537.36'
].map(function(a) {
	return {
		headers: {
			'user-agent': a
		}
	};
});

/* global describe, it */

describe('monomi', function () {
	it('should detect touch and mobile browsers by default', function () {
		var detect = monomi().detect;

		detect(agents[0]).should.equal('touch');
		detect(agents[1]).should.equal('mobile');
		detect(agents[2]).should.equal('desktop');
	});

	it('should detect only mobile browsers when configured', function () {
		var detect = monomi({
			order: ['mobile']
		}).detect;

		detect(agents[0]).should.equal('mobile');
		detect(agents[1]).should.equal('mobile');
		detect(agents[2]).should.equal('unknown');
	});
});