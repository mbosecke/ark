(function(Ark) {
	'use strict';

	Ark.extend('event', function(config){
		return {
			name : 'event',
			init : function() {

			},
			
			blur: function(element){
				$(element).blur();
			},
			click: function(element){
				$(element).click();
			},
			focus: function(element){
				$(element).focus();
			},
			off: function(element, events){
				$(element).off(events);
			},
			on: function(element, events, handler){
				$(element).on(events, handler);
			},
			submit: function(element){
				$(element).submit();
			}
			
		};
	});
	
}(Ark));