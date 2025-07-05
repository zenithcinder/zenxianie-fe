import { useState, useEffect } from 'react'
import { useAdminAuth } from '@/context/admin/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useNavigate } from 'react-router-dom'
import { Command } from 'lucide-react'
import { ModeToggle } from '@/components/theme.toggle'

export default function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAdminAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await login(email, password)
            navigate('/admin')
        } catch (error) {
            console.error('Login failed:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [isFading, setIsFading] = useState(false);
    const texts = [
        "A modern parking management system designed to streamline parking operations in [REDACTED].",
        "Real-time monitoring of parking spaces for efficient management.",
        "Comprehensive analytics to optimize parking facility utilization.",
        "Efficient reservation management for seamless user experience."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setIsFading(true);
            setTimeout(() => {
                setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
                setIsFading(false);
            }, 500); // Duration of fade-out
        }, 5000); // Change text every 20 seconds

        return () => clearInterval(interval);
    }, [texts.length]);

    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
                <div className="flex flex-col gap-6">
                    <Card className="overflow-hidden p-0">
                        <CardContent className="grid p-0 md:grid-cols-2">
                            <form
                                className="flex flex-col p-6 md:p-8 lg:h-[640px] "
                                onSubmit={handleSubmit}
                            >
                                <div className="flex flex-col gap-6 flex-1 lg:mb-0 mb-4">
                                    <div className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex flex-row items-center gap-2 mt-2">
                                        <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg shrink-0">
                                            <Command className="size-4" />
                                        </div>
                                        <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                                            <span className="truncate font-medium">
                                                {import.meta.env.VITE_APP_TITLE || ''}
                                            </span>
                                            <span className="truncate text-xs">
                                                {import.meta.env.VITE_SHORT_APP_DESC || ''}
                                            </span>
                                        </div>

                                        <div>
                                            <ModeToggle />
                                        </div>
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="text"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">Password</Label>
                                            <a
                                                href="#"
                                                className="ml-auto text-sm underline-offset-2 hover:underline"
                                            >
                                                Forgot your password?
                                            </a>
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        Login
                                    </Button>
                                </div>
                                <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground mt-4 bg flex-1">
                                    <p>Hi! Welcome, <strong>Super Admin!</strong> </p>
                                    <p
                                        className={`text-center transition-opacity duration-500 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}
                                    >
                                        {texts[currentTextIndex]}
                                    </p>
                                </div>
                            </form>
                            <div className="bg-muted relative hidden md:block">
                                <img
                                    src="/img/img_1.png"
                                    alt="Image"
                                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                                />
                            </div>
                        </CardContent>
                    </Card>
                    {/* <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                        By clicking continue, you agree to our <a href="#">Terms of Service</a> and{' '}
                        <a href="#">Privacy Policy</a>.
                    </div> */}
                </div>
            </div>
        </div>
    )
}
