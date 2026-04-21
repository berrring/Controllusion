from __future__ import annotations

import uuid
from collections import OrderedDict
from datetime import timedelta
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session, selectinload

from .config import settings
from .database import get_db
from .models import Customer, CustomerStage, CustomerStatus, User, UserRole, utc_now
from .schemas import (
    ApiMessageResponse,
    AuthResponse,
    ChangePasswordRequest,
    CustomerDealResponse,
    CustomerNoteEntryResponse,
    CustomerRequest,
    CustomerResponse,
    CustomerTimelineItemResponse,
    DashboardActivityResponse,
    DashboardRevenuePointResponse,
    DashboardSummaryResponse,
    DashboardTaskResponse,
    InviteUserRequest,
    LoginRequest,
    RegisterRequest,
    UpdateProfileRequest,
    UpdateUserRequest,
    UserResponse,
)
from .security import create_access_token, get_current_user, hash_password, require_admin, verify_password


router = APIRouter(prefix="/api")
ACTIVE_STAGES = {
    CustomerStage.QUALIFIED.value,
    CustomerStage.PROPOSAL.value,
    CustomerStage.NEGOTIATION.value,
}


def normalize_email(email: str) -> str:
    return email.strip().lower()


def maybe_trim(value: str | None) -> str | None:
    if value is None:
        return None
    stripped = value.strip()
    return stripped or None


def resolve_enum(enum_class, value: str, invalid_message: str) -> str:
    try:
        return enum_class.from_value(value).value
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=invalid_message) from exc


def serialize_user(user: User) -> UserResponse:
    return UserResponse(
        id=user.id,
        fullName=user.full_name,
        email=user.email,
        role=user.role,
        isActive=user.active,
        title=user.title,
        phone=user.phone,
        themePreference=user.theme_preference,
        avatarUrl=user.avatar_url,
        createdAt=user.created_at,
        updatedAt=user.updated_at,
    )


def build_timeline(customer: Customer) -> list[CustomerTimelineItemResponse]:
    items = [
        CustomerTimelineItemResponse(
            id=uuid.uuid5(uuid.NAMESPACE_URL, f"{customer.id}:created"),
            type="Create",
            title="Customer record created",
            description=f"{customer.full_name} was added to the CRM.",
            date=customer.created_at,
        )
    ]

    if customer.updated_at and customer.updated_at != customer.created_at:
        items.append(
            CustomerTimelineItemResponse(
                id=uuid.uuid5(uuid.NAMESPACE_URL, f"{customer.id}:updated"),
                type="Update",
                title="Customer record updated",
                description="Profile details or pipeline status were updated.",
                date=customer.updated_at,
            )
        )

    if customer.last_contacted_at:
        items.append(
            CustomerTimelineItemResponse(
                id=uuid.uuid5(uuid.NAMESPACE_URL, f"{customer.id}:contacted"),
                type="Follow-up",
                title="Customer contact checkpoint",
                description="Latest customer touchpoint captured for pipeline tracking.",
                date=customer.last_contacted_at,
            )
        )

    return sorted(items, key=lambda item: item.date, reverse=True)


def build_deals(customer: Customer) -> list[CustomerDealResponse]:
    anchor = customer.updated_at or customer.created_at
    return [
        CustomerDealResponse(
            id=uuid.uuid5(uuid.NAMESPACE_URL, f"{customer.id}:deal"),
            title=f"{customer.company} opportunity",
            amount=customer.deal_value,
            stage=customer.stage,
            closeDate=anchor + timedelta(days=14),
        )
    ]


def build_notes(customer: Customer) -> list[CustomerNoteEntryResponse]:
    if not customer.notes:
        return []

    author = customer.owner.full_name if customer.owner else "Controllusion"
    return [
        CustomerNoteEntryResponse(
            id=uuid.uuid5(uuid.NAMESPACE_URL, f"{customer.id}:note"),
            author=author,
            body=customer.notes,
            date=customer.updated_at or customer.created_at,
        )
    ]


