'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCard } from "@/app/dashboard/actions";
import { Plus } from "lucide-react";

export function CreateCardForm({ deckId }: { deckId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="shadow-lg hover:shadow-xl">
          <Plus className="h-5 w-5" />
          Create New Card
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold">Create New Card</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Fill in the details for your new flashcard.
          </DialogDescription>
        </DialogHeader>
        <form action={createCard} onSubmit={() => setOpen(false)} className="space-y-6 py-2">
          <input type="hidden" name="deckId" value={deckId} />
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="frontText" className="text-right font-medium">
                Front
              </Label>
              <Input
                id="frontText"
                name="frontText"
                className="col-span-3 h-11"
                placeholder="Enter front text"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="backText" className="text-right font-medium">
                Back
              </Label>
              <Input
                id="backText"
                name="backText"
                className="col-span-3 h-11"
                placeholder="Enter back text"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right font-medium">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                className="col-span-3 h-11"
                placeholder="Enter description (optional)"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              size="lg"
            >
              Cancel
            </Button>
            <Button type="submit" size="lg">
              Create Card
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
