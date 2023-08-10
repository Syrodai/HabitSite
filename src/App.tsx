import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage/MainPage";
import LoginPage from "./components/LoginPage/LoginPage";

const App = () => {
    //const [user, setUser] = useState("Sample User");
    const user = "Sample User";



    //<BrowserRouter>
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="main" element={<MainPage user={user} />} />
                <Route path="*" element={404} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;
