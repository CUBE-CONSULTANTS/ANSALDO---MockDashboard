/* eslint-disable no- */
sap.ui.define(
	[
		"./BaseController",
		"../model/models",
		"../model/formatter",
		"../model/mapper",
		"sap/ui/model/json/JSONModel",
	],
	function (BaseController, models, formatter, mapper, JSONModel) {
		"use strict";

		return BaseController.extend("ansaldonuclear.dashboard.controller.Detail", {
			formatter: formatter,
			onInit: function () {
				this.getRouter().getRoute("Detail").attachPatternMatched(this._onObjectMatched, this);
				this.setModel(models.createMockNetworkData(), "mockNetworkData");
			},
			_onObjectMatched: function (oEvent) {
				const sNetworkId = oEvent.getParameter("arguments").id;
				this._loadNetworkData(sNetworkId);
			},

			_loadNetworkData: function (sNetworkId) {
				const oNetwork = this.getModel("mockNetworkData")
					?.getProperty("/mockData")
					?.find((network) => network.AUFNR === sNetworkId);

				const oDetailModel = new JSONModel(oNetwork);
				this.setModel(oDetailModel, "detailModel");

				const oTreeModel = new JSONModel([oNetwork])
				this.setModel(oTreeModel, "treemodel")
			},
		});
	}
);
