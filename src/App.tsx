import './App.css';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { HomePage } from './layouts/HomePage/HomePage';
import { SearchCoursesPage } from './layouts/SearchCoursesPage/SearchCoursesPage';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { CourseRegisterPage } from './layouts/CourseRegisterPage/CourseRegisterPage';
import { UserPage } from './layouts/UserPage/UserPage';
import { UserProfile } from './layouts/UserProfile/UserProfile';
import { oktaConfig } from './lib/oktaConfig';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { LoginCallback, Security } from '@okta/okta-react';
import LoginWidget from './Auth/LoginWidget';

const oktaAuth = new OktaAuth(oktaConfig);

export const App = () => {

  const customAuthHandler = () => {
    history.push('/login');
  }

  const history = useHistory();

  const restoreOriginalUri = async (_oktaAuth: any, originalUri: any) => {
    history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
  };

  return (
    <div className='d-flex flex-column min-vh-100'>
      <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri} onAuthRequired={customAuthHandler}>
        <Navbar />
        <div className='flex-grow-1'>
          <Switch>
            <Route path='/' exact>
              <Redirect to='/home' />
            </Route>
            <Route path='/home'>
              <HomePage />
            </Route>
            <Route path='/search'>
              <SearchCoursesPage />
            </Route>
            <Route path='/register/:courseId'>
              <CourseRegisterPage />
            </Route>
            <Route path='/user/courses'>
              <UserPage />
            </Route>
            <Route path='/user/profile'>
              <UserProfile />
            </Route>
            <Route path='/login' render={
              () => <LoginWidget config={oktaConfig} />
            } />
            <Route path='/login/callback' component={LoginCallback} />
          </Switch>
        </div>
        <Footer />
      </Security>
    </div>
  );
}
