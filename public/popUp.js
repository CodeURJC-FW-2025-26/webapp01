function showPopup({message, type}) {
    const opts={
        good:"Operation Successful",
        bad: "Ooops, something wrong happened",
    }
    console.log("mensaje",message);
	const popUp = document.createElement("div");
	popUp.innerHTML = `
        <div id="confirmationModal" class="modal show">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        ${opts[type]}
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
	});
}
