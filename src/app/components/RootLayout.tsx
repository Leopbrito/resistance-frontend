import { Outlet, useNavigate } from "react-router";
import { DevNavigation } from "./DevNavigation";
import { ScanlineOverlay } from "./ScanlineOverlay";
import { setNavigator } from "../services/navigation-service";

export function RootLayout() {
  const navigate = useNavigate();
  setNavigator(navigate);

  return (
    <>
      <Outlet />
      <ScanlineOverlay />
      <DevNavigation />
    </>
  );
}
