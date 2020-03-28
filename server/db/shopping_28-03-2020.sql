-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 28, 2020 at 06:15 AM
-- Server version: 10.1.38-MariaDB
-- PHP Version: 7.1.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `shopping`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `category_name` varchar(255) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `is_active` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `type`, `category_name`, `parent_id`, `status`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 1, 'Appliances', 0, 1, 1, 1, NULL, '2020-03-26 12:21:21', '2020-03-26 12:21:21'),
(2, 2, 'Fridge', 1, 1, 1, 1, NULL, '2020-03-26 12:21:21', '2020-03-26 12:21:21'),
(3, 3, 'Double Door', 2, 1, 1, 1, NULL, '2020-03-26 12:21:21', '2020-03-26 12:21:21'),
(4, 2, 'AC', 1, 1, 1, 1, NULL, '2020-03-26 12:21:21', '2020-03-26 12:21:21'),
(5, 3, 'MultiJet', 4, 1, 1, 1, NULL, '2020-03-26 12:21:21', '2020-03-26 12:21:21'),
(6, 3, 'Single Door', 2, 1, 1, 1, NULL, '2020-03-26 12:21:21', '2020-03-26 12:21:21'),
(7, 1, 'Home Devices', 0, 1, 1, 1, NULL, '2020-03-26 12:21:21', '2020-03-26 12:21:21'),
(8, 2, 'Kitchen ', 7, 1, 1, 1, NULL, '2020-03-26 12:21:21', '2020-03-26 12:21:21'),
(9, 3, 'Microwave', 8, 1, 1, 1, NULL, '2020-03-26 12:21:21', '2020-03-26 12:21:21'),
(10, 1, 'Home Decoration', 0, 1, 1, 1, NULL, '2020-03-26 12:21:21', '2020-03-26 12:21:21'),
(11, 2, 'Rooms', 10, 1, 1, 1, NULL, '2020-03-26 12:21:21', '2020-03-26 12:21:21'),
(12, 3, 'Curtain', 11, 1, 1, 1, NULL, '2020-03-26 12:21:21', '2020-03-26 12:21:21'),
(13, 2, 'TV', 1, 1, 1, 1, NULL, '2020-03-26 12:21:21', '2020-03-26 12:21:21'),
(14, 3, 'Samsung', 13, 1, 1, 1, NULL, '2020-03-26 12:21:21', '2020-03-26 12:21:21'),
(15, 1, 'Home Decoration ', 0, 1, 1, 1, NULL, '2020-03-26 12:21:21', '2020-03-26 12:21:21'),
(16, 2, 'Room', 15, 1, 1, 1, NULL, '2020-03-26 12:21:21', '2020-03-26 12:21:21'),
(17, 3, 'Curtain', 16, 1, 1, 1, NULL, '2020-03-26 12:21:21', '2020-03-26 12:21:21'),
(18, 1, 'Vehicle ', 0, 1, 1, 1, NULL, '2020-03-26 12:21:21', '2020-03-26 12:21:21'),
(19, 2, 'Car', 18, 1, 1, 1, NULL, '2020-03-26 12:21:21', '2020-03-26 12:21:21'),
(20, 3, 'XUV', 19, 1, 1, 1, NULL, '2020-03-26 12:21:21', '2020-03-26 12:21:21');

-- --------------------------------------------------------

--
-- Table structure for table `ordered_product`
--

