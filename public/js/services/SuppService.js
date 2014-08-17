angular.module('SuppService', []).factory('Supps', ['$http', function($http){
	return {
		//call to get all supps
		get : function(){
			return $http.get('/api/supps');
		},
                update : function(supp){
                    return $http.post('/api/supps/' + supp._id, supp);
                },
		create: function(supp){
			return $http.post('/api/supps', supp);
		},

		delete : function(id){
			return $http.delete('/api/supps/' + id);
		}
		}
}]);
