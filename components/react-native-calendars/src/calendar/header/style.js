//
// Styles for the calendar "HEADER"
//

import { StyleSheet, Platform, Dimensions } from 'react-native';
import * as defaultStyle from '../../style';
import constants from '../../commons/constants';


const topForMonth = Dimensions.get("window").height * .70;
const screenWidth = Dimensions.get("window").width;

export default function (theme = {}) {
    const appStyle = { ...defaultStyle, ...theme };
    const rtlStyle = constants.isRTL ? { transform: [{ scaleX: -1 }] } : undefined;
    return StyleSheet.create({
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            // paddingLeft: 10,
            // paddingRight: 10,
            // marginTop: 6,
            top:topForMonth,
            position: 'absolute',
            alignItems: 'center',
        },
        partialHeader: {
            paddingHorizontal: 15
        },
        headerContainer: {
            flexDirection: 'row'
        },
        monthText: {
            fontSize: 30,//appStyle.textMonthFontSize,
            // fontFamily: appStyle.textMonthFontFamily,
            // fontWeight: appStyle.textMonthFontWeight,
            color: appStyle.monthTextColor,
            // marginLeft: 60,
            // marginRight: 60,
            left:0,
            width: screenWidth *.88,
            textAlign: 'center',
            zIndex: -10
            // color: 'red',
            // borderWidth: 1
            
        },
        arrow: {
            // padding: 10,
            ...appStyle.arrowStyle
        },
        arrowImage: {
            zIndex: 1,
            ...rtlStyle,
            tintColor: 'red',//appStyle.arrowColor,
            ...Platform.select({
                web: {
                    width: appStyle.arrowWidth,
                    height: appStyle.arrowHeight
                }
            })
        },
        disabledArrowImage: {
            ...rtlStyle,
            tintColor: appStyle.disabledArrowColor
        },
        week: {
            marginTop: 7,
            flexDirection: 'row',
            justifyContent: 'space-around',
        },
        partialWeek: {
            paddingRight: 0
        },
        dayHeader: {
            marginTop: 2,
            marginBottom: 7,
            width: 32,
            textAlign: 'center',
            fontSize: appStyle.textDayHeaderFontSize,
            fontFamily: appStyle.textDayHeaderFontFamily,
            fontWeight: appStyle.textDayHeaderFontWeight,
            color: appStyle.textSectionTitleColor
        },
        disabledDayHeader: {
            color: appStyle.textSectionTitleDisabledColor
        },
        // @ts-expect-error
        ...(theme['stylesheet.calendar.header'] || {})
    });
}
