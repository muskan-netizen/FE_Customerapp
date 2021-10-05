import React from 'react'
import navigationStrings from './navigationStrings'
import RoyoTabRoute from './RoyoTabRoute'

const RoyoOrderStack = (Stack) => {
  return (
    <>
    <Stack.Screen
        name={navigationStrings.ROYO_BOTTOMTAB}
        component={RoyoTabRoute}
        options={{headerShown: false}}
      />
    </>
  )
}

export default RoyoOrderStack
