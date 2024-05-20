import React, {useState} from "react";
import SimplePopover from "../SimplePopover";
import {Button, Popover, YStack} from "tamagui";
import TaskEditDialog from "./TaskEditDialog";

export default function NewTaskPopover({children, machine_id} : {children: React.ReactNode, machine_id: string}) {
    const [open, setOpen] = useState(false);



    let close = () => {
        setOpen(false);
    }

    let content = <YStack gap={"$2.5"}>
        <TaskEditDialog machine_id={machine_id} create>
            {open ? <Button onPress={close}>New Task/Task Template</Button> : null}
        </TaskEditDialog>
        {open ? <Button>Task Templates</Button> : null}
    </YStack>;

    return <Popover allowFlip placement={"bottom"} size={"$5"} open={open} onOpenChange={setOpen} keepChildrenMounted>
        <Popover.Trigger asChild>
            {children}
        </Popover.Trigger>
        <Popover.Content elevate>
            <Popover.Arrow borderWidth={1}/>
            {content}
        </Popover.Content>
    </Popover>;
}