/**
 * @version 2.0.6
 * @package Multilanguage Captive Portal Template for OPNsense
 * @author Mirosław Majka (mix@proask.pl)
 * @copyright (C) 2025 Mirosław Majka <mix@proask.pl>
 * @license GNU/GPL license: http://www.gnu.org/copyleft/gpl.html
 */

$(document).ready(() => {
    $.when($.loadSettings()).done(() => {
        applyCssSettings();
        initializeVantaEffect();
        updateLogo();
        setupLanguage();
        setupRulesSection();
        configureInputFocusBehavior();
        setupAuthHandlers();
        setupRulesLink();
        checkConnectionStatus();
    });
});

const applyCssSettings = () => {
    if (settings.css_params) {
        Object.entries(settings.css_params).forEach(([key, value]) => {
            _root.style.setProperty(`--${key}`, value);
        });
    }
};

const initializeVantaEffect = () => {
    if (settings.animate?.effect) {
        const effect = settings.animate.effect.toLowerCase();
        const preset = settings.animate.preset[effect];
        const scripts = [`three.r134.min.js`, `vanta.${effect}.min.js`];

        $.when($.getMultiScripts(scripts, 'js/vanta/')).done(() => {
            window['VANTA'][effect.toUpperCase()](
                { ...settings.animate.params, ...preset }
            );
        });
    }
};

const updateLogo = () => {
    if (settings.logo) {
        $('#logo').html(
            `<img class="brand-logo" src="${settings.logo}" height="150" width="150">`
        );
    }
};

const setupLanguage = () => {
    const browserLang = (navigator.language || navigator.userLanguage).substring(0, 2).toLowerCase();
    let lang = $.getCookie('lang') || browserLang;

    if (!(lang in settings.langs)) {
        lang = settings.default_lang;
    }

    $('html').attr({
        lang,
        dir: langsRTL.includes(lang) ? 'rtl' : 'ltr',
    });

    if (!$.getCookie('lang')) {
        $.createCookie('lang', lang, 31);
    }

    $.when($.loadLangs(lang)).done(() => {
        if (Object.keys(settings.langs).length > 1) {
            $('.captiveportal').hasClass('single-lang')
                ? $('.captiveportal').removeClass('single-lang').addClass('multiple-langs')
                : $('.captiveportal').addClass('multiple-langs');
            $.setLangLayout(settings.langs, lang, '#polyglotLanguageSwitcher');
        } else {
            $('.captiveportal').hasClass('multiple-langs')
                ? $('.captiveportal').removeClass('multiple-langs').addClass('single-lang')
                : $('.captiveportal').addClass('single-lang');
        }
    });
};

const setupRulesSection = () => {
    if (settings.layout.enable_rules) {
        toggleSignInButtons('#login-rules', '#signin');
        toggleSignInButtons('#login-rules-anon', '#signin_anon');
    } else {
        $('.rules-checkbox').html('<br />');
    }
};

const toggleSignInButtons = (checkboxSelector, buttonSelector) => {
    $(checkboxSelector).prop('checked', false);
    $(buttonSelector).prop('disabled', true);

    $(checkboxSelector).on('click', function () {
        $(buttonSelector).prop('disabled', !$(this).prop('checked'));
    });
};

const configureInputFocusBehavior = () => {
    $('input[readonly]').on('focus', function () {
        $(this).prop('readonly', false);
    });
    $('input:not([readonly])').on('blur', function () {
        $(this).prop('readonly', true);
    });
};

const setupAuthHandlers = () => {
    $('#signin').on('click', handleSignIn);
    $('#signin_anon').on('click', handleAnonymousSignIn);
    $('#logoff').on('click', handleLogoff);
};

const handleSignIn = (event) => {
    event.preventDefault();
    authenticateUser({
        user: $('#inputUsername').val(),
        password: $('#inputPassword').val(),
    });
};

const handleAnonymousSignIn = (event) => {
    event.preventDefault();
    authenticateUser({ user: '', password: '' });
};

const handleLogoff = (event) => {
    event.preventDefault();
    $.ajax({
        type: 'POST',
        url: `/api/captiveportal/access/logoff/${zoneid}/`,
        dataType: 'json',
        data: { user: '', password: '' },
    })
    .done(() => window.location.reload())
    .fail($.connectionFailed);
};

const authenticateUser = (credentials) => {
    $.ajax({
        type: 'POST',
        url: `/api/captiveportal/access/logon/${zoneid}/`,
        dataType: 'json',
        data: credentials,
    })
    .done((data) => {
        $.clientInfo(data);
        $.connectionLogon(data);
    })
    .fail($.connectionFailed);
};

const setupRulesLink = () => {
    $('[id^="rules"].link').on('click', $.showRules);
};

const checkConnectionStatus = () => {
    $.ajax({
        type: 'POST',
        url: `/api/captiveportal/access/status/${zoneid}/`,
        dataType: 'json',
        data: {
            user: $('#inputUsername').val(),
            password: $('#inputPassword').val(),
        },
    })
    .done((data) => {
        $.clientInfo(data);
        $.connectionStatus(data);
    })
    .fail(() => setTimeout($.connectionFailed, 1000));
};
