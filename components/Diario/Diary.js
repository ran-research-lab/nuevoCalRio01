import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image,Keyboard,  TouchableWithoutFeedback,TextInput,Pressable , Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect, useCallback, useContext } from 'react';
// import { Espanol, English } from '../Idioma/Idiomas';
import { useFocusEffect } from '@react-navigation/native';
// import { browserHistory } from 'react-router';
import { Espanol, English } from '../../Idioma/Idiomas';
import rioConstants from '../../constants';
import {db, database} from '../../db';
import {StoreContext} from '../../store/context/store';

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

function Diario( props) {
  const navigation = useNavigation();
  const [text, setText] = useState('');


  const {day} = props.route.params;
  const {month} = props.route.params;
  const {year} = props.route.params;
  const {dateString} = props.route.params;
  const dateDataCtx = useContext(StoreContext); 
  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {

        // Prevent default behavior of leaving the screen
        e.preventDefault();
        console.log("The text: " + text);

        // prevValue = props.route.params.onAnyRows( month + "/" + day + "/" + year) ;
        // console.log("PREV VALUE: "+ prevValue);


        // Poner esto tal que la función de context sea la que llame a la base de datos
        // Si el texto está vacío borrar.
        //if (text.length > 0) {
          dateDataCtx.addDateData({"theDate":dateString, "value": text} );
          database.addOrUpdate(text, month + "/" + day + "/" + year, dateString);
        //}
        //else {
        //  removeDateData({"theDate":dateString});
        //}
        // props.route.params.onAdd(text, month + "/" + day + "/" + year, dateString);
        tmpDate = month + "/" + day + "/" + year;

        // if (text.length > 0)
        //   props.route.params.addToMarkedDates(dateString);
        // else {
        //   props.route.params.removeIfExists(dateString);
        // }
        navigation.dispatch(e.data.action);
      }),
    [text, month, day, year] 
  );

  useEffect(() => {
     props.route.params.onSelectDiaryEntry( month + "/" + day + "/" + year, 
         setText, year + "-" + month.toString().padStart(2, '0') + "-" + day.toString().padStart(2, '0')) ;
  }, []);

  // const formatDate = (dateString) => {
  //   const [month, day, year] = dateString.split('/');
  //   const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  //   return formattedDate;
  // }
  const formatedDate = day.toString().padStart(2, '0')  + '.' + month.toString().padStart(2, '0') + '.' + year % 100;
  const imageSource = require('../../assets/regresar15.png');
  return (
    <>
      <View style={styles.topLine}/>
      <Text style={styles.text}>{Espanol.crisis}</Text>
      <View style={styles.middleLine}/>
      <Text style={styles.number}>{formatedDate}</Text>
      <Text style={styles.dateText}>    D           H         M</Text>
      <View style={styles.bottomLine}/>

      <View >
        <Image
          style={styles.tinyLogo}
          source={require('../../assets/thumbnailTristeza.png')}
        />
        <Text style={[styles.dateArrows, {left:'40%'}]}>{"<"}</Text>
        <Text style={[styles.dateArrows, {left:'85%'}]}>{">"}</Text>
        <Text style={styles.date}>{day}/{month}/{year}</Text>
        <View style={styles.bottomLine2}/>
      </View>

      <DismissKeyboard>
        <View style={styles.container}>
        <Text style={styles.textContainer}>¿Como te sientes hoy?</Text>
        <TextInput
            multiline={true}
            autoCapitalize={'sentences'}
            style={styles.inputText}
            onChangeText={setText}
            value={text}
            textAlignVertical= 'top'
            
        />
        <View style={{ top: rioConstants.screenHeight * .5,left:0, zIndex: 45}}>
        <Pressable onPress={() => { navigation.navigate('Calendario')}} style={{left:  0}}>
          {/* <View style={{top: rioConstants.screenHeight * .5, left:0, zIndex: 45, position: 'absolute', flex: 1, display: 'flex',  alignItems: 'center'}}> */}
          <View>
          <Text style={styles.buttonText}> <Image source={imageSource}   resizeMode = 'center'></Image> Return</Text>
          </View>
        </Pressable>
        </View>

        </View>
      </DismissKeyboard>
    </>
  );
}

export default Diario;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  topLine:{
    borderBottomColor:"black",
    borderBottomWidth: 2.5,
    width: "83%",
    left: "8%",
    top: '10%',
  },
  middleLine:{
    borderBottomColor:"black",
    borderBottomWidth: 2.5,
    width: "35%",
    left: "32%",
    top: '12%',
  },
  bottomLine:{
    borderBottomColor:"black",
    borderBottomWidth: 2.5,
    width: "83%",
    left: "8%",
    top: '12%',
  },
  dateText:{
    fontSize: 9,
    top: "6%",
    left:"69%"
  },
  text: {
    fontSize: 15,
    top: "13%",
    left:"8%"
  },
  number:{
    fontSize: 25,
    top: "10.2%",
    left:"69%"
  },


  tinyLogo: {
    width: 60,
    height: 60,
    top: '200%',
    left: '8%'
  },
  dateArrows:{
    zIndex:1,
    position: 'absolute',
    top: '210%',
    fontWeight:'800',
    fontSize:40,
    color: '#4eb5a3'
  },
  date:{
    zIndex:1,
    position: 'absolute',
    fontSize:15,
    top: '235%',
    left: '57%'
  },
  bottomLine2:{
    zIndex:1,
    position:'absolute',
    borderBottomColor:"black",
    borderBottomWidth: 2.5,
    width: "83%",
    left: "8%",
    top: '320%',
  },

  inputText: {
    top: rioConstants.screenHeight * .05,
    height: rioConstants.screenHeight * .5,
    width: rioConstants.screenWidth * .88,
    left: rioConstants.screenWidth * 0,
    borderWidth: 2,
    borderRadius:5,
    position: 'absolute',
    //padding: 10,
  },
  container: {
    flex: 1,
    marginTop: 145,
    //justifyContent: "center",
    marginLeft: "7%",
    marginRight: 30,
    //alignItems: "center"
  },
  textContainer:{
    fontSize: 20,
    fontWeight:'600',
    left: "1%",
    textAlignVertical: 'top'
  },
  buttonText: {
    fontSize: 18,
    fontWeight:'600',
    left: 0,
    // left: "1%"
    // top: 0,
    // position: 'absolute',
    color: rioConstants.verdeAzulado
  }
});
