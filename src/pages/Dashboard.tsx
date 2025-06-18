import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { RoleCheck } from '@/components/auth/RoleCheck';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <RoleCheck>
      <div className="w-full max-w-7xl mx-auto p-6">
        <DashboardHeader />

        <div className="mt-8 space-y-6">
          <WelcomeBanner user={user} />
          <DashboardMetrics />
          <QuickActions />
          <RecentActivity />
        </div>
      </div>
    </RoleCheck>
  );
}
