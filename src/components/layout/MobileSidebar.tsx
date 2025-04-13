// src/components/layout/MobileSidebar.tsx
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Menu, LayoutDashboard, AlertTriangle, Settings, Wallet } from 'lucide-react';

const MobileSidebar = () => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-4 bg-card">
                <div className="mb-6 flex items-center gap-2 p-2">
                    <Wallet className="h-6 w-6 text-primary" />
                    <h1 className="text-lg font-semibold">Solana Monitor</h1>
                </div>
                <nav className="flex flex-col gap-2">
                    <SheetClose asChild>
                        <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link href="/">
                                <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                            </Link>
                        </Button>
                    </SheetClose>
                    <SheetClose asChild>
                        <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link href="/alerts"> {/* Placeholder link */}
                                <AlertTriangle className="mr-2 h-4 w-4" /> Alerts
                            </Link>
                        </Button>
                    </SheetClose>
                    <SheetClose asChild>
                        <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link href="/settings"> {/* Placeholder link */}
                                <Settings className="mr-2 h-4 w-4" /> Settings
                            </Link>
                        </Button>
                    </SheetClose>
                </nav>
            </SheetContent>
        </Sheet>
    );
};

export default MobileSidebar;