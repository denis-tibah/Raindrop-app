import styled from 'styled-components/native'

export const List = styled.FlatList.attrs({
    horizontal: true
})`
    flex-grow: 0;
    background: ${({theme})=>theme.background.regular};
    padding-horizontal: ${({theme}) => theme.padding.small + theme.padding.micro}px;
    padding-top: ${({theme, data}) => data.length ? theme.padding.micro : 0}px;
    padding-bottom: ${({theme, data}) => data.length ? theme.padding.medium : 0}px;
    opacity: ${({status})=>status=='loaded'?1:0.2};
`