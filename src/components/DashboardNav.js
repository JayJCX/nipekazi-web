"use client";

import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

export default function DashboardNav({ activePath = "/dashboard" }) {
  const { t } = useLanguage();

  const links = [
    { name: t("nav_home"), path: "/dashboard" },
    { name: t("nav_profile"), path: "/profile" },
    { name: t("nav_jobs"), path: "/dashboard/jobs" },
    { name: t("nav_applications"), path: "/dashboard/applications" },
    { name: t("nav_contracts"), path: "/dashboard/contracts" },
    { name: t("nav_wallet"), path: "/dashboard/wallet" },
    { name: t("nav_report"), path: "/dashboard/report" },
    { name: t("nav_notifications"), path: "/notifications" },
    { name: t("nav_settings"), path: "/settings" }
  ];

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
