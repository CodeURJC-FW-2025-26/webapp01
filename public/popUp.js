function showPopup({message, type, onClose}) {
	const opts = type
		? "Operation Successful"
		: "Ooops, something wrong happened";

	const popUp = document.createElement("div");
	popUp.innerHTML = `
        <div id="confirmationModal" class="modal show">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        ${opts}
                    </div>
                    <div class="modal-body"><p>${message}</p></div>
                    <div class="modal-footer">
                        <button type="button" id="closePopupBtn" class="btn btn-primary">OK</button>
                    </div>
                </div>
            </div>
        </div>
    `;

	document.body.appendChild(popUp);

	document.getElementById("closePopupBtn").addEventListener("click", () => {
		popUp.remove();
		if (onClose) onClose(); 
	});
}
