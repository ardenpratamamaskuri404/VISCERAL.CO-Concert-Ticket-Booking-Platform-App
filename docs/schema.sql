-- ============================================================
-- INITIALIZE DATABASE
-- ============================================================
DROP DATABASE IF EXISTS visceral_co;
CREATE DATABASE visceral_co;
USE visceral_co;

-- ============================================================
-- 1. USERS
-- ============================================================
CREATE TABLE users (
  id            VARCHAR(36)  NOT NULL PRIMARY KEY,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password      VARCHAR(255) NOT NULL,
  full_name     VARCHAR(150) NOT NULL,
  phone_number   VARCHAR(20)  NULL,
  avatar_url     VARCHAR(500) NULL,
  phone_verified TINYINT(1)   NOT NULL DEFAULT 0,
  otp_code_hash  VARCHAR(255) NULL,
  otp_expires_at DATETIME(3)  NULL,
  role           ENUM('CUSTOMER', 'ADMIN', 'SUPERADMIN') NOT NULL DEFAULT 'CUSTOMER',
  created_at     DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB;

CREATE INDEX idx_users_email ON users(email);

-- ============================================================
-- 2. ARTISTS
-- ============================================================
CREATE TABLE artists (
  id          VARCHAR(36)  NOT NULL PRIMARY KEY,
  name        VARCHAR(150) NOT NULL,
  bio         TEXT         NULL,
  photo_url   VARCHAR(500) NULL,
  created_at  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB;

-- ============================================================
-- 3. EVENTS
-- ============================================================
CREATE TABLE events (
  id             VARCHAR(36)  NOT NULL PRIMARY KEY,
  title          VARCHAR(200) NOT NULL,
  description    TEXT         NOT NULL,
  venue_name     VARCHAR(200) NOT NULL,
  event_date     DATETIME(3)  NOT NULL,
  banner_url     VARCHAR(500) NULL,
  status         ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
  sales_closed   BOOLEAN      NOT NULL DEFAULT FALSE,
  is_seated      BOOLEAN      NOT NULL DEFAULT TRUE,
  created_by_id  VARCHAR(36)  NOT NULL,
  created_at     DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at     DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  CONSTRAINT fk_events_creator
    FOREIGN KEY (created_by_id) REFERENCES users(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_status ON events(status);

-- ============================================================
-- 4. EVENT_ARTISTS (relasi many-to-many)
-- ============================================================
CREATE TABLE event_artists (
  event_id     VARCHAR(36) NOT NULL,
  artist_id    VARCHAR(36) NOT NULL,
  is_headliner BOOLEAN     NOT NULL DEFAULT FALSE,

  PRIMARY KEY (event_id, artist_id),
  
  CONSTRAINT fk_event_artists_event
    FOREIGN KEY (event_id) REFERENCES events(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT fk_event_artists_artist
    FOREIGN KEY (artist_id) REFERENCES artists(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 5. TICKET_CATEGORIES (wajib soal — CRUD Kategori Tiket + kuota)
-- ============================================================
CREATE TABLE ticket_categories (
  id               VARCHAR(36)   NOT NULL PRIMARY KEY,
  event_id         VARCHAR(36)   NOT NULL,
  name             VARCHAR(100)  NOT NULL,
  price            DECIMAL(12,2) NOT NULL,
  total_seats      INT           NOT NULL,
  sales_start_date      DATETIME(3)   NULL,
  sales_end_date        DATETIME(3)   NULL,
  early_bird_price      DECIMAL(12,2) NULL,
  early_bird_start_date DATETIME(3)   NULL,
  early_bird_end_date   DATETIME(3)   NULL,
  created_at            DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  CONSTRAINT fk_ticket_categories_event
    FOREIGN KEY (event_id) REFERENCES events(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_ticket_categories_event ON ticket_categories(event_id);

-- ============================================================
-- 6. SEATS (representasi kuota per kategori; locking = fitur inovasi)
-- ============================================================
CREATE TABLE seats (
  id                VARCHAR(36)  NOT NULL PRIMARY KEY,
  category_id       VARCHAR(36)  NOT NULL,
  seat_number       VARCHAR(20)  NOT NULL,
  status            ENUM('AVAILABLE', 'LOCKED', 'SOLD') NOT NULL DEFAULT 'AVAILABLE',
  locked_until      DATETIME(3)  NULL,
  locked_by_user_id VARCHAR(36)  NULL,

  CONSTRAINT fk_seats_category
    FOREIGN KEY (category_id) REFERENCES ticket_categories(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT uq_seats_category_number UNIQUE (category_id, seat_number)
) ENGINE=InnoDB;

CREATE INDEX idx_seats_category ON seats(category_id);
CREATE INDEX idx_seats_status ON seats(status);

-- ============================================================
-- 7. ORDERS
-- ============================================================
CREATE TABLE orders (
  id                VARCHAR(36)   NOT NULL PRIMARY KEY,
  order_number      VARCHAR(50)   NOT NULL UNIQUE,
  customer_id       VARCHAR(36)   NOT NULL,
  total_amount      DECIMAL(12,2) NOT NULL,
  status            ENUM('PENDING', 'PAID', 'CANCELLED', 'EXPIRED') NOT NULL DEFAULT 'PENDING',
  payment_proof     VARCHAR(500)  NULL,
  payment_method    ENUM('MANUAL_TRANSFER', 'DOKU_VA', 'DOKU_QRIS', 'DOKU_EWALLET') NOT NULL DEFAULT 'MANUAL_TRANSFER',
  doku_reference_id VARCHAR(100)  NULL UNIQUE,
  payment_channel   VARCHAR(50)   NULL,
  expires_at        DATETIME(3)   NOT NULL,
  created_at        DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at        DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  CONSTRAINT fk_orders_customer
    FOREIGN KEY (customer_id) REFERENCES users(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);

-- ============================================================
-- 8. TICKETS
-- ============================================================
CREATE TABLE tickets (
  id                    VARCHAR(36)  NOT NULL PRIMARY KEY,
  order_id              VARCHAR(36)  NOT NULL,
  category_id           VARCHAR(36)  NOT NULL,
  seat_id               VARCHAR(36)  NULL UNIQUE,
  ticket_code           VARCHAR(50)  NOT NULL UNIQUE,
  status                ENUM('ACTIVE', 'CHECKED_IN', 'CANCELLED') NOT NULL DEFAULT 'ACTIVE',
  checked_in_at         DATETIME(3)  NULL,
  checked_in_by_admin   VARCHAR(36)  NULL,
  created_at            DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  CONSTRAINT fk_tickets_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT fk_tickets_category
    FOREIGN KEY (category_id) REFERENCES ticket_categories(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,

  CONSTRAINT fk_tickets_seat
    FOREIGN KEY (seat_id) REFERENCES seats(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,

  CONSTRAINT fk_tickets_admin_scanner
    FOREIGN KEY (checked_in_by_admin) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_tickets_order ON tickets(order_id);

-- ============================================================
-- 9. REFUNDS (fitur inovasi)
-- ============================================================
CREATE TABLE refunds (
  id            VARCHAR(36)  NOT NULL PRIMARY KEY,
  order_id      VARCHAR(36)  NOT NULL UNIQUE,
  reason        TEXT         NOT NULL,
  status        ENUM('REQUESTED', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'REQUESTED',
  processed_by  VARCHAR(36)  NULL,
  created_at    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  CONSTRAINT fk_refunds_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 10. AUDIT_LOGS (fitur inovasi)
-- ============================================================
CREATE TABLE audit_logs (
  id         VARCHAR(36)  NOT NULL PRIMARY KEY,
  user_id    VARCHAR(36)  NOT NULL,
  action     VARCHAR(100) NOT NULL,
  entity_id  VARCHAR(36)  NULL,
  metadata   JSON         NULL,
  created_at DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  CONSTRAINT fk_audit_logs_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);