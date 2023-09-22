import { useContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import MainPage from "./components/MainPage/MainPage";
import LoginPage from "./components/LoginPage/LoginPage";
import CreateUserPage from "./components/CreateUserPage/CreateUserPage";
import { RequireAuth, useAuthUser, useSignOut } from "react-auth-kit";
import { initUser, switchUser } from "./services/account";
import ChangePasswordPage from "./components/ChangePasswordPage/ChangePasswordPage";
import SettingsPage from "./components/SettingsPage/SettingsPage";
import { HabitContext } from "./HabitProvider";
import { SettingsContext } from "./SettingsProvider";


const App = () => {
    const auth = useAuthUser();
    const [user, setUser] = useState(auth()?.username ?
        { capitalized: auth()!.username.charAt(0).toUpperCase() + auth()!.username.slice(1).toLowerCase(), lower: auth()!.username.toLowerCase()} :
        { capitalized: "", lower: "" }
    );
    initUser();

    

    const signOut = useSignOut();
    const navigate = useNavigate();
    const { loadHabits, clearHabits, setSessionExpired } = useContext(HabitContext)!;
    const { loadSettings } = useContext(SettingsContext)!;

    const logOut = () => {
        signOut();
        localStorage.removeItem('dataKey');
        clearHabits();
        setSessionExpired(false);
        navigate("/");
    }

    // username as lower case
    const logIn = async (username: string) => {
        const capitalizedName = username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
        setUser({ capitalized: capitalizedName, lower: username });
        switchUser(username);
        clearHabits();
        await loadSettings();
        await loadHabits();
    }

    // if user is already logged in, logIn(user)
    const cookieLoggedIn = auth()?.username !== undefined;
    useEffect(() => {
        if (cookieLoggedIn) logIn(auth()!.username);
    }, [])

    return (
        <Routes>
            <Route path="/" element={<LoginPage logIn={logIn} />} />
            <Route path="create" element={<CreateUserPage logIn={logIn} />} />
            <Route path="main" element={
                <RequireAuth loginPath={"/"}>
                    <MainPage user={user} logOut={logOut} />
                </RequireAuth>
            } />
            <Route path="changepassword" element={
                <RequireAuth loginPath={"/"}>
                    <ChangePasswordPage />
                </RequireAuth>
            } />
            <Route path="settings" element={
                <RequireAuth loginPath={"/"}>
                    <SettingsPage logOut={logOut} />
                </RequireAuth>
            } />
            <Route path="*" element={404} />
        </Routes>
    )
}

export default App;
