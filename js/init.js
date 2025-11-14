/**
 * @version 2.3.3
 * @package Multilanguage Captive Portal Template for OPNsense
 * @author Mirosław Majka (mix@proask.pl)
 * @copyright (C) 2025 Mirosław Majka <mix@proask.pl>
 * @license GNU/GPL license: http://www.gnu.org/copyleft/gpl.html
 */

$(document).ready(() => {
    $.when($.loadSettings()).done(() => {
        applyCssSettings();
        setupLanguage();
        initializeVantaEffect();
        useWCAG();
        updateLogo();
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
            if (settings.layout.a11y && settings.layout.a11y_contrast) {
                value = $.adjustContrast(
                    value,
                    {
                        factor: settings.layout.a11y_factor,
                        threshold: settings.layout.a11y_threshold
                    }
                );
            }

            _root.style.setProperty(`--${key}`, value);
        });
    }

    const flagsDir = settings.layout.lang_flags_dir || '4x3';
    const langLayout = settings.layout.lang_layout;

    if (langLayout === 'flags-only-select' || langLayout === 'flags-select') {
        let styleEl = document.getElementById('flags');

        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'flags';
            document.head.appendChild(styleEl);
        }

        styleEl.innerHTML = '';

        Object.keys(settings.langs).forEach(lang => {
            const flag = langsFlags[lang] || lang;
            const url  = `/images/flags/${flagsDir}/${flag}.svg`;

            styleEl.innerHTML += `#${lang}::before {background-image: url("${url}");}`;
        });
    }
};

const useWCAG = () => {
    if (!settings.layout.a11y) {
        return;
    }

    $('body').addClass('a11y');

    if (settings.layout.a11y_contrast) {
        $('body').addClass('a11y-contrast');
    }

    if (settings.layout.a11y_highlight) {
        $('body').addClass('a11y-highlight');
    }

    if (settings.layout.a11y_mono) {
        $('body').addClass('a11y-mono');
    }

    if (settings.layout.a11y_keyboard) {
        $('body').addClass('a11y-keyboard');
        $.initKeyboardAccessibility();

        if (settings.layout.a11y_helper) {
            $('body').addClass('a11y-helper');

            const resources = [
                'tour.min.css',
                'tour-rtl.min.css',
                'tour.min.js'
            ];

            $.getMultiResources(resources, 'tourguide').then(() => {
                if (typeof $.initTour === 'function') {
                    const tour = $.initTour();
                    if (tour) {
                        const launchBtn = document.getElementById("launchTour");
                        if (launchBtn) {
                            launchBtn.addEventListener("click", () => {
                                tour.start();
                            });
                        }
                    }
                } else {
                    console.warn("Bootstrap Tour does not exist after loading resources!");
                }
            })
            .catch(err => {
                console.error("Error loading Bootstrap Tour resources:", err);
            });
        }
    }
}

const initializeVantaEffect = () => {
    if (!settings.animate?.effect) {
        return;
    }

    const effect = settings.animate.effect.toLowerCase();
    const preset = settings.animate.preset[effect];

    const vantaResources = [
        'vanta.css',
        'three.r134.min.js',
        `vanta.${effect}.min.js`
    ];

    $.getMultiResources(vantaResources, 'vanta')
    .then(() => {
        window['VANTA'][effect.toUpperCase()]({
            ...settings.animate.params,
            ...preset
        });

        if (settings.layout.a11y) {
            document.querySelectorAll('.vanta-canvas').forEach(canvas => {
                canvas.setAttribute('role', 'presentation');
                canvas.setAttribute('aria-hidden', 'true');
            });
        }
    });
};

const updateLogo = async () => {
    const logoContainer = $('#logo');
    const fallback      = '/images/default-logo.svg';
    const extensions    = ['svg', 'png', 'jpg'];
    const basePath      = '/images/logo';

    if (settings.logo && settings.logo.startsWith('data:image/')) {
        logoContainer.html(
            `<img class="brand-logo" src="${settings.logo}" height="150" width="150" alt="Logo">`
        );

        return;
    }

    if (settings.logo && typeof settings.logo === 'string') {
        try {
            const res = await fetch(settings.logo, { method: 'HEAD' });

            if (res.ok) {
                logoContainer.html(
                    `<img class="brand-logo" src="${settings.logo}" height="150" width="150" alt="Logo">`
                );

                return;
            }
        } catch (e) {

        }
    }

    const urls = extensions.map(ext => `${basePath}.${ext}`);

    for (const url of urls) {
        try {
            const res = await fetch(url, { method: 'HEAD' });

            if (res.ok) {
                logoContainer.html(
                    `<img class="brand-logo" src="${url}" height="150" width="150" alt="Logo">`
                );

                return;
            }
        } catch (e) {

        }
    }

    logoContainer.html(
        `<img class="brand-logo" src="${fallback}" height="150" width="150" alt="Logo">`
    );
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

    $(checkboxSelector).on('change', function () {
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
        url: '/api/captiveportal/access/logoff/',
        dataType: 'json',
        data: { user: '', password: '' },
    })
    .done(() => window.location.reload())
    .fail($.connectionFailed);
};

const authenticateUser = (credentials) => {
    $.ajax({
        type: 'POST',
        url: '/api/captiveportal/access/logon/',
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
        url: '/api/captiveportal/access/status/',
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
