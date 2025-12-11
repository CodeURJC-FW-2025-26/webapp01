
let currentPage = 1; 
let hasMoreGames = true;

async function scrollPagination() {
	if (window.innerHeight + window.scrollY >= document.body.scrollHeight && hasMoreGames) {
		const response = await fetch(`/newGames?page=${currentPage + 1}`);
		const data = await response.json();

		hasMoreGames = data.hasMore;

		const container = document.getElementById("games-container");
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
	}
}

window.addEventListener("scroll", scrollPagination);
