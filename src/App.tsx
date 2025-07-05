import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme.provider'
import AuthProvider from '@/components/auth.provider'
import Layout from '@/layout/layout'
import UserDashboardLayout from '@/layout/dashboard-layout'
import AdminLayout from '@/layout/admin-layout'
import UserPrivateRoute from '@/components/user/private-route'
import AdminPrivateRoute from '@/components/admin/private-route'
import Login from '@/pages/user/user.login'
import Register from '@/pages/user/user.register'
import AdminLogin from '@/pages/admin/admin.login'
import UserDashboard from '@/pages/user/user.dashboard'
import AdminDashboard from '@/pages/admin/admin.dashboard'

// Configure QueryClient with better defaults for RESTful API
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <Router>
                    <AuthProvider>
                        <Routes>
                            <Route path="/" element={<Login />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            <Route path="/admin/login" element={<AdminLogin />} />

                            {/* Main Layout */}
                            <Route element={<Layout />}>
                                {/* Protected User Routes */}
                                <Route element={<UserPrivateRoute />}>
                                    <Route path="/user" element={<UserDashboardLayout />}>
                                        <Route index element={<UserDashboard />} />
                                    </Route>
                                </Route>

                                {/* Protected Admin Routes */}
                                <Route element={<AdminPrivateRoute />}>
                                    <Route path="/admin" element={<AdminLayout />}>
                                        <Route index element={<AdminDashboard />} />
                                    </Route>
                                </Route>
                            </Route>
                        </Routes>
                    </AuthProvider>
                    <Toaster />
                </Router>
            </ThemeProvider>
        </QueryClientProvider>
    )
}

export default App
