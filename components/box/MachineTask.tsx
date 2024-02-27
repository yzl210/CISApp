import {Task} from "../../api/API";
import {Pressable, StyleSheet, Text, View} from "react-native";
import React from "react";
import {AntDesign} from "@expo/vector-icons";

export default function MachineTask({task}: { task: Task }) {

    let openTask = () => {
        alert("Task Details Page of task " + task.title)
    }

    let icon = task.done ? <AntDesign style={styles.icon} name={"checkcircle"} size={24} color={"green"}/> :
        <AntDesign style={styles.icon} name={"exclamationcircle"} size={24} color={"red"}/>;

    return (<Pressable onPress={openTask}>
        <View style={styles.container}>
            {icon}
            <View style={styles.rightContainer}>
                <Text numberOfLines={1} style={styles.title}>{task.title}</Text>
                {task.details ? <Text numberOfLines={1} style={styles.details}>{task.details}</Text> : null}
            </View>
        </View>
    </Pressable>);
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
        height: 60,
        elevation: 6,
        borderRadius: 10,
        backgroundColor: '#fff',
        margin: 10,
        alignSelf: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    icon: {
        marginHorizontal: 10,
        alignSelf: 'center',
    },
    rightContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
    title: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 24,
    },
    details: {
        width: 330,
        fontSize: 15,
        color: 'gray',
    }
});
