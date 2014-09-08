angular.module('JournalService', []).factory('Journal', ['$http', function($http) {
        return {
            //call to get all supps
            get: function(param) {
                return $http.get('/api/journal/', {params: {date: param.date.getTime(), userId: param.userId}});
            },
            save: function(journalLog) {
                return $http.post('/api/journal/', journalLog);
            }
        };
    }]);
