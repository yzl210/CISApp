import {Log} from "../../api/API";
import {StyleSheet, Text, View} from "react-native";
import Split from "../Split";

export default function MaintenanceLog({log}: { log: Log }) {

    let time = new Date(log.time);
    let timeString = time.toLocaleDateString() + " " + time.toLocaleTimeString();

    return <View style={styles.container}>
        <Text numberOfLines={1} style={styles.title}>{log.title}</Text>
        <View style={styles.subtitleContainer}>
            <Text numberOfLines={1} style={[styles.subtitle, {marginLeft: 10}]}>{timeString}</Text>
            <Text numberOfLines={1} style={[styles.subtitle, {marginRight: 10}]}>{log.author}</Text>
        </View>
        <Split style={{marginTop: 5}}/>
        <Text numberOfLines={10} style={styles.content}>{log.content}</Text>
        <Split style={{marginTop: 5}}/>
    </View>
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
        fontFamily: 'Inter_600SemiBold',
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