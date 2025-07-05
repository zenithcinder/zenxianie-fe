import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUserAuth } from '@/context/user/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { api } from '@/lib/apis/api.base'
import { API_ENDPOINTS, BASE_API_URL, RegisterRequest } from '@/lib/apis/api.constants'
import { Command } from 'lucide-react'
import { ModeToggle } from '@/components/theme.toggle'

export default function Register() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState<RegisterRequest>({
        email: '',
        username: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: '',
        role: 'user' // Default role for registration
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            // Validate passwords match
            if (formData.password !== formData.password2) {
                throw new Error('Passwords do not match')
            }

            // Make API call to register
            const response = await api.post(
                `${BASE_API_URL}${API_ENDPOINTS.AUTH.REGISTER}`,
                formData
            )

            if (response.data) {
                // Registration successful, redirect to login
                navigate('/login', {
                    state: {
                        message: 'Registration successful! Please login with your credentials.'
                    }
                })
            }
        } catch (error: any) {
            console.error('Registration failed:', error)
            setError(
                error.response?.data?.detail ||
                    error.response?.data?.message ||
                    error.message ||
                    'Registration failed. Please try again.'
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-svh w-full flex-col items-center justify-center ">
            <Card className="w-[400px]">
                <CardHeader className="flex flex-col gap-4">
                    <div className="flex justify-center gap-2 md:justify-start w-full">
                        <div className="w-full justify-between flex flex-row items-center gap-2 mt-2">
                            <div className="flex items-center gap-2">
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
                            </div>

                            <div>
                                <ModeToggle />
                            </div>
                        </div>
                    </div>
                    <Separator orientation='horizontal'/>
                    <div>
                        <CardTitle>Create an Account</CardTitle>
                        <CardDescription>
                            Register to start using Zenxianie
                        </CardDescription>
                    </div>
                </CardHeader>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="first_name">First Name</Label>
                                    <Input
                                        id="first_name"
                                        name="first_name"
                                        placeholder="Enter your first name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="last_name">Last Name</Label>
                                    <Input
                                        id="last_name"
                                        name="last_name"
                                        placeholder="Enter your last name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    placeholder="Choose a username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Choose a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password2">Confirm Password</Label>
                                <Input
                                    id="password2"
                                    name="password2"
                                    type="password"
                                    placeholder="Confirm your password"
                                    value={formData.password2}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? 'Creating account...' : 'Register'}
                        </Button>
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary hover:underline">
                                Login
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
