import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./components/pages/Home/Home";
import Jobs from "./components/pages/Jobs/Jobs";
import Browse from "./components/pages/Browse/Browse";
import Profile from "./components/pages/Profile/Profile";
import JobsDescription from "./components/pages/Jobs/JobsDescription";
import Companies from "./components/admin/Companies";
import CompanyCreate from "./components/admin/CompanyCreate";
import CompanySetup from "./components/admin/CompanySetup";
import CompanyView from "./components/admin/CompanyView";
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from "./components/admin/PostJob";
import JobSetup from "./components/admin/JobSetup";
import Applicants from "./components/admin/Applicants";
import AdminProtectedRoute from "./components/admin/ProtectedRoutes";
import SavedJobs from "./components/pages/SavedJobs/SavedJobs";
import UserProtectedRoute from "./components/shared/ProtectedRoute";
import Courses from "./components/pages/Courses/Courses";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/jobs",
    element: <Jobs />,
  },
  {
    path: "/description/:id",
    element: <JobsDescription />,
  },
  {
    path: "/browse",
    element: <Browse />,
  },
  {
    path: "/profile",
    element: <UserProtectedRoute>
      <Profile />
    </UserProtectedRoute>,
  },
  {
    path: "/saved-jobs",
    element: <UserProtectedRoute>
      <SavedJobs />
    </UserProtectedRoute>,
  },
  {
    path: "/courses",
    element: <UserProtectedRoute>
      <Courses />
    </UserProtectedRoute>,
  },
  // admin side routes
  {
    path: "/admin/companies",
    element: (
      <AdminProtectedRoute>
        <Companies />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/companies/create",
    element: (
      <AdminProtectedRoute>
        <CompanyCreate />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/companies/:id",
    element: (
      <AdminProtectedRoute>
        <CompanySetup />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/companies/view/:id",
    element: (
      <AdminProtectedRoute>
        <CompanyView />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs",
    element: (
      <AdminProtectedRoute>
        <AdminJobs />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs/create",
    element: (
      <AdminProtectedRoute>
        <PostJob />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs/:id",
    element: (
      <AdminProtectedRoute>
        <JobSetup />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: (
      <AdminProtectedRoute>
        <Applicants />
      </AdminProtectedRoute>
    ),
  },
]);

function App() {
  return <RouterProvider router={appRouter} />;
}

export default App;
