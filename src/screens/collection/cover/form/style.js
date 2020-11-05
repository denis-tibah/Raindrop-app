import styled from 'styled-components/native'
import { RectButton } from 'react-native-gesture-handler'

export const iconSize = 52

export const IconTap = styled(RectButton)`
	height: ${iconSize}px;
	flex: 1;
	align-items: center;
	justify-content: center;
	${({active, theme})=>{
		if (active)
			return `
				border-radius: 6px;
				background: ${theme.color.accent};
			`
		return ''
	}}
`

export const GridView = styled.FlatList.attrs(({theme})=>({
	columnWrapperStyle: {
		paddingHorizontal: theme.padding.small
	}
}))``

export const Wrap = styled.View`
	flex:1;
`