-- ===================================================================
-- ONLINE DONATION MANAGEMENT SYSTEM - DATABASE SCHEMA
-- Topic: Manage Charitable Donations and Fundraising Campaigns
-- Full Stack Development Mini Project (HTML, CSS, JS, Express, MySQL)
-- ===================================================================

CREATE DATABASE IF NOT EXISTS `donation_management`;
USE `donation_management`;

-- -------------------------------------------------------------------
-- 1. Table: users (Donors, Organizations, Admins)
-- -------------------------------------------------------------------
DROP TABLE IF EXISTS `donations`;
DROP TABLE IF EXISTS `campaigns`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `user_id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20),
  `role` ENUM('donor', 'organization', 'admin') NOT NULL DEFAULT 'donor',
  `organization_name` VARCHAR(150) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------------------
-- 2. Table: campaigns (Created by Organizations / Admins)
-- -------------------------------------------------------------------
CREATE TABLE `campaigns` (
  `campaign_id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(150) NOT NULL,
  `organization_name` VARCHAR(150) NOT NULL,
  `category` VARCHAR(60) NOT NULL DEFAULT 'General',
  `description` TEXT,
  `target_amount` DECIMAL(12,2) NOT NULL,
  `raised_amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `status` ENUM('Active', 'Completed', 'Paused') NOT NULL DEFAULT 'Active',
  `image_url` VARCHAR(255) DEFAULT NULL,
  `created_by` INT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_campaign_category` (`category`),
  INDEX `idx_campaign_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------------------
-- 3. Table: donations (Contributed by Donors)
-- -------------------------------------------------------------------
CREATE TABLE `donations` (
  `donation_id` INT AUTO_INCREMENT PRIMARY KEY,
  `campaign_id` INT NOT NULL,
  `donor_name` VARCHAR(100) NOT NULL,
  `donor_email` VARCHAR(150) NOT NULL,
  `donor_phone` VARCHAR(20) DEFAULT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `payment_method` VARCHAR(50) NOT NULL DEFAULT 'Credit Card',
  `payment_status` ENUM('Success', 'Pending', 'Failed') NOT NULL DEFAULT 'Success',
  `transaction_id` VARCHAR(100) NOT NULL UNIQUE,
  `message` TEXT,
  `donation_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` INT DEFAULT NULL,
  CONSTRAINT `fk_donation_campaign` FOREIGN KEY (`campaign_id`) 
    REFERENCES `campaigns` (`campaign_id`) ON DELETE CASCADE,
  INDEX `idx_donation_donor` (`donor_email`),
  INDEX `idx_donation_date` (`donation_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------------------
-- 4. Sample Seed Data
-- -------------------------------------------------------------------

-- Sample Users (passwords are bcrypt hashed for 'admin123', 'org123', 'donor123')
INSERT INTO `users` (`user_id`, `name`, `email`, `password`, `phone`, `role`, `organization_name`) VALUES
(1, 'Administrator', 'admin@charity.org', '$2a$12$e68o7f0E4g28/oX1M1E2U.95oU5n3n2iZJ9V1C0K.7nE5t4yO.Yk.', '9876543210', 'admin', 'Global Relief Council'),
(2, 'Hope Children Foundation', 'contact@hopechildren.org', '$2a$12$e68o7f0E4g28/oX1M1E2U.95oU5n3n2iZJ9V1C0K.7nE5t4yO.Yk.', '9876543211', 'organization', 'Hope Children Foundation'),
(3, 'Rakesh Sharma', 'rakesh@example.com', '$2a$12$e68o7f0E4g28/oX1M1E2U.95oU5n3n2iZJ9V1C0K.7nE5t4yO.Yk.', '9876543212', 'donor', NULL);

