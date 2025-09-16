/* eslint-disable no- */
sap.ui.define(["sap/ui/core/format/DateFormat"], function (DateFormat) {
	"use strict";

	return {
		formatValue: function (value) {
			return value && value.toUpperCase();
		},

		formatDate: function (sDate) {
			if (!sDate) return null;
			const oDateFormat = DateFormat.getInstance({ pattern: "dd/MM/yyyy" });
			const sFormattedDate = oDateFormat.format(
				new Date(sDate.substr(0, 4), sDate.substr(4, 2) - 1, sDate.substr(6, 2))
			);
			return sFormattedDate;
		},
		formatDateTime: function (sDate) {
			if (!sDate) {
				return "";
			}
			const oDate = new Date(sDate);
			const twoDigits = function (n) {
				return n < 10 ? "0" + n : n;
			};

			const day = twoDigits(oDate.getDate());
			const month = twoDigits(oDate.getMonth() + 1);
			const year = oDate.getFullYear();

			const hours = twoDigits(oDate.getHours());
			const minutes = twoDigits(oDate.getMinutes());

			return day + "/" + month + "/" + year + " " + hours + ":" + minutes;
		},
	};
});
