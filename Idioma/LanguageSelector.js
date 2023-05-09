import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, Pressable} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {  useSelector, useDispatch } from 'react-redux'; 

import { register } from '../redux/slices/counterSlice';

let l = 'espanol'; 

function LanguageSelector (props) {
    const navigation = useNavigation();

    const [markedDates, setMarkedDates] = useState('');

    const dispatch = useDispatch(); 

 



    function english(){
        l = 'english'
        dispatch(register());
        navigation.navigate('Calendario')
    }

    function espanol(){
        l = 'espanol'
        dispatch(register());
        navigation.replace("Calendario");
        navigation.navigate('Calendario')//, {key: 'Vengo de espanol', onAdd: props.route.params.onAdd});
    }

    if ( useSelector(state => state.counter.registered? true: false )) {
      console.log("User is registered ----> to calendar we go... <=======================")
      navigation.navigate('Calendario');
    }

    return (
        <View
          style={styles.container}>
          <Text>Porfavor elija un idioma/</Text>
          <Text>Please choose a Language:</Text>

          <Pressable
            style={[
                {
                    backgroundColor:'blue',
                },
                styles.button,
                ]}
            onPress={espanol}>
            <Text style={styles.buttonText}>Español</Text>
          </Pressable>

          <Pressable
            style={[
            {
                backgroundColor:'red',
            },
            styles.button,
            ]}
            onPress={english}>
            <Text style={styles.buttonText}>English</Text>
          </Pressable>
        </View>
      );
}

export default LanguageSelector;
export const language = l;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    button: {
        marginTop: 10,
        borderRadius: 8,
        padding: 6,
        height: 50,
        width: '70%',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        //backgroundColor: 'blue'
      },
      buttonText: {
        fontSize: 16,
        color: 'white',
      },
})