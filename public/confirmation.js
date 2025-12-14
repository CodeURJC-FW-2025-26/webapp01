document.getElementById("deleteForm").addEventListener("submit", async (e) => {
	e.preventDefault();
	const gameId = document.getElementById("gameId").value;
	if (!window.confirm("Are you sure you want to delete this game?")){ //window. is not needed, it is just for the "exam"
		return;
	}
	const res = await fetch("/delete-game", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ id: gameId }),
	});
	const data = await res.json(); //see the messages in details.js
	showPopup({ message: data.message, type: data.type });

	document.getElementById("closePopupBtn").addEventListener("click", () => {
		if (data.type === "good"){ 
			document.location = "/";
		}
	});
});
