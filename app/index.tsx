import {router} from "expo-router";
import Loading from "../components/Loading";
import {useSession} from "../api/supabase";

export default function Index() {
    const {session, error} = useSession();

    if (error) {
        alert(error.message);
        router.replace("login");
        return null;
    }

    if (session) {
        router.replace("main");
        return null;
    }

    return <Loading/>
};