CREATE TABLE `ordered_product` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `order_id` int(11) DEFAULT NULL,
  `tracking_id` varchar(20) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` double(10,2) DEFAULT NULL,
  `total` double(10,2) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) NOT NULL,
  `order_id` varchar(20) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `shipping_id` int(11) DEFAULT NULL,
  `payment_method_id` int(11) DEFAULT NULL,
  `order_date` datetime DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `order_billing`
--

CREATE TABLE `order_billing` (
  `id` bigint(20) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `items_total` double DEFAULT '0',
  `packing` double DEFAULT '0',
  `delivery` double DEFAULT '0',
  `tax` double DEFAULT '0',
  `promotion` double NOT NULL DEFAULT '0',
  `total` double NOT NULL DEFAULT '0',
  `status` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `main_category_id` int(11) DEFAULT NULL,
  `middle_category_id` int(11) DEFAULT NULL,
  `sub_category_id` int(11) DEFAULT NULL,
  `product_name` text,
  `brand_id` int(11) DEFAULT NULL,
  `color_id` int(11) DEFAULT NULL,
  `model_no` varchar(255) DEFAULT NULL,
  `seller_id` int(11) DEFAULT NULL,
  `image_id` int(11) DEFAULT NULL,
  `price` double(10,2) DEFAULT NULL,
  `unit_id` int(11) DEFAULT NULL,
  `description` text,
  `status` int(11) DEFAULT NULL,
  `is_active` tinyint(4) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `main_category_id`, `middle_category_id`, `sub_category_id`, `product_name`, `brand_id`, `color_id`, `model_no`, `seller_id`, `image_id`, `price`, `unit_id`, `description`, `status`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 3, 'afasdfasd', 6, 8, 'dsfa', 1, 0, 25.60, 1, 'dsdfasf', 1, 1, 1, NULL, '2020-03-27 11:11:31', '2020-03-27 11:11:31'),
(2, 1, 4, 5, 'dsfas', 5, 8, 'safsa', 1, 0, 45.25, 2, 'sdfsafas', 1, 1, 1, NULL, '2020-03-27 11:13:46', '2020-03-27 11:13:46'),
(3, 7, 8, 9, 'sfsafsaf', 5, 7, 'dsfsadf', 1, 0, 25.90, 2, 'jdsfkljl', 1, 1, 1, NULL, '2020-03-27 11:16:51', '2020-03-27 11:16:51'),
(4, 1, 4, 5, 'Samsung Double Air ', 6, 7, 'safsa', 1, 0, 2500.00, 9, 'abcdsfsdfsd ', 1, 1, 1, NULL, '2020-03-27 11:19:16', '2020-03-27 11:19:16'),
(5, 1, 13, 14, 'Samsung Smart TV', 6, 8, '1235ss', 1, 0, 3500.50, 9, 'akljldfjsljsdfljsd lfjdsf j', 1, 1, 1, NULL, '2020-03-27 11:27:40', '2020-03-27 11:27:40'),
(6, 18, 19, 20, 'XUV Ultra', 5, 8, '10101', 1, 0, 12500.00, 9, 'abcd', 1, 1, 1, NULL, '2020-03-27 14:08:51', '2020-03-27 14:08:51');

-- --------------------------------------------------------

--
-- Table structure for table `profile`
--

CREATE TABLE `profile` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `type_id` int(11) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `gender` tinyint(1) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `shipping_details`
--

CREATE TABLE `shipping_details` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `pincode` varchar(10) DEFAULT NULL,
  `flat_add` varchar(255) DEFAULT NULL,
  `street_add` varchar(500) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `landmark` varchar(255) DEFAULT NULL,
  `address_type` int(11) DEFAULT NULL COMMENT '1=home, 2=office, 3=other',
  `status` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `static_records_type`
--

CREATE TABLE `static_records_type` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `static_records_type`
--

INSERT INTO `static_records_type` (`id`, `name`, `created_by`, `created_at`) VALUES
(1, 'USER_ROLE', 1, '2020-03-25 12:56:44'),
(2, 'USER_TYPE', 1, '2020-03-25 12:56:44'),
(3, 'PRODUCT_MODEL', 1, '2020-03-25 12:56:44'),
(4, 'PRODUCT_UNIT', 1, '2020-03-25 12:56:44'),
(5, 'BRAND', 1, '2020-03-25 12:56:44'),
(6, 'COLOR', 1, '2020-03-25 12:56:44'),
(7, 'PAYMENT_MODE', 1, '2020-03-25 12:56:44');

-- --------------------------------------------------------

--
-- Table structure for table `static_records_value`
--

CREATE TABLE `static_records_value` (
  `id` int(11) NOT NULL,
  `records_type_id` int(11) DEFAULT NULL,
  `value` text,
  `status` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `static_records_value`
--

INSERT INTO `static_records_value` (`id`, `records_type_id`, `value`, `status`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 4, 'KG', 1, 1, 1, NULL, '2020-03-27 09:18:50', '2020-03-27 09:18:50'),
(2, 4, 'Box', 1, 1, 1, NULL, '2020-03-27 09:18:50', '2020-03-27 09:18:50'),
(3, 4, 'Grams', 1, 1, 1, NULL, '2020-03-27 09:18:50', '2020-03-27 09:18:50'),
(4, 4, 'LTR', 1, 1, 1, NULL, '2020-03-27 09:18:50', '2020-03-27 09:18:50'),
(5, 5, 'MICROSOFT', 1, 1, 1, NULL, '2020-03-27 09:18:50', '2020-03-27 09:18:50'),
(6, 5, 'SAMSUNG', 1, 1, 1, NULL, '2020-03-27 09:18:50', '2020-03-27 09:18:50'),
(7, 6, 'RED', 1, 1, 1, NULL, '2020-03-27 09:18:50', '2020-03-27 09:18:50'),
(8, 6, 'YELLOW', 1, 1, 1, NULL, '2020-03-27 09:18:50', '2020-03-27 09:18:50'),
(9, 4, 'Piece', 1, 1, 1, 0, '2020-03-27 12:12:14', '2020-03-27 12:12:14');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `user_id` varchar(50) DEFAULT NULL,
  `password` blob,
  `token` varchar(255) DEFAULT NULL,
  `account_id` varchar(50) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL,
  `is_active` tinyint(4) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `user_id`, `password`, `token`, `account_id`, `role_id`, `status`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 'Master Admin', 'admin', 0xab3b0c3e8e3777e153c1c6a373e232b3, 'HFKASHFOIUERA934578NJKDHSFOY84HSKJHFA8Y3', 'FJASFKJHA', 1, 1, 1, 0, 0, '2020-03-26 09:29:55', '2020-03-26 09:29:55'),
(2, 'SHAHRUKH', 'shahrukh', 0x41579e3d233189c2e2c3af45c10c96c5, 'HFKASHFOIUERA9ADDS8NJKDHSFOY84HSKJHFA8Y3', 'DASFJKLSD', 2, 1, 1, 1, 0, '2020-03-26 09:29:55', '2020-03-26 09:29:55');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ordered_product`
--
ALTER TABLE `ordered_product`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_billing`
--
ALTER TABLE `order_billing`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `profile`
--
ALTER TABLE `profile`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `shipping_details`
--
ALTER TABLE `shipping_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `static_records_type`
--
ALTER TABLE `static_records_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `static_records_value`
--
ALTER TABLE `static_records_value`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `ordered_product`
--
ALTER TABLE `ordered_product`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_billing`
--
ALTER TABLE `order_billing`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `profile`
--
ALTER TABLE `profile`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shipping_details`
--
ALTER TABLE `shipping_details`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `static_records_type`
--
ALTER TABLE `static_records_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `static_records_value`
--
ALTER TABLE `static_records_value`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
