import {Image, Pressable, StyleSheet, Text, View} from "react-native";

import {Machine} from "../../api/API";
import React from "react";

export default function MachineInfo({machine}: { machine: Machine }) {

    let editMachine = () => {
    }

    return (
        <Pressable onPress={editMachine}>
            <View style={styles.container}>
                <Text style={styles.name}>{machine.name}</Text>
                <Text style={styles.minor}>{machine.id}</Text>
                <Image source={{uri: machine.image}} style={styles.image}/>
                <View
                    style={{
                        borderBottomColor: 'black',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                    }}
                />
                <Text style={styles.description}>{machine.description}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        width: 380,
        height: 380,
        elevation: 6,
        borderRadius: 10,
        backgroundColor: '#fff',
        margin: 10,
        alignSelf: 'center',
    },
    topContainer: {
        width: '100%',
        height: '50%',
        flexDirection: 'row',
    },
    infoContainer: {
        width: '50%',
        height: '100%',
        justifyContent: 'center',
    },
    name: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 32,
        textAlign: 'center',
        marginVertical: 10,
        marginHorizontal: 5,
    },
    minor: {
        fontSize: 15,
        textAlign: 'center',
        color: 'gray',
    },
    image: {
        width: '50%',
        height: '50%',
        borderRadius: 18,
        alignSelf: 'center',
    },
    description: {
        marginTop: 5,
        fontSize: 18,
        textAlign: 'center',
        color: 'gray',
    }
});
