var URI = require('urijs');
var runner = require('../runner');
require('../keychain');
var _ = require('lodash');


runner(function(param, directory){
  suite(`account register page - ${directory}`, function() {
    var signup_url, providers = [];

    suiteSetup(function *(){
      signup_url = yield browser
        .url(param.init_url)
        .waitForVisible(param.btn_signin, 30e3)
        .click(param.btn_signin)
        .waitForVisible(param.btn_submit, 30e3)
        .click(param.btn_signup)
        .waitForVisible('#link-to-login', 30e3)
        .getUrl();
      return assert.ok(signup_url);
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
          .url(signup_url)
          .waitForEnabled(param.btn_submit, 30e3)
          .getAttribute(param.btn_submit, 'class'), 'disabled',
          'check form submit button is available');
    });

    test('check the links to signup page', function *() {
      var continue_uri = URI(signup_url).search(true).continue_uri;
      providers_str =  URI(continue_uri).search(true).providers;
      if (providers_str) {
        providers = providers_str.split(',');
      }
      var selector = 'a#link-to-login';
      var href = yield browser.getAttribute(selector, 'href');
      var link = URI(href);
      assert.equal(link.search(true).continue_uri, continue_uri,
          '"continue_uri" should inherit from current page');
      assert.equal(link. relativeTo(signup_url).search('').toString(),
          param.register.relative_to_links, 'login link is correct');
    });

    test('page title', function *() {
      return assert.equal( yield browser
        .getTitle(),
        'EFID Create account'
      );
    });

    test('page language', function *() {
      return assert.equal(yield browser.getAttribute('html', 'lang'), 'en');
    });

    test('first name can contains space', function *() {

      // Open sign up form first if social options dominate
      if(providers.length){
        yield browser
            .waitForVisible('#sign-up-open')
            .click('#sign-up-open')
            .waitForVisible('#sign-up-block');
      }

      var validate_text = yield browser
          .setValue('input[name="given_name"]', 'FirstName MiddleName')
          .waitForVisible('.form-group.has-success')
          .getAttribute(
            '.form-group.has-success input[name="given_name"]',
            'data-fv-regexp-message');
      return validate_text == 'The frist name cannot contain symbols' ||
          validate_text == 'The first name cannot contain symbols';
    });

    test('first name can contains hyphens', function *() {

      // Open sign up form first if social options dominate
      if(providers.length){
        yield browser
            .waitForVisible('#sign-up-open')
            .click('#sign-up-open')
            .waitForVisible('#sign-up-block');
      }

      var validate_text = yield browser
          .setValue('input[name="given_name"]', 'FirstName-MiddleName')
          .waitForVisible('.form-group.has-success')
          .getAttribute(
            '.form-group.has-success input[name="given_name"]',
            'data-fv-regexp-message');
      return validate_text == 'The frist name cannot contain symbols' ||
          validate_text == 'The first name cannot contain symbols';
    });

    test('last name can contains space', function *() {

      // Open sign up form first if social options dominate
      if(providers.length){
        yield browser
            .waitForVisible('#sign-up-open')
            .click('#sign-up-open')
            .waitForVisible('#sign-up-block');
      }

      assert.equal(yield browser
          .setValue('input[name="family_name"]', 'LastName FamilyName')
          .waitForVisible('.form-group.has-success')
          .getAttribute(
            '.form-group.has-success input[name="family_name"]',
            'data-fv-regexp-message'),
          'The last name cannot contain symbols');
    });

    test('last name can contains hyphens', function *() {

      // Open sign up form first if social options dominate
      if(providers.length){
        yield browser
            .waitForVisible('#sign-up-open')
            .click('#sign-up-open')
            .waitForVisible('#sign-up-block');
      }

      assert.equal(yield browser
          .setValue('input[name="family_name"]', 'LastName-FamilyName')
          .waitForVisible('.form-group.has-success')
          .getAttribute(
            '.form-group.has-success input[name="family_name"]',
            'data-fv-regexp-message'),
          'The last name cannot contain symbols');
    });

    test('register by email failed - email exists', function *() {

      // Open sign up form first if social options dominate
      if(providers.length){
        yield browser
            .waitForVisible('#sign-up-open')
            .click('#sign-up-open')
            .waitForVisible('#sign-up-block');
      }

      assert.equal(yield browser
          .setValue('input[name="given_name"]', 'Foo')
          .setValue('input[name="family_name"]', 'Bar')
          .setValue('input[name="email"]', 'efset@qp1.org')
          .setValue('input[name="password"]', 'qweqwe123')
          .setValue('input[name="confirmation"]', 'qweqwe123')
          .submitForm('form')
          .waitForExist('.form-group.has-error')
          .getText(
              '.form-group.has-error .help-block[data-fv-result="INVALID"]'),
          'User with the same email already exist');
    });

    test('facebook login succeed', function *() {
      // facebook login can't be autotest because of its' robot
      // login check
      this.skip();
      if(_.includes(providers, 'facebook')) {
        return assert.equal(yield browser
          .waitForVisible(param['facebook'].button)
          .click(param['facebook'].button)
          //.waitForVisible(param['facebook'].input)
          //.fill_facebook_login_valid()
          //.submitForm('form')
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
          //.waitForVisible(param['google'].input)
          //.fill_google_login_valid()
          //.submitForm('form')
          .waitForVisible(param.login_success)
          .getText(param.login_success),
          param.login_text);
      } else {
        this.skip();
      }
    });
  });
});
