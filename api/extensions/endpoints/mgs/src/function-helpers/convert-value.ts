export const convertStringToSlug = (str: string) => {
	if (!str) return '';
	return str
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/ /g, '-');
};
