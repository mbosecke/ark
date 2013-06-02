(function(Ark) {
	'use strict';

	var singletons = {};

	var singletonExtension = {
		name : 'singleton',
		init : function(config) {

		},
		registerSingleton : function(singletonId, singleton) {
			singletons[singletonId] = singleton;
		},
		getSingleton : function(singletonId) {
			return singletons[singletonId];
		}
	};

	Ark.prototype.coreExtensions.push(singletonExtension);
}(Ark));