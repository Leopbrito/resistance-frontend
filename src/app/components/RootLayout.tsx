import { Outlet, useNavigate } from "react-router";
import { Toaster } from "sonner";
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
      <Toaster 
        theme="dark" 
        toastOptions={{
          style: {
            background: '#1A1F28',
            border: '1px solid #DC143C',
            color: '#fff',
          },
          className: 'font-[\'Inter\']',
        }}
      />
    </>
  );
}
