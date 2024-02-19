import {Tabs} from "expo-router";

export default function HomeLayout() {
    return <Tabs>
        <Tabs.Screen name="home" options={{
            title: "Home",
            href: "main/home",
        }}/>
        <Tabs.Screen name="manage" options={{
            title: "Manage",
            href: "main/manage",
        }}/>
    </Tabs>;
}