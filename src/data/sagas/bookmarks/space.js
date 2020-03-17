import { call, put, takeEvery, select, takeLatest } from 'redux-saga/effects'
import Api from '../../modules/api'
import ApiError from '../../modules/error'
import { 
	getSpaceQuery,
	iterateSpaceId
} from '../../helpers/bookmarks'

import {
	SPACE_LOAD_REQ, SPACE_LOAD_SUCCESS, SPACE_LOAD_ERROR,
	SPACE_RELOAD_REQ,
	SPACE_REFRESH_REQ,
	SPACE_NEXTPAGE_REQ, SPACE_NEXTPAGE_SUCCESS, SPACE_NEXTPAGE_ERROR,
	SPACE_CHANGE_SORT,

	BOOKMARK_UPDATE_SUCCESS
} from '../../constants/bookmarks'

import {
	COLLECTION_REMOVE_SUCCESS
} from '../../constants/collections'

//Requests
export default function* () {
	//space
	yield takeEvery([
		SPACE_LOAD_REQ,
		SPACE_RELOAD_REQ,
		SPACE_REFRESH_REQ,
		SPACE_NEXTPAGE_REQ,
		SPACE_CHANGE_SORT
	], loadSpace)

	yield takeLatest(BOOKMARK_UPDATE_SUCCESS, maybeRefeshSpace)
	yield takeLatest(COLLECTION_REMOVE_SUCCESS, onCollectionRemove)
}

function* loadSpace({spaceId, ignore=false}) {
	if (ignore)
		return;

	const { bookmarks } = yield select()
	const query = getSpaceQuery(bookmarks, spaceId)

	try {
		const {items=[], result, access, status, error, errorMessage} = yield call(Api.get, 'raindrops/'+query.string);
		if (access === false || status === 404)
			throw new ApiError(error, errorMessage||'bookmarks_load_noAccess')

		if (!result)
			throw new ApiError(error, errorMessage||'bookmarks_load_error')

		yield put({
			type: (query.object.page ? SPACE_NEXTPAGE_SUCCESS : SPACE_LOAD_SUCCESS),
			spaceId: spaceId,
			items: items
		});
	} catch (error) {
		yield put({
			type: (query.object.page ? SPACE_NEXTPAGE_ERROR : SPACE_LOAD_ERROR),
			spaceId: spaceId,
			error
		});
	}
}

function* maybeRefeshSpace({spaceId, movedFromSpaceId}) {
	//Bookmark is moved from one collection, to another, now we need to refresh destination collection
	if (movedFromSpaceId){
		yield put({type: SPACE_REFRESH_REQ, spaceId: String(parseInt(spaceId))});
		yield put({type: SPACE_REFRESH_REQ, spaceId: String(parseInt(spaceId)+'s')});
	}
}

function* onCollectionRemove({_id}) {
	yield put({type: SPACE_REFRESH_REQ, spaceId: String(_id)});
}