angular.module('SuppCtrl', [])
    .controller('SuppController', function($scope, Supps) {
        $scope.tagline = 'view supplements here!';
        $scope.itemToEdit = {};
        $scope.selected = {};
        $scope.message = "";

        $scope.showInitialEmptyItem = false;

        $scope.initSupp = {};
        $scope.defaultValues = {
            name: "New Supplement",
            description: "",
            dosage: "",
            benefits: []
        };
        Object.freeze($scope.defaultValues);


        $scope.showInitial = function() {

//            $scope.initSupp = $scope.defaultValues;
            $scope.initSupp.name = $scope.defaultValues.name;
            $scope.initSupp.description = $scope.defaultValues.description;
            $scope.initSupp.dosage = $scope.defaultValues.dosage;
            $scope.initSupp.benefits = $scope.defaultValues.benefits;
            $scope.showInitialEmptyItem = true;

        };
        $scope.delete = function(item) {
            if (!confirm("Are you sure you want to delete this item?"))
                return;
            Supps.delete(item._id)
                .success(function(data) {
                    $scope.getCurrentList();
                });
        };
        $scope.addSupp = function() {
            $scope.showInitial();
            $scope.itemToEdit = $scope.initSupp;
        };

        $scope.save = function() {
            console.log("scope save calld");
        };

        $scope.isNewObject = function(item) {
            return item._id == undefined;//if id is set, is from server.
        };

        $scope.getCurrentList = function() {
            Supps.get()
                .success(function(data) {
                    $scope.supps = data;
                    $scope.showInitialEmptyItem = false;
                    $scope.itemToEdit = {};
                });
        };

        $scope.save = function(item) {
            console.log("update called! id is");
//            console.log(item);
            if ($scope.isNewObject(item)) {

                Supps.create(item)
                    .success(function(data) {
                        $scope.getCurrentList();
                        //not doing anything with data, b/c it should already match client side!
                        $scope.message = "Item saved!";
                        setTimeout(function() {
                            $scope.message = "";
                            $scope.$apply();

                        }, 2500);
                    })
                    .error(function(data) {
                        console.log(data);
                    });
            } else {
                Supps.update(item)
                    .success(function(data) {
                        console.log(data);
                        //not doing anything with data, b/c it should already match client side!
                        $scope.setEdit({});
                        $scope.message = "Item updated!";
                        setTimeout(function() {
                            $scope.message = "";
                            $scope.$apply();
                        }, 2500);
                    })
                    .error(function(data) {
                        console.log(data);
                    });
            }

        };

        $scope.getCurrentList();

    })
    .directive("suppEditable",
        function() {
            return{
                templateUrl: '/public/views/editable.html',
                controller: function($scope) {
                    $scope.newBenefit = "";

                    $scope.titleEditMode = false;
                    $scope.toggleTitleEdit = function() {
                        $scope.titleEditMode = !$scope.titleEditMode;
                    };
                    $scope.saveTitle = function() {
                        $scope.titleEditMode = false;
                    };
                    $scope.addBenefit = function() {
                        if (!$.isEmptyObject($scope.newBenefit)) {
                            $scope.supp.benefits.push($scope.newBenefit);
                            $scope.newBenefit = "";
                        }
                    };
                    $scope.setEdit = function(item) {
                        console.log("set edit called");
                        if (item === $scope.itemToEdit)
                            return;
                        $scope.itemToEdit = item;
                        $scope.titleEditMode = false;
                    };
                },
                scope: {
                    supp: '=supp',
                    update: "&",
                    delete: "&",
                    save: "&",
                    itemToEdit: "=",
                }
            };
        });