def serialize_customer(customer: Customer) -> CustomerResponse:
    return CustomerResponse(
        id=customer.id,
        fullName=customer.full_name,
        email=customer.email,
        phone=customer.phone,
        company=customer.company,
        jobTitle=customer.job_title,
        status=customer.status,
        stage=customer.stage,
        dealValue=customer.deal_value,
        notes=customer.notes,
        location=customer.location,
        industry=customer.industry,
        lastContactedAt=customer.last_contacted_at,
        createdAt=customer.created_at,
        updatedAt=customer.updated_at,
        timeline=build_timeline(customer),
        deals=build_deals(customer),
        noteEntries=build_notes(customer),
    )


def get_user_or_404(db: Session, user_id):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    return user


def get_customer_or_404(db: Session, customer_id):
    customer = (
        db.query(Customer)
        .options(selectinload(Customer.owner))
        .filter(Customer.id == customer_id)
        .first()
    )
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found.")
    return customer


def ensure_unique_user_email(db: Session, email: str, exclude_user_id=None):
    query = db.query(User).filter(User.email == normalize_email(email))
    if exclude_user_id:
        query = query.filter(User.id != exclude_user_id)
    if query.first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="A user with this email already exists.")


def ensure_unique_customer_email(db: Session, email: str, exclude_customer_id=None):
    query = db.query(Customer).filter(Customer.email == normalize_email(email))
    if exclude_customer_id:
        query = query.filter(Customer.id != exclude_customer_id)
    if query.first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A customer with this email already exists.",
        )


@router.post("/auth/login", response_model=AuthResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == normalize_email(request.email)).first()
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")
    if not user.active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account is disabled. Contact an administrator.",
        )
    return AuthResponse(token=create_access_token(user), user=serialize_user(user))


