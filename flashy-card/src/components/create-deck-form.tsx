'use client';

import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input"; // Assuming Input will be added
import { Label } from "./ui/label"; // Assuming Label will be added
import { createDeck } from "@/app/dashboard/actions";

export function CreateDeckForm() {
  const [open, setOpen] = useState(false);


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create New Deck</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Deck</DialogTitle>
          <DialogDescription>
            Fill in the details for your new flashcard deck.
          </DialogDescription>
        </DialogHeader>
        <form action={createDeck} onSubmit={() => setOpen(false)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              name="description"
              className="col-span-3"
            />
          </div>
          <Button type="submit">Create Deck</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
