import PropTypes from 'prop-types';
import XDate from 'xdate';
import isEmpty from 'lodash/isEmpty';
import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { View, Dimensions } from 'react-native';
// @ts-expect-error
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import constants from '../commons/constants';
import { page, isGTE, isLTE, sameMonth } from '../dateutils';
import { xdateToData, parseDate, toMarkingFormat } from '../interface';
import { getState } from '../day-state-manager';
import { extractHeaderProps, extractDayProps } from '../componentUpdater';
import { useDidUpdate } from '../hooks';
import styleConstructor from './style';
import CalendarHeader from './header';
import Day from './day/index';
import BasicDay from './day/basic';
/**
 * @description: Calendar component
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/calendars.js
 * @gif: https://github.com/wix/react-native-calendars/blob/master/demo/assets/calendar.gif
 */
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const calendarViewWidth  = screenWidth * .88;
const dayWidth = calendarViewWidth/7.0;

const Calendar = (props) => {
    const { initialDate, current, theme, markedDates, minDate, maxDate, allowSelectionOutOfRange, onDayPress, onDayLongPress, onMonthChange, onVisibleMonthsChange, disableMonthChange, enableSwipeMonths, hideExtraDays, firstDay, showSixWeeks, displayLoadingIndicator, customHeader, headerStyle, accessibilityElementsHidden, importantForAccessibility, testID, style: propsStyle } = props;
    const [currentMonth, setCurrentMonth] = useState(current || initialDate ? parseDate(current || initialDate) : new XDate());
    const style = useRef(styleConstructor(theme));
    const header = useRef();
    const weekNumberMarking = useRef({ disabled: true, disableTouchEvent: true });
    useEffect(() => {
        if (initialDate) {
            setCurrentMonth(parseDate(initialDate));
        }
    }, [initialDate]);
    useDidUpdate(() => {
        const _currentMonth = currentMonth.clone();
        onMonthChange?.(xdateToData(_currentMonth));
        onVisibleMonthsChange?.([xdateToData(_currentMonth)]);
    }, [currentMonth]);
    const updateMonth = useCallback((newMonth) => {
        if (sameMonth(newMonth, currentMonth)) {
            return;
        }
        setCurrentMonth(newMonth);
    }, [currentMonth]);
    const addMonth = useCallback((count) => {
        const newMonth = currentMonth.clone().addMonths(count, true);
        updateMonth(newMonth);
    }, [currentMonth, updateMonth]);
    const handleDayInteraction = useCallback((date, interaction) => {
        const day = new XDate(date.dateString);
        if (allowSelectionOutOfRange || !(minDate && !isGTE(day, new XDate(minDate))) && !(maxDate && !isLTE(day, new XDate(maxDate)))) {
            if (!disableMonthChange) {
                updateMonth(day);
            }
            if (interaction) {
                interaction(date);
            }
        }
    }, [minDate, maxDate, allowSelectionOutOfRange, disableMonthChange, updateMonth]);
    const _onDayPress = useCallback((date) => {
        if (date)
            handleDayInteraction(date, onDayPress);
    }, [handleDayInteraction, onDayPress]);
    const onLongPressDay = useCallback((date) => {
        if (date)
            handleDayInteraction(date, onDayLongPress);
    }, [handleDayInteraction, onDayLongPress]);
    const onSwipeLeft = useCallback(() => {
        // @ts-expect-error
        header.current?.onPressRight();
    }, [header]);
    const onSwipeRight = useCallback(() => {
        // @ts-expect-error
        header.current?.onPressLeft();
    }, [header]);
    const onSwipe = useCallback((gestureName) => {
        const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
        switch (gestureName) {
            case SWIPE_UP:
            case SWIPE_DOWN:
                break;
            case SWIPE_LEFT:
                constants.isRTL ? onSwipeRight() : onSwipeLeft();
                break;
            case SWIPE_RIGHT:
                constants.isRTL ? onSwipeLeft() : onSwipeRight();
                break;
        }
    }, [onSwipeLeft, onSwipeRight]);
    const renderWeekNumber = (weekNumber) => {
        console.log("in renderWNum: " + JSON.stringify(weekNumber));
        return (<View style={style.current.dayContainer} key={`week-container-${weekNumber}`}>
        <BasicDay key={`week-${weekNumber}`} marking={weekNumberMarking.current} 
        state='disabled'
        theme={theme} testID={`${testID}.weekNumber_${weekNumber}`} pepe='caca'>
          {weekNumber}
        </BasicDay>
      </View>);
    };
    const renderDay = (day, id) => {
        // console.log("in renderDay: " +day + " " + id);
        const dayProps = extractDayProps(props);
        if (!sameMonth(day, currentMonth) && hideExtraDays) {
            return <View key={id} style={style.current.emptyDayContainer}/>;
        }
        const dateString = toMarkingFormat(day);
        const isControlled = isEmpty(props.context);
        return (<View style={style.current.dayContainer} key={id}>
        <Day {...dayProps} testID={`${testID}.day_${dateString}`} date={dateString} state={getState(day, currentMonth, props, isControlled)} marking={markedDates?.[dateString]} onPress={_onDayPress} onLongPress={onLongPressDay} mood='happy'/>
      </View>);
    };
    const renderWeek = (days, id) => {
        console.log("RenderWeek: " +days + " " + id);
        const week = [];
        days.forEach((day, id2) => {
            week.push(renderDay(day, id2));
        }, this);
        if (props.showWeekNumbers) {
            week.unshift(renderWeekNumber(days[days.length - 1].getWeek()));
        }
        return (<View style={style.current.week} key={id}>
        {week}
      </View>);
    };

    // The view inside this JSX is the line at the bottom of the calendar
    const renderMonth = () => {
        const shouldShowSixWeeks = showSixWeeks && !hideExtraDays;
        const days = page(currentMonth, firstDay, shouldShowSixWeeks);
        const weeks = [];
        while (days.length) {
            weeks.push(renderWeek(days.splice(0, 7), weeks.length));
        }
        return <View style={style.current.monthView}>{weeks}<View style={{borderTopWidth:1}}/>
        <View style={{position:'absolute', top:6, left: dayWidth, height: screenHeight*.65, borderLeftWidth:.5, borderLeftColor: '#333333'}}/>
        <View style={{position:'absolute', top:6, left: 2*dayWidth, height: screenHeight*.65, borderLeftWidth:.5, borderLeftColor: '#333333'}}/>
        <View style={{position:'absolute', top:6, left: 3*dayWidth, height: screenHeight*.65, borderLeftWidth:.5, borderLeftColor: '#333333'}}/>
        <View style={{position:'absolute', top:6, left: 4*dayWidth, height: screenHeight*.65, borderLeftWidth:.5, borderLeftColor: '#333333'}}/>
        <View style={{position:'absolute', top:6, left: 5*dayWidth, height: screenHeight*.65, borderLeftWidth:.5, borderLeftColor: '#333333'}}/>
        <View style={{position:'absolute', top:6, left: 6*dayWidth, height: screenHeight*.65, borderLeftWidth:.5, borderLeftColor: '#333333'}}/>
        </View>;
    };
    const shouldDisplayIndicator = useMemo(() => {
        if (currentMonth) {
            const lastMonthOfDay = toMarkingFormat(currentMonth.clone().addMonths(1, true).setDate(1).addDays(-1));
            if (displayLoadingIndicator && !markedDates?.[lastMonthOfDay]) {
                return true;
            }
        }
        return false;
    }, [currentMonth, displayLoadingIndicator, markedDates]);
    const renderHeader = () => {
        console.log("****** Rendering the header *******");
        const headerProps = extractHeaderProps(props);
        headerProps['monthFormat'] = 'MMM-yyyy';
        
        const ref = customHeader ? undefined : header;
        console.log('ref:' + ref);
        const CustomHeader = customHeader;
        const HeaderComponent = customHeader ? CustomHeader : CalendarHeader;
        console.log('HeaderComponent:' + JSON.stringify( HeaderComponent));
        console.log("header props:" + JSON.stringify(headerStyle));
        return (<HeaderComponent {...headerProps} testID={`${testID}.header`} style={{color:'red'}} ref={ref} month={currentMonth} addMonth={addMonth} displayLoadingIndicator={shouldDisplayIndicator}/>);
    };
    const GestureComponent = enableSwipeMonths ? GestureRecognizer : View;
    const swipeProps = {
        onSwipe: (direction) => onSwipe(direction)
    };
    const gestureProps = enableSwipeMonths ? swipeProps : undefined;
    // Quite , propsStyle del style
    return (<GestureComponent {...gestureProps}>
      <View style={[style.current.container]} testID={testID} accessibilityElementsHidden={accessibilityElementsHidden} // iOS
     importantForAccessibility={importantForAccessibility} // Android
    >
        {renderHeader()}
        {renderMonth()}
      </View>
    </GestureComponent>);
};
export default Calendar;
Calendar.displayName = 'Calendar';
Calendar.propTypes = {
    ...CalendarHeader.propTypes,
    ...Day.propTypes,
    theme: PropTypes.object,
    firstDay: PropTypes.number,
    displayLoadingIndicator: PropTypes.bool,
    showWeekNumbers: PropTypes.bool,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number]),
    current: PropTypes.string,
    initialDate: PropTypes.string,
    minDate: PropTypes.string,
    maxDate: PropTypes.string,
    markedDates: PropTypes.object,
    hideExtraDays: PropTypes.bool,
    showSixWeeks: PropTypes.bool,
    onDayPress: PropTypes.func,
    onDayLongPress: PropTypes.func,
    onMonthChange: PropTypes.func,
    onVisibleMonthsChange: PropTypes.func,
    disableMonthChange: PropTypes.bool,
    enableSwipeMonths: PropTypes.bool,
    disabledByDefault: PropTypes.bool,
    headerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
    customHeader: PropTypes.any,
    allowSelectionOutOfRange: PropTypes.bool
};
