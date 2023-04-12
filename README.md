
# EMPLOYEE TRACKER

 

## Table of Content
- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Testing](#testing)
- [Questions](#questions)

## Description
All companies require a solid DataBase to keep track of employees. The Employee Tracker is a Command Line (CLI) application that is designed to allow managers to easily see the employees that are on staff, the department they belong to, the role they are preforming and how they are reporting to. This application is designed to allow future enhancement as the orginization grows. 

## Installation
To install this application clone the Github repo and create a copy on your local machine. Once you have cloned your copy open the application in VS Code, open a new terminal and in the CLI type NPM Install.

<img width="1279" alt="NPM_Install" src="https://user-images.githubusercontent.com/120262482/230789105-80f70d47-e736-43cf-8028-8da082ca35c3.png">

Before runnig the application you must install MySQL onto your local machine ensuring you are using the Server version.  Once install open a second terminal and start the MySQL CLI interface by typing mysql - root -p 

<img width="1279" alt="MySQL Init" src="https://user-images.githubusercontent.com/120262482/230789342-52fff7de-6087-43d9-884f-3a6406bb52e7.png">

At the mysql> prompt type mysql "SOURCE schema.sql;" This will initiate the employee_trackerBD and create the Department, Roles and Employees tables.

<img width="1279" alt="Schema" src="https://user-images.githubusercontent.com/120262482/230789404-76ab4227-c70a-4fb6-949d-89ad4f78a190.png">

Then at the mysql> prompt type "SOURCE seeds.sql;" This will seed all three tables with base data that can be changed later.

<img width="1277" alt="Seeds" src="https://user-images.githubusercontent.com/120262482/230789562-f1c37ab5-943a-4a01-90b9-d6e7610e8636.png">

## Usage
After the DataBase has been setup at the bash command line (make sure you change terminals at this time) type NPM Start. 

<img width="1279" alt="NPM_Start" src="https://user-images.githubusercontent.com/120262482/230790152-49e4acb7-e538-47fc-9635-4099497df87c.png">

A list of available options will appear. Use the Up and Down arrows to navigate to the option you wish to conduct and click 'Enter". The following is a video on how to navigate the application:

https://drive.google.com/file/d/1JeQVLAOH0m6Likuv4XzJE2-u7FQCTOL1/view

[Employee Tracker.webm](https://user-images.githubusercontent.com/120262482/231410111-249c1376-1631-4b40-9af9-30dafd0dc310.webm)

https://drive.google.com/file/d/1IXZi7Kh_zvi7GCiybrSWUcCwc8wekvB-/view

## License
This project does not have a license attached.

## Contributing
NA

## Testing
NA

## Questions

Any questions regarding this project can be directed to: 

EMail me at:
MSchuur31@gmail.com


My Github username:
MSchuur
