import Immutable from 'seamless-immutable'
import { createTransform } from 'redux-persist'

var throttle = 300

const ImmutableTransform = createTransform(
	//save
	(state, key) => state.asMutable ? state.asMutable({deep: true}) : state,
	//get
	(state, key) => Immutable(state)
)

let storage
if (RAINDROP_ENVIRONMENT == 'browser')
	storage = require('localforage')
else
	storage = require('@react-native-community/async-storage').default

/*
	//fix localStorage if exceeded the quota
	try{
		localStorage.setItem('_quotaTest', new Array(1024).join('a'))
		localStorage.removeItem('_quotaTest')
	}catch(e){
		localStorage.clear()
	}
*/

export default {
	key: 'primary',
	version: 1,
	whitelist: [
		'config',
		'collections',
		'local',

		//app specifics
		'app'
	],
	throttle,
	storage,
	transforms: [ImmutableTransform],
	debug: false,
	stateReconciler: false
}