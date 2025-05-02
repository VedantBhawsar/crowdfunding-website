'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Check, Upload, Rocket, HandCoins } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import WalletConnectButton from '@/components/ui/wallet-connect-button';
import { useAppKitAccount } from '@reown/appkit/react';

const OnboardingProcess = () => {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<'investor' | 'creator' | null>(null);
  const { data } = useSession();
  const totalSteps = 4;
  const router = useRouter();
  const { address, isConnected, caipAddress, status } = useAppKitAccount();
  const { update } = useSession();

  const roles = [
    {
      id: 'investor',
      title: 'Investor',
      icon: HandCoins,
      description: 'I want to invest in promising projects and support innovative ideas',
      features: [
        'Browse investment opportunities',
        'Track portfolio performance',
        'Connect with project creators',
      ],
    },
    {
      id: 'creator',
      title: 'Project Creator',
      icon: Rocket,
      description: 'I want to launch my own crowdfunding campaign and raise funds',
      features: ['Launch campaigns', 'Engage with backers', 'Track funding progress'],
    },
  ];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    location: '',
    walletAddress: '',
    avatarUrl: '',
  });

  const handleComplete = async () => {
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: selectedRole?.toUpperCase(),
          name: formData.fullName,
          bio: formData.bio,
          location: formData.location,
          walletAddress: address,
          image: formData.avatarUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete onboarding');
      }

      const data = await response.json();
      await update();
      router.push('/');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        avatarUrl: data.url,
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleSign = async () => {
    // try {
    //   const result = await signMessage("Hello World!", );
    //   console.log("Signature:", result.signature);
    // } catch (error) {
    //   console.error("Message signing failed:", error);
    // }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="space-y-2">
            <Progress value={(step / totalSteps) * 100} className="w-full" />
            <div className="flex justify-between text-sm text-gray-500">
              <span>
                Step {step} of {totalSteps}
              </span>
              <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Step 1: Role Selection (New) */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Choose Your Role</h2>
                <p className="text-gray-500">Select how you want to participate in our platform</p>
              </div>
              <div className="space-y-4">
                {roles.map(role => {
                  const Icon = role.icon;
                  return (
                    <div
                      key={role.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedRole === role.id
                          ? 'border-primary bg-primary/5'
                          : 'hover:border-primary'
                      }`}
                      // @ts-ignore
                      onClick={() => setSelectedRole(role.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-primary/30 rounded-lg">
                          <Icon className="w-6 h-6 text-primary " />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{role.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                          <ul className="mt-2 space-y-1">
                            {role.features.map((feature, index) => (
                              <li
                                key={index}
                                className="text-sm text-muted-foreground flex items-center gap-2"
                              >
                                <Check className="w-4 h-4 text-green-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Profile Setup */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Profile Setup</h2>
                <p className="text-gray-500">Tell us more about yourself</p>
              </div>
              <div className="flex justify-center">
                <div className="space-y-2 flex items-center flex-col gap-2">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={formData.avatarUrl || '/api/placeholder/150/150'} />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Picture
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Full name</Label>
                  <Input
                    placeholder="Ramesh sure"
                    name="displayname"
                    value={formData.fullName}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea
                    placeholder="Tell us about yourself..."
                    name="bio"
                    value={formData.bio}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        bio: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    placeholder="City, Country"
                    name="location"
                    value={formData.location}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Wallet Connection */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
                <p className="text-gray-500">
                  Connect your wallet to start{' '}
                  {selectedRole === 'investor' ? 'investing' : 'creating'}
                </p>
              </div>
              <div className="space-y-4">
                <WalletConnectButton />
                {isConnected && (
                  <div className="text-center text-sm text-green-500">
                    <p>Wallet connected successfully!</p>
                  </div>
                )}
                <div className="text-center text-sm text-gray-500">
                  <p>Don&apos;t have a wallet?</p>
                  <Button variant="link">Learn how to create one</Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Completion (Previously Step 4) */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Check className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold">You&apos;re All Set!</h2>
                <p className="text-muted-foreground">
                  Your account has been created and you&apos;re ready to{' '}
                  {selectedRole === 'investor'
                    ? 'start investing in amazing projects'
                    : 'launch your first campaign'}
                  .
                </p>
              </div>
              <div className="space-y-4">
                <div className="bg-background p-4 rounded-lg space-y-2">
                  <h3 className="font-medium">What&apos;s Next?</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {selectedRole === 'investor' && (
                      <>
                        <li>Browse trending projects</li>
                        <li>Set up your investment preferences</li>
                        <li>Complete your KYC verification</li>
                        <li>Join investor community</li>
                      </>
                    )}
                    {selectedRole === 'creator' && (
                      <>
                        <li>Create your first campaign</li>
                        <li>Complete project verification</li>
                        <li>Set up your project page</li>
                        <li>Join creator community</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          {step > 1 && step < totalSteps && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          {step === 1 && <div />}
          {step < totalSteps ? (
            <Button onClick={handleNext} disabled={step === 2 && !selectedRole}>
              Continue
            </Button>
          ) : (
            <Button onClick={handleComplete}>Get Started</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingProcess;
