const errorFormGame = new Map([
	["title cannot be empty", { attribute: "title", userMessage: "Please enter a title for your game." }],
	["title must be unique", { attribute: "title", userMessage: "This title is already used. Please choose a different one." }],
	["title must start with uppercase", { attribute: "title", userMessage: "The title should start with a capital letter." }],
	["description cannot be empty", { attribute: "description", userMessage: "Please provide a description for your game." }],
	["description must be between 1 and 400 chars", { attribute: "description", userMessage: "The description should be between 1 and 400 characters long." }],
	["developer cannot be empty", { attribute: "developer", userMessage: "Please enter the name of the developer." }],
	["genres must be a non-empty array", { attribute: "genres", userMessage: "Please select at least one genre for your game." }],
	["platforms must be a non-empty array", { attribute: "platforms", userMessage: "Please select at least one platform where the game can be played." }],
	["release_date must be a valid date", { attribute: "release_date", userMessage: "Please enter a valid release date for your game." }],
	["cover_image file is required", { attribute: "cover_image", userMessage: "Please upload a cover image for your game." }]
]);

function showFormErrors(errors) {
	const invalidElements = document.querySelectorAll(".is-invalid");
	invalidElements.forEach(el => el.classList.remove("is-invalid"));

	const feedbackElements = document.querySelectorAll(".invalid-feedback");
	feedbackElements.forEach(el => {
		el.textContent = el.dataset.default || el.textContent;
	});

	const messages = new Map();

	errors.forEach(err => {
		if (errorFormGame.has(err)) {
			const { attribute, userMessage } = errorFormGame.get(err);
			if (!messages.has(attribute)) messages.set(attribute, []);
			messages.get(attribute).push(userMessage);
		}
	});

	messages.forEach((msgs, attribute) => {
		let inputElement = null;
		let feedbackElement = null;

		switch(attribute) {
		case "title":
			inputElement = document.getElementById("inputTitle");
			feedbackElement = inputElement.nextElementSibling;
			break;
		case "description":
			inputElement = document.getElementById("inputDescription");
			feedbackElement = inputElement.nextElementSibling;
			break;
		case "developer":
			inputElement = document.getElementById("inputDeveloper");
			feedbackElement = inputElement.nextElementSibling;
			break;
		case "release_date":
			inputElement = document.getElementById("inputDate");
			feedbackElement = inputElement.nextElementSibling;
			break;
		case "genres":
			feedbackElement = document.getElementById("genreError");
			break;
		case "platforms":
			feedbackElement = document.getElementById("platformError");
			break;
		case "cover_image":
			inputElement = document.getElementById("inputImage");
			feedbackElement = inputElement.nextElementSibling.nextElementSibling;
			break;
		}

		if (inputElement) {
			inputElement.classList.remove("is-valid");
			inputElement.classList.add("is-invalid");
		}

		if (feedbackElement && !feedbackElement.dataset.default) {
			feedbackElement.dataset.default = feedbackElement.textContent;
		}

		if (feedbackElement) feedbackElement.textContent = msgs.join(" ");
	});
}

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
	const data = await response.json();

	if (response.ok) {
		const result = await response.json();

		showPopup({
			message: "The game has been saved!",
			type: true,
			onClose: () => {
				window.location.href = `/detail/${result.gameId}`;
			}
		});
		window.location = `/detail/${data.id}`;
	} else {
		showFormErrors(data.errors);
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
		const review = await response.json();
		if (!reviewId) {
			addReview(review);
			form.reset();

		}
		else {
			updateReviewInHTML(review);
		}
		showPopup({
			message: "The review has been saved!",
			type: true
		});

	} else {
		showPopup({
			message: "Failed to create the review. Please try again.",
			type: false
		});
	}
}


