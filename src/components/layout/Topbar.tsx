// src/components/layout/Topbar.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search } from 'lucide-react';
import MobileSidebar from './MobileSidebar'; // Import MobileSidebar

const Topbar = () => {
    return (
        <header className="fixed top-0 left-0 md:left-64 right-0 h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-6 z-5">
            <div className="flex items-center gap-4">
                <MobileSidebar /> {/* Mobile menu button */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search activity..."
                        className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-background" // Changed background
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Add other topbar items like notifications here if needed */}
                <Avatar className="h-9 w-9">
                    {/* Replace with actual image or dynamic initials */}
                    <AvatarImage src="/placeholder-avatar.png" alt="User Avatar" />
                    <AvatarFallback>JD</AvatarFallback>
                </Avatar>
            </div>
        </header>
    );
};

export default Topbar;