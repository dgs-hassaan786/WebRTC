/// Class which will provide the configurations for table view
function TableModelBuilder(sc) {
    if (typeof sc == 'undefined' || sc == null || typeof sc != 'object')
        throw 'scope is undefined or empty or null';

    var $scope = sc;
    bind_Functionalities();

    function bind_Functionalities() {
        $scope.rowCollection = [];
        $scope.columns = [];
        $scope.originalcolumns = [];
        $scope.searchColumns = [];
        $scope.search = true;
        $scope.Filters = [
            { value: 'CT', filter: 'Contains' },
            { value: 'EQ', filter: 'Equals' },
            { value: 'ET', filter: 'Ends With' },
            { value: 'ST', filter: 'Starts With' }
        ];
        $scope.options = {
            selectedField: '',
            selectedFilter: '',
            searchValue: '',
            page: 1,
            pagesize: 10,
            pagingOptions: [5, 10, 15, 20, 50, 100, 500, 1000],
            total: ''
        };
        $scope.displayedCollection = [].concat($scope.rowCollection);
    };

    this.bindColumns = function (header, field, show) {
        for (var i = 0; i < header.length; i++)
            $scope.columns.push({ 'header': header[i], 'field': field[i], 'show': show[i] });
    };

    this.setOriginalColumns = function (header, field, show) {
        for (var i = 0; i < header.length; i++)
            $scope.originalcolumns.push({ 'header': header[i], 'field': field[i], 'show': show[i] });
    }

    this.bindSearchColumn = function (header, field, show) {
        for (var i = 0; i < header.length; i++)
            $scope.searchColumns.push({ 'header': header[i], 'field': field[i], 'value': show[i] });
    };

    this.bindSearchResults = function (cols) {
        switch (cols.field) {
            case "ALL": {
                $scope.searchColumns[1].value = false;
                $scope.searchColumns[2].value = false;
                $scope.searchColumns[0].value = true;
               // $scope.search = '';
                break;
            }
            case "A": {
                $scope.searchColumns[1].value = true;
                $scope.searchColumns[2].value = false;
                $scope.searchColumns[0].value = false;
               // $scope.search = true;
                break;
            }
            case "I": {
                $scope.searchColumns[2].value = true;
                $scope.searchColumns[1].value = false;
                $scope.searchColumns[0].value = false;
              //  $scope.search = false;
                break;
            }
        }
    };

    this.bindFilters = function (value, filter) {
        $scope.Filters.push({ 'value': value, 'filter': filter });
    };

    this.bindOptions = function (selectedField, selectedFilter, pagingOptions, pagesize, dynamicKV) {
        $scope.options.selectedField = selectedField;
        $scope.options.selectedFilter = selectedFilter;
        if (pagingOptions)
            $scope.options.pagingOptions = pagingOptions;

        if (pagesize)
            $scope.options.pagesize = pagesize;

        if (dynamicKV) {
            for (var i = 0 ; i < dynamicKV.length; i++)
                $scope.options[dynamicKV[i].key] = dynamicKV[i].value;
        }

    };

    this.bindSearch = function (kv) {
        if (typeof $scope.search == 'undefined')
            $scope.search = [];

        if (kv) {
            for (var i = 0 ; i < kv.length; i++)
                $scope.search[kv[i].key] = kv[i].value;
        }
    };

    this.addSearch = function (obj) {
        $scope.search.push(obj);
    };

    this.removeSearch = function (index) {
        if (typeof index != 'undefined') {
            $scope.search.splice(index, 1);
        }
        $scope.search.pop();
    }

    this.getScope = function () {
        return $scope;
    };

    this.searchWatchFilter = function ($filter) {
        $scope.$watch('options.searchValue', function (newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                var items = $filter('myFilter')($scope.rowCollection, $scope.options);
                $scope.displayedCollection = angular.copy(items);
            }
        }, true);
    };

    this.searchColumnWatch = function (name) {
        $scope.$watch('columns', function (newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                localStorage.setItem(name, JSON.stringify(newValue));
            }
        }, true);
    }

    this.resetColumns = function (name) {
        localStorage.removeItem(name);
        $scope.columns = angular.copy($scope.originalcolumns);
    };

    this.addSortableOption = function () {
        $scope.sortableOptions = {
            containment: "#sort-container"
        };
    };
}

function TemplateSwitcher(sc) {
    if (typeof sc == 'undefined' || sc == null || typeof sc != 'object')
        throw 'scope is undefined or empty or null';
    var $scope = sc;

    (function bindTemplateBuild() {
        $scope.tempData = {};
        $scope.tempData.data = null;
    })();

    this.setTemplate = function (arr) {
        $scope.templates = arr;
        $scope.curTemplate = $scope.templates[0];
    };

    this.bindTemplateChangeWatcher = function ($rootScope) {
        return $rootScope.$on('ChangeTemplate', function (event, data) {
            $scope.curTemplate = $scope.templates[data.index];
        });
    };

    this.destroyTemplateWatcher = function (obj) {
        $scope.$on('$destroy', obj);
    };
}

function ShowLoader() {
    $('.LoaderModal').show();
}

function HideLoader() {
    $('.LoaderModal').hide();
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
}

function colguid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
    }
    return s4() + s4();
}

Array.prototype.updateValue = function (key, id, keyupdate, valueupdate) {
    for (var i = 0; i < this.length; i++) {
        if (this[i][key] == id) {
            this[i][keyupdate] = valueupdate;
            break;
        }
    }
}

Array.prototype.sliceValue = function (key, id) {
    for (var i = 0; i < this.length; i++) {
        if (this[i][key] == id) {
            this.splice(i, 1);
            break;
        }
    }
}
