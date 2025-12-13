async function gameForm(event, id) {
	event.preventDefault();

	const form = event.target;
	const genres = form.querySelectorAll("input[name=\"genres\"]:checked");
	const platforms = form.querySelectorAll("input[name=\"platforms\"]:checked");

	const genreError = document.getElementById("genreError");
	const platformError = document.getElementById("platformError");

	let valid = true;

	if (genres.length === 0) {
		genreError.classList.add("d-block");
		valid = false;
	} else {
		genreError.classList.remove("d-block");
	}

	if (platforms.length === 0) {
		platformError.classList.add("d-block");
		valid = false;
	} else {
		platformError.classList.remove("d-block");
	}

	if (!form.checkValidity() || !valid) {
		form.classList.add("was-validated");
		return;
	}

	const route = id ? "/edit-game" : "/game";
	const formData = new FormData(form);

	const response = await fetch(route, {
		method: "POST",
		body: formData,
	});

	if (response.ok) {
		const url = new URL(response.url);
		const destId = url.searchParams.get("id");
		alert("The Game has been saved!");
		window.location = `/detail/${destId}`;
	} else {
		alert("Failed to create game. Please try again.");
	}
}

async function reviewForm(event, gameId, reviewId) {
	event.preventDefault();

	const form = event.target;

	if (!form.checkValidity()) {
		form.classList.add("was-validated");
		return;
	}
	const route = reviewId ? `/detail/${gameId}/reviews/${reviewId}/edit` : `/detail/${gameId}/reviews`;
	console.log(route);

	//here we don't have files
	const data = Object.fromEntries(new FormData(form));

	response = await fetch(route, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});


	if (response.ok) {
		const url = new URL(response.url);
		const destId = url.searchParams.get("id");
		alert("The review has been saved!");
		window.location = `/detail/${destId}`;
	} else {
		alert("Failed to create review. Please try again.");
	}
}