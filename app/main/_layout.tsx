import {Tabs} from "expo-router";

export default function MainLayout() {
    return <Tabs>
        <Tabs.Screen name="home" options={{
            title: "Home",
            href: "main/home",
        }}/>
        <Tabs.Screen name="browse" options={{
            title: "Browse",
            href: "main/browse",
        }}/>
        <Tabs.Screen name="manage" options={{
            title: "Manage",
            href: "main/manage",
        }}/>
    </Tabs>;
}