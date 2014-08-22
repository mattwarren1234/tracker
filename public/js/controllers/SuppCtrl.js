angular.module('SuppCtrl', [])
    .controller('SuppController', function($scope, Supps) {
        $scope.itemToEdit = {};
        $scope.selected = {};
        $scope.windowMessage = {
                text : ""
        };
        $scope.object = {item1: "ohhai"};
        $scope.showInitialEmptyItem = false;

        $scope.initSupp = {};
        $scope.defaultValues = {
            name: "New Supplement",
            description: "",
            dosage: "",
            benefits: [{text : ""}]
        };
        Object.freeze($scope.defaultValues);

        $scope.showInitial = function() {
            $scope.initSupp.name = $scope.defaultValues.name;
            $scope.initSupp.description = $scope.defaultValues.description;
            $scope.initSupp.dosage = $scope.defaultValues.dosage;
            $scope.initSupp.benefits = $scope.defaultValues.benefits;
            $scope.showInitialEmptyItem = true;

        };

        $scope.addSupp = function() {
            $scope.showInitial();
            $scope.itemToEdit = $scope.initSupp;
        };


        $scope.refreshList = function() {
            Supps.get()
                .success(function(data) {
                    $scope.supps = data;
                    $scope.showInitialEmptyItem = false;
                    $scope.itemToEdit = {};
                });
        };

        $scope.setEdit = function(item) {
            console.log("set edit called");
            if (item === $scope.itemToEdit)
                return;
            $scope.itemToEdit = {};
            $scope.itemToEdit = item;
            $scope.titleEditMode = false;
        };

        $scope.refreshList();

    })
    .directive("suppEditable", ['Supps',
        function(Supps) {
            return{
                templateUrl: '/public/views/editable.html',
                controller: function($scope) {
                    //     $scope.obj.item1 = " try try ";
//               $scope.obj = $scope.$parent.obj;
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
                    $scope.setEdit = $scope.$parent.setEdit;

                    $scope.delete = function(item) {
                        if (!confirm("Are you sure you want to delete this item?"))
                            return;
                        Supps.delete(item._id)
                            .success(function(data) {
                                $scope.$parent.refreshList();
                            });
                    };

                    $scope.isNewObject = function(item) {
                        return item._id == undefined;//if id is set, is from server.
                    };

                    $scope.save = function(item) {
                        $scope.lower = " updtaed in dir ";
                        $scope.object.item1 = "oh try ";
                        if ($scope.isNewObject(item)) {
                            Supps.create(item)
                                .success(function(data) {
                                    $scope.$parent.refreshList();
                                    //not doing anything with data, b/c it should already match client side!
                                    $scope.windowMessage.text = "Item saved!";
//                                    $scope.$apply();
                                    setTimeout(function() {
                                        $scope.windowMessage.text = "";
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
                                    $scope.windowMessage.text = "Item updated!";
//                                    $scope.$apply();
                                    setTimeout(function() {
                                        $scope.windowMessage.text = "";
                                        $scope.$apply();
                                    }, 2500);
                                })
                                .error(function(data) {
                                    console.log(data);
                                });
                        }
                    };
                },
                scope: {
                    windowMessage:"=",
                    object: "=",
                    lower: "=",
                    supp: '=supp',
                    update: "@",
                    itemToEdit: "=",
                    onRefresh: "&"
                },
            };
        }]);
