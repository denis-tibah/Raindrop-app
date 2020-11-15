import { all, spawn } from 'redux-saga/effects'
import common from './common'
import user from './user'
import collections from './collections'
import bookmarks from './bookmarks'
import filters from './filters'
import tags from './tags'
import covers from './covers'
import config from './config'
import oauth from './oauth'
import _import from './import'

const root = function* () {
	//spawn prevents the root sage from failing
	yield all([
		spawn(user),
		spawn(config),
		spawn(collections),
		spawn(bookmarks),
		spawn(filters),
		spawn(tags),
		spawn(covers),
		spawn(oauth),
		spawn(_import),

		spawn(common)
	])
}

export default root