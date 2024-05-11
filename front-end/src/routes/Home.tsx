import {useAuth} from "../auth/AuthProvider";
export default function Home(){ 
    const auth = useAuth();
    return <h1>Home de {auth.getUser()?.username || ""}</h1>
}