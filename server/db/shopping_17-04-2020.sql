-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 17, 2020 at 09:01 AM
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
(1, 1, 'Vegetable', 0, 1, 1, 1, NULL, '2020-04-13 08:30:20', '2020-04-13 08:30:20'),
(2, 1, 'Fruits', 0, 1, 1, 1, NULL, '2020-04-13 08:34:47', '2020-04-13 08:34:47'),
(3, 2, 'Beanshoots', 1, 1, 1, 1, NULL, '2020-04-13 08:41:37', '2020-04-13 08:41:37'),
(4, 2, 'Beans', 1, 1, 1, 1, NULL, '2020-04-14 07:16:06', '2020-04-14 07:16:06'),
(5, 2, 'Broccoli', 1, 1, 1, 1, NULL, '2020-04-14 07:25:22', '2020-04-14 07:25:22'),
(6, 2, 'Brussell Sprouts', 1, 1, 1, 1, NULL, '2020-04-14 07:27:03', '2020-04-14 07:27:03'),
(7, 2, 'Beetroot', 1, 1, 1, 1, NULL, '2020-04-17 05:14:28', '2020-04-17 05:14:28'),
(8, 2, 'Cabbage', 1, 1, 1, 1, NULL, '2020-04-17 05:14:57', '2020-04-17 05:14:57'),
(9, 2, 'Cauliflower', 1, 1, 1, 1, NULL, '2020-04-17 06:02:46', '2020-04-17 06:02:46'),
(10, 2, 'Cucumbers', 1, 1, 1, 1, NULL, '2020-04-17 06:04:11', '2020-04-17 06:04:11'),
(11, 2, 'CAPSICUMS', 1, 1, 1, 1, NULL, '2020-04-17 06:25:28', '2020-04-17 06:25:28'),
(12, 2, 'CARROTS', 1, 1, 1, 1, NULL, '2020-04-17 06:25:28', '2020-04-17 06:25:28'),
(13, 2, 'CELERY', 1, 1, 1, 1, NULL, '2020-04-17 06:25:28', '2020-04-17 06:25:28'),
(14, 2, 'CHILLIES', 1, 1, 1, 1, NULL, '2020-04-17 06:25:28', '2020-04-17 06:25:28'),
(15, 2, 'EGGPLANT', 1, 1, 1, 1, NULL, '2020-04-17 06:25:28', '2020-04-17 06:25:28'),
(16, 2, 'GARLIC', 1, 1, 1, 1, NULL, '2020-04-17 06:25:28', '2020-04-17 06:25:28'),
(17, 2, 'GINGER', 1, 1, 1, 1, NULL, '2020-04-17 06:25:28', '2020-04-17 06:25:28'),
(18, 2, 'LEEKS', 1, 1, 1, 1, NULL, '2020-04-17 06:25:28', '2020-04-17 06:25:28'),
(19, 2, 'LETTUCE', 1, 1, 1, 1, NULL, '2020-04-17 06:25:28', '2020-04-17 06:25:28'),
(20, 2, 'RAINDOW FRESH P/P', 1, 1, 1, 1, NULL, '2020-04-17 06:25:28', '2020-04-17 06:25:28'),
(21, 2, 'SALAD EASY LINES P/P BAGS', 1, 1, 1, 1, NULL, '2020-04-17 06:25:28', '2020-04-17 06:25:28'),
(22, 2, 'LOOSE LEAF', 1, 1, 1, 1, NULL, '2020-04-17 06:25:28', '2020-04-17 06:25:28'),
(23, 2, 'MUSHROOMs', 1, 1, 1, 1, NULL, '2020-04-17 06:25:28', '2020-04-17 06:25:28'),
(24, 2, 'ONIONS', 1, 1, 1, 1, NULL, '2020-04-17 06:25:28', '2020-04-17 06:25:28'),
(25, 2, 'POTATOES', 1, 1, 1, 1, NULL, '2020-04-17 06:25:28', '2020-04-17 06:25:28'),
(26, 2, 'ORGANIC SALAD TUBS', 1, 1, 1, 1, NULL, '2020-04-17 06:25:28', '2020-04-17 06:25:28'),
(27, 2, 'LETTUCE HYDRO SLEEVED', 1, 1, 1, 1, NULL, '2020-04-17 06:25:28', '2020-04-17 06:25:28'),
(28, 2, 'ROOT VEGETABLES', 1, 1, 1, 1, NULL, '2020-04-17 06:25:28', '2020-04-17 06:25:28'),
(29, 2, 'RHUBARB', 1, 1, 1, 1, NULL, '2020-04-17 06:25:28', '2020-04-17 06:25:28'),
(30, 2, 'SNOW PEAS', 1, 1, 1, 1, NULL, '2020-04-17 06:25:28', '2020-04-17 06:25:28'),
(31, 2, 'SWEET POTATOES', 1, 1, 1, 1, NULL, '2020-04-17 06:25:28', '2020-04-17 06:25:28'),
(32, 2, 'SWEETCORN', 1, 1, 1, 1, NULL, '2020-04-17 06:25:28', '2020-04-17 06:25:28'),
(33, 2, 'SQUASH', 1, 1, 1, 1, NULL, '2020-04-17 06:25:28', '2020-04-17 06:25:28'),
(34, 2, 'TOMATOES', 1, 1, 1, 1, NULL, '2020-04-17 06:25:28', '2020-04-17 06:25:28'),
(35, 2, 'WITLOF', 1, 1, 1, 1, NULL, '2020-04-17 06:25:28', '2020-04-17 06:25:28'),
(36, 2, 'ZUCCHINI', 1, 1, 1, 1, NULL, '2020-04-17 06:25:28', '2020-04-17 06:25:28'),
(37, 2, 'PUMPKIN', 1, 1, 1, 1, NULL, '2020-04-17 06:25:28', '2020-04-17 06:25:28'),
(38, 2, 'APPLES FANCY', 2, 1, 1, 1, NULL, '2020-04-17 06:33:18', '2020-04-17 06:33:18'),
(39, 2, 'BAG APPLES', 2, 1, 1, 1, NULL, '2020-04-17 06:33:18', '2020-04-17 06:33:18'),
(40, 2, 'APPLES MCGRATH', 2, 1, 1, 1, NULL, '2020-04-17 06:33:18', '2020-04-17 06:33:18'),
(41, 2, 'AVOCADOES', 2, 1, 1, 1, NULL, '2020-04-17 06:33:18', '2020-04-17 06:33:18'),
(42, 2, 'FIGS', 2, 1, 1, 1, NULL, '2020-04-17 06:33:18', '2020-04-17 06:33:18'),
(43, 2, 'GRAPES AUSTRALIAN ', 2, 1, 1, 1, NULL, '2020-04-17 06:33:18', '2020-04-17 06:33:18'),
(44, 2, 'GRAPEFRUIT', 2, 1, 1, 1, NULL, '2020-04-17 06:33:18', '2020-04-17 06:33:18'),
(45, 2, 'POTTED HERBS ALIVE EACH', 2, 1, 1, 1, NULL, '2020-04-17 06:33:18', '2020-04-17 06:33:18'),
(46, 2, 'KIWIFRUIT', 2, 1, 1, 1, NULL, '2020-04-17 06:33:18', '2020-04-17 06:33:18'),
(47, 2, 'LIMES', 2, 1, 1, 1, NULL, '2020-04-17 06:33:18', '2020-04-17 06:33:18'),
(48, 2, 'LEMONS', 2, 1, 1, 1, NULL, '2020-04-17 06:33:18', '2020-04-17 06:33:18'),
(49, 2, 'MANGOES', 2, 1, 1, 1, NULL, '2020-04-17 06:33:18', '2020-04-17 06:33:18'),
(50, 2, 'MANDARINES ', 2, 1, 1, 1, NULL, '2020-04-17 06:33:18', '2020-04-17 06:33:18'),
(51, 2, 'NECTARINES', 2, 1, 1, 1, NULL, '2020-04-17 06:33:18', '2020-04-17 06:33:18'),
(52, 2, 'ORANGES', 2, 1, 1, 1, NULL, '2020-04-17 06:33:18', '2020-04-17 06:33:18'),
(53, 2, 'PASSIONFRUIT', 2, 1, 1, 1, NULL, '2020-04-17 06:33:18', '2020-04-17 06:33:18'),
(54, 2, 'PLUMS', 2, 1, 1, 1, NULL, '2020-04-17 06:33:18', '2020-04-17 06:33:18'),
(55, 2, 'PAW PAW', 2, 1, 1, 1, NULL, '2020-04-17 06:33:18', '2020-04-17 06:33:18'),
(56, 2, 'PEACHES', 2, 1, 1, 1, NULL, '2020-04-17 06:33:18', '2020-04-17 06:33:18'),
(57, 2, 'PINEAPPLES', 2, 1, 1, 1, NULL, '2020-04-17 06:33:18', '2020-04-17 06:33:18'),
(58, 2, 'PEARS', 2, 1, 1, 1, NULL, '2020-04-17 06:33:18', '2020-04-17 06:33:18'),
(59, 2, 'HONEYDEW MELON', 2, 1, 1, 1, NULL, '2020-04-17 06:33:18', '2020-04-17 06:33:18'),
(60, 2, 'WATERMELON SEEDLESS', 2, 1, 1, 1, NULL, '2020-04-17 06:33:18', '2020-04-17 06:33:18'),
(61, 2, 'CRUDO - SUPERFOOD RANGE', 2, 1, 1, 1, NULL, '2020-04-17 06:33:18', '2020-04-17 06:33:18'),
(62, 2, 'CRUDO - CUT FRUITS', 2, 1, 1, 1, NULL, '2020-04-17 06:33:18', '2020-04-17 06:33:18'),
(63, 2, 'CRUDO - HIGH PROTEIN (SALADS)', 2, 1, 1, 1, NULL, '2020-04-17 06:33:18', '2020-04-17 06:33:18'),
(64, 2, 'CRUDO - SNACKS TO GO', 2, 1, 1, 1, NULL, '2020-04-17 06:33:18', '2020-04-17 06:33:18'),
(65, 2, 'HERBS FARMERS CHOICE', 2, 1, 1, 1, NULL, '2020-04-17 06:33:18', '2020-04-17 06:33:18'),
(66, 2, 'HERBS MATJARRA', 2, 1, 1, 1, NULL, '2020-04-17 06:33:18', '2020-04-17 06:33:18'),
(67, 2, 'HI FRESH FRESH CUTS', 2, 1, 1, 1, NULL, '2020-04-17 06:33:18', '2020-04-17 06:33:18'),
(68, 2, 'MIGHTY FRESH PRODUCTS', 2, 1, 1, 1, NULL, '2020-04-17 06:33:18', '2020-04-17 06:33:18'),
(69, 2, 'BOWLS AND KITS', 2, 1, 1, 1, NULL, '2020-04-17 06:33:18', '2020-04-17 06:33:18'),
(70, 2, 'ASIAN LINES', 2, 1, 1, 1, NULL, '2020-04-17 06:33:18', '2020-04-17 06:33:18'),
(71, 1, 'Grocery', 0, 1, 1, 1, NULL, '2020-04-17 06:35:10', '2020-04-17 06:35:10'),
(72, 1, 'Packing', 0, 1, 1, 1, NULL, '2020-04-17 06:36:42', '2020-04-17 06:36:42'),
(73, 1, 'Store Equipment', 0, 1, 1, 1, NULL, '2020-04-17 06:37:24', '2020-04-17 06:37:24'),
(74, 1, 'Flowers', 0, 1, 1, 1, NULL, '2020-04-17 06:38:58', '2020-04-17 06:38:58'),
(75, 1, 'Drinks', 0, 1, 1, 1, NULL, '2020-04-17 06:39:03', '2020-04-17 06:39:03'),
(76, 2, 'CARRY BAGS', 72, 1, 1, 1, NULL, '2020-04-17 06:53:44', '2020-04-17 06:53:44'),
(77, 2, 'PRODUCE ROLLS', 72, 1, 1, 1, NULL, '2020-04-17 06:53:44', '2020-04-17 06:53:44'),
(78, 2, 'FILM', 72, 1, 1, 1, NULL, '2020-04-17 06:53:44', '2020-04-17 06:53:44'),
(79, 2, 'MUSHROOM BAGS', 72, 1, 1, 1, NULL, '2020-04-17 06:53:44', '2020-04-17 06:53:44'),
(80, 2, 'CHICKEN BAGS', 72, 1, 1, 1, NULL, '2020-04-17 06:53:44', '2020-04-17 06:53:44'),
(81, 2, 'BUTCHER', 72, 1, 1, 1, NULL, '2020-04-17 06:53:44', '2020-04-17 06:53:44'),
(82, 2, 'PACKAGING BAGS FRUIT VEG', 72, 1, 1, 1, NULL, '2020-04-17 06:53:44', '2020-04-17 06:53:44'),
(83, 2, 'TRAYS FRUIT VEG', 72, 1, 1, 1, NULL, '2020-04-17 06:53:44', '2020-04-17 06:53:44'),
(84, 2, 'TICKETS', 72, 1, 1, 1, NULL, '2020-04-17 06:53:44', '2020-04-17 06:53:44'),
(85, 2, 'KNIVES', 73, 1, 1, 1, NULL, '2020-04-17 06:53:44', '2020-04-17 06:53:44'),
(86, 2, 'GLOVES', 73, 1, 1, 1, NULL, '2020-04-17 06:53:44', '2020-04-17 06:53:44'),
(87, 2, 'CHECK-OUT', 73, 1, 1, 1, NULL, '2020-04-17 06:53:44', '2020-04-17 06:53:44'),
(88, 2, 'CHALK', 73, 1, 1, 1, NULL, '2020-04-17 06:53:44', '2020-04-17 06:53:44'),
(89, 2, 'STICKERS SMALL X 500', 73, 1, 1, 1, NULL, '2020-04-17 06:53:44', '2020-04-17 06:53:44'),
(90, 2, 'STICKERS LARGE X 500', 73, 1, 1, 1, NULL, '2020-04-17 06:53:44', '2020-04-17 06:53:44'),
(91, 2, 'S.A. SPRINGWATER', 75, 1, 1, 1, NULL, '2020-04-17 06:53:44', '2020-04-17 06:53:44'),
(92, 2, 'ANSTEY HILL SPRING WATER', 75, 1, 1, 1, NULL, '2020-04-17 06:53:44', '2020-04-17 06:53:44'),
(93, 2, 'SPARKLING WATER', 75, 1, 1, 1, NULL, '2020-04-17 06:53:44', '2020-04-17 06:53:44'),
(94, 2, 'CLEAR JUICES 1 LITRE', 75, 1, 1, 1, NULL, '2020-04-17 06:53:44', '2020-04-17 06:53:44'),
(95, 2, 'FULL BODY JUICES', 75, 1, 1, 1, NULL, '2020-04-17 06:53:44', '2020-04-17 06:53:44'),
(96, 2, 'SPARKLING JUICES', 75, 1, 1, 1, NULL, '2020-04-17 06:53:44', '2020-04-17 06:53:44'),
(97, 2, 'FLOWERS MON-WED-FRI', 74, 1, 1, 1, NULL, '2020-04-17 06:53:44', '2020-04-17 06:53:44'),
(98, 2, 'EGGS', 71, 1, 1, 1, NULL, '2020-04-17 06:53:44', '2020-04-17 06:53:44'),
(99, 2, 'CHOC DIPPING', 71, 1, 1, 1, NULL, '2020-04-17 06:53:44', '2020-04-17 06:53:44'),
(100, 2, 'CHARCOAL', 71, 1, 1, 1, NULL, '2020-04-17 06:53:44', '2020-04-17 06:53:44'),
(101, 2, 'CROUTONS', 71, 1, 1, 1, NULL, '2020-04-17 06:53:44', '2020-04-17 06:53:44'),
(102, 2, 'MEDJOOL DATES', 71, 1, 1, 1, NULL, '2020-04-17 06:53:44', '2020-04-17 06:53:44'),
(103, 2, 'NEWMANS HORSE RADISH', 71, 1, 1, 1, NULL, '2020-04-17 06:53:44', '2020-04-17 06:53:44');

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
  `unit_id` int(11) DEFAULT NULL,
  `total` double(10,2) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ordered_product`
--

INSERT INTO `ordered_product` (`id`, `user_id`, `order_id`, `tracking_id`, `product_id`, `quantity`, `unit_id`, `total`, `status`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 2, 1, '129028877', 9, 5.00, 1, NULL, 1, 1, 2, NULL, '2020-04-16 08:20:01', '2020-04-16 08:20:01'),
(2, 2, 1, '258466879', 6, 200.00, 2, NULL, 1, 1, 2, NULL, '2020-04-16 08:20:01', '2020-04-16 08:20:01'),
(3, 5, 2, '411503727', 6, 1.00, 1, NULL, 1, 1, 5, NULL, '2020-04-16 08:29:28', '2020-04-16 08:29:28'),
(4, 5, 2, '535665837', 7, 100.00, 2, NULL, 1, 1, 5, NULL, '2020-04-16 08:29:28', '2020-04-16 08:29:28'),
(5, 5, 2, '362091510', 9, 1.00, 1, NULL, 1, 1, 5, NULL, '2020-04-16 08:29:28', '2020-04-16 08:29:28'),
(8, 2, 3, '834493441', 9, 3.00, 7, NULL, 1, 1, 2, NULL, '2020-04-16 10:51:11', '2020-04-16 10:51:11'),
(9, 2, 3, '273041822', 6, 3.00, 7, NULL, 1, 1, 2, NULL, '2020-04-16 10:51:11', '2020-04-16 10:51:11'),
(10, 2, 4, '33286663', 9, 300.00, 2, NULL, 1, 1, 2, NULL, '2020-04-16 11:30:37', '2020-04-16 11:30:37'),
(11, 2, 4, '144706338', 7, 500.00, 2, NULL, 1, 1, 2, NULL, '2020-04-16 11:30:38', '2020-04-16 11:30:38'),
(12, 2, 5, '795304461', 7, 500.00, 2, NULL, 2, 1, 2, NULL, '2020-04-17 05:30:12', '2020-04-17 05:30:12'),
(13, 2, 5, '272896383', 9, 5.00, 7, NULL, 2, 1, 2, NULL, '2020-04-17 05:30:12', '2020-04-17 05:30:12');

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

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_id`, `user_id`, `shipping_id`, `payment_method_id`, `order_date`, `status`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, '190749771', 2, 2, NULL, '2020-04-16 13:50:01', 1, 1, 2, NULL, '2020-04-16 08:20:01', '2020-04-16 08:20:01'),
(2, '347173004', 5, 10, NULL, '2020-04-16 13:59:28', 1, 1, 5, NULL, '2020-04-16 08:29:28', '2020-04-16 08:29:28'),
(3, '374346921', 2, 2, NULL, '2020-04-16 16:21:11', 1, 1, 2, NULL, '2020-04-16 10:51:11', '2020-04-16 10:51:11'),
(4, '576918221', 2, 4, NULL, '2020-04-16 17:00:37', 1, 1, 2, NULL, '2020-04-16 11:30:37', '2020-04-16 11:30:37'),
(5, '288567160', 2, 4, NULL, '2020-04-17 11:00:12', 2, 1, 2, NULL, '2020-04-17 05:30:12', '2020-04-17 05:30:12');

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
  `category_id` int(11) DEFAULT NULL,
  `sub_category_id` int(11) DEFAULT NULL,
  `product_name` text,
  `main_unit_id` int(11) DEFAULT NULL,
  `image_id` int(11) DEFAULT NULL,
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

