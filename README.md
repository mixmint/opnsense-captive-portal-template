<p>A Captive Portal allows you to force authentication, or redirection to a click through page for network access. This is commonly used on hotspot networks, but is also widely used in corporate networks for an additional layer of security on wireless or Internet access.</p>
<p>OPNsense’s unique template manager makes setting up your own login page an easy task. At the same time it offers additional functionalities, such as:</p>
<ul>
	<li>URL redirection</li>
	<li>Option for your own Pop-up</li>
	<li>Custom Splash page</li>
</ul>
<p>To read more about the captive portal, I suggest you have a look here: <a href="https://docs.opnsense.org/manual/captiveportal.html?highlight=captive%20portal" rel="nofollow"></a><a href="https://docs.opnsense.org/manual/captiveportal.html?highlight=captive%20portal">https://docs.opnsense.org/manual/captiveportal.html?highlight=captive%20portal</a> meanwhile, I will focus on the template.</p>
<p>&nbsp;</p>
<p><img src="images/screenshot.jpg" /></p>
<p>&nbsp;</p>
<p>The captive portal templates that I have seen so far most often lack multilingual support. I've always wondered why it should only be in English or only in one language at all? Well, let's look below. This template supports multilingualism, checks your preferred browser language, saves a cookie with information about which language was read or which language you chose using the selector. Uses language translations saved in the <strong>xx.json</strong> file. So, according to the layout, you can prepare your own translation, which you later have to declare in the <strong>settings.json</strong> file in the <strong>config</strong> directory.</p>
<blockquote>"langs": {<br /> "pl":"Polski",<br /> "en":"English"<br /> };</blockquote>
<p>and (parameters necessary to display the logged-in user's session)</p>
<blockquote>"langs": {<br /> "pl":"pl-PL",<br /> "en":"en-GB"<br /> };</blockquote>
<p>Based on the keys of the langs variable object, the template will automatically determine whether it should display the LTR or RTL content.</p>
<p>The base64 logo is set in the <strong>settings.json</strong> file. Due to the universal application, the frame of the image of the logo must keep the proportions of a square.</p>
<p>&nbsp;</p>
<h4>What has changed in the template recently:</h4>
<ul>
	<li>further work on the development of the template is planned, hence the bootstrap 5.3.3 and jquery 3.7.1 libraries have been included, at the same time libraries provided natively by OPNsense will not be used,</li>
	<li>some functions have been separated from the API, their notation has been changed,</li>
	<li>a method for dynamically loading scripts into the template has been added - in the current version it is used by vanta.js dependencies, eventually it will be used more widely,</li>
	<li>the layout has been changed, which was modeled on the Login Screen Design prepared by <strong>Ankur Tripathi</strong> - thanks for your work Ankur!,</li>
	<li>CSS declarations have been improved, rtl support has been improved - unfortunately, I am not sure how to display individual elements in rtl mode, hence if you find an error in this, please feedback - I will correct it,</li>
	<li>particles.js has been abandoned, <strong>Vanta.js</strong> has been implemented in its place - thanks and respect to <strong>@tengbao</strong> - great job!<br />The following effects are available: <strong>birds</strong>, <strong>cells</strong>, <strong>fog,</strong> <strong>globe</strong>, <strong>halo</strong>, <strong>net</strong>, <strong>rings</strong> and <strong>waves</strong>, which can be configured in a simplified way in settings.json in the <strong>"animate"</strong> key as the preferred <strong>"effect"</strong>, its <strong>"params"</strong> and the <strong>"preset"</strong> of the declared effect.<br />You can view your settings here <a href="https://www.vantajs.com/" target="_blank" rel="noopener">https://www.vantajs.com/</a></li>
</ul>
<p>&nbsp;</p>
<h4>What I plan to change:</h4>
<ul>
	<li>improve or change the language selection switch mechanism,</li>
	<li>implement a method for embedding (or dynamically generating) the layout and its dependencies,</li>
</ul>
