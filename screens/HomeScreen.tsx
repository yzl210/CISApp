import {ScrollView, StyleSheet, Text, View} from "react-native";
import MachineOverview from "../components/MachineOverview";

export default function HomeScreen() {


    let machines = []
    for (let i = 0; i < 10; i++) {
        machines.push(<View style={{marginRight: 10, marginBottom: 15}}><MachineOverview id={"1"}/></View>);
    }


    return (
        <View>
            <View style={styles.todo}>
                <Text style={styles.todo_title}>Maintenance Required</Text>
                <ScrollView horizontal={true}>
                    {machines}
                </ScrollView>
            </View>
            <View style={styles.todo}>
                <Text style={styles.todo_title}>Tracked</Text>
                <ScrollView horizontal={true}>
                    {machines}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    todo: {
        margin: 10,
    },
    todo_title: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 28,
        marginBottom: 10,
    }
});