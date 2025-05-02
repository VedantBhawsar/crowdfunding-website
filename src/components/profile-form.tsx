'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface ProfileFormProps {
  initialData: {
    displayName: string;
    bio: string;
    location: string;
    email: string;
  };
  onSubmit?: (data: { displayName: string; bio: string; location: string }) => Promise<void>;
}

export function ProfileForm({ initialData, onSubmit }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { update } = useSession();

  // Initialize form data with initialData directly
  const [formData, setFormData] = useState({
    displayName: initialData.displayName || '',
    bio: initialData.bio || '',
    location: initialData.location || '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        displayName: initialData.displayName || '',
        bio: initialData.bio || '',
        location: initialData.location || '',
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        const response = await fetch('/api/user/profile', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Failed to update profile');
        }

        const data = await response.json();
        // Ensure we're properly updating the session with all user data
        await update({
          user: data,
        });
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Display Name</Label>
        <Input
          value={formData.displayName}
          onChange={e => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
          placeholder="Enter your display name"
        />
      </div>
      <div className="space-y-2">
        <Label>Bio</Label>
        <Textarea
          value={formData.bio}
          onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
          placeholder="Tell us about yourself"
        />
      </div>
      <div className="space-y-2">
        <Label>Location</Label>
        <Input
          value={formData.location}
          onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
          placeholder="Where are you based?"
        />
      </div>
      <div className="space-y-2">
        <Label>Email</Label>
        <Input defaultValue={initialData.email} disabled />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}

// Loading placeholder component
export function ProfileFormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Display Name</Label>
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Label>Bio</Label>
        <Skeleton className="h-24 w-full" />
      </div>
      <div className="space-y-2">
        <Label>Location</Label>
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Label>Email</Label>
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}
