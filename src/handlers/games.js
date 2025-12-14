import * as service from "../service.js";
import { PAGE_SIZE } from "../router.js";
import { GENRES, PEGI, PLATFORMS } from "../load_data.js";

function buildFilter(query){
	const search = query?.search ?? "";
	const { genres, platforms, pegi, fromYear, toYear, fromRating, toRating } = query;

	return {
		title: { $regex: search, $options: "i" },
		...(genres && { genres: { $in: Array.isArray(genres) ? genres : [genres] } }),
		...(platforms && { platforms: { $in: Array.isArray(platforms) ? platforms : [platforms] } }),
		...(pegi && { pegi_rating: { $in: Array.isArray(pegi) ? pegi : [pegi] } }),
		...(fromYear || toYear
			? {
				release_date: {
					...(fromYear && { $gte: new Date(`${fromYear}-01-01T00:00:00.000Z`) }),
					...(toYear && { $lte: new Date(`${toYear}-12-31T23:59:59.999Z`) })
				}
			}
			: {}),
		...(fromRating || toRating
			? {
				reviews: { $exists: true, $ne: [] },
				$expr: {
					$let: {
						vars: { avgRating: { $avg: "$reviews.rating" } },
						in: {
							$and: [
								...(fromRating ? [{ $gte: ["$$avgRating", parseFloat(fromRating)] }] : []),
								...(toRating ? [{ $lte: ["$$avgRating", parseFloat(toRating)] }] : [])
							]
						}
					}
				}
			}
			: {})
	};

}

export const handler = async (req, res) => {
	const parsed = parseInt(req.query.page); //maybe refactor
	const page = Number.isNaN(parsed) ? 1 : Math.max(parseInt(req.query.page), 1);
	
	// Build filter
	const filter = buildFilter(req.query);
	const { genres, platforms, pegi, fromYear, toYear, fromRating, toRating } = req.query; //here for res.render

	//the first page
	const { docs: games = [], totalPages = 1 } = await service.getGamesPaginated(page, PAGE_SIZE, filter); 

	// Rebuild query string
	const currentFilters = { ...req.query };
	delete currentFilters.page;

	const params = new URLSearchParams(currentFilters);
	const baseQuery = params.toString();

	const generateCheckedMap = (all, query = []) =>
		all.map((e) => new Object({ label: e, selected: query.includes(e) }));

	const pages = Array.from({ length: totalPages }).map((_, i) => ({
  		num: i + 1,
  		isCurrentPage: page === i + 1
	}));
	const msg = req.query.msg || null;
	const errorMsg = req.query.errorMsg || null;
	res.render("index", {
		games, 
		msg,
		errorMsg,
		page,
		genres: generateCheckedMap(GENRES, genres),
		platforms: generateCheckedMap(PLATFORMS, platforms),
		pegi: generateCheckedMap(PEGI, pegi),
		fromYear,
		toYear,
		fromRating,
		toRating,
		base: baseQuery,
		pages
	});
};
export const scrollHandler = async (req, res) => {
	const parsed = parseInt(req.query.page);
	const page = Number.isNaN(parsed) ? 1 : Math.max(parsed, 1);

	const filter = buildFilter(req.query);

	const { docs: games = [], totalPages = 1 } = await service.getGamesPaginated(page, PAGE_SIZE, filter);

	res.json({
		games,
		hasMore: page < totalPages
	});
};