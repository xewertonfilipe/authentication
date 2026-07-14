import { navigateToUrl } from "single-spa";

import { FormLogin } from "./components/FormLogin";
import { AuthPage } from "./styles";

export default function Root(props) {
  function handleHome() {
    navigateToUrl("/home");
  }

  return (
    <AuthPage>
      <FormLogin navigateTo={handleHome} />
    </AuthPage>
  );
}
