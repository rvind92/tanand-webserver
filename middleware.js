module.exports = function(db) {

	return {
		requireAuthentication: function(request, response, next) {
			var token = request.get('Auth');

			db.user.findByToken(token).then(function(user) {
				request.user = user;
				next();
			}, function() {
				response.status(401).send();
			});
		},
		handleHeader: function(request, response, next) {
			if(request.get('Expect') === '100-continue') {
				response.writeContinue();
				next();
			} else {
				response.status(400).send();
			}
		}
	};

};