INSERT INTO `products` (`id`, `category_id`, `sub_category_id`, `product_name`, `main_unit_id`, `image_id`, `description`, `status`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 1, 3, 'Loose Beanshoots', 1, 0, '', 1, 1, 1, NULL, '2020-04-16 06:23:51', '2020-04-16 06:23:51'),
(2, 1, 4, 'Machine Cut Beans', 1, 0, '', 1, 1, 1, NULL, '2020-04-16 06:33:40', '2020-04-16 06:33:40'),
(3, 1, 3, 'Snowpea Sprts', 1, 0, '', 1, 1, 1, NULL, '2020-04-16 06:34:38', '2020-04-16 06:34:38'),
(4, 1, 4, 'P/P Beans', 1, 0, '', 1, 1, 1, NULL, '2020-04-16 06:35:22', '2020-04-16 06:35:22'),
(5, 1, 4, 'Flat Beans', 1, 0, '', 1, 1, 1, NULL, '2020-04-16 06:35:49', '2020-04-16 06:35:49'),
(6, 1, 5, 'Broccolini', 1, 0, '', 1, 1, 1, NULL, '2020-04-16 06:36:37', '2020-04-16 06:36:37'),
(7, 1, 6, 'Brussel', 1, 0, '', 1, 1, 1, NULL, '2020-04-16 06:37:40', '2020-04-16 06:37:40'),
(8, 1, 6, 'Brussel Spouts', 1, 0, '', 1, 1, 1, NULL, '2020-04-16 06:38:36', '2020-04-16 06:38:36'),
(9, 1, 6, 'Beets', 1, 0, '', 1, 1, 1, NULL, '2020-04-16 06:39:01', '2020-04-16 06:39:01'),
(10, 1, 8, 'White Cabbage', 1, 0, '', 1, 1, 1, NULL, '2020-04-17 05:15:27', '2020-04-17 05:15:27'),
(11, 1, 8, 'Red Cabbage', 1, 0, '', 1, 1, 1, NULL, '2020-04-17 05:16:12', '2020-04-17 05:16:12'),
(12, 1, 8, 'Savoy/Chinese', 1, 0, '', 1, 1, 1, NULL, '2020-04-17 05:16:55', '2020-04-17 05:16:55'),
(13, 1, 9, 'Cauliflower', 1, 0, '', 1, 1, 1, NULL, '2020-04-17 06:03:13', '2020-04-17 06:03:13'),
(14, 1, 10, 'Cont  Cucumbers', 1, 0, '', 1, 1, 1, NULL, '2020-04-17 06:05:25', '2020-04-17 06:05:25'),
(15, 1, 10, 'LEBs Cucumbers', 1, 0, '', 1, 1, 1, NULL, '2020-04-17 06:06:02', '2020-04-17 06:06:02'),
(16, 1, 10, 'Baby Lab Cucumbers', 1, 0, '', 1, 1, 1, NULL, '2020-04-17 06:09:53', '2020-04-17 06:09:53'),
(17, 1, 10, 'Baby Cucumbers', 1, 0, '', 1, 1, 1, NULL, '2020-04-17 06:10:58', '2020-04-17 06:10:58');

