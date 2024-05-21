import SimplePopover from "../SimplePopover";
import SimpleDialog from "../SimpleDialog";
import React, {useState} from "react";
import {useIsWeb} from "../../api/utils";
import {Dialog, View} from "tamagui";
import {FlashList} from "@shopify/flash-list";
import {useTaskTemplates} from "../../api/tasks";
import Loading from "../Loading";
import TaskTemplateOverview from "./TaskTemplateOverview";
import {FlatList} from "react-native";

export default function TaskTemplatesDialog({machine_id, children}: {machine_id: string, children: React.ReactNode}) {
    const [open, setOpen] = useState(false);
    const isWeb = useIsWeb();
    const {taskTemplates} = useTaskTemplates(machine_id);

    let openChange = (open: boolean) => {
        if (open)
            setOpen(true)
        else if (!isWeb) {
            setOpen(false)
        }
    }

    return <SimpleDialog open={open} onOpenChange={openChange} trigger={children} props={{maxHeight: "50%", minWidth: "20%", maxWidth: "50%"}}>
        <Dialog.Title>
            Task Templates
        </Dialog.Title>
        {taskTemplates ? <FlatList contentContainerStyle={{padding: 5, gap: 5}} renderItem={item => <TaskTemplateOverview template={item.item}/>} data={taskTemplates.concat(taskTemplates).concat(taskTemplates).concat(taskTemplates).concat(taskTemplates).concat(taskTemplates).concat(taskTemplates).concat(taskTemplates).concat(taskTemplates).concat(taskTemplates).concat(taskTemplates).concat(taskTemplates)}/> : <Loading/>}
        </SimpleDialog>
}