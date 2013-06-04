(function(Ark) {
	'use strict';
	
	Ark.extend('ajax', function(config){
		return {
			name : 'ajax',
			init : function() {

			},
			request : function(url, settings){
				return $.ajax(url, settings);
			}
		};
	});

}(Ark));