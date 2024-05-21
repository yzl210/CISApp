import React from "react";
import {
    AlertDialog,
    AlertDialogDescriptionProps,
    AlertDialogTitleProps,
    Button,
    ButtonProps,
    XStack,
    YStack
} from "tamagui";
import {Trash, XCircle} from "@tamagui/lucide-icons";

type ConfirmDialogType = {
    title: string;
    titleProps?: AlertDialogTitleProps;
    description?: string;
    descriptionProps?: AlertDialogDescriptionProps;
    confirmButtonText?: string;
    confirmButtonProps?: ButtonProps
    cancelButtonText?: string;
    cancelButtonProps?: ButtonProps
    children: React.ReactNode;
}

export default function ConfirmDialog({
                                          title,
                                          titleProps,
                                          description,
                                          descriptionProps,
                                          confirmButtonText = "Confirm",
                                          confirmButtonProps = {theme: "green"},
                                          cancelButtonText = "Cancel",
                                          cancelButtonProps,
                                          children
                                      }: ConfirmDialogType) {
    return <AlertDialog native>
        <AlertDialog.Trigger asChild>
            {children}
        </AlertDialog.Trigger>
        <AlertDialog.Portal>
            <AlertDialog.Overlay
                key="overlay"
                animation="quick"
                opacity={0.5}
                enterStyle={{opacity: 0}}
                exitStyle={{opacity: 0}}
            />
            <AlertDialog.Content
                bordered
                elevate
                key="content"
                animation={[
                    'quick',
                    {
                        opacity: {
                            overshootClamping: true,
                        },
                    },
                ]}
                enterStyle={{x: 0, y: -20, opacity: 0, scale: 0.9}}
                exitStyle={{x: 0, y: 10, opacity: 0, scale: 0.95}}
                x={0}
                scale={1}
                opacity={1}
                y={0}
            >
                <YStack gap>
                    <AlertDialog.Title {...titleProps}>{title}</AlertDialog.Title>
                    <AlertDialog.Description {...descriptionProps}>
                        {description}
                    </AlertDialog.Description>
                    <XStack gap={"$3"} justifyContent="flex-end">
                        <AlertDialog.Cancel asChild>
                            <Button {...cancelButtonProps}>{cancelButtonText}</Button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action asChild>
                            <Button {...confirmButtonProps}>{confirmButtonText}</Button>
                        </AlertDialog.Action>
                    </XStack>
                </YStack>
            </AlertDialog.Content>
        </AlertDialog.Portal>
    </AlertDialog>
}

type DeleteConfirmDialogType = {
    title: string;
    description: string;
    doDelete: () => void;
    children: React.ReactNode;
}

export function DeleteConfirmDialog({title, description, doDelete, children}: DeleteConfirmDialogType) {
    return <ConfirmDialog title={"Delete " + title}
                          titleProps={{color: "red"}}
                          description={"Are you sure you want to delete " + description + "?"}
                          confirmButtonText={"Delete"}
                          confirmButtonProps={{icon: Trash, theme: "red", onPress: doDelete}}
                          cancelButtonProps={{icon: XCircle}}
    >
        {children}
    </ConfirmDialog>
}