import React from "react";
import ImageCarousel from "@/components/campaign/ImageCarousel";
import CampaignHeader from "@/components/campaign/CampaignHeader";
import CampaignTabs from "@/components/campaign/CampaignTabs";

// TODO: add complete milestone functionality.

const CampaignDetailsPage = () => {
  const campaign = {
    title: "Help Build Clean Water Wells",
    category: "Environment",
    creatorName: "Sarah Johnson",
    creatorAvatar:
      "https://plus.unsplash.com/premium_photo-1668319914124-57301e0a1850?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    goalAmount: 50000,
    raisedAmount: 32500,
    daysLeft: 15,
    backers: 325,
    backersList: [
      {
        id: 1,
        name: "John Doe",
        avatar: "/api/placeholder/40/40",
        amount: 500,
        date: "2024-01-02",
        comment: "Amazing initiative! Happy to support this cause.",
      },
      {
        id: 2,
        name: "Emma Wilson",
        avatar: "/api/placeholder/40/40",
        amount: 1000,
        date: "2024-01-01",
        comment: "Keep up the great work!",
      },
      {
        id: 3,
        name: "Michael Chen",
        avatar: "/api/placeholder/40/40",
        amount: 250,
        date: "2024-01-01",
        isAnonymous: true,
      },
    ],
    description:
      "We're on a mission to provide clean drinking water to rural communities...",
    story: [
      {
        title: "Our Journey Begins",
        content:
          "Our journey began when we witnessed firsthand the challenges faced by communities living in remote and underserved areas. Access to basic needs such as clean water, education, and sustainable livelihoods seemed like distant dreams for them. It was heartbreaking to see children walking miles for water instead of attending school and farmers struggling to sustain their families. We realized that something needed to change—and we decided to be that change.",
      },
      {
        title: "The Vision",
        content:
          "Our vision was clear: to create a world where everyone, regardless of their circumstances, has the opportunity to thrive. We aimed to empower individuals and communities by addressing their most pressing needs. Whether it was providing clean water, equipping children with essential tech skills, or supporting local farmers with modern resources, our mission was to create long-lasting, meaningful impact.",
      },
      {
        title: "How You Made a Difference",
        content:
          "Your support has been the backbone of our efforts. With your help, we have already made significant strides. We completed our first clean water well, giving hundreds of people access to safe drinking water. We launched tech education workshops that inspired young minds and opened doors to new opportunities. We also organized farmer's markets and provided tools that improved productivity and livelihoods for countless families.",
      },
      {
        title: "The Road Ahead",
        content:
          "While we’ve achieved so much together, our work is far from over. Many communities are still in need of help, and we are determined to reach them. We aim to scale our programs, build more wells, expand educational initiatives, and ensure sustainable development for all.",
      },
      {
        title: "Join Us",
        content:
          "We invite you to join us on this incredible journey. Your contributions not only fund projects but also bring hope and transformation to those who need it most. Together, we can build a brighter future where no one is left behind.",
      },
    ],
    updates: [
      {
        date: "2024-01-01",
        title: "First Well Complete!",
        description: "",
        image: "",
        content:
          "We're excited to announce the completion of our first well, bringing clean water to over 200 villagers. Thank you for your incredible support!",
      },
      {
        date: "2024-01-10",
        title: "Tech Workshop Kickoff!",
        description: "",
        image: "",
        content:
          "Our first coding workshop for underprivileged children kicked off successfully. Over 50 kids attended and created their first lines of code. Thanks to all the backers!",
      },
      {
        date: "2024-01-15",
        title: "Farmer's Market Success",
        description: "",
        image: "",
        content:
          "The farmer's market event was a huge success, providing local farmers with the tools and exposure they need to thrive. Your support made this possible!",
      },
      {
        date: "2024-01-20",
        title: "Wildlife Cameras Installed",
        description: "",
        image: "",
        content:
          "We've installed the first batch of cameras to monitor endangered species in their natural habitats. Thank you for helping us protect these precious creatures!",
      },
      {
        date: "2024-01-25",
        title: "Goal Reached: Tech Education for Kids",
        description: "",
        image: "",
        content:
          "We've reached our goal for the Tech Education for Kids campaign! The funds will be used to expand the program to more schools. Thank you!",
      },
    ],
    rewards: [
      {
        id: 1,
        title: "Early Supporter",
        amount: 25,
        description:
          "Be one of our early supporters and get exclusive project updates",
        items: [
          "Digital thank you card",
          "Name in supporters list",
          "Exclusive updates",
        ],
        claimed: 150,
        maxAvailable: 200,
        estimatedDelivery: "February 2024",
        shipping: "Digital Reward",
      },
      {
        id: 2,
        title: "Clean Water Advocate",
        amount: 100,
        description: "Make a bigger impact and receive a special commemoration",
        items: [
          "Personalized thank you video",
          "Limited edition project photo book",
          "All previous rewards",
        ],
        claimed: 75,
        maxAvailable: 100,
        estimatedDelivery: "March 2024",
        shipping: "Ships worldwide",
      },
      {
        id: 3,
        title: "Community Champion",
        amount: 500,
        description: "Become a major contributor to the project",
        items: [
          "Your name on the well plaque",
          "VIP site visit invitation",
          "Exclusive project merchandise",
          "All previous rewards",
        ],
        claimed: 15,
        maxAvailable: 20,
        estimatedDelivery: "April 2024",
        shipping: "Ships worldwide",
        featured: true,
      },
    ],
    images: [
      "https://plus.unsplash.com/premium_photo-1674006133517-ba579f974656?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1564462994167-4e69b84fb624?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://plus.unsplash.com/premium_photo-1711311207313-58dd8906e350?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://plus.unsplash.com/premium_photo-1675448891138-838478562f6a?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    milestones: [
      {
        id: 1,
        title: "Project Launch",
        description:
          "Successfully launch the campaign and begin community outreach",
        targetAmount: 5000,
        completed: true,
        date: "December 2023",
        achievements: [
          "Campaign website launched",
          "Community partnerships established",
          "Initial survey completed",
        ],
      },
      {
        id: 2,
        title: "First Well Location",
        description: "Select and secure the location for our first well",
        targetAmount: 15000,
        completed: true,
        date: "January 2024",
        achievements: [
          "Site analysis completed",
          "Local permits obtained",
          "Community agreement signed",
        ],
      },
      {
        id: 3,
        title: "Construction Begins",
        description: "Start the construction of our first well",
        targetAmount: 30000,
        completed: true,
        date: "February 2024",
        achievements: [
          "Construction team hired",
          "Equipment purchased",
          "Ground breaking ceremony held",
        ],
      },
      {
        id: 4,
        title: "First Well Completion",
        description: "Complete and inaugurate our first well",
        targetAmount: 40000,
        completed: false,
        date: "March 2024",
        achievements: [
          "Well construction",
          "Water quality testing",
          "Community training program",
        ],
      },
      {
        id: 5,
        title: "Project Expansion",
        description: "Begin planning for second well location",
        targetAmount: 50000,
        completed: false,
        date: "April 2024",
        achievements: [
          "Impact assessment",
          "Second location survey",
          "Community consultation",
        ],
      },
    ],
  };
  
  if (true) {
    return (
      <div className="mx-auto space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <ImageCarousel images={campaign.images} />
          <CampaignHeader campaign={campaign} />
        </div>
        <CampaignTabs campaign={campaign} />
      </div>
    );
  }
};

export default CampaignDetailsPage;
