import * as React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import SectionList from 'react-native-tabs-section-list';

const SECTIONS = [
  {
    title: 'Burgers',
    data: [
      {
        title: 'This is title 1',
        description: 'This is description 1',
        price: '4545',
      },
    ],
  },
  {
    title: 'Pizza',
    data: [
      {
        title: 'This is title 2',
        description: 'This is description 2',
        price: '4545',
      },
      {
        title: 'This is title 3',
        description: 'This is description 3',
        price: '4545',
      },
      {
        title: 'This is title 3',
        description: 'This is description 3',
        price: '4545',
      },
      {
        title: 'This is title 3',
        description: 'This is description 3',
        price: '4545',
      },
      {
        title: 'This is title 3',
        description: 'This is description 3',
        price: '4545',
      },
    ],
  },
  {
    title: 'Sushi and rolls',
    data: [
      {
        title: 'This is title 2',
        description: 'This is description 2',
        price: '4545',
      },
      {
        title: 'This is title 3',
        description: 'This is description 3',
        price: '4545',
      },
      {
        title: 'This is title 3',
        description: 'This is description 3',
        price: '4545',
      },
      {
        title: 'This is title 3',
        description: 'This is description 3',
        price: '4545',
      },
      {
        title: 'This is title 3',
        description: 'This is description 3',
        price: '4545',
      },
    ],
  },
];

class ProductList4 extends React.Component {
  static navigationOptions = {
    title: 'Menu',
    headerStyle: { borderBottomWidth: 0 },
  };

  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView style={{ flex: 1 }}>
          <SectionList
            sections={SECTIONS}
            keyExtractor={(item) => item.title}
            stickySectionHeadersEnabled={false}
            scrollToLocationOffset={50}
            tabBarStyle={styles.tabBar}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderTab={({ title, isActive }) => (
              <View
                style={[
                  styles.tabContainer,
                  { borderBottomWidth: isActive ? 1 : 0 },
                ]}>
                <Text
                  style={[
                    styles.tabText,
                    { color: isActive ? '#090909' : '#9e9e9e' },
                  ]}>
                  {title}
                </Text>
              </View>
            )}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <View style={styles.itemRow}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemPrice}>${item.price}</Text>
                </View>
                <Text style={styles.itemDescription}>{item.description}</Text>
              </View>
            )}
          />
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  tabBar: {
    backgroundColor: '#fff',
    borderBottomColor: '#f4f4f4',
    borderBottomWidth: 1,
  },
  tabContainer: {
    borderBottomColor: '#090909',
  },
  tabText: {
    padding: 15,
    color: '#9e9e9e',
    fontSize: 18,
    fontWeight: '500',
  },
  separator: {
    height: 0.5,
    width: '96%',
    alignSelf: 'flex-end',
    backgroundColor: '#eaeaea',
  },
  sectionHeaderContainer: {
    height: 10,
    backgroundColor: '#f6f6f6',
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
    borderBottomColor: '#f4f4f4',
    borderBottomWidth: 1,
  },
  sectionHeaderText: {
    color: '#010101',
    backgroundColor: '#fff',
    fontSize: 23,
    fontWeight: 'bold',
    paddingTop: 25,
    paddingBottom: 5,
    paddingHorizontal: 15,
  },
  itemContainer: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  itemTitle: {
    flex: 1,
    fontSize: 20,
    color: '#131313',
  },
  itemPrice: {
    fontSize: 18,
    color: '#131313',
  },
  itemDescription: {
    marginTop: 10,
    color: '#b6b6b6',
    fontSize: 16,
  },
  itemRow: {
    flexDirection: 'row',
  },
});

export default ProductList4;