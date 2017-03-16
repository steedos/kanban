Package.describe({
	name: 'steedos:wekan',
	summary: '',
	version: '1.0.0',
	git: 'https://github.com/kadirahq/flow-router.git'
});

Npm.depends({});

Package.onUse(function(api) {
	api.versionsFrom('1.0');

	api.use('flemay:less-autoprefixer@1.2.0');
	api.use('coffeescript');
	api.use('idmontie:migrations@1.0.1');

	api.addFiles('client/steedos.less', 'client');

	api.addFiles('server/migrations.coffee', 'server');
	api.addFiles('server/lib/observeUsers.coffee', 'server');

});