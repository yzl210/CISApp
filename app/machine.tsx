import {Redirect, Stack, useLocalSearchParams} from "expo-router";
import MachineInfo from "../components/machine/MachineInfo";
import TaskOverview from "../components/task/TaskOverview";
import {Accordion, Button, H2, ScrollView, Separator, SizableText, Square, Tabs, View, XStack, YStack} from "tamagui";
import {ChevronDown, Info, LayoutList, List, ListChecks, ListTodo, Plus, ScrollText} from "@tamagui/lucide-icons";
import {getMachineTags, getTags, Machine, useMachine} from "../api/machine";
import Loading from "../components/Loading";
import {useQuery} from "@supabase-cache-helpers/postgrest-react-query";
import {useIsLandscape} from "../api/utils";
import React from "react";
import {Dimensions, FlatList, Pressable} from "react-native";
import {Log, useRole} from "../api/API";
import MaintenanceLog from "../components/log/MaintenanceLog";
import MachineTags from "../components/tag/MachineTags";
import {canEditTags, canEditTasks} from "../api/users";
import MachineDescription from "../components/machine/MachineDescription";
import TaskDetailsDialog from "../components/task/TaskDetailsDialog";
import TaskEditDialog from "../components/task/TaskEditDialog";
import TaskTemplatesDialog from "../components/task/TaskTemplatesDialog";
import {Task, useTasks} from "../api/tasks";
import {useSafeAreaInsets} from "react-native-safe-area-context";

export default function MachinePage() {
    const {id} = useLocalSearchParams<{ id: string }>();

    if (!id || id.length < 1) {
        return <Redirect href={"/"}/>;
    }

    const {machine, machineError} = useMachine(id);
    const isLandscape = useIsLandscape();
    const {bottom, left, right} = useSafeAreaInsets();
    const {role: role} = useRole();

    if (machineError) {
        alert(machineError.message);
        return null;
    }

    if (!machine || !role) {
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
            height={"100%"}
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

            <Tabs.Content value={"tasks"} height={"95%"}>
                <TaskTab machine_id={id}/>
                {canEditTasks(role) ? <>
                    <TaskTemplatesDialog machine_id={machine.id}>
                        <Button bordered left={left + 10} bottom={bottom + 10} position={"absolute"} icon={List}/>
                    </TaskTemplatesDialog>
                    <TaskEditDialog machine_id={machine.id} create>
                        <Button bordered right={right + 10} bottom={bottom + 10} position={"absolute"} icon={Plus}/>
                    </TaskEditDialog>
                </> : null}
            </Tabs.Content>
            <Tabs.Content value={"logs"}>
                <LogsTab machine_id={id}/>
            </Tabs.Content>
        </Tabs>
    </>;
}

function MachineInformation({machine}: { machine: Machine }) {
    const {role} = useRole();
    const {data: machineTags} = useQuery(getMachineTags(machine.id));
    const {data: tags} = useQuery(getTags(machineTags ?? []), {
        enabled: !!machineTags
    });

    if (!tags || !role)
        return <Loading/>

    return <View margin={"$2"} gap={"$2"}>
        <MachineInfo machine={machine}/>
        {(tags && tags.length > 0) || canEditTags(role) ? <MachineTags machine={machine} tags={tags}/> : null}
        <MachineDescription machine={machine}/>
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
    const {role: role} = useRole();
    let height = Dimensions.get('window').height;
    height *= 0.6;

    if (!tasks || !role)
        return <Loading/>

    let todoTasks = tasks.filter(task => !task.completed_at);
    let doneTasks = tasks.filter(task => task.completed_at);

    return (
        <Accordion type={"single"} defaultValue={"todo"} collapsible>
            <Accordion.Item value={"todo"}>
                {canEditTasks(role) ?
                    <XStack gap={"$3"} position={"absolute"} right={"$4"} top={"$3.5"} zIndex={1}>
                        <TaskTemplatesDialog machine_id={machine_id}>
                            <Button bordered icon={List}/>
                        </TaskTemplatesDialog>
                        <TaskEditDialog machine_id={machine_id} create>
                            <Button bordered icon={Plus}/>
                        </TaskEditDialog>
                    </XStack> : null}
                <Accordion.Trigger flexDirection="row" justifyContent="space-between">
                    {({open}: { open: boolean }) => (
                        <>
                            <XStack gap={"$2"} alignItems={"center"}>
                                <Square animation="quick" rotate={open ? '180deg' : '0deg'}>
                                    <ChevronDown size="$1"/>
                                </Square>
                                <LayoutList/>
                                <H2>To Do</H2>
                            </XStack>
                        </>
                    )}
                </Accordion.Trigger>
                <Accordion.Content minHeight={0}>
                    <FlatList contentContainerStyle={{padding: 10, gap: 10, maxHeight: height}}
                              data={todoTasks}
                              renderItem={item => <MachineTaskWithDialog task={item.item} machine_id={machine_id}/>}
                              keyExtractor={item => item.id}/>
                </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value={"completed"}>
                <Accordion.Trigger flexDirection="row" justifyContent="space-between">
                    {({open}: { open: boolean }) => (
                        <>
                            <XStack gap={"$2"} alignItems={"center"}>
                                <Square animation="quick" rotate={open ? '180deg' : '0deg'}>
                                    <ChevronDown size="$1"/>
                                </Square>
                                <ListChecks/>
                                <H2>Completed</H2>
                            </XStack>
                        </>
                    )}
                </Accordion.Trigger>
                <Accordion.Content>
                    <FlatList contentContainerStyle={{padding: 10, gap: 10, maxHeight: height}}
                              data={doneTasks}
                              renderItem={item => <MachineTaskWithDialog task={item.item} machine_id={machine_id}/>}
                              keyExtractor={item => item.id}/>
                </Accordion.Content>
            </Accordion.Item>
        </Accordion>
    )

}

function TaskTab({machine_id}: { machine_id: string }) {
    const {tasks, tasksError} = useTasks(machine_id);
    if (tasksError)
        alert(tasksError.message);

    if (!tasks)
        return <Loading/>

    let todoTasks = tasks.filter(task => !task.completed_at);
    let doneTasks = tasks.filter(task => task.completed_at);


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
                      renderItem={item => <MachineTaskWithDialog task={item.item} machine_id={machine_id}/>}
                      keyExtractor={item => item.id}
            />
        </Tabs.Content>

        <Tabs.Content value={"done"}>
            <FlatList contentContainerStyle={{height: "100%", backgroundColor: "white", padding: 10, gap: 10}}
                      data={doneTasks}
                      renderItem={item => <MachineTaskWithDialog task={item.item} machine_id={machine_id}/>}
                      keyExtractor={item => item.id}
            />
        </Tabs.Content>

    </Tabs>
}

function MachineTaskWithDialog({machine_id, task}: { machine_id: string, task: Task }) {
    return <TaskDetailsDialog key={task.id} task={task} machine_id={machine_id}>
        <Pressable>
            <TaskOverview task={task}/>
        </Pressable>
    </TaskDetailsDialog>

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