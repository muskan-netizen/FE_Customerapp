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
  // if (isLoading) {
  //   return (
  //     <View style={{marginTop: moderateScaleVertical(20)}}>
  //       <CardLoader
  //         cardWidth={width - moderateScale(32)}
  //         height={moderateScaleVertical(200)}
  //         listSize={1}
  //         containerStyle={{marginLeft: moderateScale(16)}}
  //       />

  //       <CardLoader
  //         cardWidth={width / 4}
  //         height={moderateScaleVertical(40)}
  //         listSize={1}
  //         containerStyle={{marginLeft: moderateScale(16)}}
  //       />
  //       <CardLoader
  //         cardWidth={width / 2}
  //         height={moderateScaleVertical(40)}
  //         listSize={1}
  //         containerStyle={{marginLeft: moderateScale(16)}}
  //       />
  //       <CardLoader
  //         cardWidth={moderateScale(40)}
  //         height={moderateScaleVertical(40)}
  //         listSize={1}
  //         containerStyle={{marginLeft: moderateScale(16)}}
  //       />
  //       <CardLoader
  //         cardWidth={width - moderateScale(32)}
  //         height={moderateScaleVertical(200)}
  //         listSize={1}
  //         containerStyle={{marginLeft: moderateScale(16)}}
  //       />
  //       <CardLoader
  //         cardWidth={width / 2}
  //         height={moderateScaleVertical(40)}
  //         listSize={1}
  //         containerStyle={{marginLeft: moderateScale(16)}}
  //       />
  //       <CardLoader listSize={1} height={moderateScaleVertical(200)} isRow />
  //     </View>
  //   );
  // }
  if (isLoading) {
    return (
      <View
        style={{
          marginTop: moderateScaleVertical(20),
        }}>
        <HeaderLoader
          isRight={false}
          widthLeft={width - moderateScale(30)}
          rectWidthLeft={width - moderateScale(30)}
          rectHeightLeft={moderateScaleVertical(170)}
          heightLeft={moderateScaleVertical(170)}
          viewStyles={{marginHorizontal: 0}}
          rx={3}
          ry={3}
        />
        <HeaderLoader
          isRight={false}
          widthLeft={width * 0.3}
          rectWidthLeft={width * 0.3}
          rectHeightLeft={moderateScaleVertical(20)}
          heightLeft={moderateScaleVertical(20)}
          viewStyles={{
            marginHorizontal: 0,
            marginTop: moderateScaleVertical(12),
          }}
          rx={8}
          ry={8}
        />
        <HeaderLoader
          isRight={false}
          widthLeft={width * 0.55}
          rectWidthLeft={width * 0.55}
          rectHeightLeft={moderateScaleVertical(20)}
          heightLeft={moderateScaleVertical(20)}
          viewStyles={{
            marginHorizontal: 0,
            marginTop: moderateScaleVertical(12),
          }}
          rx={8}
          ry={8}
        />
        <HeaderLoader
          isRight={false}
          widthLeft={width * 0.15}
          rectWidthLeft={width * 0.15}
          rectHeightLeft={moderateScaleVertical(20)}
          heightLeft={moderateScaleVertical(20)}
          viewStyles={{
            marginHorizontal: 0,
            marginTop: moderateScaleVertical(12),
          }}
          rx={8}
          ry={8}
        />
        <HeaderLoader
          isRight={false}
          widthLeft={width - moderateScale(30)}
          rectWidthLeft={width - moderateScale(30)}
          rectHeightLeft={moderateScaleVertical(170)}
          heightLeft={moderateScaleVertical(170)}
          viewStyles={{
            marginHorizontal: 0,
            marginTop: moderateScaleVertical(12),
          }}
          rx={3}
          ry={3}
        />
        <HeaderLoader
          isRight={false}
          widthLeft={width * 0.55}
          rectWidthLeft={width * 0.55}
          rectHeightLeft={moderateScaleVertical(20)}
          heightLeft={moderateScaleVertical(20)}
          viewStyles={{
            marginHorizontal: 0,
            marginTop: moderateScaleVertical(12),
          }}
          rx={8}
          ry={8}
        />
        <HeaderLoader
          isRight={false}
          widthLeft={(width - moderateScale(50)) / 2}
          rectWidthLeft={(width - moderateScale(50)) / 2}
          rectHeightLeft={moderateScaleVertical(190)}
          heightLeft={moderateScaleVertical(190)}
          viewStyles={{
            marginHorizontal: 0,
            marginTop: moderateScaleVertical(12),
          }}
          rx={3}
          ry={3}
        />
        <HeaderLoader
          isRight={false}
          widthLeft={(width - moderateScale(50)) / 2}
          rectWidthLeft={(width - moderateScale(50)) / 2}
          rectHeightLeft={moderateScaleVertical(190)}
          heightLeft={moderateScaleVertical(190)}
          viewStyles={{
            marginHorizontal: 0,
            marginTop: moderateScaleVertical(12),
          }}
          rx={3}
          ry={3}
        />
      </View>
    );
  }
  return (
    <View>
      <Text></Text>
    </View>
  );
}
