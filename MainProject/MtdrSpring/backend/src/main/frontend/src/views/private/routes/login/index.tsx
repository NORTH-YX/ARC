import Login from "../../../public/routes/auth/login";
import { useAuthQuery } from "../../../../hooks/useAuthQuery";

const LoginPage: React.FC = () => {
  const { user, isLoading, login } = useAuthQuery();
  console.log("LoginPage");
  return <Login setUser={login} />;
};

export default LoginPage;