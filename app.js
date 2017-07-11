(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective);

function FoundItemsDirective () {
    var ddo = {
        templateUrl: 'menuList.html',
        scope: {
            items: '<',
            onRemove: '&'
        }
            
    };
    return ddo;
}
    

MenuSearchService.$inject = ['$http'];
function MenuSearchService ($http) {
    var service = this;
    
    service.getMatchedMenuItems = function (searchTerm) {
        console.log('search term' + searchTerm);
        var menuItems = [];
        return $http({
            method: "GET",
            url: "https://davids-restaurant.herokuapp.com/menu_items.json"
        }).then(function (response){
            service.menuItems = response.data.menu_items;
            
            var foundItems = [];
            var itemDescription = "";
            var itemShortName = "";
            var itemName = "";
            if (searchTerm !== "" && searchTerm !== undefined) {
                for (var i=0; i<service.menuItems.length; i++) {
                    itemDescription = service.menuItems[i].description;

                    if (itemDescription.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1) {
                        itemShortName = service.menuItems[i].short_name;
                        itemName = service.menuItems[i].name;
                        foundItems.push({"short_name": itemShortName, 
                                        "name": itemName, 
                                        "description": itemDescription});
                    }
                }
            }

            return foundItems;
        }).catch(function (error) {
            console.log("Something went wrong" + error)
        });
    };
    
    
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController (MenuSearchService) {
    var myMenu = this;
//    var myMenu.found = [];
    myMenu.narrowItDown = function () {
        var response = MenuSearchService.getMatchedMenuItems(myMenu.searchTerm);
        response.then(function (foundItems){
            myMenu.found = foundItems;
            console.log(myMenu.found.length);
        });
        
    }
    
    
    
    myMenu.removeItem = function (index) {
        myMenu.found.splice(index, 1);
    }
    
}
    
    
    
    
})();