-- --------------------------------------------------------

--
-- Table structure for table `products_measurement`
--

CREATE TABLE `products_measurement` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `unit_value` double DEFAULT NULL,
  `unit_id` int(11) DEFAULT NULL,
  `price` double(10,2) DEFAULT '0.00',
  `is_packet` tinyint(4) DEFAULT NULL,
  `packet_weight` double DEFAULT NULL,
  `packet_unit_id` int(11) DEFAULT NULL,
  `is_active` tinyint(4) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `products_measurement`
--

INSERT INTO `products_measurement` (`id`, `product_id`, `unit_value`, `unit_id`, `price`, `is_packet`, `packet_weight`, `packet_unit_id`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 0.00, 0, 0, 0, 1, '2020-04-16 06:23:51', '2020-04-16 06:23:51'),
(2, 2, 1, 1, 0.00, 0, 0, 0, 1, '2020-04-16 06:33:40', '2020-04-16 06:33:40'),
(3, 3, 1, 1, 0.00, 0, 0, 0, 1, '2020-04-16 06:34:38', '2020-04-16 06:34:38'),
(4, 4, 1, 1, 0.00, 0, 0, 0, 1, '2020-04-16 06:35:22', '2020-04-16 06:35:22'),
(5, 5, 1, 1, 0.00, 0, 0, 0, 1, '2020-04-16 06:35:49', '2020-04-16 06:35:49'),
(6, 6, 1, 1, 0.00, 0, 0, 0, 1, '2020-04-16 06:36:37', '2020-04-16 06:36:37'),
(7, 7, 1, 1, 0.00, 0, 0, 0, 1, '2020-04-16 06:37:40', '2020-04-16 06:37:40'),
(8, 8, 1, 1, 0.00, 0, 0, 0, 1, '2020-04-16 06:38:36', '2020-04-16 06:38:36'),
(9, 8, 100, 2, 0.00, 0, 0, 0, 1, '2020-04-16 06:38:37', '2020-04-16 06:38:37'),
(10, 9, 1, 1, 0.00, 0, 0, 0, 1, '2020-04-16 06:39:01', '2020-04-16 06:39:01'),
(11, 1, 100, 2, 0.00, 0, 0, 0, 1, '2020-04-16 06:23:51', '2020-04-16 06:23:51'),
(12, 2, 100, 2, 0.00, 0, 0, 0, 1, '2020-04-16 06:33:40', '2020-04-16 06:33:40'),
(13, 3, 100, 2, 0.00, 0, 0, 0, 1, '2020-04-16 06:34:38', '2020-04-16 06:34:38'),
(14, 4, 100, 2, 0.00, 0, 0, 0, 1, '2020-04-16 06:35:22', '2020-04-16 06:35:22'),
(15, 5, 100, 2, 0.00, 0, 0, 0, 1, '2020-04-16 06:35:49', '2020-04-16 06:35:49'),
(16, 6, 100, 2, 0.00, 0, 0, 0, 1, '2020-04-16 06:36:37', '2020-04-16 06:36:37'),
(17, 7, 100, 2, 0.00, 0, 0, 0, 1, '2020-04-16 06:37:40', '2020-04-16 06:37:40'),
(18, 9, 100, 2, 0.00, 0, 0, 0, 1, '2020-04-16 06:39:01', '2020-04-16 06:39:01'),
(20, 6, 1, 7, 0.00, 1, 5, 1, 1, '2020-04-16 06:36:37', '2020-04-16 06:36:37'),
(21, 9, 1, 7, 0.00, 1, 500, 2, 1, '2020-04-16 06:39:01', '2020-04-16 06:39:01'),
(22, 10, 1, 1, 0.00, 0, 0, 0, 1, '2020-04-17 05:15:28', '2020-04-17 05:15:28'),
(23, 10, 100, 2, 0.00, 0, 0, 0, 1, '2020-04-17 05:15:28', '2020-04-17 05:15:28'),
(24, 11, 1, 1, 0.00, 0, 0, 0, 1, '2020-04-17 05:16:12', '2020-04-17 05:16:12'),
(25, 11, 100, 2, 0.00, 0, 0, 0, 1, '2020-04-17 05:16:12', '2020-04-17 05:16:12'),
(26, 12, 1, 1, 0.00, 0, 0, 0, 1, '2020-04-17 05:16:55', '2020-04-17 05:16:55'),
(27, 12, 100, 2, 0.00, 0, 0, 0, 1, '2020-04-17 05:16:55', '2020-04-17 05:16:55'),
(28, 13, 1, 1, 0.00, 0, 0, 0, 1, '2020-04-17 06:03:13', '2020-04-17 06:03:13'),
(29, 13, 100, 2, 0.00, 0, 0, 0, 1, '2020-04-17 06:03:14', '2020-04-17 06:03:14'),
(30, 13, 1, 7, 0.00, 1, 1, 1, 1, '2020-04-17 06:03:14', '2020-04-17 06:03:14'),
(31, 14, 1, 1, 0.00, 0, 0, 0, 1, '2020-04-17 06:05:25', '2020-04-17 06:05:25'),
(32, 14, 100, 2, 0.00, 0, 0, 0, 1, '2020-04-17 06:05:26', '2020-04-17 06:05:26'),
(33, 14, 1, 7, 0.00, 1, 1, 1, 1, '2020-04-17 06:05:26', '2020-04-17 06:05:26'),
(34, 15, 1, 1, 0.00, 0, 0, 0, 1, '2020-04-17 06:06:02', '2020-04-17 06:06:02'),
(35, 15, 100, 2, 0.00, 0, 0, 0, 1, '2020-04-17 06:06:02', '2020-04-17 06:06:02'),
(36, 15, 1, 7, 0.00, 1, 1, 1, 1, '2020-04-17 06:06:03', '2020-04-17 06:06:03'),
(37, 16, 1, 1, 0.00, 0, 0, 0, 1, '2020-04-17 06:09:53', '2020-04-17 06:09:53'),
(38, 16, 100, 2, 0.00, 0, 0, 0, 1, '2020-04-17 06:09:53', '2020-04-17 06:09:53'),
(39, 17, 1, 1, 0.00, 0, 0, 0, 1, '2020-04-17 06:10:59', '2020-04-17 06:10:59'),
(40, 17, 100, 2, 0.00, 0, 0, 0, 1, '2020-04-17 06:10:59', '2020-04-17 06:10:59');

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
  `email` varchar(100) DEFAULT NULL,
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

