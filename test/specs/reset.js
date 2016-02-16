var URI = require('urijs');
var runner = require('../runner');
require('../keychain');
var _ = require('lodash');


runner(function(param, directory){
  suite(`account reset page - ${directory}`, function() {
    var reset_url, providers = [];

    suiteSetup(function *(){
      reset_url = yield browser
        .url(param.init_url)
        .waitForVisible(param.btn_signin, 30e3)
        .click(param.btn_signin)
        .waitForVisible(param.btn_submit, 30e3)
        .click(param.btn_reset)
        .waitForVisible('#link-to-login', 30e3)
        .getUrl();
      return assert.ok(reset_url);
    });

    setup(function *() {
      return assert.notInclude(yield browser
          .url(reset_url)
          .waitForEnabled(param.btn_submit, 30e3)
          .getAttribute(param.btn_submit, 'class'), 'disabled',
          'check form submit button is available');
    });

    test('check the links to reset page', function *() {
      var continue_uri = URI(reset_url).search(true).continue_uri;
      providers_str =  URI(continue_uri).search(true).providers;
      if (providers_str) {
        providers = providers_str.split(',');
      }
      var selector = 'a#link-to-login';
      var href = yield browser.getAttribute(selector, 'href');
      var link = URI(href);
      assert.equal(link.search(true).continue_uri, continue_uri,
          '"continue_uri" should inherit from current page');
      assert.equal(link. relativeTo(reset_url).search('').toString(),
          param.reset.relative_to_links, 'login link is correct');
    });

    test('page title', function *() {
      return assert.equal(yield browser.getTitle(), 'EFID Reset password');
    });

    test('page language', function *() {
      return assert.equal(yield browser.getAttribute('html', 'lang'), 'en');
    });

    test('reset by email failed - email does not exist', function *() {
      assert.equal(yield browser
          .setValue('input[name="email"]', 'nobodyhere@qp1.org')
          .submitForm('form')
          .waitForExist('.form-group.has-error')
          .getText(
              '.form-group.has-error .help-block[data-fv-result="INVALID"]'),
          'No user exists for this email address');
    });

    test('reset by email succeed - reset email sent out', function *() {
      assert.include(yield browser
          .setValue('input[name="email"]', 'efset@qp1.org')
          .submitForm('form')
          .waitForVisible('#message-box')
          .getText('#message-box > p'), 'You will receive an email');
    });
  });
});
