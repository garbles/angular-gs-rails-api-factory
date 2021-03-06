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
      _model = $injector.get(model),
      _collection = $injector.get(model + 'Collection'),
      _snakeModels,
      _resource,
      _params,
      _mixinResponse;

    opts = (opts || {});

    if (opts.plural) {
      _snakeModels = toSnakeCase(opts.plural);
    } else if (_snakeModel.slice(_snakeModel.length - 1) === 'y') {
     _snakeModels = _snakeModel.slice(0, _snakeModel.length - 1) + 'ies';
    } else {
      _snakeModels = _snakeModel + 's';
    }

    _resource = $resource(ApiBase + '/' + _snakeModels + '/:id', {id: '@id'}, {'update': {method: 'PATCH'}});

    _mixinResponse = function (response) {
      var collection = response[_snakeModels];
      if (collection) {
        return _collection.mixin(collection);
      } else {
        return _model.mixin(response);
      }
    };

    _params = function (args) {
      var params = {},
        serializedArgs;

      if(angular.isFunction(args.serialize)) {
        serializedArgs = args.serialize();
      } else {
        serializedArgs = args;
      }

      if (angular.isArray(serializedArgs)) {
        params[_snakeModels] = serializedArgs;
      } else {
        params[_snakeModel] = serializedArgs;
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
