(function(Ark) {
	'use strict';

	var singletons = {};

	var singletonExtension = {
		name : 'singleton',
		registerSingleton : function(singletonId, singleton) {
			singletons[singletonId] = singleton;
		},
		getSingleton : function(singletonId) {
			return singletons[singletonId];
		}
	};

	Ark.prototype.coreExtensions.push(singletonExtension);
}(Ark));