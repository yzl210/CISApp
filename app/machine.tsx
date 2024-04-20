import {Redirect, Stack, useLocalSearchParams} from "expo-router";
import MachineInfo from "../components/card/MachineInfo";
import MachineTask from "../components/card/MachineTask";
import {Card, H2, ScrollView, Separator, SizableText, Tabs, View, XStack, YStack} from "tamagui";
import {Info, LayoutList, ListChecks, ListTodo, ScrollText} from "@tamagui/lucide-icons";
import {getMachineTags, getTags, Machine, useMachine, useTasks} from "../api/machine";
import Loading from "../components/Loading";
import {useQuery} from "@supabase-cache-helpers/postgrest-react-query";
import {useIsLandscape} from "../api/utils";
import React from "react";
import {FlatList} from "react-native";
import {Log} from "../api/API";
import MaintenanceLog from "../components/card/MaintenanceLog";
import MachineTags from "../components/card/tag/MachineTags";

export default function MachinePage() {
    const {id} = useLocalSearchParams<{ id: string }>();

    if (!id || id.length < 1) {
        return <Redirect href={"/"}/>;
    }

    const {machine, machineError} = useMachine(id);
    const isLandscape = useIsLandscape();

    if (machineError) {
        alert(machineError.message);
        return null;
    }

    if (!machine) {
        return <LoadingScreen/>
    }

    if (isLandscape) {
        return <>
            <Stack.Screen
                options={{
                    title: machine.name,
                    headerBackTitle: 'Back',
                }}
            />
            <XStack height={"90%"}>
                <Separator marginHorizontal={"1.25%"} vertical/>
                <Category icon={<Info/>} title={"Information"}>
                    <ScrollView height={"100%"}>
                        <MachineInformation machine={machine}/>

                    </ScrollView>
                </Category>
                <Separator marginHorizontal={"1.25%"} vertical/>
                <Category icon={<ListTodo/>} title={"Tasks"}>
                    <TaskList machine_id={id}/>
                </Category>
                <Separator marginHorizontal={"1.25%"} vertical/>
                <Category icon={<ScrollText/>} title={"Maintenance Logs"}>
                    <LogsTab machine_id={id}/>
                </Category>
                <Separator marginHorizontal={"1.25%"} vertical/>
            </XStack>
        </>
    }


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
                    <MachineInformation machine={machine}/>
                </ScrollView>
            </Tabs.Content>

            <Tabs.Content value={"tasks"}>
                <TaskTab machine_id={id}/>
            </Tabs.Content>
            <Tabs.Content value={"logs"}>
                <LogsTab machine_id={id}/>
            </Tabs.Content>

        </Tabs>
    </>;
}

function MachineInformation({machine}: { machine: Machine }) {
    const {data: machineTags} = useQuery(getMachineTags(machine.id));
    const {data: tags} = useQuery(getTags(machineTags ?? []), {
        enabled: !!machineTags
    });

    if (!tags)
        return <Loading/>

    return <View margin={"$2"} gap={"$2"}>
        <MachineInfo machine={machine}/>
        {tags && tags.length > 0 ? <MachineTags machine={machine} tags={tags}/> : null}
    </View>
}

function Category({icon, title, children}: { icon: React.JSX.Element, title: string, children: React.ReactNode }) {
    return <YStack height={"100%"} width={"30%"} borderRadius={"$10"}>
        <XStack gap={"$2"} padding={"$2"} marginVertical={"$3"} justifyContent={"center"} alignItems={"center"}
                backgroundColor={"white"} borderRadius={"$3"}>
            {icon}
            <H2>{title}</H2>
        </XStack>
        <View height={"100%"} borderRadius={"$5"}>{children}</View>
    </YStack>
}

function TaskList({machine_id}: { machine_id: string }) {
    const {tasks} = useTasks(machine_id);

    if (!tasks)
        return <Loading/>

    let todoTasks = tasks.filter(task => !task.done_at);
    let doneTasks = tasks.filter(task => task.done_at);


    return <>
        <Card height={"50%"}>
            <Card.Header>
                <XStack gap={"$2"} alignItems={"center"}>
                    <LayoutList/>
                    <H2>To Do</H2>
                </XStack>
            </Card.Header>
            <Separator/>
            <FlatList contentContainerStyle={{backgroundColor: "white", padding: 10, gap: 10}}
                      data={todoTasks}
                      renderItem={item => <MachineTask key={item.item.id} task={item.item}/>}
                      keyExtractor={item => item.id}
            />
        </Card>
        <Separator marginVertical={"$2"}/>
        <Card height={"50%"}>
            <Card.Header>
                <XStack gap={"$2"} alignItems={"center"}>
                    <ListChecks/>
                    <H2>Done</H2>
                </XStack>
            </Card.Header>
            <Separator/>
            <FlatList contentContainerStyle={{backgroundColor: "white", padding: 10, gap: 10}}
                      data={todoTasks}
                      renderItem={item => <MachineTask key={item.item.id} task={item.item}/>}
                      keyExtractor={item => item.id}
            />
        </Card>
    </>;
}

function TaskTab({machine_id}: { machine_id: string }) {
    const {tasks, tasksError} = useTasks(machine_id);

    if (tasksError)
        alert(tasksError.message);

    if (!tasks)
        return <Loading/>

    let todoTasks = tasks.filter(task => !task.done_at);
    let doneTasks = tasks.filter(task => task.done_at);


    return <Tabs
        defaultValue={"todos"}
        orientation={"horizontal"}
        flexDirection={"column"}
    >
        <Tabs.List>
            <Tabs.Tab flex={1} value={"todos"} bordered={false}>
                <LayoutList scale={0.7}/>
                <SizableText>To Do</SizableText>
            </Tabs.Tab>
            <Tabs.Tab flex={1} value={"done"} bordered={false}>
                <ListChecks scale={0.7}/>
                <SizableText>Done</SizableText>
            </Tabs.Tab>
        </Tabs.List>

        <Tabs.Content value={"todos"}>
            <FlatList contentContainerStyle={{height: "100%", backgroundColor: "white", padding: 10, gap: 10}}
                      data={todoTasks}
                      renderItem={item => <MachineTask key={item.item.id} task={item.item}/>}
                      keyExtractor={item => item.id}
            />
        </Tabs.Content>

        <Tabs.Content value={"done"}>
            <FlatList contentContainerStyle={{height: "100%", backgroundColor: "white", padding: 10, gap: 10}}
                      data={doneTasks}
                      renderItem={item => <MachineTask key={item.item.id} task={item.item}/>}
                      keyExtractor={item => item.id}
            />
        </Tabs.Content>
    </Tabs>
}

function LogsTab({machine_id}: { machine_id: string }) {
    let log: Log = {
        id: "1",
        author: "Somebody",
        time: Date.now(),
        title: "Machine maintained",
        content: "Machine was maintained and cleaned, all parts are in good condition, no need for replacement, machine is ready for use, all tasks are done, machine is ready for use.",
        changes: []

    }

    return <View height={"100%"}>
        <FlatList data={[log]} renderItem={item => <MaintenanceLog log={item.item}/>} keyExtractor={item => item.id}/>
    </View>
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