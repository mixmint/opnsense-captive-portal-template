var settings = {}, langText = {}, lang, langsRTL = ['ar','dv','fa','ha','he','sy'], _root = document.querySelector(':root');

const iso = (timeStamp = Date.now()) => {
    return new Date(timeStamp - (new Date().getTimezoneOffset() * 60 * 1000)).toISOString().slice(0,-5).split('T');
}

$.getMultiScripts = function(batch, path) {
    $.executeInOrder = function(source, code, resolve) {
        if (source == batch[0]) {
            batch.shift();
            eval(code);
            resolve();
        } else {
            setTimeout(function(){$.executeInOrder(source, code, resolve);}, 10);
        }
    }

    var _arr = $.map(batch, function(source) {
        return new Promise((resolve) => {
            $.ajax({
                type: "GET",
                url: (path || '') + source,
                   dataType: "text",
                   success: function(code) {
                       $.executeInOrder(source, code, resolve);
                   },
                   cache: true
            });
        });
    });

    _arr.push($.Deferred(function(deferred) {
        $(deferred.resolve);
    }));

    return $.when.apply($, _arr);
}

$.getUrlparams = function() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = (typeof hash[1] !== 'undefined' ? hash[1].replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`) : '');
    }
    return vars;
}

$.loadSettings = function() {
    var file = 'config/settings.json';
    return $.ajax({
        type: 'GET',
        url: file,
        dataType: 'json'
    }).done(function(data) {
        $.extend(settings, JSON.parse(JSON.stringify(data)));
    });
}

$.loadLangs = function(lang) {
    var file = 'langs/' + lang + '.json';
    return $.ajax({
        type: 'GET',
        url: file,
        dataType: 'json'
    }).done(function(data) {
        data = JSON.parse(JSON.stringify(data));
        $.extend(langText, data);
        $.each(data,function(i, item) {
            if (typeof item === 'object') {
                var content = '';
                $.each(item, function(k, v) {
                    content += '<div class="' + k + '">' + v + '</div>';
                });
                $('#' + i).html(content);
            } else if (~i.indexOf('pagetitle')) {
                $('title').text(item);
            } else if (~i.indexOf('_placeholder')) {
                $('#' + i.replace('_placeholder','')).attr('placeholder',item);
            } else {
                $('#' + i).text(item);
            }
        });
    }).fail(function(data, status) {
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
                $.when(setTimeout($.createCookie('lang', 'en', 31),100)).done(function() {
                    $.setLangLayout(settings.langs, 'en', '#polyglotLanguageSwitcher');
                    $.loadLangs('en');
                });
            },
            afterRender: function(){
                $('#MSG .cpModal-content').append('<p>Unfortunately, the language file could not be loaded. The login system will automatically switch to English.</p>');
            }
        });
        $('#MSG').cpModal('open');
    });
}

$.setLang = function(id) {
    $(id).polyglotLanguageSwitcher({
        effect: 'slide',
        noRefresh: true,
        onChange: function(evt){
            setTimeout($.createCookie('lang', evt.selectedItem, 31),100);
            langText = {};
            $.loadLangs(evt.selectedItem);

            if (typeof $('#inputUsername') !== 'undefined') {
                $('#inputUsername').prop('readonly', false).focus();
            }
        }
    });
}

$.setLangLayout = function(arr, sel, id) {
    var html = '<div id="polyglotLanguageSwitcher"><form action="javascript:void(0);"><select id="polyglot-language-options">';

    $.each(arr, function(key, value) {
        html += '<option id="' + key + '" value="' + key + '"' + (key == sel ? ' selected' : '') + '>' + value + '</option>';
    });

    html += '</select></form></div>';
    $(id).replaceWith(html);
    $.setLang(id);
}

$.clientInfo = function(data) {
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

$.createCookie = function(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

$.getCookie = function(cname) {
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

$.authorisationFailed = function() {
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

$.showRules = function() {
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

$.connectionFailed = function() {
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
