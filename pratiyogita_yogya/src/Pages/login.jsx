import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthModal from "../components/AuthModal";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const nextParam = params.get("next");
  const normalizedNextParam =
    nextParam === "/checkeligibility" ? "/check-eligibility" : nextParam;
  const redirectPath =
    normalizedNextParam && normalizedNextParam.startsWith("/") && !normalizedNextParam.startsWith("//")
      ? normalizedNextParam
      : "/";

  return (
    <AuthModal
      isOpen={true}
      onClose={() => navigate(redirectPath)}
      initialMode="login"
    />
  );
};

export default Login;