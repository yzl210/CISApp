import {Button, Dialog, Separator, Text, XStack} from "tamagui";
import React, {useState} from "react";
import {Edit3, Trash, X} from "@tamagui/lucide-icons";
import {LmButton} from "@tamagui-extras/core";
import {useIsWeb} from "../../api/utils";
import SimpleDialog from "../SimpleDialog";
import RenderHTML from "react-native-render-html";
import {getUser, useRole} from "../../api/API";
import Loading from "../Loading";
import {canEditTasks} from "../../api/users";
import {useQuery} from "@supabase-cache-helpers/postgrest-react-query";
import {uuid} from "@supabase/supabase-js/dist/main/lib/helpers";
import TaskEditDialog from "./TaskEditDialog";
import {DeleteConfirmDialog} from "../ConfirmDialog";
import {Pressable} from "react-native";
import {Task, useDeleteTask} from "../../api/tasks";

export default function TaskDetailsDialog({machine_id, task, children}: {
    machine_id: string,
    task: Task,
    children: React.ReactNode
}) {
    const [status, setStatus] = useState<'editing' | 'loading' | 'closed'>('closed')
    const isWeb = useIsWeb();
    const {role} = useRole()
    const {mutateAsync: deleteTaskMutation} = useDeleteTask()

    const {data: created_by} = useQuery(getUser(task.created_by ?? uuid()), {
        enabled: !!task.created_by
    })

    if (!role || (task.created_by && !created_by)) {
        return <Loading/>
    }

    let openChange = (open: boolean) => {
        if (status !== 'loading' || !isWeb) {
            setStatus(open ? 'editing' : 'closed')
        }
    }

    let deleteTask = () => {
        setStatus('loading')
        deleteTaskMutation({id: task.id})
            .then(() => {
                setStatus('closed')
            })
            .catch(e => {
                alert(e)
                setStatus('editing')
            })
    }

    let creationDate = new Date(task.created_at)
    let completionDate = task.completed_at ? new Date(task.completed_at) : null


    return <SimpleDialog open={status !== 'closed'} onOpenChange={openChange} trigger={children}>
        <Dialog.Title marginRight={"$6"}>
            {task.name}
        </Dialog.Title>
        <Dialog.Description>
            {task.description ? <Text>{task.description + "\n"}</Text> : null}
            {task.template ? <Pressable><Text color={"#0066ff"}>Created From Template</Text></Pressable> : null}
            <Text>Created On: {creationDate.toLocaleString() + "\n"}</Text>
            {created_by ? <Text>Created By: {created_by.name + "\n"}</Text> : null}
            {completionDate ? <Text>Completed On: {completionDate.toLocaleString() + "\n"}</Text> : null}
        </Dialog.Description>

        {task.details ?
            <><Separator marginVertical={"$2"}/><RenderHTML source={{html: task.details ?? ""}}/><Separator
                marginVertical={"$2"}/></> : null}

        <Button circular position={"absolute"} top={"$3"} right={"$3"} size={"$2"} icon={X}
                onPress={() => openChange(false)}/>

        {canEditTasks(role) ? <XStack alignSelf={"center"} gap={"$3"} marginTop={"$3"}>
            <DeleteConfirmDialog title={"Task"} description={task.name} doDelete={deleteTask}>
                <LmButton theme={"red"} icon={Trash} loading={status === 'loading'}>
                    Delete
                </LmButton>
            </DeleteConfirmDialog>
            <TaskEditDialog machine_id={machine_id} task={task}>
                <LmButton icon={Edit3}>Edit</LmButton>
            </TaskEditDialog>
        </XStack> : null}
    </SimpleDialog>
}
