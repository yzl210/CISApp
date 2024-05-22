import {Button, Dialog, Label, XStack, YStack} from "tamagui";
import React, {useState} from "react";
import {CheckCircle, Timer, Trash, XCircle} from "@tamagui/lucide-icons";
import {LmButton} from "@tamagui-extras/core";
import {LmInput} from "@tamagui-extras/form";
import {useIsWeb} from "../../api/utils";
import SimpleDialog from "../SimpleDialog";
import Editor from "../Editor";
import CronEditDialog from "./CronEditDialog";
import cronstrue from "cronstrue";
import {TaskTemplate, useDeleteTaskTemplate, useInsertTaskTemplate, useUpdateTaskTemplate} from "../../api/tasks";

type CreateTaskTemplateType = {
    machine_id: string;
    template?: undefined;
    create: true;
    children: React.ReactNode;
}

type EditTaskTemplateType = {
    machine_id: string;
    template: TaskTemplate;
    create?: false;
    children: React.ReactNode;
}

export default function TaskTemplateEditDialog({
                                                   machine_id,
                                                   template,
                                                   create,
                                                   children
                                               }: CreateTaskTemplateType | EditTaskTemplateType) {
    const {mutateAsync: updateTaskTemplate} = useUpdateTaskTemplate();
    const {mutateAsync: insertTaskTemplate} = useInsertTaskTemplate();
    const {mutateAsync: deleteTaskTemplate} = useDeleteTaskTemplate();


    const [status, setStatus] = useState<'editing' | 'loading' | 'deleting' | 'closed'>('closed')
    const [name, setName] = useState(create ? "New Task Template" : template.name)
    const [description, setDescription] = useState(create ? "" : template.description ?? "")
    const [cron, setCron] = useState(create ? "" : template.cron ?? "")
    const [details, setDetails] = useState(create ? "" : template.details ?? "")
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
            setName("New Task Template")
            setDescription("")
            setDetails("")
        } else {
            setName(template.name)
            setDescription(template.description ?? "")
            setDetails(template.details ?? "")
        }
    }

    let emptyToNull = (value: string) => value.length > 0 ? value : undefined


    let confirm = () => {
        if (name.length < 1)
            return;
        setStatus('loading')

        if (create) {
            insertTaskTemplate({
                // @ts-ignore
                name: name,
                machine: machine_id,
                description: emptyToNull(description),
                details: emptyToNull(details),
                cron: emptyToNull(cron)
            }).then((data) => {
                setStatus('closed')
            }).catch(e => {
                alert(e)
                setStatus('editing')
            })

        } else {
            updateTaskTemplate({
                name,
                id: template.id,
                description: emptyToNull(description),
                details: emptyToNull(details),
                cron: emptyToNull(cron)
            }).then(() => {
                setStatus('closed')
            }).catch(e => {
                alert(e)
                setStatus('editing')
            })
        }
    }

    let doDelete = () => {
        if (create)
            return;

        setStatus('deleting')
        deleteTaskTemplate({
            id: template.id
        }).then(() => {
            setStatus('closed')
        }).catch(e => {
            alert(e)
            setStatus('editing')
        })
    }

    return <SimpleDialog open={status !== 'closed'} onOpenChange={openChange} trigger={children}>
        <Dialog.Title>
            {create ? "Create New Task Template" : "Edit Task Template"}
        </Dialog.Title>
        {!create ? <Dialog.Description alignItems={"center"}>
            Editing {template.name}
        </Dialog.Description> : null}
        <YStack gap={"$2"}>
            <LmInput label={"Name"} value={name} onChangeText={setName} error={name.length < 1} labelInline/>
            <LmInput label={"Description"} value={description} onChangeText={setDescription} labelInline/>

            <CronEditDialog cron={emptyToNull(cron)} setCron={setCron}>
                <Button theme={"blue"} icon={Timer}>
                    {emptyToNull(cron) ? cronstrue.toString(cron, {verbose: true}) : "Does not repeat"}
                </Button>
            </CronEditDialog>

            <Label>Details:</Label>
            <Editor initialContent={details} onContentChange={setDetails}/>
        </YStack>
        <XStack alignSelf={"center"} gap={"$3"} marginTop={"$3"}>
            {!create ? <LmButton theme={"red"} onPress={doDelete} loading={status === 'deleting'} icon={Trash}>
                Delete
            </LmButton> : null}
            <LmButton theme={"red"} onPress={cancel} disabled={status !== 'editing'} icon={<XCircle/>}>
                Cancel
            </LmButton>
            <LmButton theme={"green"} onPress={confirm} loading={status === 'loading'} icon={<CheckCircle/>}>
                Confirm
            </LmButton>
        </XStack>
    </SimpleDialog>
}
