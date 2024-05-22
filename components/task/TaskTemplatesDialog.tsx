import SimpleDialog from "../SimpleDialog";
import React, {useState} from "react";
import {useIsWeb} from "../../api/utils";
import {Button, Dialog, Separator} from "tamagui";
import {useTaskTemplates} from "../../api/tasks";
import Loading from "../Loading";
import TaskTemplateOverview from "./TaskTemplateOverview";
import {FlatList} from "react-native";
import {Plus, X} from "@tamagui/lucide-icons";
import TaskTemplateEditDialog from "./TaskTemplateEditDialog";

export default function TaskTemplatesDialog({machine_id, children}: { machine_id: string, children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const isWeb = useIsWeb();
    const {taskTemplates} = useTaskTemplates(machine_id);

    let openChange = (open: boolean) => {
        setOpen(open);
    }

    return <SimpleDialog open={open} onOpenChange={openChange} trigger={children}>
        <Dialog.Title>
            Task Templates
        </Dialog.Title>
        {taskTemplates ? <FlatList contentContainerStyle={{padding: 5, gap: 5}}
                                   renderItem={item => <TaskTemplateOverview template={item.item}/>}
                                   data={taskTemplates}/> : <Loading/>}
        <Button circular position={"absolute"} top={"$3"} right={"$3"} size={"$2"} icon={X}
                onPress={() => openChange(false)}/>
        <Separator marginVertical={"$2"}/>
        <TaskTemplateEditDialog machine_id={machine_id} create>
            <Button icon={Plus}/>
        </TaskTemplateEditDialog>
    </SimpleDialog>
}