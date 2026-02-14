"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Bell, PlusCircle, Menu, X, Sun, Moon, LogOut } from "lucide-react";
import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import { api } from "@/services/api";

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) {
            setTheme(storedTheme);
            document.documentElement.classList.toggle("dark", storedTheme === "dark");
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            setTheme("dark");
            document.documentElement.classList.add("dark");
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle("dark");
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        api.logout();
        router.push("/");
    };

    const links = [
        { href: "/dashboard", label: "Home", icon: Home },
        { href: "/requests", label: "Requests", icon: Bell },
        { href: "/raise-request", label: "Raise Request", icon: PlusCircle },
        { href: "/profile", label: "Profile", icon: User },
    ];

    return (
        <nav className="navbar">
            <div className="nav-container">
                {/* Left: Hamburger (Mobile) + Logo */}
                <div className="nav-left">
                    <button className="hamburger-btn" onClick={toggleMenu} aria-label="Toggle menu">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <div className="nav-logo">
                        Rudhir-a
                    </div>
                </div>

                {/* Center: Desktop Links */}
                <div className="nav-links-desktop">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`nav-link ${pathname === link.href ? "active" : ""}`}
                        >
                            <link.icon size={18} />
                            <span>{link.label}</span>
                        </Link>
                    ))}
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>

                {/* Right: Theme Toggle */}
                <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                    {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu ${isOpen ? "open" : ""}`}>
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`mobile-nav-link ${pathname === link.href ? "active" : ""}`}
                    >
                        <link.icon size={20} />
                        <span>{link.label}</span>
                    </Link>
                ))}
                <button onClick={handleLogout} className="mobile-nav-link" style={{ color: 'var(--primary-red)' }}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </nav>
    );
}
