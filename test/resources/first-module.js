(function(Ark){
	'use strict';
	
	Ark.register('first-module', function(sandbox, element){
			
		var logger = sandbox.logger,
			bus = sandbox.bus,
			dom = sandbox.dom,
			event = sandbox.event;
		
		return {
			init: function(){
				
				logger.log('info', 'First module initialized.');
				
				var header = element.getElementsByTagName('h2')[0];
				dom.text(header, 'First Module Initialized');
				
				event.on(element, 'click', function(event){
					logger.log('trace', 'First module clicked.');
					bus.notify('main', 'first-module-click', event);
				});
				
			},
			events: {
				
			},
			testLog: function(){
				logger.log('info', 'This is an inheritance test');
			}
		};
			
	});
	
}(Ark));