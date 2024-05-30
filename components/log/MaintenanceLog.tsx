import {Card, H2, Separator, Text, View, XStack} from "tamagui";
import {Log} from "../../api/logs";
import {useUser} from "../../api/API";
import {LoadingCard} from "../Loading";
import {Pressable, useWindowDimensions} from "react-native";
import MaintenanceLogDetailsDialog from "./MaintenanceLogDetailsDialog";
import RenderHTML from "react-native-render-html";

export default function MaintenanceLog({log}: { log: Log }) {
    const {user} = useUser(log.created_by);
    const {width} = useWindowDimensions();


    if (!user)
        return <LoadingCard/>


    let time = new Date(log.created_at);
    let timeString = time.toLocaleDateString() + " " + time.toLocaleTimeString();

    return <Card elevate bordered>
        <Card.Header>
            <H2 numberOfLines={1} textAlign={"center"}>{log.title}</H2>
            <XStack justifyContent={"space-between"}>
                <Text numberOfLines={1} marginHorizontal={10}>{timeString}</Text>
                <Text numberOfLines={1} marginHorizontal={10}>{user.name}</Text>
            </XStack>
            <Separator marginTop={"$3"}/>
        </Card.Header>
        <View marginHorizontal={15} maxHeight={500} overflow={"hidden"}>
            <RenderHTML source={{html: log.content}} contentWidth={width - 30}/>
        </View>
        <MaintenanceLogDetailsDialog log={log}>
            <Pressable>
                <Text textAlign={"right"} marginVertical={"$2"} marginRight={"$2"} color={"blue"}>Show More...</Text>
            </Pressable>
        </MaintenanceLogDetailsDialog>
        <Card.Background/>
    </Card>
}