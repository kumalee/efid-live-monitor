"use strict";

var directories = ['efset', 'ui'];
var relative_pages = ['register', 'reset', 'login'];
var pages = ['login', 'register', 'password', 'reset', 'verify'];
var providers = {
  'facebook': '#email',
  'linkedin': 'a[href*="http://www.linkedin.com"]',
  'google': '#Email'
};
var languages = ['en'];
var params = [];

directories.forEach( function(directory, i){
  var entity = {};
  languages.forEach( function(lang, i) {
    entity[lang] = {};
    var relative_to_links = [];
    relative_pages.forEach( function(page, i){
      relative_to_links.push(`../${page}/index.html`);
    });

    ['facebook', 'linkedin', 'google'].forEach(function(provider){
      entity[lang][provider] = {
        'button': `#social-login-${provider}`,
        'input': providers[provider]
      }
    });
    pages.forEach( function(page, i){
      entity[lang][page] = {};
      switch(page){
        case 'login':
          entity[lang][page]['relative_to_links'] = [relative_to_links[0], relative_to_links[1]];
          break;
        case 'register':
        case 'reset':
          entity[lang][page]['relative_to_links'] = relative_to_links[2];
          break;
        default:
          entity[lang][page]['relative_to_links'] = false;
          break;
      }
      if (directory == 'efset') {
        entity[lang]['init_url'] = 'https://www.efset.org';
        entity[lang]['btn_signin'] = '.hidden-xs.eft-navbar ul.efid-anonymous a[href*="https://accounts.ef.com/oauth2"]';
        entity[lang]['btn_submit'] = 'button[type="submit"]';
        entity[lang]['btn_signup'] = 'a#link-to-register';
        entity[lang]['btn_reset'] = 'a#link-to-reset';
        entity[lang]['login_success'] = '.hidden-xs.eft-navbar ul.efid-authenticated .welcome span[data-woven*="efid"]';
        entity[lang]['login_text'] = 'FOO BAR';
        entity[lang]['teardown_visible'] = '.hidden-xs.eft-navbar .welcome';
        entity[lang]['teardown_click'] = '.hidden-xs.eft-navbar .welcome ul li[data-woven] a';
      }
      else if (directory == 'ui') {
        entity[lang]['init_url'] = 'https://classroom.ctx.ef.com';
        entity[lang]['btn_signin'] = '.auth-provider-btn.primary';
        entity[lang]['btn_submit'] = 'button[type="submit"]';
        entity[lang]['btn_signup'] = 'a#link-to-register';
        entity[lang]['btn_reset'] = 'a#link-to-reset';
        entity[lang]['login_success'] = '.welcome-msg';
        entity[lang]['login_text'] = 'Welcome to EF Class';
      }
    });
  });
  params[directory] = entity;
});

module.exports = function runner(spec) {
  "use strict";
  directories.forEach( function(directory, i1) {
    languages.forEach( function(lang, i2) {
      spec(params[directory][lang], directory);
    });
  });
};
