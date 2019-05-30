import { all, call, put, takeEvery, takeLatest, select } from 'redux-saga/effects'
import Api from '../../modules/api'
import _ from 'lodash-es'

import {
	COLLECTIONS_LOAD_REQ, COLLECTIONS_LOAD_SUCCESS, COLLECTIONS_LOAD_ERROR,
	COLLECTIONS_REFRESH_REQ,

	COLLECTION_DRAFT_LOAD_REQ, COLLECTION_UPDATE_REQ,

	COLLECTIONS_SAVE_ORDER
} from '../../constants/collections'

//Requests
export default function* () {
	//items, takeEvery is important here!
	yield takeEvery([
		COLLECTIONS_LOAD_REQ,
		COLLECTIONS_REFRESH_REQ, 
		COLLECTION_DRAFT_LOAD_REQ
	], loadItems)

	yield takeLatest(COLLECTIONS_SAVE_ORDER, saveOrder)
}

function* loadItems({dontLoadCollections=false}) {
	if (dontLoadCollections)
		return;

	try {
		//Load Get
		const [root, child, stat={}, user={}] = yield all([
			call(Api.get, 'collections'),
			call(Api.get, 'childrens'),
			call(Api.get, 'stat'),
			call(Api.get, 'user')
		])

		if ((!root.result)||(!child.result)||(!stat.result)||(!user.result))
			throw new Error('can\'t load collections')

		//Prepare default collections
		const state = yield select()
		const defColls = state.collections.defaults.map((item)=>{
			//view
			const view = state.config.defaultCollectionView[item._id]
			if (view)
				item = item.set('view', view)

			//count
			if (stat.items){
				const statIndex = (stat.items||[]).findIndex((a)=>a._id==item._id)
				if (statIndex!=-1)
					return item.set('count', stat.items[statIndex].count)
			}

			return item;
		})

		yield put({
			type: COLLECTIONS_LOAD_SUCCESS, 
			items: [
				...defColls,
				...root.items||[],
				...child.items||[]
			],
			groups: user.user.groups,
			user: user.user
		});
	} catch (error) {
		yield put({type: COLLECTIONS_LOAD_ERROR, error});
	}
}

function* saveOrder() {
	try {
		const state = yield select()

		yield all(
			_.map(
				_.sortBy(
					_.filter(
						state.collections.items,
						(item)=>item.parentId?true:false
					),
					({sort})=>sort
				),

				(item, index)=>(
					put({
						type: COLLECTION_UPDATE_REQ,
						_id: item._id,
						set: {
							sort: parseInt(index)
						}
					})
				)
			)
		)
	} catch ({message}) {
		console.log(message)
	}
}