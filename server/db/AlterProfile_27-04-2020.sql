ALTER TABLE `profile` ADD `address` VARCHAR(500) NULL DEFAULT NULL AFTER `gender`, ADD `city` VARCHAR(255) NULL DEFAULT NULL AFTER `address`, ADD `state` VARCHAR(255) NULL DEFAULT NULL AFTER `city`, ADD `country` VARCHAR(100) NULL DEFAULT NULL AFTER `state`, ADD `postcode` VARCHAR(20) NULL DEFAULT NULL AFTER `country`;


INSERT INTO `profile` (`id`, `user_id`, `type_id`, `first_name`, `last_name`, `email`, `mobile`, `dob`, `gender`, `address`, `city`, `state`, `country`, `postcode`, `status`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (NULL, '1', '1', 'Vegefoods', NULL, 'demo@demo.com', '0123456789', NULL, NULL, '123, abcdefgh, ijklmno', 'Auckland', '', NULL, '3125', '1', '1', '1', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

