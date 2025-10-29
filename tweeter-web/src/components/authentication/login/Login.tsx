import './Login.css';
import 'bootstrap/dist/css/bootstrap.css';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthenticationFormLayout from '../AuthenticationFormLayout';
import useToastListener from '../../toaster/ToastListenerHook';
import AuthenicationFields from '../AuthenticationFields';
import useUserInfo from '../../userInfo/UserInfoHook';
import { LoginPresenter } from '../../../presenters/LoginPresenter';
import { AuthView } from '../../../presenters/AuthPresenter';

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const listener: AuthView = {
    updateUserInfo: updateUserInfo,
    displayErrorMessage: displayErrorMessage,
    navigate: navigate,
  };

  const presenter = useRef(new LoginPresenter(listener, props.originalUrl)).current;

  const doLogin = async () => {
    presenter.doLogin(alias, password, rememberMe);
  };

  const inputFieldGenerator = () => {
    return <AuthenicationFields setAlias={setAlias} setPassword={setPassword} doOnEnter={loginOnEnter} />;
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == 'Enter' && !checkSubmitButtonStatus()) {
      doLogin();
    }
  };

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={presenter.isLoading}
      submit={doLogin}
    />
  );
};

export default Login;
