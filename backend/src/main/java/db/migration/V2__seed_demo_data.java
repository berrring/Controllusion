package db.migration;

import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import org.flywaydb.core.api.migration.BaseJavaMigration;
import org.flywaydb.core.api.migration.Context;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class V2__seed_demo_data extends BaseJavaMigration {

    private static final UUID ADMIN_ID = UUID.fromString("36f7c225-5cf0-4f12-84ad-bd6c936f4f01");
    private static final UUID USER_ID = UUID.fromString("8b348114-f0d8-4524-87dd-c64b5304a6c0");

    @Override
    public void migrate(Context context) throws Exception {
        if (!hasRows(context, "users")) {
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            insertUser(
                    context,
                    ADMIN_ID,
                    "Admin One",
                    "admin@controllusion.com",
                    passwordEncoder.encode("Admin@123"),
                    "ADMIN",
                    true,
                    "CRM Administrator",
                    "+1 555 010 001",
                    "light",
                    Instant.now().minus(30, ChronoUnit.DAYS)
            );

            insertUser(
                    context,
                    USER_ID,
                    "Sara Kim",
                    "sara@controllusion.com",
                    passwordEncoder.encode("User@1234"),
                    "USER",
                    true,
                    "Account Executive",
                    "+1 555 010 002",
                    "light",
                    Instant.now().minus(21, ChronoUnit.DAYS)
            );
        }

        UUID adminOwnerId = findUserIdByEmail(context, "admin@controllusion.com");
        UUID userOwnerId = findUserIdByEmail(context, "sara@controllusion.com");

        if (!hasRows(context, "customers")) {
            insertCustomer(context, UUID.fromString("57e1c8d4-52ef-4bf4-bd72-cf1f9d33a001"), adminOwnerId,
                    "Ava Collins", "ava@northline.io", "+1 555 201 001", "Northline Studio", "Revenue Director",
                    "ACTIVE", "NEGOTIATION", new BigDecimal("24000"), "Requested a tailored reporting demo for the executive team.",
                    "Austin, TX", "Software", Instant.now().minus(2, ChronoUnit.DAYS), Instant.now().minus(18, ChronoUnit.DAYS));
            insertCustomer(context, UUID.fromString("57e1c8d4-52ef-4bf4-bd72-cf1f9d33a002"), userOwnerId,
                    "Jordan Blake", "jordan@silverpeak.co", "+1 555 201 002", "Silver Peak Co", "Operations Lead",
                    "NEW", "LEAD", new BigDecimal("9800"), "New inbound lead from the product landing page.",
                    "Denver, CO", "Manufacturing", Instant.now().minus(1, ChronoUnit.DAYS), Instant.now().minus(7, ChronoUnit.DAYS));
            insertCustomer(context, UUID.fromString("57e1c8d4-52ef-4bf4-bd72-cf1f9d33a003"), userOwnerId,
                    "Mina Patel", "mina@blueharbor.com", "+1 555 201 003", "Blue Harbor", "Customer Success Manager",
                    "VIP", "WON", new BigDecimal("61000"), "Signed annual expansion focused on analytics and forecasting.",
                    "Seattle, WA", "Fintech", Instant.now().minus(4, ChronoUnit.DAYS), Instant.now().minus(25, ChronoUnit.DAYS));
            insertCustomer(context, UUID.fromString("57e1c8d4-52ef-4bf4-bd72-cf1f9d33a004"), adminOwnerId,
                    "Carlos Vega", "carlos@orbitworks.ai", "+1 555 201 004", "Orbit Works", "Founder",
                    "ACTIVE", "PROPOSAL", new BigDecimal("17500"), "Waiting on procurement feedback after sending the proposal.",
                    "San Francisco, CA", "AI", Instant.now().minus(3, ChronoUnit.DAYS), Instant.now().minus(12, ChronoUnit.DAYS));
            insertCustomer(context, UUID.fromString("57e1c8d4-52ef-4bf4-bd72-cf1f9d33a005"), userOwnerId,
                    "Leah Summers", "leah@campfirelabs.dev", "+1 555 201 005", "Campfire Labs", "Growth Manager",
                    "ACTIVE", "QUALIFIED", new BigDecimal("13200"), "Interested in moving from spreadsheets to a shared CRM workflow.",
                    "Portland, OR", "SaaS", Instant.now().minus(5, ChronoUnit.DAYS), Instant.now().minus(10, ChronoUnit.DAYS));
            insertCustomer(context, UUID.fromString("57e1c8d4-52ef-4bf4-bd72-cf1f9d33a006"), adminOwnerId,
                    "Victor Chen", "victor@latticehub.com", "+1 555 201 006", "Lattice Hub", "Revenue Ops Analyst",
                    "INACTIVE", "LOST", new BigDecimal("8900"), "Budget was reassigned to another tool this quarter.",
                    "Chicago, IL", "Logistics", Instant.now().minus(15, ChronoUnit.DAYS), Instant.now().minus(40, ChronoUnit.DAYS));
            insertCustomer(context, UUID.fromString("57e1c8d4-52ef-4bf4-bd72-cf1f9d33a007"), userOwnerId,
                    "Noah Reed", "noah@atlasretail.com", "+1 555 201 007", "Atlas Retail", "Regional Director",
                    "ACTIVE", "NEGOTIATION", new BigDecimal("28500"), "Comparing rollout timeline and onboarding support package.",
                    "New York, NY", "Retail", Instant.now().minus(1, ChronoUnit.DAYS), Instant.now().minus(16, ChronoUnit.DAYS));
            insertCustomer(context, UUID.fromString("57e1c8d4-52ef-4bf4-bd72-cf1f9d33a008"), adminOwnerId,
                    "Emma Torres", "emma@ridgehealth.org", "+1 555 201 008", "Ridge Health", "Program Manager",
                    "ACTIVE", "QUALIFIED", new BigDecimal("15400"), "Needs a cleaner follow-up process for partnership outreach.",
                    "Phoenix, AZ", "Healthcare", Instant.now().minus(6, ChronoUnit.DAYS), Instant.now().minus(20, ChronoUnit.DAYS));
        }
    }

    private boolean hasRows(Context context, String tableName) throws Exception {
        try (PreparedStatement statement = context.getConnection().prepareStatement("select count(*) from " + tableName);
             var resultSet = statement.executeQuery()) {
            resultSet.next();
            return resultSet.getLong(1) > 0;
        }
    }

    private UUID findUserIdByEmail(Context context, String email) throws Exception {
        try (PreparedStatement statement = context.getConnection().prepareStatement("select id from users where lower(email) = lower(?) limit 1")) {
            statement.setString(1, email);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    return resultSet.getObject(1, UUID.class);
                }
            }
        }
        return null;
    }

    private void insertUser(
            Context context,
            UUID id,
            String fullName,
            String email,
            String passwordHash,
            String role,
            boolean active,
            String title,
            String phone,
            String themePreference,
            Instant createdAt
    ) throws Exception {
        try (PreparedStatement statement = context.getConnection().prepareStatement("""
                insert into users (id, full_name, email, password_hash, role, active, title, phone, theme_preference, created_at, updated_at)
                values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """)) {
            statement.setObject(1, id);
            statement.setString(2, fullName);
            statement.setString(3, email);
            statement.setString(4, passwordHash);
            statement.setString(5, role);
            statement.setBoolean(6, active);
            statement.setString(7, title);
            statement.setString(8, phone);
            statement.setString(9, themePreference);
            statement.setTimestamp(10, Timestamp.from(createdAt));
            statement.setTimestamp(11, Timestamp.from(createdAt.plus(1, ChronoUnit.DAYS)));
            statement.executeUpdate();
        }
    }

    private void insertCustomer(
            Context context,
            UUID id,
            UUID ownerId,
            String fullName,
            String email,
            String phone,
            String company,
            String jobTitle,
            String status,
            String stage,
            BigDecimal dealValue,
            String notes,
            String location,
            String industry,
            Instant lastContactedAt,
            Instant createdAt
    ) throws Exception {
        try (PreparedStatement statement = context.getConnection().prepareStatement("""
                insert into customers (
                    id, owner_id, full_name, email, phone, company, job_title, status, stage,
                    deal_value, notes, location, industry, last_contacted_at, created_at, updated_at
                )
                values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """)) {
            statement.setObject(1, id);
            statement.setObject(2, ownerId);
            statement.setString(3, fullName);
            statement.setString(4, email);
            statement.setString(5, phone);
            statement.setString(6, company);
            statement.setString(7, jobTitle);
            statement.setString(8, status);
            statement.setString(9, stage);
            statement.setBigDecimal(10, dealValue);
            statement.setString(11, notes);
            statement.setString(12, location);
            statement.setString(13, industry);
            statement.setTimestamp(14, Timestamp.from(lastContactedAt));
            statement.setTimestamp(15, Timestamp.from(createdAt));
            statement.setTimestamp(16, Timestamp.from(lastContactedAt));
            statement.executeUpdate();
        }
    }
}
