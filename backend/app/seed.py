from __future__ import annotations

from datetime import timedelta
from decimal import Decimal
from uuid import UUID

from sqlalchemy.orm import Session

from .models import Customer, CustomerStage, CustomerStatus, User, UserRole, utc_now
from .security import hash_password


ADMIN_ID = UUID("36f7c225-5cf0-4f12-84ad-bd6c936f4f01")
USER_ID = UUID("8b348114-f0d8-4524-87dd-c64b5304a6c0")
SHOWCASE_USER_ID = UUID("d2a92b8c-0d0e-4f3a-a16a-923c19baf501")


def ensure_user(db: Session, **payload):
    existing = db.get(User, payload["id"])
    if existing:
        return existing

    user = User(**payload)
    db.add(user)
    db.flush()
    return user


def ensure_customer(db: Session, **payload):
    existing = db.get(Customer, payload["id"])
    if existing:
        return existing

    customer = Customer(**payload)
    db.add(customer)
    db.flush()
    return customer


def seed_demo_data(db: Session):
    now = utc_now()
    admin = ensure_user(
        db,
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
    sara = ensure_user(
        db,
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
    showcase = ensure_user(
        db,
        id=SHOWCASE_USER_ID,
        full_name="Ariana Vale",
        email="showcase@controllusion.com",
        password_hash=hash_password("Showcase@123"),
        role=UserRole.USER.value,
        active=True,
        title="Revenue Strategist",
        phone="+1 555 010 005",
        theme_preference="light",
        created_at=now - timedelta(days=12),
        updated_at=now - timedelta(days=1),
    )

    ensure_customer(
        db,
        id=UUID("57e1c8d4-52ef-4bf4-bd72-cf1f9d33a001"),
        owner=admin,
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
    )
    ensure_customer(
        db,
        id=UUID("57e1c8d4-52ef-4bf4-bd72-cf1f9d33a002"),
        owner=sara,
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
    )
    ensure_customer(
        db,
        id=UUID("57e1c8d4-52ef-4bf4-bd72-cf1f9d33a003"),
        owner=sara,
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
    )
    ensure_customer(
        db,
        id=UUID("57e1c8d4-52ef-4bf4-bd72-cf1f9d33a004"),
        owner=admin,
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
    )
    ensure_customer(
        db,
        id=UUID("57e1c8d4-52ef-4bf4-bd72-cf1f9d33a005"),
        owner=sara,
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
    )
    ensure_customer(
        db,
        id=UUID("57e1c8d4-52ef-4bf4-bd72-cf1f9d33a006"),
        owner=admin,
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
    )
    ensure_customer(
        db,
        id=UUID("57e1c8d4-52ef-4bf4-bd72-cf1f9d33a007"),
        owner=sara,
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
    )
    ensure_customer(
        db,
        id=UUID("57e1c8d4-52ef-4bf4-bd72-cf1f9d33a008"),
        owner=admin,
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
    )
    ensure_customer(
        db,
        id=UUID("a621bdd0-4d50-4f4a-a832-91bf98ba4701"),
        owner=showcase,
        full_name="Iris Bennett",
        email="iris@northstarcommerce.com",
        phone="+1 555 310 001",
        company="Northstar Commerce",
        job_title="VP Revenue",
        status=CustomerStatus.VIP.value,
        stage=CustomerStage.NEGOTIATION.value,
        deal_value=Decimal("84500"),
        notes="Final package review is scheduled with the CFO and operations lead.",
        location="Los Angeles, CA",
        industry="Retail",
        last_contacted_at=now - timedelta(days=1),
        created_at=now - timedelta(days=8),
        updated_at=now - timedelta(days=1),
    )
    ensure_customer(
        db,
        id=UUID("a621bdd0-4d50-4f4a-a832-91bf98ba4702"),
        owner=showcase,
        full_name="Leo Grant",
        email="leo@heliofreight.com",
        phone="+1 555 310 002",
        company="Helio Freight",
        job_title="Operations Director",
        status=CustomerStatus.ACTIVE.value,
        stage=CustomerStage.PROPOSAL.value,
        deal_value=Decimal("41200"),
        notes="Proposal sent with phased rollout and warehouse onboarding package.",
        location="Dallas, TX",
        industry="Logistics",
        last_contacted_at=now - timedelta(days=5),
        created_at=now - timedelta(days=14),
        updated_at=now - timedelta(days=5),
    )
    ensure_customer(
        db,
        id=UUID("a621bdd0-4d50-4f4a-a832-91bf98ba4703"),
        owner=showcase,
        full_name="Mina Torres",
        email="mina@pillarhealth.io",
        phone="+1 555 310 003",
        company="Pillar Health",
        job_title="Head of Partnerships",
        status=CustomerStatus.ACTIVE.value,
        stage=CustomerStage.QUALIFIED.value,
        deal_value=Decimal("26800"),
        notes="Qualified after pilot review. Waiting on procurement contact handoff.",
        location="Boston, MA",
        industry="Healthcare",
        last_contacted_at=now - timedelta(days=9),
        created_at=now - timedelta(days=18),
        updated_at=now - timedelta(days=9),
    )
    ensure_customer(
        db,
        id=UUID("a621bdd0-4d50-4f4a-a832-91bf98ba4704"),
        owner=showcase,
        full_name="Owen Clarke",
        email="owen@harborstack.com",
        phone="+1 555 310 004",
        company="HarborStack",
        job_title="COO",
        status=CustomerStatus.VIP.value,
        stage=CustomerStage.WON.value,
        deal_value=Decimal("97300"),
        notes="Annual contract signed with executive onboarding and analytics bundle.",
        location="Miami, FL",
        industry="SaaS",
        last_contacted_at=now - timedelta(days=16),
        created_at=now - timedelta(days=38),
        updated_at=now - timedelta(days=16),
    )
    ensure_customer(
        db,
        id=UUID("a621bdd0-4d50-4f4a-a832-91bf98ba4705"),
        owner=showcase,
        full_name="Nadia Rahim",
        email="nadia@auroralabs.ai",
        phone="+1 555 310 005",
        company="Aurora Labs",
        job_title="Chief of Staff",
        status=CustomerStatus.ACTIVE.value,
        stage=CustomerStage.WON.value,
        deal_value=Decimal("65400"),
        notes="Expansion deal closed after data room review and leadership alignment.",
        location="Seattle, WA",
        industry="AI",
        last_contacted_at=now - timedelta(days=43),
        created_at=now - timedelta(days=57),
        updated_at=now - timedelta(days=43),
    )
    ensure_customer(
        db,
        id=UUID("a621bdd0-4d50-4f4a-a832-91bf98ba4706"),
        owner=showcase,
        full_name="Theo Park",
        email="theo@summitgrid.com",
        phone="+1 555 310 006",
        company="Summit Grid",
        job_title="Solutions Lead",
        status=CustomerStatus.NEW.value,
        stage=CustomerStage.LEAD.value,
        deal_value=Decimal("18700"),
        notes="Fresh inbound lead from the enterprise solutions landing page.",
        location="Denver, CO",
        industry="Energy",
        last_contacted_at=now - timedelta(days=3),
        created_at=now - timedelta(days=6),
        updated_at=now - timedelta(days=3),
    )
    ensure_customer(
        db,
        id=UUID("a621bdd0-4d50-4f4a-a832-91bf98ba4707"),
        owner=showcase,
        full_name="Clara Wells",
        email="clara@bluecurrent.co",
        phone="+1 555 310 007",
        company="Blue Current",
        job_title="Finance Director",
        status=CustomerStatus.INACTIVE.value,
        stage=CustomerStage.LOST.value,
        deal_value=Decimal("12900"),
        notes="Opportunity paused after budget was reallocated to internal tooling.",
        location="Atlanta, GA",
        industry="Finance",
        last_contacted_at=now - timedelta(days=62),
        created_at=now - timedelta(days=73),
        updated_at=now - timedelta(days=62),
    )
    ensure_customer(
        db,
        id=UUID("a621bdd0-4d50-4f4a-a832-91bf98ba4708"),
        owner=showcase,
        full_name="Evan Brooks",
        email="evan@meridiancloud.com",
        phone="+1 555 310 008",
        company="Meridian Cloud",
        job_title="General Manager",
        status=CustomerStatus.ACTIVE.value,
        stage=CustomerStage.WON.value,
        deal_value=Decimal("52800"),
        notes="Signed multi-team rollout with reporting and forecasting add-ons.",
        location="Chicago, IL",
        industry="Cloud Infrastructure",
        last_contacted_at=now - timedelta(days=94),
        created_at=now - timedelta(days=109),
        updated_at=now - timedelta(days=94),
    )

    db.commit()
