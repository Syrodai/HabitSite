import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage/MainPage";
import LoginPage from "./components/LoginPage/LoginPage";
import CreateUserPage from "./components/CreateUserPage/CreateUserPage";
import { RequireAuth, useAuthUser } from "react-auth-kit";

const App = () => {
    const auth = useAuthUser();
    const [user, setUser] = useState(auth()?.username ?
        { capitalized: auth().username.charAt(0).toUpperCase() + auth().username.slice(1).toLowerCase(), original: auth().username} :
        { capitalized: "", original: "" }
    );

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage setUser={setUser} />} />
                <Route path="create" element={<CreateUserPage setUser={setUser} />} />
                <Route path="main" element={
                    <RequireAuth loginPath={"/"}>
                        <MainPage user={user} />
                    </RequireAuth>
                } />
                <Route path="*" element={404} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;
