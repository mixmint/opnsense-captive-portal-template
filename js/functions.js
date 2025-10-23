/**
 * @version 2.3.1
 * @package Multilanguage Captive Portal Template for OPNsense
 * @author Mirosław Majka (mix@proask.pl)
 * @copyright (C) 2025 Mirosław Majka <mix@proask.pl>
 * @license GNU/GPL license: http://www.gnu.org/copyleft/gpl.html
 */

let settings = {},
    layout = {},
    langText = {},
    lang,
    localId,
    langsRTL = ['ar','he','fa','ur','dv','ha','sy','ku','ps','yi'],
    _root = document.querySelector(':root'),
    attempt = 0,
    langsFlags = {
        af:"za",am:"et",ar:"sa",az:"az",be:"by",bg:"bg",bn:"bd",bs:"ba",
        ca:"es",cs:"cz",cy:"gb",da:"dk",de:"de",el:"gr",en:"gb",es:"es",
        et:"ee",eu:"es",fa:"ir",fi:"fi",fil:"ph",fr:"fr",ga:"ie",gl:"es",
        gu:"in",he:"il",hi:"in",hr:"hr",hu:"hu",hy:"am",id:"id",is:"is",
        it:"it",ja:"jp",ka:"ge",kk:"kz",km:"kh",kn:"in",ko:"kr",ky:"kg",
        lt:"lt",lv:"lv",mk:"mk",ml:"in",mn:"mn",mr:"in",ms:"my",mt:"mt",
        nb:"no",ne:"np",nl:"nl",pa:"in",pl:"pl",ps:"af",pt:"pt",ro:"ro",
        ru:"ru",si:"lk",sk:"sk",sl:"si",sq:"al",sr:"rs",sv:"se",sw:"ke",
        ta:"in",te:"in",th:"th",tr:"tr",uk:"ua",ur:"pk",uz:"uz",vi:"vn",
        zh:"cn",zu:"za"
    };

const shortcutMap = {
    u: "#inputUsername",
    p: "#inputPassword",
    a: "#login-rules",
    r: "#rules",
    i: "#signin, #signin_anon",
    o: "#logoff",
    l: ".trigger, a.current",
    h: "#launchTour"
};

const allowedAttrs    = ['aria-label', 'title'];
const hour12Countries = ['us','ca','ph','au','nz','mx','co','pk','in','ie','my','sg','bd','jm','gb'];
var loadedScripts     = new Set();
var loadedStyles      = new Set();

const isAllowedAttr = (attr) => allowedAttrs.includes(attr.toLowerCase()) || attr.toLowerCase().startsWith('data-');

const loadJson = (path, file) => {
    return $.ajax({ url: `${path}/${file}.json`, dataType: 'json' });
}

