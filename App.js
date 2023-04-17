import React, {useState, useEffect} from 'react';
import {Calendar, CalendarList, LocaleConfig} from 'react-native-calendars';
import {Text, View, Box,StyleSheet, Dimensions,TouchableOpacity}  from 'react-native';
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import LanguageSelector from './Idioma/LanguageSelector';
import RioCalendar from './components/RioCalendar/RioCalendar';
import * as SQLite from "expo-sqlite";
import Diario from './components/Diario/Diary';
const diaryTableName = "diario";


function openDatabase() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }

  const db = SQLite.openDatabase("db16.db");
  return db;
}
export const db = openDatabase();

const diaryEntry = {key: 'vacation', color: 'red', selectedDotColor: 'blue'};
const massage = {key: 'massage', color: 'blue', selectedDotColor: 'blue'};
const workout = {key: 'workout', color: 'green'};


const Stack = createNativeStackNavigator();

const App = () => {
  const [selected, setSelected] = useState('');
  const [markedDates, setMarkedDates] = useState( {});


  const formatDate = (dateString) => {
    const [month, day, year] = dateString.split('/');
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    return formattedDate;
  }

  useEffect(() => { 

    console.log("In App.js  setting marked dates to: " +  JSON.stringify(markedDates));
  }, [markedDates]); 

  useEffect(() => {



    // db.transaction((tx) => {
    //   tx.executeSql(
    //     "drop table if exists " + diaryTableName + ";" , [],
    //     (txObj, resultSet) => console.log("ok, dropped the table."),
    //     (txObj, error) => console.log('Error', error)
    //   );
    // });


    console.log("creating table....");
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists " + diaryTableName + " (id integer primary key not null,  theDate DATE, done int, value text);", 
        [],
        (txObj, resultSet) => console.log("ok, created the table"),
        (txObj, error) => console.log('Error', error)
      );
    });
  
    console.log("reading the available data to create calendarData....");
      db.transaction((tx) => {
        tx.executeSql("select theDate from " + diaryTableName + ";", [], (_, { rows }) => {
          console.log("the existing rows:" + JSON.stringify(rows['_array']));
          tmp = {    '2023-03-25': {dots: [diaryEntry, massage, workout], marked: true, selected: true, moodEmoji: 'algo'},
          '2023-03-26': {dots: [massage, workout], disabled: true}};
          // tmp = {}
          rows['_array'].forEach((e) => {
            console.log(e.theDate);
            tmp[formatDate(e.theDate)] = {selected: false, marked: true, dots: [diaryEntry], moodEmoji: 'otro'};
          });
          setMarkedDates(tmp);
        },
        (txObj, error) => console.log('Error', error)
      );
    });


    // console.log("inserting???");
    // db.transaction(tx => {
      
    //   tx.executeSql('INSERT INTO ' + diaryTableName + ' (value, done, theDate) values (?, ?, ?)', ['gibberish', 0, '12/12/2012'],
    //     (txObj, resultSet) => console.log("ok, inserted trash into table"),
    //     (txObj, error) => console.log('Error', error))
    // });
  
  }, []);


  const add = (text, date, dateString) => {
    // is text empty?
    if (text === null || text === "") {
      return false;
    }
    console.log("inserting for date: " + date);
    db.transaction(
      (tx) => {
        tx.executeSql("insert into " +  diaryTableName + " (done, value, theDate) values (0, ?, ?)", [text,date],
        (txObj, resultSet) => { 
          console.log("\t ===(ADD)====> ok, inserted into the table for date: " + date);
 
          setMarkedDates({...markedDates, [dateString]: {selected: true, marked: true, moodEmoji: 'otro'}});
        },
        (txObj, error) => console.log('Error', error));

        tx.executeSql("select * from " + diaryTableName + ";", [], (_, { rows }) =>
          console.log(JSON.stringify(rows)),
          (txObj, error) => console.log('Error', error)
        );
      },
      null,
      null // forceUpdate
    );
  };

  const update = (text, date, dateString) => {

    console.log("UPDATNG for date: " + date);
    db.transaction(
      (tx) => {
        tx.executeSql("update " +  diaryTableName + " set value = ? where theDate = ? ", [text,date],
        (txObj, resultSet) => console.log("ok, Updated the table"),
        (txObj, error) => console.log('Error', error));

        tx.executeSql("select * from " + diaryTableName + ";", [], (_, { rows }) =>
          console.log(JSON.stringify(rows)),
          (txObj, error) => console.log('Error', error)
        );
      },
      null,
      null // forceUpdate
    );
  };



  //DELETE FROM table_name WHERE condition;

  const remove = (date, dateString) => {

    console.log("DELETE for date: " + date);
    db.transaction(
      (tx) => {
        tx.executeSql("delete from " +  diaryTableName + " where theDate = ? ", [date],
        (txObj, resultSet) => { 
          console.log("ok, Removed...");
          const { [dateString]: omittedKey, ...newState } = markedDates;
          setMarkedDates(newState);
        },
        (txObj, error) => console.log('Error', error));

        tx.executeSql("select * from " + diaryTableName + ";", [], (_, { rows }) =>
          console.log(JSON.stringify(rows)),
          (txObj, error) => console.log('Error', error)
        );
      },
      null,
      null // forceUpdate
    );
  };

  const addOrUpdate = (text, date, dateString) => {
    console.log("inserting or updatng for date: " + date);

    db.transaction(
      (tx) => {
        tx.executeSql("select * from " + diaryTableName + " where theDate = ?;", [date], (_, { rows }) =>
          { console.log('has rows: ' + rows.length); 
            if (rows.length == 0) { 
              console.log("\t\tCalling add: " + text + " " + date);
              add(text, date,dateString);
            }
            else {
              if (text.length > 0) update(text, date, dateString);
              else remove(date, dateString);
            }
          } ,
          (txObj, error) => console.log('Error', error)
        );
      },
      null,
      null // forceUpdate
    );
  };

  const selectDiaryEntry = (date, setText) => {
    // is text empty?

    console.log("getting for date: " + date);
    db.transaction(
      (tx) => {
        tx.executeSql("select * from " + diaryTableName + " where theDate = ?;", [date], (_, { rows }) =>
          { console.log(rows.length); if (rows.length > 0) setText(rows['_array'][0]['value']);  } ,
          (txObj, error) => console.log('Error', error)
        );
      },
      null,
      null // forceUpdate
    );
  };

  const anyRows = (date) => {
    // is text empty?

    console.log("getting for date: " + date);
    db.transaction(
      (tx) => {
        tx.executeSql("select * from " + diaryTableName + " where theDate = ?;", [date], (_, { rows }) =>
          { console.log('has rows: ' + rows.length); return (rows.length > 0)  } ,
          (txObj, error) => console.log('Error', error)
        );
      },
      null,
      null // forceUpdate
    );
  };





  return (
<>
<NavigationContainer >

<Stack.Navigator >

    <Stack.Screen
      name='Language'
      component={LanguageSelector}
      independent ={true}
      // initialParams={markedDates}
      options={{
        headerTitle: "",
        headerShown: false,
      }}
    />

    <Stack.Screen
      name='Calendario'
      component={RioCalendar}
      independent ={true}
      initialParams={{'markedDates':markedDates}}
      options={{
        headerTitle: "",
        headerShown: false,
      }}
    />
    
      <Stack.Screen
        name='Diario'
        component={Diario}
        initialParams={{ onAdd: addOrUpdate, 'onSelectDiaryEntry': selectDiaryEntry, 'onAnyRows': anyRows}}
        options={{
          headerTitle: "",
          headerShown: false,
        }}
      />
      </Stack.Navigator>

    </NavigationContainer>
</>
  );
};


export default App;
