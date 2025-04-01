import Login from "../../../public/routes/auth/login";
import { useAuthQuery } from "../../../../hooks/useAuthQuery";

const LoginPage: React.FC = () => {
  const { login } = useAuthQuery();
  return <Login setUser={login} />;
};

export default LoginPage;