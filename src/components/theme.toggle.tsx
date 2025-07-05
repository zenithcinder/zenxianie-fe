'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/theme.provider'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Check } from 'lucide-react'

export function ModeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem 
                    onClick={() => setTheme('light')}
                    className="flex items-center justify-between"
                >
                    Light
                    {theme === 'light' && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                    onClick={() => setTheme('dark')}
                    className="flex items-center justify-between"
                >
                    Dark
                    {theme === 'dark' && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                    onClick={() => setTheme('system')}
                    className="flex items-center justify-between"
                >
                    System
                    {theme === 'system' && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
