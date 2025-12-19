# Captive Portal Template

<p>If you like my work and appreciate my commitment, you can buy me a coffee.</p>
<p><a href="https://www.buymeacoffee.com/mixmint" target="_blank" rel="noopener"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important; width: 217px !important;" /></a></p>
<p>If you want to customize this template to your own needs, please contact me! ( <a href="mailto:mix@proask.pl">mix@proask.pl</a> ) I offer professional help in customizing solutions that perfectly match your requirements. Write what you need, and together we will create something exceptional! 🚀</p>

## What is a Captive Portal?

A Captive Portal allows you to force authentication or redirect to a clickable page to access the network. This is commonly used in hotspot networks, but is also widely used in corporate networks or small local area networks (e.g. shopping malls, restaurants, hotels, airports, etc.) as an additional layer of security for wireless or internet access.

OPNsense’s unique template manager makes setting up your own login page an easy task. At the same time it offers additional functionalities, such as:

- URL redirection
- Option for your own Pop-up
- Custom Splash page

To read more about the captive portal, I suggest you have a look here: [OPNsense Captive Portal](https://docs.opnsense.org/manual/captiveportal.html?highlight=captive%20portal)

## Demo OPNsense Captive Portal Page
- [Globe animation](https://opnsense.myhome.cool:8001)
- [Globe animation WCAG](https://opnsense.myhome.cool:8002)
- [Birds animation](https://opnsense.myhome.cool:8003)
- [Cells animation](https://opnsense.myhome.cool:8004)
- [Fog animation](https://opnsense.myhome.cool:8005)
- [Halo animation](https://opnsense.myhome.cool:8006)
- [Net animation](https://opnsense.myhome.cool:8007)
- [Rings animation](https://opnsense.myhome.cool:8008)
- [Waves animation](https://opnsense.myhome.cool:8009)

<p>login: demo<br />password: demo</p>

<p><img src="images/screenshot.webp" alt="" /></p>

## ⚖️ License and Commercial Version

- Current and future versions of the template (v2.2.0 and above) are free for non-commercial use only.
- A commercial version will be released soon, including additional features and available for use in commercial projects.
- Features available in the free version remain compliant with the non-commercial use policy, and any premium features present in the commercial version will not be included in the GPL/free version.

## 🌐 Multilingual Support

The captive portal templates that I have seen so far most often lack multilingual support. I've always wondered why it should only be in English or only in one language at all? Well, let's look below. This template supports multilingualism, checks your preferred browser language, saves a cookie with information about which language was read or which language you chose using the selector. Uses language translations saved in the **xx.json** file. So, according to the layout, you can prepare your own translation, which you later have to declare in the **settings.json** file in the **config** directory.

The first (and probably most important) "default_lang" key specifies what language will be loaded by default when the Captive Portal client's web browser's preferred language is different from the languages ​​supported by the platform.

```
"default_lang": "en"
```

In the current release, the settings key defines the default language that will be loaded in case the client browser language is not available in our available languages ​​configuration:

```
"langs": {
	"en": "English",
	"pl": "Polski",
	"sk": "Slovenčina",
	"fr": "Français",
	"de": "Deutsch",
	"nl": "Nederlands",
	"no": "Norsk",
	"sv": "Svenska",
	"fi": "Suomi",
	"es": "Español",
	"ca": "Català",
	"ja": "日本語",
	"ko": "한국어",
	"zh": "中文",
	"pt": "Português",
	"it": "Italiano",
	"da": "Dansk",
	"cs": "Čeština",
	"lt": "Lietuvių",
	"lv": "Latviešu",
	"et": "Eesti",
	"el": "Ελληνικά",
	"bg": "Български",
	"ro": "Română",
	"hr": "Hrvatski",
	"ga": "Gaeilge",
	"mt": "Malti",
	"sl": "Slovenščina",
	"hu": "Magyar",
	"is": "Íslenska",
	"sr": "Srpski",
	"bs": "Bosanski",
	"me": "Crnogorski",
	"mk": "Македонски",
	"sq": "Shqip",
	"ka": "ქართული",
	"hy": "Հայերեն",
	"tr": "Türkçe",
	"uk": "Українська",
	"af": "Afrikaans",
	"am": "አማርኛ",
	"ar": "العربية",
	"az": "Azərbaycanca",
	"bn": "বাংলা",
	"cy": "Cymraeg",
	"eu": "Euskara",
	"fa": "فارسی",
	"tl": "Filipino",
	"gl": "Galego",
	"gu": "ગુજરાતી",
	"he": "עברית",
	"hi": "हिन्दी",
	"id": "Bahasa Indonesia",
	"mn": "Монгол",
	"ms": "Bahasa Melayu",
	"nb": "Norsk bokmål",
	"ne": "नेपाली",
	"si": "සිංහල",
	"dz": "རྫོང་ཁ",
	"sw": "Kiswahili",
	"th": "ไทย",
	"uz": "Oʻzbek",
	"ur": "اُردُو",
	"vi": "Tiếng Việt",
	"zu": "Zulu",
	"ky": "Кыргызча",
	"dv": "ދިވެހި",
	"ha": "Hausa",
	"ku": "کوردی (سۆرانی)",
	"kmr": "Kurdî (Kurmancî)",
	"ps": "پښتو",
	"sy": "ܣܘܪܝܝܐ",
	"yi": "ייִדיש",
	"rw": "Kinyarwanda",
	"so": "Soomaali",
	"tg": "Тоҷикӣ",
	"mg": "Malagasy",
	"my": "မြန်မာဘာသာ",
	"km": "ភាសាខ្មែរ",
	"lo": "ພາສາລາວ",
	"ti": "ትግርኛ",
	"rn": "Ikirundi",
	"xh": "IsiXhosa",
	"st": "Sesotho",
	"tn": "Setswana",
	"ss": "siSwati",
	"nd": "isiNdebele",
	"aa": "Qafaraf Af"
};
```
The langs_iso parameter, which was previously included in the configuration, has been removed from the manual settings. In the new template version, ISO values ​​for languages ​​are automatically generated based on the keys defined in the "langs" section.

Based on the keys of the langs variable object, the template will automatically determine whether it should display the LTR or RTL content.

If only one translation language is defined in the "langs" group, then the language switcher will not be included in the layout. The language translation will be based on the language defined in the "default_lang" key.

The base64 logo is set in the **settings.json** file. Due to the universal application, the frame of the image of the logo must keep the proportions of a square.

## Login Control Configuration Group `"login"`

A mechanism that allows a specified number of failed login attempts. After exceeding the allowed number of attempts, the ability to log in will be blocked for a specified period of time.

Of course, this is not a perfect protection against an attempt to force credentials, but the Captive Portal in OPNsense does not yet have a similar protection.

```
"login": {
    "control": false,
    "attempts": 3,
    "delay": 10
},
```

- `control` - false: disabled, true: enabled  
- `attempts` - Allowed number of login attempts  
- `delay` - Time in minutes that must elapse before the next login

## Layout Configuration Group `"layout"`

Enables or disables the required consent to the provisions contained in the ISP provider's Regulations.  
Redirection url address. If the value is not set or the set value is not a valid url address, the redirection functionality to the specified address will not be implemented.

```
"layout": {
    "enable_rules": true,
    "redirect_url": ""
},
```

The appearance of the language selector can be changed by setting values in the layout section.

```
"layout": {
    "lang_layout": "select",
    "lang_flags_dir": "4x3",
},
```

Available modes `lang_layout`:

- `flags-select` – a drop-down selector with language names and flags  
- `flags-only-select` – a drop-down selector with flags only (no text)  
- `flags-list` – a list of flags displayed side by side (no text)  
- `select` – a classic drop-down selector with language names (no flags)  

Flag directory `lang_flags_dir`:

- `4x3` – a 4:3 flag aspect ratio (standard rectangular)  
- `1x1` – a square flag aspect ratio  

Automatic locale and flag mapping `force_locales_data`:

```
"layout": {
    "force_locales_data": true|false,
}
```

- When `true`, updates `langsFlags` and `langISOMap` from the browser's `navigator.language`.  
- Only modifies entries if a region is present (e.g., `en-CA`, `pt-BR`).  
- Leaves two-letter languages (e.g., `en`, `fr`, `es`, `pt`) unchanged.

Accessibility options:

```
"layout": {
    "a11y": true|false,
    "a11y_contrast": true|false,
    "a11y_keyboard": true|false,
    "a11y_highlight": true|false,
    "a11y_mono": true|false,
    "a11y_helper": true|false,
	"a11y_helper_breakpoint": 1200,
    "a11y_factor": 0.5,
    "a11y_treshhold": 0.5,
},
```

- `a11y` – global accessibility toggle - when false, other options are ignored  
- `a11y_contrast` – automatically adjusts the color contrast of modals and UI elements to make them easier to read, this is based on the `a11y_factor` and `a11y_treshhold` parameters  
- `a11y_keyboard` – enables keyboard shortcut support:
  - ⇧ Shift (left) + ⌥ Alt (left) + U - focus on the Username field  
  - ⇧ Shift (left) + ⌥ Alt (left) + P - focus on the Password field  
  - ⇧ Shift (left) + ⌥ Alt (left) + A - check/uncheck the "I accept the terms and conditions" checkbox  
  - ⇧ Shift (left) + ⌥ Alt (left) + R - opens a modal window with the terms and conditions  
  - ⇧ Shift (left) + ⌥ Alt (left) + I - click the active login button  
  - ⇧ Shift (left) + ⌥ Alt (left) + O - log out  
  - ⇧ Shift (left) + ⌥ Alt (left) + L - click the language switcher trigger  

  **Language shortcuts (⇧ Shift + two letters)**  
  Hold ⇧ Shift and press two letters of the language code (ISO 639-1) at once or one after the other

  Examples:  
  - ⇧ Shift + P + L → switches to Polish (pl)  
  - ⇧ Shift + E + N → switches to English (en)  
  - ⇧ Shift + D + E → switches to Deutsch (de)  
  - ⇧ Shift + F + R → switches to Français (fr)  
  - ⇧ Shift + E + S → switches to Español (es)  
  - ⇧ Shift + I + T → switches to Italiano (it)  

- `a11y_highlight` – highlights the currently focused element (e.g., input, button) to facilitate keyboard navigation  
- `a11y_mono` – monochrome mode reduces the colors in the interface to visually simplify the UI (optional)  
- `a11y_helper` – interactive Accessibility Tour Guide:
  - Provides a step-by-step, WCAG-compliant tour of the portal  
  - Highlights and explains all key elements, including username/password fields, login/logout buttons, the "accept rules" checkbox, and language selector  
  - Fully keyboard-navigable: use arrow keys to move between steps, Enter/Space to confirm, Esc to exit  
  - Dynamically adapts to the selected portal language  
  - Adds visual focus indicators to help users see which element is currently highlighted
- `a11y_helper_breakpoint` - specifies the minimum viewport width (in pixels) at which the Accessibility Tour Guide trigger is displayed. On smaller screens (e.g., smartphones), the trigger is automatically hidden to avoid UI clutter  
- `a11y_factor` – contrast adjustment factor for `a11y_contrast` - higher values = greater contrast increase  
- `a11y_treshhold` – contrast threshold – specifies the minimum contrast required between the background and text colors. If the current contrast is below this value, it is automatically adjusted.

## CSS Configuration Group `"css_params"`
<p><img src="images/diagram.webp" alt="" /></p>
<blockquote>
	<p>"css_params": {</p>
	<table style="width: 100%;">
		<tbody>
			<tr>
				<td>"bg_section": "#252828"</td>
				<td>← 1 →</td>
				<td>Global background color of the entire login section</td>
			</tr>
			<tr>
				<td>"bg_image": ""</td>
				<td>← 2 →</td>
				<td>Optional background image displayed over <strong>bg_section</strong></td>
			</tr>
			<tr>
				<td>"bg_repeat": "no-repeat"</td>
				<td>← 3 →</td>
				<td>Defines background image repeat behavior</td>
			</tr>
			<tr>
				<td>"bg_position": "center center"</td>
				<td>← 4 →</td>
				<td>Position of the global background image</td>
			</tr>
			<tr>
				<td>"bg_size": "cover"</td>
				<td>← 5 →</td>
				<td>Scaling method of the global background image</td>
			</tr>
			<tr>
				<td>"bg_attachment": ""</td>
				<td>← 6 →</td>
				<td>Controls background image scroll behavior (fixed / scroll)</td>
			</tr>
			<tr>
				<td>"bg_color_left_side": ""</td>
				<td>← 7 →</td>
				<td>Background color of the <strong>left panel</strong></td>
			</tr>
			<tr>
				<td>"bg_img_left_side": "url('/images/bg_left_side.png')"</td>
				<td>← 8 →</td>
				<td>Background image of the <strong>left panel</strong></td>
			</tr>
			<tr>
				<td>"bg_img_left_side_repeat": "no-repeat"</td>
				<td>← 9 →</td>
				<td>Repeat behavior of the left panel background image</td>
			</tr>
			<tr>
				<td>"bg_img_left_side_position": "top left"</td>
				<td>← 10 →</td>
				<td>Position of the left panel background image</td>
			</tr>
			<tr>
				<td>"bg_img_left_side_size": "cover"</td>
				<td>← 11 →</td>
				<td>Scaling method of the left panel background image</td>
			</tr>
			<tr>
				<td>"bg_img_left_side_attachment": ""</td>
				<td>← 12 →</td>
				<td>Scroll behavior of the left panel background image</td>
			</tr>
			<tr>
				<td>"bg_left_side_blend": "linear-gradient(0deg, #005f6b4d 0%, #005f6bbf 83.85%)"</td>
				<td>← 13 →</td>
				<td>Gradient overlay blended with the left panel background image</td>
			</tr>
			<tr>
				<td>"logo_bg_color": "rgba(249, 253, 255, 1)"</td>
				<td>← 14 →</td>
				<td>Background color of the logo container</td>
			</tr>
			<tr>
				<td>"logo_bg_border_radius": "6px 6px 6px 6px"</td>
				<td>← 15 →</td>
				<td>Border radius of the logo container</td>
			</tr>
			<tr>
				<td>"bg_color_right_side": "rgba(249, 253, 255, 1)"</td>
				<td>← 16 →</td>
				<td>Background color of the <strong>right panel</strong></td>
			</tr>
			<tr>
				<td>"bg_img_right_side": ""</td>
				<td>← 17 →</td>
				<td>Background image of the right panel</td>
			</tr>
			<tr>
				<td>"bg_img_right_side_repeat": "no-repeat"</td>
				<td>← 18 →</td>
				<td>Repeat behavior of the right panel background image</td>
			</tr>
			<tr>
				<td>"bg_img_right_side_position": "top left"</td>
				<td>← 19 →</td>
				<td>Position of the right panel background image</td>
			</tr>
			<tr>
				<td>"bg_img_right_side_size": "cover"</td>
				<td>← 20 →</td>
				<td>Scaling method of the right panel background image</td>
			</tr>
			<tr>
				<td>"bg_img_right_side_attachment": ""</td>
				<td>← 21 →</td>
				<td>Scroll behavior of the right panel background image</td>
			</tr>
			<tr>
				<td>"bg_right_side_blend": ""</td>
				<td>← 22 →</td>
				<td>Optional gradient overlay for the right panel background</td>
			</tr>
			<tr>
				<td>"left_side_shadow": "0 0 40px 0 rgba(0, 0, 0, .35)"</td>
				<td>← 23 →</td>
				<td>Shadow cast by the left panel</td>
			</tr>
			<tr>
				<td>"right_side_shadow": "0 0 40px 0 rgba(0, 0, 0, .35)"</td>
				<td>← 24 →</td>
				<td>Shadow cast by the right panel</td>
			</tr>
			<tr>
				<td>"bg_alternate": "#818a91"</td>
				<td>← 25 →</td>
				<td>Alternate background color used for UI accents and borders</td>
			</tr>
			<tr>
				<td>"color_primary": "#7a7a7a"</td>
				<td>← 26 →</td>
				<td>Main text color</td>
			</tr>
			<tr>
				<td>"color_secondary": "#ffffff"</td>
				<td>← 27 →</td>
				<td>Secondary text color</td>
			</tr>
			<tr>
				<td>"color_alternate": "#373a3c"</td>
				<td>← 28 →</td>
				<td>Alternate text color (labels, placeholders)</td>
			</tr>
			<tr>
				<td>"link_color": "#348893"</td>
				<td>← 29 →</td>
				<td>Default link color</td>
			</tr>
			<tr>
				<td>"link_hover_color": "#f12184"</td>
				<td>← 30 →</td>
				<td>Link hover color</td>
			</tr>
			<tr>
				<td>"input_field_color": "#e8e8e8"</td>
				<td>← 31 →</td>
				<td>Text color inside input fields</td>
			</tr>
			<tr>
				<td>"input_field_label_color": "#373a3c"</td>
				<td>← 32 →</td>
				<td>Label color for input fields</td>
			</tr>
			<tr>
				<td>"input_field_bg_color": "#ffffff"</td>
				<td>← 33 →</td>
				<td>Background color of input fields</td>
			</tr>
			<tr>
				<td>"input_field_border_color": "rgba(145, 156, 167, .27)"</td>
				<td>← 34 →</td>
				<td>Border color of input fields</td>
			</tr>
			<tr>
				<td>"input_field_border_radius": "5px 0px 0px 5px"</td>
				<td>← 35 →</td>
				<td>Border radius of input fields</td>
			</tr>
			<tr>
				<td>"input_field_before_bg_color": "#00b5cb"</td>
				<td>← 36 →</td>
				<td>Background color of input prefix element</td>
			</tr>
			<tr>
				<td>"input_field_after_bg_color": "#00b5cb"</td>
				<td>← 37 →</td>
				<td>Background color of input suffix element</td>
			</tr>
			<tr>
				<td>"input_field_placeholder_color": "#373a3c"</td>
				<td>← 38 →</td>
				<td>Placeholder text color</td>
			</tr>
			<tr>
				<td>"button_bg_color": "#00b5cb"</td>
				<td>← 39 →</td>
				<td>Primary button background color</td>
			</tr>
			<tr>
				<td>"button_hover_bg_color": "#f12184"</td>
				<td>← 40 →</td>
				<td>Primary button hover background color</td>
			</tr>
			<tr>
				<td>"button_color": "#ffffff"</td>
				<td>← 41 →</td>
				<td>Primary button text color</td>
			</tr>
			<tr>
				<td>"button_hover_color": "#ffffff"</td>
				<td>← 42 →</td>
				<td>Primary button hover text color</td>
			</tr>
			<tr>
				<td>"lang_switcher": "#00b5cb"</td>
				<td>← 43 →</td>
				<td>Language switcher main background</td>
			</tr>
			<tr>
				<td>"lang_switcher_trigger": "#009db1"</td>
				<td>← 44 →</td>
				<td>Language switcher trigger background</td>
			</tr>
			<tr>
				<td>"lang_switcher_link": "#5aecff"</td>
				<td>← 45 →</td>
				<td>Language option link color</td>
			</tr>
			<tr>
				<td>"lang_switcher_hover": "#f12184"</td>
				<td>← 46 →</td>
				<td>Language option hover background</td>
			</tr>
			<tr>
				<td>"lang_switcher_dropdown": "#216f7a"</td>
				<td>← 47 →</td>
				<td>Language dropdown background</td>
			</tr>
			<tr>
				<td>"lang_switcher_dropdown_hover": "#f12184"</td>
				<td>← 48 →</td>
				<td>Language dropdown hover background</td>
			</tr>
			<tr>
				<td>"fadein": "0.5s"</td>
				<td>← 49 →</td>
				<td>Fade-in animation duration after page load</td>
			</tr>
			<tr>
				<td>"block_padding": "50px"</td>
				<td>← 50 →</td>
				<td>Inner padding of left and right panels</td>
			</tr>
			<tr>
				<td>"left_side_block_radius": "15px 15px 15px 15px"</td>
				<td>← 51 →</td>
				<td>Border radius of left panel content wrapper</td>
			</tr>
			<tr>
				<td>"right_side_block_radius": "15px 15px 15px 15px"</td>
				<td>← 52 →</td>
				<td>Border radius of right panel content wrapper</td>
			</tr>
			<tr>
				<td>"helper_bg_color": "#00b5cb"</td>
				<td>← 53 →</td>
				<td>Background color of the TourGuide helper button</td>
			</tr>
			<tr>
				<td>"helper_color": "#ffffff"</td>
				<td>← 54 →</td>
				<td>Text/icon color of the TourGuide helper button</td>
			</tr>
			<tr>
				<td>"helper_size": "78px"</td>
				<td>← 55 →</td>
				<td>Width and height of the TourGuide helper button</td>
			</tr>
		</tbody>
	</table>
	<p>};</p>
</blockquote>

## Animate Configuration Group `"animate"`

<blockquote>
	<p>"animate": {</p>
	<table style="width: 100%;">
		<tbody>
			<tr>
				<td>"effect": "globe",</td>
				<td>Selected animation (available: <strong>birds</strong>, <strong>cells</strong>, <strong>fog,</strong> <strong>globe</strong>, <strong>halo</strong>, <strong>net</strong>, <strong>rings</strong>, <strong>waves</strong>)</td>
			</tr>
			<tr>
				<td>"params": {</td>
				<td>Common parameters for all effects</td>
			</tr>
			<tr>
				<td style="padding-left: 30px;">"el": "#animate-js",</td>
				<td>CSS id where the animation will be embedded</td>
			</tr>
			<tr>
				<td style="padding-left: 30px;">"bg_position": "center center",</td>
				<td>Set the position of the background</td>
			</tr>
			<tr>
				<td style="padding-left: 30px;">"mouseControls": true,</td>
				<td>Controlling animation by mouse movement</td>
			</tr>
			<tr>
				<td style="padding-left: 30px;">"touchControls": true,</td>
				<td>Controlling animation by swiping on the touch screen</td>
			</tr>
			<tr>
				<td style="padding-left: 30px;">"gyroControls": false,</td>
				<td>Controlling animations with the gyrocompass of mobile devices</td>
			</tr>
			<tr>
				<td style="padding-left: 30px;">"minHeight": 200.00,</td>
				<td>&nbsp;</td>
			</tr>
			<tr>
				<td style="padding-left: 30px;">"minWidth": 200.00</td>
				<td>&nbsp;</td>
			</tr>
			<tr>
				<td>},</td>
				<td>&nbsp;</td>
			</tr>
			<tr>
				<td>"preset": {</td>
				<td>Animation presets</td>
			</tr>
			<tr>
				<td style="padding-left: 30px;">...</td>
				<td>Other configuration keys - here I refer to the Vanta.js online configurator <a href="https://www.vantajs.com/" target="_blank" rel="noopener">https://www.vantajs.com/</a></td>
			</tr>
			<tr>
				<td>}</td>
				<td>&nbsp;</td>
			</tr>
		</tbody>
	</table>
	<p>};</p>
</blockquote>

## What has changed in the template recently:

- Further work on the development of the template is planned, hence the bootstrap 5.3.3 and jquery 3.7.1 libraries have been included, at the same time libraries provided natively by OPNsense will not be used
- Some functions have been separated from the API, their notation has been changed
- A method for dynamically loading scripts into the template has been added - in the current version it is used by vanta.js dependencies, eventually it will be used more widely
- The layout has been changed, which was modeled on the Login Screen Design prepared by **Ankur Tripathi**
- CSS declarations have been improved, rtl support has been improved
- Particles.js has been abandoned, **Vanta.js** has been implemented in its place - thanks and respect to [@tengbao](https://github.com/tengbao/vanta) - great job!
The following effects are available: **birds**, **cells**, **fog**, **globe**, **halo**, **net**, **rings** and **waves**, which can be configured in a simplified way in settings.json in the **animate** key as the preferred **effect**, its **params** and the **preset** of the declared effect.
- Slovak translation included - thanks to [@Gouster4](https://github.com/Gouster4).
- Optimizing the code of javascript functions.
- Splitting CSS into smaller portions, nesting CSS selectors.
- Blocking the ability to log into the system for a specified period of time, after a specified number of possible attempts.
- Logo update for OPNsense v25 - many thanks for the update and vigilance to [@OctoCharm](https://github.com/OctoCharm).
- Language selector layout modified.
- New translations generated using AI for multiple languages.
- Expanded digital accessibility support (**WCAG**).
- Introduced a new interactive Accessibility Tour Guide (TourGuide) compliant with WCAG 2.1 AA.
- Automatic locale and flag mapping has been added, updating flags and locales based on the browser's language while keeping two-letter language codes unchanged.
