import {Pressable, StyleSheet, Text, View} from "react-native";
import React from "react";

export default function Button({label, theme, icon, onPress}: Button) {
    if (theme === 'primary') {
        return (
            <View style={[styles.buttonContainer, {borderWidth: 4, borderColor: "#ffd33d", borderRadius: 18}]}>
                <Pressable
                    style={[styles.button, {backgroundColor: "#fff"}]}
                    onPress={onPress}>
                    {icon}
                    <Text style={[styles.buttonLabel, {color: "#25292e"}]}>{label}</Text>
                </Pressable>
            </View>
        );
    }

    if (theme === 'danger') {
        return (
            <View style={[styles.buttonContainer, {borderWidth: 4, borderColor: "#ff4d4d", borderRadius: 18}]}>
                <Pressable
                    style={[styles.button, {backgroundColor: "#fff"}]}
                    onPress={onPress}>
                    {icon}
                    <Text style={[styles.buttonLabel, {color: "#25292e"}]}>{label}</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={onPress}>
                <Text style={styles.buttonLabel}>{label}</Text>
            </Pressable>
        </View>
    );
}

interface Button {
    label: string;
    theme?: 'primary' | 'danger' | null;
    icon?: React.JSX.Element;
    onPress?: () => void;
}


const styles = StyleSheet.create({
    buttonContainer: {
        width: 320,
        height: 68,
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
    },
    button: {
        borderRadius: 10,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    buttonIcon: {
        paddingRight: 8,
    },
    buttonLabel: {
        color: '#fff',
        fontSize: 16,
    },
});