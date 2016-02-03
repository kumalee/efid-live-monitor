suite('efset login page', function() {
  var login_url;
  setup(function *() {
    var $btn_efset_signin = '.hidden-xs.eft-navbar ul.efid-anonymous a[href*="https://accounts.ef.com/oauth2"]';
      login_url = yield browser
        .url('https://www.efset.org/')
        .waitForVisible($btn_efset_signin)
        .getAttribute($btn_efset_signin, 'href');
  });

  test('page title', function *() {
    return assert.equal( yield browser
      .url(login_url)
      .getTitle(),
      'EFID Sign in'
    );
  });
});
