import * as service from "../service.js";
import { PAGE_SIZE } from "../router.js";
import { GENRES, PEGI, PLATFORMS } from "../load_data.js";

export const handler = async (req, res) => {
	const parsed = parseInt(req.query.page);
	const page = Number.isNaN(parsed) ? 1 : Math.max(parseInt(req.query.page), 1);
	
	// Build filter
	const search = req?.query?.search ?? "";
	const { genres, platforms, pegi, fromYear, toYear, fromRating, toRating } = req.query;

	const filter = {
		title: { $regex: search, $options: "i" },
		...(genres && { genres: { $in: Array.isArray(genres) ? genres : [genres] } }),
		...(platforms && { platforms: { $in: Array.isArray(platforms) ? platforms : [platforms] } }),
		...(pegi && { pegi_rating: { $in: Array.isArray(pegi) ? pegi : [pegi] } }),
		...(fromYear || toYear
			? {
				release_date: {
					...(fromYear && { $gte: parseInt(fromYear) }),
					...(toYear && { $lte: parseInt(toYear) })
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

	// Pagination
	const { docs: games = [], totalPages = 1 } = await service.getGamesPaginated(page, PAGE_SIZE, filter); 

  	const prevPage = Math.max(page - 1, 1);
  	const nextPage = Math.min(page + 1, totalPages);

  	const isFirstPage = page === 1;
  	const isLastPage = page === totalPages;

	res.render("index", {
		games, 
		page,
		prevPage,
		nextPage,
		isFirstPage,
		isLastPage,
		genres: GENRES,
		platforms: PLATFORMS,
		pegi: PEGI
	});
};