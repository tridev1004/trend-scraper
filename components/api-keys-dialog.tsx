"use client"

import React, { useState, useEffect } from "react"
import { Key, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlatformIcon } from "@/components/platform-icon"
import { ApiKeyConfig } from "@/types"
import { toast } from "sonner"

export function ApiKeysDialog() {
  const [open, setOpen] = useState(false)
  const [keys, setKeys] = useState<ApiKeyConfig>({
    youtube: "",
    reddit: {
      clientId: "",
      clientSecret: "",
    },
    twitter: {
      apiKey: "",
      apiKeySecret: "",
      bearerToken: "",
    },
  })
  const [keysConfigured, setKeysConfigured] = useState({
    youtube: false,
    reddit: false,
    twitter: false,
  })

  // Fetch current API key configuration
  const fetchApiKeys = async () => {
    try {
      const response = await fetch("/api/keys")
      const data = await response.json()
      setKeysConfigured(data.keysConfigured)
    } catch (error) {
      console.error("Error fetching API keys:", error)
    }
  }

  useEffect(() => {
    fetchApiKeys()
  }, [])

  const handleSave = async () => {
    try {
      // Only send non-empty values
      const payload: Partial<ApiKeyConfig> = {}
      
      if (keys.youtube) {
        payload.youtube = keys.youtube
      }
      
      if (keys.reddit?.clientId || keys.reddit?.clientSecret) {
        payload.reddit = {
          clientId: keys.reddit.clientId,
          clientSecret: keys.reddit.clientSecret,
        }
      }
      
      if (keys.twitter?.apiKey || keys.twitter?.apiKeySecret || keys.twitter?.bearerToken) {
        payload.twitter = {
          apiKey: keys.twitter.apiKey,
          apiKeySecret: keys.twitter.apiKeySecret,
          bearerToken: keys.twitter.bearerToken,
        }
      }
      
      const response = await fetch("/api/keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      
      if (response.ok) {
        toast.success("API keys updated successfully")
        await fetchApiKeys()
        setOpen(false)
      } else {
        toast.error("Failed to update API keys")
      }
    } catch (error) {
      console.error("Error saving API keys:", error)
      toast.error("Failed to update API keys")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Key className="h-4 w-4" />
          API Keys
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configure API Keys</DialogTitle>
          <DialogDescription>
            Add your API keys for each platform to enable full functionality. Your keys are stored securely in memory.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="youtube" className="mt-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="youtube" className="flex items-center justify-center gap-2">
              <PlatformIcon platform="youtube" size={16} />
              YouTube
            </TabsTrigger>
            <TabsTrigger value="reddit" className="flex items-center justify-center gap-2">
              <PlatformIcon platform="reddit" size={16} />
              Reddit
            </TabsTrigger>
            <TabsTrigger value="twitter" className="flex items-center justify-center gap-2">
              <PlatformIcon platform="twitter" size={16} />
              Twitter
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="youtube" className="space-y-4 pt-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                To access YouTube data, you need a YouTube Data API v3 key from the Google Cloud Console.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="youtube-api-key">API Key</Label>
              <Input
                id="youtube-api-key"
                placeholder={keysConfigured.youtube ? "API key configured" : "Enter your YouTube API key"}
                value={keys.youtube || ""}
                onChange={(e) => setKeys({ ...keys, youtube: e.target.value })}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="reddit" className="space-y-4 pt-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                To access Reddit data, you need to create an app on Reddit and obtain client credentials.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reddit-client-id">Client ID</Label>
              <Input
                id="reddit-client-id"
                placeholder={keysConfigured.reddit ? "Client ID configured" : "Enter your Reddit Client ID"}
                value={keys.reddit?.clientId || ""}
                onChange={(e) => setKeys({ 
                  ...keys, 
                  reddit: { ...keys.reddit, clientId: e.target.value }  as any
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reddit-client-secret">Client Secret</Label>
              <Input
                id="reddit-client-secret"
                type="password"
                placeholder={keysConfigured.reddit ? "Client Secret configured" : "Enter your Reddit Client Secret"}
                value={keys.reddit?.clientSecret || ""}
                onChange={(e) => setKeys({ 
                  ...keys, 
                  reddit: { ...keys.reddit, clientSecret: e.target.value }  as any
                })}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="twitter" className="space-y-4 pt-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                For Twitter access, you can either provide a Bearer Token (recommended) or API key credentials.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="twitter-bearer">Bearer Token</Label>
              <Input
                id="twitter-bearer"
                type="password"
                placeholder={keysConfigured.twitter ? "Bearer token configured" : "Enter your Twitter Bearer Token"}
                value={keys.twitter?.bearerToken || ""}
                onChange={(e) => setKeys({ 
                  ...keys, 
                  twitter: { ...keys.twitter, bearerToken: e.target.value }  as any
                })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="twitter-api-key">API Key</Label>
                <Input
                  id="twitter-api-key"
                  placeholder="API Key"
                  value={keys.twitter?.apiKey || ""}
                  onChange={(e) => setKeys({ 
                    ...keys, 
                    twitter: { ...keys.twitter, apiKey: e.target.value } as any
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="twitter-api-secret">API Secret</Label>
                <Input
                  id="twitter-api-secret"
                  type="password"
                  placeholder="API Secret"
                  value={keys.twitter?.apiKeySecret || ""}
                  onChange={(e) => setKeys({ 
                    ...keys, 
                    twitter: { ...keys.twitter, apiKeySecret: e.target.value } as any
                  })}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save API Keys
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}