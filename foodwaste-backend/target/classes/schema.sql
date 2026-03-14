-- ============================================================
--  Food Waste Donation Platform — MySQL Schema
--  Run this manually if you prefer not to use ddl-auto=update
-- ============================================================

CREATE DATABASE IF NOT EXISTS foodwaste_db;
USE foodwaste_db;

-- Users table (donors, NGOs, volunteers, admins)
CREATE TABLE IF NOT EXISTS users (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    name                VARCHAR(100)         NOT NULL,
    email               VARCHAR(150)         NOT NULL UNIQUE,
    password            VARCHAR(255)         NOT NULL,
    phone               VARCHAR(15)          UNIQUE,
    address             VARCHAR(255),
    city                VARCHAR(100),
    role                ENUM('DONOR','NGO','VOLUNTEER','ADMIN') NOT NULL,
    org_name            VARCHAR(150),
    registration_number VARCHAR(100),
    is_active           BOOLEAN              DEFAULT TRUE,
    created_at          DATETIME             DEFAULT CURRENT_TIMESTAMP
);

-- Donations
CREATE TABLE IF NOT EXISTS donations (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    food_name        VARCHAR(150)         NOT NULL,
    description      TEXT,
    quantity         INT                  NOT NULL,
    quantity_unit    VARCHAR(30),
    food_type        ENUM('VEG','NON_VEG','VEGAN'),
    best_before      DATETIME,
    pickup_address   VARCHAR(255)         NOT NULL,
    city             VARCHAR(100),
    pickup_time      DATETIME,
    status           ENUM('AVAILABLE','CLAIMED','PICKED_UP','COMPLETED','EXPIRED')
                         NOT NULL DEFAULT 'AVAILABLE',
    donor_id         BIGINT               NOT NULL,
    claimed_by_ngo_id BIGINT,
    created_at       DATETIME             DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME             DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_donation_donor  FOREIGN KEY (donor_id)          REFERENCES users(id),
    CONSTRAINT fk_donation_ngo    FOREIGN KEY (claimed_by_ngo_id) REFERENCES users(id)
);

-- Pickup tasks
CREATE TABLE IF NOT EXISTS pickup_tasks (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    donation_id   BIGINT NOT NULL UNIQUE,
    ngo_id        BIGINT NOT NULL,
    volunteer_id  BIGINT,
    status        ENUM('PENDING','ASSIGNED','IN_PROGRESS','COMPLETED','CANCELLED')
                      NOT NULL DEFAULT 'PENDING',
    notes         TEXT,
    assigned_at   DATETIME,
    completed_at  DATETIME,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_task_donation  FOREIGN KEY (donation_id)  REFERENCES donations(id),
    CONSTRAINT fk_task_ngo       FOREIGN KEY (ngo_id)       REFERENCES users(id),
    CONSTRAINT fk_task_volunteer FOREIGN KEY (volunteer_id) REFERENCES users(id)
);
