import React from 'react'
import { compact } from 'modules/format/number'
import Icon from 'co/icon'

import { ItemView, ItemCount, Action } from './style'

import CollectionIcon from './icon'
import Title from './title'

export default class CollectionItemView extends React.Component {
	render() {
		const {
			expandable,
			level,
			selected,
			item,
			isDrag,	
			onToggle
		} = this.props

		const {
			_id,
			count,
			cover=[],
			expanded,
			color,
			collaborators
		} = item

		return (
			<ItemView 
				level={level} 
				color={color} 
				selected={selected}
				isDrag={isDrag}>
				<CollectionIcon 
					collectionId={_id} 
					src={cover[0]} 
					selected={selected}
					color={selected ? 'white' : undefined} />

				<Title {...this.props} />

				{collaborators && (
					<Icon 
						name='group-2'
						variant='fill'
						size='18' />
				)}

				{count ? (<ItemCount selected={selected}>
					{compact(count)}
				</ItemCount>) : null}

				{expandable
					? 
					<Action 
						onPress={onToggle}>
						<Icon 
							name={expanded ? 'arrow-up-s' : 'arrow-down-s'}
							color={selected ? 'background.regular' : 'text.secondary'} />
					</Action>
					:
					<Action enabled={false}>
						<Icon 
							name='arrow-drop-right'
							color='border'
							variant='fill' />
					</Action>
				}
			</ItemView>
		)
	}
}