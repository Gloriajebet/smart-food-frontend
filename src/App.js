import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import AddFood from './pages/addfood';
import Inventory from './pages/inventory';
import Alerts from './pages/alerts';
import Meals from './pages/meals';
import Reports from './pages/reports';
import ProtectedRoute from './components/ProtectedRoute';
import EditFood from './pages/editfood';
import AddRecipe from './pages/addrecipe';
import RecipeDetails from './pages/recipedetails';
import ForgotPassword from './pages/forgotpassword';
import Profile from './pages/profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route 
        path="/" 
        element={<Login />} 
        />
        <Route
        path="/register" 
        element={<Register />} 
        />
        <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
          <Dashboard />
          </ProtectedRoute>
          }
           />
        <Route
         path="/add-food" 
         element={
          <ProtectedRoute>
         <AddFood />
         </ProtectedRoute>
         } 
         />
        <Route path="/edit-food/:id" element={<AddFood />} />
        <Route
         path="/inventory" 
         element={
          <ProtectedRoute>
         <Inventory />
         </ProtectedRoute>
        }
         />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/meals" element={<Meals />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/edit-food/:id" element={<EditFood />} />
        <Route
         path="/add-recipe" 
         element={
          <ProtectedRoute>
         <AddRecipe />
         </ProtectedRoute>
        }
          />
        <Route
         path="/recipe/:id" 
         element={
          <ProtectedRoute>
         <RecipeDetails />
         </ProtectedRoute>
        }
          />
        <Route
         path="/forgot-password" 
         element={<ForgotPassword />}
          />
        <Route
         path="/profile"
         element={
          <ProtectedRoute>
         <Profile />
         </ProtectedRoute>
        }
         />
      </Routes>
    </Router>
  );
}

export default App;