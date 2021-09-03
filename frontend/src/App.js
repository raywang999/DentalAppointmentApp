import './App.scss';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import React, { useState } from 'react';
import { useApolloClient } from '@apollo/client';

import AuthPage from './pages/Auth';
import ReferralsPage from './pages/Referrals';
import PatientsPage from './pages/Patients';
import MainNavigation from './components/navigation/MainNavigation';
import AuthContext from './context/auth-context';

export default () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState(null);
  const client = useApolloClient();

  const login = (token, userId, tokenExpiration, email) => {
    setToken(token); setUserId(userId); setEmail(email);
  }

  const logout = () => {
    setToken(null); setUserId(null); setEmail(null);
    client.clearStore();
  }

  return (
    <BrowserRouter>
      <React.Fragment>
        <AuthContext.Provider
          value={{
            token: token,
            userId: userId,
            email: email,
            login: login,
            logout: logout,
          }}
        >
          <MainNavigation />
          <main className="main-content">
            <Switch>
              {token && <Redirect from="/" to="/patients" exact />}
              {token && <Redirect from="/auth" to="/patients" exact />}
              {!token && (<Route path="/auth" component={AuthPage} />)}
              {token && (<Route path="/patients" component={PatientsPage} />)}
              {token && (<Route path="/referrals" component={ReferralsPage} />)}
              {!token && <Redirect to="/auth" exact />}
            </Switch>
          </main>
        </AuthContext.Provider>
      </React.Fragment>
    </BrowserRouter>
  );
}
