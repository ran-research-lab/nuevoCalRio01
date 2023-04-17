import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, Pressable} from 'react-native';
import { useNavigation } from '@react-navigation/native';


let l = 'espanol'; 

function LanguageSelector (props) {
    const navigation = useNavigation();

    const [markedDates, setMarkedDates] = useState('');

    function english(){
        l = 'english'
        navigation.navigate('Calendario')
    }

    function espanol(){
        l = 'espanol'
        navigation.navigate('Calendario')//, {key: 'Vengo de espanol', onAdd: props.route.params.onAdd});
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