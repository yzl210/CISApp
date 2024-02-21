import {
    FlatList,
    Image,
    Pressable,
    SafeAreaView, ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import React from "react";
import {getMaintenanceNeeded, getPins, Machine} from "../../api/API";
import MachineOverview from "../../components/box/MachineOverview";
import {AntDesign} from "@expo/vector-icons";

const [username, setUsername] = React.useState('');
const [password, setPassword] = React.useState('');

export default function Browse() {
    return (
        <>
        <ScrollView horizontal={false}>
            <SafeAreaView style={styles.textBox}>
                <TextInput
                    style={[styles.input, {color: 'grey'}]}
                    numberOfLines={1}
                    onChangeText={setUsername}
                    value={username}
                    placeholder="Enter machine name to search"
                />
            </SafeAreaView>
            <View
                style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                }}
            />
            <View>

            </View>
        </ScrollView>
    </>
    );
}

function MachineCategory({title, icon, machines}: { title: string, icon: React.JSX.Element, machines: Machine[] }) {
    let machineOverviews = machines.map(machine =>
        <View key={machine.id} style={{marginRight: 10, marginBottom: 15}}><MachineOverview machine={machine}/></View>);

    return (
        <View style={styles.category}>
            <View style={styles.category_title_container}>
                {icon}
                <Text style={styles.category_title}>{title}</Text>
            </View>
            <ScrollView horizontal={true}>
                {machineOverviews}
            </ScrollView>
        </View>

    );
}

const styles = StyleSheet.create({
    textBox: {
        marginTop: '1%',
        alignItems: 'center',
    },
    input: {
        height: 50,
        width: '80%',
        alignSelf: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
    },
    category_title: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 28,
        marginBottom: '5%',
    },
    category_title_container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    category: {
        marginVertical: '1%',
        marginHorizontal: '1%',
    },
    icon: {
        marginBottom: '1%',
        marginRight: '1%',
    },
});