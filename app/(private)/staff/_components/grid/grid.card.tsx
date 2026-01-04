"use client";

import * as React from "react";
import { Briefcase, Globe, MapPin, Circle, Mars, Venus } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, nationalityToCode } from "@/lib/utils";
import { FavoriteToggle } from "../favourite.button";
import { UpdateStaffDialog } from "../update/update.staff";
import { gender } from "@/generated/prisma/enums";
import { DeleteStaffButton } from "../delete.button";
import { StatusBadge } from "../status.components";

export interface StaffCardProps {
  staff: {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    job_title: string;
    is_active: boolean;
    is_favourite: boolean;
    gender: gender;
    dob: Date | null;
    nationality: string;
    address: string | null;
    status: string | null;
  };
}

export function StaffCard({ staff }: StaffCardProps) {
  console.log(staff);
  const countryCode = nationalityToCode[staff?.nationality];
  return (
    <Card className="w-full max-w-md shadow-sm overflow-hidden border-muted/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-x-3">
          <Avatar className="h-10 w-10 rounded-lg border">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${staff.full_name}`}
            />
            <AvatarFallback>{staff.full_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg tracking-tight">
              <span
                className="font-medium line-clamp-1"
                title={staff?.full_name}
              >
                {staff?.full_name}
              </span>
            </h3>
            {staff?.gender === gender?.male ? (
              <Mars className="size-4 text-blue-500 shrink-0" />
            ) : staff?.gender === gender?.female ? (
              <Venus className="size-4 text-pink-500 shrink-0" />
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <FavoriteToggle
            id={staff?.id}
            isFavorite={staff?.is_favourite}
            staffName={staff?.full_name}
          />
          <DeleteStaffButton id={staff?.id} staffName={staff?.full_name} />
          <UpdateStaffDialog staff={staff} />
        </div>
      </CardHeader>

      <CardContent className="grid gap-2 text-sm">
        {/* Job Title */}
        <div className="grid grid-cols-[120px_1fr] items-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Briefcase className="size-4" />
            <span>Job Title</span>
          </div>
          <span className="font-medium capitalize">{staff.job_title}</span>
        </div>

        {/* Nationality */}
        <div className="grid grid-cols-[120px_1fr] items-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Globe className="size-4" />
            <span>Nationality</span>
          </div>
          <div className="flex items-center gap-2 uppercase">
            <img
              src={`https://flagcdn.com/w20/${countryCode}.png`}
              srcSet={`https://flagcdn.com/w40/${countryCode}.png 2x`}
              alt={`${staff?.nationality} flag`}
              className="w-5 h-3.5 rounded-sm object-cover"
            />
            <span className="font-medium">
              {staff.nationality || "Not specified"}
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-[120px_1fr] items-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="size-4" />
            <span>Location</span>
          </div>
          {staff?.address ? (
            <div className="flex items-center gap-2">
              <img
                src={`https://flagcdn.com/w20/${countryCode}.png`}
                srcSet={`https://flagcdn.com/w40/${countryCode}.png 2x`}
                alt={`${staff?.nationality} flag`}
                className="w-5 h-3.5 rounded-sm object-cover"
              />
              <span
                className="font-medium line-clamp-1 text-xs"
                title={staff.address}
              >
                {staff.address}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground/50 text-xs font-semibold tracking-tight">
              N/A
            </span>
          )}
        </div>

        {/* Status */}
        <div className="grid grid-cols-[120px_1fr] items-center">
          <div className="flex items-center gap-2">
            <div className="grid grid-cols-[120px_1fr] items-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Circle className="size-4" />
                <span>Status</span>
              </div>
              <StatusBadge status={staff.status} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
