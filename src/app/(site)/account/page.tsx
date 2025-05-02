'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Wallet,
  Settings,
  Globe,
  Shield,
  Bell,
  LineChart,
  Copy,
  Upload,
  Clock,
  ExternalLink,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { redirect, useSearchParams } from 'next/navigation';
import { ProfileForm, ProfileFormSkeleton } from '@/components/profile-form';
import { useAppKitAccount } from '@reown/appkit/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import WalletConnectButton from '@/components/ui/wallet-connect-button';
import { useSession } from 'next-auth/react';
import { CldUploadButton } from 'next-cloudinary';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Backers, Campaign, Transaction, User } from '@prisma/client';
import CampaignCard from '@/components/campaign/CampaignCard';

interface IUser extends User {
  transactions: Transaction[];
  backings: Backers[];
  createdCampaigns: Campaign[];
}

const AccountPage = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');
  const { data: session, status, update: updateSession } = useSession();
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const url = new URL('/api/user/data', window.location.origin);
        url.searchParams.set('id', userId || '');
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        setUser(data);
        setCampaigns(data.createdCampaigns);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchUserData();
    }
  }, [session?.user]);

  if (status === 'loading' || isLoading) {
    return <div>Loading...</div>;
  }

  if (!session?.user) {
    redirect('/signin');
  }

  const handleProfileUpdate = async (data: {
    displayName: string;
    bio: string;
    location: string;
  }) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      const updatedUser = await response.json();

      await updateSession({
        user: {
          ...session.user,
          ...updatedUser,
        },
      });

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleAvatarUpdate = async (result: any) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: result.info.secure_url,
        }),
      });

      if (!response.ok) throw new Error('Failed to upload avatar');

      const data = await response.json();
      console.log(data);
      await updateSession({
        ...session,
        user: {
          ...session.user,
          image: data.url,
        },
      });
      toast.success('Avatar updated successfully');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to update avatar');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-6 mb-8">
        <div className="relative group">
          <Avatar className="h-24 w-24">
            <AvatarImage className="object-cover" src={user?.image as string} alt="User Avatar" />
            <AvatarFallback>{user?.displayName?.[0] || user?.name?.[0] || 'UN'}</AvatarFallback>
          </Avatar>
          {user?.id === session.user.id && (
            <CldUploadButton
              options={{ maxFiles: 1 }}
              onSuccess={handleAvatarUpdate}
              uploadPreset="iug38uvw"
            >
              <Upload size={20} className="text-green-500 dark:text-green-400" />
            </CldUploadButton>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user?.displayName || user?.name || 'Anonymous'}</h1>
          <p className="capitalize text-sm text-gray-500 dark:text-gray-400">{user?.role}</p>
          {user?.location && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user?.location}</p>
          )}
          {user?.id !== session.user.id && (
            <p className="text-sm text-muted-foreground mt-3">{user?.bio}</p>
          )}
        </div>
      </div>
      <Tabs
        defaultValue={user?.id === session.user.id ? 'profile' : 'campaigns'}
        className="space-y-4"
      >
        <TabsList>
          {user?.id === session.user.id && (
            <>
              <TabsTrigger value="profile" className="flex gap-2">
                <Settings className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="investments" className="flex gap-2">
                <LineChart className="h-4 w-4" />
                Investments
              </TabsTrigger>
            </>
          )}

          <TabsTrigger value="campaigns" className="flex gap-2">
            <LineChart className="h-4 w-4" />
            Campaigns
          </TabsTrigger>

          {session.user.id === user?.id && (
            <>
              <TabsTrigger value="backings" className="flex gap-2">
                <Wallet className="h-4 w-4" />
                Backings
              </TabsTrigger>
              <TabsTrigger value="transactions" className="flex gap-2">
                <Clock className="h-4 w-4" />
                Transactions
              </TabsTrigger>
              <TabsTrigger value="wallet" className="flex gap-2">
                <Wallet className="h-4 w-4" />
                Wallet
              </TabsTrigger>
            </>
          )}
          {user?.id === session.user.id && (
            <TabsTrigger value="settings" className="flex gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          )}
        </TabsList>

        {user?.id === session.user.id && (
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Profile Information</h2>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <ProfileFormSkeleton />
                ) : (
                  <ProfileForm
                    initialData={{
                      displayName: user?.displayName ?? '',
                      bio: user?.bio ?? '',
                      location: user?.location ?? '',
                      email: user?.email ?? '',
                    }}
                    onSubmit={handleProfileUpdate}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="investments">
          <UserInvestments userData={user} />
        </TabsContent>

        <TabsContent value="backings">
          <BackingsList backings={user?.backings} />
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionsList transactions={user?.transactions} />
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">
                {user?.id === session.user.id ? 'Your Campaigns' : 'Campaigns'}
              </h2>
            </CardHeader>
            <CardContent>
              <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {campaigns.length > 0 ? (
                  campaigns.map((campaign: Campaign) => (
                    <CampaignCard key={campaign.id} campaign={campaign} />
                  ))
                ) : (
                  <div className="w-full col-span-3  text-center">
                    <p className=" text-gray-500">No campaigns found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallet">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Wallet Information</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <WalletConnectionManager user={user} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-6">
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
                      Get updates about your{' '}
                      {user?.role === 'INVESTOR' ? 'investments' : 'campaigns'}
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Browser Notifications</p>
                    <p className="text-sm text-gray-500">Receive real-time alerts</p>
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
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
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
                  <Globe className="h-5 w-5" />
                  <h2 className="text-xl font-semibold">Preferences</h2>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Language</p>
                    <p className="text-sm text-muted-foreground">Select your preferred language</p>
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
                    <p className="text-sm text-muted-foreground">Toggle dark mode theme</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// New component for managing wallet connection
const WalletConnectionManager = ({ user }: { user: any }) => {
  const { address, isConnected, caipAddress, status } = useAppKitAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>(
    'disconnected'
  );
  const [storedWalletData, setStoredWalletData] = useState<{
    address: string | null;
    isConnected: boolean;
    caipAddress: string | null;
  } | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);

  // Fetch the saved wallet status on component mount
  useEffect(() => {
    const fetchWalletStatus = async () => {
      try {
        const response = await fetch('/api/wallet/status');
        if (!response.ok) throw new Error('Failed to fetch wallet status');

        const data = await response.json();
        setStoredWalletData(data);

        if (data.isConnected && !isConnected) {
          console.log('Previous wallet connection detected');
        }

        setInitialLoad(false);
      } catch (error) {
        console.error('Error fetching wallet status:', error);
        setInitialLoad(false);
      }
    };

    fetchWalletStatus();
  }, []);

  // Update database when connection state changes
  useEffect(() => {
    const updateWalletConnection = async () => {
      try {
        // Skip during initial loading
        if (initialLoad) return;

        // Only update if there's a change in connection status
        if (
          storedWalletData?.isConnected !== isConnected ||
          storedWalletData?.address !== address ||
          storedWalletData?.caipAddress !== caipAddress
        ) {
          const response = await fetch('/api/wallet/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              address: address || null,
              isConnected: !!isConnected,
              caipAddress: caipAddress || null,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to update wallet status');
          }

          const data = await response.json();
          setStoredWalletData(data.data);

          // Don't show toast on first load
          if (!initialLoad) {
            if (isConnected) {
              toast.success('Wallet connection saved');
            } else {
              toast.info('Wallet disconnected');
            }
          }
        }

        setConnectionStatus(isConnected ? 'connected' : 'disconnected');
      } catch (error) {
        console.error('Wallet connection error:', error);
        setConnectionStatus('error');
        toast.error('Failed to update wallet status');
      }
    };

    // Only run if we have valid connection data
    if (typeof isConnected !== 'undefined') {
      updateWalletConnection();
    }
  }, [isConnected, address, caipAddress, initialLoad]);

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      // Update wallet status in database
      const response = await fetch('/api/wallet/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: null,
          isConnected: false,
          caipAddress: null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to disconnect wallet');
      }

      setConnectionStatus('disconnected');
      setStoredWalletData(null);
      toast.success('Wallet disconnected successfully');

      // Force page reload to completely disconnect the wallet
      window.location.reload();
    } catch (error) {
      console.error('Wallet disconnection error:', error);
      toast.error('Failed to disconnect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Connection Status</Label>
        <div className="flex items-center gap-2">
          <Badge
            variant={
              initialLoad
                ? 'outline'
                : connectionStatus === 'connected'
                  ? 'default'
                  : connectionStatus === 'error'
                    ? 'destructive'
                    : 'secondary'
            }
          >
            {initialLoad
              ? 'Loading...'
              : connectionStatus === 'connected'
                ? 'Connected'
                : connectionStatus === 'error'
                  ? 'Error'
                  : 'Disconnected'}
          </Badge>
        </div>
      </div>

      {address && (
        <div className="space-y-2">
          <Label>Wallet Address</Label>
          <div className="flex items-center gap-2">
            <Input value={address} disabled />
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                navigator.clipboard.writeText(address);
                toast.success('Address copied to clipboard');
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {!isConnected ? (
          <WalletConnectButton />
        ) : (
          <Button variant="destructive" onClick={handleDisconnect} disabled={isLoading}>
            {isLoading ? 'Disconnecting...' : 'Disconnect Wallet'}
          </Button>
        )}
      </div>

      {connectionStatus === 'error' && (
        <div className="text-sm text-destructive">
          There was an error with your wallet connection. Please try again.
        </div>
      )}
    </div>
  );
};

function UserInvestments({ userData }: { userData: any }) {
  // Calculate total investments and amount
  const userStats = {
    backings: userData.backings || [],
    investments: userData.backings?.length || 0,
    totalInvested:
      userData.backings?.reduce((sum: number, backing: any) => sum + backing.amount, 0) || 0,
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Investment Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle>Your Investments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {userStats.backings.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Total Investments</span>
                  <span className="font-semibold">{userStats.investments}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Total Amount Invested</span>
                  <span className="font-semibold">{userStats.totalInvested.toFixed(6)} ETH</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">You haven&apos;t made any investments yet</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function BackingsList({ backings }: { backings: any }) {
  if (!backings || backings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">You haven&apos;t backed any campaigns yet</div>
    );
  }

  return (
    <div className="space-y-6">
      {backings.map((backing: any) => (
        <div
          key={backing.id}
          className="flex flex-col md:flex-row gap-4 border-b border-gray-200 pb-6 last:border-0"
        >
          <div className="w-full md:w-24 lg:w-32 flex-shrink-0">
            {backing.campaign?.images?.[0] ? (
              <img
                src={backing.campaign.images[0]}
                alt={backing.campaign.title}
                className="w-full h-24 object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-24 bg-gray-200 rounded-md flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </div>

          <div className="flex-1">
            <h3 className="font-medium mb-1 truncate">
              {backing.campaign?.title || 'Unknown Campaign'}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-5 w-5">
                <AvatarImage
                  src={backing.campaign?.creatorAvatar}
                  alt={backing.campaign?.creatorName}
                />
                <AvatarFallback className="text-xs">
                  {backing.campaign?.creatorName?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm text-gray-500 truncate">
                {backing.campaign?.creatorName || 'Unknown Creator'}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mt-3">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock size={16} />
                <span>{new Date(backing.createdAt).toLocaleDateString()}</span>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                {backing.amount.toFixed(6)} ETH
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TransactionsList({ transactions }: { transactions: any }) {
  if (!transactions || transactions.length === 0) {
    return <div className="text-center py-8 text-gray-500">No transactions found</div>;
  }

  return (
    <Table>
      <TableCaption>A list of your recent transactions</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Transaction Hash</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((tx: any) => (
          <TableRow key={tx.id}>
            <TableCell className="font-medium">{new Date(tx.createdAt).toLocaleString()}</TableCell>
            <TableCell>{tx.amount.toFixed(6)} ETH</TableCell>
            <TableCell>
              <Badge
                variant={
                  tx.status === 'COMPLETED'
                    ? 'default'
                    : tx.status === 'PENDING'
                      ? 'outline'
                      : 'secondary'
                }
                className={tx.status === 'COMPLETED' ? 'bg-green-500 hover:bg-green-600' : ''}
              >
                {tx.status}
              </Badge>
            </TableCell>
            <TableCell>
              <a
                href={`https://etherscan.io/tx/${tx.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800 flex items-center gap-1"
              >
                <span className="truncate max-w-xs">
                  {tx.txHash.substring(0, 10)}...
                  {tx.txHash.substring(tx.txHash.length - 8)}
                </span>
                <ExternalLink size={14} />
              </a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default AccountPage;
