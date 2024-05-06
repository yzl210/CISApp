import {Task} from "../../../api/machine";
import {Dialog, Separator, Text, XStack} from "tamagui";
import React, {useState} from "react";
import {Edit3, XCircle} from "@tamagui/lucide-icons";
import {LmButton} from "@tamagui-extras/core";
import {useIsWeb} from "../../../api/utils";
import SimpleDialog from "../SimpleDialog";
import RenderHTML from "react-native-render-html";
import {getUser, useRole} from "../../../api/API";
import Loading from "../../Loading";
import {canEditTasks} from "../../../api/users";
import {useQuery} from "@supabase-cache-helpers/postgrest-react-query";
import {uuid} from "@supabase/supabase-js/dist/main/lib/helpers";

export default function TaskDetailsDialog({task, children}: { task: Task, children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const isWeb = useIsWeb();
    const {role} = useRole()

    const {data: created_by} = useQuery(getUser(task.created_by ?? uuid()), {
        enabled: !!task.created_by
    })

    if (!role || (task.created_by && !created_by)) {
        return <Loading/>
    }

    let openChange = (open: boolean) => {
        if (open)
            setOpen(true)
        else if (!isWeb) {
            cancel();
            setOpen(false)
        }
    }

    let cancel = () => {
        setOpen(false)
    }

    let confirm = () => {
        setOpen(false)
        let emptyToNull = (value: string) => value.length > 0 ? value : undefined
    }

    let creationDate = new Date(task.created_at)
    let completionDate = task.done_at ? new Date(task.done_at) : null


    return <SimpleDialog open={open} onOpenChange={openChange} trigger={children}>
        <Dialog.Title>
            {task.name}
        </Dialog.Title>
        <Dialog.Description>
            {task.description ? <Text>{task.description + "\n"}</Text> : null}
            <Text>Created On: {creationDate.toLocaleString() + "\n"}</Text>
            {created_by ? <Text>Created By: {created_by.name + "\n"}</Text> : null}
            {completionDate ? <Text>Completed On: {completionDate.toLocaleString() + "\n"}</Text> : null}
        </Dialog.Description>

        {task.details ?
            <><Separator marginVertical={"$2"}/><RenderHTML source={{html: task.details ?? ""}}/><Separator
                marginVertical={"$2"}/></> : null}

        <XStack alignSelf={"center"} gap={"$3"} marginTop={"$3"}>
            <LmButton theme={"red"} onPress={cancel} icon={<XCircle/>}>
                Close
            </LmButton>
            {canEditTasks(role) ? <LmButton icon={Edit3}>Edit</LmButton> : null}
        </XStack>
    </SimpleDialog>
}
