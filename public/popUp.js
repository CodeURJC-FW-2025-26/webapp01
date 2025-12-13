function showPopup(msg) {
	const modalWrapper = document.createElement("div");
	modalWrapper.innerHTML = `
        <div id="confirmationModal" class="modal show">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        Operation Successful
                    </div>
                    <div class="modal-body"><p>${msg}</p></div>
                    <div class="modal-footer">
                        <button type="button" id="closePopupBtn" class="btn btn-primary">OK</button>
                    </div>
                </div>
            </div>
        </div>
    `;

	document.body.appendChild(modalWrapper);

	document.getElementById("closePopupBtn").addEventListener("click", () => {
		modalWrapper.remove();
	});
}
