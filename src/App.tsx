import { useContext, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import MainPage from "./components/MainPage/MainPage";
import LoginPage from "./components/LoginPage/LoginPage";
import CreateUserPage from "./components/CreateUserPage/CreateUserPage";
import { RequireAuth, useAuthUser, useSignOut } from "react-auth-kit";
import { initUser } from "./services/account";
import ChangePasswordPage from "./components/ChangePasswordPage/ChangePasswordPage";
import SettingsPage from "./components/SettingsPage/SettingsPage";
import { HabitContext } from "./HabitProvider";

const App = () => {
    const auth = useAuthUser();
    const [user, setUser] = useState(auth()?.username ?
        { capitalized: auth().username.charAt(0).toUpperCase() + auth().username.slice(1).toLowerCase(), lower: auth().username.toLowerCase()} :
        { capitalized: "", lower: "" }
    );
    initUser();

    const signOut = useSignOut();
    const navigate = useNavigate();
    const { clearHabits, setSessionExpired } = useContext(HabitContext)!;

    const logOut = () => {
        signOut();
        localStorage.removeItem('dataKey');
        clearHabits();
        setSessionExpired(false);
        navigate("/");
    }

    return (
        <Routes>
            <Route path="/" element={<LoginPage setUser={setUser} />} />
            <Route path="create" element={<CreateUserPage setUser={setUser} />} />
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
