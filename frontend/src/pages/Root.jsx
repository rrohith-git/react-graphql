import React, { useEffect, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import classes from './Root.module.css';
import MainNavigation from '../components/Navigation/MainNavigation';
import authContext from '../context/auth-context';


const Root = () => {

  const navigate = useNavigate();
  const authCtx = useContext(authContext);

  useEffect(() => {
    if (!authCtx.token) {
      navigate('/auth');
    } else {
      navigate('/events');
    }
  }, [navigate, authCtx.token]);

  return (
    <div>
      <MainNavigation />
      <main className={classes['main_content']}>
        <Outlet />
      </main>
    </div>
  )
}

export default Root
