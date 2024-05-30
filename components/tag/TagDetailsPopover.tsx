import {Button, Text, XStack, YStack} from "tamagui";
import {Machine, Tag, useDeleteMachineTag, useMachineTag} from "../../api/machine";
import React, {useState} from "react";
import Loading from "../Loading";
import {getUser, useRole} from "../../api/API";
import {useQuery} from "@supabase-cache-helpers/postgrest-react-query";
import {Edit3, Trash} from "@tamagui/lucide-icons";
import {LmButton} from "@tamagui-extras/core";
import {canEditTags} from "../../api/users";
import {uuid} from "@supabase/supabase-js/dist/main/lib/helpers";
import SimplePopover from "../SimplePopover";
import TagEditDialog from "./TagEditDialog";

export default function TagDetailsPopover({machine, tag, children}: {
    machine: Machine,
    tag: Tag,
    children: React.ReactNode
}) {
    const [open, setOpen] = useState(false);
    const {role} = useRole();
    const {
        data: machineTag,
        error: machineTagError,
        status: machineTagStatus,
        refetch: refetchMachineTag
    } = useMachineTag(machine.id, tag.id);
    let userEnabled = false;
    if (machineTag && machineTag.created_by) {
        userEnabled = true;
    }
    const {data: user, error: userError, status} = useQuery(getUser(machineTag?.created_by ?? uuid()), {
        enabled: userEnabled
    })
    const [deleting, setDeleting] = useState(false);
    const {mutateAsync: deleteMachineTag} = useDeleteMachineTag();

    let onOpen = (open: boolean) => {
        setOpen(open)
        if (open && !machineTag && machineTagStatus === "success") {
            refetchMachineTag().then()
        }
    }

    if (machineTagError || userError) {
        return <SimplePopover trigger={children} open={open} setOpen={setOpen}>
            <Text>Error Loading Tag</Text>
            <Text>{machineTagError?.message}</Text>
            <Text>{userError?.message}</Text>
        </SimplePopover>
    }

    if (!role || !machineTag || (!userError && machineTag.created_by && !user)) {
        return <SimplePopover trigger={children} open={open} setOpen={onOpen}>
            <Loading/>
        </SimplePopover>
    }
    let deleteTag = () => {
        setDeleting(true)
        deleteMachineTag({machine: machine.id, tag: tag.id})
            .then(() => {
                setOpen(false)
            })
            .catch(e => alert(e))
            .finally(() => setDeleting(false));
    }


    let date = new Date(machineTag.created_at);

    return <SimplePopover trigger={children} open={open} setOpen={setOpen}>
        <YStack gap={"$2.5"}>
            <Text>Tagged By: {machineTag.created_by ? user?.name : "Unknown"}</Text>
            <Text>Tagged At: {date.toLocaleString()}</Text>
        </YStack>
        {canEditTags(role) ? <XStack position={"absolute"} top={"$3"} right={"$3"} gap={"$2"}>
            <LmButton loading={deleting} theme={"red"} size={"$2.5"} icon={Trash} onPress={deleteTag}/>
            <TagEditDialog tag={tag}>
                <Button size={"$2.5"} icon={Edit3}/>
            </TagEditDialog>
        </XStack> : null}
    </SimplePopover>
}