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

	Ark.prototype._coreExtensions.push(ajaxExtension);
}(Ark));