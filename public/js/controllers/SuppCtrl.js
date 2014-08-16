angular.module('SuppCtrl', [])
    .controller('SuppController', function($scope, Supps) {
        $scope.tagline = 'view supplements here!';
        var supp = {
            name: "Vitamin D",
            description: "Its a pill, yo!",
            dosage: "300mg",
            benefits: ["Does amazing things",
                "many amazing things"]
        };
        $scope.input = "test input hah";
        var supp2 = {
            name: "Fish oil",
            description: "Supposed to help with joints",
            dosage: "200mg",
            benefits: []
        };
        $scope.testSupp = supp2;

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
                console.log("test");
                console.log("failed, yo!" + data);
            });

        $scope.toggleTitleEdit = function() {
            $scope.titleEditMode = !$scope.titleEditMode;
            console.log("title edit mode set to " + $scope.titleEditMode);
        };
        $scope.addBenefit = function() {
            //if (!$scope.newBenefit) return;
            if (!$.isEmptyObject($scope.newBenefit)) {
//                $scope.itemToEdit.benefits.push($scope.newBenefit.text);
                $scope.newBenefit = {};
            }
        };
        $scope.isBindingWorking = function() {
            console.log("yes, binding is working");
        };
        $scope.deleteCurrent = function(item) {
            if (!confirm("Are you sure you want to delete this item?"))
                return;
            var index = $scope.supps.indexOf(item);
            if (index === -1)
                return;
            Supps.delete(item)
                .success(function(data) {
                    $scope.supps = data;
                });
//        Supps.create($scope.formData)
//            // if successful creation, call our get function to get all the new todos
//            .success(function(data) {
//                $scope.formData = {}; // clear the form so our user is ready to enter another
//                $scope.todos = data; // assign our new list of todos
//            });


            /*Supps.delete(item)
             .success(function(data){
             $scope.supps = data;
             });*/
            $scope.supps.splice(index, 1);
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
            Supps.create($scope.newSupp).
                success(function(data) {
                    $scope.supps = data;
                }).error(function(data)
            {
                console.log("errah brah!" + data);
            });
//            $scope.setEdit(newSupp);
        };
        $scope.setEdit = function(item) {
            if (item === $scope.itemToEdit)
                return;
            $scope.itemToEdit = item;
            $scope.selected = $scope.itemToEdit;
            $scope.titleEditMode = false;
        };
    })
    .directive("suppEditable",
        function() {
            return{
                templateUrl: '/public/views/editable.html',
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
                transclude: true
            };
        });
