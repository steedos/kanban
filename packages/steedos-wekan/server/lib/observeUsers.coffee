Meteor.startup ->
	Meteor.users.find('profile.fullname': $exists: false).observeChanges 
		added: (id, fields) ->
			if fields.name
				Meteor.users.direct.update({ _id: id }, {$set: {'profile.fullname': fields.name}})
		changed: (id, fields) ->
			if fields.name
				Meteor.users.direct.update({ _id: id }, {$set: {'profile.fullname': fields.name}})