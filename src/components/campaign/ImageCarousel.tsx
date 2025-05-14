'use client';
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';
import Image from 'next/image';

const ImageCarousel = ({ images }: { images: string[] }) => {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {images.map((url, index) => (
          <CarouselItem key={index}>
            <div className="relative">
              <Card>
                <CardContent className="flex aspect-video items-center justify-center p-0 rounded-lg overflow-hidden">
                  <div className="relative w-full h-full">
                    <Image
                      alt={`image-${index}`}
                      src={url}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
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
