Package.describe({
  name: 'steedos',
  summary: '',
  version: '1.0.0',
  git: 'https://github.com/kadirahq/flow-router.git'
});

Npm.depends({});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use('flemay:less-autoprefixer@1.2.0');

  api.addFiles('client/steedos.less', 'client');

});