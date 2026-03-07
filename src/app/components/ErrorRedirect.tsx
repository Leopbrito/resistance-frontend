import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function ErrorRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/", { replace: true });
  }, []);

  return null;
}