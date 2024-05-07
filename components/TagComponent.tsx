import {Tag} from "../api/machine";
import {Text, XStack} from "tamagui";
import {Dot} from "@tamagui/lucide-icons";
import {newShade} from "../api/utils";
import {TouchableOpacity} from "react-native";
import React from "react";


export default function TagComponent({tag}: { tag: Tag }) {
    let color = "#" + tag.color;

    return <XStack backgroundColor={color} borderRadius={8} padding={"$1"} alignItems={"center"}>
        <Dot color={newShade(color, -40)} scale={2.5}/>
        <Text marginRight={"$2.5"}>
            {tag.name}
        </Text>
    </XStack>;
}

export function TouchableTagComponent({tag, onPress}: { tag: Tag, onPress: (tag: Tag) => void }) {
    return <TouchableOpacity onPress={() => onPress(tag)}>
        <TagComponent tag={tag}/>
    </TouchableOpacity>
}