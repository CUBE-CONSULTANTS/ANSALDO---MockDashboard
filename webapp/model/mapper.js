sap.ui.define(["../model/formatter"], function (formatter) {
	"use strict";
	return {
		getRootKeyByCode: function (sCode) {
			const typeByCode = {
				C001: "activityTypes", //pid054
				C002: "employeesS4", //pid056
				C003: "employeesTS", //pid055
				C004: "costCentersADP", //pid058
				C005: "trackingActivites", //pid060
				C006: "networkMaster", //pid052
				C007: "wbeMasterData", //pid051
				C008: "costCentersTs", 
				C009: "businessPartners", //pid007
				C010: "dms", //pid031
				C011: "expenseIn", //pid034
				C012: "primaveraEppm", //pid035
				C013: "bpcInterface", //pid040
				C014: "contractData", //pid041
				C015: "vaultBoms", //pid046
				C016: "vaultMaterials", //pid047
				C017: "costCenterMaster", //pid050
				C018: "productionOrders", //pid053
				C019: "salaryAccounting", //pid059
				C020: "massUpdateOfNetwork", //pid076
				C021: "massUpdateOfProductionOrder" //pid077
			};

			return typeByCode[sCode] || null;
		},
		//se senza chiavi di riconoscimento integration:
		identifyIntegration: function (jsonContent) {
			const fieldMapping = {
					"activityTypes": ["LSTAR", "KTEXT", "DATBI", "DATAB", "OPERA"],
					"employeesS4": [
							"USRID", "HIRE_DATE", "BUKRS", "WERKS", "KOSTL", "PERSG", "PERSK", 
							"BTRTL", "ANRED", "VORNA", "NACHN", "GBDAT", "GBORT", "NATIO", "GESCH",
							"SPRSL", "USRID", "USRID", "USRID", "LSTAR", "ICNUM"
					],
					"employeesTS": [
							"person-id-external", "first-name", "last-name", "title", "date-of-birth", 
							"gender", "status", "email-address", "companyEntryDate", "manager-ID", 
							"hireDate", "terminationDate", "employment-type", "is-fulltime-employee", 
							"employee-class", "overtime-payed", "fte", "department", "legal-entity", 
							"Phone Number", "location", "cost-center", "standard-hours", "job-code", "OPERA"
					],
					"costCentersADP": ["code", "name", "DATBI", "DATAB", "inactiveIndicator"],
					"orderHeaders": ["AUFNR", "KTEXT", "PSPNR", "GSTRP", "GLTRP", "OPERA"],
					"network": ["AUFNR", "VORNR", "LTXA1", "NTANF", "NTEND", "VSTTXT", "OPERA"],
					"wbeElements": [
							"PSPNR", "POSID", "POST1", "PSTRT", "PENDE", "STTXT_EXT", "OPERA"
					],
					"costCenters": ["KOSTL", "BUKRS", "LTEXT", "DATBI", "DATAB", "OPERA"],
					"businessPartners": ["BP_ID", "NAME", "ADDRESS", "PHONE", "EMAIL"],
					"dms": ["DOCUMENT_ID", "FILE_NAME", "CREATED_DATE", "MODIFIED_DATE"],
					"expenseIn": ["EXPENSE_ID", "AMOUNT", "CATEGORY", "DATE"],
					"primaveraEppm": ["PROJECT_ID", "PHASE", "TASK", "START_DATE", "END_DATE"],
					"bpcInterface": ["INTERFACE_ID", "STATUS", "DATA", "TYPE"],
					"contractData": ["CONTRACT_ID", "PARTNER_ID", "START_DATE", "END_DATE"],
					"vaultBoms": ["BOM_ID", "ITEM", "QUANTITY", "DESCRIPTION"],
					"vaultMaterials": ["MATERIAL_ID", "NAME", "QUANTITY", "UNIT"],
					"costCenterMaster": ["KOSTL", "NAME", "DATBI", "DATAB", "OPERA"],
					"wbeMaster": ["PSPNR", "NAME", "DESCRIPTION", "STATUS"],
					"networkMaster": ["AUFNR", "NAME", "STATUS", "DESCRIPTION"],
					"productionOrders": ["AUFNR", "KTEXT", "AUART", "STTXT", "WERKS", "PLNBEZ", "GAMNG", "GWEMG", "GSTRP", "GLTRP", "OPERA"],
					"salaryAccounting": [
							"PAYRUN", "COMPANY", "PAYGROUP", "COSTCENTREDESC", "SECTION", "DESCRIPTION", 
							"AMOUNT", "PAYPERIODEND", "PAYCHECKDATE", "TAXPERIOD", "TAXYEAR"
					],
					"trackingActivitiesImport": [
							"ID-TRACK", "PERSON-ID", "ACDTE", "PSPNR", "HH-WBE", "AUFNR", "VORNR", 
							"HH-NETWORK", "AUFNR", "VORNR", "HH-LABOUR", "HH-SET-UP", "HH-MACHINE", "PERC", "OPERA"
					],
					"trackingActivitiesExport": ["STATUS", "NR-DOCUMENT", "MSG_TEXT"],
					"trackingCancellationImport": ["NR-DOCUMENT"],
					"trackingCancellationExport": ["STATUS", "MSG_TEXT"],
					"massiveReversalImport": [
							"ID-TRACK", "PERSON-ID", "ACDTE", "AUFNR_SEND", "VORNR_SEND", "HH-NETWORK",
							"AUFNR_TARG", "VORNR_TARG", "AUFNR_SEND", "VORNR_SEND", "HH-LABOUR", "HH-SET-UP",
							"HH-MACHINE", "PERC", "AUFNR_TARG", "VORNR_TARG", "TEXT"
					],
					"massiveReversalExport": ["STATUS", "NR-DOCUMENT", "MSG_TEXT"]
			};
			for (const [integrationType, fields] of Object.entries(fieldMapping)) {
				const isMatching = fields.every((field) => field in jsonContent);
					if (isMatching) {
						return integrationType; 
					}
			}
			return "Unknown";
		},
		getColumnConfig: function (oHeader, oBundle) {
			if (!oHeader) return [];

			const aKeys = Object.keys(oHeader).filter((k) => k !== "positions");
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
	};
});
