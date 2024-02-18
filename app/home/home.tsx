import {StyleSheet} from 'react-native';
import HomeScreen from "../../screens/HomeScreen";
import React from "react";
import {Inter_600SemiBold, useFonts} from "@expo-google-fonts/inter";

export default function App() {
    let [fontsLoaded] = useFonts({
        Inter_600SemiBold,
    });

    if (!fontsLoaded) {
        return null;
    }
    return (
        <HomeScreen/>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
