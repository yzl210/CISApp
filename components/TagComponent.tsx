import {Tag} from "../api/machine";
import {Text, XStack} from "tamagui";
import {Dot} from "@tamagui/lucide-icons";


export default function TagComponent({tag}: { tag: Tag }) {
    let color = "#" + tag.color.toString(16);
    const newShade = (hexColor: string, magnitude: number) => {
        hexColor = hexColor.replace(`#`, ``);
        if (hexColor.length === 6) {
            const decimalColor = parseInt(hexColor, 16);
            let r = (decimalColor >> 16) + magnitude;
            r > 255 && (r = 255);
            r < 0 && (r = 0);
            let g = (decimalColor & 0x0000ff) + magnitude;
            g > 255 && (g = 255);
            g < 0 && (g = 0);
            let b = ((decimalColor >> 8) & 0x00ff) + magnitude;
            b > 255 && (b = 255);
            b < 0 && (b = 0);
            return `#${(g | (b << 8) | (r << 16)).toString(16)}`;
        } else {
            return hexColor;
        }
    };


    return (
        <XStack backgroundColor={color} borderRadius={8} padding={"$1"} alignItems={"center"}>
            <Dot color={newShade(color, -40)} scale={2.5}>
            </Dot>
            <Text marginRight={"$2.5"}>
                {tag.name}
            </Text>
        </XStack>
    );
}