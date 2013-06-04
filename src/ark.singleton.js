(function(Ark) {
	'use strict';

	Ark._coreExtend('singleton', function(config){
	
		var singletons = {};

		return {
			registerSingleton : function(singletonId, singleton) {
				singletons[singletonId] = singleton;
			},
			getSingleton : function(singletonId) {
				return singletons[singletonId];
			}
		};
	});
	
}(Ark));