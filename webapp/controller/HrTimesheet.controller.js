/* eslint-disable no-debugger */
/* eslint-disable no- */
sap.ui.define(
	[
		"./BaseController",
		"sap/ui/model/json/JSONModel",
		"../model/models",
		"../model/formatter",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/ui/model/Sorter",
		"sap/m/MessageToast",
		"sap/ui/export/Spreadsheet",
		"sap/ui/core/Fragment",
	],
	function (
		BaseController,
		JSONModel,
		models,
		formatter,
		Filter,
		FilterOperator,
		Sorter,
		MessageToast,
		Spreadsheet,
		Fragment
	) {
		"use strict";

		return BaseController.extend(
			"ansaldonuclear.dashboard.controller.HrTimesheet",
			{
				formatter: formatter,
				onInit: async function () {
					this.setModel(models.createMainModel(), "main");
					this.setModel(models.createMockData(), "mockNetworkData");
					this.getRouter()
						.getRoute("HrTimesheet")
						.attachPatternMatched(this._onObjectMatched, this);
					this.setModel(
						new JSONModel({
							masterPaneSize: "320px",
							detailPaneSize: "auto",
							menuExpanded: true
						}),
						"sizes"
					);
				},
				_onObjectMatched: async function (oEvent) {},
				onToggleMenu: function () {
					const oModel = this.getModel("sizes");
					const bExpanded = oModel.getProperty("/menuExpanded");
					if (bExpanded) {
						oModel.setProperty("/masterPaneSize", "100px");
					} else {
						oModel.setProperty("/masterPaneSize", "320px");
					}
					oModel.setProperty("/menuExpanded", !bExpanded);
					this.byId("navigationList").setExpanded(!bExpanded);
				},
				onNavigationSelectionChange: function(oEvent) {
            const sKey = oEvent.getParameter("item").getKey();
            this._showDetailFragment(sKey);
        },
				_showDetailFragment: function(sKey) {
					debugger
            const oView = this.getView();
            const oPage = oView.byId("detailPage");

            if (this._currentFragment) {
                oPage.removeAllContent();
                this._currentFragment.destroy();
                this._currentFragment = null;
            }

           const sFragmentName = "ansaldonuclear.dashboard.view.fragments." + sKey;
            Fragment.load({
                id: oView.getId(),
                name: sFragmentName,
                controller: this
            }).then(function(oFragment) {
                this._currentFragment = oFragment;
                oPage.addContent(oFragment);
            }.bind(this)).catch(function(err) {
                console.error("Fragment non trovato:", sFragmentName);
            });
        },
				onOpenDetail: function (oEvent) {
					const oRowContext = oEvent
						.getSource()
						.getBindingContext("mockNetworkData");
					const oRowData = oRowContext.getObject();
					const oDetailModel = new JSONModel(oRowData);
					this.getOwnerComponent().setModel(oDetailModel, "detailModel");
					this.getRouter().navTo("Detail", {
						id: oRowData.AUFNR,
					});
				},
				getCurrentEntityPath: function (oTable) {
					const sBindingPath = oTable.getBindingInfo("rows").path;
					return sBindingPath;
				},
				onFilterPress: function (oEvent) {
					const oTable = oEvent.getSource().getParent().getParent();
					const sPath = this.getCurrentEntityPath(oTable);
					if (!sPath) return;
					const oBinding = oTable.getBinding();
					const aFilters = [
						new Filter("AUFNR", FilterOperator.Contains, "100000000001"),
					];
					oBinding.filter(aFilters);
				},

				onSortPress: function (oEvent) {
					const oTable = oEvent.getSource().getParent().getParent();
					const sPath = this.getCurrentEntityPath(oTable);
					if (!sPath) return;
					const oBinding = oTable.getBinding();
					const oSorter = new Sorter("AUFNR", true);
					oBinding.sort(oSorter);
				},

				onDownloadExcel: function (oEvent) {
					const oTable = oEvent.getSource().getParent().getParent();
					const sPath = this.getCurrentEntityPath(oTable);
					const oModel = this.getModel("mockNetworkData");

					if (!sPath || !oModel) return;

					const aData = oModel.getProperty(sPath);
					if (!aData || aData.length === 0) {
						MessageToast.show("Nessun dato da esportare.");
						return;
					}

					const oSheet = new Spreadsheet({
						workbook: {
							columns: Object.keys(aData[0]).map((key) => ({
								label: key,
								property: key,
							})),
							hierarchyLevel: "Level",
						},
						dataSource: aData,
						fileName: "Export_" + sPath.replace("/", "") + ".xlsx",
					});

					oSheet.build().finally(() => oSheet.destroy());
				},
			}
		);
	}
);
