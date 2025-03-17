import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryGrid } from "@/components/category-grid";
import {
  insertMemberSchema,
  type InsertMember,
} from "../../../server/models/schema";
import { BLOOD_GROUPS } from "@/lib/constants";
import { apiRequest } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CATEGORY_PRICES: Record<string, string> = {
  Artist: "₹4,818",
  Director: "₹7,290",
  Producer: "₹9,890",
  Writer: "₹2,560",
  Production: "₹5,620",
  Cinematographer: "₹6,510",
  Singer: "₹3,210",
  "Music Director": "₹4,150",
};

export default function Register() {
  const { toast } = useToast();
  const [photoPreview, setPhotoPreview] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isValidCoupon, setIsValidCoupon] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const form = useForm<InsertMember>({
    resolver: zodResolver(insertMemberSchema),
  });

  // ✅ Validate Coupon Code
  const validateCoupon = (code: string) => {
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

  // ✅ Handle Form Submission
  const handleSubmit = async (data: InsertMember) => {
    try {
      setIsSubmitting(true);
      const response = await apiRequest("POST", "/api/members", {
        ...data,
        couponCode: isValidCoupon ? "ABINASH10" : undefined,
      });

      console.log("API Response:", response); // ✅ Debugging

      if (response?.status === 201) {
        setShowSuccessPopup(true); // ✅ Trigger success popup
      } else {
        throw new Error(response?.statusText || "Failed to register");
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description:
          error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Handle Photo Upload
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

  // ✅ Watch selected category and calculate price
  const selectedCategory = form.watch("category");
  const price = selectedCategory ? CATEGORY_PRICES[selectedCategory] : null;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Zoom Card Registration</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* ✅ Left Section */}
            <div className="space-y-4">
              {/* Name */}
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

              {/* Email */}
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

              {/* Phone */}
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

              {/* ✅ Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Blood Group */}
              <FormField
                control={form.control}
                name="bloodGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Group</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Blood Group" />
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

              {/* Photo */}
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

              {/* ✅ Register Button Below Photo */}
              <div className="flex mt-4 justify-start gap-4">
                <Button type="submit" size="lg" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Processing..."
                    : selectedCategory && price
                    ? `Register as ${selectedCategory} (${price})`
                    : "Register"}
                </Button>
              </div>
            </div>

            {/* ✅ Category Section */}
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

              {/* ✅ 5000+ Active Members */}
              <p className="text-center text-lg text-green-500 mt-4">
                5,000+ Zoom Cards have already been registered under associations. The Zoom Card permits all shoots across Pan India.
                <br/><br/><b className="text-red-700">Benefits for Zoom Card Members:</b><br/>
                <div className="mx-20">
                  <p className="text-xl text-gray-700 max-w-3xl mx-auto text-left">
                    <span className="block">✅ Exclusive access to industry events</span>
                    <span className="block">✅ Networking opportunities with professionals</span>
                    <span className="block">✅ Personalized profile on our platform</span>
                    <span className="block">✅ Priority consideration for projects</span>
                    <span className="block">
                      🔒 Security Deposit: ₹8,000 + 18% GST (Refundable within 90-120 days) for member security.
                    </span>
                  </p>
                </div>
              </p>
            </div>
          </div>
        </form>
      </Form>

      {/* ✅ Success Popup */}
      <Dialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registration Successful!</DialogTitle>
          </DialogHeader>
          <p>You have successfully registered as a member.</p>
          <DialogFooter>
            <Button onClick={() => setShowSuccessPopup(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ✅ WhatsApp Contact */}
      <div className="flex justify-center mt-4">
        <a
          href="https://wa.me/8977907739"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-500 font-semibold underline"
        >
          Contact us on WhatsApp: +91 89779 07739
        </a>
      </div>
    </div>
  );
}
