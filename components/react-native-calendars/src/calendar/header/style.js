//
// Styles for the calendar "HEADER"
//

import { StyleSheet, Platform, Dimensions } from 'react-native';
import * as defaultStyle from '../../style';
import constants from '../../commons/constants';
import rioConstants from '../../../../../constants';

const topForMonth = constants.screenHeight * .70;

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
            color: rioConstants.verdeAzulado, //appStyle.monthTextColor,
            // marginLeft: 60,
            // marginRight: 60,
            left:constants.screenWidth*(.44-.35),
            width: constants.screenWidth * .88 *.7    ,
            textAlign: 'center',
            zIndex: 0,
            // color: 'red',
            // borderWidth: 1,
            // position:'absolute'
            
        },
        arrow: {
            // padding: 10,
            ...appStyle.arrowStyle
        },
        arrowImage: {
            zIndex: 100,
            
            ...rtlStyle,
            tintColor: rioConstants.verdeAzulado,//appStyle.arrowColor,
            ...Platform.select({
                web: {
                    width: appStyle.arrowWidth,
                    height: appStyle.arrowHeight
                }
            }),
            // resizeMode: 'center'
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
