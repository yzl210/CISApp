import React, {useState} from "react";
import {Log, useInsertLog, useInsertMachineLog, useUpdateLog} from "../../api/logs";
import {useIsWeb} from "../../api/utils";
import SimpleDialog from "../SimpleDialog";
import {Dialog, ScrollView, Separator, SizableText, Tabs, XStack, YStack} from "tamagui";
import {LmInput} from "@tamagui-extras/form";
import Editor from "../Editor";
import {LmButton} from "@tamagui-extras/core";
import {CheckCircle, XCircle} from "@tamagui/lucide-icons";

type CreateLogType = {
    log?: undefined;
    create: true;
    machine_id: string,
    children: React.ReactNode;
}

type EditLogType = {
    log: Log;
    create?: false;
    machine_id?: never,
    children: React.ReactNode;
}

export default function MaintenanceLogEditDialog({log, create, machine_id, children}: CreateLogType | EditLogType) {
    const [status, setStatus] = useState<'editing' | 'loading' | 'closed'>('closed')
    const [title, setTitle] = useState(create ? "New Maintenance Log" : log.title)
    const [content, setContent] = useState(create ? "" : log.content)
    const isWeb = useIsWeb();
    const {mutateAsync: insertLog} = useInsertLog();
    const {mutateAsync: updateLog} = useUpdateLog();
    const {mutateAsync: insertMachineLog} = useInsertMachineLog();


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
            setTitle("New Maintenance Log")
            setContent("")
        } else {
            setTitle(log.title)
            setContent(log.content)
        }
    }

    let confirm = () => {
        if (title.length < 1)
            return;
        setStatus('loading')
        let emptyToNull = (value: string) => value.length > 0 ? value : null

        if (create) {
            insertLog({
                // @ts-ignore
                title: title,
                content: content
            }).then((data) => {
                if (data && data.length > 0) {
                    insertMachineLog({
                        // @ts-ignore
                        machine: machine_id,
                        log: data[0].id
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
            updateLog({
                id: log.id,
                title,
                content
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
            {create ? "Post Maintenance Log" : "Edit Maintenance Log"}
        </Dialog.Title>
        {!create ? <Dialog.Description alignItems={"center"}>
            Editing {log.title}
        </Dialog.Description> : null}

        <Tabs
            defaultValue="details"
            orientation="horizontal"
            flexDirection="column"
        >
            <Tabs.List
                disablePassBorderRadius="bottom"
            >
                <Tabs.Tab flex={1} bordered={false} value="details">
                    <SizableText>Details</SizableText>
                </Tabs.Tab>
                <Tabs.Tab flex={1} bordered={false} value="related-machines">
                    <SizableText>Related Machines</SizableText>
                </Tabs.Tab>
                <Tabs.Tab flex={1} bordered={false} value="related-tasks">
                    <SizableText>Related Tasks</SizableText>
                </Tabs.Tab>
            </Tabs.List>
            <Separator/>
            <Tabs.Content value="details" marginVertical={"$2"}>
                <ScrollView>
                    <YStack gap={"$2"}>
                        <LmInput width={"100%"} label={"Title"} value={title} onChangeText={setTitle}
                                 error={title.length < 1}
                                 labelInline/>
                        <Editor initialContent={content} onContentChange={setContent}/>
                    </YStack>
                </ScrollView>
            </Tabs.Content>

            <Tabs.Content value="related-machines">

            </Tabs.Content>

            <Tabs.Content value="related-tasks">

            </Tabs.Content>
        </Tabs>
        <XStack alignSelf={"center"} gap={"$3"} marginTop={"$3"}>
            <LmButton theme={"red"} onPress={cancel} disabled={status !== 'editing'} icon={XCircle}>
                Cancel
            </LmButton>
            <LmButton theme={"green"} onPress={confirm} loading={status === 'loading'} icon={CheckCircle}>
                Confirm
            </LmButton>
        </XStack>
    </SimpleDialog>
}