"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Search, Settings2 } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import CampaignFilterModel from "@/components/campaign/CampaignFilterModel";

const CampaignsPage = () => {
  const campaigns = [
    {
      id: 1,
      title: "Save the Local Theater",
      description: "Help us renovate our historic community theater",
      image:
        "https://plus.unsplash.com/premium_photo-1661972249683-790fcb064838?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      raisedAmount: 15000,
      goalAmount: 25000,
      daysLeft: 15,
      backers: 123,
    },
    {
      id: 2,
      title: "Community Garden Project",
      description: "Creating green spaces in urban areas",
      image:
        "https://plus.unsplash.com/premium_photo-1661972249683-790fcb064838?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      raisedAmount: 8000,
      goalAmount: 10000,
      daysLeft: 20,
      backers: 89,
    },
    {
      id: 3,
      title: "Tech Education for Kids",
      description: "Providing coding education to underprivileged children",
      image:
        "https://plus.unsplash.com/premium_photo-1661972249683-790fcb064838?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      raisedAmount: 12000,
      goalAmount: 20000,
      daysLeft: 25,
      backers: 156,
    },
    {
      id: 4,
      title: "Clean Water Initiative",
      description: "Bringing clean and safe water to remote villages",
      image:
        "https://plus.unsplash.com/premium_photo-1661972249683-790fcb064838?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      raisedAmount: 15000,
      goalAmount: 30000,
      daysLeft: 20,
      backers: 200,
    },
    {
      id: 5,
      title: "Support Local Farmers",
      description: "Helping farmers with modern tools and resources",
      image:
        "https://plus.unsplash.com/premium_photo-1661972249683-790fcb064838?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      raisedAmount: 8000,
      goalAmount: 20000,
      daysLeft: 15,
      backers: 120,
    },
    {
      id: 6,
      title: "Tech Education for Kids",
      description: "Providing coding education to underprivileged children",
      image:
        "https://plus.unsplash.com/premium_photo-1661972249683-790fcb064838?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      raisedAmount: 12000,
      goalAmount: 20000,
      daysLeft: 25,
      backers: 156,
    },
    {
      id: 7,
      title: "Wildlife Conservation Fund",
      description: "Protecting endangered species and their habitats",
      image:
        "https://plus.unsplash.com/premium_photo-1661972249683-790fcb064838?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      raisedAmount: 9000,
      goalAmount: 25000,
      daysLeft: 30,
      backers: 180,
    },
  ];

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4  ">
        <h1 className="text-2xl font-bold">Discover Campaigns</h1>
        <Button size={"sm"}>Start a Campaign</Button>
      </div>
      <CampaignSearch />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <CampaignCard campaign={campaign} key={campaign.id} />
        ))}
      </div>
    </div>
  );
};

export default CampaignsPage;

// TODO: add aggrements

function CampaignCard({ campaign }: { campaign: any }) {
  return (
    <Card key={campaign.id} className="overflow-hidden">
      <img
        src={campaign.image}
        alt={campaign.title}
        className="w-full h-48 object-cover"
      />
      <CardHeader>
        <CardTitle className="line-clamp-1">{campaign.title}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {campaign.description}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Progress
            value={(campaign.raisedAmount / campaign.goalAmount) * 100}
            className="h-2"
          />
          <div className="flex justify-between text-sm">
            <span className="font-medium">
              ${campaign.raisedAmount.toLocaleString()}
            </span>
            <span className="text-muted-foreground">
              of ${campaign.goalAmount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>{campaign.backers} backers</span>
            <span>{campaign.daysLeft} days left</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={"/projects/lsdkjflsdjkf"} className="w-full">
          <Button className="w-full">Support Campaign</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

function CampaignSearch() {
  return (
    <div className="mb-8 flex items-center w-full gap-4">
      <div className="relative w-full">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search campaigns..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <CampaignFilterModel />
    </div>
  );
}
