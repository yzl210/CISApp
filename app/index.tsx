import {router} from "expo-router";
import Loading from "../components/Loading";
import {useSession} from "../api/supabase";

export default function Index() {
    const {session, error} = useSession();

    if (error) {
        router.replace("login");
    } else if (session) {
        router.replace("main");
    }

    return <Loading/>
};