CREATE TABLE `users` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `full_name` varchar(255) COLLATE utf8_bin NOT NULL,
    `user_email` varchar(255) COLLATE utf8_bin NOT NULL,
    `user_password_hash` varchar(255) COLLATE utf8_bin NOT NULL,
    `last_activity` varchar(255) COLLATE utf8_bin NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin
AUTO_INCREMENT=1 ;
