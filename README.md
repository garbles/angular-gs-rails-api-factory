# angular-gs-rails-api-factory

[![Build Status](https://secure.travis-ci.org/garbles/angular-gs-rails-api-factory.png?branch=master)](https://travis-ci.org/garbles/angular-gs-rails-api-factory)

Easy setup for accessing Rails API endpoints.

__RESTANGULAR is better than this and you should probably use RESTANGULAR in most of your use cases. I wrote this for the lelz.__

### Installing

`bower install angular-gs-rails-api-factory`

### Using

This package depends on two of my other packages ([gs-angular-to-snake-case](), [gs-angular-apibase]()) as well as [ngResource](). If you do not want to include my other packages in your application directly, make sure you use the bundled file instead of the main file. Include the package in your application:

```javascript
var app = angular.module('app', ['gs.rails-api-factory']);
```

Set the base URL and prefix in your config:

```javascript
app.config('ApiBase', function (ApiBase) {
  ApiBaseProvider.setUrl('www.garbl.es');
  ApiBaseProvider.setPrefix('api/v1');
});
```

This plugin also requires that you have "model" factories/services that reply to `.mixin` (as the primary method for instantiating the model) and are named the same as your API endpoint. For example, if you're fetching a cat from `/api/v1/cats/1`, then your model should be called `Cat`. Additionally, you must have a collection object so that when `/api/v1/cats` returns an array of cats you can wrap it, _i.e._ `CatCollection`. This model must also reply to `.mixin`.

Now you can create your API service using the factory

```javascript
app.factory('CatApi', function (RailsApiFactory) {
  return RailsApiFactory('Cat');
});
```

If your model and url don't exactly match, you can provide a `plural` option:

```javascript
app.factory('CatApi', function (RailsApiFactory) {
  return RailsApiFactory('Cat', {plural: 'Dog'});
});
```

which will result in requests going to `/api/v1/dogs/:id`.

Finally, the newly created API service only replies to 3 methods: `get`, `save`, and `destroy`.

#### get

Given an object with an `id` the method will make a get request for that record.

```javascript
CatApi.get({id: 1}); // => Cat
```

Given an object __without__ an `id` the method will make a get request to the index action.

```javascript
CatApi.get(); // => [Cat, Cat, Cat]
```

#### save

Pass in an object. If the object has an `id` key it will send a `PATCH`. If the object does not have an `id`, the service will send a `POST`

```javascript
CatApi.save(cat);
```

#### destroy

Pass in an object with an `id` and a `DELETE` request will be made for that record.

```javascript
CatApi.destroy(cat);
```
