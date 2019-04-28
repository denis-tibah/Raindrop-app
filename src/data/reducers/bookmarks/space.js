import {
	normalizeBookmarks,
	blankSpace,
	shouldLoadSpace,
	shouldLoadMoreSpace,
	normalizeSort
} from '../../helpers/bookmarks'
import {
	isQueryChanged,
	actualizeSpaceStatus,
	replaceBookmarksSpace
} from './utils'
import {
	SPACE_PER_PAGE,
	SPACE_LOAD_REQ, SPACE_LOAD_SUCCESS, SPACE_LOAD_ERROR,
	SPACE_RELOAD_REQ,
	SPACE_REFRESH_REQ,
	SPACE_ACTUALIZE_REQ,
	SPACE_NEXTPAGE_REQ, SPACE_NEXTPAGE_SUCCESS, SPACE_NEXTPAGE_ERROR,
	SPACE_CHANGE_SORT,

	BOOKMARK_CREATE_SUCCESS, BOOKMARK_UPDATE_SUCCESS, BOOKMARK_REMOVE_SUCCESS
} from '../../constants/bookmarks'

export default (state, action)=>{switch (action.type) {
	//Load bookmarks
	case SPACE_LOAD_REQ:{
		if (!shouldLoadSpace(state, action.spaceId)){
			action.ignore = true;
			return state;
		}

		const query = action.query||{};

		if (isQueryChanged(state, action.spaceId, query)){
			state = replaceBookmarksSpace(state, normalizeBookmarks([]), action.spaceId)
		}
		
		return state
			.setIn(['spaces', action.spaceId, 'status', 'main'], 		'loading')
			.setIn(['spaces', action.spaceId, 'status', 'nextPage'], 	'noMore')
			.setIn(['spaces', action.spaceId, 'query', 'search'], 		query.search||blankSpace.query.search)
			.setIn(['spaces', action.spaceId, 'query', 'sort'], 		query.sort||blankSpace.query.sort)
			.setIn(['spaces', action.spaceId, 'query', 'page'], 		query.page||blankSpace.query.page)
	}

	case SPACE_LOAD_SUCCESS:{
		const statusMain = (action.items.length ? 'loaded' : 'empty')
		const statusNextPage = ((statusMain == 'empty' || action.items.length < SPACE_PER_PAGE) ? 'noMore' : 'idle')

		state = replaceBookmarksSpace(state, normalizeBookmarks(action.items), action.spaceId)

		return state
			.setIn(['spaces', action.spaceId, 'status', 'main'], 		statusMain)
			.setIn(['spaces', action.spaceId, 'status', 'nextPage'], 	statusNextPage)
	}

	case SPACE_LOAD_ERROR:{
		state = replaceBookmarksSpace(state, normalizeBookmarks([]), action.spaceId)

		return state
			.setIn(['spaces', action.spaceId, 'status', 'main'], 		action.error=='bookmarks_load_noAccess' ? 'notFound' : 'error')
	}

	//Reload
	case SPACE_RELOAD_REQ:{
		if (!shouldLoadSpace(state, action.spaceId)){
			action.ignore = true;
			return state;
		}

		return state
			.setIn(['spaces', action.spaceId, 'status', 'main'], 		'loading')
			.setIn(['spaces', action.spaceId, 'status', 'nextPage'], 	'noMore')
			.setIn(['spaces', action.spaceId, 'query', 'page'], 		0)
	}

	//Refresh
	case SPACE_REFRESH_REQ:{
		if (
			!shouldLoadSpace(state, action.spaceId) ||
			!state.getIn(['spaces', action.spaceId])
		){
			action.ignore = true;
			return state;
		}

		return state
			.setIn(['spaces', action.spaceId, 'status', 'main'], 		'loading')
			.setIn(['spaces', action.spaceId, 'status', 'nextPage'], 	'noMore')
			.setIn(['spaces', action.spaceId, 'query', 'page'], 		0)
	}

	//Actualize
	case SPACE_ACTUALIZE_REQ:{
		if (!shouldLoadSpace(state, action.spaceId)){
			action.ignore = true;
			return state;
		}

		if (state.getIn(['spaces', action.spaceId, 'query', 'page'])!==0)
			return state;

		return state
			.setIn(['spaces', action.spaceId, 'status', 'main'], 		'loading')
			.setIn(['spaces', action.spaceId, 'status', 'nextPage'], 	'noMore')
			.setIn(['spaces', action.spaceId, 'query', 'page'], 		0)
	}

	//Next page
	case SPACE_NEXTPAGE_REQ:{
		if (!shouldLoadMoreSpace(state, action.spaceId)){
			action.ignore = true;
			return state;
		}

		const space = state.spaces[action.spaceId]
		return state
			.setIn(['spaces', action.spaceId, 'status', 'nextPage'], 	'loading')
			.setIn(['spaces', action.spaceId, 'query', 'page'], 		space.query.page+1)
	}

	case SPACE_NEXTPAGE_SUCCESS:{
		const space = state.spaces[action.spaceId]
		const clean = normalizeBookmarks(action.items)

		return state
			.setIn(['spaces', action.spaceId, 'status', 'nextPage'], 	(action.items.length ? 'idle' : 'noMore'))
			.setIn(['spaces', action.spaceId, 'ids'], 					[...space.ids||[], ...clean.ids])
			.set('elements', 										state.elements.merge(clean.elements))
			.set('meta', 											state.meta.merge(clean.meta))
	}

	case SPACE_NEXTPAGE_ERROR:{
		const space = state.spaces[action.spaceId]
		const page = space.query.page-1
		return state
			.setIn(['spaces', action.spaceId, 'status', 'nextPage'], 	'error')
			.setIn(['spaces', action.spaceId, 'query', 'page'], 		(page>=0?page:0))
	}

	//Change sort
	case SPACE_CHANGE_SORT:{
		const newSort = normalizeSort(action.sort)
		if (newSort != state.getIn(['spaces', action.spaceId, 'query', 'sort']))
			state = state
				.setIn(['spaces', action.spaceId, 'ids'], 				blankSpace.ids)

		return state
			.setIn(['spaces', action.spaceId, 'query', 'sort'], 		newSort)
			.setIn(['spaces', action.spaceId, 'query', 'page'], 		0)
	}

	//Update Space Status when Bookmark Changed
	case BOOKMARK_CREATE_SUCCESS:{
		state = actualizeSpaceStatus(state, action.spaceId)
		state = actualizeSpaceStatus(state, '0')
		
		return state
	}

	case BOOKMARK_UPDATE_SUCCESS:{
		if (action.movedFromSpaceId){
			state = actualizeSpaceStatus(state, action.movedFromSpaceId)
			state = actualizeSpaceStatus(state, action.spaceId)
			state = actualizeSpaceStatus(state, '0')
		}

		return state
	}

	case BOOKMARK_REMOVE_SUCCESS:{
		state = actualizeSpaceStatus(state, action.spaceId)
		state = actualizeSpaceStatus(state, '-99')

		return state
	}
}}