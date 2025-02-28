import './App.css';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Login from './components/authentication/login/Login';
import Register from './components/authentication/register/Register';
import MainLayout from './components/mainLayout/MainLayout';
import Toaster from './components/toaster/Toaster';
import useUserInfo from './components/userInfo/UserInfoHook';
import { FolloweePresenter } from './presenters/FolloweePresenter';
import { FollowerPresenter } from './presenters/FollowerPresenter';
import { FeedPresenter } from './presenters/FeedPresenter';
import { StoryPresenter } from './presenters/StoryPresenter';
import { PagedItemView } from './presenters/PagedItemPresenter';
import { Status, User } from 'tweeter-shared';
import ItemScroller from './components/mainLayout/ItemScroller';
import StatusItem from './components/statusItem/StatusItem';
import UserItem from './components/userItem/UserItem';

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>{isAuthenticated() ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />}</BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />
        <Route
          path="feed"
          element={
            <ItemScroller
              key={'feed'}
              presenterGenerator={(view: PagedItemView<Status>) => new FeedPresenter(view)}
              renderItem={(item: Status) => <StatusItem item={item} />}
            />
          }
        />
        <Route
          path="story"
          element={
            <ItemScroller
              key={'story'}
              presenterGenerator={(view: PagedItemView<Status>) => new StoryPresenter(view)}
              renderItem={(item: Status) => <StatusItem item={item} />}
            />
          }
        />
        <Route
          path="followees"
          element={
            <ItemScroller
              key={'followees'}
              presenterGenerator={(view: PagedItemView<User>) => new FolloweePresenter(view)}
              renderItem={(item: User) => <UserItem item={item} />}
            />
          }
        />
        <Route
          path="followers"
          element={
            <ItemScroller
              key={'followers'}
              presenterGenerator={(view: PagedItemView<User>) => new FollowerPresenter(view)}
              renderItem={(item: User) => <UserItem item={item} />}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
