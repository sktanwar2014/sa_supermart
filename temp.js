INSERT INTO `products`( `category_id`, `sub_category_id`, `product_name`, `main_unit_id`, `status`, `is_active`, `created_by`) 
(1,20,'',1,1,1,1);

INSERT INTO `products`( `category_id`, `sub_category_id`, `product_name`, `main_unit_id`, `status`, `is_active`, `created_by`) VALUES 
(2,38,'GRANNYSMITH APPLE',1,1,1,1);








INSERT INTO `products_measurement` (`product_id`, `unit_value`, `unit_id`, `price`, `is_packet`, `packet_weight`, `packet_unit_id`, `is_active`) VALUES 
('64', '1', '1', '0.00', '0', '0', '0', '1'),
('64', '100', '2', '0.00', '0', '0', '0', '1');




INSERT INTO `products_measurement` (`product_id`, `unit_value`, `unit_id`, `price`, `is_packet`, `packet_weight`, `packet_unit_id`, `is_active`) 
SELECT id, '1', '1', '0.00', '0', '0', '0', '1' FROM products WHERE sub_category_id = 37;
INSERT INTO `products_measurement` (`product_id`, `unit_value`, `unit_id`, `price`, `is_packet`, `packet_weight`, `packet_unit_id`, `is_active`) 
SELECT id, '100', '2', '0.00', '0', '0', '0', '1' FROM products WHERE sub_category_id = 37;

