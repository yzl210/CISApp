import {Log, useLogMachines, useLogTasks} from "../../api/logs";
import SimpleDialog from "../SimpleDialog";
import React, {useState} from "react";
import {useIsLandscape, useIsWeb} from "../../api/utils";
import {Button, Dialog, H4, ScrollView, Separator, Spinner, Text, XStack, YStack} from "tamagui";
import RenderHTML from "react-native-render-html";
import {Edit3, X} from "@tamagui/lucide-icons";
import {useRole, useUser} from "../../api/API";
import Loading from "../Loading";
import {FlatList, Pressable, useWindowDimensions} from "react-native";
import {SimpleMachineOverview} from "../machine/MachineOverview";
import TaskOverview from "../task/TaskOverview";
import TaskDetailsDialog from "../task/TaskDetailsDialog";
import {canEditLogs} from "../../api/users";
import MaintenanceLogEditDialog from "./MaintenanceLogEditDialog";

export default function MaintenanceLogDetailsDialog({log, children}: { log: Log, children: React.ReactNode }) {
    const {user} = useUser(log.created_by);
    const {role} = useRole();

    const [status, setStatus] = useState<'editing' | 'loading' | 'closed' | 'completing'>('closed')
    const isWeb = useIsWeb();
    const isLandscape = useIsLandscape();

    if (!user || !role)
        return <Loading/>

    let openChange = (open: boolean) => {
        if (status !== 'loading' || !isWeb) {
            setStatus(open ? 'editing' : 'closed')
        }
    }

    return <SimpleDialog open={status !== 'closed'} onOpenChange={openChange} trigger={children}
                         props={{overflow: "scroll"}}>
        <Dialog.Title>
            {log.title}
        </Dialog.Title>
        <Dialog.Description>
            <Text>By: {user.name + "\n"}</Text>
            <Text>At: {new Date(log.created_at).toLocaleString()}</Text>
        </Dialog.Description>
        <Separator marginVertical={"$2"}/>

        {isLandscape ? <Horizontal log={log}/> : <Vertical log={log}/>}

        <Button circular position={"absolute"} top={"$3"} right={"$3"} size={"$2"} icon={X}
                onPress={() => openChange(false)}/>

        {canEditLogs(role) ?
            <XStack alignSelf={"center"} gap={"$3"} marginTop={"$3"}>
                <MaintenanceLogEditDialog log={log}>
                    <Button icon={Edit3}>Edit</Button>
                </MaintenanceLogEditDialog>
            </XStack> : null}

    </SimpleDialog>
}

function Horizontal({log}: { log: Log }) {
    const dimension = useWindowDimensions();
    let width = dimension.width * 0.4;
    let height = dimension.height * 0.5;

    return <XStack maxHeight={height}>
        <ScrollView width={width}>
            <RenderHTML source={{html: log.content}} contentWidth={width}/>
        </ScrollView>
        <Separator vertical marginHorizontal={"$2"}/>
        <YStack>
            <RelatedMachines log={log}/>
            <RelatedTasks log={log}/>
        </YStack>
    </XStack>
}

function Vertical({log}: { log: Log }) {
    let width = useWindowDimensions().width * 0.6;

    return <>
        <ScrollView width={width}>
            <RenderHTML source={{html: log.content}} contentWidth={width}/>
        </ScrollView>
        <Separator marginVertical={"$2"}/>
        <RelatedMachines log={log}/>
        <RelatedTasks log={log}/>
    </>
}

function RelatedMachines({log}: { log: Log }) {
    const {machines} = useLogMachines(log.id);
    if (!machines)
        return <Spinner/>
    if (machines.length < 1)
        return null;

    return <>
        <H4>Related Machines:</H4>
        <ScrollView>
            <FlatList data={machines}
                      renderItem={(item) => <SimpleMachineOverview machine={item.item}/>}
                      keyExtractor={item => item.id + Math.random()}
                      scrollEnabled={false}
                      style={{gap: 5, padding: 5, marginBottom: 10}}/>
        </ScrollView>
    </>
}

function RelatedTasks({log}: { log: Log }) {
    const {tasks} = useLogTasks(log.id);
    if (!tasks)
        return <Spinner/>
    if (tasks.length < 1)
        return null;

    return <>
        <H4>Related Tasks:</H4>
        <ScrollView>
            <FlatList data={tasks}
                      renderItem={(item) =>
                          <TaskDetailsDialog task={item.item}>
                              <Pressable>
                                  <TaskOverview task={item.item}/>
                              </Pressable>
                          </TaskDetailsDialog>
                      }
                      scrollEnabled={false}
                      style={{padding: 5, marginBottom: 10}}/>
        </ScrollView>
    </>
}