import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import './App.css';

import AuthPage from './pages/Auth';
import BookingsPage from './pages/Bookings';
import EventsPage from './pages/Events';

function App() {
  return (
    <BrowserRouter>
    <Switch>
        <Redirect from="/" to="/auth" exact />
        <Route path="/auth" component={AuthPage} />
        <Route path="/events" component={EventsPage} />
        <Route path="/bookings" component={BookingsPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
