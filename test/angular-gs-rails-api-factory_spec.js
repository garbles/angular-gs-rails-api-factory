describe('RailsApiFactory', function () {
  var base = 'base',
    modelName = 'Model',
    serializedData = { gabe: 'gabe' },
    Model,
    ModelCollection,
    api,
    $httpBackend;

  beforeEach(function () {
    angular.module('stubModule', [])
      .value('ApiBase', base)
      .factory(modelName, function () {
        return {
          mixin: function (obj) {
            return obj;
          }
        };
      })
      .factory(modelName + 'Collection', function () {
        return {
          mixin: function (obj) {
            return obj;
          }
        };
      })
      .factory(modelName + 'WithSerializer', function () {
        return {
          mixin: function (obj) {
            return angular.extend(obj, this);
          },
          serialize: function () {
            return serializedData;
          }
        };
      })
      .factory(modelName + 'WithSerializer' + 'Collection', function () {
        return {
          mixin: function (obj) {
            return obj;
          }
        };
      });

    module(
      'gs.rails-api-factory',
      'stubModule'
    );
  });

  beforeEach(inject(function (_$httpBackend_, _Model_, _ModelCollection_, _RailsApiFactory_) {
    $httpBackend = _$httpBackend_;
    Model = _Model_;
    ModelCollection = _ModelCollection_;
    api = _RailsApiFactory_(modelName);
  }));

  function requestExpectation (url, apiMethod, httpMethod, data, response) {
    url = base + url;
    $httpBackend.when(httpMethod, url).respond(response);
    $httpBackend['expect' + httpMethod](url);
    api[apiMethod](data);
    $httpBackend.flush();
  }

  it('gets collections and decorates them', function () {
    spyOn(ModelCollection, 'mixin');
    requestExpectation('/models', 'get', 'GET', {}, {models: [{}]});
    expect(ModelCollection.mixin).toHaveBeenCalled();
  });

  it('gets single records and decorates them', function () {
    spyOn(Model, 'mixin');
    requestExpectation('/models/1', 'get', 'GET', {id: 1}, {});
    expect(Model.mixin).toHaveBeenCalled();
  });

  it('posts new records', function () {
    requestExpectation('/models', 'save', 'POST', {}, {});
  });

  it('updates existing records', function () {
    requestExpectation('/models/1', 'save', 'PATCH', {id: 1}, {});
  });

  it('deletes existing records', function () {
    requestExpectation('/models/1', 'destroy', 'DELETE', {id: 1}, {});
  });

  it('appropriately handles alternative endpoints', inject(function (_RailsApiFactory_) {
    var plural = 'modelzzzz';

    api = _RailsApiFactory_(modelName, {plural: plural});
    requestExpectation('/' + plural, 'get', 'GET', {}, {});
  }));

  it('uses the object serializer if one is present', inject(function (_RailsApiFactory_, _ModelWithSerializer_) {
    var url = '/model_with_serializers',
      obj = _ModelWithSerializer_.mixin({}),
      data = { model_with_serializer: serializedData },
      _api = _RailsApiFactory_(modelName + 'WithSerializer');

    $httpBackend.when('POST', base + url).respond({});
    $httpBackend.expectPOST(base + url, data);
    _api.save(obj);
    $httpBackend.flush();
  }));
});
