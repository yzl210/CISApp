import {Machine, useDeleteMachine, useInsertMachine, useUpdateMachine} from "../../api/machine";
import {Dialog, ScrollView, XStack, YStack} from "tamagui";
import React, {useState} from "react";
import {CheckCircle, Trash, XCircle} from "@tamagui/lucide-icons";
import {LmButton} from "@tamagui-extras/core";
import {LmCheckbox, LmInput} from "@tamagui-extras/form";
import {useIsWeb} from "../../api/utils";
import SimpleDialog from "../SimpleDialog";
import {DeleteConfirmDialog} from "../ConfirmDialog";
import {router} from "expo-router";

type CreateMachineType = {
    machine?: undefined;
    create: true;
    children: React.ReactNode;
}

type EditMachineType = {
    machine: Machine;
    create?: false;
    children: React.ReactNode;
}

export default function MachineInfoEditDialog({machine, create, children}: CreateMachineType | EditMachineType) {
    const {mutateAsync: updateMachine} = useUpdateMachine();
    const {mutateAsync: insertMachine} = useInsertMachine();
    const {mutateAsync: deleteMachine} = useDeleteMachine();

    const [status, setStatus] = useState<'editing' | 'confirming' | 'deleting' | 'closed'>('closed')
    const [name, setName] = useState(create ? "New Machine" : machine.name)
    const [brand, setBrand] = useState(create ? "" : machine.brand ?? "")
    const [model, setModel] = useState(create ? "" : machine.model ?? "")
    const [serial, setSerial] = useState(create ? "" : machine.serial ?? "")
    const [location, setLocation] = useState(create ? "" : machine.location ?? "")
    const [image, setImage] = useState(create ? "" : machine.image ?? "")
    const [volts, setVolts] = useState(create ? "" : machine.volts ?? "")
    const [phase, setPhase] = useState(create ? "" : machine.phase ?? "")
    const [amperage, setAmperage] = useState(create ? "" : machine.amperage ?? "")
    const [hertz, setHertz] = useState(create ? "" : machine.hertz ?? "")
    const [electricallyCertified, setElectricallyCertified] = useState(create ? false : machine.electrically_certified)

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
            setName("New Machine")
            setBrand("")
            setModel("")
            setSerial("")
            setLocation("")
            setImage("")
            setVolts("")
            setPhase("")
            setAmperage("")
            setHertz("")
            setElectricallyCertified(false)
        } else {
            setName(machine.name)
            setBrand(machine.brand ?? "")
            setModel(machine.model ?? "")
            setSerial(machine.serial ?? "")
            setLocation(machine.location ?? "")
            setImage(machine.image ?? "")
            setVolts(machine.volts ?? "")
            setPhase(machine.phase ?? "")
            setAmperage(machine.amperage ?? "")
            setHertz(machine.hertz ?? "")
            setElectricallyCertified(machine.electrically_certified)
        }
    }

    let confirm = () => {
        if (name.length < 1)
            return;
        setStatus('confirming')
        let emptyToNull = (value: string) => value.length > 0 ? value : null

        if (create) {
            insertMachine({
                // @ts-ignore
                name: name,
                brand: emptyToNull(brand),
                model: emptyToNull(model),
                serial: emptyToNull(serial),
                location: emptyToNull(location),
                image: emptyToNull(image),
                volts: emptyToNull(volts),
                phase: emptyToNull(phase),
                amperage: emptyToNull(amperage),
                hertz: emptyToNull(hertz),
                electrically_certified: electricallyCertified
            }).then(() => {
                setStatus('closed')
            }).catch(e => {
                alert(e)
                setStatus('editing')
            })
        } else {
            updateMachine({
                name,
                id: machine.id,
                brand: emptyToNull(brand),
                model: emptyToNull(model),
                serial: emptyToNull(serial),
                location: emptyToNull(location),
                image: emptyToNull(image),
                volts: emptyToNull(volts),
                phase: emptyToNull(phase),
                amperage: emptyToNull(amperage),
                hertz: emptyToNull(hertz),
                electrically_certified: electricallyCertified
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
        deleteMachine({
            id: machine.id
        }).then(() => {
            setStatus('closed')
            if (router.canGoBack())
                router.back();
            else
                router.replace("/")
        }).catch(e => {
            alert(e)
            setStatus('editing')
        })
    }

    return <SimpleDialog open={status !== 'closed'} onOpenChange={openChange} trigger={children}>
        <Dialog.Title>
            {create ? "Create New Machine" : "Edit Machine Info"}
        </Dialog.Title>
        {!create ? <Dialog.Description alignItems={"center"}>
            Editing {machine.name}
        </Dialog.Description> : null}
        <ScrollView>
            <YStack gap={"$2"} alignItems={"center"}>
                <LmInput label={"Name"} value={name} onChangeText={setName} error={name.length < 1} labelInline/>
                <LmInput label={"Brand"} value={brand} onChangeText={setBrand} labelInline/>
                <LmInput label={"Model"} value={model} onChangeText={setModel} labelInline/>
                <LmInput label={"Serial No."} value={serial} onChangeText={setSerial} labelInline/>
                <LmInput label={"Location"} value={location} onChangeText={setLocation} labelInline/>
                <LmInput label={"Image"} value={image} onChangeText={setImage} labelInline/>
                <LmInput label={"Volts"} value={volts} onChangeText={setVolts} labelInline/>
                <LmInput label={"Phase"} value={phase} onChangeText={setPhase} labelInline/>
                <LmInput label={"Amperage"} value={amperage} onChangeText={setAmperage} labelInline/>
                <LmInput label={"Hertz"} value={hertz} onChangeText={setHertz} labelInline/>
                <LmCheckbox label={"Electrically Certified"} value={electricallyCertified} onChange={state => {
                    if (typeof state === "boolean")
                        setElectricallyCertified(state)
                }}/>
            </YStack>
        </ScrollView>
        <XStack alignSelf={"center"} gap={"$3"} marginTop={"$3"}>
            {!create ? <DeleteConfirmDialog title={"Machine"} description={machine.name} doDelete={doDelete}>
                <LmButton theme={"red"} disabled={status !== 'editing'} loading={status === 'deleting'} icon={Trash}>
                    Delete
                </LmButton>
            </DeleteConfirmDialog> : null}
            <LmButton theme={"red"} onPress={cancel} disabled={status !== 'editing'} icon={XCircle}>
                Cancel
            </LmButton>
            <LmButton theme={"green"} onPress={confirm} disabled={status !== 'editing'}
                      loading={status === 'confirming'} icon={CheckCircle}>
                Confirm
            </LmButton>
        </XStack>
    </SimpleDialog>
}