@router.post("/auth/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    if request.password != request.confirm_password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Passwords do not match.")

    ensure_unique_user_email(db, request.email)

    user = User(
        full_name=request.full_name.strip(),
        email=normalize_email(request.email),
        password_hash=hash_password(request.password),
        role=UserRole.USER.value,
        active=True,
        title="Sales Representative",
        theme_preference="light",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return AuthResponse(token=create_access_token(user), user=serialize_user(user))


@router.get("/auth/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return serialize_user(current_user)


@router.patch("/auth/profile", response_model=UserResponse)
def update_profile(
    request: UpdateProfileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    normalized_email = normalize_email(request.email)
    existing_user = db.query(User).filter(User.email == normalized_email, User.id != current_user.id).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This email is already in use by another account.",
        )

    current_user.full_name = request.full_name.strip()
    current_user.email = normalized_email
    current_user.phone = maybe_trim(request.phone)
    current_user.title = maybe_trim(request.title)
    current_user.theme_preference = maybe_trim(request.theme_preference) or "light"
    current_user.avatar_url = request.avatar_url
    current_user.updated_at = utc_now()
    db.commit()
    db.refresh(current_user)
    return serialize_user(current_user)


@router.post("/auth/change-password", response_model=ApiMessageResponse)
def change_password(
    request: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if request.new_password != request.confirm_new_password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Passwords do not match.")

    if not verify_password(request.current_password, current_user.password_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect.")

    current_user.password_hash = hash_password(request.new_password)
    current_user.updated_at = utc_now()
    db.commit()
    return ApiMessageResponse(message="Password updated successfully.")


@router.post("/auth/logout", response_model=ApiMessageResponse)
def logout():
    return ApiMessageResponse(message="Logged out successfully.")


@router.get("/customers", response_model=list[CustomerResponse])
def get_customers(
    search: str | None = None,
    status_filter: str | None = Query(default=None, alias="status"),
    stage_filter: str | None = Query(default=None, alias="stage"),
    sort: str | None = None,
    page: int = 0,
    size: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    del current_user

    query = db.query(Customer).options(selectinload(Customer.owner))

    if search and search.strip():
        pattern = f"%{search.strip().lower()}%"
        query = query.filter(
            or_(
                Customer.full_name.ilike(pattern),
                Customer.company.ilike(pattern),
                Customer.email.ilike(pattern),
            )
        )

    if status_filter and status_filter.strip():
        status_value = resolve_enum(CustomerStatus, status_filter, f"Unsupported customer status: {status_filter}")
        query = query.filter(Customer.status == status_value)

    if stage_filter and stage_filter.strip():
        stage_value = resolve_enum(CustomerStage, stage_filter, f"Unsupported customer stage: {stage_filter}")
        query = query.filter(Customer.stage == stage_value)

    sort_value = (sort or "newest").lower()
    if sort_value == "name":
        query = query.order_by(Customer.full_name.asc())
    elif sort_value in {"dealvalue", "deal_value"}:
        query = query.order_by(Customer.deal_value.desc())
    else:
        query = query.order_by(Customer.created_at.desc())

    page = max(page, 0)
    size = max(size, 1)
    customers = query.offset(page * size).limit(size).all()
    return [serialize_customer(customer) for customer in customers]


@router.get("/customers/{customer_id}", response_model=CustomerResponse)
def get_customer(customer_id: uuid.UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    del current_user
    return serialize_customer(get_customer_or_404(db, customer_id))


@router.post("/customers", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
def create_customer(
    request: CustomerRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ensure_unique_customer_email(db, request.email)

    customer = Customer(
        owner=current_user,
        full_name=request.full_name.strip(),
        email=normalize_email(request.email),
        phone=request.phone.strip(),
        company=request.company.strip(),
        job_title=maybe_trim(request.job_title),
        status=resolve_enum(CustomerStatus, request.status, f"Unsupported customer status: {request.status}"),
        stage=resolve_enum(CustomerStage, request.stage, f"Unsupported customer stage: {request.stage}"),
        deal_value=request.deal_value,
        notes=maybe_trim(request.notes),
        location=maybe_trim(request.location),
        industry=maybe_trim(request.industry),
        last_contacted_at=utc_now(),
    )
    db.add(customer)
    db.commit()
    db.refresh(customer)
    customer = get_customer_or_404(db, customer.id)
    return serialize_customer(customer)


@router.patch("/customers/{customer_id}", response_model=CustomerResponse)
def update_customer(
    customer_id: uuid.UUID,
    request: CustomerRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    del current_user
    customer = get_customer_or_404(db, customer_id)
    ensure_unique_customer_email(db, request.email, exclude_customer_id=customer_id)

    customer.full_name = request.full_name.strip()
    customer.email = normalize_email(request.email)
    customer.phone = request.phone.strip()
    customer.company = request.company.strip()
    customer.job_title = maybe_trim(request.job_title)
    customer.status = resolve_enum(CustomerStatus, request.status, f"Unsupported customer status: {request.status}")
    customer.stage = resolve_enum(CustomerStage, request.stage, f"Unsupported customer stage: {request.stage}")
    customer.deal_value = request.deal_value
    customer.notes = maybe_trim(request.notes)
    customer.location = maybe_trim(request.location)
    customer.industry = maybe_trim(request.industry)
    customer.last_contacted_at = utc_now()
    customer.updated_at = utc_now()
    db.commit()
    db.refresh(customer)
    customer = get_customer_or_404(db, customer.id)
    return serialize_customer(customer)


@router.delete("/customers/{customer_id}", response_model=ApiMessageResponse)
def delete_customer(
    customer_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    del current_user
    customer = get_customer_or_404(db, customer_id)
    db.delete(customer)
    db.commit()
    return ApiMessageResponse(message="Customer deleted successfully.")


@router.get("/dashboard/summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    del current_user
    customers = (
        db.query(Customer)
        .options(selectinload(Customer.owner))
        .order_by(Customer.updated_at.desc())
        .all()
    )

    total_customers = len(customers)
    active_deals = sum(1 for customer in customers if customer.stage in ACTIVE_STAGES)
    pipeline_value = sum((customer.deal_value for customer in customers), Decimal("0"))
    won_deals = sum(1 for customer in customers if customer.stage == CustomerStage.WON.value)
    conversion_rate = int(round((won_deals * 100.0) / total_customers)) if total_customers else 0

    current_month = utc_now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    revenue_buckets: OrderedDict[str, DashboardRevenuePointResponse] = OrderedDict()
    month_keys: list[tuple[int, int, str]] = []
    for index in range(5, -1, -1):
        month = current_month - timedelta(days=index * 30)
        label = month.strftime("%b")
        key = (month.year, month.month, label)
        month_keys.append(key)
        revenue_buckets[f"{month.year}-{month.month}"] = DashboardRevenuePointResponse(
            name=label,
            revenue=Decimal("0"),
            deals=0,
        )

    for customer in customers:
        anchor = customer.updated_at or customer.created_at
        bucket_key = f"{anchor.year}-{anchor.month}"
        if bucket_key not in revenue_buckets:
            continue
        current = revenue_buckets[bucket_key]
        additional_revenue = customer.deal_value if customer.stage == CustomerStage.WON.value else Decimal("0")
        revenue_buckets[bucket_key] = DashboardRevenuePointResponse(
            name=current.name,
            revenue=current.revenue + additional_revenue,
            deals=current.deals + 1,
        )

    activity = [
        DashboardActivityResponse(
            id=uuid.uuid5(uuid.NAMESPACE_URL, f"{customer.id}:activity"),
            type="Update",
            title="Customer pipeline reviewed",
            description=f"{customer.full_name} is currently in {customer.stage} stage.",
            customerId=customer.id,
            customerName=customer.full_name,
            date=customer.updated_at or customer.created_at,
        )
        for customer in customers[:6]
    ]

    task_candidates = [
        customer
        for customer in sorted(customers, key=lambda item: item.updated_at or item.created_at)
        if customer.stage not in {CustomerStage.WON.value, CustomerStage.LOST.value}
    ][:5]
    tasks = [
        DashboardTaskResponse(
            id=uuid.uuid5(uuid.NAMESPACE_URL, f"{customer.id}:task"),
            title=f"Follow up with {customer.full_name}",
            description=f"Move {customer.company} toward the next pipeline step.",
            owner=customer.owner.full_name if customer.owner else "Sales team",
            status="Pending",
            dueDate=(customer.last_contacted_at or utc_now()) + timedelta(days=3),
        )
        for customer in task_candidates
    ]

    return DashboardSummaryResponse(
        totalCustomers=total_customers,
        activeDeals=active_deals,
        pipelineValue=pipeline_value,
        conversionRate=conversion_rate,
        revenue=list(revenue_buckets.values()),
        activity=activity,
        tasks=tasks,
    )


@router.get("/users", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    del current_user
    users = db.query(User).order_by(User.created_at.desc()).all()
    return [serialize_user(user) for user in users]


@router.post("/users/invite", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def invite_user(
    request: InviteUserRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    del current_user
    ensure_unique_user_email(db, request.email)

    user = User(
        full_name=request.full_name.strip(),
        email=normalize_email(request.email),
        password_hash=hash_password(settings.invite_temporary_password),
        role=resolve_enum(UserRole, request.role, f"Unsupported role: {request.role}"),
        active=True,
        title=maybe_trim(request.title) or "Team Member",
        theme_preference="light",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return serialize_user(user)


@router.patch("/users/{user_id}", response_model=UserResponse)
def update_user(
    user_id: uuid.UUID,
    request: UpdateUserRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    del current_user
    user = get_user_or_404(db, user_id)

    if request.email:
        normalized_email = normalize_email(request.email)
        existing_user = db.query(User).filter(User.email == normalized_email, User.id != user_id).first()
        if existing_user:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="A user with this email already exists.")
        user.email = normalized_email

    if request.full_name:
        user.full_name = request.full_name.strip()

    if request.role:
        user.role = resolve_enum(UserRole, request.role, f"Unsupported role: {request.role}")

    if request.title is not None:
        user.title = maybe_trim(request.title)

    if request.phone is not None:
        user.phone = maybe_trim(request.phone)

    if request.is_active is not None:
        user.active = request.is_active

    user.updated_at = utc_now()
    db.commit()
    db.refresh(user)
    return serialize_user(user)
