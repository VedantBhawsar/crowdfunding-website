"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const dummyProjects = [
  {
    id: 1,
    title: "Clean Water Initiative",
    description:
      "A project aimed at providing clean drinking water to underprivileged areas.",
    funding: "$12,500 raised of $15,000 goal",
  },
  {
    id: 2,
    title: "Community Solar Panels",
    description:
      "Installing solar panels to provide sustainable energy to rural communities.",
    funding: "$8,000 raised of $10,000 goal",
  },
  {
    id: 3,
    title: "Education for All",
    description:
      "A campaign to build schools and provide educational resources to children.",
    funding: "$20,000 raised of $25,000 goal",
  },
];

export default function ProjectsPage() {
  return (
    <div className="py-10 bg-gradient-to-br from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-5">
        <h1 className="text-3xl font-bold text-indigo-600 text-center mb-8">
          Explore Our Projects
        </h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dummyProjects.map((project) => (
            <Card key={project.id} className="shadow-lg rounded-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {project.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4">
                  {project.description}
                </p>
                <p className="text-sm font-medium text-indigo-600 mb-4">
                  {project.funding}
                </p>
                <Separator className="my-2" />
                <Button
                  variant={"default"}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
