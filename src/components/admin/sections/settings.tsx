import { FC } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Bell, Globe, Lock, Mail, Shield, Zap } from 'lucide-react'

export const Settings: FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">System Settings</h3>
                <p className="text-sm text-muted-foreground">
                    Manage your system preferences and configurations
                </p>
            </div>
            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            General Settings
                        </CardTitle>
                        <CardDescription>
                            Configure your application's general settings
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="app-name">Application Name</Label>
                            <Input
                                id="app-name"
                                defaultValue="Zenxianie"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="timezone">Timezone</Label>
                            <Select defaultValue="asia/manila">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select timezone" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="asia/manila">Asia/Manila (GMT+8)</SelectItem>
                                    <SelectItem value="asia/singapore">Asia/Singapore (GMT+8)</SelectItem>
                                    <SelectItem value="asia/tokyo">Asia/Tokyo (GMT+9)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Maintenance Mode</Label>
                                <p className="text-sm text-muted-foreground">
                                    Enable maintenance mode to restrict access
                                </p>
                            </div>
                            <Switch />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            Email Settings
                        </CardTitle>
                        <CardDescription>
                            Configure your email notification settings
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="smtp-host">SMTP Host</Label>
                            <Input
                                id="smtp-host"
                                placeholder="smtp.example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="smtp-port">SMTP Port</Label>
                            <Input
                                id="smtp-port"
                                type="number"
                                placeholder="587"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="smtp-username">SMTP Username</Label>
                            <Input
                                id="smtp-username"
                                placeholder="your-email@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="smtp-password">SMTP Password</Label>
                            <Input
                                id="smtp-password"
                                type="password"
                                placeholder="••••••••"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Notification Settings
                        </CardTitle>
                        <CardDescription>
                            Configure your notification preferences
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Email Notifications</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive email notifications for important events
                                </p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Reservation Alerts</Label>
                                <p className="text-sm text-muted-foreground">
                                    Get notified about new reservations
                                </p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>System Updates</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive notifications about system updates
                                </p>
                            </div>
                            <Switch />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Security Settings
                        </CardTitle>
                        <CardDescription>
                            Manage your security preferences
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Two-Factor Authentication</Label>
                                <p className="text-sm text-muted-foreground">
                                    Enable 2FA for additional security
                                </p>
                            </div>
                            <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Session Timeout</Label>
                                <p className="text-sm text-muted-foreground">
                                    Automatically log out after inactivity
                                </p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="session-duration">Session Duration (minutes)</Label>
                            <Input
                                id="session-duration"
                                type="number"
                                defaultValue="30"
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
                </div>
            </div>
        </div>
    )
} 