import { navigateToUrl } from "single-spa";
import { Provider } from "react-redux";

import { FormLogin } from "./components/FormLogin";
import store from "./store";
import { AuthPage } from "./styles";

function AuthenticationApp() {
  function handleHome() {
    navigateToUrl("/home");
  }

  return (
    <AuthPage>
      <FormLogin navigateTo={handleHome} />
    </AuthPage>
  );
}

export default function Root() {
  return (
    <Provider store={store}>
      <AuthenticationApp />
    </Provider>
  );
}
