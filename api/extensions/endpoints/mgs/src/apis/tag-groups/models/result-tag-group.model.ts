export class ResultTagGroup {
	data: TagGroup;
}

export class TagGroup {
	id: number;
	slug: string;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	name: string;
	translations: Translation[];
	created_by: string;
}

class Translation {
	id: number;
	tag_group_id: number;
	locale: string;
	name: string;
	created_at: Date;
	updated_at: Date;
}
