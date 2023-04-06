import React from 'react';
import {
    Text,
    View,
} from 'react-native';

import {
    moderateScale,
} from '../../../styles/responsiveSize';
/**
 * DeliverableSection Part
 * @param {item ,colors,fontFamily,strings} props 
 * @returns 
 */

function DeliverableSection(props) {

    const { item, colors, fontFamily, strings } = props;
    console.log(item?.isDeliverable ,"item?.isDeliverable ");
    return (
        <>
            {
                !!item?.isDeliverable ? null : (
                    <View style={{ marginHorizontal: moderateScale(10) }}>
                        <Text
                            style={{
                                fontSize: moderateScale(12),
                                fontFamily: fontFamily.medium,
                                color: colors.redFireBrick,
                            }}>
                               {/* {'not Deliverable'} */}
                            {strings.ITEM_NOT_DELIVERABLE}
                        </Text>
                    </View>
                )
            }
        </>

    )

}
export default React.memo(DeliverableSection);