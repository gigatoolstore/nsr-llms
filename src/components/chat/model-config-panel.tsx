"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { suggestModelConfiguration } from "@/ai/flows/suggest-model-configuration";

interface ModelConfigPanelProps {
  initialTemperature?: number;
  initialMaxTokens?: number;
}

export function ModelConfigPanel({ initialTemperature = 0.7, initialMaxTokens = 2048 }: ModelConfigPanelProps) {
  const [temperature, setTemperature] = useState(initialTemperature);
  const [maxTokens, setMaxTokens] = useState(initialMaxTokens);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSuggestConfig = async () => {
    setIsLoading(true);
    try {
      const result = await suggestModelConfiguration({ task: "A versatile and creative chat assistant." });
      if (result) {
        setTemperature(result.temperature);
        setMaxTokens(result.maxTokens);
        toast({
          title: "Configuration Suggested",
          description: "Optimal settings have been applied.",
        });
      }
    } catch (error) {
      console.error("Failed to suggest configuration:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not suggest a new configuration.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-4">
        <CardTitle>Model Configuration</CardTitle>
        <CardDescription>Adjust the parameters for the model's responses.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="temperature">Temperature</Label>
            <span className="text-sm text-muted-foreground">{temperature.toFixed(2)}</span>
          </div>
          <Slider
            id="temperature"
            min={0}
            max={2}
            step={0.01}
            value={[temperature]}
            onValueChange={(value) => setTemperature(value[0])}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="max-tokens">Max Tokens</Label>
          <Input
            id="max-tokens"
            type="number"
            value={maxTokens}
            onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
          />
        </div>
        <Button onClick={handleSuggestConfig} disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          {isLoading ? (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Suggest Configuration
        </Button>
      </CardContent>
    </Card>
  );
}
