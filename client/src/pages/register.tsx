import { useState } from "react";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoryGrid } from "@/components/category-grid";
import { insertMemberSchema, type InsertMember } from "@shared/schema";
import { BLOOD_GROUPS } from "@/lib/constants";
import { apiRequest } from "@/lib/queryClient";

declare const Razorpay: any;

export default function Register() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [photoPreview, setPhotoPreview] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isValidCoupon, setIsValidCoupon] = useState(false);

  const form = useForm<InsertMember>({
    resolver: zodResolver(insertMemberSchema),
  });

  const validateCoupon = (code: string) => {
    // Validate coupon code
    if (code.toUpperCase() === "ABINASH10") {
      setIsValidCoupon(true);
      toast({
        title: "Coupon Applied!",
        description: "You got 10% off on your membership fee.",
      });
    } else if (code) {
      setIsValidCoupon(false);
      toast({
        title: "Invalid Coupon",
        description: "Please enter a valid coupon code.",
        variant: "destructive",
      });
    }
  };

  const handlePayment = async (data: InsertMember) => {
    try {
      setIsSubmitting(true);
      const response = await apiRequest("POST", "/api/members", {
        ...data,
        couponCode: isValidCoupon ? couponCode : undefined,
      });
      const { member, order } = await response.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Corrected line
        amount: order.amount,
        currency: order.currency,
        name: "Artist Membership Platform",
        description: "Artist Membership Registration",
        order_id: order.id,
        handler: async function (response: any) {
          try {
            const verifyResponse = await apiRequest("POST", "/api/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyResponse.ok) {
              navigate(`/success/${member.id}`);
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            toast({
              title: "Payment verification failed",
              description: "Please contact support if payment was deducted",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: data.name,
          email: data.email,
          contact: data.phone,
        },
        theme: {
          color: "#2C3E50",
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        form.setValue("photoUrl", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const baseAmount = 9440;
  const discountedAmount = isValidCoupon ? baseAmount * 0.9 : baseAmount;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Artist Registration</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handlePayment)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bloodGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Group</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BLOOD_GROUPS.map((group) => (
                          <SelectItem key={group} value={group}>
                            {group}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Photo</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </FormControl>
                {photoPreview && (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="mt-2 w-32 h-32 object-cover rounded"
                  />
                )}
              </FormItem>

              {/* Coupon Code Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => validateCoupon(couponCode)}
                >
                  Apply
                </Button>
              </div>
            </div>

            <div>
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Category</FormLabel>
                    <FormControl>
                      <CategoryGrid
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : `Register & Pay ₹${discountedAmount.toFixed(2)}`}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}