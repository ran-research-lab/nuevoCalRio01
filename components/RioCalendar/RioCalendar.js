import React, {useState, useEffect} from 'react';
import {Calendar, CalendarList, LocaleConfig} from 'react-native-calendars';
import {Text, View, Box,StyleSheet, Dimensions,TouchableOpacity}  from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Diario from '../Diario/Diary';

const centerX = Dimensions.get("window").width / 2;
const squareSide = Dimensions.get("window").height * 0.202;
const margin = Dimensions.get("window").height * 0.008;
const screenHeight = Dimensions.get("window").height;
const tenPercent = Dimensions.get("window").height * 0.1;
const azulMarino = "#1C7BBA";
const azulAnil = "#5B8EB0";
const verdeAzulado = "#4EB5A2";
const magenta = "#DB8AC0";
const violeta = "#705C87";
const rojo = "#F04B35";
const RioCalendar = (props) => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState('');

  const [markedDates, setMarkedDates] = useState(props.route.params.markedDates); //useState( {'2023-03-17': {selected: true, marked: true} });

  const diaryEntry = {key: 'vacation', color: 'red', selectedDotColor: 'blue'};

  // const [value, setValue] = useState(props.route.params.markedDates); 
 

  // This will launch only if propName value has chaged. 
   
  
  // useEffect(() => { 
  //   setMarkedDates(props.route.params.markedDates); 
  //   console.log("In RioCalendar #1 setting marked dates to: " + JSON.stringify(props.route.params.markedDates));
  // }, [props]); 

  useEffect(() => { 
    console.log("In RioCalendar markedDates dates to: " + JSON.stringify(markedDates));
  }, [markedDates]); 
  
  const addToMarkedDates = (date) => {
    console.log("\t\t\t\tWill add ths date: " + date);
    setMarkedDates({...markedDates, [date]: {selected: false, marked: true, dots: [diaryEntry],moodEmoji: 'otro'}});
  }

  const removeIfExists = (d) => {
    console.log("\t\t\t\tWill remove ths date: " + d);
    if (markedDates.hasOwnProperty(d)) {
      const { [d]: omittedKey, ...newState } = markedDates;
      setMarkedDates(newState);
    }
  }

  return (  
<>
<View style={{marginTop:200}}>
<Calendar
  // Initially visible month. Default = now
  initialDate={'2023-03-01'}
  // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
  minDate={'2023-03-10'}
  // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
  maxDate={'2023-07-30'}
  // Handler which gets executed on day press. Default = undefined
disableArrowLeft={false}
disableArrowRight={false}
  onDayPress={day => {
    console.log(markedDates);
    console.log(props.route.params.markedDates);
    console.log('selected day', day.dateString, day.day, day.month, day.year);
    let tmp = {[day.dateString]:{selected: true, marked: true}};
    // tmp[day.dateString] = {selected: true, marked: true};
    //setMarkedDates({...markedDates, [day.dateString]: {selected: true, marked: true}});
    navigation.navigate('Diario', {day:day.day,month:day.month,year:day.year, dateString:day.dateString, key:'vengo de dia', 
      onGoBack: () => console.log('Will go back from nextComponent'), addToMarkedDates: addToMarkedDates,
      removeIfExists: removeIfExists});

  }}
  // Handler which gets executed on day long press. Default = undefined
  onDayLongPress={day => {
    console.log('selected day', day);
  }}
  // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
  monthFormat={'MMM yyyy'}
  // Handler which gets executed when visible month changes in calendar. Default = undefined
  onMonthChange={month => {
    console.log('month changed', month);
  }}
  // Hide month navigation arrows. Default = false
  // Replace default arrows with custom ones (direction can be 'left' or 'right')
  // Do not show days of other months in month page. Default = false
  hideExtraDays={true}
  // If hideArrows = false and hideExtraDays = false do not switch month when tapping on greyed out
  // day from another month that is visible in calendar page. Default = false
  // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
  firstDay={1}
  // Hide day names. Default = false
  hideDayNames={true}
  // Show week numbers to the left. Default = false
  showWeekNumbers={false}
  // Handler which gets executed when press arrow icon left. It receive a callback can go back month
  onPressArrowLeft={subtractMonth => subtractMonth()}
  // Handler which gets executed when press arrow icon right. It receive a callback can go next month
  onPressArrowRight={addMonth => addMonth()}
  // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
  disableAllTouchEventsForDisabledDays={true}
  // Replace default month and year title with custom one. the function receive a date as parameter
  // Enable the option to swipe between months. Default = false
  enableSwipeMonths={false}
  markingType={'multi-dot'}
  style={{
    borderWidth: 1,
    borderColor: 'gray',
    height: 350
  }}

  theme={{
    backgroundColor: '#ffffff',
    calendarBackground: '#ffffff',
    textSectionTitleColor: '#b6c1cd',
    textSectionTitleDisabledColor: '#d9e1e8',
    selectedDayBackgroundColor: '#ffffff',
    selectedDayTextColor: '#2d4150',
    todayTextColor: '#00adf5',
    dayTextColor: '#2d4150',
    textDisabledColor: '#d9e1e8',
    dotColor: 'blue',
    selectedDotColor: '#ff0000',
    arrowColor: 'blue',
    disabledArrowColor: '#d9e1e8',
    monthTextColor: 'blue',
    indicatorColor: 'blue',
    textDayFontFamily: 'monospace',
    textMonthFontFamily: 'monospace',
    textDayHeaderFontFamily: 'monospace',
    textDayFontWeight: '300',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '300',
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 16
  }}

  markedDates={markedDates}

  // This is for controlling how each date looks.
  // dayComponent={({date, state}) => {
  //   console.log(JSON.stringify(state));   
  //   return (

  // <TouchableOpacity style={[styles.square, styles.rectangle01]} onPress={()=> {
  //   console.log(JSON.stringify(date) );
  //   }
  // }>
  //       <Text style={{zIndex: 1, textAlign: 'center', color: state === 'disabled' ? 'green' : 'black'}}>{date.day}</Text>

  //       </TouchableOpacity>
  //   );
  // }}

/>
</View>
</>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    paddingTop: 100,
    backgroundColor: "black",
    padding: 0,
    position: "relative",
  },
  basicRect: {
    height: tenPercent,
    width: squareSide * 2 + margin,
    zIndex: 99,
    position: "absolute",
  },

  square: {
    height: squareSide/2,
    width: squareSide/3,
    //borderRadius: 5,
    padding: 0,
    marginBottom: -5,
    marginTop:-10,
    zIndex: 0
  },
  rectangle01: {
     borderWidth: 1
  },
  rectangle02: {
    backgroundColor: azulAnil,
    zIndex: 98,
    top: squareSide,
    left: centerX + 0.5 * margin,
  },
  rectangle03: {
    backgroundColor: verdeAzulado,
    zIndex: 98,
    top: squareSide + margin + squareSide,
    left: centerX - (squareSide + 0.5 * margin),
  },
  rectangle04: {
    backgroundColor: rojo,
    zIndex: 98,
    top: squareSide + margin + squareSide,
    left: centerX + 0.5 * margin,
  },
  rectangle05: {
    backgroundColor: violeta,
    zIndex: 98,
    top: 3 * squareSide + 2 * margin,
    left: centerX - (squareSide + 0.5 * margin),
  },
  rectangle06: {
    backgroundColor: magenta,
    zIndex: 98,
    top: 3 * squareSide + 2 * margin,
    left: centerX + 0.5 * margin,
  },

  comoTeSientesText: { fontSize: 24, color: verdeAzulado },
  comoTeSientesView: {
    height: tenPercent,
    width: squareSide * 2 + margin,
    zIndex: 99,
    position: "absolute",
    top: 4 * squareSide + 3 * margin,
    left: centerX - (squareSide + 0.5 * margin),
    justifyContent: "center",
    alignItems: "flex-start",
    borderBottomColor: verdeAzulado,
    borderBottomWidth: 2,
    borderStyle: "solid",
  },
  desarrolladoEnView: {
    top: 4 * squareSide + 3 * margin + tenPercent,
    left: centerX - (squareSide + 0.5 * margin),
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },

  desarrolladoEnText: { fontSize: 7, color: verdeAzulado },
});

export default RioCalendar;
