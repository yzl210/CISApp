import {Machine, useUpdateMachine} from "../../../api/machine";
import {Dialog, Text, XStack, YStack} from "tamagui";
import React, {useState} from "react";
import {CheckCircle, XCircle} from "@tamagui/lucide-icons";
import {LmButton} from "@tamagui-extras/core";
import {LmInput} from "@tamagui-extras/form";

export default function MachineInfoEditDialog({machine, children}: { machine: Machine, children: React.ReactNode }) {
    const {mutateAsync: updateMachine} = useUpdateMachine();

    const [status, setStatus] = useState<'editing' | 'loading' | 'closed'>('closed')
    const [name, setName] = useState(machine.name)
    const [brand, setBrand] = useState(machine.brand ?? "")
    const [model, setModel] = useState(machine.model ?? "")
    const [serial, setSerial] = useState(machine.serial ?? "")
    const [location, setLocation] = useState(machine.location ?? "")

    let openChange = (open: boolean) => {
        if (open)
            setStatus('editing')
    }

    let cancel = () => {
        setStatus('closed')
        setName(machine.name)
        setBrand(machine.brand ?? "")
        setModel(machine.model ?? "")
        setSerial(machine.serial ?? "")
        setLocation(machine.location ?? "")
    }

    let confirm = () => {
        setStatus('loading')
        let emptyToNull = (value: string) => value.length > 0 ? value : undefined

        updateMachine({
            name,
            id: machine.id,
            brand: emptyToNull(brand),
            model: emptyToNull(model),
            serial: emptyToNull(serial),
            location: emptyToNull(location)
        }).then(() => {
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
            <Dialog.Content bordered elevate key={"content"}>
                <Dialog.Title>
                    Edit Machine Info
                </Dialog.Title>
                <Dialog.Description alignItems={"center"}>
                    Editing {machine.name}
                    <Text color={"gray"}>{"\n("}{machine.id + ")"}</Text>
                </Dialog.Description>
                <YStack gap={"$2"}>
                    <LmInput label={"Name"} value={name} onChangeText={setName} labelInline/>
                    <LmInput label={"Brand"} value={brand} onChangeText={setBrand} labelInline/>
                    <LmInput label={"Model"} value={model} onChangeText={setModel} labelInline/>
                    <LmInput label={"Serial No."} value={serial} onChangeText={setSerial} labelInline/>
                    <LmInput label={"Location"} value={location} onChangeText={setLocation} labelInline/>
                </YStack>
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
