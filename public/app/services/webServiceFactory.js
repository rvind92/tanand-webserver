(function() {
    var webServiceFactory = function($http) {
    
        var factory = {};
        
        var config = {
            headers: {
                'Origin': 'http://192.168.3.108:3030',
                'Content-Type': 'application/json; charset=utf-8;'
            }
        }
        
        factory.postCredentials = function(credentials) {
            return $http.post('http://192.168.3.108:3030/users/login', credentials);
        };
        
        factory.createUser = function(credentials) {
            return $http.post('http://192.168.3.108:3030/users', credentials);
        };
        
        factory.logOut = function(token) {
            return $http.delete('http://192.168.3.108:3030/users/login', {
                headers: {
                    'Auth': token
                }
            });
        }

        factory.resolveToken = function(token) {
            return $http.get('http://192.168.3.108:3030/users/login', {
                headers: {
                    'Auth': token
                }
            });
        }
        
        return factory;
    };
    
    webServiceFactory.$inject = ['$http'];
        
    angular.module('tanandApp').factory('webServiceFactory', webServiceFactory);
                                           
}());