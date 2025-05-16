import React from "react";
import Link from "next/link";
import { ArrowRight, LineChart, TrendingUp, Search, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="py-20 md:py-28 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Discover What The World Is Talking About
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            TrendPulse aggregates trending discussions from YouTube, Reddit, and Twitter to give you actionable insights on any topic or product.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 min-w-[160px]">
                <Search className="h-4 w-4" />
                Start Exploring
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="gap-2 min-w-[160px]">
                <TrendingUp className="h-4 w-4" />
                View Trends
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            All Your Social Insights In One Place
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4 mx-auto">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Cross-Platform Search</h3>
              <p className="text-muted-foreground text-center">
                Search across YouTube, Reddit, and Twitter simultaneously to get the complete picture.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4 mx-auto">
                <PieChart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Sentiment Analysis</h3>
              <p className="text-muted-foreground text-center">
                Understand how people feel about a topic with our built-in sentiment analysis.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4 mx-auto">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Trend Tracking</h3>
              <p className="text-muted-foreground text-center">
                See what's trending in real-time and stay ahead of the conversation.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/dashboard">
              <Button variant="link" className="text-primary font-medium text-lg gap-2">
                Explore the dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">Ready to Tap Into Social Trends?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start exploring what people are saying across the social web with our powerful trend aggregation tools.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="gap-2">
              <LineChart className="h-4 w-4" />
              Get Started
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="mt-auto border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 TrendPulse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}