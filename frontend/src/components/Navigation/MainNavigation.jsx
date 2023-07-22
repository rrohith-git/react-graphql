import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import classes from './MainNavigation.module.css';
import authContext from '../../context/auth-context';

const MainNavigation = () => {
    const authCtx = useContext(authContext);

    return (
        <header className={classes['main-navigation']}>
            <div className={classes['main-navigation__logo']}>
                <Link to='/events'><h1>EasyEvent</h1></Link>
            </div>
            <nav className={classes['main-navigation__items']}>
                <ul>
                    <li>
                        <NavLink className={({ isActive }) => isActive ? classes['main-navigation__items_active'] : ''} to={'/events'}>
                            Events
                        </NavLink>
                    </li>
                    {authCtx.token && <li>
                        <NavLink className={({ isActive }) => isActive ? classes['main-navigation__items_active'] : ''} to={'/bookings'}>
                            Bookings
                        </NavLink>
                    </li>}
                    {!authCtx.token
                        ? <li>
                            <NavLink className={({ isActive }) => isActive ? classes['main-navigation__items_active'] : ''} to={'/auth'}>
                                Signup/Login
                            </NavLink>
                        </li>
                        : <li onClick={() => authCtx.logout()}>
                            <span>Logout</span>
                        </li>
                    }
                </ul>
            </nav>
        </header>
    )
}

export default MainNavigation
