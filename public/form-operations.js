

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
		showPopup("The review has been saved!");
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
		showPopup("The review has been saved!");
	} else {
		alert("Failed to create review. Please try again.");
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

function cancelEdit(reviewId) {
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

function deleteReview(){
	const reviewDiv = button.closest(".my-3");
	if (reviewDiv) reviewDiv.remove();
}


