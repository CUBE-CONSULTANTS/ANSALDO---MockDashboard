/* eslint-disable no-debugger */
sap.ui.define(["sap/ui/core/format/DateFormat"], function (DateFormat) {
	"use strict";

	return {
		formatValue: function (value) {
			return value && value.toUpperCase();
		},

		formatDate: function (sDate) {
			debugger
			if (!sDate) return null;
			const oDateFormat = DateFormat.getInstance({pattern: "yyyy-MM-dd"});
			const sFormattedDate = oDateFormat.format(new Date(sDate.substr(0, 4), sDate.substr(4, 2) - 1, sDate.substr(6, 2)));
			return sFormattedDate;
		}
	};
});
