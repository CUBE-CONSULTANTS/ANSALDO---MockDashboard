sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/UIComponent",
		"sap/ui/core/routing/History",
		"sap/ui/core/Fragment",
	],
	function (Controller, UIComponent, History, Fragment) {
		"use strict";

		return Controller.extend(
			"ansaldonuclear.dashboard.controller.BaseController",
			{
				/**
				 * Convenience method for accessing the component of the controller's view.
				 * @returns {sap.ui.core.Component} The component of the controller's view
				 */
				getOwnerComponent: function () {
					return Controller.prototype.getOwnerComponent.call(this);
				},

				/**
				 * Convenience method to get the components' router instance.
				 * @returns {sap.m.routing.Router} The router instance
				 */
				getRouter: function () {
					return UIComponent.getRouterFor(this);
				},

				/**
				 * Convenience method for getting the i18n resource bundle of the component.
				 * @returns {Promise<sap.base.i18n.ResourceBundle>} The i18n resource bundle of the component
				 */
				getResourceBundle: function () {
					const oModel = this.getOwnerComponent().getModel("i18n");
					return oModel.getResourceBundle();
				},

				/**
				 * Convenience method for getting the view model by name in every controller of the application.
				 * @param {string} [sName] The model name
				 * @returns {sap.ui.model.Model} The model instance
				 */
				getModel: function (sName) {
					return this.getView().getModel(sName);
				},

				/**
				 * Convenience method for setting the view model in every controller of the application.
				 * @param {sap.ui.model.Model} oModel The model instance
				 * @param {string} [sName] The model name
				 * @returns {sap.ui.core.mvc.Controller} The current base controller instance
				 */
				setModel: function (oModel, sName) {
					this.getView().setModel(oModel, sName);
					return this;
				},

				/**
				 * Convenience method for triggering the navigation to a specific target.
				 * @public
				 * @param {string} sName Target name
				 * @param {object} [oParameters] Navigation parameters
				 * @param {boolean} [bReplace] Defines if the hash should be replaced (no browser history entry) or set (browser history entry)
				 */
				navTo: function (sName, oParameters, bReplace) {
					this.getRouter().navTo(sName, oParameters, undefined, bReplace);
				},

				/**
				 * Convenience event handler for navigating back.
				 * It there is a history entry we go one step back in the browser history
				 * If not, it will replace the current entry of the browser history with the main route.
				 */
				onNavBack: function () {
					// this.resetFragmentState()
					const sPreviousHash = History.getInstance().getPreviousHash();
					if (sPreviousHash !== undefined) {
						window.history.go(-1);
					} else {
						this.getRouter().navTo("main", {}, undefined, true);
					}
				},
				// loadFragment: function (
				// 	sFragmentName,
				// 	oPage,
				// 	oController,
				// 	bCache = true
				// ) {
				// 	const oView = oController.getView();
				// 	const sFullFragmentName =
				// 		"ansaldonuclear.dashboard.view.fragments." + sFragmentName;
				// 	oController._fragmentsCache = oController._fragmentsCache || {};
				// 	oController._fragmentStack = oController._fragmentStack || [];
				// 	if (oController._currentFragment) {
				// 		const oCurrent = oController._currentFragment;
				// 		oController._currentFragment = null;
				// 		const isCached = Object.values(
				// 			oController._fragmentsCache
				// 		).includes(oCurrent);
				// 		oPage.removeAllContent();
				// 		if (!isCached) {
				// 			oCurrent.destroy(true);
				// 		}
				// 	}
				// 	if (bCache && oController._fragmentsCache[sFragmentName]) {
				// 		const oFragment = oController._fragmentsCache[sFragmentName];
				// 		const oOldParent = oFragment.getParent();
				// 		if (
				// 			oOldParent &&
				// 			oOldParent !== oPage &&
				// 			oOldParent.removeContent
				// 		) {
				// 			oOldParent.removeContent(oFragment);
				// 		}

				// 		oPage.addContent(oFragment);
				// 		oController._currentFragment = oFragment;
				// 		oController._fragmentStack.push(oFragment);

				// 		return Promise.resolve(oFragment);
				// 	}
				// 	return Fragment.load({
				// 		id: oView.getId(),
				// 		name: sFullFragmentName,
				// 		controller: oController,
				// 	})
				// 		.then(function (oFragment) {
				// 			oPage.addContent(oFragment);
				// 			oController._currentFragment = oFragment;
				// 			oController._fragmentStack.push(oFragment);

				// 			if (bCache) {
				// 				oController._fragmentsCache[sFragmentName] = oFragment;
				// 			}
				// 			return oFragment;
				// 		})
				// 		.catch(function (err) {
				// 			console.error("Fragment non trovato:", sFullFragmentName, err);
				// 		});
				// },

				// resetFragmentState: function () {
				// 	this.getModel('titleModel').setProperty("/currentTitle","")
				// 	const oView = this.getView();
				// 	const oPage = oView.byId("detailPage");

				// 	if (this._currentFragment) {
				// 		oPage.removeAllContent(); 
				// 		this._currentFragment.destroy(); 
				// 		this._currentFragment = null;
				// 	}

				// 	this._fragmentStack = [];
				// 	this._fragmentsCache = {};
				// },
				onOpenDialog: function (sDialogName, sFragmentName, oController) {
					if (!this[sDialogName]) {
						this[sDialogName] = sap.ui.xmlfragment(sFragmentName, oController);
						this.getView().addDependent(this[sDialogName]);
					}
					this[sDialogName].open();
					return this[sDialogName];
				},
				onCloseDialog: function(oEvent){
					oEvent.getSource().getParent().close()
				},
				showBusy: function (delay) {
					// sap.ui.core.BusyIndicator.show(delay || 0);
					sap.ui.core.BusyIndicator.show(delay);
				},
				hideBusy: function (delay) {
					// sap.ui.core.BusyIndicator.hide(delay || 0);
					sap.ui.core.BusyIndicator.hide(delay);
				},
			}
		);
	}
);
