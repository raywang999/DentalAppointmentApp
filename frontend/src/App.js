import './App.css';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthPage from './pages/Auth';
import BookingsPage from './pages/Bookings';
import EventsPage from './pages/Events';
import PatientsPage from './pages/Patients';
import MainNavigation from './components/navigation/MainNavigation';
import React from 'react';
import AuthContext from './context/auth-context';

class App extends React.Component {
  state = {
    token: null,
    userId: null
  }

  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId });
  }

  logout = () => {
    this.setState({ token: null, userId: null });
  }

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              userId: this.state.userId,
              login: this.login,
              logout: this.logout
            }}
          >
            <MainNavigation />
            <main className="main-content">
              <Switch>
                {/*!-- {this.state.token && <Redirect from="/" to="/events" exact />}
                {this.state.token && <Redirect from="/auth" to="/events" exact />}/*/}
                {this.state.token && <Redirect from="/" to="/patients" exact />}
                {this.state.token && <Redirect from="/auth" to="/patients" exact />}
                {!this.state.token && (<Route path="/auth" component={AuthPage} />)}
                {this.state.token && (<Route path="/patients" component={PatientsPage} />)}
                {this.state.token && (<Route path="/bookings" component={BookingsPage} />)}
                {!this.state.token && <Redirect to="/auth" exact />}
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
