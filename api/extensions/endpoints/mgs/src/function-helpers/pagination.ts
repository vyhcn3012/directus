export const pagination = (data: Array<Object>, page: number, perPage: number, total: number) => {
	const limit = Math.min(perPage, 100);
	const meta = {
		current_page: Number(page),
		from: Number((page - 1) * limit + 1),
		per_page: Number(perPage),
		last_page: Number(Math.ceil(total / limit)),
		to: Number(page !== Math.ceil(total / limit) ? (page - 1) * limit + data.length : total - (page - 1) * limit),
		total,
	};

	return meta;
};
