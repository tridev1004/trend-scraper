import { createClient } from "redis"

// Create Redis client with the provided configuration
const client = createClient({
  username: "default",
  password: "kszD842vloTR4UPt7MBiOjwF7SpOrGd8",
  socket: {
    host: "redis-14584.crce182.ap-south-1-1.ec2.redns.redis-cloud.com",
    port: 14584,
  },
})

// Initialize connection state
let isConnected = false

// Connect to Redis on first use
async function ensureConnection() {
  if (!isConnected) {
    try {
      client.on("error", (err) => console.error("Redis Client Error:", err))
      await client.connect()
      isConnected = true
      console.log("Redis client connected successfully")
    } catch (error) {
      console.error("Failed to connect to Redis:", error)
      throw error
    }
  }
}

// Get data from cache
export async function getCachedData(key: string) {
  try {
    await ensureConnection()
    const data = await client.get(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error(`Error getting cached data for key ${key}:`, error)
    return null // Fail gracefully by returning null
  }
}

// Set data in cache with TTL
export async function setCachedData(key: string, data: any, ttlSeconds = 3600) {
  try {
    await ensureConnection()
    await client.set(key, JSON.stringify(data), { EX: ttlSeconds })
    return true
  } catch (error) {
    console.error(`Error setting cached data for key ${key}:`, error)
    return false
  }
}

// Invalidate cache for a specific key
export async function invalidateCache(key: string) {
  try {
    await ensureConnection()
    await client.del(key)
    return true
  } catch (error) {
    console.error(`Error invalidating cache for key ${key}:`, error)
    return false
  }
}

// Get all keys matching a pattern
export async function getKeysByPattern(pattern: string) {
  try {
    await ensureConnection()
    return await client.keys(pattern)
  } catch (error) {
    console.error(`Error getting keys by pattern ${pattern}:`, error)
    return []
  }
}

// Graceful shutdown function to be used when the application terminates
export async function closeRedisConnection() {
  if (isConnected) {
    try {
      await client.quit()
      isConnected = false
      console.log("Redis connection closed")
    } catch (error) {
      console.error("Error closing Redis connection:", error)
    }
  }
}

// For testing the connection
export async function testRedisConnection() {
  try {
    await ensureConnection()
    await client.set("test", "connection successful")
    const result = await client.get("test")
    console.log("Redis test result:", result)
    return result === "connection successful"
  } catch (error) {
    console.error("Redis connection test failed:", error)
    return false
  }
}