--
-- Dumping data for table `shipping_details`
--

INSERT INTO `shipping_details` (`id`, `user_id`, `full_name`, `mobile`, `email`, `pincode`, `flat_add`, `street_add`, `city`, `state`, `landmark`, `address_type`, `status`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 2, 'shahrukh khan', '8290447404', 'sktanwar.2014@gmail.com', '342001', 'nagori gate', 'kaga road', 'jodhpur', 'rajasthan', NULL, NULL, 1, 0, 2, NULL, '2020-03-31 11:03:34', '2020-03-31 11:03:34'),
(2, 2, 'Shahrukh Khan', '08290447404', 'sktanwar.2014@gmail.com', '342006', 'abbb', 'Kaga road outside nagori gate, jodhpur', 'Jodhpur', 'Rajasthan', NULL, NULL, 1, 1, 2, 2, '2020-03-31 11:04:28', '2020-03-31 11:04:28'),
(3, 5, 'Aditi datt', '70905558541', 'aditi@gmail.com', '350000', 'guru villa', '123, amrit nagar ', 'amritsar', 'Punjab', NULL, NULL, 1, 1, 5, 5, '2020-03-31 11:07:23', '2020-03-31 11:07:23'),
(4, 2, 'sohil khan', '2809055666', 'ssohil@gaamil.com', '340001', 'Anand Vihar', 'p.no. H144', 'Jodhpur', 'rajathan', NULL, NULL, 1, 1, 2, 2, '2020-03-31 11:10:58', '2020-03-31 11:10:58'),
(5, 2, 'Vijay Dalwani', '8451248512', 'vijay@gm.om', '340110', 'Rupa  nagar', '123', 'mumbai', 'Maharastra', NULL, NULL, 1, 0, 2, 2, '2020-03-31 11:48:49', '2020-03-31 11:48:49'),
(6, 2, 'Vijay Lalwani 2', '9000500100', 'vijay@gmail.com', '3401100', 'Rupa  nagar 2', '010, Rupa  nagar 2', 'Delhi', 'UP', NULL, NULL, 1, 0, 2, 2, '2020-04-08 12:04:53', '2020-04-08 12:04:53'),
(7, 2, 'Imran Khan', '80909002230', 'imran@gmail.com', '342001', 'bagar chowk', 'bta sagar', 'jodhpur', 'Rajasthan, India', NULL, NULL, 1, 0, 2, 2, '2020-04-08 12:41:04', '2020-04-08 12:41:04'),
(8, 2, 'Kamlesh Gehlot', '8009909090', 'kamleshgehlot@gmail.com', '342001', 'Pal Road', '1234', 'Jodhpur', 'India', NULL, NULL, 1, 1, 2, 2, '2020-04-08 13:08:32', '2020-04-08 13:08:32'),
(9, 2, 'Vijay Lalwani 2', '9000500100', 'vijay@gmail.com', '3401100', 'Rupa  nagar 2', '010, Rupa  nagar 2', 'Delhi', 'UP', NULL, NULL, 1, 1, 2, NULL, '2020-04-15 08:08:40', '2020-04-15 08:08:40'),
(10, 5, 'Aditi Datt', '25874551515', 'aditi@gmail.com', '342001', '1st polo, paota', '103', 'jodhpur', 'Rajasthan', NULL, NULL, 1, 1, 5, 5, '2020-04-15 12:45:19', '2020-04-15 12:45:19');

