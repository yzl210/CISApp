import {router} from "expo-router";
import {useEffect} from "react";
import {getSession} from "../api/API";
import Loading from "../components/Loading";

export default function Index() {
    useEffect(() => {
        getSession()
            .then((session) => {
                router.replace(session ? "main" : "login");
            }).catch(() => {
            router.replace("login");
        });
    }, []);


    return <Loading/>
};