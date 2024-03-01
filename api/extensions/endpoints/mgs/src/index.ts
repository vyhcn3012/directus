import { defineEndpoint } from '@directus/extensions-sdk';
import { TagGroupsService } from './apis/tag-groups/tag-groups.service';
import { ResultTagGroup } from './apis/tag-groups/models/result-tag-group.model';
import { getResultTagGroup } from './apis/tag-groups/dto/output';
import { convertStringToSlug } from './function-helpers';
const collectionsName = 'tag_group_translations';

export default defineEndpoint({
	id: 'tag-groups',
	handler: (router, context) => {
		const tagGroupsService = new TagGroupsService();
		router.get('/', async (req: any, res) => {
			const result = await tagGroupsService.findAll(req, context);
			res.json(result);
		});

		router.get('/:id', async (req: any, res) => {
			const { services } = context;
			const { ItemsService } = services;
			const { id } = req.params;

			try {
				const service = new ItemsService(collectionsName, {
					accountability: req.accountability,
					schema: req.schema,
				});

				const tagGroups = await service.readOne(id, {
					...req.sanitizedQuery,
					fields: [
						'tag_group_id.id',
						'tag_group_id.slug',
						'tag_group_id.is_active',
						'tag_group_id.created_at',
						'tag_group_id.updated_at',
						'tag_group_translation_id.id',
						'tag_group_translation_id.locale',
						'tag_group_translation_id.name',
						'created_by.first_name',
						'created_by.last_name',
					],
				});

				const result: ResultTagGroup = {
					data: null,
				};

				result.data = getResultTagGroup(tagGroups);
				res.json(result);
			} catch (error) {
				// Xử lý lỗi nếu có
				console.error('Error saving data:', error);
				res.status(500).json({ error: 'An error occurred while saving data' });
			}
		});

		router.post('/', async (req: any, res) => {
			const locale = 'en';
			const { services } = context;
			const { ItemsService } = services;
			const { name, is_active } = req.body;
			try {
				const tagGroupService = new ItemsService('tag_groups', {
					accountability: req.accountability,
					schema: req.schema,
				});

				const tagGroupTranslationService = new ItemsService('tag_group_translations', {
					accountability: req.accountability,
					schema: req.schema,
				});

				const tagGroupablesService = new ItemsService('tag_groupables', {
					accountability: req.accountability,
					schema: req.schema,
				});

				console.log({
					is_active,
					slug: convertStringToSlug(name),
					created_by: req.accountability.user,
				});

				const tagGroup = await tagGroupService.createOne({
					is_active,
					slug: convertStringToSlug(name),
					created_by: req.accountability.user,
				});

				const tagGroupTranslation = await tagGroupTranslationService.createOne({
					name,
					locale,
					tag_group_id: tagGroup,
				});

				const tagGroupable = await tagGroupablesService.createOne({
					tag_group_id: tagGroup,
					tag_group_translation_id: tagGroupTranslation,
					created_by: req.accountability.user,
				});

				res
					.json({
						data: {
							id: tagGroupable,
						},
					})
					.status(201);
			} catch (error) {
				// Xử lý lỗi nếu có
				console.error('Error saving data:', error);
				res.status(500).json({ error: 'An error occurred while saving data' });
			}
		});
	},
});
