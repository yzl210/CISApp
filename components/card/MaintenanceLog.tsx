import {Log} from "../../api/API";
import {StyleSheet} from "react-native";
import {Card, H2, Separator, Text, XStack} from "tamagui";

export default function MaintenanceLog({log}: { log: Log }) {

    let time = new Date(log.time);
    let timeString = time.toLocaleDateString() + " " + time.toLocaleTimeString();

    return <Card elevate bordered margin={"$2"} maxWidth={500}>
        <Card.Header>
            <H2 numberOfLines={1} textAlign={"center"}>{log.title}</H2>
            <XStack justifyContent={"space-between"}>
                <Text numberOfLines={1} marginHorizontal={10}>{timeString}</Text>
                <Text numberOfLines={1} marginHorizontal={10}>{log.author}</Text>
            </XStack>
            <Separator/>
        </Card.Header>
        <Text numberOfLines={10} marginVertical={5} marginHorizontal={10} textAlign={"center"}
              fontSize={18}>{log.content}</Text>
        <Card.Background/>
    </Card>
}

const styles = StyleSheet.create({
    container: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        width: 380,
        elevation: 6,
        borderRadius: 10,
        backgroundColor: '#fff',
        margin: 10,
        alignSelf: 'center',
    },
    title: {
        fontSize: 30,
        textAlign: 'center',
        marginHorizontal: 10,
        marginTop: 5,
    },
    subtitleContainer: {
        flexDirection: 'row',
        width: "100%",
        justifyContent: 'space-between',
    },
    subtitle: {
        fontSize: 15,
        color: 'gray',
        marginVertical: 3,
    },
    content: {
        fontSize: 18,
        marginVertical: 5,
        marginHorizontal: 10,
        textAlign: 'center',
    }
});