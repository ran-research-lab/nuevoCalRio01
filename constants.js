import { Dimensions} from 'react-native';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const azulMarino = "#7BBAff";
const azulAnil = "#5B8EB0";
const verdeAzulado = "#4EB5A2";
const magenta = "#DB8AC0";
const violeta = "#705C87";
const rojo = "#F04B35";
const rojo2 = "#FF0000";

const margin = Dimensions.get("window").width * 0.008;
const dayWidth = (Dimensions.get("window").width - margin) / 17.0;
const dayHeight = (Dimensions.get("window").height) / 11.0;

export default {
    azulMarino,
    rojo2,
    azulAnil,
    magenta,
    violeta,
    rojo,
    verdeAzulado,
    screenHeight,
    screenWidth,
    dayWidth,
    dayHeight,
    margin
};