import {Button, Dialog, ScrollView, Separator, Text, XStack} from "tamagui";
import React, {useState} from "react";
import {Check, Edit3, Trash, X} from "@tamagui/lucide-icons";
import {LmButton} from "@tamagui-extras/core";
import {useIsWeb} from "../../api/utils";
import SimpleDialog from "../SimpleDialog";
import RenderHTML from "react-native-render-html";
import {getUser, useRole, useUser} from "../../api/API";
import Loading from "../Loading";
import {canEditTasks} from "../../api/users";
import {useQuery, useUpsertItem} from "@supabase-cache-helpers/postgrest-react-query";
import {uuid} from "@supabase/supabase-js/dist/main/lib/helpers";
import TaskEditDialog from "./TaskEditDialog";
import {DeleteConfirmDialog} from "../ConfirmDialog";
import {Pressable} from "react-native";
import {Task, useDeleteTask, useUpdateTask} from "../../api/tasks";
import {supabase} from "../../api/supabase";

export default function TaskDetailsDialog({task, children}: {
    task: Task,
    children: React.ReactNode
}) {
    const [status, setStatus] = useState<'editing' | 'loading' | 'closed' | 'completing'>('closed')
    const isWeb = useIsWeb();
    const {role} = useRole()
    const {user} = useUser(task.completed_by);
    const upsertTask = useUpsertItem({
        schema: 'public',
        table: 'tasks',
        primaryKeys: ['id']
    });
    const {mutateAsync: updateTask} = useUpdateTask();
    const {mutateAsync: deleteTaskMutation} = useDeleteTask()

    const {data: created_by} = useQuery(getUser(task.created_by ?? uuid()), {
        enabled: !!task.created_by
    })

    if (!role || !user || (task.created_by && !created_by)) {
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

    let completeTask = () => {
        setStatus('completing')
        supabase.rpc("complete_task", {task: task.id})
            .then(({error}) => {
                if (error) {
                    alert(error.message)
                    setStatus('editing')
                } else {
                    upsertTask({id: task.id, completed_at: new Date(), completed_by: user.id})
                        .then(() => {
                            setStatus('closed')
                        });
                }
            })
    }

    let uncompleteTask = () => {
        setStatus('completing')
        updateTask({id: task.id, completed_at: null, completed_by: null})
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
            {task.completed_by ? <Text>Completed By: {user.name + "\n"}</Text> : null}
        </Dialog.Description>

        {task.details ? <>
            <Separator marginVertical={"$2"}/>
            <ScrollView>
                <RenderHTML source={{html: task.details ?? ""}}/>
            </ScrollView>
            <Separator marginVertical={"$2"}/>
        </> : null}

        <Button circular position={"absolute"} top={"$3"} right={"$3"} size={"$2"} icon={X}
                onPress={() => openChange(false)}/>

        <XStack alignSelf={"center"} gap={"$3"} marginTop={"$3"}>
            {canEditTasks(role) ? <>
                <DeleteConfirmDialog title={"Task"} description={task.name} doDelete={deleteTask}>
                    <LmButton theme={"red"} icon={Trash} loading={status === 'loading'}>
                        Delete
                    </LmButton>
                </DeleteConfirmDialog>
                <TaskEditDialog task={task}>
                    <Button icon={Edit3}>Edit</Button>
                </TaskEditDialog>
            </> : null}
            {task.completed_at ?
                (canEditTasks(role) ?
                    <LmButton theme={"red"} icon={X} loading={status === 'completing'} onPress={uncompleteTask}>
                        Uncomplete
                    </LmButton> : null)
                :
                <LmButton theme={"green"} icon={Check} loading={status === 'completing'} onPress={completeTask}>
                    Complete
                </LmButton>
            }
        </XStack>


    </SimpleDialog>
}
