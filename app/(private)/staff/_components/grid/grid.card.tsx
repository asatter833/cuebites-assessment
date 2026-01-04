"use client";

import * as React from "react";
import {
  Briefcase,
  Globe,
  MapPin,
  Circle,
  Mars,
  Venus,
  Mail,
  Phone,
} from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, nationalityToCode } from "@/lib/utils";
import { FavoriteToggle } from "../favourite.button";
import { UpdateStaffDialog } from "../update/update.staff";
import { gender } from "@/generated/prisma/enums";
import { DeleteStaffButton } from "../delete.button";
import { StatusBadge } from "../status.components";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
  const countryCode = nationalityToCode[staff?.nationality];

  return (
    <Card className="w-full max-w-md shadow-sm overflow-hidden border-slate-200 hover:shadow-md transition-shadow">
      {/* Header with Sidebar-style background */}
      <CardHeader className="px-4 bg-slate-50 border-b relative ">
        <div className="flex flex-row items-start justify-between">
          <div className="flex items-center gap-x-3">
            <Avatar className="h-12 w-12 rounded-lg border-2 border-white shadow-sm">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${staff.full_name}`}
              />
              <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                {staff.full_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base tracking-tight text-slate-900 line-clamp-1">
                  {staff?.full_name}
                </h3>
                {staff?.gender === gender?.male ? (
                  <Mars className="size-3.5 text-blue-500" />
                ) : staff?.gender === gender?.female ? (
                  <Venus className="size-3.5 text-pink-500" />
                ) : null}
              </div>
              <Badge
                variant="secondary"
                className="text-[10px] uppercase font-bold tracking-wider py-0 px-2 bg-blue-50 text-blue-700 border-blue-100"
              >
                {staff.job_title}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <FavoriteToggle
              id={staff?.id}
              isFavorite={staff?.is_favourite}
              staffName={staff?.full_name}
            />
            <UpdateStaffDialog staff={staff} />
            <DeleteStaffButton id={staff?.id} staffName={staff?.full_name} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Contact Quick Info */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Mail className="size-3" />
            <span className="truncate max-w-[120px]">{staff.email}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="size-3" />
            <span>{staff.phone}</span>
          </div>
        </div>

        <Separator className="bg-slate-100" />

        {/* Detailed Grid - Using Sidebar Bold Labels */}
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Nationality
            </span>
            <div className="flex items-center gap-2">
              <img
                src={`https://flagcdn.com/w20/${countryCode?.toLowerCase()}.png`}
                alt="flag"
                className="w-4 h-3 rounded-sm object-cover shadow-sm"
              />
              <span className="text-sm font-semibold text-slate-700">
                {staff.nationality}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Location
            </span>
            <div className="flex items-center gap-1 text-slate-700">
              <MapPin className="size-3 text-slate-400" />
              <span className="text-sm font-semibold truncate max-w-[180px]">
                {staff.address || "Not specified"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Current Status
            </span>
            <StatusBadge status={staff.status} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