-- --------------------------------------------------------

--
-- Table structure for table `unit_records`
--

CREATE TABLE `unit_records` (
  `id` int(11) NOT NULL,
  `unit_name` varchar(100) DEFAULT NULL,
  `default_weight` double DEFAULT NULL,
  `is_bundle` tinyint(1) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `equal_value_of_parent` double DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `unit_records`
--

INSERT INTO `unit_records` (`id`, `unit_name`, `default_weight`, `is_bundle`, `parent_id`, `equal_value_of_parent`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'KG', 1, 0, 8, 100, 1, '2020-04-16 04:40:22', '2020-04-16 04:40:22'),
(2, 'Grams', 100, 0, 1, 1000, 1, '2020-04-16 04:40:22', '2020-04-16 04:40:22'),
(3, 'Litre', 1, 0, 0, 0, 1, '2020-04-16 04:40:22', '2020-04-16 04:40:22'),
(4, 'Millilitre', 100, 0, 3, 1000, 1, '2020-04-16 04:40:22', '2020-04-16 04:40:22'),
(5, 'Piece', 1, 0, 0, 0, 1, '2020-04-16 04:40:22', '2020-04-16 04:40:22'),
(6, 'Box', 1, 1, 0, 0, 1, '2020-04-16 04:40:22', '2020-04-16 04:40:22'),
(7, 'Packet', 1, 1, 0, 0, 1, '2020-04-16 04:40:22', '2020-04-16 04:40:22');

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
(2, 'SHAHRUKH', 'shahrukh', 0x41579e3d233189c2e2c3af45c10c96c5, 'HFKASHFOIUERA9ADDS8NJKDHSFOY84HSKJHFA8Y3', 'DASFJKLSD', 2, 1, 1, 1, 0, '2020-03-26 09:29:55', '2020-03-26 09:29:55'),
(3, 'Ashutosh Vyas', 'avyas', 0x41579e3d233189c2e2c3af45c10c96c5, 'HFKASHFOIUERA934578NJKDHSFOY84HSKJHFA8Y3', 'FJASFKJHA', 2, 1, 1, 0, 0, '2020-03-26 09:29:55', '2020-03-26 09:29:55'),
(4, 'Varsha Bhati', 'varsha', 0x41579e3d233189c2e2c3af45c10c96c5, 'HFKASHFOIUERA9ADDS8NJKDHSFOY84HSKJHFA8Y3', 'DASFJKLSD', 2, 1, 1, 1, 0, '2020-03-26 09:29:55', '2020-03-26 09:29:55'),
(5, 'Aditi', 'aditi', 0x41579e3d233189c2e2c3af45c10c96c5, 'HFKASHFOIUERA9ADDS8NJKDHSFOY84HSKJHFA8Y3', 'DASFJKLSD', 2, 1, 1, 1, 0, '2020-03-26 09:29:55', '2020-03-26 09:29:55');

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
-- Indexes for table `products_measurement`
--
ALTER TABLE `products_measurement`
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
-- Indexes for table `unit_records`
--
ALTER TABLE `unit_records`
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- AUTO_INCREMENT for table `ordered_product`
--
ALTER TABLE `ordered_product`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `order_billing`
--
ALTER TABLE `order_billing`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `products_measurement`
--
ALTER TABLE `products_measurement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `profile`
--
ALTER TABLE `profile`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shipping_details`
--
ALTER TABLE `shipping_details`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `unit_records`
--
ALTER TABLE `unit_records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
