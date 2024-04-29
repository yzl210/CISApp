import {Machine, useUpdateMachine} from "../../../api/machine";
import {Dialog, XStack} from "tamagui";
import React, {useState} from "react";
import {CheckCircle, XCircle} from "@tamagui/lucide-icons";
import {LmButton} from "@tamagui-extras/core";
import {MarkdownTextInput} from "@expensify/react-native-live-markdown";

export default function MachineDescriptionEditDialog({machine, children}: {
    machine: Machine,
    children: React.ReactNode
}) {
    const {mutateAsync: updateMachine} = useUpdateMachine();
    const [status, setStatus] = useState<'editing' | 'loading' | 'closed'>('closed')
    const [text, setText] = useState(machine.description ?? "")

    let openChange = (open: boolean) => {
        if (open)
            setStatus('editing')
    }

    let cancel = () => {
        setStatus('closed')
        setText(machine.description ?? "")
    }

    let confirm = () => {
        setStatus('loading')
        updateMachine({id: machine.id, description: text.length > 0 ? text : null}).then(() => {
            setStatus('closed')
        }).catch(e => {
            alert(e)
            setStatus('editing')
        })
    }

    return <Dialog modal open={status !== 'closed'} onOpenChange={openChange}>
        {/*<Adapt when="sm" platform="touch">*/}
        {/*    <Sheet animation="medium" zIndex={200000} modal dismissOnSnapToBottom>*/}
        {/*        <Sheet.Frame padding="$4" gap="$4">*/}
        {/*            <Adapt.Contents />*/}
        {/*        </Sheet.Frame>*/}
        {/*        <Sheet.Overlay*/}
        {/*            animation="lazy"*/}
        {/*            enterStyle={{ opacity: 0 }}*/}
        {/*            exitStyle={{ opacity: 0 }}*/}
        {/*        />*/}
        {/*    </Sheet>*/}
        {/*</Adapt>*/}
        <Dialog.Trigger asChild>
            {children}
        </Dialog.Trigger>
        <Dialog.Portal>
            <Dialog.Overlay disabled/>
            <Dialog.Content bordered elevate key={"content"} maxHeight={700}>
                <Dialog.Title>
                    Edit Machine Description
                </Dialog.Title>
                <Dialog.Description alignItems={"center"}>
                    Editing {machine.name}
                </Dialog.Description>

                <MarkdownTextInput
                    value={text}
                    onChangeText={setText}
                    style={{padding: 5, minHeight: 200, maxWidth: 700}}
                    multiline
                />

                <XStack alignSelf={"center"} gap={"$3"} marginTop={"$3"}>
                    <LmButton theme={"red"} onPress={cancel} disabled={status !== 'editing'} icon={<XCircle/>}>
                        Cancel
                    </LmButton>
                    <LmButton theme={"green"} onPress={confirm} loading={status === 'loading'} icon={<CheckCircle/>}>
                        Confirm
                    </LmButton>
                </XStack>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog>
}