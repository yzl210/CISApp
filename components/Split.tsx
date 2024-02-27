import {StyleSheet, Text, View} from "react-native";
import React from "react";
import {ViewStyle} from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import hairlineWidth = StyleSheet.hairlineWidth;

export default function Split({style, text, fontSize}: { style?: ViewStyle, text?: string, fontSize?: number }) {
    if (!text) {
        return <View
            style={[{
                borderBottomColor: 'black',
                borderBottomWidth: StyleSheet.hairlineWidth,
            }, style]}
        />
    }

    fontSize = fontSize || 32;

    return <View style={[styles.container, style]}>
        <Text style={[styles.text, {fontSize: fontSize}]}>{text}</Text>
    </View>
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 5,
        borderWidth: hairlineWidth,
        borderColor: 'black',
        borderRadius: 10,
        alignSelf: 'center',

    },
    text: {
        textAlign: 'center',
        fontFamily: 'Inter_600SemiBold',
        margin: 5,
    },
});