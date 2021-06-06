import React, { useState, useCallback, useEffect } from 'react'
import { PropTypes } from 'prop-types'
import { FlatList } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'

import useMeasure from './useMeasure'
import useSelected from './useSelected'
import useHover from './useHover'
import withReorder from './withReorder'
import Gesture from './gesture'
import Ghost from './ghost'

const propTypes = {
    sortEnabled:    PropTypes.bool,
    itemIsSortable: PropTypes.func,
    onSortEnd:      PropTypes.func
}

function Sortable({ reorder, forwardedRef, ...props}) {
    //gesture
    const [active, setActive] = useState(false)
    const [origin, setOrigin] = useState({x:0, y:0})

    const absoluteX = useSharedValue(0)
    const absoluteY = useSharedValue(0)
    const windowX = useSharedValue(0)
    const windowY = useSharedValue(0)

    //measuring
    const { measure, ...measureProps } = useMeasure({ active }, props)

    //items
    const selected = useSelected({ active, origin, measure }, props)
    const hover = useHover({ selected, absoluteX, absoluteY, measure }, props)

    //reorder
    useEffect(()=>{
        if (!selected || !hover || selected == hover) return
        
        reorder.change(selected, hover)
    }, [selected, hover])

    //events
    const onTouchStart = useCallback((pos)=>{
        setActive(true)
        setOrigin(pos)
    }, [])

    const onTouchEnd = useCallback((pos)=>{
        if (pos)
            reorder.commit()
        else
            reorder.reset()

        setOrigin({x:0,y:0})
        setActive(false)
    }, [])

    //flat list overrides
    const renderItem = useCallback(params=>{
        if (selected && props.keyExtractor(params.item) == selected)
            return measureProps.renderItem({...params, dragState: 'selected'})

        return measureProps.renderItem(params)
    }, [measureProps.renderItem, props.keyExtractor, selected])

    return (
        <Gesture 
            {...props}

            absoluteX={absoluteX}
            absoluteY={absoluteY}
            windowX={windowX}
            windowY={windowY}
            
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}>
            <FlatList 
                {...props}
                {...measureProps}
                ref={forwardedRef}
                renderItem={active ? renderItem : measureProps.renderItem} />

            <Ghost 
                {...props}

                selected={selected}
                
                measure={measure}
                absoluteX={absoluteX}
                absoluteY={absoluteY}
                windowX={windowX}
                windowY={windowY} />
        </Gesture>
    )
}

Sortable.propTypes = propTypes

const SortableWithReorder = withReorder(Sortable)

export default React.forwardRef((props, ref) => (
    <SortableWithReorder {...props} forwardedRef={ref} />
))