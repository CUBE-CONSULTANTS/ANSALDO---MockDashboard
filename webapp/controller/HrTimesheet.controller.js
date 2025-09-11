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
					this.setModel(models.createSizesModel(), "sizes");
					this.setModel(new JSONModel(), "titleModel");
					this._fragmentsCache = {};
					this._fragmentStack = [];
					this._currentFragment = null;
					this.getRouter()
						.getRoute("HrTimesheet")
						.attachPatternMatched(this._onObjectMatched, this);
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
				onNavigationSelectionChange: function (oEvent) {
					const oItem = oEvent.getParameter("item");
					const oBindingInfo = oItem.getBindingInfo("text");
					const sI18nKey = oBindingInfo.parts[0].path;
					const sTitle = this.getResourceBundle().getText(sI18nKey);
					this.getModel("titleModel").setProperty("/currentTitle", sTitle);
					const sKey = oItem.getKey();
					this._showDetailFragment(sKey);
				},
				_showDetailFragment: function (sKey) {
					const oView = this.getView();
					const oPage = oView.byId("detailPage");
					this.showBusy(0);
					this.loadFragment(sKey, oPage, this, true);
					this.hideBusy(0);
				},
				onOpenDetail: function (oEvent) {
					this.showBusy(0);
					const oRowContext = oEvent
						.getSource()
						.getBindingContext("mockNetworkData");
					const oRowData = oRowContext.getObject();
					const oDetailModel = new JSONModel(oRowData);
					this.setModel(oDetailModel, "detailModel");
					const oView = this.getView();
					const oContainer = oView.byId("detailPage");
					this.getModel("main").setProperty("/isDetail", true);
					this.loadFragment("networkDetail", oContainer, this, true);
					this.hideBusy(0);
				},
				backPrevFragment: function () {
					const oView = this.getView();
					const oPage = oView.byId("detailPage");

					if (!this._fragmentStack || this._fragmentStack.length < 2) {
						return;
					}
					const oCurrentFragment = this._fragmentStack.pop();
					if (oCurrentFragment) {
						oPage.removeAllContent();
						const isCached = Object.values(this._fragmentsCache).includes(
							oCurrentFragment
						);
						if (!isCached) {
							oCurrentFragment.destroy(true);
						}
					}
					const oPrevFragment =
						this._fragmentStack[this._fragmentStack.length - 1];
					if (oPrevFragment) {
						const oOldParent = oPrevFragment.getParent();
						if (
							oOldParent &&
							oOldParent !== oPage &&
							oOldParent.removeContent
						) {
							oOldParent.removeContent(oPrevFragment);
						}
						oPage.addContent(oPrevFragment);
						this._currentFragment = oPrevFragment;
					}
				},
				getCurrentEntityPath: function (oTable) {
					const sBindingPath = oTable.getBindingInfo("rows").path;
					return sBindingPath;
				},
				onPlantLinkPress: function (oEvent) {
					const sPlantId = oEvent.getSource().getText();
					const oModel = this.getView().getModel("mockNetworkData");
					const aPlants = oModel.getProperty("/plants");
					const oPlant = aPlants.find((p) => p.WERKS === sPlantId);
					const oDialogModel = new JSONModel(oPlant);
					const oDialog = this.onOpenDialog(
						"plantDialog",
						"ansaldonuclear.dashboard.view.fragments.PlantDialog",
						this
					);
					oDialog.setModel(oDialogModel, "plant");
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
