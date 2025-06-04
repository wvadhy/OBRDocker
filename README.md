# OBRDocker

### A docker pipeline for OBR.

NOTE: Docker daemon is required as a pre-requisite.

## Testing Setup

1. Clone the directories present on the master branch:
`git clone https://github.com/wvadhy/OBRDocker.git`

2. Move into the cloned repository and run the [obrdocker] bash script:
`sh obrdocker.sh`

Open [http://localhost:3000](http://localhost:3000) to view the webpage in your broswer.

The bash file automates the creation of the docker-network and docker-containers by
virtue of running docker-compose on the [setup] yaml file.

![lol2255](https://github.com/user-attachments/assets/85bdd905-d42b-4b2b-8c9d-e18b8b4a52f1)

Furthermore the creation of a barebones MySQL database based upon the schema shown above
will be created via the [dump] sql file.

## Development Setup

1. Clone the directories present on the master branch:
`git clone https://github.com/wvadhy/OBRDocker.git`

2. Move into the cloned repository and enter the [pythonDocker] directory to run the following:
`docker build -t obrpy .`

3. Enter the [nodeDocker] directory to run the following:
`docker build -t obrnpm .`

4. Now create the corresponding containers under a default network:
`docker-compose -f setup.yaml up`

5. Detach from the current window or open a new instance of terminal.

6. Run the following in the same cloned repository:
`docker run -it --network obrdocker_default --rm mysql mysql -hobrsql -uuser -ppassword`

7. Switch to the [obr] database:
`USE obr`

8. Create core user-data table:
`source dump.sql`

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

Data will be persisted across multiple runs by virtue of Docker volumes, in order to remove this
persistance simply remove the [volumes] parameter present within the [setup] yaml file.

## Pipeline

![lol2233](https://github.com/user-attachments/assets/2aa25407-b604-41fd-9e94-afe1629367a7)

Files cloned from the [development] repository can be edited and changed on a local development
server / device.

These files are then pushed to the [OBRDocker](https://github.com/wvadhy/OBRDocker/tree/master) repository
for rattification.

Once validated and merged Jenkins will automatically hook onto the changed files, run the [Jenkinsfile]
present in the root directory in order to start the CI pipeline.

This will include the construction of docker images for the newly updated files and automated testing.

If completed successfully Jenkins will then deploy the docker images to a private [AWS EC2] repository.

Each image will have its own individual repository, this enables greater version control via version based
image retreival. This allows testers to specify specific versions of the images they would like to test by
simply changing the [image:tag] present in the [setup] yaml file.

Once fully delployed users can simply clone the [test] directory and run the [obrdocker] bash file in order
to setup the docker-network, containers and entrypoints. By default the [lts] of docker images is chosen. 



