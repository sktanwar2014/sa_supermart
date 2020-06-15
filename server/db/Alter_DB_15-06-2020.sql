
ALTER TABLE `purchase_register` ADD `is_extra` TINYINT NULL DEFAULT '0' AFTER `cost_of_each`;
ALTER TABLE `delivered_product` ADD `order_id` INT NULL DEFAULT NULL AFTER `id`;
UPDATE `delivered_product` dp INNER JOIN ordered_product as op ON op.id = dp.ordered_id SET dp.order_id = op.order_id
ALTER TABLE `verified_product` ADD `order_id` INT NULL DEFAULT NULL AFTER `id`;
ALTER TABLE `delivered_product` ADD `tracking_id` VARCHAR(20) NULL DEFAULT NULL AFTER `product_id`;
ALTER TABLE `delivered_product` ADD `status` INT NULL DEFAULT NULL AFTER `price`;

