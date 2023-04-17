import { StyleSheet, Dimensions } from 'react-native';
import * as defaultStyle from '../../../style';
import constants from '../../../commons/constants';


const margin = Dimensions.get("window").width * 0.008;
const dayWidth = (Dimensions.get("window").width - margin) / 17.0;
const dayHeight = (Dimensions.get("window").height) / 9.0;
// const squareSide = (Dimensions.get("window").height - margin) / 7.0;


export default function styleConstructor(theme = {}) {
    const appStyle = { ...defaultStyle, ...theme };
    return StyleSheet.create({
        container: {
            alignSelf: 'stretch',
            alignItems: 'center'
        },
        base: {
            width: dayWidth, //32 * 1.7 ,
            height: dayHeight, //32 * 2.5,
            // borderRightWidth: 1,
            alignItems: 'center',
            // marginTop: -12,

        },
        text: {
            marginTop: constants.isAndroid ? 4 : 6,
            fontSize: appStyle.textDayFontSize,
            fontFamily: appStyle.textDayFontFamily,
            fontWeight: appStyle.textDayFontWeight,
            color: appStyle.dayTextColor,
            backgroundColor: 'rgba(255, 255, 255, 0)',
            ...appStyle.textDayStyle
        },
        alignedText: {
            marginTop: constants.isAndroid ? 4 : 6
        },
        selected: {
            backgroundColor: appStyle.selectedDayBackgroundColor,
            borderRadius: 16
        },
        today: {
            backgroundColor: appStyle.todayBackgroundColor,
            borderRadius: 16
        },
        todayText: {
            color: appStyle.todayTextColor
        },
        selectedText: {
            color: appStyle.selectedDayTextColor
        },
        disabledText: {
            color: appStyle.textDisabledColor
        },
        inactiveText: {
            color: appStyle.textInactiveColor
        },
        dot: {
            width: 4,
            height: 4,
            marginTop: 1,
            borderRadius: 2,
            opacity: 0,
            ...appStyle.dotStyle
        },
        visibleDot: {
            opacity: 1,
            backgroundColor: appStyle.dotColor
        },
        selectedDot: {
            backgroundColor: appStyle.selectedDotColor
        },
        disabledDot: {
            backgroundColor: appStyle.disabledDotColor || appStyle.dotColor
        },
        todayDot: {
            backgroundColor: appStyle.todayDotColor || appStyle.dotColor
        },
        // @ts-expect-error
        ...(theme['stylesheet.day.basic'] || {})
    });
}
