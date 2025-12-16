
let currentPage = 1; 
let hasMoreGames = true;
let isLoading = false;
/**
 * window.innerHeight->your height in that moment
 * window.scrollY->the lenght of the page
 * document.body.scrollHeight->total height of the page (from header to footer)
 * window.location.search->the URL behind the "?". Why?=>because if not it erases the filters
 */
async function scrollPagination() {
	if (window.innerHeight + window.scrollY + 1 >= document.body.scrollHeight && hasMoreGames &&!isLoading) {
		isLoading=true;
		const container = document.getElementById("games-container");
		Spinner.show(container);

		const params = new URLSearchParams(window.location.search);
		params.set("page", currentPage + 1);

		try {
			const response = await fetch(`/newGames?${params}`);
			const data = await response.json();

			hasMoreGames = data.hasMore;

			Spinner.hide(container);

			container.innerHTML += data.games.map(game =>
				`<div class="col-12 col-sm-6 col-lg-4 text-center">
					<a href="/detail/${game._id}" class="text-decoration-none d-block p-2">
						<div class="ratio ratio-1x1 rounded shadow overflow-hidden">
							<img src="${game.cover_image}" alt="${game.title}" class="w-100 h-100 object-fit-cover" />
						</div>
						<p>${game.title}</p>
					</a>
				</div>`
			).join("");

			currentPage++;
		} catch (error) {
			console.error("Error loading games:", error);
			Spinner.hide(container);
		} finally {
			isLoading = false;
		}
	}
}

window.addEventListener("scroll", scrollPagination);
