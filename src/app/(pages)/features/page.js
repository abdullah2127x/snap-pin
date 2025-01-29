import React from "react";
import { Globe, BarChart2, Copy, Zap } from "lucide-react";
import Link from "next/link";
const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
    <div className="flex items-center mb-4">
      <Icon className="mr-4 text-blue-600" size={48} />
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
    </div>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Features = () => {
  const features = [
    {
      icon: Copy,
      title: "Shorten URL",
      description:
        "Transform long, complex URLs into short, easy-to-share links with just one click.",
    },
    {
      icon: BarChart2,
      title: "Detailed Analytics",
      description:
        "Monitor your link performance with ease. View daily click counts, total clicks, and the time of the last click. Use custom date filters to analyze data as you need.",
    },
    {
      icon: Zap,
      title: "Lightweight & Fast",
      description:
        "Ultra-fast URL shortening with minimal overhead, ensuring quick link generation and redirection.",
    },
    {
      icon: Globe,
      title: "Custom URL",
      description:
        "Create branded, memorable short links that reflect your personal or business identity.",
    },
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-blue-800 mb-4">
            Features
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simplify, track, and optimize your links with our powerful URL
            shortening service.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/auth/login">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors">
              Start Shortening Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Features;
