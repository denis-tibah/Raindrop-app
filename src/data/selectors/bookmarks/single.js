import { createSelector } from 'reselect'
import {
	getBookmarkScreenshotIndex,
	blankSpace,
	blankBookmark,
	blankMeta
} from '../../helpers/bookmarks'

const emptyObject = {}
const emptyArray = []

//Single
export const bookmark = ({bookmarks}, _id)=>bookmarks.elements[_id] ? bookmarks.elements[_id] : blankBookmark

export const makeBookmark = ()=>bookmark

export const makeHaveScreenshot = ()=>createSelector(
	[({bookmarks})=>bookmarks, (state, _id)=>_id],
	(bookmarks, _id)=>getBookmarkScreenshotIndex(bookmarks,_id)!=-1
)

export const highlight = ({bookmarks : { spaces } }, spaceId, _id)=>
	(
		(spaces[spaceId] ? spaces[spaceId] : blankSpace)
			.highlight
	)[_id] || emptyObject

export const makeHighlight = ()=>highlight

export const tags = ({bookmarks}, _id)=>(bookmarks.meta[_id] ? bookmarks.meta[_id] : blankMeta).tags

export const highlights = ({bookmarks}, _id, limit=0)=>{
	const items = (bookmarks.meta[_id] ? bookmarks.meta[_id] : blankMeta).highlights
	if (limit)
		return items.slice(0, limit)
	return items
}

export const makeHighlights = ()=>highlights

export const makeCreatorRef = ()=>createSelector(
	[({bookmarks}, _id)=>bookmarks.meta[_id], ({user})=>user.current._id],
	(meta, currentUserId)=>{
		const { creatorRef } = meta || blankMeta

		if (creatorRef && creatorRef._id == currentUserId)
			return blankMeta.creatorRef
			
		return creatorRef
	}
)

export const makeSuggestedFields = ()=>createSelector(
	[
		({bookmarks}, { link })=>bookmarks.suggestedFields[link] || {},
		(_, { collectionId })=>collectionId,
		(_, { tags })=>tags
	],
	({ collections=[], tags=[] }, collectionId, itemTags)=>{
		return ({
			collections: collections?.[0] == collectionId ? 
				emptyArray : 
				[...collections]
					.filter(cid=>cid!=collectionId)
					.splice(0, 5),
			tags: tags
				.filter(tag=>!itemTags?.includes(tag))
		})
	}
)