import {Redirect, Stack, useLocalSearchParams} from "expo-router";
import {ScrollView, StyleSheet} from "react-native";
import {getMachine} from "../api/API";
import MachineInfo from "../components/box/MachineInfo";
import MachineTasks from "../components/box/MachineTasks";
import MachineTask from "../components/box/MachineTask";
import Split from "../components/Split";
import MaintenanceLog from "../components/box/MaintenanceLog";

export default function Machine() {
    const {id} = useLocalSearchParams<{ id: string }>();

    if (id === undefined || id === "") {
        return <Redirect href={"/"}/>;
    }

    let machine = getMachine(id);

    let todoTasks = machine.tasks.filter(task => !task.done).map(task => <MachineTask task={task}/>)
    let doneTasks = machine.tasks.filter(task => task.done).map(task => <MachineTask task={task}/>)

    let logs = machine.logs.map(log => <MaintenanceLog log={log}/>);

    return <ScrollView>
        <Stack.Screen
            options={{
                title: machine.name,
                headerBackTitle: 'Back',
            }}
        />
        <MachineInfo machine={machine}/>
        <Split style={styles.major_split} text={"Tasks"}/>
        <Split style={styles.minor_split} text={"Todo"} fontSize={24}/>
        {todoTasks}
        <Split style={styles.minor_split} text={"Done"} fontSize={24}/>
        {doneTasks}
        <Split style={styles.major_split} text={"Maintenance Logs"}/>
        {logs}
    </ScrollView>;
}

const styles = StyleSheet.create({
    major_split: {
        width: 400,
        marginTop: 20,
        marginBottom: 10,
    },
    minor_split: {
        width: 380,
        marginTop: 10,
        marginBottom: 5,
    }
});