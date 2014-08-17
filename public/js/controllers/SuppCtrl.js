angular.module('SuppCtrl', [])
    .controller('SuppController', function($scope, Supps) {
        $scope.tagline = 'view supplements here!';
//        var supp = {
//            name: "Vitamin D",
//            description: "Its a pill, yo!",
//            dosage: "300mg",
//            benefits: ["Does amazing things",
//                "many amazing things"]
//        };
//        var supp2 = {
//            name: "Fish oil",
//            description: "Supposed to help with joints",
//            dosage: "200mg",
//            benefits: []
//        };

        $scope.titleEditMode = false;
        $scope.itemToEdit = {};
        $scope.selected = {};
        $scope.newBenefit = {};

        Supps.get()
            .success(function(data) {
                console.log("got from server!");
                $scope.supps = data;
            })
            .error(function(data) {
                console.log("failed, yo!" + data);
            });

        $scope.toggleTitleEdit = function() {
            $scope.titleEditMode = !$scope.titleEditMode;
            console.log("title edit mode set to " + $scope.titleEditMode);
        };
        $scope.addBenefit = function() {
            if (!$.isEmptyObject($scope.newBenefit)) {
                $scope.newBenefit = {};
            }
        };
        $scope.isBindingWorking = function() {
            console.log("yes, binding is working");
        };
        $scope.saveChanges = function(item) {
            Supps.post

        };

        $scope.deleteCurrent = function(item) {
            if (!confirm("Are you sure you want to delete this item?"))
                return;
            Supps.delete(item)
                .success(function(data) {
                    alert(data);
                    $scope.supps = data;
                });
        };
        $scope.reverseName = function() {
            console.log("name reversed!");
        };

        $scope.newSupp = {
            name: "New Item!",
            description: "",
            dosage: "",
            benefits: []
        };
        $scope.addSupp = function() {
            Supps.create($scope.newSupp)
                .success(function(data) {
                    $scope.supps = data;
                })
                .error(function(data) {
                    console.log("errah brah!" + data);
                });
        };
        $scope.setEdit = function(item) {
            if (item === $scope.itemToEdit)
                return;
            $scope.itemToEdit = item;
            $scope.selected = $scope.itemToEdit;
            $scope.titleEditMode = false;
        };

        $scope.update = function(item) {
            console.log("update called!");
            Supps.update(item)
                .success(function(data) {
                    console.log("update success! returned data:");
                    console.log(data);
                })
                .error(function(data) {
                    console.log("update ERROR! returned data:");
                    console.log(data);
                });
        };
    })
    .directive("suppEditable",
        function() {
            return{
                templateUrl: '/public/views/editable.html',
                controller: function($scope) {

                },
                scope: {
                    supp: '=supp',
                    toggleTitleEdit: "&",
                    update: "&",
                    addBenefit: "&",
                    delete: "&",
                    itemToEdit: "=",
                    selected: "=",
                    setEdit: "&",
                },
//                transclude: true
            };
        });
