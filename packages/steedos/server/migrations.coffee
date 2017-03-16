# 给users的profile.fullname赋值
Migrations.add 'add-profile-fullname-field', ->
	Meteor.users.find({ 'profile.fullname': {$exists: false} }, {fields: {name: 1}}).forEach (u) ->
		Meteor.users.direct.update({ _id: u._id }, {$set: {'profile.fullname': u.name}})