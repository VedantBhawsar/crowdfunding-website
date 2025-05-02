'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function SettingsPage() {
  const [profileData, setProfileData] = useState({
    profilePhoto: 'https://via.placeholder.com/150',
    name: 'John Doe',
    email: 'johndoe@example.com',
    projects: 5,
    campaigns: 2,
    donations: 10,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    alert('Profile updated successfully!');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-50 p-4">
      <Card className="w-[500px] shadow-2xl rounded-lg bg-white relative overflow-hidden">
        {/* Top Decoration */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-600 opacity-10 rounded-full" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500 opacity-10 rounded-full" />

        <CardHeader className="relative z-10">
          <CardTitle className="text-center text-2xl font-bold text-indigo-600">
            Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          {/* Profile Section */}
          <div className="flex flex-col items-center gap-8">
            {/* Profile Photo */}
            <div className="relative group">
              <Avatar className="w-24 h-24 shadow-md">
                <AvatarImage src={profileData.profilePhoto} alt="Profile Photo" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="outline"
                className="absolute bottom-0 right-0 text-xs p-1 bg-indigo-600 text-white hover:bg-indigo-700 transition-all group-hover:scale-105"
                onClick={() => alert('Change Profile Photo functionality')}
              >
                Edit
              </Button>
            </div>

            {/* Editable Fields */}
            <div className="space-y-5 w-full px-6">
              {/* Name */}
              <div>
                <Label htmlFor="name" className="text-sm font-semibold text-gray-600">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className="mt-2 border-indigo-300 focus:ring focus:ring-indigo-200"
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-sm font-semibold text-gray-600">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="mt-2 border-indigo-300 focus:ring focus:ring-indigo-200"
                />
              </div>
            </div>

            {/* Static Stats */}
            <div className="grid grid-cols-3 gap-6 text-center mt-6 bg-indigo-50 py-4 px-6 rounded-lg shadow-sm">
              <div>
                <p className="text-xl text-indigo-600 font-bold">{profileData.projects}</p>
                <p className="text-sm text-gray-500">Projects</p>
              </div>
              <div>
                <p className="text-xl text-indigo-600 font-bold">{profileData.campaigns}</p>
                <p className="text-sm text-gray-500">Campaigns</p>
              </div>
              <div>
                <p className="text-xl text-indigo-600 font-bold">{profileData.donations}</p>
                <p className="text-sm text-gray-500">Donations</p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleSave}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 shadow-lg rounded-full transition-all"
            >
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
