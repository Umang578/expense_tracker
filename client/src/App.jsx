import { BrowserRouter, Route, Routes } from "react-router"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import PrivateRoutes from "./components/PrivateRoutes"
import PublicRoutes from "./components/PublicRoutes"
import Navbar from "./components/Navbar"
import Budgets from "./pages/Budgets"
import Expenses from "./pages/Expenses"
import BudgetSummary from "./pages/BudgetSummary"


function App() {

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={
            <PrivateRoutes>
              <Home />
            </PrivateRoutes>
          } />
          <Route path="/login" element={
            <PublicRoutes>
              <Login />
            </PublicRoutes>
          } />
          <Route path="/register" element={
            <PublicRoutes>
              <Register />
            </PublicRoutes>
          } />
          <Route path="/budgets" element={
            <PrivateRoutes>
              <Budgets />
            </PrivateRoutes>
          } />
          <Route path="/expenses" element={
            <PrivateRoutes>
              <Expenses />
            </PrivateRoutes>
          } />
          <Route path="/summary" element={
            <PrivateRoutes>
              <BudgetSummary />
            </PrivateRoutes>
          } />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
