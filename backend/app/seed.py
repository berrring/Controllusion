from __future__ import annotations

from datetime import timedelta
from decimal import Decimal
from uuid import UUID

from sqlalchemy.orm import Session

from .models import Customer, CustomerStage, CustomerStatus, User, UserRole, utc_now
from .security import hash_password


ADMIN_ID = UUID("36f7c225-5cf0-4f12-84ad-bd6c936f4f01")
USER_ID = UUID("8b348114-f0d8-4524-87dd-c64b5304a6c0")


def seed_demo_data(db: Session):
    now = utc_now()

    if not db.query(User).count():
        admin = User(
            id=ADMIN_ID,
            full_name="Admin One",
            email="admin@controllusion.com",
            password_hash=hash_password("Admin@123"),
            role=UserRole.ADMIN.value,
            active=True,
            title="CRM Administrator",
            phone="+1 555 010 001",
            theme_preference="light",
            created_at=now - timedelta(days=30),
            updated_at=now - timedelta(days=29),
        )
        sara = User(
            id=USER_ID,
            full_name="Sara Kim",
            email="sara@controllusion.com",
            password_hash=hash_password("User@1234"),
            role=UserRole.USER.value,
            active=True,
            title="Account Executive",
            phone="+1 555 010 002",
            theme_preference="light",
            created_at=now - timedelta(days=21),
            updated_at=now - timedelta(days=20),
        )
        db.add_all([admin, sara])
        db.commit()

    if db.query(Customer).count():
        return

    admin_owner = db.get(User, ADMIN_ID)
    user_owner = db.get(User, USER_ID)

    customers = [
        Customer(
            id=UUID("57e1c8d4-52ef-4bf4-bd72-cf1f9d33a001"),
            owner=admin_owner,
            full_name="Ava Collins",
            email="ava@northline.io",
            phone="+1 555 201 001",
            company="Northline Studio",
            job_title="Revenue Director",
            status=CustomerStatus.ACTIVE.value,
            stage=CustomerStage.NEGOTIATION.value,
            deal_value=Decimal("24000"),
            notes="Requested a tailored reporting demo for the executive team.",
            location="Austin, TX",
            industry="Software",
            last_contacted_at=now - timedelta(days=2),
            created_at=now - timedelta(days=18),
            updated_at=now - timedelta(days=2),
        ),
        Customer(
            id=UUID("57e1c8d4-52ef-4bf4-bd72-cf1f9d33a002"),
            owner=user_owner,
            full_name="Jordan Blake",
            email="jordan@silverpeak.co",
            phone="+1 555 201 002",
            company="Silver Peak Co",
            job_title="Operations Lead",
            status=CustomerStatus.NEW.value,
            stage=CustomerStage.LEAD.value,
            deal_value=Decimal("9800"),
            notes="New inbound lead from the product landing page.",
            location="Denver, CO",
            industry="Manufacturing",
            last_contacted_at=now - timedelta(days=1),
            created_at=now - timedelta(days=7),
            updated_at=now - timedelta(days=1),
        ),
        Customer(
            id=UUID("57e1c8d4-52ef-4bf4-bd72-cf1f9d33a003"),
            owner=user_owner,
            full_name="Mina Patel",
            email="mina@blueharbor.com",
            phone="+1 555 201 003",
            company="Blue Harbor",
            job_title="Customer Success Manager",
            status=CustomerStatus.VIP.value,
            stage=CustomerStage.WON.value,
            deal_value=Decimal("61000"),
            notes="Signed annual expansion focused on analytics and forecasting.",
            location="Seattle, WA",
            industry="Fintech",
            last_contacted_at=now - timedelta(days=4),
            created_at=now - timedelta(days=25),
            updated_at=now - timedelta(days=4),
        ),
        Customer(
            id=UUID("57e1c8d4-52ef-4bf4-bd72-cf1f9d33a004"),
            owner=admin_owner,
            full_name="Carlos Vega",
            email="carlos@orbitworks.ai",
            phone="+1 555 201 004",
            company="Orbit Works",
            job_title="Founder",
            status=CustomerStatus.ACTIVE.value,
            stage=CustomerStage.PROPOSAL.value,
            deal_value=Decimal("17500"),
            notes="Waiting on procurement feedback after sending the proposal.",
            location="San Francisco, CA",
            industry="AI",
            last_contacted_at=now - timedelta(days=3),
            created_at=now - timedelta(days=12),
            updated_at=now - timedelta(days=3),
        ),
        Customer(
            id=UUID("57e1c8d4-52ef-4bf4-bd72-cf1f9d33a005"),
            owner=user_owner,
            full_name="Leah Summers",
            email="leah@campfirelabs.dev",
            phone="+1 555 201 005",
            company="Campfire Labs",
            job_title="Growth Manager",
            status=CustomerStatus.ACTIVE.value,
            stage=CustomerStage.QUALIFIED.value,
            deal_value=Decimal("13200"),
            notes="Interested in moving from spreadsheets to a shared CRM workflow.",
            location="Portland, OR",
            industry="SaaS",
            last_contacted_at=now - timedelta(days=5),
            created_at=now - timedelta(days=10),
            updated_at=now - timedelta(days=5),
        ),
        Customer(
            id=UUID("57e1c8d4-52ef-4bf4-bd72-cf1f9d33a006"),
            owner=admin_owner,
            full_name="Victor Chen",
            email="victor@latticehub.com",
            phone="+1 555 201 006",
            company="Lattice Hub",
            job_title="Revenue Ops Analyst",
            status=CustomerStatus.INACTIVE.value,
            stage=CustomerStage.LOST.value,
            deal_value=Decimal("8900"),
            notes="Budget was reassigned to another tool this quarter.",
            location="Chicago, IL",
            industry="Logistics",
            last_contacted_at=now - timedelta(days=15),
            created_at=now - timedelta(days=40),
            updated_at=now - timedelta(days=15),
        ),
        Customer(
            id=UUID("57e1c8d4-52ef-4bf4-bd72-cf1f9d33a007"),
            owner=user_owner,
            full_name="Noah Reed",
            email="noah@atlasretail.com",
            phone="+1 555 201 007",
            company="Atlas Retail",
            job_title="Regional Director",
            status=CustomerStatus.ACTIVE.value,
            stage=CustomerStage.NEGOTIATION.value,
            deal_value=Decimal("28500"),
            notes="Comparing rollout timeline and onboarding support package.",
            location="New York, NY",
            industry="Retail",
            last_contacted_at=now - timedelta(days=1),
            created_at=now - timedelta(days=16),
            updated_at=now - timedelta(days=1),
        ),
        Customer(
            id=UUID("57e1c8d4-52ef-4bf4-bd72-cf1f9d33a008"),
            owner=admin_owner,
            full_name="Emma Torres",
            email="emma@ridgehealth.org",
            phone="+1 555 201 008",
            company="Ridge Health",
            job_title="Program Manager",
            status=CustomerStatus.ACTIVE.value,
            stage=CustomerStage.QUALIFIED.value,
            deal_value=Decimal("15400"),
            notes="Needs a cleaner follow-up process for partnership outreach.",
            location="Phoenix, AZ",
            industry="Healthcare",
            last_contacted_at=now - timedelta(days=6),
            created_at=now - timedelta(days=20),
            updated_at=now - timedelta(days=6),
        ),
    ]

    db.add_all(customers)
    db.commit()
