
/**
 * Ark constructor
 * 
 * @param settings object
 */
function Ark(settings) {
	'use strict';

	this.sandbox = {}; 
	this.config = this._defaultConfig;
	
	/* 
	 * Shallow merge of user settings with default settings.
	 * Perhaps this should be improved to a deep merge.
	 */ 
	for(var attr in settings){
		if(settings.hasOwnProperty(attr)){
			this.config[attr] = settings[attr];
		}
	}
	
	this.modules = this.config.modules || [];
	this.extensions = this.config.extensions || [];
	
	// init core extensions right away because the main library relies on some of them
	for (var i = 0; i < this._coreExtensions.length; i++) {
		var coreExtension = this._coreExtensions[i];
		this._initExtension(coreExtension, this.config[coreExtension.name]);
	}
	
	this._log('Ark constructed');
}

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
		for(var i = 0; i < this.extensions.length; i++){
			var extension = this.extensions[i];
			this._log('Initializing ' + extension.name + '...');
			this._initExtension(this.extensions[i].instance, this.extensions[i].config);
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
 * Registers an extension.
 * 
 * @param extension		The extension object
 * @param config		The config object for the extension
 */
Ark.prototype.extend = function(extension, config) {
	'use strict';
	
	if (this.started) {
		this._error('Can not register extension after Ark has already been started.');
	} else{
		this.extensions.push({
			instance: extension,
			config: config
		});
	}
};


/**
 * Registers a module.
 */
Ark.prototype.register = function(moduleId, base, creator){
	'use strict';
	
	if(arguments.length === 2){
		creator = base;
		base = null;
	}

	this.modules[moduleId] = {
		base: base,
		creator: creator
	};
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
		moduleElements = container.querySelectorAll('[data-module]');
	for (i = 0; i < moduleElements.length; i++) {
		element = moduleElements[i];
		moduleId = element.getAttribute('data-module');
		this._initModule(moduleId, element);
	}
};

/**
 * Ark core extensions. 
 * 
 * This array should not be used/manipulated publicly.
 */
Ark.prototype._coreExtensions = [];

/**
 * Default config to be merged with user config. 
 * 
 * This object should not be used/manipulated publicly.
 */
Ark.prototype._defaultConfig = {
	container: null,
	logger : {
		level : 'error',
		prefix : ''
	},
	debug: false
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
	
	if (this.sandbox.logger.log){
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
 * Instantiates and initializes an extension.
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
		// make sure config is at least an empty but defined object
		config = config || {};
		
		this.sandbox[extension.name] = {};
		
		if(this.sandbox.error && this.sandbox.error.sanitize){
			this.sandbox.error.sanitize(extension);
		}
		
		if(typeof extension.init === 'function'){
			extension.init.call(extension, config);
		}

		for ( var property in extension) {
			if(extension.hasOwnProperty(property)){
				var value = extension[property];
				this.sandbox[extension.name][property] = value;
			}
		}
	}
};

/**
 * method to register a new module with the ark.
 * 
 * This function should not be used publicly.
 */
Ark.prototype._initModule = function(moduleId, element ) {
	'use strict';
	
	var module = this.modules[moduleId], 
		instance = module.creator(this.sandbox, element);
	
	if(module.base && this.modules[module.base]){
		var baseModule = this.modules[module.base].creator(this.sandbox, element);
		instance = this._mergeModules(baseModule, instance);
	}
	
	/*
	 * Wrap each function of the module with an error handler to prevent 
	 * uncaught errors from stopping the entire application.
	 */
	if(!this.config.debug){
		this.sandbox.error.sanitize(instance);
	}
	
	// call the init function of the module
	instance.init.call(instance);
	return instance;
};


Ark.prototype._mergeModules = function(baseModule, extendedModule){
	'use strict';
	var finalModule = {};
	
	// create a hidden variable to store the base module
	finalModule.__super__ = baseModule;
	
	// a function to call the methods of the base module
	finalModule._super = function(methodName, args){
		var objectWithMethod = this;
		while( objectWithMethod.hasOwnProperty(methodName) === false){
			objectWithMethod = objectWithMethod.__super__;
		}
		objectWithMethod[methodName].apply(finalModule, args);
	};
	
	// add properties from the baseModule to the final module
	for(var prop in baseModule){
		if(baseModule.hasOwnProperty(prop)){
			if(prop != '__super'){
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

