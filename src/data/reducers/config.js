import _ from 'lodash-es'
import { REHYDRATE } from 'redux-persist/src/constants'
import { USER_LOAD_SUCCESS, USER_UPDATE_SUCCESS } from '../constants/user'
import Immutable from 'seamless-immutable'

export default function(state = initialState, action){switch (action.type) {
	case REHYDRATE:
	case USER_LOAD_SUCCESS:
	case USER_UPDATE_SUCCESS:{
		const changed = action.user && action.user.config || (action.payload && action.payload.config||{})

		_.forEach(
			initialState,
			(val,key)=>{
				state = mutate(state, key, changed[key])
			}
		)

		return state
	}

	case 'RESET':{
		return initialState
	}

	default:
		return state
}}

const mutate = (state, key='', val='')=>{
	let modified
	switch(typeof initialState[key]){
		case 'string':	modified = String(val || ''); break
		case 'number':	modified = parseInt(val || 0); break
		default:		return state //ignore
	}
	return state.set(key, modified)
}

const initialState = Immutable({
	last_collection:	0,
	raindrops_view:		'',
	raindrops_sort:		''
})