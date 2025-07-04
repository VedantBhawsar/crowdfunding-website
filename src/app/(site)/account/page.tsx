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
  Users,
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
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import { ProfileForm, ProfileFormSkeleton } from '@/components/profile-form';
import { useAppKitAccount } from '@reown/appkit/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import CustomWalletConnectButton from '@/components/ui/custom-wallet-connect-button';
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
import {
  Backers,
  Campaign,
  Transaction,
  User,
  NotificationSettings,
  UserOrg,
} from '@prisma/client';
import CampaignCard from '@/components/campaign/CampaignCard';
import { useTheme } from 'next-themes';
import { useCustomWallet } from '@/context/CustomWalletContext';
import WalletDetails from '@/components/ui/wallet-details';

// Updated interface to match the new schema
interface IUser extends User {
  transactions: Transaction[];
  backings: Backers[];
  createdCampaigns: Campaign[];
  wallet: {
    address: string;
    isConnected: boolean;
    caipAddress: string;
    status: string;
    balance: number;
    lastTransactionAt?: Date;
    networkId?: string;
  } | null;
  notificationSettings: NotificationSettings | null;
}

const AccountPage = () => {
  const searchParams = useSearchParams();
  const { data: session, status, update: updateSession } = useSession();
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const { theme, setTheme } = useTheme();

  function handleChangeTheme(checked: boolean) {
    setTheme(checked ? 'dark' : 'light');
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/user/data?id=${session?.user.id}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        setUser(data);
        setCampaigns(data.createdCampaigns?.filter((c: Campaign) => !c.isDeleted) || []);
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

  const handleUpdateNotificationSettings = async (settingName: string, value: boolean) => {
    try {
      const response = await fetch('/api/user/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [settingName]: value,
        }),
      });

      if (!response.ok) throw new Error('Failed to update notification settings');

      // Update local state
      if (user && user.notificationSettings) {
        setUser({
          ...user,
          notificationSettings: {
            ...user.notificationSettings,
            [settingName]: value,
          },
        });
      }

      toast.success('Notification settings updated');
    } catch (error) {
      console.error('Error updating notification settings:', error);
      toast.error('Failed to update notification settings');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 mt-10">
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
          {user?.isVerified && <Badge className="mt-2 bg-blue-500">Verified User</Badge>}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {campaigns.length > 0 ? (
                  campaigns.map((campaign: Campaign) => (
                    <CampaignCard key={campaign.id} campaign={campaign} />
                  ))
                ) : (
                  <div className="w-full col-span-3 text-center">
                    <p className="text-gray-500">No campaigns found</p>
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
                  <Switch
                    checked={user?.notificationSettings?.emailNotifications ?? false}
                    onCheckedChange={checked =>
                      handleUpdateNotificationSettings('emailNotifications', checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-gray-500">Receive real-time alerts</p>
                  </div>
                  <Switch
                    checked={user?.notificationSettings?.pushNotifications ?? false}
                    onCheckedChange={checked =>
                      handleUpdateNotificationSettings('pushNotifications', checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Backer Notifications</p>
                    <p className="text-sm text-gray-500">
                      Get notified when someone backs your campaign
                    </p>
                  </div>
                  <Switch
                    checked={user?.notificationSettings?.newBackerNotification ?? false}
                    onCheckedChange={checked =>
                      handleUpdateNotificationSettings('newBackerNotification', checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Comment Notifications</p>
                    <p className="text-sm text-gray-500">Get notified about new comments</p>
                  </div>
                  <Switch
                    checked={user?.notificationSettings?.commentNotification ?? false}
                    onCheckedChange={checked =>
                      handleUpdateNotificationSettings('commentNotification', checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Update Notifications</p>
                    <p className="text-sm text-gray-500">Get notified about campaign updates</p>
                  </div>
                  <Switch
                    checked={user?.notificationSettings?.updateNotification ?? false}
                    onCheckedChange={checked =>
                      handleUpdateNotificationSettings('updateNotification', checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Milestone Notifications</p>
                    <p className="text-sm text-gray-500">Get notified about milestone updates</p>
                  </div>
                  <Switch
                    checked={user?.notificationSettings?.milestoneNotification ?? false}
                    onCheckedChange={checked =>
                      handleUpdateNotificationSettings('milestoneNotification', checked)
                    }
                  />
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
                  <Switch checked={theme === 'dark'} onCheckedChange={handleChangeTheme} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Replace the WalletConnectionManager component with our new component
const WalletConnectionManager = ({ user }: { user: any }) => {
  const { wallet } = useCustomWallet();

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4">
        {wallet ? (
          <WalletDetails />
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 py-6">
            <p className="text-center text-sm text-muted-foreground">
              Connect your wallet to interact with blockchain features
            </p>
            <CustomWalletConnectButton />
          </div>
        )}
      </div>
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
              <div className="text-center text-gray-500">
                You haven&apos;t made any investments yet
              </div>
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
      <div className="text-center py-8 text-gray-500">
        You haven&apos;t backed any campaigns yet
      </div>
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
