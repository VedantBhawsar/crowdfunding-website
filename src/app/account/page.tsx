"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaProjectDiagram, FaHandsHelping, FaCog, FaDollarSign } from "react-icons/fa";

export default function AccountPage() {
  const userData = {
    name: "John Doe",
    email: "johndoe@example.com",
    projects: 3,
    campaigns: 5,
    donations: 10,
    totalDonated: "$150",
  };

  return (
    <div className="flex max-w-7xl mx-auto py-8 px-4 gap-6">
      {/* Sidebar */}
      <aside className="w-1/4 bg-indigo-50 rounded-lg p-4 shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-indigo-600">
            Hello, {userData.name}!
          </h2>
          <p className="text-gray-600 text-sm">{userData.email}</p>
        </div>
        <nav className="space-y-4">
          <Link
            href="/projects"
            className="flex items-center gap-3 p-3 rounded-lg text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            <FaProjectDiagram size={20} />
            <span className="font-medium">Projects</span>
          </Link>
          <Link
            href="/campaigns"
            className="flex items-center gap-3 p-3 rounded-lg text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            <FaHandsHelping size={20} />
            <span className="font-medium">Campaigns</span>
          </Link>
          <Link
            href="/donations"
            className="flex items-center gap-3 p-3 rounded-lg text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            <FaDollarSign size={20} />
            <span className="font-medium">Donations</span>
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-3 p-3 rounded-lg text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            <FaCog size={20} />
            <span className="font-medium">Settings</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <h1 className="text-2xl font-bold text-indigo-600 mb-6">
          Dashboard Overview
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Projects Card */}
          <Card className="shadow-lg border border-indigo-300">
            <CardHeader>
              <CardTitle className="text-indigo-600 text-xl">Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm">
                You are part of <strong>{userData.projects}</strong> projects.
              </p>
              <Button variant="outline" className="mt-3">
                <Link href="/projects">View Projects</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Campaigns Card */}
          <Card className="shadow-lg border border-indigo-300">
            <CardHeader>
              <CardTitle className="text-indigo-600 text-xl">Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm">
                You have created <strong>{userData.campaigns}</strong> campaigns.
              </p>
              <Button variant="outline" className="mt-3">
                <Link href="/campaigns">View Campaigns</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Donations Card */}
          <Card className="shadow-lg border border-indigo-300">
            <CardHeader>
              <CardTitle className="text-indigo-600 text-xl">Donations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm">
                You have made <strong>{userData.donations}</strong> donations,
                totaling <strong>{userData.totalDonated}</strong>.
              </p>
              <Button variant="outline" className="mt-3">
                <Link href="/donations">View Donations</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
