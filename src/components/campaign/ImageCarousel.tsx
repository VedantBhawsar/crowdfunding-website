"use client";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";

const ImageCarousel = ({ images }: { images: string[] }) => {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {images.map((url, index) => (
          <CarouselItem key={index}>
            <div className="relative">
              <Card>
                <CardContent className="flex aspect-video items-center justify-center p-0 rounded-lg overflow-hidden">
                  <img
                    alt={`image-${index}`}
                    src={url}
                    className="w-full h-full"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
export default ImageCarousel;
