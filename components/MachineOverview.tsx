import {FlatList, Image, StyleSheet, Text, TouchableWithoutFeedback, View} from "react-native";

import {getMachine, Task} from "../api/API";
import {Octicons} from '@expo/vector-icons';
import {ListRenderItemInfo} from "@react-native/virtualized-lists/Lists/VirtualizedList";
import {Link} from "expo-router";

export default function MachineOverview({id}: { id: string }) {
    let machine = getMachine(id);
    let done = machine.tasks.filter(task => task.done).length + "/" + machine.tasks.length;

    let tasks = machine.tasks.filter(task => !task.done);

    let taskRenderer = ({item}: ListRenderItemInfo<Task>) => (
        <TouchableWithoutFeedback>
            <View style={styles.task}>
                <Octicons style={{paddingRight: 5}} name="dot-fill" size={16} color="#000"/>
                <Text>{item.name}</Text>
            </View>
        </TouchableWithoutFeedback>
    );

    let openMachine = () => {

    }

    return (
        <Link href={"/machine/" + machine.id}>
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <View style={styles.infoContainer}>
                        <Text style={styles.name}>{machine.name}</Text>
                    </View>
                    <Image source={{uri: machine.image}} style={styles.image}/>
                </View>
                <Text style={styles.todos}>Tasks: {done}</Text>
                <FlatList scrollEnabled={true} style={styles.taskList} data={tasks} renderItem={taskRenderer}/>
            </View>
        </Link>
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

        elevation: 6,
        borderRadius: 10,
        width: 240,
        height: 240,
        backgroundColor: '#fff',
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
        fontSize: 24,
        textAlign: 'center',
    },
    todos: {
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
    taskList: {
        margin: 10,
    },
    task: {
        marginLeft: 15,
        margin: 5,
        flexDirection: 'row',
    }
});
