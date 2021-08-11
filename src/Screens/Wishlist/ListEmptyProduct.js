import React from 'react';
import {Text, View, SafeAreaView} from 'react-native';
import ProductLoader from '../../Components/Loaders/ProductLoader';
import NoDataFound from '../../Components/NoDataFound';
import strings from '../../constants/lang';

export default function ListEmptyProduct({
  isLoading = false,
  text = strings.NODATAFOUND,
  containerStyle,
}) {
  if (isLoading) {
    return <ProductLoader listSize={4} isRow />;
  } else {
    return <NoDataFound containerStyle text={text} isLoading={isLoading} />;
  }
}
