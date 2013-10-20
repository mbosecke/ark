(function(window){

	/**
	 * Closure variables available
	 */
	var _defaultConfig,
		_mergeModules,
		coreExtensions = [],
		userExtensions = [],
		userModules = {};
	

	/**
	 * Default config to be merged with user config. 
	 * 
	 * This object should not be used/manipulated publicly.
	 */
	_defaultConfig = {
		container: null,
		logger : {
			level : 'error',
			prefix : ''
		},
		debug: false
	};
	
	
	_mergeModules = function(baseModule, extendedModule){
		'use strict';
		var finalModule = {};
		
		// create a hidden variable to store the base module
		finalModule.__base__ = baseModule;
		
		// a function to call the methods of the base module
		finalModule._super = function(methodName, args){
			var objectWithMethod = this;
			while( objectWithMethod.hasOwnProperty(methodName) === false){
				objectWithMethod = objectWithMethod.__base__;
			}
			objectWithMethod[methodName].apply(finalModule, args);
		};
		
		// add properties from the baseModule to the final module
		for(var prop in baseModule){
			if(baseModule.hasOwnProperty(prop)){
				if(prop != '__base__'){
					finalModule[prop] = baseModule[prop];
				}
			}
		}
		
		/* 
		 * add properties from the extended module to the final module 
		 * which might override the ones set by the base module.
		 */
		for(prop in extendedModule){
			if(extendedModule.hasOwnProperty(prop)){
				finalModule[prop] = extendedModule[prop];
			}
		}
		 
		return finalModule;
	};
	
	/**
	 * Ark constructor
	 * 
	 * @param userConfig object
	 */
	function Ark(userConfig) {
		'use strict';

		this.sandbox = {}; 
		this.config = _defaultConfig;
		
		/* 
		 * Shallow merge of user settings with default settings.
		 * Perhaps this should be improved to a deep merge.
		 */ 
		for(var attr in userConfig){
			if(userConfig.hasOwnProperty(attr)){
				this.config[attr] = userConfig[attr];
			}
		}
		
		// init core extensions right away because the main library relies on some of them
		for (var i = 0; i < coreExtensions.length; i++) {
			var coreExtension = coreExtensions[i];
			this._initExtension(coreExtension, this.config[coreExtension.name]);
		}
		
		this._log('Ark constructed');
	}
	
	/**
	 * Registers a core extension
	 * 
	 * @param name
	 * @param factory
	 */
	Ark._coreExtend = function(name, factory){
		coreExtensions.push({
			name: name,
			factory: factory
		});
	};
	
	/**
	 * Registers a user extension
	 * 
	 * @param name
	 * @param factory
	 */
	Ark.extend = function(name, factory) {
		'use strict';
	
		userExtensions.push({
			name: name,
			factory: factory
		});
	};
	
	

	/**
	 * Register a user module
	 * 
	 * @param name
	 * @param base
	 * @param factory
	 */
	Ark.register = function(name, base, factory){
		'use strict';
		
		if(arguments.length === 2){
			factory = base;
			base = null;
		}

		userModules[name] = {
			base: base,
			factory: factory,
			instances : []
		};
	};

	/**
	 * Ark version number
	 */
	Ark.prototype.version = '0.0.1';

	/**
	 * The start function will bootstrap the extensions and modules.
	 */
	Ark.prototype.start = function(){
		'use strict';
		
		this._log('Starting Ark...');
		
		if(this.started){
			this._error('Ark is already started.');
		}else{
			// init user extensions
			this._log('Initializing user extensions...');
			for(var i = 0; i < userExtensions.length; i++){
				var extension = userExtensions[i];
				this._initExtension(extension);
			}
			this._log('User extensions initialized.');
			
			// sanitize sandbox to handle errors
			this.sandbox.error.sanitize(this.sandbox);
			
			// init user modules
			this._log('Initializing user modules...');
			this.scan(this.config.container);
			this._log('User modules initialized.');
			
			this._log('Ark started.');
			this.started = true;
		}
	};
	
	
	/**
	 * Full cleanup of the application.
	 * 
	 * Will call the "destroy" function of all user modules.
	 */
	Ark.prototype.stop = function(){
		
		for(var moduleId in this.modules){
			if(this.modules.hasOwnProperty(moduleId)){
				for(var instance in this.modules[instance].instances){
					instance.destroy();
				}
			}
		}
		this.sandbox = null;
	};



	/**
	 * Scans for module instances in the arks container
	 * 
	 */
	Ark.prototype.scan = function(containerElement) {
		'use strict';
		var i, 
			element, 
			moduleId, 
			container = containerElement || window.document.body, 
			moduleElements = container.querySelectorAll('[data-ark-module]');
		for (i = 0; i < moduleElements.length; i++) {
			element = moduleElements[i];
			moduleId = element.getAttribute('data-ark-module');
			this._initModule(moduleId, element);
		}
	};


	/**
	 * log function that delegates logging to the logging extension
	 * if it exists.
	 * 
	 * This function should not be used publicly.
	 * 
	 * @param message
	 */
	Ark.prototype._log = function(message){
		'use strict';
		
		if (this.sandbox.logger && this.sandbox.logger.log){
			this.sandbox.logger.log('trace', '[Ark.js] ' + message);
		}
	};

	/**
	 * error function that delegates error handling to the error extension
	 * if it exists.
	 * 
	 * This function should not be used publicly.
	 * 
	 * @param message Error message
	 * @param ex Exception
	 */
	Ark.prototype._error = function(message, ex){
		'use strict';
		
		if(this.sandbox.error && this.sandbox.error.handle){
			this.sandbox.error.handle(message, ex);
		}
	};


	/**
	 * Initializes an extension by calling the factory
	 * function.
	 * 
	 * This function should not be used publicly.
	 * 
	 * @param extension
	 * @param config
	 */
	Ark.prototype._initExtension = function(extension, config){
		'use strict';
		
		if(this.started){
			this._error('Can not initialize extension after Ark has already been started.');
		}
		else{
			this._log('Initializing extension: ' + extension.name);
			
			// make sure config is at least an empty but defined object
			config = config || {};
			
			this.sandbox[extension.name] = {};
			
			var extensionInstance = extension.factory(config);
			
			if(typeof extensionInstance.init === 'function'){
				extensionInstance.init.call(extensionInstance);
			}

			for ( var property in extensionInstance) {
				if(extensionInstance.hasOwnProperty(property)){
					var value = extensionInstance[property];
					this.sandbox[extension.name][property] = value;
				}
			}
		}
	};

	/**
	 * Initializes a module. It will call the factory function
	 * using sandbox and element as parameters and then if the 
	 * returned object has an 'init' function, that will be called.
	 * 
	 * This function should not be used publicly.
	 */
	Ark.prototype._initModule = function(moduleId, element ) {
		'use strict';
		
		var module = userModules[moduleId], 
			instance = module.factory(this.sandbox, element);
		
		if(module.base && userModules[module.base]){
			var baseModule = userModules[module.base].factory(this.sandbox, element);
			instance = _mergeModules(baseModule, instance);
		}
		
		/*
		 * Wrap each function of the module with an error handler to prevent 
		 * uncaught errors from stopping the entire application.
		 */
		if(!this.config.debug){
			this.sandbox.error.sanitize(instance);
		}
		
		module.instances.push(instance);
		
		// call the init function of the module
		instance.init();
		
		// register the events of the module with the bus
		if(instance.hasOwnProperty('events')){
			var events = instance.events;
			
			// loop through the events 
			for(var event in events){
				if(events.hasOwnProperty(event)){
					
					// register with bus
					this.sandbox.bus.listen(event, events[event], instance);
				}
			}
		}
		return instance;
	};



	
	
	/**
	 * add Ark to the global namespace
	 */
	window.Ark = Ark;
	
}(window));