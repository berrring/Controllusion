from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class ApiModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class ApiMessageResponse(ApiModel):
    message: str
    success: bool = True


class UserResponse(ApiModel):
    id: UUID
    full_name: str = Field(alias="fullName")
    email: EmailStr
    role: str
    is_active: bool = Field(alias="isActive")
    title: str | None = None
    phone: str | None = None
    theme_preference: str = Field(alias="themePreference")
    avatar_url: str | None = Field(default=None, alias="avatarUrl")
    created_at: datetime = Field(alias="createdAt")
    updated_at: datetime = Field(alias="updatedAt")


class AuthResponse(ApiModel):
    token: str
    user: UserResponse


class LoginRequest(ApiModel):
    email: EmailStr
    password: str


class RegisterRequest(ApiModel):
    full_name: str = Field(alias="fullName", min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    confirm_password: str = Field(alias="confirmPassword", min_length=8, max_length=128)


class UpdateProfileRequest(ApiModel):
    full_name: str = Field(alias="fullName", min_length=2, max_length=120)
    email: EmailStr
    phone: str | None = None
    title: str | None = None
    theme_preference: str | None = Field(default="light", alias="themePreference")
    avatar_url: str | None = Field(default=None, alias="avatarUrl")


class ChangePasswordRequest(ApiModel):
    current_password: str = Field(alias="currentPassword", min_length=1, max_length=128)
    new_password: str = Field(alias="newPassword", min_length=8, max_length=128)
    confirm_new_password: str = Field(alias="confirmNewPassword", min_length=8, max_length=128)


class InviteUserRequest(ApiModel):
    full_name: str = Field(alias="fullName", min_length=2, max_length=120)
    email: EmailStr
    role: str = "User"
    title: str | None = None


class UpdateUserRequest(ApiModel):
    full_name: str | None = Field(default=None, alias="fullName")
    email: EmailStr | None = None
    role: str | None = None
    title: str | None = None
    phone: str | None = None
    is_active: bool | None = Field(default=None, alias="isActive")


class CustomerRequest(ApiModel):
    full_name: str = Field(alias="fullName", min_length=2, max_length=120)
    email: EmailStr
    phone: str = Field(min_length=3, max_length=40)
    company: str = Field(min_length=2, max_length=160)
    job_title: str | None = Field(default=None, alias="jobTitle")
    status: str
    stage: str
    deal_value: Decimal = Field(alias="dealValue", ge=0)
    notes: str | None = Field(default=None, max_length=4000)
    location: str | None = Field(default=None, max_length=160)
    industry: str | None = Field(default=None, max_length=120)

    @field_validator("deal_value", mode="before")
    @classmethod
    def normalize_decimal(cls, value: Any):
        if value in ("", None):
            return Decimal("0")
        return value


class CustomerTimelineItemResponse(ApiModel):
    id: UUID
    type: str
    title: str
    description: str
    date: datetime


class CustomerDealResponse(ApiModel):
    id: UUID
    title: str
    amount: Decimal
    stage: str
    close_date: datetime = Field(alias="closeDate")


class CustomerNoteEntryResponse(ApiModel):
    id: UUID
    author: str
    body: str
    date: datetime


class CustomerResponse(ApiModel):
    id: UUID
    full_name: str = Field(alias="fullName")
    email: EmailStr
    phone: str
    company: str
    job_title: str | None = Field(default=None, alias="jobTitle")
    status: str
    stage: str
    deal_value: Decimal = Field(alias="dealValue")
    notes: str | None = None
    location: str | None = None
    industry: str | None = None
    last_contacted_at: datetime | None = Field(default=None, alias="lastContactedAt")
    created_at: datetime = Field(alias="createdAt")
    updated_at: datetime = Field(alias="updatedAt")
    timeline: list[CustomerTimelineItemResponse]
    deals: list[CustomerDealResponse]
    note_entries: list[CustomerNoteEntryResponse] = Field(alias="noteEntries")


class DashboardRevenuePointResponse(ApiModel):
    name: str
    revenue: Decimal
    deals: int


class DashboardActivityResponse(ApiModel):
    id: UUID
    type: str
    title: str
    description: str
    customer_id: UUID | None = Field(default=None, alias="customerId")
    customer_name: str | None = Field(default=None, alias="customerName")
    date: datetime


class DashboardTaskResponse(ApiModel):
    id: UUID
    title: str
    description: str
    owner: str
    status: str
    due_date: datetime = Field(alias="dueDate")


class DashboardSummaryResponse(ApiModel):
    total_customers: int = Field(alias="totalCustomers")
    active_deals: int = Field(alias="activeDeals")
    pipeline_value: Decimal = Field(alias="pipelineValue")
    conversion_rate: int = Field(alias="conversionRate")
    revenue: list[DashboardRevenuePointResponse]
    activity: list[DashboardActivityResponse]
    tasks: list[DashboardTaskResponse]
