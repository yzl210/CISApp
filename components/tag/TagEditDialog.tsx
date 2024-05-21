import {Dialog, Label, XStack, YStack} from "tamagui";
import React, {useState} from "react";
import {CheckCircle, XCircle} from "@tamagui/lucide-icons";
import {LmButton} from "@tamagui-extras/core";
import {LmInput} from "@tamagui-extras/form";
import {useIsWeb} from "../../../api/utils";
import SimpleDialog from "../SimpleDialog";
import {
    Tag,
    useInsertMachineTags,
    useMachineTag, useUpdateMachineTag,
} from "../../../api/machine";
import Editor from "../../Editor";


type CreateTagType = {
    tag?: undefined;
    create: true;
    children: React.ReactNode;
}

type EditTagType = {
    tag: Tag;
    create?: false;
    children: React.ReactNode;
}

export default function TagEditDialog({tag, create, children}: CreateTagType | EditTagType){
    const {mutateAsync: updateTag} = useUpdateMachineTag();
    const {mutateAsync: insertTag} = useInsertMachineTags();
    const {mutateAsync: insertMachineTag} = useInsertMachineTags();

    const [status, setStatus] = useState<'editing' | 'loading' | 'closed'>('closed')
    const [name, setName] = useState(create ? "New Tag" : tag.name)
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
            setName("New Tag")
        } else {
            setName(tag.name)
        }
    }

    let confirm = () => {
        if (name.length < 1)
            return;
        setStatus('loading')
        let emptyToNull = (value: string) => value.length > 0 ? value : null

        if (create) {
            insertTag({
                name: name,
            }).then(() => {
                setStatus('closed')
            }).catch(e => {
                alert(e)
                setStatus('editing')
            })
        } else {
            updateTag({
                name,
                id: tag.id,
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
            {create ? "Create New Tag" : "Edit Tag"}
        </Dialog.Title>
        {!create ? <Dialog.Description alignItems={"center"}>
            Editing {tag.name}
        </Dialog.Description> : null}
        <YStack gap={"$2"} width={"auto"}>
            <LmInput width={"$100"} label={"Name"} value={name} onChangeText={setName} error={name.length < 1}
                     labelInline/>w
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