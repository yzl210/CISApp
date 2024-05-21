import React from "react";
import {Popover, PopoverProps} from "tamagui";

export default function SimplePopover({trigger, children, open, setOpen, props}: {
    trigger: React.ReactNode,
    children: React.ReactNode,
    open: boolean,
    setOpen: (open: boolean) => void,
    props?: PopoverProps
}) {
    return <Popover allowFlip placement={"bottom"} size={"$5"} open={open} onOpenChange={setOpen} {...props}>
        <Popover.Trigger asChild>
            {trigger}
        </Popover.Trigger>
        <Popover.Content elevate>
            <Popover.Arrow borderWidth={1}/>
            {children}
        </Popover.Content>
    </Popover>;
}