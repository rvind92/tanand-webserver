var firebase = require('firebase');

module.exports = function(db) {

	return {
		requireAuthentication: function(request, response, next) {
			var token = request.get('Auth') || '';

			db.token.findOne({
				where: {
					tokenHash: cryptojs.MD5(token).toString()
				}
			}).then(function(tokenInstance) {
				if(!tokenInstance) {
					throw new Error();
				}

				request.token = tokenInstance;
				return db.user.findByToken(token);

				firebase.auth().verifyIdToken(idToken).then(function(decodedToken) {
					var uid = decodedToken.sub;

				}).catch(function(error) {
					response.status(401).send();
				});

			}).then(function(user) {
				request.user = user;
				next();
			}).catch(function() {
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

