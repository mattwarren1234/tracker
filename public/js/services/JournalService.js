angular.module('JournalService', []).factory('Journal', ['$http', function($http){
	return {
		//call to get all supps
		get : function(date){
			return $http.get('/api/journal/' +  date);
		},
//                update : function(supp){
//                    return $http.post('/api/supps/' + supp._id, supp);
//                },
//		create: function(supp){
//			return $http.post('/api/supps', supp);
//		},
//
//		delete : function(id){
//			return $http.delete('/api/supps/' + id);
//		}
		}
}]);
