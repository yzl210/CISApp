import {Tabs} from "expo-router";

export default function HomeLayout() {
    return <Tabs>
        <Tabs.Screen name="home" options={{
            title: "Home",
            href: "/home",
        }}/>
    </Tabs>;
}