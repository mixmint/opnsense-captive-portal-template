var langText = {};
var settings = {};
var lang, langsRTL = ['ar','dv','fa','ha','he','sy'], _root = document.querySelector(':root');;

const iso = (timeStamp=Date.now()) => {
	return new Date(timeStamp - (new Date().getTimezoneOffset() * 60 * 1000)).toISOString().slice(0,-5).split('T')
}

function getURLparams() {
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}

function loadSETTINGS() {
	var file = 'config/settings.json';
	return $.ajax({
		type: 'GET',
		url: file,
		dataType: 'json'
	}).done(function(data) {
			$.extend(settings, JSON.parse(JSON.stringify(data)));
		}
	);
}

function loadLANGS(lang) {
	var file = 'langs/' + lang + '.json';
	return $.ajax({
		type: 'GET',
		url: file,
		dataType: 'json'
	}).done(function(data) {
		$.extend(langText, JSON.parse(JSON.stringify(data)));
		$.each(JSON.parse(JSON.stringify(data)),function(i, item) {
			if (~i.indexOf('pagetitle')) {
				$('title').text(item);
			} else if (~i.indexOf('_placeholder')) {
				$('#' + i.replace('_placeholder','')).attr('placeholder',item);
			} else {
				$('#' + i).text(item);
			}
		});
	}).fail(function(data, status) {
		if(status === 'timeout') {
			$('#MSG').cpModal({
				title: 'An error occured',
				subtitle: 'Translation content is unavailable',
				padding: 20,
				headerColor: settings.modal['auth_failed_header_color'],
				iconText: '&#9888;',
				borderBottom: false,
				timeout: settings.modal['timeout'],
				timeoutProgressbar: true,
				pauseOnHover: true,
				overlayColor: settings.modal['overlay_color'],
				onClosed: function(){
					$('#MSG').replaceWith('<div id="MSG"></div>');
					$.when(setTimeout(createCookie('lang', 'en', 31),100)).done(function() {
						setLangLayout(settings.langs, 'en', '#polyglotLanguageSwitcher');
						loadLANGS('en');
					});
				},
				afterRender: function(){
					$('#MSG .cpModal-content').append('<p>Unfortunately, the language file could not be loaded. The login system will automatically switch to English.</p>');
				}
			});
			$('#MSG').cpModal('open');
		}
	});
}

function setLang(id) {
	$(id).polyglotLanguageSwitcher({
		effect: 'slide',
		testMode: true,
		onChange: function(evt){
			setTimeout(createCookie('lang', evt.selectedItem, 31),100);
			loadLANGS(evt.selectedItem);
			$('#inputUsername').prop('readonly', false);
			$('#inputUsername').focus();
		}
	});
}

function setLangLayout(arr, sel, id) {
	var html = '<div id="polyglotLanguageSwitcher"><form action="javascript:void(0);"><select id="polyglot-language-options">';
	$.each(arr, function(key, val) {
		html += '<option id="' + key + '" value="' + key + '"' + (key == sel ? ' selected' : '') + '>' + val + '</option>';
	});
	html += '</select></form></div>';
	$(id).replaceWith(html);
	setLang(id);
}

function clientInfo(data) {
	let selector = $('#cp_portal_event_' + data['authType']);
	if (typeof data['ipAddress'] !== 'undefined' && data['ipAddress'].length) {
		selector.append('<p><span class="if-title">' + langText.cp_portal_ifconfig_ip_address + '</span> <span class="config-address">' + data['ipAddress'] + '</span></p>');
	}
	if (typeof data['macAddress'] !== 'undefined' && data['macAddress'].length) {
		selector.append('<p><span class="if-title">' + langText.cp_portal_ifconfig_mac_address + '</span> <span class="config-address">' + data['macAddress'] + '</span></p>');
	}
	if (typeof data['startTime'] == 'number') {
		let session_start = iso(new Date(data['startTime'] * 1000));
		session_start = (typeof settings.langs_iso[lang] !== 'undefined') ? session_start.toLocaleString(settings.langs_iso[lang]) : session_start.toLocaleString();
		selector.append('<p class="flex-100 info"><em><span class="time-title">' + langText.cp_session_start_time + '</span> <span class="config-info">' + session_start + '</span></em></p>');
	}
}

