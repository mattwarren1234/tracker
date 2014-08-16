angular.module('SuppService', []).factory('Supps', ['$http', function($http){
	return {
		//call to get all supps
		get : function(){
			return $http.get('/api/supps');
		},

		create: function(suppData){
			return $http.post('/api/supps', suppData);
		},

		delete : function(id){
			return $http.delete('/api/supps/' + id);
		}
		}
}]);
