import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import WrapperContainer from '../../Components/WrapperContainer'
import DropDown from '../../Components/DropDown'
import { moderateScale, moderateScaleVertical, textScale, width } from '../../styles/responsiveSize'
import { getColorCodeWithOpactiyNumber } from '../../utils/helperFunctions'
import colors from '../../styles/colors'

const ProductPowerConumption = () => {

    const [selectedFilterValue, setSelectedFilterValue] = useState(0)
    const [filterTextInputValues, setFilterTextInputValues] = useState([])



    const electronicConsumptionFilterView = () => {
        return (
            <View style={styles.filterElctConsumpView} >
                <DropDown
                    inputStyle={{
                        height: moderateScaleVertical(40),
                    }}
                    value={isEmpty(selectedFilterValue) ? 0 : selectedFilterValue?.name}
                    modalStyle={{
                        marginTop: moderateScaleVertical(42),
                        width: '100%',
                    }}
                    selectedIndexByProps={-1}
                    placeholder={"Select"}
                    data={[{ id: 1, name: 'Power Consumption' }, { id: 2, name: 'Hours of use per day' }]}
                    fetchValues={(val) => onSelectFilterItem({ ...val })}
                    marginBottom={0}
                />

                {[{ id: 1, title: 'Power Consumption' }, { id: 2, title: 'Hours of use per day' }].map(item => {
                    let slectedVal = filterTextInputValues.filter(i => i?.id == item?.id)
                    return (
                        <View style={{ marginBottom: moderateScaleVertical(10), }} >
                            <Text style={{
                                marginBottom: moderateScaleVertical(5),
                                fontFamily: fontFamily.medium,
                                color: isDarkMode ? colors.white : colors.black,
                                fontSize: textScale(12)
                            }} > {item?.title} </Text>
                            <TextInput
                                style={{
                                    fontFamily: fontFamily.regular,
                                    fontSize: textScale(12),
                                    height: moderateScaleVertical(40),
                                    backgroundColor: isDarkMode ? colors.greyA : colors.white,
                                    paddingHorizontal: moderateScale(6),
                                }}
                                placeholder={item?.title}
                                value={slectedVal?.attribute}
                                onChangeText={text => onChangeFilterText(text, item)}
                            />
                        </View>
                    )
                })}

                <View style={{ marginTop: moderateScaleVertical(5) }} >
                    <GradientButton
                        btnText={strings.SUBMIT}
                        onPress={onSubmitFilterValues}
                    />
                </View>
            </View>
        )
    }

    const onSelectFilterItem = (item) => {
        console.log(item, " selectedimahere")
        setSelectedFilterValue(item)
    }

    const onSubmitFilterValues = () => {
        if (isEmpty(filterTextInputValues) || filterTextInputValues.length == 0) {
            return alert('Please selected all options')
        }
        let slectedValues = []
        filterTextInputValues.map(i => {
            slectedValues.push(i?.attribute)
        })
        console.log(slectedValues, "slectedValuesslectedValuesslectedValues")
        // getAllProductsByCategoryId(1,slectedValues )

    }

    const onChangeFilterText = (text, item) => {
        console.log(text, item, "itemmmmmm<<>>")
        let itemExists = filterTextInputValues.some(i => i?.id == item?.id)
        if (itemExists) {
            let cloneArr = [...filterTextInputValues]
            let filterredArr = cloneArr.filter(i => i?.id != item?.id)
            console.log(filterredArr, "filterredArrfilterredArr")
            let updatedArr = [...filterredArr, { ...item, 'attribute': text }]
            console.log(updatedArr, "updatedArr")
            setFilterTextInputValues(updatedArr)
        } else {
            let cloneArr = [...filterTextInputValues]
            let updatedArr = [...cloneArr, { ...item, 'attribute': text }]
            console.log(updatedArr, 'updatedArrElseeee')
            setFilterTextInputValues(updatedArr)
        }

    }

    return (
        <WrapperContainer>
            <View>
                <Text>hello</Text>
                {true && (electronicConsumptionFilterView())}
            </View>
        </WrapperContainer>
    )
}

export default ProductPowerConumption

const styles = StyleSheet.create({
    filterElctConsumpView:{
        width:width -30,
        alignSelf:'center',
        height:moderateScaleVertical(280),
        backgroundColor:getColorCodeWithOpactiyNumber(colors.greyA.substring(1),60),
        padding:moderateScale(16),
        borderRadius:moderateScale(10)
      }
})