import React, {useState, useEffect, useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import LanguageSelector from './Idioma/LanguageSelector';
import RioCalendar from './components/RioCalendar/RioCalendar';
import Diario from './components/Diario/Diary';
import StoreContextProvider from './store/context/store';

// import * as SplashScreen from 'expo-splash-screen';

import store, { persistor } from './redux/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

const Stack = createNativeStackNavigator();

const App = () => {


  const [selected, setSelected] = useState('');
  const [markedDates, setMarkedDates] = useState( {});



  const formatDate = (dateString) => {
    const [month, day, year] = dateString.split('/');
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    return formattedDate;
  }

  return (
< >
<Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
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
      initialParams={{'markedDates':markedDates}}
      options={{
        headerTitle: "",
        headerShown: false,
      }}
    />
    
      <Stack.Screen
        name='Diario'
        component={Diario}
        initialParams={{   }}
        options={{
          headerTitle: "",
          headerShown: false,
        }}
      />
      </Stack.Navigator>

    </NavigationContainer>
    </StoreContextProvider>
    </PersistGate>
    </Provider>
    </>
  );

};


export default App;
