import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage/MainPage";
import LoginPage from "./components/LoginPage/LoginPage";
import { RequireAuth } from "react-auth-kit";

const App = () => {
    //const [user, setUser] = useState("Sample User");
    const user = "Sample User";



    //<BrowserRouter>
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
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
