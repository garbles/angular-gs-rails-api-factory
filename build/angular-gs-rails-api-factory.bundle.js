if (typeof module !== 'undefined' && typeof exports !== 'undefined' && module.exports === exports){
  module.exports = 'gs.apibase';
}

(function(window, angular, undefined) {'use strict';

angular.module('gs.apibase', [])
.provider('ApiBase', [function () {
  var _url = '',
    _prefix = '';

  this.setUrl = function (url) {
    _url = url;
  };

  this.setPrefix = function (prefix) {
    _prefix = prefix;
  };

  this.$get = [function () {
    if (_url.slice(_url.length - 1) === '/') {
      _url = _url.slice(0, _url.length - 1);
    }

    if (_prefix[0] === '/') {
      _prefix = _prefix.slice(1);
    }

    return _url + '/' + _prefix;
  }];
}]);


})(window, window.angular);

// http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/comment-page-1/

(function(window, angular, undefined) {'use strict';

angular.module('gs.to-snake-case', [])
.service('toSnakeCase', function () {
  return function (str) {
    if (!angular.isDefined(str)) {
      return str;
    }
    var newStr = str[0].toLowerCase() + str.slice(1);
    return newStr.replace(/([A-Z])/g, function($1){return '_'+$1.toLowerCase();});
  };
});

})(window, window.angular);

if (typeof module !== 'undefined' && typeof exports !== 'undefined' && module.exports === exports){
  module.exports = 'gs.rails-api-factory';
}

(function(window, angular, undefined) {'use strict';

angular.module('gs.rails-api-factory', [
  'ngResource',
  'gs.apibase',
  'gs.to-snake-case'
])
.factory('RailsApiFactory', ['$resource', '$injector', 'ApiBase', 'toSnakeCase',
function ($resource, $injector, ApiBase, toSnakeCase) {
  return function (model, opts) {
    var _snakeModel = toSnakeCase(model),
      _snakeModels,
      _resource,
      _params,
      _mixinResponse;

    opts = (opts || {});
    if (opts.plural) {
      _snakeModels = toSnakeCase(opts.plural);
    } else {
      _snakeModels = _snakeModel + 's';
    }

    _resource = $resource(ApiBase + '/' + _snakeModels + '/:id', {id: '@id'}, {'update': {method: 'PATCH'}});

    _mixinResponse = function (response) {
      var collection = response[_snakeModels];
      if (collection) {
        return $injector.get(model + 'Collection').mixin(collection);
      } else {
        return $injector.get(model).mixin(response);
      }
    };

    _params = function (args) {
      var params = {};
      if (angular.isArray(args)) {
        params[_snakeModels] = args;
      } else {
        params[_snakeModel] = args;
      }
      return params;
    };

    return {
      get: function (args) {
        return _resource.get(args).$promise.then(_mixinResponse);
      },
      save: function (args) {
        if (args.id) {
          return _resource.update({id: args.id}, _params(args)).$promise;
        } else {
          return _resource.save(_params(args)).$promise;
        }
      },
      destroy: function (args) {
        return _resource.delete({id: args.id}).$promise;
      }
    };
  };
}]);

})(window, window.angular);
