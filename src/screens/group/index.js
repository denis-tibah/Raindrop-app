import Stack from 'co/navigation/stack'

import Edit from './edit'
import Add from './add'

export default function Group({ route: { params={} } }) {
    return (
        <Stack.Navigator>
            <Stack.Screen name='edit' component={Edit} options={Edit.options} initialParams={params} />
            <Stack.Screen name='add' component={Add} options={Add.options} />
        </Stack.Navigator>
    )
}