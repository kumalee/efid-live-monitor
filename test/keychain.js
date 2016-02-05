var Q = require('q');

browser.addCommand("fill_login_cred_valid", function () {
  return browser.setValue('input[name="email"]', 'efset@qp1.org')
      .setValue('input[name="password"]', 'lurker502');
});

browser.addCommand("fill_login_cred_invalid", function () {
  return browser.setValue('input[name="email"]', 'efset@qp1.org')
      .setValue('input[name="password"]', '11111111');
});

browser.addCommand("fill_linkedin_login_valid", function () {
  var email = 'foobarqp1@gmail.com';
  var passwd = 'qweqwe123';
  return browser.setValue('input[name="session_key"]', email)
      .setValue('input[name="session_password"]', passwd);
});

browser.addCommand("fill_facebook_login_valid", function () {
  var email = 'foobarqp1@gmail.com';
  var passwd = 'qweqwe123';
  return browser.setValue('input[name="email"]', email)
      .setValue('input[name="pass"]', passwd);
});


browser.addCommand("fill_google_login_valid", Q.async(function *() {
  var email = 'foobarqp1@gmail.com';
  var passwd = 'efidtest234';

  // Google has a two-phases sign-in, check what is the first screen
  var isPasswd = yield browser.isVisible('#password-shown');

  if (!isPasswd) {
    yield browser.setValue('input[name="Email"]', email).click('#next').waitForVisible('#password-shown');
  }

  return browser.setValue('input[name="Passwd"]', passwd);
}));
