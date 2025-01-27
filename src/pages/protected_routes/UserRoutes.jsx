import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const UserRoutes = () => {

    // get user information
    const user= JSON.parse(localStorage.getItem('user'))

    // check User
    // check isAdmin = true
    // if true : Access all the routes of Admin(Outlet)
    // if false : Navigate to login
return user? <Outlet/>:<Navigate to={'/login'}/>
}
  

export default UserRoutes