const waitForObject = async (element, maxWait = 2000) => {
    const startTime = Date.now();
    while (Object.keys(element).length === 0) {
        if (Date.now() - startTime > maxWait) {
            console.error('Timeout waiting for \'element\' object to load');
            return false;
        }
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    return true;
};

const formatISO = (timeStamp = Date.now()) => {
    return new Date(timeStamp - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0,-5).split('T');
}

const updateUIWithLangText = (texts) => {
    Object.entries(texts).forEach(([key, value]) => {
        if (key.startsWith('attr_')) {
            const targetId = key.replace('attr_', '');
            if (typeof value === 'object') {
                Object.entries(value).forEach(([attrName, attrValue]) => {
                    if (isAllowedAttr(attrName)) {
                        $(`#${targetId}`).attr(attrName, attrValue);
                    }
                });
            }
        } else if (typeof value === 'object') {
            const content = Object.entries(value)
            .map(([k, v]) => `<div class="${k}">${v}</div>`)
            .join('');
            $(`#${key}`).html(content);
        } else if (key.includes('pagetitle')) {
            $('title').text(value);
        } else if (key.includes('_placeholder')) {
            $(`#${key.replace('_placeholder', '')}`).attr('placeholder', value);
        } else {
            $(`#${key}`).text(value);
        }
    });
};

const isValidUrl = (string) => {
    try {
        new URL(string);
        return true;
    } catch (err) {
        return false;
    }
}

const showModal = ({ title, subtitle, content, iconText = '&#9888;', customStyles = {}, callback, onOpen, onClose }) => {
    const defaultStyles = {
        padding: 20,
        headerColor: settings.modal.show_rules_header_color,
        iconColor: settings.modal.icon_color,
        background: settings.modal.bg_color,
        overlayColor: settings.modal.overlay_color,
        borderBottom: false,
        timeout: false,
        timeoutProgressbar: false,
        pauseOnHover: false,
        closeButton: true,
        closeOnEscape: true,
        overlayClose: true
    };

    const styles = { ...defaultStyles, ...customStyles };

    if (settings.layout.a11y && settings.layout.a11y_contrast) {
        Object.entries(styles).forEach(([key, value]) => {
            styles[key] = $.adjustContrast(value, {
                factor: settings.layout.a11y_factor,
                treshhold: settings.layout.a11y_treshhold
            });
        });
    }

    $('#MSG').cpModal({
        title,
        subtitle,
        headerColor: styles.headerColor,
        iconColor: styles.iconColor,
        background: styles.background,
        iconText: iconText,
        padding: styles.padding,
        width: styles.width,
        top: styles.top,
        rtl: document.documentElement.dir === 'rtl',
        borderBottom: styles.borderBottom,
        timeout: styles.timeout,
        timeoutProgressbar: styles.timeoutProgressbar,
        pauseOnHover: styles.pauseOnHover,
        overlayColor: styles.overlayColor,
        closeButton: styles.closeButton,
        closeOnEscape: styles.closeOnEscape,
        overlayClose: styles.overlayClose,
        onOpening: () => {
            if (onOpen) {
                onOpen();
            }
        },
        onClosed: () => {
            $('#MSG').replaceWith('<div id="MSG"></div>');
            if (onClose) {
                onClose();
            }
        },
        afterRender: () => {
            $('#MSG .cpModal-content').append(content);
        }
    });

    $('#MSG').cpModal('open');
};

$.getMultiResources = function(batch, basePath) {
    var executeInOrder = function(source, code, resolve) {
        if (source == batch[0]) {
            batch.shift();

            if (source.endsWith('.js')) {
                if (!loadedScripts.has(source)) {
                    Function(`"use strict";${code}`)($);
                    loadedScripts.add(source);
                }
            } else if (source.endsWith('.css')) {
                if (!loadedStyles.has(source)) {
                    var style = document.createElement('style');
                    style.textContent = code;
                    document.head.appendChild(style);
                    loadedStyles.add(source);
                }
            }

            resolve();
        } else {
            setTimeout(function() { executeInOrder(source, code, resolve); }, 10);
        }
    };

    var _arr = $.map(batch, function(source) {
        var url = source;

        if (!source.includes('/')) {
            var folderPath = basePath ? basePath + '/' : '';
            if (source.endsWith('.js')) {
                url = 'js/' + folderPath + source;
            } else if (source.endsWith('.css')) {
                url = 'css/' + folderPath + source;
            }
        }

        return new Promise(function(resolve) {
            $.ajax({
                type: "GET",
                url: url,
                dataType: "text",
                cache: true,
                success: function(code) { executeInOrder(source, code, resolve); }
            });
        });
    });

    _arr.push($.Deferred(function(deferred) { $(deferred.resolve); }));

    return $.when.apply($, _arr);
};

$.getUrlparams = () => {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

    for(var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = (typeof hash[1] !== 'undefined' ? hash[1].replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`) : '');
    }

    return vars;
}

$.loadSettings = async () => {
    try {
        const response = await loadJson('/config', 'settings');
        Object.assign(settings, response);

    } catch (error) {
        console.error("Failed to load settings:", error);
    }
};

$.loadLangs = async (language = settings.default_lang) => {
    try {
        const response = await loadJson('/langs', language);
        Object.assign(langText, response);
        updateUIWithLangText(langText);
    } catch {
        showModal({
            title: 'An error occurred',
            subtitle: 'Translation content is unavailable',
            content: `<p>Unfortunately, the language file could not be loaded. The login system will automatically switch to ${settings.langs[settings.default_lang]}.</p>`,
            iconText: '&#9888;',
            customStyles: {
                headerColor: settings.modal.auth_failed_header_color,
                overlayColor: settings.modal.overlay_color,
                timeout: settings.modal.timeout,
                timeoutProgressbar: true,
                pauseOnHover: true
            },
            onOpen: async () => {
                await $.loadLangs(settings.default_lang);
            },
            onClose: () => {
                $.setLangLayout(settings.langs, settings.default_lang, '#polyglotLanguageSwitcher');
                $.createCookie('lang', settings.default_lang, 31);
            }
        });
    }
};

$.setLang = (id) => {
    $(id).polyglotLanguageSwitcher({
        effect: 'slide',
        noRefresh: true,
        onChange: (evt) => {
            $.createCookie('lang', evt.selectedItem, 31);
            langText = {};
            $.loadLangs(evt.selectedItem);

            if (typeof $('#inputUsername') !== 'undefined') {
                $('#inputUsername').prop('readonly', false).focus();
            }
        }
    });
}

$.setLangLayout = (langs, selectedLang, container) => {
    const layoutType   = settings.layout.lang_layout || 'select';
    const langFlagsDir = settings.layout.lang_flags_dir || '4x3';
    let html = '';

    switch (layoutType) {
        case 'flags-select':
            html = `
                <form action="javascript:void(0);">
                    <select id="polyglot-language-options" class="flags-select ${langFlagsDir}">
                        ${Object.entries(langs).map(([key, value]) =>
                            `<option id="${key}" value="${key}" data-title="${value}" aria-label="${value}"${key === selectedLang ? ' selected' : ''}>
                                ${value}
                            </option>`).join('')}
                    </select>
                </form>`;
            break;

        case 'flags-only-select':
            html = `
                <form action="javascript:void(0);">
                    <select id="polyglot-language-options" class="flags-only-select ${langFlagsDir}">
                        ${Object.entries(langs).map(([key, value]) =>
                            `<option id="${key}" value="${key}" data-title="${value}" aria-label="${value}"${key === selectedLang ? ' selected' : ''}>
                                &nbsp;
                            </option>`).join('')}
                    </select>
                </form>`;
            break;

        case 'flags-list':
            html = `
                <ul id="polyglotLanguageSwitcher" class="d-flex flex-wrap justify-content-end gap-3 pb-3">
                    ${Object.entries(langs).map(([key, value]) => {
                        const flag = langsFlags[key] || key;
                        return `
                            <li id="${key}" data-lang="${key}" class="flag-item${key === selectedLang ? ' selected' : ''}" title="${value}" aria-label="${value}" role="button" tabindex="0">
                                <img src="/images/flags/${langFlagsDir}/${flag}.svg" alt="${value}" data-title="${value}" />
                            </li>`;
                    }).join('')}
                </ul>`;
            break;

        case 'select':
        default:
            html = `
                <form action="javascript:void(0);">
                    <select id="polyglot-language-options">
                        ${Object.entries(langs).map(([key, value]) =>
                            `<option id="${key}" value="${key}" data-title="${value}" aria-label="${value}"${key === selectedLang ? ' selected' : ''}>
                                ${value}
                            </option>`).join('')}
                    </select>
                </form>`;
            break;
    }

    $(container).addClass(layoutType + ' flags-' + langFlagsDir);
    $(container).attr('aria-label', $(container).attr('aria-label') || langText.cp_portal_select_lang);
    $(container).attr('data-trigger-label', langText.cp_portal_select_lang);

    $(container).html(html);
    $.setLang(container);

    if (layoutType === 'flags-list') {
        $('#polyglotLanguageSwitcher li').on('click', function () {
            const lang = $(this).data('lang');
            $.createCookie('lang', lang, 31);

            const url = new URL(window.location.href);
            url.searchParams.set('lang', lang);
            url.hash = '#';
            window.location.href = url.toString();
        });
    }
};

$.clientInfo = async (data) => {
    await waitForObject(langText);

    const container = $(`#cp_portal_event_${data.authType}`);

    if (!container.length) {
        return;
    }

    const appendInfo = (wrapperClass, title, value, className = 'config-address') => container.append(`<p class="${wrapperClass}"><span class="if-title">${title}</span> <span class="${className}">${value}</span></p>`);

    data.ipAddress && appendInfo('flex-50', langText.cp_portal_ifconfig_ip_address, data.ipAddress);
    data.macAddress && appendInfo('flex-50', langText.cp_portal_ifconfig_mac_address, data.macAddress);

    if (typeof data.startTime === 'number') {
        const date    = new Date(data.startTime * 1000);
        const lang    = document.documentElement.lang;
        const country = langsFlags[lang];
        const locale  = country ? `${lang}-${country.toUpperCase()}` : null;

        const hour12  = country ? hour12Countries.includes(country.toLowerCase()) : false;

        const options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour12
        };

        const formatted = locale
            ? date.toLocaleString(locale, options)
            : formatISO(data.startTime * 1000).join(' ');

        appendInfo('flex-100', langText.cp_session_start_time, formatted, 'config-info');
    }

    if (data.acc_session_timeout != null && $('.wrapperTimeLeft').length === 0) {
        let timeLeft = parseInt(data.acc_session_timeout, 10);
        const sinceLogon = (Date.now() / 1000) - parseInt(data.startTime, 10);
        timeLeft = Math.max(timeLeft - sinceLogon, 0);

        appendInfo('wrapperTimeLeft flex-100', langText.cp_session_time_left, updateTimeLeft(timeLeft), 'time-left-value');

        const timer = setInterval(() => {
            timeLeft -= 60;

            if (timeLeft <= 0) {
                clearInterval(timer);
                showModal({
                    title: langText.cp_session_timeout_title,
                    subtitle: langText.cp_session_timeout_info_title,
                    content: langText.cp_session_timeout_content,
                    iconText: '&#x27f3;',
                    customStyles: {
                        timeout: settings.modal.timeout,
                        timeoutProgressbar: true,
                        pauseOnHover: true
                    },
                    onClose: () => window.location.reload()
                });
            }

            $('.wrapperTimeLeft .time-left-value').text(updateTimeLeft(timeLeft));
        }, 60000);
    }
};

const updateTimeLeft = (timeLeft) => {
    const days = Math.floor(timeLeft / 43200);
    const hours = Math.floor((timeLeft % 43200) / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);

    const formatTime = (value, texts) => {
        if (value === 0) {
            return '';
        }

        const lastTwoDigits = value % 100;
        const lastDigit = value % 10;

        if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
            return `${value} ${texts.other}`;
        }

        if (value === 1) {
            return `${value} ${texts.one}`;
        }

        if (lastDigit >= 2 && lastDigit <= 4) {
            return `${value} ${texts.few}`;
        }

        return `${value} ${texts.other}`;
    };

    const daysText = formatTime(days, {
        one: langText.cp_session_time_left_one_day,
        few: langText.cp_session_time_left_two_four_days,
        other: langText.cp_session_time_left_other_days
    });

    const hoursText = formatTime(hours, {
        one: langText.cp_session_time_left_one_hour,
        few: langText.cp_session_time_left_two_four_hours,
        other: langText.cp_session_time_left_other_hours
    });

    const minutesText = (days === 0 && hours === 0 && minutes < 1)
        ? langText.cp_session_time_left_less_than_minute
        : formatTime(minutes, {
            one: langText.cp_session_time_left_one_minute,
            few: langText.cp_session_time_left_two_four_minutes,
            other: langText.cp_session_time_left_other_minutes
        });

    return [daysText, hoursText, minutesText].filter(Boolean).join(', ');
};

$.createCookie = (name, value, days) => {
    var d = new Date();

    d.setTime(d.getTime() + (days*24*60*60000));

    var expires     = "expires=" + d.toGMTString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

$.getCookie = (cname) => {
    var name          = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca            = decodedCookie.split(';');

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

$.authorisationFailed = (onClose = null) => {
    var modal = {
        title: langText.cp_error_login_err,
        subtitle: langText.cp_error_info_title,
        content: langText.cp_error_info + langText.cp_error_solution_title + langText.cp_error_solution,
        iconText: '&#9888;',
        customStyles: {
            headerColor: settings.modal.auth_failed_header_color,
            overlayColor: settings.modal.overlay_color,
            timeout: settings.modal.timeout,
            timeoutProgressbar: true,
            pauseOnHover: true
        }
    };

    if (onClose instanceof Object) {
        Object.assign(modal, onClose);
    }

    showModal(modal);
}

$.showRules = () => {
    showModal({
        title: langText.cp_rules_title,
        subtitle: langText.cp_rules_info_title,
        content: langText.cp_rules_content,
        iconText: '&#167;',
        customStyles: {
            width: 800,
            top: 70,
            bottom: 70
        }
    });
};

$.connectionFailed = () => {
    showModal({
        title: langText.cp_error_title,
        subtitle: langText.cp_error_server_connection,
        iconText: '&#9888;',
        customStyles: {
            headerColor: settings.modal.conn_failed_header_color,
            overlayColor: settings.modal.overlay_color,
            borderBottom: false,
        }
    });
}

$.connectionBlocked = (loginDelay) => {
    showModal({
        title: langText.cp_login_attempt_title,
        subtitle: langText.cp_login_attempt_info_title,
        iconText: '&#9888;',
        content: sprintf(langText.cp_login_attempt_content, settings.login.attempts, settings.login.delay, (settings.login.delay == 1 ? langText.cp_login_attempt_minute : langText.cp_login_attempt_minutes)),
        customStyles: {
            headerColor: settings.modal.conn_failed_header_color,
            overlayColor: settings.modal.overlay_color,
            borderBottom: false,
            timeout: new Date(loginDelay - Date.now()).getTime(),
            timeoutProgressbar: true,
            overlayClose: false,
            closeButton: false,
            closeOnEscape: false
        }
    });
};

$.connectionLogon = (data) => {
    if ($.isAttempt(data)) {
        $.connectionBlocked(data.local);
    }

    if (data.clientState == 'AUTHORIZED') {
        if (settings.login.control && typeof data.loginTime !== 'undefined') {
            delete data.loginTime;
        }

        if (settings.layout.redirect_url.length > 0 && isValidUrl(settings.layout.redirect_url)) {
            window.location.replace(settings.layout.redirect_url);
        } else if ($.getUrlparams()['redirurl'] != undefined) {
            window.location = $.getUrlparams()['redirurl'] + '?refresh';
        } else {
            window.location.reload();
        }
    } else {
        $('#inputUsername, #inputPassword').val('');

        if (settings.login.control && settings.login.attempts > 0) {
            attempt++;
            var ts = Date.now();
            data.loginTime = new Date(Date.now());

            if (settings.login.attempts - attempt === 0) {
                data.loginTime.setTime(data.loginTime.getTime() + settings.login.delay*60000);
                document.cookie = "loginTime=" + data.loginTime + ";expires=" + data.loginTime + ";path=/";
                $.authorisationFailed(
                    {onClose: () => $.connectionBlocked(data.loginTime)}
                );
                $.setAttempt(data);
            }
        }

        $.authorisationFailed();
    }
}

$.connectionStatus = (data) => {
    if (data.clientState != 'AUTHORIZED' && data.authType != undefined && null == localId) {
        localId = [...data.ipAddress].map((x, i) => (x.codePointAt() ^ data.authType.charCodeAt(i % data.authType.length) % 255).toString(16).padStart(2,'0')).join('');
    }

    if (data.clientState == 'AUTHORIZED') {
        $('#login_normal').addClass('d-none');
        $('#logout_undefined').removeClass('d-none');
    } else if (data.authType == 'none') {
        $('#login_normal').addClass('d-none');
        $('#login_none').removeClass('d-none');
    } else {
        if (settings.login.control && settings.login.attempts > 0 && $.isAttempt(data)) {
            $.connectionBlocked(data.local);
        }
        $('#login_normal').removeClass('d-none');
    }

    $('.row, .footer-isp-info').addClass('ready');
}

$.isAttempt = (data) => {
    $.getAttempt(data);
    if (null == data.local) {
        return false;
    }

    var now     = new Date(Date.now());
    var control = new Date($.getCookie('loginTime'));
    data.local  = new Date(
        JSON.parse(
            String.fromCharCode(...(data.local).match(/.{1,2}/g).map((e,i) => parseInt(e, 16) ^ localId.charCodeAt(i % localId.length) % 255))
        ).loginTime
    );

    if (now >= data.local) {
        window.localStorage.removeItem('loginAttempt');
        return false;
    }

    if (now < data.local || control != data.local) {
        return true;
    }

    return false;
}

$.setAttempt = (batch) => {
    batch = JSON.stringify(batch);
    batch = [...batch].map((x, i) => (x.codePointAt() ^ localId.charCodeAt(i % localId.length) % 255).toString(16).padStart(2,'0')).join('');
    window.localStorage.setItem('loginAttempt', batch);
}

$.getAttempt = (data) => {
    data.local = window.localStorage.getItem('loginAttempt');
    return data;
}

$.adjustContrast = (value, opts = {}) => {
    if (!settings?.layout?.a11y) {
        return value;
    }

    if (typeof value !== 'string') {
        return value;
    }

    const FACTOR          = typeof opts.factor === 'number' ? Math.max(0, Math.min(1, opts.factor)) : 0.2;
    const LIGHT_THRESHOLD = typeof opts.threshold === 'number' ? opts.threshold : 0.5;

    const clamp = (v, a = 0, b = 255) => Math.max(a, Math.min(b, Math.round(v)));

    const srgbToLinear = (c) => {
        c = c / 255;

        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    const luminance = (r,g,b) => 0.2126*srgbToLinear(r) + 0.7152*srgbToLinear(g) + 0.0722*srgbToLinear(b);

    const parseHex = (hex) => {
        const h = hex.replace('#','');
        if (h.length === 3) {
            return {
                r: parseInt(h[0]+h[0],16),
                g: parseInt(h[1]+h[1],16),
                b: parseInt(h[2]+h[2],16),
                a: 1,
                format: 'hex3'
            };
        }

        if (h.length === 4) {
            return {
                r: parseInt(h[0]+h[0],16),
                g: parseInt(h[1]+h[1],16),
                b: parseInt(h[2]+h[2],16),
                a: parseInt(h[3]+h[3],16)/255,
                format: 'hex4'
            };
        }

        if (h.length === 6) {
            return {
                r: parseInt(h.slice(0,2),16),
                g: parseInt(h.slice(2,4),16),
                b: parseInt(h.slice(4,6),16),
                a: 1,
                format: 'hex6'
            };
        }

        if (h.length === 8) {
            return {
                r: parseInt(h.slice(0,2),16),
                g: parseInt(h.slice(2,4),16),
                b: parseInt(h.slice(4,6),16),
                a: parseInt(h.slice(6,8),16)/255,
                format: 'hex8'
            };
        }

        return null;
    };

    const parseRgb = (str) => {
        const m = str.match(/rgba?\(\s*([^\)]+)\s*\)/i);

        if (!m) {
            return null;
        }

        const parts = m[1].split(',').map(p => p.trim());
        const r     = parseFloat(parts[0]);
        const g     = parseFloat(parts[1]);
        const b     = parseFloat(parts[2]);
        const a     = parts.length === 4 ? parseFloat(parts[3]) : 1;

        return { r, g, b, a, format: parts.length === 4 ? 'rgba' : 'rgb' };
    };

    const formatColor = (col) => {
        if (col.origFormat.startsWith('hex')) {
            const toHex = n => n.toString(16).padStart(2,'0');
            if (col.origFormat === 'hex4' || col.origFormat === 'hex8') {
                const alpha = clamp(Math.round(col.a * 255), 0, 255);
                return `#${toHex(col.r)}${toHex(col.g)}${toHex(col.b)}${toHex(alpha)}`;
            }

            return `#${toHex(col.r)}${toHex(col.g)}${toHex(col.b)}`;
        }

        if (col.origFormat === 'rgb') {
            return `rgb(${col.r}, ${col.g}, ${col.b})`;
        }

        if (col.origFormat === 'rgba') {
            return `rgba(${col.r}, ${col.g}, ${col.b}, ${+col.a.toFixed(3)})`;
        }

        return null;
    };

    const adjustRGB = (r,g,b,a, origFormat) => {
        const lum = luminance(r,g,b);
        const isLight = lum >= LIGHT_THRESHOLD;
        let nr, ng, nb;

        if (isLight) {
            nr = clamp(r + (255 - r) * FACTOR);
            ng = clamp(g + (255 - g) * FACTOR);
            nb = clamp(b + (255 - b) * FACTOR);
        } else {
            nr = clamp(r * (1 - FACTOR));
            ng = clamp(g * (1 - FACTOR));
            nb = clamp(b * (1 - FACTOR));
        }
        return { r: nr, g: ng, b: nb, a, origFormat };
    };

    const colorRegex = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b|rgba?\(\s*([^)]+)\)/g;

    if (!value.match(colorRegex)) {
        return value;
    }

    const replaced = value.replace(colorRegex, (match) => {
        match      = match.trim();
        let parsed = null;

        if (match.startsWith('#')) {
            parsed = parseHex(match);

            if (!parsed) {
                return match;
            }

            parsed.origFormat = parsed.format.startsWith('hex') ? parsed.format : 'hex6';
        } else if (match.toLowerCase().startsWith('rgb')) {
            parsed = parseRgb(match);

            if (!parsed) {
                return match;
            }

            parsed.origFormat = parsed.format;
        } else {
            return match;
        }

        const adjusted = adjustRGB(parsed.r, parsed.g, parsed.b, parsed.a, parsed.origFormat);
        return formatColor(adjusted);
    });

    return replaced;
};

$.initKeyboardAccessibility = () => {
    if (!settings?.layout?.a11y) {
        return;
    }

    const baseSelectors = [
        "#inputUsername",
        "#inputPassword",
        "#login-rules",
        "#rules",
        "#signin",
        "#signin_anon",
        "#logoff",
        ".cpModal-button-close",
        "a.current"
    ];

    const langSelectors = Object.keys(langsFlags).map(lang => `#${lang}`);
    const selectors = [...baseSelectors, ...langSelectors];
    const elements = document.querySelectorAll(selectors.join(","));

    elements.forEach(el => {
        if (!el.hasAttribute("tabindex")) {
            el.setAttribute("tabindex", "0");
        }

        el.addEventListener("focus", () => el.classList.add("kbd-focus"));
        el.addEventListener("blur", () => el.classList.remove("kbd-focus"));

        el.addEventListener("keydown", e => {
            switch (e.key) {
                case "Enter":
                case " ":
                    e.preventDefault();
                    if (el.type === "checkbox" && e.key === " ") {
                        el.checked = !el.checked;
                        el.dispatchEvent(new Event("change", { bubbles: true }));
                    } else {
                        el.click();
                    }
                    break;

                case "Escape":
                    document.querySelector(".cpModal-button-close")?.click();
                    break;

                case "ArrowLeft": {
                    const prevLang = Array.from(langSelectors)
                    .map(sel => document.querySelector(sel))
                    .find(x => x && x.classList.contains("current"));
                    if (prevLang) {
                        let idx = langSelectors.indexOf(`#${prevLang.id}`);
                        idx = (idx - 1 + langSelectors.length) % langSelectors.length;
                        document.querySelector(langSelectors[idx])?.click();
                    }
                    break;
                }

                case "ArrowRight": {
                    const currLang = Array.from(langSelectors)
                    .map(sel => document.querySelector(sel))
                    .find(x => x && x.classList.contains("current"));
                    if (currLang) {
                        let idx = langSelectors.indexOf(`#${currLang.id}`);
                        idx = (idx + 1) % langSelectors.length;
                        document.querySelector(langSelectors[idx])?.click();
                    }
                    break;
                }
            }
        });
    });

    let keyBuffer = [];
    let bufferTimeout;
    const pressedKeys = new Set();

    const resetBuffer = () => {
        keyBuffer = [];
        clearTimeout(bufferTimeout);
        bufferTimeout = null;
    };

    const triggerLang = code => {
        const langEl = document.getElementById(code);
        if (langEl) {
            langEl.click();
            langEl.classList.add("flash");
            setTimeout(() => langEl.classList.remove("flash"), 300);
        }
    };

    const triggerShortcut = letter => {
        const selector = shortcutMap[letter];
        if (!selector) {
            return;
        }

        for (const sel of selector.split(",")) {
            const el = document.querySelector(sel.trim());
            if (!el || el.offsetParent === null) {
                continue;
            }

            if (el.tagName === "INPUT") {
                if (el.type === "checkbox" || el.type === "radio") {
                    el.checked = !el.checked;
                    el.dispatchEvent(new Event("change", { bubbles: true }));
                } else {
                    el.focus();
                }
            } else if (el.tagName === "TEXTAREA") {
                el.focus();
            } else {
                el.click();
            }

            break;
        }
    };

    let leftShiftPressed = false;
    let leftAltPressed = false;

    document.addEventListener("keydown", e => {
        const activeInput = ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName);
        const key = e.key.toLowerCase();

        if (e.code === "ShiftLeft") {
            leftShiftPressed = true;
        }

        if (e.code === "AltLeft") {
            leftAltPressed = true;
        }

        if (e.shiftKey && /^[a-z]$/.test(key) && !leftAltPressed) {
            let isShortcut = pressedKeys.size > 0 || !activeInput;
            pressedKeys.add(key);

            if (pressedKeys.size === 2) {
                const combo = Array.from(pressedKeys).sort().join("");
                if (langsFlags[combo]) {
                    e.preventDefault();
                    triggerLang(combo);
                    pressedKeys.clear();
                    resetBuffer();
                    return;
                }
            }

            keyBuffer.push(key);
            if (bufferTimeout) clearTimeout(bufferTimeout);
            bufferTimeout = setTimeout(resetBuffer, 1000);

            if (keyBuffer.length === 2) {
                const code = keyBuffer.join("");
                if (langsFlags[code]) {
                    e.preventDefault();
                    triggerLang(code);
                }
                resetBuffer();
            }

            if (isShortcut && activeInput) {
                e.preventDefault();
            }

            return;
        }

        if (leftShiftPressed && leftAltPressed && /^[a-z]$/.test(key)) {
            e.preventDefault();
            triggerShortcut(key);
        }
    });

    document.addEventListener("keyup", e => {
        if (e.code === "ShiftLeft") leftShiftPressed = false;
        if (e.code === "AltLeft") leftAltPressed = false;
        pressedKeys.delete(e.key.toLowerCase());
    });
};

$.initTour = () => {
    if (!langText) {
        return null;
    }

    const portal = document.querySelector(".captiveportal");
    if (!portal) {
        return null;
    }

    const createTourTrigger = () => {
        if (document.getElementById("tourBtn")) {
            return;
        }

        const keysWrapper     = document.createElement("div");
        keysWrapper.id        = "a11y-keys-wrapper";
        keysWrapper.innerHTML = `
            <div id="a11y-keys"></div>
            <div id="a11y-lang-keys"></div>
        `;

        const tourWrapper         = document.createElement("div");
        tourWrapper.id            = "tourBtn";
        tourWrapper.style.display = "block";
        tourWrapper.innerHTML     = `
            <div class="helper help-btn">
                <a id="launchTour" href="javascript:void(0);">
                    <h3>
                        <small>${langText.a11y_helper1 || "Need help?"}</small>
                        <div>${langText.a11y_helper2 || "Click here"}</div>
                    </h3>
                </a>
            </div>
        `;

        portal.appendChild(keysWrapper);
        portal.appendChild(tourWrapper);
    };

    const breakpoint = settings.a11y_helper_breakpoint || 1200;

    const updateTourTriggerVisibility = () => {
        const tourBtn = document.getElementById("tourBtn");
        const keysWrapper = document.getElementById("a11y-keys-wrapper");

        if (window.innerWidth >= breakpoint) {
            if (tourBtn) {
                tourBtn.style.display = "block";
                if (keysWrapper) keysWrapper.style.display = "block";
            } else {
                createTourTrigger();
            }
        } else {
            if (tourBtn) {
                tourBtn.style.display = "none";
                if (keysWrapper) keysWrapper.style.display = "none";
            }
        }
    };

    updateTourTriggerVisibility();

    window.addEventListener("resize", updateTourTriggerVisibility);

    const allowedAttrs = new Set([
        "data-title",
        "data-content",
        "data-step",
        "data-group",
        "data-position",
        "data-disable-interaction",
        "data-tooltip-class",
        "data-highlight-class"
    ]);

    const isVisible = (el) => {
        if (!el) {
            return false;
        }

        let current = el;
        while (current && current !== document.body) {
            const style = window.getComputedStyle(current);
            if (style.display === "none" || current.classList.contains("d-none")) {
                return false;
            }

            current = current.parentElement;
        }
        return true;
    };

    const findShortcutForElement = (containerEl) => {
        if (!window.shortcutMap) {
            return "";
        }

        for (const [letter, selectorString] of Object.entries(shortcutMap)) {
            const selectors = selectorString.split(",").map(s => s.trim()).filter(Boolean);
            for (const sel of selectors) {
                const targets = document.querySelectorAll(sel);
                for (const target of targets) {
                    if (!target) {
                        continue;
                    }

                    if (target === containerEl || containerEl.contains(target)) {
                        return `Shift + Alt + ${letter.toUpperCase()}`;
                    }
                }
            }
        }
        return "";
    };

    const getLabelForElement = (targetEl) => {
        let label = targetEl.getAttribute("aria-label") || "";
        if (!label) {
            const ariaChild = targetEl.querySelector("[aria-label]");
            if (ariaChild && isVisible(ariaChild)) {
                label = ariaChild.getAttribute("aria-label").trim();
            }
        }

        if (!label) {
            const lbl = targetEl.querySelector("label[for]");
            if (lbl && isVisible(lbl)) {
                label = lbl.textContent.trim();
            }
        }

        if (!label) {
            const innerField = targetEl.querySelector("input, textarea, select, button");
            if (innerField && innerField.placeholder && isVisible(innerField)) {
                label = innerField.placeholder.trim();
            }
        }

        if (!label) {
            label = targetEl.textContent.trim();
        }

        return label;
    };

    const steps             = [];
    const processedElements = new Set();

    const fillSteps = () => {
        let allDone  = true;
        steps.length = 0;

        for (const langKey of Object.keys(langText)) {
            const idx = langKey.indexOf("_data-");
            if (idx === -1) {
                continue;
            }

            const prefix = langKey.substring(0, idx);
            const attrWithData = langKey.substring(idx + 1);
            if (!allowedAttrs.has(attrWithData)) {
                continue;
            }

            const targetEl = document.getElementById(prefix);
            if (!targetEl || !isVisible(targetEl)) {
                allDone = false;
                continue;
            }

            let value = String(langText[langKey] || "").trim();
            if (!value) {
                continue;
            }

            const shortcut = findShortcutForElement(targetEl);
            const label    = getLabelForElement(targetEl);

            try {
                value = sprintf(value, shortcut, label);
            } catch (e) {
            }

            let step = steps.find(s => s.target === `#${prefix}`);
            if (!step) {
                step = { target: `#${prefix}` };
                steps.push(step);
            }

            const key = attrWithData.replace("data-", "");
            step[key] = value;
        }

        for (const step of steps) {
            if (step.step) {
                step.order = parseInt(step.step, 10) || 999;
                delete step.step;
            }
        }

        return allDone;
    };

    const maxRetries = 10;
    let retries      = 0;

    const retryInterval = setInterval(() => {
        const done = fillSteps();
        retries++;
        if (done || retries >= maxRetries) {
            clearInterval(retryInterval);
        }
    }, 200);

    const finalSteps = steps.sort((a, b) => {
        const ao = a.order || 999;
        const bo = b.order || 999;
        return ao - bo;
    });

    const tourOptions = {
        steps: finalSteps,
        completeOnFinish: true,
        showButtons: true,
        showStepDots: true,
        showStepProgress: true,
        autoScroll: true,
        debug: false,
        nextLabel: langText.a11y_helper_next || 'Next',
        prevLabel: langText.a11y_helper_prev || 'Back',
        finishLabel: langText.a11y_helper_done || 'Done'
    };

    if (typeof tourguide === "undefined" || typeof tourguide.TourGuideClient !== "function") {
        console.warn("TourGuide library not found.");
        return null;
    }

    const tour = new tourguide.TourGuideClient(tourOptions);

    return tour;
};
