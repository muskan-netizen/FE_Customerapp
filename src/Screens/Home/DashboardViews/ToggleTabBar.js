import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useSelector} from 'react-redux';
import MaterialTabs from 'react-native-material-tabs';

import colors from '../../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../../styles/responsiveSize';

export default function ToggleTabBar({selcetedToggle, toggleData}) {
  const [state, setState] = useState({
    selectedIndex: 0,
    tabs: [],
  });
  const dine_In_Type = useSelector((state) => state?.home?.dineInType);
  const [selectedTab, setSelectedTab] = useState(0);
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const {appData, themeColors} = useSelector((state) => state?.initBoot);

  const {selectedIndex, tabs} = state;
  useEffect(() => {
    addAllTabs();
    if (dine_In_Type == 'delivery') {
      if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setSelectedTab(0);
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setSelectedTab(0);
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        setSelectedTab(0);
      } else {
        setSelectedTab(0);
      }
    }
    if (dine_In_Type == 'dine_in') {
      if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setSelectedTab(1);
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setSelectedTab(0);
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        setSelectedTab(1);
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setSelectedTab(1);
      }
    }
    if (dine_In_Type == 'takeaway') {
      if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setSelectedTab(1);
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setSelectedTab(1);
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        setSelectedTab(1);
      } else {
        setSelectedTab(2);
      }
    }
  }, [appData]);

  const addAllTabs = () => {
    const localTabsArray = [];
    userSelectedtab();
    if (toggleData?.profile?.preferences?.delivery_check == 1) {
      localTabsArray.push('Delivery');
      if (
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        selcetedToggle('delivery');
      }
    }
    if (toggleData?.profile?.preferences?.dinein_check == 1) {
      localTabsArray.push('Dine-In');
      if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        selcetedToggle('dine_in');
      }
    }
    if (toggleData?.profile?.preferences?.takeaway_check == 1) {
      localTabsArray.push('Takeaway');
      if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 0
      ) {
        selcetedToggle('takeaway');
      }
    }
    updateState({
      tabs: localTabsArray,
    });
  };

  useEffect(() => {
    userSelectedtab();
  }, [selectedTab]);

  const userSelectedtab = () => {
    if (
      toggleData?.profile?.preferences?.delivery_check == 1 &&
      toggleData?.profile?.preferences?.dinein_check == 1 &&
      toggleData?.profile?.preferences?.takeaway_check == 1
    ) {
      if (selectedTab == 0) {
        selcetedToggle('delivery');
      } else if (selectedTab == 1) {
        selcetedToggle('dine_in');
      } else if (selectedTab == 2) {
        selcetedToggle('takeaway');
      }
    } else if (
      toggleData?.profile?.preferences?.delivery_check == 1 &&
      toggleData?.profile?.preferences?.dinein_check == 1 &&
      toggleData?.profile?.preferences?.takeaway_check == 0
    ) {
      if (selectedTab == 0) {
        selcetedToggle('delivery');
      } else if (selectedTab == 1) {
        selcetedToggle('dine_in');
      }
    } else if (
      toggleData?.profile?.preferences?.delivery_check == 1 &&
      toggleData?.profile?.preferences?.dinein_check == 0 &&
      toggleData?.profile?.preferences?.takeaway_check == 1
    ) {
      if (selectedTab == 0) {
        selcetedToggle('delivery');
      } else if (selectedTab == 1) {
        selcetedToggle('takeaway');
      }
    } else if (
      toggleData?.profile?.preferences?.delivery_check == 0 &&
      toggleData?.profile?.preferences?.dinein_check == 1 &&
      toggleData?.profile?.preferences?.takeaway_check == 1
    ) {
      if (selectedTab == 0) {
        selcetedToggle('dine_in');
      } else if (selectedTab == 1) {
        selcetedToggle('takeaway');
      }
    }
  };

  return (
    <>
      {tabs.length > 1 ? (
        <View
          style={{
            marginVertical: moderateScaleVertical(10),
            borderRadius: 15,
            overflow: 'hidden',
          }}>
          <MaterialTabs
            items={tabs}
            selectedIndex={selectedTab}
            onChange={setSelectedTab}
            barHeight={38}
            indicatorColor={themeColors.primary_color}
            activeTextColor={themeColors.primary_color}
            barColor={'#EEEEEE'}
            inactiveTextColor={colors.textGreyF}
            indicatorHeight={3}
          />
        </View>
      ) : null}
    </>
  );
}
