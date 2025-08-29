'use client';

import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { createDeck } from "@/app/dashboard/actions";
import { Plus } from "lucide-react";
import Link from "next/link";
import { 
  FormContainer, 
  FormField, 
  FormActions, 
  EnhancedInput, 
  SubmitButton, 
  CancelButton 
} from "./ui/form-components";
import { Alert } from "./ui/status";

export function CreateDeckForm() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await createDeck(formData);
      setOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="shadow-lg hover:shadow-xl">
          <Plus className="h-5 w-5" />
          Create New Deck
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold">Create New Deck</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Fill in the details for your new flashcard deck.
          </DialogDescription>
        </DialogHeader>
        <FormContainer onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          handleSubmit(formData);
        }}>
          {error && (
            <Alert 
              variant={error.includes("Upgrade to Pro") ? "warning" : "error"}
              title="Error creating deck"
            >
              <div className="flex items-center justify-between">
                <span>{error}</span>
                {error.includes("Upgrade to Pro") && (
                  <Link href="/pricing" className="ml-auto text-blue-600 hover:text-blue-800 underline font-medium">
                    Upgrade Now
                  </Link>
                )}
              </div>
            </Alert>
          )}
          
          <FormField
            label="Deck Name"
            required
            labelProps={{ htmlFor: "name" }}
            hint="Choose a descriptive name for your flashcard deck"
          >
            <EnhancedInput
              id="name"
              name="name"
              placeholder="Enter deck name"
              required
              disabled={isSubmitting}
              loading={isSubmitting}
            />
          </FormField>
          
          <FormField
            label="Description"
            labelProps={{ htmlFor: "description" }}
            hint="Optional description to help you remember what this deck is about"
          >
            <EnhancedInput
              id="description"
              name="description"
              placeholder="Enter deck description (optional)"
              disabled={isSubmitting}
            />
          </FormField>
          
          <FormActions variant="end">
            <CancelButton 
              onClick={() => {
                setOpen(false);
                setError(null);
              }}
            />
            <SubmitButton 
              loading={isSubmitting}
              loadingText="Creating..."
              size="lg"
            >
              Create Deck
            </SubmitButton>
          </FormActions>
        </FormContainer>
      </DialogContent>
    </Dialog>
  );
}
