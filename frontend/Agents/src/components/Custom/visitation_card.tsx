"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { FaMapMarkerAlt, FaRegCalendarAlt } from "react-icons/fa";
import Spinner from "@/pages/notifications/Spinner";

const VisitationCard = ({ item, loading }) => {
  const { property, date, note } = item || {};
  const images = property?.images || [];

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [imageLoading, setImageLoading] = useState(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setScrollSnaps(emblaApi.scrollSnapList());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
        <div className="relative overflow-hidden h-[200px] flex items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
        <div className="p-4 flex flex-col">
          <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded mt-2 w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
      {images.length > 0 && (
        <div className="relative overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {images.map((src, idx) => (
              <div key={idx} className="relative flex-none w-full h-[200px]">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <Spinner className="h-8 w-8" />
                  </div>
                )}
                <Image
                  src={src}
                  alt={`${property.name} ${idx + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className={imageLoading ? 'hidden' : 'block'}
                  onLoadingComplete={() => setImageLoading(false)}
                />
              </div>
            ))}
          </div>
          {/* Dot Indicators */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
            {scrollSnaps.map((_, idx) => (
              <button
                key={idx}
                className={`w-2 h-2 rounded-full ${
                  idx === selectedIndex ? "bg-main-primary" : "bg-gray-300"
                }`}
                onClick={() => emblaApi && emblaApi.scrollTo(idx)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="p-4 flex flex-col">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">
          {property?.name || "Property Name"}
        </h2>

        <p className="flex items-center text-gray-600 text-sm mb-2">
          <FaMapMarkerAlt className="mr-1 text-orange-500" />
          {property?.location || "No location provided"}
        </p>

        <p className="flex items-center text-gray-600 text-sm mb-2">
          <FaRegCalendarAlt className="mr-1 text-blue-500" /> {date || "No date provided"}
        </p>

        {note && (
          <p className="text-sm text-gray-700 mt-2 italic">"{note}"</p>
        )}
      </div>
    </div>
  );
};

export default VisitationCard;