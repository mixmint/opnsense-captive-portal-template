<p>A Captive Portal allows you to force authentication, or redirection to a click through page for network access. This is commonly used on hotspot networks, but is also widely used in corporate networks for an additional layer of security on wireless or Internet access.</p>
<p>OPNsense’s unique template manager makes setting up your own login page an easy task. At the same time it offers additional functionalities, such as:</p>
<ul>
<li>URL redirection</li>
<li>Option for your own Pop-up</li>
<li>Custom Splash page</li>
</ul>
<p>To read more about the captive portal, I suggest you have a look here: <a href="https://docs.opnsense.org/manual/captiveportal.html?highlight=captive%20portal">https://docs.opnsense.org/manual/captiveportal.html?highlight=captive%20portal</a> meanwhile, I will focus on the template.</p>
<p>The captive portal templates that I have seen so far most often lack multilingual support. I've always wondered why it should only be in English or only in one language at all? Well, let's look below. This template supports multilingualism, checks your preferred browser language, saves a cookie with information about which language was read or which language you chose using the selector. Uses language translations saved in the lang_xx.json file. So, according to the layout, you can prepare your own translation, which you later have to declare in the <strong>index.html</strong> file in the variable <strong>langs</strong> (on line 187).</p>
<blockquote>var langs = {<br /> 'pl':'Polski',<br /> 'en':'English'<br /> };</blockquote>
<p>The template will automatically determine whether to display the LTR or RLT content.</p>
<p>The base64 logo is set in the settings.js file. Due to the universal application, the frame of the image of the logo must keep the proportions of a square.
</p>
<p><img src="images/screenshot.jpg" /></p>
