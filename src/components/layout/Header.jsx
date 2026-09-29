import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Bell, ChevronDown, LogOut, Menu, User } from "lucide-react";

import logo from "@/assets/logo.svg";
import { useAuth } from "@/hooks/useAuth";
import Badge from "@/components/common/Badge";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import ThemeToggle from "@/components/common/ThemeToggle";

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the user menu when clicking anywhere else
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-line bg-panel px-3 sm:px-4 md:px-6">
      {/* Left: menu button (mobile) + logo + title */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-muted hover:bg-line lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <img src={logo} alt="" className="h-9 w-9 shrink-0 rounded-lg sm:h-10 sm:w-10" />
        <div className="hidden min-w-0 leading-tight sm:block">
          <p className="truncate font-semibold text-fg">{t("app.title")}</p>
          <p className="text-xs text-muted">{t("app.subtitle")}</p>
        </div>
      </div>

      {/* Right: language + theme + notifications + user menu */}
      <div className="flex items-center gap-1 sm:gap-2">
        <LanguageSwitcher className="hidden sm:block" />
        <ThemeToggle />

        <button className="relative rounded-lg p-2 text-muted hover:bg-line" aria-label="Notifications">
          <Bell size={20} />
          <span className="absolute end-2 top-2 h-2 w-2 rounded-full bg-brand-light" />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-line"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white">
              <User size={18} />
            </span>
            <span className="hidden text-sm font-medium capitalize text-fg md:block">
              {user?.role}
            </span>
            <ChevronDown size={16} className="text-muted" />
          </button>

          {open && (
            <div className="absolute end-0 z-50 mt-2 w-64 rounded-xl border border-line bg-card p-2 shadow-xl">
              <div className="border-b border-line px-3 pb-3 pt-2">
                <p className="font-medium text-fg">{user?.name}</p>
                <p className="truncate text-xs text-muted">{user?.email}</p>
                <Badge color="green" className="mt-2 capitalize">
                  {user?.role}
                </Badge>
              </div>

              <div className="mt-2 sm:hidden">
                <LanguageSwitcher className="w-full [&_select]:w-full" />
              </div>

              <button
                onClick={handleLogout}
                className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:bg-line hover:text-fg"
              >
                <LogOut size={16} />
                {t("nav.logout")}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}