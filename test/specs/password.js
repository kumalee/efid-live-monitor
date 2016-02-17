var URI = require('urijs');
var runner = require('../runner');
require('../keychain');
var _ = require('lodash');


runner(function(param, directory){
  suite(`account password page - ${directory}`, function() {
    var password_url;

    suiteSetup(function *(){
      password_url = yield browser
        .url(param.init_url)
        .waitForVisible(param.btn_signin, 30e3)
        .click(param.btn_signin)
        .waitForVisible(param.btn_submit, 30e3)
        .getUrl();
      password_url = password_url.replace('login', 'password');
      return assert.ok(password_url);
    });

    setup(function *() {
      return assert.notInclude(yield browser
          .url(password_url)
          .waitForEnabled(param.btn_submit, 30e3)
          .getAttribute(param.btn_submit, 'class'), 'disabled',
          'check form submit button is available');
    });

    test('page title', function *() {
      return assert.equal(yield browser.getTitle(), 'EFID change password');
    });

    test('page language', function *() {
      return assert.equal(yield browser.getAttribute('html', 'lang'), 'en');
    });

    test('change password failed - invalid token', function *() {
      var url = URI(password_url);
      url.addQuery('token', 'invalid');
      var new_passwd = 'qweqwe123';

      assert.equal(yield browser
          .url(url.toString())
          .waitForEnabled('button[type="submit"]')
          .setValue('input[name="password"]', new_passwd)
          .setValue('input[name="confirmation"]', new_passwd)
          .submitForm('form')
          .waitForVisible('.help-block[data-fv-result="INVALID"]')
          .getText('.help-block[data-fv-result="INVALID"]'),
          'Invalid reset token');
    });
  });
});
