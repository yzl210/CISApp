import {Button, Dialog, Label, XStack, YStack} from "tamagui";
import React, {useState} from "react";
import {CheckCircle, Timer, XCircle} from "@tamagui/lucide-icons";
import {LmButton} from "@tamagui-extras/core";
import {LmInput} from "@tamagui-extras/form";
import {useIsWeb} from "../../../api/utils";
import SimpleDialog from "../SimpleDialog";
import {Task, useInsertMachineTask, useInsertTask, useUpdateTask} from "../../../api/machine";
import Editor from "../../Editor";
import CronEditDialog from "./CronEditDialog";
import cronstrue from "cronstrue";

type CreateTaskType = {
    machine_id: string;
    task?: undefined;
    create: true;
    children: React.ReactNode;
}

type EditTaskType = {
    machine_id: string;
    task: Task;
    create?: false;
    children: React.ReactNode;
}

export default function TaskEditDialog({machine_id, task, create, children}: CreateTaskType | EditTaskType) {
    const {mutateAsync: updateTask} = useUpdateTask();
    const {mutateAsync: insertTask} = useInsertTask();
    const {mutateAsync: insertMachineTask} = useInsertMachineTask();


    const [status, setStatus] = useState<'editing' | 'loading' | 'closed'>('closed')
    const [name, setName] = useState(create ? "New Task" : task.name)
    const [description, setDescription] = useState(create ? "" : task.description ?? "")
    const [cron, setCron] = useState<string>()
    const [details, setDetails] = useState(create ? "" : task.details ?? "")
    const isWeb = useIsWeb();

    let openChange = (open: boolean) => {
        if (open)
            setStatus('editing')
        else if (!isWeb) {
            cancel();
            setStatus('closed')
        }
    }

    let cancel = () => {
        setStatus('closed')
        if (create) {
            setName("New Task")
            setDescription("")
            setDetails("")
        } else {
            setName(task.name)
            setDescription(task.description ?? "")
            setDetails(task.details ?? "")
        }
    }

    let confirm = () => {
        if (name.length < 1)
            return;
        setStatus('loading')
        let emptyToNull = (value: string) => value.length > 0 ? value : null

        if (create) {
            insertTask({
                // @ts-ignore
                name: name,
                description: emptyToNull(description),
                details: emptyToNull(details),
            }).then((data) => {
                if (data && data.length > 0) {
                    insertMachineTask({
                        // @ts-ignore
                        machine: machine_id,
                        task: data[0].id
                    }).then(() => setStatus('closed'))
                        .catch(e => {
                            throw e;
                        })
                }
            }).catch(e => {
                alert(e)
                setStatus('editing')
            })

        } else {
            updateTask({
                name,
                id: task.id,
                description: emptyToNull(description),
                details: emptyToNull(details),
            }).then(() => {
                setStatus('closed')
            }).catch(e => {
                alert(e)
                setStatus('editing')
            })
        }
    }

    return <SimpleDialog open={status !== 'closed'} onOpenChange={openChange} trigger={children}>
        <Dialog.Title>
            {create ? "Create New Task" : "Edit Task"}
        </Dialog.Title>
        {!create ? <Dialog.Description alignItems={"center"}>
            Editing {task.name}
        </Dialog.Description> : null}
        <YStack gap={"$2"}>
            <LmInput width={"$100"} label={"Name"} value={name} onChangeText={setName} error={name.length < 1}
                     labelInline/>
            <LmInput label={"Description"} value={description} onChangeText={setDescription} labelInline/>
            {create ?
                <CronEditDialog cron={cron} setCron={setCron}>
                    <Button theme={"blue"} icon={Timer}>
                        {cron ? cronstrue.toString(cron, {verbose: true}) : "Does not repeat"}
                    </Button>
                </CronEditDialog>
                : null}
            <Label>Details:</Label>
            <Editor initialContent={details} onContentChange={setDetails}/>
        </YStack>
        <XStack alignSelf={"center"} gap={"$3"} marginTop={"$3"}>
            <LmButton theme={"red"} onPress={cancel} disabled={status !== 'editing'} icon={<XCircle/>}>
                Cancel
            </LmButton>
            <LmButton theme={"green"} onPress={confirm} loading={status === 'loading'} icon={<CheckCircle/>}>
                Confirm
            </LmButton>
        </XStack>
    </SimpleDialog>
}
