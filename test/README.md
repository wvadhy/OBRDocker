#OBRDocker Suite

###A basic docker setup which enables external connection and testing of a MySQL server.

NOTE: Docker daemon is required as a pre-requisite.

##Automatic Installation

1. Move into the cloned repository and run:
`$ obrdocker.sh`

##Manual Installation

1. Clone the git repository to your local machine.

2. Move into the cloned repository and run the following:
`docker build -t obrpy .`

2. Now create the corresponding containers under a default network:
`docker-compose -f obrsql.yaml up`

3. Detach from the current window or open a new instance of terminal.

4. Run the following in the same OBRDocker directory:
`docker run -it --network obrdocker_default --rm mysql mysql -hobrsql -uuser -ppassword`

5. Switch to the obr database:
`USE obr`

6. Create core user-data table:
`source setup.sql`

NOTE: If a path cannot be inferred try using the absolute path to setup.sql, otherwise run the following manually within the mysql context:

```
CREATE TABLE `users` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `full_name` varchar(255) COLLATE utf8_bin NOT NULL,
    `user_email` varchar(255) COLLATE utf8_bin NOT NULL,
    `user_password_hash` varchar(255) COLLATE utf8_bin NOT NULL,
    `last_activity` varchar(255) COLLATE utf8_bin NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin
AUTO_INCREMENT=1 ;
```

Data will be persisted across multiple runs by virtue of Docker volumes, in order to remove this persistance simply remove the volumes parameter present within the obrsql.yaml file.

