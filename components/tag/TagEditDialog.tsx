import {Dialog, Label, Square, XStack, YStack} from "tamagui";
import React, {useState} from "react";
import {CheckCircle, Edit3, Trash, XCircle} from "@tamagui/lucide-icons";
import {LmButton} from "@tamagui-extras/core";
import {LmInput} from "@tamagui-extras/form";
import {useIsWeb} from "../../api/utils";
import SimpleDialog from "../SimpleDialog";
import {Tag, useDeleteTag, useInsertTags, useUpdateTag,} from "../../api/machine";
import ColorPickerDialog from "../ColorPickerDialog";
import {DeleteConfirmDialog} from "../ConfirmDialog";
import {TouchableOpacity} from "react-native";


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

export default function TagEditDialog({tag, create, children}: CreateTagType | EditTagType) {
    const {mutateAsync: updateTag} = useUpdateTag();
    const {mutateAsync: insertTag} = useInsertTags();
    const {mutateAsync: deleteTag} = useDeleteTag();
    const [status, setStatus] = useState<'editing' | 'loading' | 'closed'>('closed')
    const [name, setName] = useState(create ? "New Tag" : tag.name)
    const isWeb = useIsWeb();
    const [color, setColor] = useState(create ? "#FFFFFF" : "#" + tag.color)


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
    };

    const doDelete = () => {
        if (create)
            return;

        deleteTag({
            id: tag.id,
        }).then(() => {
            setStatus('closed')
        }).catch(e => {
            alert(e)
            setStatus('editing')
        })
    };
    let confirm = () => {
        if (name.length < 1)
            return;
        setStatus('loading')

        if (create) {
            insertTag({
                // @ts-ignore
                name,
                color: color.slice(1)
            }).then(() => {
                setStatus('closed')
            }).catch(e => {
                alert(e)
                setStatus('editing')
            })
        } else {
            updateTag({
                name,
                color: color.slice(1),
                id: tag.id,
            }).then(() => {
                setStatus('closed')
            }).catch(e => {
                alert(e)
                setStatus('editing')
            })
        }
    };


    return <SimpleDialog open={status !== 'closed'} onOpenChange={openChange} trigger={children}>
        <Dialog.Title>
            {create ? "Create New Tag" : "Edit Tag"}
        </Dialog.Title>
        {!create ? <Dialog.Description alignItems={"center"}>
            Editing {tag.name}
        </Dialog.Description> : null}
        <YStack gap={"$2"}>
            <LmInput width={"100%"} label={"Name"} value={name} onChangeText={setName} error={name.length < 1}
                     labelInline/>

            <XStack gap={"$2"} alignSelf={"center"}>
                <Label>Color</Label>

                <ColorPickerDialog color={color} setColor={setColor}>
                    <TouchableOpacity>
                        <Square size={"$4"} backgroundColor={color}>
                            <Edit3/>
                        </Square>
                    </TouchableOpacity>
                </ColorPickerDialog>
            </XStack>
        </YStack>


        <XStack alignSelf={"center"} gap={"$3"} marginTop={"$3"}>
            {!create ? <DeleteConfirmDialog title={"Tag"} description={tag.name} doDelete={doDelete}>
                <LmButton theme={"red"} loading={status === 'loading'} icon={Trash}>
                    Delete
                </LmButton>
            </DeleteConfirmDialog> : null}
            <LmButton theme={"red"} onPress={cancel} disabled={status !== 'editing'} icon={<XCircle/>}>
                Cancel
            </LmButton>
            <LmButton theme={"green"} onPress={confirm} loading={status === 'loading'} icon={<CheckCircle/>}>
                Confirm
            </LmButton>
        </XStack>
    </SimpleDialog>

}