import {FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View} from "react-native";

import {Machine, Task} from "../../api/API";
import React from "react";
import {ListRenderItemInfo} from "@react-native/virtualized-lists/Lists/VirtualizedList";
import {Octicons} from "@expo/vector-icons";

export default function MachineTask({machine}: { machine: Machine }) {

    let editTask = () => {
    }

    return (
        <Pressable onPress={editTask}>
            <View style={styles.container}>
                <Text style={styles.name}>Tasks</Text>
                <View
                    style={{
                        borderBottomColor: 'black',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                    }}
                />
                <Tasks done={false} machine={machine}/>
                <View
                    style={{
                        borderBottomColor: 'black',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                    }}
                />
                <Tasks done={true} machine={machine}/>
            </View>
        </Pressable>
    );
}

function Tasks({done, machine}: { done: boolean, machine: Machine }) {
    let tasks = machine.tasks.filter(task => task.done === done);

    let openTaskDetails = (task: Task) => {
        alert("Task Details Page of task" + task.content)
    }

    let taskRenderer = ({item}: ListRenderItemInfo<Task>) => (
        <TouchableOpacity onPress={() => openTaskDetails(item)}>
            <View style={styles.task}>
                <Octicons style={{paddingRight: 5, alignSelf: "center"}} name="dot-fill" size={16} color="#000"/>
                <Text style={{fontSize: 22}}>{item.content}</Text>
            </View>
        </TouchableOpacity>
    );

    let title = <Text style={styles.subtitle}>{done ? "Done" : "Todo"}</Text>

    if (tasks.length <= 0) {
        return <>{title}<Text style={styles.minor}>None</Text></>;
    }

    return (
        <View style={styles.tasks}>
            {title}
            <FlatList scrollEnabled={false} data={tasks} renderItem={taskRenderer}/>
        </View>
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
        elevation: 6,
        borderRadius: 10,
        backgroundColor: '#fff',
        margin: 10,
        alignSelf: 'center',
    },
    name: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 32,
        textAlign: 'center',
        marginVertical: 10,
        marginHorizontal: 5,
    },
    subtitle: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 24,
        marginVertical: 10,
        marginHorizontal: 5,
    },
    minor: {
        fontSize: 15,
        textAlign: 'center',
        color: 'gray',
    },
    task: {
        flexDirection: 'row',
        marginHorizontal: 10,
        marginVertical: 5,
    },
    tasks: {
        marginHorizontal: 10,
        marginVertical: 5,
    }
});
