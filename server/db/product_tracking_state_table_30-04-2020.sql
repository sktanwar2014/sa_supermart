-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 30, 2020 at 04:19 PM
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
-- Table structure for table `product_tracking_state`
--

CREATE TABLE `product_tracking_state` (
  `id` int(11) NOT NULL,
  `product_status` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `product_tracking_state`
--

INSERT INTO `product_tracking_state` (`id`, `product_status`, `is_active`, `created_at`) VALUES
(1, 'ORDERED', 1, '2020-04-18 12:48:46'),
(2, 'DELIVERED', 1, '2020-04-18 12:48:46'),
(3, 'NOT DELIVERED', 1, '2020-04-18 12:48:46'),
(4, 'VERIFIED BY CUSTOMER', 1, '2020-04-24 10:10:59'),
(5, 'ACCEPTED', 1, '2020-04-18 12:48:46'),
(6, 'REJECTED', 1, '2020-04-24 10:10:59');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `product_tracking_state`
--
ALTER TABLE `product_tracking_state`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `product_tracking_state`
--
ALTER TABLE `product_tracking_state`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
