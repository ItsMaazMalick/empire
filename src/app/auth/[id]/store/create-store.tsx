"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { createStore } from "@/actions/store";

const initialState = {
  success: false,
  message: "",
};

export function CreateStoreForm({ userId }: { userId?: string }) {
  const { toast } = useToast();
  const [state, action, isPending] = useActionState(createStore, initialState);

  useEffect(() => {
    if (state.success) {
      toast({
        description: state.message || "Brand added successfully",
      });
    } else if (state.message) {
      toast({
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Create Your Store Account
          </CardTitle>
          <CardDescription className="text-center">
            Fill in your details to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Store Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Empire"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Code</Label>
              <Input
                id="code"
                name="code"
                type="text"
                placeholder="1234"
                required
              />
              {userId && (
                <Input
                  id="userId"
                  name="userId"
                  type="hidden"
                  defaultValue={userId}
                />
              )}
            </div>
            <div className="flex items-center justify-center">
              <Button className="" type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Store"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
