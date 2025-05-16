import React from "react"
import { motion } from "framer-motion"
import { TrendSummary } from "@/types"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, Minus } from "lucide-react"

interface SummarySectionProps {
  summary: TrendSummary
}

// Custom Progress component to replace the shadcn/ui one
interface CustomProgressProps {
  value: number;
  className?: string;
  color: string;
}

function CustomProgress({ value, className, color }: CustomProgressProps) {
  return (
    <div className={`w-full h-2 bg-muted rounded-full overflow-hidden ${className}`}>
      <div 
        className={`h-full ${color}`} 
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function SummarySection({ summary }: SummarySectionProps) {
  if (!summary) return null;
  
  const totalSentiment = 
    summary.sentimentBreakdown.positive + 
    summary.sentimentBreakdown.negative + 
    summary.sentimentBreakdown.neutral;
  
  const calculatePercentage = (value: number) => {
    if (!totalSentiment) return 0;
    return (value / totalSentiment) * 100;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Key Takeaways</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sentiment Breakdown */}
          <div className="space-y-3">
            <h3 className="font-medium">Sentiment Breakdown</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-green-500" />
                  <span>Positive</span>
                </div>
                <span className="text-sm font-medium">
                  {summary.sentimentBreakdown.positive} ({calculatePercentage(summary.sentimentBreakdown.positive).toFixed(0)}%)
                </span>
              </div>
              <CustomProgress value={calculatePercentage(summary.sentimentBreakdown.positive)} className="h-2" color="bg-green-500" />
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <Minus className="h-4 w-4 text-gray-500" />
                  <span>Neutral</span>
                </div>
                <span className="text-sm font-medium">
                  {summary.sentimentBreakdown.neutral} ({calculatePercentage(summary.sentimentBreakdown.neutral).toFixed(0)}%)
                </span>
              </div>
              <CustomProgress value={calculatePercentage(summary.sentimentBreakdown.neutral)} className="h-2" color="bg-gray-500" />
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <ThumbsDown className="h-4 w-4 text-red-500" />
                  <span>Negative</span>
                </div>
                <span className="text-sm font-medium">
                  {summary.sentimentBreakdown.negative} ({calculatePercentage(summary.sentimentBreakdown.negative).toFixed(0)}%)
                </span>
              </div>
              <CustomProgress value={calculatePercentage(summary.sentimentBreakdown.negative)} className="h-2" color="bg-red-500" />
            </div>
          </div>
          
          {/* Key Points */}
          <div className="space-y-3">
            <h3 className="font-medium">Summary</h3>
            <ul className="space-y-2 text-sm">
              {summary?.keyTakeaways?.map((point, index) => (
                <li key={index} className="flex gap-2">
                  <span className="font-medium text-primary">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}