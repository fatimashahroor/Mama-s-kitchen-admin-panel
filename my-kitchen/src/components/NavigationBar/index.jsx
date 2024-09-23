import "./styles.css";
import React from "react";
import { useNavigate, useLocation } from 'react-router-dom';
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  return (
    <div>
        <h3>Mama's Kitchen</h3>
        <nav className='nav-bar'>
            <ul>
                <li
                    className={location.pathname === '/users' ? 'active-link' : ''}
                    onClick={() => navigate('/users')}> Manage Users
                </li>
                <li
                    className={location.pathname === '/roles' ? 'active-link' : ''}
                    onClick={() => navigate('/roles')}> Manage Roles
                </li>
            </ul>
        </nav>
   </div>
  );

};

export default Navbar;