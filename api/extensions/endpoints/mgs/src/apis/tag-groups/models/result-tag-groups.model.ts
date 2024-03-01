import { TagGroup } from './result-tag-group.model';
import { Link, Meta } from '../../../models/result.model';

export class ResultTagGroups {
	data: TagGroup[];
	links?: Link;
	meta?: Meta;
}
