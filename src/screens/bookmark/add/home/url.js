import t from 't'
import React from 'react'
import { Platform } from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import URLField from '../../edit/form/url'
import { Buttons, Button } from 'co/navigation/header'

const validateURL = (link='')=>/\D+\:\/\//.test(link)

export default class BookmarkAddURL extends React.Component {
	state = {
		link: ''
	}
	
	async componentDidMount() {
		if (this.state.link == ''){
			if (Platform.OS=='ios' && !await Clipboard.hasURL())
				return

			const link = await Clipboard.getString()
			if (validateURL(link))
				this.onChangeLink({link})
		}
	}

	onChangeLink = ({link})=>
		this.setState({link})

	onSubmitLink = ()=>{
		let value = this.state.link.trim()

		if (!validateURL(value))
			value = 'http://'+value

		this.props.navigation.setParams({
			values: [value],
			type: 'url'
		})
	}

	bindRef = (r)=>this._input=r

	renderButtons = ()=>{
		const { link='' } = this.state
		const disabled = !link.trim()

		return (
			<Buttons disabled={disabled}>
				<Button 
					disabled={disabled}
					title={t.s('add')}
					bold
					onPress={this.onSubmitLink} />
			</Buttons>
		)
	}
	
	render() {
		return (
			<>
				{this.renderButtons()}

				<URLField 
					autoFocus
					returnKeyType='send'
					selectTextOnFocus={true}
					link={this.state.link}
					onChange={this.onChangeLink}
					onSubmit={this.onSubmitLink} />
			</>
		)
	}
}