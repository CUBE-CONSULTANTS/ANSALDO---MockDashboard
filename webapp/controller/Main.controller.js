/* eslint-disable no-debugger */
/* eslint-disable no- */
sap.ui.define(
	[
		"./BaseController",
		"sap/ui/model/json/JSONModel",
		"../model/models",
		"../model/formatter",
	],
	function (BaseController, JSONModel, models, formatter) {
		"use strict";

		return BaseController.extend("ansaldonuclear.dashboard.controller.Main", {
			formatter: formatter,
			onInit: async function () {
				this.setModel(models.createMainModel(), "main");
				this.setModel(models.createIntegrationMock(), "mockIntegration");
			},
			onTabSelect: function (oEvent) {
				debugger;
				const oTable = oEvent.getSource().getAggregation("content")[0];
				const oBinding = oTable.getBinding("rows");
				const sKey = oEvent.getParameter("key");
				let aFilters = [];
				if (sKey === "Ok") {
					aFilters.push(
						new sap.ui.model.Filter(
							"Status",
							sap.ui.model.FilterOperator.EQ,
							"Success"
						)
					);
				} else if (sKey === "Ko") {
					aFilters.push(
						new sap.ui.model.Filter(
							"Status",
							sap.ui.model.FilterOperator.EQ,
							"Error"
						)
					);
				} else if (sKey === "All") {
					aFilters = [];
				}
				oBinding.filter(aFilters);
			},
			onSearch: function () {
				this.getModel("main").setProperty("/visibility", true);
			},
			onTableRowSelectionChange: function (oEvent) {
				const oSelectedItem = oEvent.getParameter("rowContext");
				const sIntegrationId = oSelectedItem.getProperty("IntegrationId");
				this.getRouter().navTo("Detail", {
					integrationId: sIntegrationId,
				});
			},

		});
	}
);
