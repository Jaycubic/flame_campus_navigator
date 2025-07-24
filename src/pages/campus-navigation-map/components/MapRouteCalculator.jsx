import React from 'react';

// Route calculation utility for campus navigation
class MapRouteCalculator {
  constructor(anchorPoints) {
    this.anchorPoints = anchorPoints;
    this.routeCache = new Map();
  }

  // Calculate optimized route between two points
  calculateOptimizedRoute(startPoint, endPoint, obstacles = []) {
    const cacheKey = `${startPoint.lat}-${startPoint.lng}-${endPoint.lat}-${endPoint.lng}`;
    
    if (this.routeCache.has(cacheKey)) {
      return this.routeCache.get(cacheKey);
    }

    // Simple A* pathfinding algorithm for campus navigation
    const route = this.generateRouteWithWaypoints(startPoint, endPoint, obstacles);
    this.routeCache.set(cacheKey, route);
    
    return route;
  }

  // Generate route with intermediate waypoints
  generateRouteWithWaypoints(start, end, obstacles) {
    const waypoints = [];
    const campusRoads = this.getCampusRoadNetwork();
    
    // Find nearest road points to start and end
    const startRoadPoint = this.findNearestRoadPoint(start, campusRoads);
    const endRoadPoint = this.findNearestRoadPoint(end, campusRoads);
    
    // Connect to road network if not on road
    if (this.calculateDistance(start, startRoadPoint) > 10) {
      waypoints.push(startRoadPoint);
    }
    
    // Calculate intermediate waypoints along roads
    const pathPoints = this.findPathAlongRoads(startRoadPoint, endRoadPoint, campusRoads);
    waypoints.push(...pathPoints);
    
    // Connect from road to destination if needed
    if (this.calculateDistance(end, endRoadPoint) > 10) {
      waypoints.push(endRoadPoint);
    }
    
    return {
      waypoints,
      totalDistance: this.calculateTotalDistance([start, ...waypoints, end]),
      estimatedTime: this.calculateEstimatedTime([start, ...waypoints, end]),
      instructions: this.generateTurnByTurnInstructions([start, ...waypoints, end])
    };
  }

  // Get campus road network points
  getCampusRoadNetwork() {
    return [
      // Main horizontal road
      { lat: 18.5250, lng: 73.7280, type: 'intersection' },
      { lat: 18.5250, lng: 73.7290, type: 'road' },
      { lat: 18.5250, lng: 73.7300, type: 'intersection' },
      { lat: 18.5250, lng: 73.7310, type: 'road' },
      { lat: 18.5250, lng: 73.7320, type: 'intersection' },
      
      // Main vertical road
      { lat: 18.5260, lng: 73.7300, type: 'intersection' },
      { lat: 18.5250, lng: 73.7300, type: 'intersection' },
      { lat: 18.5240, lng: 73.7300, type: 'road' },
      { lat: 18.5230, lng: 73.7300, type: 'intersection' },
      { lat: 18.5220, lng: 73.7300, type: 'road' },
      
      // Secondary roads
      { lat: 18.5240, lng: 73.7290, type: 'road' },
      { lat: 18.5240, lng: 73.7310, type: 'road' },
      { lat: 18.5230, lng: 73.7285, type: 'road' },
      { lat: 18.5235, lng: 73.7315, type: 'road' }
    ];
  }

  // Find nearest point on road network
  findNearestRoadPoint(point, roadNetwork) {
    let nearestPoint = roadNetwork[0];
    let minDistance = this.calculateDistance(point, nearestPoint);
    
    roadNetwork.forEach(roadPoint => {
      const distance = this.calculateDistance(point, roadPoint);
      if (distance < minDistance) {
        minDistance = distance;
        nearestPoint = roadPoint;
      }
    });
    
    return nearestPoint;
  }

