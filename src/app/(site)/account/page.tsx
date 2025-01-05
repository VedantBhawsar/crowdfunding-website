import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Wallet,
  Settings,
  History,
  Globe,
  CreditCard,
  Shield,
  Bell,
  LinkIcon,
  LineChart,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const investedProjects = [
  {
    id: 1,
    name: "Green Energy Initiative",
    invested: 0.5,
    totalRaised: 15.8,
    goal: 20,
    backers: 234,
    daysLeft: 12,
    progress: 79,
  },
  {
    id: 2,
    name: "Decentralized Education Platform",
    invested: 0.3,
    totalRaised: 8.4,
    goal: 10,
    backers: 156,
    daysLeft: 5,
    progress: 84,
  },
  {
    id: 3,
    name: "Community Solar Project",
    invested: 0.8,
    totalRaised: 25.2,
    goal: 30,
    backers: 412,
    daysLeft: 20,
    progress: 84,
  },
];

const AccountPage = () => {
  return (
    <div className="">
      <div className="flex items-center gap-6 mb-8">
        <Avatar className="h-24 w-24">
          <AvatarImage src="/api/placeholder/150/150" />
          <AvatarFallback>UN</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">Nehali jaiswal</h1>
          <p className="text-gray-500">Member since 2024</p>
        </div>
      </div>

      <Tabs defaultValue="wallet" className="space-y-4">
        <TabsList>
          <TabsTrigger value="wallet" className="flex gap-2">
            <Wallet className="h-4 w-4" />
            Wallet
          </TabsTrigger>
          <TabsTrigger value="investments" className="flex gap-2">
            <LineChart className="h-4 w-4" />
            Investments
          </TabsTrigger>
          <TabsTrigger value="history" className="flex gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>

          <TabsTrigger value="settings" className="flex gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wallet">
          <Card className="mb-8">
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-2">
                <h2 className="text-xl font-bold">Connect Your Wallet</h2>
                <p className="text-gray-500">
                  Connect your wallet to start funding projects
                </p>
              </div>
              <Button className="flex gap-2">
                <LinkIcon className="h-4 w-4" />
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Wallet Balance</h2>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-3xl font-bold">2.45 ETH</p>
                  <p className="text-gray-500">≈ $4,890 USD</p>
                </div>
                <div className="space-x-2">
                  <Button>Deposit</Button>
                  <Button variant="outline">Withdraw</Button>
                </div>
              </div>
              <div className="space-y-4">
                <Input placeholder="Enter wallet address" />
                <div className="text-sm text-gray-500">
                  Connected wallet: 0x1234...5678
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Transaction History</h2>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="investments">Investments</SelectItem>
                      <SelectItem value="withdrawals">Withdrawals</SelectItem>
                      <SelectItem value="deposits">Deposits</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Search transactions" className="w-48" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Hash</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      date: "2024-03-15 14:30",
                      type: "Investment",
                      project: "Green Energy Initiative",
                      amount: "+0.5 ETH",
                      status: "Confirmed",
                      hash: "0x1234...5678",
                    },
                    {
                      date: "2024-03-14 09:15",
                      type: "Deposit",
                      project: "-",
                      amount: "+1.0 ETH",
                      status: "Confirmed",
                      hash: "0x8765...4321",
                    },
                    {
                      date: "2024-03-13 16:45",
                      type: "Withdrawal",
                      project: "-",
                      amount: "-0.3 ETH",
                      status: "Pending",
                      hash: "0x9876...1234",
                    },
                  ].map((tx, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono">{tx.date}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            tx.type === "Investment"
                              ? "default"
                              : tx.type === "Deposit"
                              ? "outline"
                              : "secondary"
                          }
                        >
                          {tx.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{tx.project}</TableCell>
                      <TableCell
                        className={
                          tx.amount.startsWith("+")
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {tx.amount}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            tx.status === "Confirmed" ? "outline" : "secondary"
                          }
                        >
                          {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="font-mono">
                          {tx.hash}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investments">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Your Investments</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {investedProjects.map((project) => (
                  <div
                    key={project.id}
                    className="border rounded-lg p-4 space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{project.name}</h3>
                        <p className="text-sm text-gray-500">
                          Your investment: {project.invested} ETH
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Project
                      </Button>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>{project.totalRaised} ETH raised</span>
                        <span>Goal: {project.goal} ETH</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>{project.backers} backers</span>
                      <span>{project.daysLeft} days left</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Profile Settings</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Display Name</label>
                  <Input defaultValue="John Doe" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input defaultValue="john@example.com" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Bio</label>
                  <Input
                    defaultValue="Crypto enthusiast and early adopter"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  <h2 className="text-xl font-semibold">Notifications</h2>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-500">
                      Get updates about your investments
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Browser Notifications</p>
                    <p className="text-sm text-gray-500">
                      Receive real-time alerts
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <h2 className="text-xl font-semibold">Security</h2>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="outline">Change Password</Button>
                  <Button variant="outline">Manage Connected Wallets</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  <h2 className="text-xl font-semibold">Payment Methods</h2>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Default Currency</p>
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred currency
                    </p>
                  </div>
                  <Select defaultValue="usd">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD</SelectItem>
                      <SelectItem value="eur">EUR</SelectItem>
                      <SelectItem value="gbp">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline">Add Payment Method</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  <h2 className="text-xl font-semibold">Preferences</h2>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Language</p>
                    <p className="text-sm text-muted-foreground">
                      Select your preferred language
                    </p>
                  </div>
                  <Select defaultValue="en">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">
                      Toggle dark mode theme
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end">
              <Button className="w-fit">Save All Changes</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountPage;
