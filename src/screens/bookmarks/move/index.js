import React from 'react'
import t from 't'
import PropTypes from 'prop-types'
import _ from 'lodash-es'
import { connect } from 'react-redux'
import { moveSelected } from 'data/actions/bookmarks'
import { makeSelectMode } from 'data/selectors/bookmarks'

import { Title, Buttons, Button } from 'co/navigation/header'
import TreeContainer from 'co/collections/items'

class BookmarksMoveSelected extends React.Component {
	static propTypes = {
		route:  PropTypes.shape({
            params: PropTypes.shape({
				spaceId: PropTypes.number
			})
		})
	}

	static options = {
		headerStyle: {
			elevation: 0,
			shadowOpacity: 0
		}
	}

	treeOptions = {
        hideIds: [0]
    }

	onItemTap = ({ _id })=>{
        this.props.moveSelected(this.props.route.params.spaceId, _id)
		this.props.navigation.goBack()
	}

	render() {
		const { all, ids, navigation } = this.props
			
		return (
			<>
				<Title ids={ids.length}>
					{_.capitalize(t.s('move')) + ' ' + (all ? t.s('all') : ids.length) + ' ' + t.s('bookmarks')}
				</Title>

				<Buttons left>
					<Button 
						title={t.s('cancel')}
						onPress={navigation.goBack} />
				</Buttons>
				<Buttons />

				<TreeContainer
					options={this.treeOptions}
					onItemTap={this.onItemTap} />
			</>
		)
	}
}

export default connect(
	() => {
		const getSelectMode = makeSelectMode()
	
		return (state, { route: { params={} } })=>
			getSelectMode(state, params.spaceId)
	},
	{ moveSelected }
)(BookmarksMoveSelected)