-- Sample Campaigns
INSERT INTO `campaigns` (`campaign_id`, `title`, `organization_name`, `category`, `description`, `target_amount`, `raised_amount`, `start_date`, `end_date`, `status`, `image_url`) VALUES
(1, 'Education for Every Child', 'Hope Children Foundation', 'Education', 'Providing tuition, textbooks, digital tablets, and school uniforms for 1,200 underprivileged rural children.', 50000.00, 36500.00, '2026-01-10', '2026-12-31', 'Active', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80'),
(2, 'Emergency Cardiac Surgery Fund', 'LifeCare Health Alliance', 'Healthcare', 'Sponsoring urgent pediatric heart surgeries and ICU rehabilitation for infants from low-income families.', 75000.00, 52400.00, '2026-02-01', '2026-11-30', 'Active', 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80'),
(3, 'Zero Hunger Food Drive', 'Community Care Network', 'Hunger Relief', 'Distributing nutritious warm meals, dry ration grocery kits, and clean milk to families displaced by urban poverty.', 25000.00, 21850.00, '2026-03-01', '2026-10-15', 'Active', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80'),
(4, 'Clean Drinking Water Wells', 'AquaLife International', 'Clean Water', 'Constructing solar-powered borewells and community filtration units in arid drought-affected villages.', 40000.00, 40000.00, '2026-01-15', '2026-09-01', 'Completed', 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fit=crop&w=800&q=80'),
(5, 'Disaster Emergency Flood Relief', 'Red Shield Disaster Aid', 'Disaster Relief', 'Immediate rescue boats, emergency shelter kits, medical sanitation packs, and potable water for cyclone survivors.', 60000.00, 34200.00, '2026-04-01', '2026-12-15', 'Active', 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80'),
(6, 'Protect Endangered Forest Wildlife', 'Earth First Wildlife Alliance', 'Environment', 'Anti-poaching patrols, veterinary forest rescue ambulances, and habitat reforestation initiatives.', 30000.00, 14200.00, '2026-05-01', '2026-11-20', 'Active', 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?auto=format&fit=crop&w=800&q=80');

-- Sample Donations
INSERT INTO `donations` (`donation_id`, `campaign_id`, `donor_name`, `donor_email`, `donor_phone`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `message`, `donation_date`, `user_id`) VALUES
(101, 1, 'Rakesh Sharma', 'rakesh@example.com', '9876543212', 1500.00, 'UPI', 'Success', 'TXN-2026-ED-101', 'Proud to support children education!', '2026-04-10 10:30:00', 3),
(102, 1, 'Priya Sundaram', 'priya.s@gmail.com', '9845123456', 2500.00, 'Credit Card', 'Success', 'TXN-2026-ED-102', 'Best wishes for the future stars.', '2026-04-12 14:15:00', NULL),
(103, 1, 'Amit Patel', 'amit.patel@outlook.com', '9822334455', 5000.00, 'Net Banking', 'Success', 'TXN-2026-ED-103', 'In memory of my grandfather.', '2026-04-15 16:45:00', NULL),
(104, 2, 'Dr. Sunita Rao', 'sunita.rao@apollo.org', '9988776655', 10000.00, 'Credit Card', 'Success', 'TXN-2026-MD-104', 'Every child deserves a healthy heartbeat.', '2026-04-16 09:20:00', NULL),
(105, 2, 'Karthik Raman', 'karthik.r@techcorp.com', '9811223344', 3500.00, 'Debit Card', 'Success', 'TXN-2026-MD-105', 'Speedy recovery to the little ones.', '2026-04-18 11:55:00', NULL),
(106, 3, 'Meera Nair', 'meera.nair@yahoo.com', '9876123450', 2000.00, 'UPI', 'Success', 'TXN-2026-HG-106', 'No one should sleep on an empty stomach.', '2026-04-20 18:10:00', NULL),
(107, 3, 'John Doe', 'john.doe@globalaid.org', '9833445566', 4500.00, 'Credit Card', 'Success', 'TXN-2026-HG-107', 'Keep up the remarkable community work!', '2026-04-22 13:05:00', NULL),
(108, 4, 'Ananya Desai', 'ananya.d@greenearth.in', '9822110099', 8000.00, 'Net Banking', 'Success', 'TXN-2026-WT-108', 'Clean water is a basic human right.', '2026-04-25 15:40:00', NULL),
(109, 5, 'Vikas Verma', 'vikas.verma@infra.com', '9899001122', 6500.00, 'UPI', 'Success', 'TXN-2026-FL-109', 'Stay strong through the flood recovery.', '2026-04-28 17:25:00', NULL),
(110, 6, 'Sneha Mukherjee', 'sneha.m@wildlife.org', '9844556677', 3000.00, 'Credit Card', 'Success', 'TXN-2026-WL-110', 'Protecting wildlife is protecting our future.', '2026-05-01 12:15:00', NULL);
