"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Bell, PlusCircle } from "lucide-react";

export default function Navbar() {
    const pathname = usePathname();

    const links = [
        { href: "/dashboard", label: "Home", icon: Home },
        { href: "/requests", label: "Requests", icon: Bell },
        { href: "/raise-request", label: "Raise", icon: PlusCircle },
        { href: "/profile", label: "Profile", icon: User },
    ];

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="nav-logo">
                    Rudhir-a
                </div>
                <div className="flex justify-between w-full md:w-auto md:gap-4">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`nav-link ${isActive ? "active" : ""}`}
                            >
                                <Icon size={24} />
                                <span>{link.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
