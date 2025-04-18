# OBRDocker

### A docker pipeline for OBR.

NOTE: Docker daemon is required as a pre-requisite.

## Testing Setup

1. Clone the test directory present on the master branch:
`git clone https://github.com/wvadhy/OBRDocker/tree/master/test`

2. Move into the cloned repository and run the [obrdocker] bash script:
`sh obrdocker.sh`

Open [http://localhost:3000](http://localhost:3000) to view the webpage in your broswer.

The bash file automates the creation of the docker-network and docker-containers by
virtue of running docker-compose on the [setup] yaml file.

![alt text](https://cdn.discordapp.com/attachments/1360249222909399121/1360249236746404022/image.png?ex=6801ae92&is=68005d12&hm=2efae7a22ab012693ca62f3200518c6f9afe97db740bf2658e66a077f04c2b1e&)

Furthermore the creation of a barebones MySQL database based upon the schema shown above
will be created via the [dump] sql file.

## Development Setup

1. Clone the test directory present on the master branch:
`git clone https://github.com/wvadhy/OBRDocker/tree/master/development`

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

![altext](https://cdn.discordapp.com/attachments/1032728529588203560/1362423039727374486/Git_1.png?ex=680256d5&is=68010555&hm=4f9267de36d4ca3acfd30d98215f180e35d98205e225e8c3ca4bd4564c4920ea&)

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



