import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { Toaster } from "sonner";
import { DevNavigation } from "./DevNavigation";
import { ScanlineOverlay } from "./ScanlineOverlay";
import { setNavigator } from "../services/navigation-service";

export function RootLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigator(navigate);
    return () => setNavigator(undefined);
  }, [navigate]);

  return (
    <>
      <Outlet />
      <ScanlineOverlay />
      <DevNavigation />
      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: "var(--color-surface)",
            border: "1px solid var(--color-spy)",
            color: "#fff",
          },
          className: "font-body",
        }}
      />
    </>
  );
}
