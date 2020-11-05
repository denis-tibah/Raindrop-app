import React from 'react'
import { close } from 'modules/extension'
import NavigationContainer from 'co/navigation/container'
import { Modals } from 'co/navigation/stack'

import Extension from './screens/extension'
import Bookmark from './screens/bookmark'
import Collection from './screens/collection'
import Group from './screens/group'
import Tag from './screens/tag'

export default class ExtensionRegistry extends React.Component {
    onBeforeStateChange = (state,action)=>{
        if (action.type == 'GO_BACK')
            close()
    }

    render() {
        return (
            <NavigationContainer>
                <Modals.Navigator onBeforeStateChange={this.onBeforeStateChange}>
                    <Modals.Screen name='extension' component={Extension} options={Extension.options} />
                    <Modals.Screen name='bookmark' component={Bookmark} options={Bookmark.options} />
                    <Modals.Screen name='collection' component={Collection} options={Collection.options} />
                    <Modals.Screen name='group' component={Group} options={Group.options} />
                    <Modals.Screen name='tag' component={Tag} options={Tag.options} />
                </Modals.Navigator>
            </NavigationContainer>
        )
    }
}