"use client";
import { Clock, DollarSign, Heart, Share2, Users } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const CampaignHeader = ({ campaign }: any) => {
  const progress = (campaign.raisedAmount / campaign.goalAmount) * 100;

  return (
    <div className="space-y-6">
      <div>
        <span className="text-sm font-medium text-primary">
          {campaign.category}
        </span>
        <h1 className="text-3xl font-bold mt-2">{campaign.title}</h1>
      </div>

      <Card>
        <CardContent className="pt-3 space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-bold text-2xl">
                ${campaign.raisedAmount.toLocaleString()}
              </span>
              <span className="text-gray-500">
                of ${campaign.goalAmount.toLocaleString()}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <motion.div className="grid grid-cols-3 gap-4 py-4">
            <div>
              <Users className="h-5 w-5 text-gray-500 mb-1" />
              <p className="font-bold">{campaign.backers}</p>
              <p className="text-sm text-gray-500">Backers</p>
            </div>
            <div>
              <Clock className="h-5 w-5 text-gray-500 mb-1" />
              <p className="font-bold">{campaign.daysLeft}</p>
              <p className="text-sm text-gray-500">Days Left</p>
            </div>
            <div>
              <DollarSign className="h-5 w-5 text-gray-500 mb-1" />
              <p className="font-bold">{Math.round(progress)}%</p>
              <p className="text-sm text-gray-500">Funded</p>
            </div>
          </motion.div>

          <div className="flex space-x-4">
            <Button className="flex-1">Back this project</Button>
            <Button variant="outline" size="icon">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={campaign.creatorAvatar} className="object-cover" />
          <AvatarFallback>VB</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm text-gray-500">Created by</p>
          <p className="font-medium">{campaign.creatorName}</p>
        </div>
      </div>
    </div>
  );
};
export default CampaignHeader;
