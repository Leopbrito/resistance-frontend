import { Outlet } from "react-router";
import { DevNavigation } from "./DevNavigation";
import { ScanlineOverlay } from "./ScanlineOverlay";

export function RootLayout() {
  return (
    <>
      <Outlet />
      <ScanlineOverlay />
      <DevNavigation />
    </>
  );
}
