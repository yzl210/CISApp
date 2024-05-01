import {Redirect} from "expo-router";
import Loading from "../components/Loading";
import {useSession} from "../api/supabase";

export default function Index() {
    const {session, error} = useSession();

    if (error) {
        return <Redirect href={"login"}/>;
    } else if (session) {
        return <Redirect href={"main"}/>;
    }
    return <Loading/>
};