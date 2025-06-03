-- Migration: Create API Metrics Table
-- Description: Creates a new table to store API metrics data for monitoring and analytics

CREATE TABLE IF NOT EXISTS `api_metrics` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `path` VARCHAR(255) NOT NULL,
  `method` VARCHAR(10) NOT NULL,
  `status_code` INT NOT NULL,
  `response_time` INT NOT NULL,
  `timestamp` DATETIME NOT NULL,
  `service` VARCHAR(50) NOT NULL,
  `user_id` INT NULL,
  `ip_address` VARCHAR(45) NULL,
  `user_agent` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_api_metrics_timestamp` (`timestamp`),
  INDEX `idx_api_metrics_path` (`path`),
  INDEX `idx_api_metrics_service` (`service`),
  INDEX `idx_api_metrics_status_code` (`status_code`),
  CONSTRAINT `fk_api_metrics_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add a comment to the table
ALTER TABLE `api_metrics` COMMENT = 'Stores API request metrics for monitoring and analytics';
