import fs from "fs/promises";

const JSON_OUT_PATH = "src/assets/data.json";

const PROPS = [
	"id",
	"name",
	"summary",
	"genres",
	"platforms",
	"first_release_date",
	"involved_companies",
	"cover",
	"age_ratings",
];

const ENDPOINTS = {
	GAMES: "https://api.igdb.com/v4/games",
	GENRES: "https://api.igdb.com/v4/genres",
	PLATFORMS: "https://api.igdb.com/v4/platforms",
	INVOLVED_COMPANIES: "https://api.igdb.com/v4/involved_companies",
	COMPANIES: "https://api.igdb.com/v4/companies",
	COVERS: "https://api.igdb.com/v4/covers",
	PEGI: "https://api.igdb.com/v4/age_ratings",
};

const AUTH_HEADERS = {
	Authorization: "Bearer szgmlwr2tqiwyk4rbovnnx3w9zyaz5",
	"Client-ID": "tyy7k26b2trz9nde22sjq77v7tnndt",
	"Content-Type": "application/json",
};

const isValid = (entry) => PROPS.every((p) => p in entry);

async function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request(url, body, retries = 3) {
	try {
		const res = await fetch(url, {
			method: "POST",
			headers: AUTH_HEADERS,
			body,
			redirect: "follow",
		});

		if (res.status === 429 && retries > 0) {
			console.warn("too many requests, waiting 4s before retry");
			await delay(4000);
			return request(url, body, retries - 1);
		}

		if (!res.ok) {
			throw new Error(`request failed ${res.status}: ${res.statusText}`);
		}

		return await res.json();
	} catch (err) {
		console.error(`error in request to ${url}:`, err.message);
		return [];
	}
}

function normalizeEntry(entry) {
	const {
		name,
		summary,
		genres,
		platforms,
		first_release_date,
		involved_companies,
		cover,
		age_ratings,
	} = entry;

	return {
		title: name,
		description: summary,
		genres,
		platforms,
		release_date: first_release_date,
		developer: involved_companies,
		cover_image: cover,
		pegi_rating: age_ratings,
	};
}

async function resolveGenres(ids) {
	return Promise.all(
		ids.map(async (id) => {
			const data = await request(
				ENDPOINTS.GENRES,
				`fields name; where id = ${id};`
			);
			return data[0]?.name ?? "Unknown";
		})
	);
}

async function resolvePlatforms(ids) {
	return Promise.all(
		ids.map(async (id) => {
			const data = await request(
				ENDPOINTS.PLATFORMS,
				`fields name; where id = ${id};`
			);
			return data[0]?.name ?? "Unknown";
		})
	);
}

async function resolveDevelopers(ids) {
	const companies = await Promise.all(
		ids.map(async (id) => {
			const data = await request(
				ENDPOINTS.INVOLVED_COMPANIES,
				`fields developer,company; where id = ${id};`
			);
			return data[0];
		})
	);

	const devCompanies = companies.filter((c) => c?.developer);

	return Promise.all(
		devCompanies.map(async ({ company }) => {
			const data = await request(
				ENDPOINTS.COMPANIES,
				`fields name; where id = ${company};`
			);
			return data[0]?.name ?? "Unknown";
		})
	);
}

async function resolveCover(id) {
	const data = await request(
		ENDPOINTS.COVERS,
		`fields url; where id = ${id};`
	);
	return data[0] ? `https:${data[0].url}` : null;
}

async function resolvePegi(ids) {
	const ratings = await Promise.all(
		ids.map(async (id) => {
			const data = await request(
				ENDPOINTS.PEGI,
				`fields category, rating; where id = ${id};`
			);
			return data[0];
		})
	);

	return ratings.filter((r) => r?.category === 2).map((r) => r.rating);
}

async function hydrateGame(game) {
	return {
		...game,
		genres: await resolveGenres(game.genres),
		platforms: await resolvePlatforms(game.platforms),
		developer: await resolveDevelopers(game.developer),
		cover_image: await resolveCover(game.cover_image),
		pegi_rating: await resolvePegi(game.pegi_rating),
	};
}

(async () => {
	try {
		const rawGames = await request(
			ENDPOINTS.GAMES,
			// "fields name,summary,genres,platforms,first_release_date,involved_companies,cover,age_ratings; limit 100;"
			"fields name,summary,genres,platforms,first_release_date,involved_companies,cover,age_ratings; where id = 115289;"
		);

		const normalized = rawGames.filter(isValid).map(normalizeEntry);

		const enriched = [];
		for (const game of normalized) {
			enriched.push(await hydrateGame(game));
		}

		await fs.writeFile(
			JSON_OUT_PATH,
			JSON.stringify(enriched, null, 2),
			"utf-8"
		);
		console.log("data saved to data.json");
	} catch (err) {
		console.error("fatal error:", err.message);
	}
})();
