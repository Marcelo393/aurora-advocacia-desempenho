import { useEffect, useState } from "react";
import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { DemoBar } from "@/components/flowdesk/DemoBar";
import { useAuth, readAuthFromStorage } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const u = readAuthFromStorage();
    if (!u) throw redirect({ to: "/login" });
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && ready && !user) {
      void navigate({ to: "/login" });
    }
  }, [hydrated, ready, user, navigate]);

  return (
    <div className="flex h-full min-h-screen flex-col bg-background text-foreground">
      <DemoBar />
      <div className="flex min-h-0 flex-1 flex-col">
        <Outlet />
      </div>
    </div>
  );
}
