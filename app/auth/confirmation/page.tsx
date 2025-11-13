import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import AuthLayout from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ConfirmationPage() {
  const userRole = cookies().get("userRole")?.value as UserRole;

  if (!userRole || (userRole !== UserRole.VOLUNTEER && userRole !== UserRole.SPONSOR)) {
    redirect("/auth/login");
  }

  const isVolunteer = userRole === UserRole.VOLUNTEER;

  return (
    <AuthLayout
      title={isVolunteer ? "Welcome Aboard!" : "Thank You for Your Support!"}
      description={isVolunteer ? "Your volunteer journey starts here." : "Your sponsorship journey begins now."}
      image="/signup.jpg"
      imageAlt="Confirmation illustration"
    >
      <div className="space-y-6">
        <div className="text-center space-y-4">
          {isVolunteer ? (
            <>
              <h2 className="text-2xl font-bold text-green-600">Thank you for signing up as a Volunteer.</h2>
              <p className="text-lg text-muted-foreground">
                We're thrilled to have you join our mission to make a difference!
              </p>
              <div className="bg-blue-50 dark:bg-blue-950/50 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="text-xl font-semibold mb-4">🔧 Coming Soon: Your Dashboard</h3>
                <p className="text-muted-foreground mb-4">
                  Your dashboard is currently under development — we're crafting an amazing experience tailored just for you.
                </p>
                <ul className="list-disc list-inside space-y-2 text-left">
                  <li>Access your volunteer dashboard</li>
                  <li>Track your impact and activities</li>
                  <li>Connect with other volunteers</li>
                </ul>
                <p className="mt-4 text-sm text-muted-foreground">
                  Stay tuned — we'll notify you once it's ready!
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-green-600">Thank you for becoming a Sponsor.</h2>
              <p className="text-lg text-muted-foreground">
                Your support means the world to us — you're helping drive real change!
              </p>
              <div className="bg-purple-50 dark:bg-purple-950/50 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="text-xl font-semibold mb-4">💡 Coming Soon: Your Dashboard</h3>
                <p className="text-muted-foreground mb-4">
                  Your personalized sponsor dashboard is currently in progress.
                </p>
                <ul className="list-disc list-inside space-y-2 text-left">
                  <li>Manage your sponsorships and donations</li>
                  <li>View reports and project updates</li>
                  <li>Connect with beneficiaries and partners</li>
                </ul>
                <p className="mt-4 text-sm text-muted-foreground">
                  We'll reach out as soon as it's live — thank you for your patience and support!
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}