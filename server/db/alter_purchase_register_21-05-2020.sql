
ALTER TABLE `purchase_register` ADD `cost_of_each` DOUBLE NULL DEFAULT NULL AFTER `cost`;
ALTER TABLE `purchase_register` CHANGE `required_quantity` `required_quantity` DOUBLE NULL DEFAULT NULL;
