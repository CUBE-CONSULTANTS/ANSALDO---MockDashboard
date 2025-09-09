/* eslint-disable no- */
sap.ui.define(
	[
		"./BaseController",
		"sap/ui/model/json/JSONModel",
		"../model/models",
		"../model/formatter",
		"../model/mapper",
		"sap/ui/core/Fragment",
	],
	function (BaseController, JSONModel, models, formatter, mapper, Fragment) {
		"use strict";

		return BaseController.extend("ansaldonuclear.dashboard.controller.Main", {
			formatter: formatter,
			onInit: async function () {
				this.setModel(models.createMainModel(), "main");
				this.setModel(models.createMockData(), "mockNetworkData");
			},
			onOpenDetail: function (oEvent) {
				const oRowContext = oEvent.getSource().getBindingContext("mockNetworkData");
				const oRowData = oRowContext.getObject();
				const oDetailModel = new JSONModel(oRowData);
				this.getOwnerComponent().setModel(oDetailModel, "detailModel");
				;
				this.getRouter().navTo("Detail", {
					id: oRowData.AUFNR,
				});
			},
		});
	}
);
