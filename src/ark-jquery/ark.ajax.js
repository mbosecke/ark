(function(Ark) {
	'use strict';

	var ajaxExtension = {
		name : 'ajax',
		init : function(config) {

		},
		request : function(url, settings){
			return $.ajax(url, settings);
		}
	};

	Ark.prototype.coreExtensions.push(ajaxExtension);
}(Ark));