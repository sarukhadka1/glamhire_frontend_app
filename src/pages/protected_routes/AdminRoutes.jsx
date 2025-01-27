import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const AdminRoutes = () => {
    // get user information
    const user= JSON.parse(localStorage.getItem('user'))

    // check User
    // check isAdmin = true
    // if true : Access all the routes of Admin(Outlet)
    // if false : Navigate to login

    return user != null && user.isAdmin ? <Outlet/>
    :<Navigate to={'/login'}/>
  
}

export default AdminRoutes
