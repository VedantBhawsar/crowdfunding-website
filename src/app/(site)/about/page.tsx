"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function AboutPage() {
  return (
    <div className="py-10 bg-gradient-to-br from-indigo-50 to-white">
      <div className="max-w-5xl mx-auto px-5">
        <h1 className="text-3xl font-bold text-indigo-600 text-center mb-8">
          About DecentraliFund
        </h1>
        <Card className="shadow-lg rounded-md mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">
              At DecentraliFund, our mission is to empower individuals and
              communities by providing a secure, transparent, and decentralized
              platform to fund projects that make a positive impact in the
              world. We believe in creating opportunities for everyone to
              achieve their dreams.
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-md mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Our Vision
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">
              Our vision is to become the leading decentralized crowdfunding
              platform, enabling global participation in creating innovative
              solutions for pressing societal challenges. We aim to bridge the
              gap between dreamers and supporters by leveraging blockchain
              technology for transparency and trust.
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-md mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Why Choose Us?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-sm text-gray-700">
              <li>Secure and decentralized funding system.</li>
              <li>Transparent transactions powered by blockchain.</li>
              <li>Global reach for contributors and creators.</li>
              <li>Easy-to-use interface for all users.</li>
              <li>Commitment to social impact and innovation.</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-md">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Meet Our Team
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">
              Our team is made up of passionate individuals dedicated to
              transforming the crowdfunding landscape. From blockchain experts
              to community builders, we work tirelessly to ensure every campaign
              on our platform is successful and impactful.
            </p>
          </CardContent>
        </Card>
        <Separator className="my-8" />
        <p className="text-center text-gray-600 text-sm">
          Thank you for choosing DecentraliFund to make a difference in the
          world.
        </p>
      </div>
    </div>
  );
}
