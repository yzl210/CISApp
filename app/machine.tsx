import {Redirect, Stack, useLocalSearchParams} from "expo-router";
import MachineInfo from "../components/card/MachineInfo";
import MachineTask from "../components/card/MachineTask";
import Split from "../components/Split";
import {Card, ScrollView, Separator, SizableText, Tabs, View, XStack} from "tamagui";
import {Info, ListTodo, ScrollText} from "@tamagui/lucide-icons";
import {getMachine, getMachineTags, getMachineTasks, getTags, getTasks} from "../api/machine";
import Loading from "../components/Loading";
import {useQuery} from "@supabase-cache-helpers/postgrest-react-query";
import TagComponent from "../components/TagComponent";
import React from "react";

export default function MachinePage() {
    const {id} = useLocalSearchParams<{ id: string }>();

    if (!id || id.length < 1) {
        return <Redirect href={"/"}/>;
    }

    const {data: machine, error: machineError} = useQuery(getMachine(id));
    const {data: machineTags} = useQuery(getMachineTags(id));
    const {data: tags} = useQuery(getTags(machineTags ?? []), {
        enabled: !!machineTags
    });

    if (machineError) {
        alert(machineError)
        return null;
    }

    if (!machine) {
        return <LoadingScreen/>
    }


    //let logs = machine.logs.map(log => <MaintenanceLog key={log.id} log={log}/>);


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
                <TasksTab machine_id={id}/>
            </Tabs.Content>
            <Tabs.Content value={"logs"}>
                <ScrollView height={"100%"}>
                    <View gap={"$3"} flexDirection={"row"} flexWrap={"wrap"} justifyContent={"center"}>
                        {/*{logs}*/}
                    </View>
                </ScrollView>
            </Tabs.Content>

        </Tabs>
        <Card>
            {tags && tags.length > 0}
            {tags ? <XStack padding={"$1"} gap={"$2"}>
                {tags.map(tag => <TagComponent tag={tag}/>)}
                {tags.map(tag => <TagComponent tag={tag}/>)}
            </XStack> : null}

        </Card>
    </>;
}

function TasksTab({machine_id}: {machine_id: string}) {
    const {data: machineTasks, error: machineTasksError} = useQuery(getMachineTasks(machine_id));
    const {data: tasks, error: tasksError} = useQuery(getTasks(machineTasks ?? []), {
        enabled: !!machineTasks
    });

    if (!tasks)
        return <Loading/>

    let todoTasks = tasks.filter(task => !task.done_at).map(task => <MachineTask key={task.id} task={task}/>)
    let doneTasks = tasks.filter(task => task.done_at).map(task => <MachineTask key={task.id} task={task}/>)


    return <ScrollView height={"100%"}>
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

    </ScrollView>;
}

function LoadingScreen() {
    return <>
        <Stack.Screen
            options={{
                title: "Loading...",
                headerBackTitle: 'Back',
            }}
        />
        <Loading/>
    </>
}