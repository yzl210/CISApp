import {Dialog, Sheet} from "tamagui";
import React from "react";

type SimpleDialog = {
    open: boolean,
    onOpenChange: (open: boolean) => void
    trigger: React.ReactNode,
    children?: React.ReactNode[]
}

let i = 0;

export default function SimpleDialog({open, onOpenChange, trigger, children}: SimpleDialog) {
    return <Dialog modal open={open} onOpenChange={onOpenChange}>
        <Dialog.Adapt when="sm" platform="touch">
            <Dialog.Sheet animation="medium" zIndex={200000 + i++} modal disableDrag>
                <Dialog.Sheet.Frame padding="$4" gap="$4">
                    <Dialog.Adapt.Contents/>
                </Dialog.Sheet.Frame>
                <Sheet.Overlay
                    animation="lazy"
                    enterStyle={{opacity: 0}}
                    exitStyle={{opacity: 0}}
                />
            </Dialog.Sheet>
        </Dialog.Adapt>
        <Dialog.Trigger asChild>
            {trigger}
        </Dialog.Trigger>
        <Dialog.Portal>
            <Dialog.Overlay
                key="overlay"
                animation="slow"
                opacity={0.5}
                enterStyle={{opacity: 0}}
                exitStyle={{opacity: 0}}
            />
            <Dialog.Content bordered
                            elevate
                            animateOnly={['transform', 'opacity']}
                            animation={[
                                'quicker',
                                {
                                    opacity: {
                                        overshootClamping: true,
                                    },
                                },
                            ]}
                            enterStyle={{x: 0, y: -20, opacity: 0, scale: 0.9}}
                            exitStyle={{x: 0, y: 10, opacity: 0, scale: 0.95}}>
                {children}
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog>
}