import Immutable from 'seamless-immutable'
import app from './app'

const reducer = (state = initialState, action)=>{
	const _app = app(state,action);
	if (_app) state = _app;

	switch (action.type) {
		default:
			return state;
	}
}

const initialState = Immutable({
	theme: 'default',
	lastTabIndex: 0,

	disableScroll: false,
	swipeables: 0,
	searchSpaceId: '0s',
	drawerSpaceId: 0,
	browser: 'internal'
})

export default {
	local: reducer
}