import {Redirect, Stack, useLocalSearchParams} from "expo-router";
import {StyleSheet} from "react-native";
import {getMachine} from "../api/API";
import MachineInfo from "../components/card/MachineInfo";
import MachineTask from "../components/card/MachineTask";
import Split from "../components/Split";
import MaintenanceLog from "../components/card/MaintenanceLog";
import {ScrollView, SizableText, Tabs, View} from "tamagui";
import {Info, ListTodo, ScrollText} from "@tamagui/lucide-icons";
import {useState} from "react";

export default function Machine() {
    const {id} = useLocalSearchParams<{ id: string }>();
    const [machine, setMachine] = useState(null)

    if (id === undefined || id === "") {
        return <Redirect href={"/"}/>;
    }

    if (machine === null) {
        getMachine(id).then((machine) => {

        })
        return null;
    }

    let machine = getMachine(id);

    let todoTasks = machine.tasks.filter(task => !task.done).map(task => <MachineTask key={task.id} task={task}/>)
    let doneTasks = machine.tasks.filter(task => task.done).map(task => <MachineTask key={task.id} task={task}/>)

    let logs = machine.logs.map(log => <MaintenanceLog key={log.id} log={log}/>);

    return <>
        <Stack.Screen
            options={{
                title: machine.name,
                headerBackTitle: 'Back',
            }}
        />
        <Tabs
            defaultValue={"info"}
            orientation={"horizontal"}
            flexDirection={"column"}
        >
            <Tabs.List>
                <Tabs.Tab flex={1} value={"info"} bordered={false}>
                    <Info scale={0.7}/>
                    <SizableText>Info</SizableText>
                </Tabs.Tab>
                <Tabs.Tab flex={1} value={"tasks"} bordered={false}>
                    <ListTodo scale={0.7}/>
                    <SizableText>Tasks</SizableText>
                </Tabs.Tab>
                <Tabs.Tab flex={1} value={"logs"} bordered={false}>
                    <ScrollText scale={0.7}/>
                    <SizableText>Logs</SizableText>
                </Tabs.Tab>
            </Tabs.List>

            <Tabs.Content value={"info"}>
                <ScrollView height={"100%"}>
                    <MachineInfo machine={machine}/>
                </ScrollView>
            </Tabs.Content>

            <Tabs.Content value={"tasks"}>
                <ScrollView height={"100%"}>
                    {todoTasks.length > 0 ? <Split text={"To Do"}/> : null}
                    {todoTasks.length > 0 ?
                        <View gap={"$3"} flexDirection={"row"} flexWrap={"wrap"} justifyContent={"center"}>
                            {todoTasks}
                        </View> : null}
                    {doneTasks.length > 0 ? <Split text={"Done"}/> : null}
                    {doneTasks.length > 0 ?
                        <View gap={"$3"} flexDirection={"row"} flexWrap={"wrap"} justifyContent={"center"}>
                            {doneTasks}
                        </View> : null}

                </ScrollView>
            </Tabs.Content>
            <Tabs.Content value={"logs"}>
                <ScrollView height={"100%"}>
                    <View gap={"$3"} flexDirection={"row"} flexWrap={"wrap"} justifyContent={"center"}>
                        {logs}
                    </View>
                </ScrollView>
            </Tabs.Content>

        </Tabs>
    </>;
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