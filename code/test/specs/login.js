var URI = require('urijs');
var runner = require('../runner');
require('../keychain');
var _ = require('lodash');


runner(function(param, directory){
  suite(`account login page - ${directory}`, function() {
    var login_url, providers = [];

    suiteSetup(function *(){
      login_url = yield browser
        .url(param.init_url)
        .waitForVisible(param.btn_signin, 30e3)
        .click(param.btn_signin)
        .waitForVisible(param.btn_submit, 30e3)
        .getUrl();
      return assert.ok(login_url);
    });

    suiteTeardown(function *(){
      if (param.teardown_visible){
        var href = yield browser
          .url(param.init_url)
          .waitForVisible(param.teardown_visible)
          .moveToObject(param.teardown_visible)
          .click(param.teardown_click)
          .waitForVisible(param.btn_signin)
          .getAttribute(param.btn_signin, 'href');
        return assert.ok(href);
      } else {
        this.skip();
      }
    });

    setup(function *() {
      return assert.notInclude(yield browser
          .url(login_url)
          .waitForEnabled(param.btn_submit, 30e3)
          .getAttribute(param.btn_submit, 'class'), 'disabled',
          'check form submit button is available');
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
        param.login_text);
    });

    test('facebook login succeed', function *() {
      // facebook login can't be autotest because of its' robot
      // login check
      this.skip();
      if(_.includes(providers, 'facebook')) {
        return assert.equal(yield browser
          .waitForVisible(param['facebook'].button)
          .click(param['facebook'].button)
          .waitForVisible(param['facebook'].input)
          .fill_facebook_login_valid()
          .submitForm('form')
          .waitForVisible(param.login_success)
          .getText(param.login_success),
          param.login_text);
      } else {
        this.skip();
      }
    });

    test('linkedin login succeed', function *() {
      if(_.includes(providers,'linkedin')) {
        return assert.equal(yield browser
          .waitForVisible(param['linkedin'].button)
          .click(param['linkedin'].button)
          .waitForVisible(param['linkedin'].input)
          .fill_linkedin_login_valid()
          .submitForm('form')
          .waitForVisible(param.login_success)
          .getText(param.login_success),
          param.login_text);
      } else {
        this.skip();
      }
    });

    test('google login succeed', function *() {
      if(_.includes(providers,'google')) {
        return assert.equal(yield browser
          .waitForVisible(param['google'].button)
          .click(param['google'].button)
          .waitForVisible(param['google'].input)
          .fill_google_login_valid()
          .submitForm('form')
          .waitForVisible(param.login_success)
          .getText(param.login_success),
          param.login_text);
      } else {
        this.skip();
      }
    });
  });
});
