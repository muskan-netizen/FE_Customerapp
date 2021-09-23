import React from 'react';
import {Text, View} from 'react-native';
import CardLoader from '../../Components/Loaders/CardLoader';
import HeaderLoader from '../../Components/Loaders/HeaderLoader';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';

export default function ListEmptyProduct({isLoading = false}) {
  if (isLoading) {
    return (
      <View style={{marginTop: moderateScaleVertical(20)}}>
        <CardLoader
          containerStyle={{marginHorizontal: moderateScale(8)}}
          cardWidth={width - moderateScale(18)}
          height={moderateScaleVertical(140)}
          listSize={1}
        />
        <CardLoader
          cardWidth={width - moderateScale(190)}
          height={moderateScaleVertical(30)}
          listSize={1}
          containerStyle={{marginHorizontal: moderateScale(90)}}
        />
        <CardLoader
          cardWidth={width - moderateScale(18)}
          height={moderateScaleVertical(40)}
          listSize={1}
          containerStyle={{marginHorizontal: moderateScale(8)}}
        />
        <CardLoader listSize={3} height={moderateScaleVertical(200)} isRow />
      </View>
    );
  }
  // if (true) {
  //   return (
  //     <View
  //       style={{marginTop: moderateScaleVertical(20), alignItems: 'center'}}>
  //       <HeaderLoader
  //         isRight={false}
  //         widthLeft={width - moderateScale(30)}
  //         rectWidthLeft={width - moderateScale(30)}
  //         rectHeightLeft={moderateScaleVertical(135)}
  //         heightLeft={moderateScaleVertical(135)}
  //         viewStyles={{marginHorizontal: 0}}
  //         rx={3}
  //         ry={3}
  //       />
  //       <HeaderLoader
  //         isRight={false}
  //         widthLeft={moderateScale(200)}
  //         rectWidthLeft={moderateScale(200)}
  //         rectHeightLeft={moderateScaleVertical(25)}
  //         heightLeft={moderateScaleVertical(25)}
  //         viewStyles={{
  //           marginHorizontal: 0,
  //           marginTop: moderateScaleVertical(10),
  //         }}
  //         rx={3}
  //         ry={3}
  //       />
  //       <HeaderLoader
  //         isRight={false}
  //         widthLeft={width - moderateScale(30)}
  //         rectWidthLeft={width - moderateScale(30)}
  //         rectHeightLeft={moderateScaleVertical(30)}
  //         heightLeft={moderateScaleVertical(30)}
  //         viewStyles={{
  //           marginHorizontal: 0,
  //           marginTop: moderateScaleVertical(10),
  //         }}
  //         rx={3}
  //         ry={3}
  //       />
  //     </View>
  //   );
  // }
  return (
    <View>
      <Text></Text>
    </View>
  );
}
