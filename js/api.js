$(document).ready(function() {
	$.when($.loadSettings()).done(function() {
		if (typeof settings.css_params !== 'undefined') {
			$.each(settings.css_params, function(key, value) {
				_root.style.setProperty('--' + key, value);
			});
		}

		if (typeof settings.animate !== 'undefined' && settings.animate.effect.length) {
			var effect  = settings.animate.effect.toLowerCase();
			var preset  = settings.animate.preset[effect];
			var scripts = ['three.r134.min.js', 'vanta.' + effect + '.min.js'];

			$.when($.getMultiScripts(scripts, 'js/vanta/')).done(function() {
				window['VANTA'][effect.toUpperCase()]($.extend({}, settings.animate.params, preset));
			});
		}

		if (typeof settings.logo !== 'undefined' && settings.logo.length) {
			$('#logo').html('<img class="brand-logo" src="' + settings.logo + '" height="150" width="150">');
		}

		lang = ((navigator.language || navigator.userLanguage).substring(0,2)).toLowerCase();

		if ($.getCookie('lang')) {
			lang = $.getCookie('lang');
		}

		if (lang in settings.langs) {
			$('html').attr('lang',lang);

			if ($.inArray(lang,langsRTL) !== -1) {
				$('html').attr('dir','rtl');
			} else {
				$('html').attr('dir','ltr');
			}

			if (!$.getCookie('lang')) {
				$.createCookie('lang', lang, 31);
			}
		} else {
			lang = 'pl';
			$('html').attr('lang',lang);
			$.createCookie('lang', lang, 31);
		}

		$.when($.loadLangs(lang)).done(function() {
			if (Object.keys(settings.langs).length > 1) {
				$.setLangLayout(settings.langs, lang, '#polyglotLanguageSwitcher');
			}
			if (settings.layout.enable_rules) {
				$('#login-rules').prop('checked', false);
				$('#login-rules-anon').prop('checked', false);
				$('#signin').prop('disabled', true);
				$('#signin_anon').prop('disabled', true);

				$('#login-rules').on('click', function() {
					if ($('#login-rules').prop('checked')) {
						$('#signin').prop('disabled', false);
					} else {
						$('#signin').prop('disabled', true);
					}
				});

				$('#login-rules-anon').on('click', function() {
					if ($('#login-rules-anon').prop('checked')) {
						$('#signin_anon').prop('disabled', false);
					} else {
						$('#signin_anon').prop('disabled', true);
					}
				});
			} else {
				$('.rules-checkbox').html('<br />');
			}

			$('input[readonly]').on('focus', function() {$('input[readonly]').prop('readonly', false);});
			$('input:not([readonly])').on('blur', function() {$('input:not([readonly])').prop('readonly', true);});

			$('#signin').click(function (event) {
				event.preventDefault();
				$.ajax({
					type: 'POST',
					url: '/api/captiveportal/access/logon/' + zoneid + '/',
					dataType:'json',
					data: {user: $('#inputUsername').val(), password: $('#inputPassword').val()}
				}).done(function(data) {
					if (data['clientState'] == 'AUTHORIZED') {
						if ($.getUrlparams()['redirurl'] != undefined) {
							window.location = $.getUrlparams()['redirurl'] + '?refresh';
						} else {
							window.location.reload();
						}
					} else {
						$('#inputUsername').val('');
						$('#inputPassword').val('');
						$.authorisationFailed();
					}
				}).fail(function() {
					$.connectionFailed();
				});
			});

			$('#signin_anon').click(function (event) {
				event.preventDefault();
				$.ajax({
					type: 'POST',
					url: '/api/captiveportal/access/logon/' + zoneid + '/',
					dataType:'json',
					data: {user: '', password: ''}
				}).done(function(data) {
					$.clientInfo(data);
					if (data['clientState'] == 'AUTHORIZED') {
						if ($.getUrlparams()['redirurl'] != undefined) {
							window.location = $.getUrlparams()['redirurl'] + '?refresh';
						} else {
							window.location.reload();
						}
					} else {
						$('#inputUsername').val('');
						$('#inputPassword').val('');
						$.authorisationFailed();
					}
				}).fail(function(){
					$.connectionFailed();
				});
			});

			$('#logoff').click(function (event) {
				event.preventDefault();
				$.ajax({
					type: 'POST',
					url: '/api/captiveportal/access/logoff/' + zoneid + '/',
					dataType:'json',
					data: {user: '', password: ''}
				}).done(function(data) {
					window.location.reload();
				}).fail(function(){
					$.connectionFailed();
				});
			});

			$('[id^="rules"].link').click(function(){
				$.showRules();
			});

			$.ajax({
				type: 'POST',
				url: '/api/captiveportal/access/status/' + zoneid + '/',
				dataType:'json',
				data: {user: $('#inputUsername').val(), password: $('#inputPassword').val()}
			}).done(function(data) {
				$.clientInfo(data);
				if (data['clientState'] == 'AUTHORIZED') {
					$('#login_normal').addClass('d-none');
					$('#logout_undefined').removeClass('d-none');
					$('.row, .footer-isp-info').addClass('ready');
				} else if (data['authType'] == 'none') {
					$('#login_normal').addClass('d-none');
					$('#login_none').removeClass('d-none');
					$('.row, .footer-isp-info').addClass('ready');
				} else {
					$('#login_normal').removeClass('d-none');
					$('.row, .footer-isp-info').addClass('ready');
				}
			}).fail(function(){
				setTimeout($.connectionFailed(),1000);
			});
		});
	});
});
