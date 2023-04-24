import React, {useState, useEffect, useContext} from 'react';
import {Calendar, CalendarList, LocaleConfig} from 'react-native-calendars';
import {Text, View, Box,StyleSheet, Dimensions,TouchableOpacity}  from 'react-native';
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import LanguageSelector from './Idioma/LanguageSelector';
import RioCalendar from './components/RioCalendar/RioCalendar';
import * as SQLite from "expo-sqlite";
import Diario from './components/Diario/Diary';
import StoreContextProvider from './store/context/store';
const diaryTableName = "diario";
import {StoreContext} from './store/context/store';
// import rioConstants from './constants';
import {db, database} from './db';

import * as SplashScreen from 'expo-splash-screen';
import useDatabaseLoader from './useDatabase';


// const isLoadingComplete = useCachedResources();

// function openDatabase() {
//   if (Platform.OS === "web") {
//     return {
//       transaction: () => {
//         return {
//           executeSql: () => {},
//         };
//       },
//     };
//   }

//   const db = SQLite.openDatabase("db16.db");
//   return db;
// }
// export const db = openDatabase();

const diaryEntry = {key: 'vacation', color: 'red', selectedDotColor: 'blue'};
const massage = {key: 'massage', color: 'blue', selectedDotColor: 'blue'};
const workout = {key: 'workout', color: 'green'};


const Stack = createNativeStackNavigator();

const App = () => {
  // SplashScreen.preventAutoHideAsync();

  const isDBLoadingComplete = useDatabaseLoader();

  const [selected, setSelected] = useState('');
  const [markedDates, setMarkedDates] = useState( {});

  const dateDataCtx = useContext(StoreContext); 
  // dateDataCtx.select(db);

  const formatDate = (dateString) => {
    const [month, day, year] = dateString.split('/');
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    return formattedDate;
  }

  useEffect(() => { 

    console.log("In App.js  setting marked dates to: " +  JSON.stringify(markedDates));
    console.log("datedata: " + dateDataCtx.dateData);
  }, [markedDates]); 

  useEffect(() => {






    // console.log("creating table....");
    // database.createTable(() => console.log("\t\tSuccesull creation..."));

    // console.log("reading the available data to create calendarData....");
    // database.select(setMarkedDates);
    // database.select(dateDataCtx.addDateData);
    
  
  }, []);


  const tmpd = isDBLoadingComplete
  if (tmpd) {
    console.log('got the date data in App.js: ' + tmpd );
    // dateDataCtx.addDateData(tmpd);
  return (
< >
<StoreContextProvider>
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
      initialParams={{'markedDates':markedDates, contextDateData: tmpd}}
      options={{
        headerTitle: "",
        headerShown: false,
      }}
    />
    
      <Stack.Screen
        name='Diario'
        component={Diario}
        initialParams={{ onAdd: database.addOrUpdate, 'onSelectDiaryEntry': database.selectDiaryEntry, 'onAnyRows': database.anyRows}}
        options={{
          headerTitle: "",
          headerShown: false,
        }}
      />
      </Stack.Navigator>

    </NavigationContainer>
    </StoreContextProvider>
    </>
  );
      } else {return null;}
};


export default App;
