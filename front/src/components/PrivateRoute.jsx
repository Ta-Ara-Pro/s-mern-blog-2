import { useSelector } from "react-redux"
import { Outlet, Navigate } from "react-router-dom" //outlet is representing children

export default function PrivateRoute() {
    const {currentUser} = useSelector((state) => state.user)
  return currentUser ? <Outlet /> : <Navigate to='/sign-in'/>
  
}
