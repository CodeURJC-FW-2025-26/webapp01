document.getElementById("deleteForm").addEventListener("submit", async (e) => {
	e.preventDefault();
	const gameId = document.getElementById("gameId").value;

	const confirmPopup = document.createElement("div");
	confirmPopup.innerHTML = `
		<div class="modal show">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Confirm delete</h5>
					</div>
					<div class="modal-body">
						<p>Are you sure you want to delete this game?</p>
					</div>
					<div class="modal-footer">
						<button id="confirmDelete" class="btn btn-danger">Delete</button>
						<button id="cancelDelete" class="btn btn-secondary">Cancel</button>
					</div>
				</div>
			</div>
		</div>
	`;

	document.body.appendChild(confirmPopup);

	document.getElementById("cancelDelete").addEventListener("click", () => {
		confirmPopup.remove();
	});

	document.getElementById("confirmDelete").addEventListener("click", async () => {
		confirmPopup.remove();
		//only used if you want to delete
		await fetch("/delete-game", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id: gameId }),
		});

		window.location =`/?msg=${"The game has been deleted!"}`;

	});
});
