import { get } from 'lodash';
import { TagGroup } from '../../models/result-tag-group.model';

export const getResultTagGroups = (T: []): TagGroup[] => {
	if (!T) return [];
	const result = T.map((item) => {
		return getResultTagGroup(item);
	});

	return result;
};

export const getResultTagGroup = (T: any): TagGroup => {
	const { tag_group_id, created_by } = T;
	const result = {
		id: get(tag_group_id, 'id', null),
		slug: get(tag_group_id, 'slug', null),
		is_active: get(tag_group_id, 'is_active', null),
		created_at: get(tag_group_id, 'created_at', null),
		updated_at: get(tag_group_id, 'updated_at', null),
		name: get(T, 'name', null),
		created_by: get(created_by, 'first_name', null) + ' ' + get(created_by, 'last_name', null),
		translations: [
			{
				id: get(T, 'id', null),
				tag_group_id: get(tag_group_id, 'id', null),
				locale: get(T, 'locale', null),
				name: get(T, 'name', null),
				created_at: get(tag_group_id, 'created_at', null),
				updated_at: get(tag_group_id, 'updated_at', null),
			},
		],
	};

	return result;
};
