(function(){
	"use strict";

	/**
	 * @typedef {object} luga.data.DetailSet.context
	 * @extends luga.data.stateDescription
	 *
	 * @property {null|luga.data.DataSet.row} entity
	 */

	/**
	 * @typedef {object} luga.data.DetailSet.options
	 *
	 * @property {string}            uuid           Unique identifier. Required
	 * @property {luga.data.DataSet} parentDataSet  Master dataSet. Required
	 */

	/**
	 * DetailSet class
	 * Register itself as observer of the passed dataSet and act as the details in a master/details scenario
	 *
	 * @param {luga.data.DetailSet.options} options
	 * @constructor
	 * @extends luga.Notifier
	 * @fires dataChanged
	 * @listens dataChanged
	 * @listens currentRowChanged
	 */
	luga.data.DetailSet = function(options){

		var CONST = {
			ERROR_MESSAGES: {
				INVALID_UUID_PARAMETER: "luga.DetailSet: id parameter is required",
				INVALID_DS_PARAMETER: "luga.DetailSet: dataSet parameter is required"
			}
		};

		if(options.uuid === undefined){
			throw(CONST.ERROR_MESSAGES.INVALID_UUID_PARAMETER);
		}
		if(options.parentDataSet === undefined){
			throw(CONST.ERROR_MESSAGES.INVALID_DS_PARAMETER);
		}

		luga.extend(luga.Notifier, this);

		/** @type {luga.data.DetailSet} */
		var self = this;

		this.uuid = options.uuid;
		this.parentDataSet = options.parentDataSet;
		this.parentDataSet.addObserver(this);

		/** @type {luga.data.DataSet.row} */
		this.row = null;

		luga.data.setDataSource(this.uuid, this);

		/**
		 * @returns {luga.data.DetailSet.context}
		 */
		this.getContext = function(){
			var context = {
				entity: self.row
			};
			var stateDesc = luga.data.utils.assembleStateDescription(self.getState());
			luga.merge(context, stateDesc);
			return context;
		};

		/**
		 * Returns the detailSet's current state
		 * @returns {null|luga.data.STATE}
		 */
		this.getState = function(){
			return self.parentDataSet.getState();
		};

		this.fetchRow = function(){
			self.row = self.parentDataSet.getCurrentRow();
			self.notifyObservers(luga.data.CONST.EVENTS.DATA_CHANGED, {dataSource: this});
		};

		/* Events Handlers */

		/**
		 * @param {luga.data.dataSourceChanged} data
		 */
		this.onDataChangedHandler = function(data){
			self.fetchRow();
		};

		/**
		 * @param {luga.data.DataSet.currentRowChanged} data
		 */
		this.onCurrentRowChangedHandler = function(data){
			self.fetchRow();
		};

		/**
		 * @param {luga.data.DataSet.stateChanged} data
		 */
		this.onStateChangedHandler = function(data){
			self.fetchRow();
		};

		/* Fetch row without notifying observers */
		self.row = self.parentDataSet.getCurrentRow();

	};

}());