function addReview(review) {
	const reviewsContainer = document.querySelector("#reviews .container");

	const div = document.createElement("div");
	div.classList.add("my-3");

	div.innerHTML = `
		<h3>${review.author}</h3>
		<div class="border rounded p-3 bg-light text-dark">
			${review.comment}
		</div>
		<div class="alert alert-success p-2 flex-fill text-center mb-2">
			<strong>Rating:</strong> ${review.rating}
		</div>
		<div class="d-flex justify-content-center gap-3 my-4 flex-wrap">
			<a href="/detail/${review.gameId}/reviews/${review._id}/edit" class="btn btn-primary">Edit</a>
			<button class="btn btn-danger" onclick="deleteReview('${review._id}', '${review.gameId}', this)">
				Delete
			</button>
		</div>
	`;

	reviewsContainer.appendChild(div);
}

function editReviewInPlace(gameId, reviewId) {
	const reviewDiv = document.querySelector(`#reviews .my-3 [onclick*="${reviewId}"]`).closest(".my-3");

	reviewDiv.dataset.originalHtml = reviewDiv.innerHTML;

	const author = reviewDiv.querySelector("h3").textContent.trim();
	const comment = reviewDiv.querySelector(".border").textContent.trim();
	const rating = reviewDiv.querySelector(".alert").textContent.replace("Rating:", "").trim();

	reviewDiv.innerHTML = `
		<form novalidate onsubmit="reviewForm(event,'${gameId}','${reviewId}')">
			<div class="mb-2">
				<label>Author</label>
				<input type="text" name="author" class="form-control" value="${author}" required>
				<div class="invalid-feedback">Please write your name.</div>
			</div>
			<div class="mb-2">
				<label>Comment</label>
				<textarea name="comment" class="form-control" required>${comment}</textarea>
				<div class="invalid-feedback">Please write your review.</div>
			</div>
			<div class="mb-2">
				<label>Rating</label>
				<input type="number" name="rating" class="form-control" value="${rating}" min="0" max="100" required>
				            <div class="invalid-feedback">
                Please enter a valid rating between 0
                and 100.
            </div>
			</div>
			<button type="submit" class="btn btn-success">Save</button>
			<button type="button" class="btn btn-secondary" onclick="cancelEdit('${reviewId}')">Cancel</button>
		</form>
	`;
}

function cancelEdit() {
	const reviewDiv = document
		.querySelector("#reviews .my-3 form")
		.closest(".my-3");

	if (reviewDiv.dataset.originalHtml) {
		reviewDiv.innerHTML = reviewDiv.dataset.originalHtml;
		delete reviewDiv.dataset.originalHtml;
	}
}


function updateReviewInHTML(review) {
	const reviewDivs = document.querySelectorAll("#reviews .my-3");

	reviewDivs.forEach(div => {
		const editBtn = div.querySelector(`button[onclick*="${review._id}"]`);
		if (editBtn) {
			div.innerHTML = `
				<h3>${review.author}</h3>
				<div class="border rounded p-3 bg-light text-dark">
					${review.comment}
				</div>
				<div class="alert alert-success p-2 flex-fill text-center mb-2">
					<strong>Rating:</strong> ${review.rating}
				</div>
				<div class="d-flex justify-content-center gap-3 my-4 flex-wrap">
					<button class="btn btn-primary" onclick="editReviewInPlace('${review.gameId}','${review._id}')">Edit</button>
					<button class="btn btn-danger" onclick="deleteReview('${review._id}', '${review.gameId}', this)">Delete</button>
				</div>
			`;
		}
	});
}

async function deleteReview(event, gameId, reviewId) {
	event.preventDefault();

	response = await fetch(`/detail/${gameId}/reviews/${reviewId}/delete`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ id: gameId, reviewId })
	});

	if (response.ok) {
		const reviewDiv = document.querySelector(`#reviews .my-3 [onclick*="${reviewId}"]`).closest(".my-3");
		showPopup({
			message: "The review has been removed!",
			type: true
		});
		reviewDiv.remove();
		return;
	} else {
		showPopup({
			message: "Error while deleting the review",
			type: false
		});
	}
}


