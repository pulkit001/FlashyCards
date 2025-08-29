'use client';

import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { generateAICards } from "@/app/dashboard/actions";
import { Sparkles, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

interface AIGenerateCardsProps {
  deckId: string;
}

export function AIGenerateCards({ deckId }: AIGenerateCardsProps) {
  
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsGenerating(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await generateAICards(formData);
      setSuccess(result.message);
      
      // Close dialog after a short delay to show success message
      setTimeout(() => {
        setOpen(false);
        setSuccess(null);
      }, 2000);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isGenerating) {
      setOpen(newOpen);
      if (!newOpen) {
        setError(null);
        setSuccess(null);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="shadow-lg hover:shadow-xl border-primary/20 hover:border-primary/40">
          <Sparkles className="h-5 w-5 mr-2 text-primary" />
          Generate 10 AI Cards
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold flex items-center">
            <Sparkles className="h-6 w-6 mr-2 text-primary" />
            Generate AI Flashcards
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Let AI create 10 high-quality flashcards for any topic you choose.
          </DialogDescription>
        </DialogHeader>
        
        <form action={handleSubmit} className="space-y-6 py-2">
          <input type="hidden" name="deckId" value={deckId} />
          
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
              {error.includes("Pro feature") && (
                <Link href="/pricing" className="ml-auto text-blue-600 hover:text-blue-800 underline">
                  Upgrade Now
                </Link>
              )}
            </div>
          )}
          
          {success && (
            <div className="flex items-center gap-2 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
              <CheckCircle className="h-4 w-4" />
              <span>{success}</span>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="topic" className="text-right font-medium">
                Topic
              </Label>
              <Input
                id="topic"
                name="topic"
                className="col-span-3 h-11"
                placeholder="e.g., Spanish vocabulary, React hooks, World War 2..."
                required
                disabled={isGenerating}
              />
            </div>
            
            <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
              <p className="font-medium mb-1">💡 Tips for better results:</p>
              <ul className="space-y-1 text-xs">
                <li>• Be specific: &quot;React useState hook&quot; vs &quot;React&quot;</li>
                <li>• Include context: &quot;Spanish food vocabulary for beginners&quot;</li>
                <li>• Mention difficulty: &quot;Advanced calculus derivatives&quot;</li>
              </ul>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleOpenChange(false)}
              size="lg"
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button type="submit" size="lg" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Cards
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
