-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 21, 2020 at 02:05 PM
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
-- Database: `a1abiliti_sa_supermart`
--

-- --------------------------------------------------------

--
-- Table structure for table `invoice`
--

CREATE TABLE `invoice` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `customer_type` tinyint(4) DEFAULT NULL COMMENT '1=franchise, 2=independent',
  `customer_id` int(11) DEFAULT NULL,
  `invoice_type` int(11) DEFAULT NULL COMMENT '1=system, 2= independent',
  `status` tinyint(4) DEFAULT '1',
  `is_active` tinyint(4) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `invoice_billing`
--

CREATE TABLE `invoice_billing` (
  `id` int(11) NOT NULL,
  `invoice_version_Id` int(11) DEFAULT NULL,
  `sub_total` double(10,2) DEFAULT '0.00',
  `total_subtraction` double(10,2) DEFAULT '0.00' COMMENT 'check invoice_sums',
  `total_addition` double(10,2) DEFAULT '0.00' COMMENT 'check invoice_sums',
  `total` double(10,2) DEFAULT '0.00',
  `status` tinyint(4) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `invoice_items`
--

CREATE TABLE `invoice_items` (
  `id` int(11) NOT NULL,
  `invoice_id` int(11) DEFAULT NULL,
  `invoice_version_id` int(11) DEFAULT NULL,
  `item_type_id` int(11) DEFAULT NULL COMMENT '1=exist, 2=new',
  `item_id` int(11) DEFAULT NULL,
  `unit_id` int(11) DEFAULT NULL,
  `item_name` varchar(255) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `unit_price` double(10,2) DEFAULT NULL,
  `quantity` double(10,2) DEFAULT NULL,
  `total_amt` double(10,2) DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `invoice_state`
--

CREATE TABLE `invoice_state` (
  `id` int(11) NOT NULL,
  `state_name` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `invoice_state`
--

INSERT INTO `invoice_state` (`id`, `state_name`, `is_active`, `created_at`) VALUES
(1, 'Active', 1, '2020-08-21 11:50:07'),
(2, 'Update Request', 1, '2020-08-21 11:50:07'),
(3, 'Request Accepted', 1, '2020-08-21 11:50:07'),
(4, 'Request Rejected', 1, '2020-08-21 11:50:07'),
(5, 'Invoice Updated', 1, '2020-08-21 11:50:07'),
(6, 'Archived', 1, '2020-08-21 11:50:07'),
(7, 'Paid', 1, '2020-08-21 11:50:07');

-- --------------------------------------------------------

--
-- Table structure for table `invoice_state_record`
--

CREATE TABLE `invoice_state_record` (
  `id` int(11) NOT NULL,
  `table_name` varchar(255) DEFAULT NULL,
  `invoice_id` int(11) DEFAULT NULL,
  `invoice_version_id` int(11) DEFAULT NULL,
  `table_id` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `is_active` tinyint(4) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `invoice_sums`
--

CREATE TABLE `invoice_sums` (
  `id` int(11) NOT NULL,
  `invoice_billing_id` int(11) DEFAULT NULL,
  `type` int(11) DEFAULT NULL COMMENT '1=benefits, 2=expenses',
  `type_id` int(11) DEFAULT NULL,
  `type_name` varchar(255) DEFAULT NULL,
  `type_rate` double DEFAULT NULL,
  `total` double DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `invoice_versions`
--

CREATE TABLE `invoice_versions` (
  `id` int(11) NOT NULL,
  `invoice_id` int(11) DEFAULT NULL,
  `invoice_no` varchar(20) DEFAULT NULL,
  `version_no` int(11) DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL,
  `is_active` tinyint(4) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `invoice`
--
ALTER TABLE `invoice`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `invoice_billing`
--
ALTER TABLE `invoice_billing`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `invoice_state`
--
ALTER TABLE `invoice_state`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `invoice_state_record`
--
ALTER TABLE `invoice_state_record`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `invoice_sums`
--
ALTER TABLE `invoice_sums`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `invoice_versions`
--
ALTER TABLE `invoice_versions`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `invoice`
--
ALTER TABLE `invoice`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoice_billing`
--
ALTER TABLE `invoice_billing`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoice_items`
--
ALTER TABLE `invoice_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoice_state`
--
ALTER TABLE `invoice_state`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `invoice_state_record`
--
ALTER TABLE `invoice_state_record`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoice_sums`
--
ALTER TABLE `invoice_sums`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoice_versions`
--
ALTER TABLE `invoice_versions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