function createCookie(name,value,days) {
	var d = new Date();
	d.setTime(d.getTime() + (days*24*60*60*1000));
	var expires = "expires=" + d.toGMTString();
	document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function authFailed() {
	$('#MSG').cpModal({
		title: langText.cp_error_login_err,
		subtitle: langText.cp_error_info_title,
		padding: 20,
		headerColor: settings.modal['auth_failed_header_color'],
		iconText: '&#9888;',
		borderBottom: false,
		timeout: settings.modal['timeout'],
		timeoutProgressbar: true,
		pauseOnHover: true,
		overlayColor: settings.modal['overlay_color'],
		onClosed: function(){
			$('#MSG').replaceWith('<div id="MSG"></div>');
		},
		afterRender: function(){
			$('#MSG .cpModal-content').append(langText.cp_error_info + langText.cp_error_solution_title + langText.cp_error_solution);
		}
	});
	$('#MSG').cpModal('open');
}

function showRules() {
	$('#MSG').cpModal({
		title: langText.cp_rules_title,
		subtitle: langText.cp_rules_info_title,
		padding: 20,
		top: 70,
		bottom: 70,
		width: 800,
		headerColor: settings.modal['show_rules_header_color'],
		iconText: '&#167;',
		borderBottom: false,
		timeout: false,
		overlayColor: settings.modal['overlay_color'],
		onClosed: function(){
			$('#MSG').replaceWith('<div id="MSG"></div>');
		},
		afterRender: function(){
			$('#MSG .cpModal-content').append(langText.cp_rules_content);
		}
	});
	$('#MSG').cpModal('open');
}

function connFailed() {
	$('#MSG').cpModal({
		title: langText.cp_error_title,
		subtitle: langText.cp_error_server_connection,
		padding: 20,
		headerColor: settings.modal['conn_failed_header_color'],
		iconText: '&#9888;',
		borderBottom: false,
		timeout: false,
		overlayColor: settings.modal['overlay_color'],
		onClosed: function(){
			$('#MSG').replaceWith('<div id="MSG"></div>');
		}
	});
	$('#MSG').cpModal('open');
}

$(document).ready(function() {
	$.when(loadSETTINGS()).done(function() {
		if (typeof settings.colors !== 'undefined') {
			$.each(settings.colors, function(key, value) {
				_root.style.setProperty('--' + key, value);
			});
		}

		if (typeof settings.logo !== 'undefined' && settings.logo.length) {
			$('#logo').html('<img class="brand-logo" src="' + settings.logo + '" height="150" width="150">');
		}

		lang = ((navigator.language || navigator.userLanguage).substring(0,2)).toLowerCase();

		if (getCookie('lang')) lang = getCookie('lang');

		if (lang in settings.langs) {
			$('html').attr('lang',lang);
			if ($.inArray(lang,langsRTL) !== -1) $('html').attr('dir','rtl');
			else $('html').attr('dir','ltr');
			if (!getCookie('lang')) createCookie('lang', lang, 31);
		} else {
			lang = 'pl';
			$('html').attr('lang',lang);
			createCookie('lang', lang, 31);
		}

		$.when(loadLANGS(lang)).done(function() {
			if (Object.keys(settings.langs).length > 1) {
				setLangLayout(settings.langs, lang, '#polyglotLanguageSwitcher');
			}
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
						if (getURLparams()['redirurl'] != undefined) {
							window.location = 'http://' + getURLparams()['redirurl']+'?refresh';
						} else {
							window.location.reload();
						}
					} else {
						$('#inputUsername').val('');
						$('#inputPassword').val('');
						authFailed();
					}
				}).fail(function() {
					connFailed();
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
					clientInfo(data);
					if (data['clientState'] == 'AUTHORIZED') {
						if (getURLparams()['redirurl'] != undefined) {
							window.location = 'http://'+getURLparams()['redirurl']+'?refresh';
						} else {
							window.location.reload();
						}
					} else {
						$('#inputUsername').val('');
						$('#inputPassword').val('');
						authFailed();
					}
				}).fail(function(){
					connFailed();
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
					connFailed();
				});
			});

			$('[id^="rules"].link').click(function(){
				showRules();
			});

			$.ajax({
				type: 'POST',
				url: '/api/captiveportal/access/status/' + zoneid + '/',
				dataType:'json',
				data: {user: $('#inputUsername').val(), password: $('#inputPassword').val()}
			}).done(function(data) {
				clientInfo(data);
				if (data['clientState'] == 'AUTHORIZED') {
					$('#login_normal').addClass('hidden')
					$('#logout_undefined').removeClass('hidden');
					$('.row').addClass('ready');
				} else if (data['authType'] == 'none') {
					$('#logout_undefined').removeClass('hidden');
					$('#login_normal').addClass('hidden');
					$('.row').addClass('ready');
				} else {
					$('#login_normal').removeClass('hidden');
					$('.row').addClass('ready');
				}
			}).fail(function(){
				setTimeout(connFailed(),1000);
			});
		});
	});
});
