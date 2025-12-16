
window.Spinner = {
	show: function (container) {
		if (!container) return;
		if (container.querySelector(".spinner")) return;

		const spinner = document.createElement("div");
		spinner.className = "spinner";
		container.appendChild(spinner);
	},
	hide: function (container) {
		if (!container) return;
		const spinner = container.querySelector(".spinner");
		if (spinner) {
			spinner.remove();
		}
	}
};
