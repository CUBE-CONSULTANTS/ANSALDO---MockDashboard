/* eslint-disable no-debugger */
/* eslint-disable no- */
sap.ui.define(
	[
		"./BaseController",
		"sap/ui/model/json/JSONModel",
		"../model/models",
		"../model/formatter",
	],
	function (
		BaseController,
		JSONModel,
		models,
		formatter,
	) {
		"use strict";

		return BaseController.extend("ansaldonuclear.dashboard.controller.Main", {
			formatter: formatter,
			onInit: async function () {
				this.setModel(models.createMainModel(), "main");	
				this.setModel(models.createIntegrationMock(), "mockIntegration");			
			},
			onNavigateToManufacturing: function () {
        this.getRouter().navTo("Manufacturing");
      },
			onNavigateToHrTS: function() {
				this.getRouter().navTo("HrTimesheet");
			},
      onNavigateToFinance: function () {
        this.getRouter().navTo("Finance");
      },
      onNavigateToProjSys: function () {
        this.getRouter().navTo("ProjectSystem");
      },
      
		});
	}
);
