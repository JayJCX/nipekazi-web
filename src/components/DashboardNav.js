"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../utils/supabase";

export default function DashboardNav({ activePath = "/dashboard" }) {
  const { t } = useLanguage();
  const [role, setRole] = useState(null);

  useEffect(() => {
    async function fetchRole() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (data) setRole(data.role);
      }
    }
    fetchRole();
  }, []);

  let links = [];
  if (role === 'admin') {
    links = [
      { name: "System Overview", path: "/dashboard" },
      { name: "Manage Users", path: "/dashboard/admin/users" },
      { name: "Monitor Jobs", path: "/dashboard/admin/jobs" },
      { name: "System Settings", path: "/settings" }
    ];
  } else {
    links = [
      { name: t("nav_home") || "Home", path: "/dashboard" },
      { name: t("nav_profile") || "Profile", path: "/profile" },
      { name: t("nav_jobs") || "Jobs", path: "/dashboard/jobs" },
      { name: t("nav_applications") || "Applications", path: "/dashboard/applications" },
      { name: t("nav_contracts") || "Contracts", path: "/dashboard/contracts" },
      { name: t("nav_wallet") || "Wallet", path: "/dashboard/wallet" },
      { name: t("nav_report") || "Report", path: "/dashboard/report" },
      { name: t("nav_notifications") || "Notifications", path: "/notifications" },
      { name: t("nav_settings") || "Settings", path: "/settings" }
    ];
  }

  return (
    <nav style={{ 
      display: 'flex', 
      gap: '1rem', 
      padding: '1rem', 
      background: 'rgba(0,0,0,0.3)', 
      borderRadius: '12px', 
      marginBottom: '2rem',
      border: '1px solid var(--glass-border)',
      flexWrap: 'wrap',
      justifyContent: 'center'
    }}>
      {links.map(link => (
        <Link 
          key={link.path} 
          href={link.path}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            color: activePath === link.path ? 'var(--color-primary)' : 'var(--text-muted)',
            background: activePath === link.path ? 'rgba(37, 211, 102, 0.1)' : 'transparent',
            textDecoration: 'none',
            fontWeight: activePath === link.path ? 'bold' : 'normal',
            transition: 'all 0.3s ease'
          }}
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
}
