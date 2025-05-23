# Townhall API Usage Guide

## Overview
This guide shows you how to fetch authentic citizen ratings data from your Supabase database using simple React hooks.

## Quick Start Hooks

### 1. Get Just the Approval Rating
```javascript
import { useApprovalRating } from '@/hooks/use-ratings';

function MyComponent() {
  const { approvalRating, isLoading } = useApprovalRating(officialId);
  
  return <div>Approval: {approvalRating}%</div>; // Returns: 52%
}
```

### 2. Get Sector Ratings
```javascript
import { useSectorRatings } from '@/hooks/use-ratings';

function SectorDisplay() {
  const { sectors, overallSectorRating, isLoading } = useSectorRatings(officialId);
  
  return (
    <div>
      <p>Overall Sector Average: {overallSectorRating}%</p>
      {sectors.map(sector => (
        <div key={sector.name} style={{ color: sector.color }}>
          {sector.name}: {sector.rating}%
        </div>
      ))}
    </div>
  );
}

// Returns:
// Overall Sector Average: 52%
// Health: 53% (green)
// Education: 47% (yellow) 
// Infrastructure: 55% (blue)
```

### 3. Get Time-Based Performance Data
```javascript
import { useTimeBasedRatings } from '@/hooks/use-ratings';

function PerformanceChart() {
  // Overall weekly performance
  const { timeLabels, data } = useTimeBasedRatings(officialId, "1 Wk");
  
  // Health sector weekly performance
  const { timeLabels: healthLabels, data: healthData } = useTimeBasedRatings(
    officialId, 
    "1 Wk", 
    "Health"
  );
  
  return (
    <LineChart data={timeLabels.map((label, i) => ({
      time: label,
      overall: data[i],
      health: healthData[i]
    }))} />
  );
}

// Overall data: [0, 50, 50, 50, 50, 50, 50]
// Health data: [0, 66, 66, 50, 50, 50, 50]
```

## Time Periods Available
- `"1 Dy"` - Last 24 hours (hourly data)
- `"1 Wk"` - Last 7 days (daily data)  
- `"1 Yr"` - Last 12 months (monthly data)
- `"This year"` - Multi-year view (yearly data)

## Available Sectors
Your data includes these sectors with color coding:
- **Health** (#4CAF50 - Green)
- **Education** (#FFC107 - Yellow)
- **Infrastructure** (#2196F3 - Blue)
- **Economy** (#E91E63 - Pink)
- **Security** (#673AB7 - Purple)

## Advanced Usage

### For Complex Charts (Full Data)
```javascript
import { usePerformanceRatings } from '@/hooks/use-performance';

function AdvancedChart() {
  const { data: performanceData, isLoading } = usePerformanceRatings(officialId);
  
  // Access all periods and sectors
  const weeklyOverall = performanceData?.overallRatingsByPeriod["1 Wk"];
  const healthWeekly = performanceData?.sectorRatings.Health.ratingsByPeriod["1 Wk"];
  
  return <ComplexChart data={performanceData} />;
}
```

## REST API Endpoints

### Get Official Ratings
```
GET /api/officials/{id}/approval-ratings
```

**Response:**
```json
{
  "officialId": "7e03327e-f1d6-4515-bb7c-6ed1d0db842d",
  "overallApprovalRating": 52,
  "overallRatingsByPeriod": {
    "1 Wk": {
      "timeLabels": ["May 17", "May 18", "May 19", "May 20", "May 21", "May 22", "May 23"],
      "data": [0, 50, 50, 50, 50, 50, 50]
    }
  },
  "sectorRatings": {
    "Health": {
      "sectorId": "health",
      "color": "#4CAF50",
      "overallRating": 53,
      "ratingsByPeriod": {
        "1 Wk": {
          "timeLabels": ["May 17", "May 18", "May 19", "May 20", "May 21", "May 22", "May 23"],
          "data": [0, 66, 66, 50, 50, 50, 50]
        }
      }
    }
  }
}
```

### Submit New Rating
```
POST /api/officials/{id}/ratings
Content-Type: application/json

{
  "officialId": "7e03327e-f1d6-4515-bb7c-6ed1d0db842d",
  "overallRating": 75,
  "sectorRatings": [
    { "sectorId": "health", "rating": 80 },
    { "sectorId": "education", "rating": 70 }
  ]
}
```

## Data Source
All data comes from authentic citizen ratings stored in your Supabase PostgreSQL database. No mock or placeholder data is used.

## Hook Benefits
✅ **Simple** - Get exactly what you need  
✅ **Fast** - Cached with React Query  
✅ **Real-time** - Authentic Supabase data  
✅ **Efficient** - No unnecessary data fetching  

## Example Use Cases

**Dashboard Summary:**
```javascript
const { approvalRating } = useApprovalRating(officialId);
const { overallSectorRating } = useSectorRatings(officialId);
```

**Sector Comparison:**
```javascript
const { sectors } = useSectorRatings(officialId);
const topSector = sectors.sort((a, b) => b.rating - a.rating)[0];
```

**Performance Trending:**
```javascript
const { data: weeklyData } = useTimeBasedRatings(officialId, "1 Wk");
const trend = weeklyData[weeklyData.length - 1] - weeklyData[0];
```

This system provides authentic Nigerian citizen feedback on elected officials across multiple sectors with real-time performance tracking.