  // Simple path finding along road network
  findPathAlongRoads(start, end, roadNetwork) {
    // For simplicity, return direct path with key intersections
    const pathPoints = [];
    
    // Add strategic waypoints based on campus layout
    const midLat = (start.lat + end.lat) / 2;
    const midLng = (start.lng + end.lng) / 2;
    
    // Find intersection points for path optimization
    const intersections = roadNetwork.filter(point => point.type === 'intersection');
    const relevantIntersections = intersections.filter(intersection => {
      const distToStart = this.calculateDistance(start, intersection);
      const distToEnd = this.calculateDistance(end, intersection);
      return distToStart < 200 && distToEnd < 200; // Within 200m of both points
    });
    
    if (relevantIntersections.length > 0) {
      // Sort by total distance to both points
      relevantIntersections.sort((a, b) => {
        const totalDistA = this.calculateDistance(start, a) + this.calculateDistance(end, a);
        const totalDistB = this.calculateDistance(start, b) + this.calculateDistance(end, b);
        return totalDistA - totalDistB;
      });
      
      pathPoints.push(relevantIntersections[0]);
    }
    
    return pathPoints;
  }

  // Calculate distance between two GPS points (Haversine formula)
  calculateDistance(point1, point2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = point1.lat * Math.PI / 180;
    const φ2 = point2.lat * Math.PI / 180;
    const Δφ = (point2.lat - point1.lat) * Math.PI / 180;
    const Δλ = (point2.lng - point1.lng) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }

  // Calculate total distance for route
  calculateTotalDistance(points) {
    let totalDistance = 0;
    for (let i = 0; i < points.length - 1; i++) {
      totalDistance += this.calculateDistance(points[i], points[i + 1]);
    }
    return totalDistance;
  }

  // Calculate estimated walking time
  calculateEstimatedTime(points) {
    const totalDistance = this.calculateTotalDistance(points);
    const walkingSpeed = 1.4; // Average walking speed in m/s
    return Math.ceil(totalDistance / walkingSpeed); // Time in seconds
  }

  // Generate turn-by-turn instructions
  generateTurnByTurnInstructions(points) {
    const instructions = [];
    
    if (points.length < 2) return instructions;
    
    instructions.push({
      type: 'start',
      instruction: 'Start your journey',
      distance: 0,
      duration: 0
    });
    
    for (let i = 1; i < points.length - 1; i++) {
      const prev = points[i - 1];
      const current = points[i];
      const next = points[i + 1];
      
      const bearing1 = this.calculateBearing(prev, current);
      const bearing2 = this.calculateBearing(current, next);
      const angleDiff = this.normalizeAngle(bearing2 - bearing1);
      
      let instruction = 'Continue straight';
      if (Math.abs(angleDiff) > 30) {
        instruction = angleDiff > 0 ? 'Turn right' : 'Turn left';
        if (Math.abs(angleDiff) > 90) {
          instruction = angleDiff > 0 ? 'Turn sharp right' : 'Turn sharp left';
        }
      }
      
      const distance = this.calculateDistance(prev, current);
      instructions.push({
        type: 'turn',
        instruction: instruction,
        distance: Math.round(distance),
        duration: Math.ceil(distance / 1.4)
      });
    }
    
    const finalDistance = this.calculateDistance(points[points.length - 2], points[points.length - 1]);
    instructions.push({
      type: 'destination',
      instruction: 'You have arrived at your destination',
      distance: Math.round(finalDistance),
      duration: Math.ceil(finalDistance / 1.4)
    });
    
    return instructions;
  }

  // Calculate bearing between two points
  calculateBearing(point1, point2) {
    const φ1 = point1.lat * Math.PI / 180;
    const φ2 = point2.lat * Math.PI / 180;
    const Δλ = (point2.lng - point1.lng) * Math.PI / 180;
    
    const x = Math.sin(Δλ) * Math.cos(φ2);
    const y = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    
    const θ = Math.atan2(x, y);
    return (θ * 180 / Math.PI + 360) % 360; // Normalize to 0-360°
  }

  // Normalize angle difference
  normalizeAngle(angle) {
    while (angle > 180) angle -= 360;
    while (angle < -180) angle += 360;
    return angle;
  }

  // Clear route cache
  clearCache() {
    this.routeCache.clear();
  }

  // Check if point is within campus bounds
  isWithinCampusBounds(point) {
    const bounds = {
      north: 18.5280,
      south: 18.5180,
      east: 73.7350,
      west: 73.7250
    };
    
    return point.lat >= bounds.south && point.lat <= bounds.north &&
           point.lng >= bounds.west && point.lng <= bounds.east;
  }
}

export default MapRouteCalculator;