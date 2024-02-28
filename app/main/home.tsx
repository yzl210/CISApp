import {StyleSheet, Text} from "react-native";
import MachineOverview from "../../components/box/MachineOverview";
import {getMaintenanceNeeded, getPins, Machine} from "../../api/API";
import {AntDesign} from '@expo/vector-icons';
import React from "react";
import {ScrollView, SizableText, Tabs, View} from "tamagui";
import {AlertTriangle, Pin} from "@tamagui/lucide-icons";

export default function HomeScreen() {

    return (
        <Tabs
            defaultValue={"pinned"}
            orientation={"horizontal"}
            flexDirection={"column"}
        >
            <Tabs.List>
                <Tabs.Tab flex={1} value={"pinned"} bordered={false}>
                    <Pin scale={0.8} marginRight={"$0.5"}/>
                    <SizableText>Pinned</SizableText>
                </Tabs.Tab>
                <Tabs.Tab flex={1} value={"maintenance_needed"} bordered={false}>
                    <AlertTriangle scale={0.8} marginRight={"$1"}/>
                    <SizableText>Maintenance Needed</SizableText>
                </Tabs.Tab>
            </Tabs.List>

            <Tabs.Content value={"pinned"} alignItems={"center"}>
                <ScrollView>
                    <View gap={"$3"} flex={1} flexDirection={"row"} flexWrap={"wrap"} justifyContent={"center"}>
                        {getPins().map(machine => <MachineOverview key={machine.id} machine={machine}/>)}
                    </View>
                </ScrollView>
            </Tabs.Content>

        </Tabs>
    );

    return (
        <>


            <ScrollView horizontal={false}>
                <MachineCategory title={"Pinned"}
                                 icon={<AntDesign style={styles.icon} name="pushpino" size={24} color="black"/>}
                                 machines={getPins()}/>
                <View
                    style={{
                        borderBottomColor: 'black',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                    }}
                />
                <MachineCategory title={"Maintenance Needed"}
                                 icon={<AntDesign style={styles.icon} name="warning" size={24} color="black"/>}
                                 machines={getMaintenanceNeeded()}/>
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
    category: {
        marginVertical: 10,
        marginHorizontal: 5,
    },
    icon: {
        marginBottom: 10,
        marginRight: 5,
    },
    category_title_container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    category_title: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 28,
        marginBottom: 10,
    }
});