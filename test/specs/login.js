var URI = require('urijs');
var runner = require('../runner');
require('../keychain');

runner(function(param, directory){
  suite(`account login page - ${directory}`, function() {
    var login_url, providers = [];

    setup(function *() {
      if(!login_url){
        login_url = yield browser
          .url(param.init_url)
          .waitForVisible(param.btn_signin, 30e3)
          .click(param.btn_signin)
          .waitForVisible(param.btn_submit, 30e3)
          .getUrl();
        return assert.notInclude(yield browser
          .getAttribute(param.btn_submit, 'class'), 'disabled',
          'check form submit button is available');
      }
      else {
        return assert.notInclude(yield browser
            .url(login_url)
            .waitForEnabled(param.btn_submit, 30e3)
            .getAttribute(param.btn_submit, 'class'), 'disabled',
            'check form submit button is available');
      }
    });

    test('check the links to register and reset page', function *() {
      var continue_uri = URI(login_url).search(true).continue_uri;
      providers_str =  URI(continue_uri).search(true).providers;
      if (providers_str) {
        providers = providers_str.split(',');
      }
      var selector = 'a#link-to-register, a#link-to-reset';
      var $els = yield browser.getAttribute(selector, 'href');
      assert.sameMembers($els.map(function (href) {
        var link = URI(href);
        assert.equal(link.search(true).continue_uri, continue_uri,
            '"continue_uri" should inherit from current page');
        return link.relativeTo(login_url).search('').toString();
      }), param.login.relative_to_links, 'check links are correct');
    });

    test('page title', function *() {
      return assert.equal( yield browser
        .getTitle(),
        'EFID Sign in'
      );
    });

    test('page language', function *() {
      return assert.equal(yield browser.getAttribute('html', 'lang'), 'en');
    });

    test('email login failed', function *() {
      return assert.equal(yield browser
        .fill_login_cred_invalid()
        .submitForm('form')
        .waitForText('#error_box')
        .getText('#error_box'), 'Invalid login details');
    });

    test('email login succeed', function *() {
      return assert.equal(yield browser
        .fill_login_cred_valid()
        .submitForm('form')
        .waitForVisible(param.login_success)
        .getText(param.login_success),
        param.login_text
      );
    });

    test('facebook login succeed', function *() {
      if('facebook' in providers) {
        return assert.equal(yield browser
          .waitForVisible('#social-login-facebook')
          .click('#social-login-facebook')
          .waitForVisible(param['facebook'])
          .fill_facebook_login_valid()
          .submitForm('form')
          .waitForVisible(param.login_success)
          .getText(param.login_success),
          param.login_texts);
      } else {
        return true;
      }
    });

    test('linkedin login succeed', function *() {
      if('linkedin' in providers) {
        return assert.equal(yield browser
          .waitForVisible('#social-login-linkedin')
          .click('#social-login-linkedin')
          .waitForVisible(param['linkedin'])
          .fill_linkedin_login_valid()
          .submitForm('form')
          .waitForVisible(param.login_success)
          .getText(param.login_success),
          param.login_text);
      } else {
        return true;
      }
    });

    test('google+ login succeed', function *() {
      if('google' in providers) {
        return assert.equal(yield browser
          .waitForVisible('#social-login-google')
          .click('#social-login-google')
          .waitForVisible(param['google'])
          .fill_google_login_valid()
          .submitForm('form')
          .waitForVisible(param.login_success)
          .getText(param.login_success),
          param.login_text);
      } else {
        return true;
      }
    });
  });
});
