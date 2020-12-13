import React, { useMemo, useCallback, useState } from 'react'
import t from 't'
import { useDispatch, useSelector } from 'react-redux'
import { set } from 'data/actions/config'
import Browser from 'modules/browser'

import { Info } from 'co/alert'
import Button from 'co/button'
import { Form } from 'co/form'

export default function SearchIntro() {
    const dispatch = useDispatch()

    //hide
    const acknowledge = useSelector(state=>state.config.acknowledge)
    const hide = useMemo(()=>acknowledge.includes('full_text_search'), [acknowledge])

    const onHidePress = useCallback(()=>{
        dispatch(set('acknowledge', [...new Set([...acknowledge, 'full_text_search'])]))
    }, [dispatch])

    //help
    const [showBrowser, setShowBrowser] = useState(false)
    const onHelpPress = useCallback(()=>{
        setShowBrowser(true)
    }, [])
    const onHelpClose = useCallback(()=>{
        setShowBrowser(false)
    }, [])

    if (hide)
        return null

    return (
        <Form>
            <Info 
                icon='file-search'
                message={t.s('searchD')}>
                <Button 
                    icon='question'
                    color='asphalt'
                    onPress={onHelpPress} />

                <Button 
                    icon='close'
                    color='info'
                    onPress={onHidePress} />
            </Info>

            {showBrowser && (
                <Browser 
                    link='http://help.raindrop.io/search'
                    onClose={onHelpClose} />
            )}
        </Form>
    )
}