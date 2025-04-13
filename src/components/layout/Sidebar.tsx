// src/components/layout/Sidebar.tsx
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LayoutDashboard, AlertTriangle, Settings, Wallet } from 'lucide-react'; // Assuming Wallet icon for branding

const Sidebar = () => {
    return (
        <aside className="hidden md:block fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-4 z-10">
            <div className="flex flex-col h-full">
                <div className="mb-6 flex items-center gap-2 p-2">
                    <Wallet className="h-6 w-6 text-primary" />
                    <h1 className="text-lg font-semibold">Solana Monitor</h1>
                </div>
                <nav className="flex flex-col gap-2 flex-grow">
                    <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link href="/">
                            <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                        </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link href="/alerts"> {/* Placeholder link */}
                            <AlertTriangle className="mr-2 h-4 w-4" /> Alerts
                        </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link href="/settings"> {/* Placeholder link */}
                            <Settings className="mr-2 h-4 w-4" /> Settings
                        </Link>
                    </Button>
                </nav>
                <Separator className="my-4" />
                {/* Add footer elements if needed */}
            </div>
        </aside>
    );
};

export default Sidebar;