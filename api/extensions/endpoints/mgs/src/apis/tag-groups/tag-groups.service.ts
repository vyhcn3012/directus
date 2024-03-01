import { EndpointExtensionContext } from '@directus/extensions';
import { ResultTagGroups } from './models/result-tag-groups.model';
import { getResultTagGroups } from './dto/output';
import { pagination } from '../../function-helpers';

export class TagGroupsService {
	collectionsNameTranslation = 'tag_group_translations';
	constructor() {}

	async findAll(req: any, context: EndpointExtensionContext, locale: string = 'vi') {
		const { limit = 10, page = 1 } = req.sanitizedQuery;
		const { search, search_type = 'and' } = req.query;
		const { services } = context;
		const { ItemsService } = services;

		try {
			console.log(search);

			const service = new ItemsService(this.collectionsNameTranslation, {
				accountability: req.accountability,
				schema: req.schema,
			});

			const tagGroups = await service.readByQuery({
				...req.sanitizedQuery,
				limit,
				page,
				fields: [
					'tag_group_id.id',
					'tag_group_id.slug',
					'tag_group_id.is_active',
					'tag_group_id.created_at',
					'tag_group_id.updated_at',
					'id',
					'locale',
					'name',
					'created_by.first_name',
					'created_by.last_name',
				],
				filter: {
					...req?.sanitizedQuery?.filter,
					locale,
				},
			});

			const count = await service.readByQuery({
				aggregate: { countDistinct: ['id'] },
				filter: {
					locale,
				},
			});

			const result: ResultTagGroups = {
				data: [],
			};

			result.data = getResultTagGroups(tagGroups);
			result.meta = pagination(tagGroups, page, limit, Number(count[0]?.countDistinct?.id));
			return result;
		} catch (error) {
			return error;
		}
	}
}
