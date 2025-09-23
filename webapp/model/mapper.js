/* eslint-disable no- */
sap.ui.define(["../model/formatter"], function (formatter) {
	"use strict";
	return {
		getRootKeyByCode: function (sCode) {
			const typeByCode = {
				C001: "Cost Center TS",
				C002: "WBE",
				C003: "Network",
				C004: "Production Order",
				C005: "Activity Types",
				C006: "Employee TS",
				C007: "Employee S/4",
				C008: "Employee ADP",
				C009: "Cost Center ADP",
				C010: "Salary Accounting",
				C011: "Tracking Activities",
				C012: "primaveraEppm",
				C013: "bpcInterface",
				C014: "contractData",
				C015: "vaultMaterials",
				C016: "vaultBoms",
				C017: "costCenterMaster",
				C018: "productionOrders",
				C019: "salaryAccounting",
				C020: "massUpdateOfNetwork",
				C021: "massUpdateOfProductionOrder",
				// C001: "activityTypes", //pid054 ok
				// C002: "employeesS4", //pid056 ok
				// C003: "employeesTS", //pid055 ok
				// C004: "costCentersADP", //pid058 ok
				// C005: "trackingActivites", //pid060 ok
				// C006: "networkMaster", //pid052 ok
				// C007: "wbeMasterData", //pid051 ok
				// C008: "costCentersTs",
				// C009: "businessPartners", //pid007
				// C010: "dms", //pid031
				// C011: "expenseIn", //pid034
				// C012: "primaveraEppm", //pid035
				// C013: "bpcInterface", //pid040
				// C014: "contractData", //pid041
				// C015: "vaultBoms", //pid046
				// C016: "vaultMaterials", //pid047
				// C017: "costCenterMaster", //pid050
				// C018: "productionOrders", //pid053
				// C019: "salaryAccounting", //pid059 ok
				// C020: "massUpdateOfNetwork", //pid076
				// C021: "massUpdateOfProductionOrder", //pid077
			};

			return typeByCode[sCode] || null;
		},
		//se senza chiavi di riconoscimento integration:
		identifyIntegration: function (jsonContent) {
			const fieldMapping = {
				activityTypes: ["LSTAR", "KTEXT", "DATBI", "DATAB", "OPERA"],
				employeesS4: [
					"USRID",
					"HIRE_DATE",
					"BUKRS",
					"WERKS",
					"KOSTL",
					"PERSG",
					"PERSK",
					"BTRTL",
					"ANRED",
					"VORNA",
					"NACHN",
					"GBDAT",
					"GBORT",
					"NATIO",
					"GESCH",
					"SPRSL",
					"USRID",
					"USRID",
					"USRID",
					"LSTAR",
					"ICNUM",
				],
				employeesTS: [
					"person-id-external",
					"first-name",
					"last-name",
					"title",
					"date-of-birth",
					"gender",
					"status",
					"email-address",
					"companyEntryDate",
					"manager-ID",
					"hireDate",
					"terminationDate",
					"employment-type",
					"is-fulltime-employee",
					"employee-class",
					"overtime-payed",
					"fte",
					"department",
					"legal-entity",
					"Phone Number",
					"location",
					"cost-center",
					"standard-hours",
					"job-code",
					"OPERA",
				],
				costCentersADP: ["code", "name", "DATBI", "DATAB", "inactiveIndicator"],
				orderHeaders: ["AUFNR", "KTEXT", "PSPNR", "GSTRP", "GLTRP", "OPERA"],
				network: [
					"AUFNR",
					"VORNR",
					"LTXA1",
					"NTANF",
					"NTEND",
					"VSTTXT",
					"OPERA",
				],
				wbeElements: [
					"PSPNR",
					"POSID",
					"POST1",
					"PSTRT",
					"PENDE",
					"STTXT_EXT",
					"OPERA",
				],
				costCenters: ["KOSTL", "BUKRS", "LTEXT", "DATBI", "DATAB", "OPERA"],
				businessPartners: ["BP_ID", "NAME", "ADDRESS", "PHONE", "EMAIL"],
				dms: ["DOCUMENT_ID", "FILE_NAME", "CREATED_DATE", "MODIFIED_DATE"],
				expenseIn: ["EXPENSE_ID", "AMOUNT", "CATEGORY", "DATE"],
				primaveraEppm: [
					"PROJECT_ID",
					"PHASE",
					"TASK",
					"START_DATE",
					"END_DATE",
				],
				bpcInterface: ["INTERFACE_ID", "STATUS", "DATA", "TYPE"],
				contractData: ["CONTRACT_ID", "PARTNER_ID", "START_DATE", "END_DATE"],
				vaultBoms: ["BOM_ID", "ITEM", "QUANTITY", "DESCRIPTION"],
				vaultMaterials: ["MATERIAL_ID", "NAME", "QUANTITY", "UNIT"],
				costCenterMaster: ["KOSTL", "NAME", "DATBI", "DATAB", "OPERA"],
				wbeMaster: ["PSPNR", "NAME", "DESCRIPTION", "STATUS"],
				networkMaster: ["AUFNR", "NAME", "STATUS", "DESCRIPTION"],
				productionOrders: [
					"AUFNR",
					"KTEXT",
					"AUART",
					"STTXT",
					"WERKS",
					"PLNBEZ",
					"GAMNG",
					"GWEMG",
					"GSTRP",
					"GLTRP",
					"OPERA",
				],
				salaryAccounting: [
					"PAYRUN",
					"COMPANY",
					"PAYGROUP",
					"COSTCENTREDESC",
					"SECTION",
					"DESCRIPTION",
					"AMOUNT",
					"PAYPERIODEND",
					"PAYCHECKDATE",
					"TAXPERIOD",
					"TAXYEAR",
				],
				trackingActivitiesImport: [
					"ID-TRACK",
					"PERSON-ID",
					"ACDTE",
					"PSPNR",
					"HH-WBE",
					"AUFNR",
					"VORNR",
					"HH-NETWORK",
					"AUFNR",
					"VORNR",
					"HH-LABOUR",
					"HH-SET-UP",
					"HH-MACHINE",
					"PERC",
					"OPERA",
				],
				trackingActivitiesExport: ["STATUS", "NR-DOCUMENT", "MSG_TEXT"],
				trackingCancellationImport: ["NR-DOCUMENT"],
				trackingCancellationExport: ["STATUS", "MSG_TEXT"],
				massiveReversalImport: [
					"ID-TRACK",
					"PERSON-ID",
					"ACDTE",
					"AUFNR_SEND",
					"VORNR_SEND",
					"HH-NETWORK",
					"AUFNR_TARG",
					"VORNR_TARG",
					"AUFNR_SEND",
					"VORNR_SEND",
					"HH-LABOUR",
					"HH-SET-UP",
					"HH-MACHINE",
					"PERC",
					"AUFNR_TARG",
					"VORNR_TARG",
					"TEXT",
				],
				massiveReversalExport: ["STATUS", "NR-DOCUMENT", "MSG_TEXT"],
			};
			for (const [integrationType, fields] of Object.entries(fieldMapping)) {
				const isMatching = fields.every((field) => field in jsonContent);
				if (isMatching) {
					return integrationType;
				}
			}
			return "Unknown";
		},

		getKeyFieldsByCode: function (sCode) {
			const mappingByCode = {
				C001: ["KOSTL", "KTEXT", "BUKRS"], // Cost Center TS
				C002: ["PSPNR", "POSID", "POST1"], // WBE
				C003: ["AUFNR", "KTEXT"], // Network
				C004: ["AUFNR", "KTEXT", "AUART", "WERKS", "PLNBEZ"], // Production Order
				C005: ["LSTAR", "KTEXT"], // Activity Types
				C006: [
					"USRID",
					"VORNA",
					"NACHN",
					"EMAIL",
					"HIRE_DATE",
					"BUKRS",
					"WERKS",
					"KOSTL",
					"PERSG",
					"PERSK",
				], // Employee TS
				C007: [
					"USRID",
					"VORNA",
					"NACHN",
					"EMAIL",
					"HIRE_DATE",
					"BUKRS",
					"WERKS",
					"KOSTL",
					"PERSG",
					"PERSK",
				], // Employee S/4
				C008: ["PSPNR", "POSID", "POST1"], // Some other integration
				C009: ["KOSTL", "BUKRS", "LTEXT"], // Cost Center ADP
				C010: ["AUFNR", "KTEXT"], // Salary Accounting
				C011: [
					"USRID",
					"VORNA",
					"NACHN",
					"EMAIL",
					"HIRE_DATE",
					"BUKRS",
					"WERKS",
					"KOSTL",
					"PERSG",
					"PERSK",
				], // Tracking Activities
				C012: ["PROJECT_ID", "PHASE", "TASK", "START_DATE", "END_DATE"], // primaveraEppm
				C013: ["INTERFACE_ID", "STATUS", "DATA", "TYPE"], // bpcInterface
				C014: ["CONTRACT_ID", "PARTNER_ID", "START_DATE", "END_DATE"], // contractData
				C015: [
					"Product",
					"ProductType",
					"GrossWeight",
					"NetWeight",
					"CountryOfOrigin",
					"Division",
				], // vaultBoms
				C016: ["MATERIAL_ID", "NAME", "QUANTITY", "UNIT"], // vaultMaterials
				C017: ["KOSTL", "NAME", "DATBI", "DATAB", "OPERA"], // costCenterMaster
				C018: [
					"AUFNR",
					"KTEXT",
					"AUART",
					"WERKS",
					"PLNBEZ",
					"GAMNG",
					"GWEMG",
					"GSTRP",
					"GLTRP",
					"OPERA",
				], // productionOrders
				C019: [
					"PAYRUN",
					"COMPANY",
					"PAYGROUP",
					"COSTCENTREDESC",
					"SECTION",
					"DESCRIPTION",
					"AMOUNT",
					"PAYPERIODEND",
					"PAYCHECKDATE",
					"TAXPERIOD",
					"TAXYEAR",
				], // salaryAccounting
				C020: ["AUFNR", "VORNR", "LTXA1", "NTANF", "NTEND", "VSTTXT", "OPERA"], // massUpdateOfNetwork
				C021: ["AUFNR", "VORNR", "LTXA1", "NTANF", "NTEND", "VSTTXT", "OPERA"], // massUpdateOfProductionOrder
			};

			return mappingByCode[sCode] || [];
		},
		getColumnConfig: function (oHeader, oBundle) {
			if (!oHeader) return [];
			let aKeys = Object.keys(oHeader).filter(
				(k) => !Array.isArray(oHeader[k])
			);

			Object.keys(oHeader).forEach((k) => {
				if (Array.isArray(oHeader[k]) && oHeader[k].length > 0) {
					const childKeys = Object.keys(oHeader[k][0]);
					aKeys = aKeys.concat(childKeys.filter((ck) => !aKeys.includes(ck)));
				}
			});

			return aKeys.map(function (sKey) {
				const sTitle = oBundle.hasText(sKey) ? oBundle.getText(sKey) : sKey;

				return new sap.ui.table.Column({
					label: new sap.m.Label({ text: sTitle }),
					template: new sap.m.Text({ text: `{detailModel>${sKey}}` }),
					sortProperty: sKey,
					filterProperty: sKey,
					width: "12rem",
				});
			});
		},
		// getColumnConfig: function (oHeader, oBundle) {
		// 	if (!oHeader) return [];

		// 	const aKeys = Object.keys(oHeader).filter((k) => k !== "positions");
		// 	return aKeys.map(function (sKey) {
		// 		const sTitle = oBundle.hasText(sKey) ? oBundle.getText(sKey) : sKey;

		// 		return new sap.ui.table.Column({
		// 			label: new sap.m.Label({ text: sTitle }),
		// 			template: new sap.m.Text({ text: `{detailModel>${sKey}}` }),
		// 			sortProperty: sKey,
		// 			filterProperty: sKey,
		// 			width: "12rem",
		// 		});
		// 	});
		// },
	};
});
