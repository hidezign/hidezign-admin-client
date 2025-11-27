import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import { Toaster } from "sonner";
import AllProjects from "./pages/Projects/AllProjects";
import CreateProject from "./pages/Projects/CreateProject";
import { RootState } from "./Redux/store";

export default function App() {
    // const dispatch = useDispatch();
    const { token, role } = useSelector((state: RootState) => state.auth);

    return (
        <>
            <Router>
                <ScrollToTop />
                <Routes>
                    {/* Dashboard Layout */}
                    {token && role === "admin" && (
                        <Route element={<AppLayout />}>
                            <Route index path="/" element={<Home />} />

                            {/* Others Page */}
                            <Route path="/profile" element={<UserProfiles />} />

                            {/* My Pages */}
                            <Route path="/projects" element={<AllProjects />} />
                            <Route
                                path="/create-project"
                                element={<CreateProject />}
                            />
                            <Route
                                path="/project-details/:id"
                                element={<CreateProject />}
                            />
                        </Route>
                    )}

                    {/* Auth Layout */}
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />

                    {!token && (
                        <Route
                            path="*"
                            element={<Navigate to="/signin" replace />}
                        />
                    )}

                    {/* Fallback Route */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
            <Toaster />
        </>
    );
}
