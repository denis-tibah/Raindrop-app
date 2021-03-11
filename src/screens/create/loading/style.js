import styled from 'styled-components/native'
import LottieView from 'lottie-react-native'

export const Icon = styled(LottieView).attrs({
    source: require('./done.json'),
    autoPlay: true,
    loop: false,
    duration: 2000
})`
    width: 32px;
    height: 32px;
`

export const Wrap = styled.View`
    padding: ${({theme})=>theme.padding.micro}px;
`