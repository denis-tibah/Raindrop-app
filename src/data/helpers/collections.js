import _ from 'lodash-es'
import Immutable from 'seamless-immutable'
import { normalizeURL } from './defaults'
import { getColorForString } from './colors'

export const findGroupByCollection = (groups, collectionId)=>{
	return _.find(groups, ({collections=[]})=>(collections.indexOf(parseInt(collectionId))!=-1))
}

export const getCollection = (collection, _id, color)=>{
	if (!collection)
		return normalizeCollection({_id: parseInt(_id), color})
			.set('loading', true)

	if (color)
		return collection.set('color', color)

	return collection
}

export const getGroup = (groups, _id)=>{
	return _.find(groups, (g)=>g._id == _id) || normalizeGroup()
}

export const getPath = (allCollections, allGroups, objectId, options={})=>{
	var parents = []

	const makeParentItem = (parent)=>({
		_id: 	parent._id,
		type:   'collection',
		title: 	parent.title,
		cover: 	parent.cover
	})
	const findParents = (findId)=>{
		const parent = allCollections[findId]
		
		if (parent){
			parents.push(makeParentItem(parent))

			if (parent.parentId){
				findParents(parent.parentId)
			}
		}
	}

	if (isGroupId(objectId)){
		const group = _.find(allGroups, (group)=>group._id == objectId)
		if (group)
			parents.push({
				_id: group._id,
				type: 'group',
				title: group.title
			})
	}else if (objectId) {
		const collection = allCollections[parseInt(objectId)]

		if (collection){
			if (collection._id>0){
				findParents(collection.parentId)
				parents.reverse()
			}

			if (options.self)
				parents.push(makeParentItem(collection))

			//find group
			if ((collection._id>0)&&(options.group)) {
				const firstParentId = parents.length ? parents[0]._id : collection._id
				const parentGroup = _.find(allGroups, (group)=>group.collections.indexOf(firstParentId)!=-1)

				if (parentGroup)
					parents.unshift({
						_id: parentGroup._id,
						type: 'group',
						title: parentGroup.title
					})
			}
		}
	}

	return Immutable(parents)
}

export const isGroupId = (_id)=>/^g\d+$/.test((_id||'').toString())

export const shouldLoadItems = (state)=>{
	switch(state.status){
		case 'idle':
		case 'error':
			return true

		default:
			return false
	}
}

export const normalizeCollection = (item={})=>{
	var cover = normalizeURL(typeof item.cover == 'string' ? item.cover : ((item.cover||[]).length>=1?item.cover[0]:''))

	return Immutable({
		_id: 		parseInt(item._id||0),
		title: 		item.title,
		count: 		parseInt(item.count||0),
		public: 	item.public||false,
		expanded: 	item.expanded||false,
		view: 		item.view||'list',
		sort: 		parseFloat(item.sort||0),
		author: 	item.author||item._id<=0||false,
		uniqKey: 	item.uniqKey||'',

		cover: 		cover,
		cover_path: item.cover_path||'',

		parentId: 	parseInt(item.parentId||(item.parent?item.parent['$id']:0))||null,

		color: 		item.color/*||(!cover?getColorForString(item.title):'')*/||'',
		loading: 	false
	});
}

export const normalizeCollections = (items=[], groups=[])=>{
	const cleanCollections = _.map(items, normalizeCollection)
	const ids = _.map(cleanCollections, (c)=>c._id)
	var cleanGroups = normalizeGroups(groups)

	//find collections not pinned to group
	var rootCollectionsIds = _.compact(_.map(cleanCollections, (item)=>{
			if (item._id>0 && !item.parentId) return item._id
		})),
		collectionsIdsInGroups = _.flatten(_.map(cleanGroups, ({collections})=>collections))
	const notInGroups = _.without(_.difference(rootCollectionsIds, collectionsIdsInGroups), collectionsIdsInGroups)
	if (notInGroups.length){
		cleanGroups = cleanGroups.concat([normalizeGroup({
			title: 'My Collections',
			collections: notInGroups
		}, cleanGroups.length)])
	}

	return Immutable({
		items: _.zipObject(
			ids,
			cleanCollections
		),
		groups: cleanGroups
	});
}

export const normalizeGroup = (group={}, index)=>{
	if (Immutable.isImmutable(group))
		return group

	return Immutable({
		_id: group._id ? group._id : 'g'+(index+1),
		title: group.title,
		collections: group.collections||[],
		hidden: group.hidden?true:false,
		sort: parseInt(index)
	})
}

export const normalizeGroups = (groups=[])=>{
	return Immutable(_.map(groups, normalizeGroup))
}

export const blankDraft = Immutable({
	status: 'idle',
	item: {}
})

export const blankCollection = normalizeCollection()