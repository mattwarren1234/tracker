angular.module('SuppCtrl', [])
    .controller('SuppController', function($scope, Supps) {
        $scope.itemToEdit = {};
        $scope.selected = {};
        $scope.windowMessage = {
            text: ""
        };
        $scope.object = {item1: "ohhai"};
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
                    $scope.newBenefit = {
                        description: ""
                    };
                    $scope.titleEditMode = false;
                    $scope.toggleTitleEdit = function() {
                        $scope.titleEditMode = !$scope.titleEditMode;
                    };
                    $scope.saveTitle = function() {
                        $scope.titleEditMode = false;
                    };
                    $scope.notAlreadySaved = function(currBenefit) {
                        return currBenefit.description !== $scope.newBenefit.description;
                    };
                    $scope.addBenefit = function() {
                        if ($scope.newBenefit.description !== "") {
                            {
                                $scope.supp.benefits.push({description: $scope.newBenefit.description});
                            }
                            $scope.newBenefit.description = "";
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

                    $scope.deleteBenefit = function(item) {
                        console.log(item);

                        var benefits = $scope.$parent.supp.benefits;
                        for (var i = 0; i < benefits.length; i++) {
                            if (item._id === benefits[i]._id) {
                                benefits.splice(i, 1);
                                break;
                            }
                        }
                        Supps.update($scope.$parent.supp)
                            .success(function(data) {
                                console.log(data);
                                //not doing anything witfh data, b/c it should already match client side!
//                                $scope.setEdit({})1;
                                $scope.windowMessage.text = "Item updated!";
                                setTimeout($scope.clearWindowMessage, 2500);
                            })
                            .error(function(data) {
                                console.log(data);
                            });

                        //      if (!confirm("Are you sure you want to delete this item?"))return;
//                        Supps.delete(item._id)
//                            .success(function(data) {
//                                $scope.$parent.refreshList();
//                            });

                    };
                    $scope.isNewObject = function(item) {
                        return item._id == undefined; //if id is set, is from server.
                    };
                    $scope.clearWindowMessage = function() {
                        $scope.windowMessage.text = "";
                        $scope.$apply();
                    };
                    $scope.save = function(item) {
                        if ($scope.isNewObject(item)) {
                            Supps.create(item)
                                .success(function(data) {
                                    $scope.$parent.refreshList();
                                    //not doing anything with data, b/c it should already match client side!
                                    $scope.windowMessage.text = "Item saved!";
                                    setTimeout($scope.clearWindowMessage, 2500);
                                })
                                .error(function(data) {
                                    console.log(data);
                                });
                        } else {
                            Supps.update(item)
                                .success(function(data) {
                                    console.log(data);
                                    //not doing anything witfh data, b/c it should already match client side!
                                    $scope.setEdit({});
                                    $scope.windowMessage.text = "Item updated!";
                                    setTimeout($scope.clearWindowMessage, 2500);
                                })
                                .error(function(data) {
                                    console.log(data);
                                });
                        }
                    };
                },
                scope: {
                    windowMessage: "=",
                    object: "=",
                    supp: '=supp',
                    update: "@",
                    itemToEdit: "=",
                    onRefresh: "&"
                }
            };
        }]);
