(function(Ark){
	'use strict';
	
	Ark.register('second-module', 'first-module', function(sandbox, element) {
	
		var logger = sandbox.logger, 
			bus = sandbox.bus, 
			timesClicked = 0;
	
		return {
			init : function() {
				logger.log('info', 'Second module initialized.');
	
				//dom.text(element, 'this is a second');
	
				//bus.listen('main', 'first-module-click', this.eventHandler, this);
				
				this._super('testLog');
			},
			events: {
				'main' : {
					'first-module-click': this.eventHandler
				}
			},
			eventHandler : function(data){
				timesClicked++;
				
				//dom.text(element, timesClicked);
				logger.log('warn', 'This element now has the following text: ' + dom.text(element));
				logger.log('info', 'Second module registered click from first module');
				
				if(timesClicked > 2){
					this.throwException();
				}
			},
			throwException: function(){
				throw new Error("too many clicks!");
			}
		};
	
	});
	
}(Ark));