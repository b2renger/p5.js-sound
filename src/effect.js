define(function (require) {
	'use strict';

	var p5sound = require('master');
	var CrossFade = require('Tone/component/CrossFade');

	p5.Effect = function() {
		this.ac = p5sound.audiocontext;

		this.input = this.ac.createGain();
		this.output = this.ac.createGain();

		/**
		 *	The p5.Effect class is built
		 * 	using Tone.js CrossFade
		 *	@property _drywet
		 *	@type {Object} ToneJS node
		 */
		this._drywet = new CrossFade();

		/**
		 *	In classes that extend
		 *	p5.Effect, connect effect nodes
		 *	to the wet parametee
		 *	@property wet
		 *	@type {Object} Web Audio Gain Node
		 */
		this.wet = this.ac.createGain();

		this.input.connect(this._drywet.a);
		this.wet.connect(this._drywet.b);
		this._drywet.connect(this.output);

		this.connect();

		//Add to the soundArray
		p5sound.soundArray.push(this);
	};

	/**
	 *	Send output to a p5.sound or web audio object	
	 *	
	 *	@method connect 
	 *	@param {Object} unit 
	 */
	p5.Effect.prototype.connect = function (unit) {
		var u = unit || p5.soundOut.input;
		this.output.connect(u.input ? u.input : u);
	};


	/**
	 *	Disconnect all output.	
	 *	
	 *	@method disconnect 
	 */
	p5.Effect.prototype.disconnect = function() {
		this.output.disconnect();
	};


	/**
	 *	Adjust the dry/wet knob value.	
	 *	
	 *	@method drywet
	 *	@param {Float}
	 */
	p5.Effect.prototype.drywet = function(fade){
			this._drywet.fade.value = fade;
	};


	p5.Effect.prototype.dispose = function() {
		// remove refernce form soundArray
		var index = p5sound.soundArray.indexOf(this);
		p5sound.soundArray.splice(index, 1);

		this.input.disconnect();
		this.input = undefined;

		this.output.disconnect();
		this.output = undefined;

		this.ac = undefined;
	};


	/**
	 *	Link effects together in a chain	
	 *	Example uUsage: filter.chain(reverb,delay,panner);
	 *	May be used with open-ended number of arguments
	 *
	 *	@method chain 
     *  @param {Object} arguments p5.Effect objects	
	 */		
	p5.Effect.prototype.chain = function(){
		if (arguments.length>0){
			this.output.connect(arguments[0]);
		
			for(var i=1;i<arguments.length; i+=1){
				arguments[i-1].connect(arguments[i]);
			}
		}
		return this;
	}
	
		
	return p5.Effect;

});







