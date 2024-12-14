<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a id="readme-top"></a>

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/MiguelGC97/ProjectLockEdu/">
    <img src="images/logo.png" alt="Logo" width="100%" height="100%">
  </a>

  <h3 align="center">Proyecto LockEDU</h3>

  <p align="center">
    LockEDU is a full-stack locker management application developed as part of the second term of the Web Development course at IES El Rincón. This functional application is designed specifically for the institute's teachers, allowing them to reserve items stored in lockers for a specified period. The app keeps a useful log of all reservations and facilitates the management of item returns. This project is part of a series of collaborative efforts undertaken by a team of three students, where we applied the knowledge and skills acquired throughout the course to create a fully-featured and practical application.
    <br />
    <!-- <a href="https://github.com/othneildrew/Best-README-Template"><strong>Explore the docs »</strong></a> -->
    <br />
    <br />
    <a href="https://github.com/MiguelGC97/ProjectLockEdu/">View Demo</a>
    ·
    <a href="https://github.com/MiguelGC97/ProjectLockEdu/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/MiguelGC97/ProjectLockEdu/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#authors">Authors</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![LockEDU Home Page][product-screenshot]](https://github.com/MiguelGC97/ProjectLockEdu)

LockEDU is a full-stack locker management system created as part of the Web Development course at IES El Rincón. This project addresses a significant gap in the institute’s item management process by providing an efficient and user-friendly solution for reserving and managing items stored in lockers.

The app is designed specifically for teachers at the institute. Using the application, a teacher can:

- Browse through lockers and their respective compartments (or boxes).
- Select one or more items from a locker to reserve for a specified period within a single day.
- Receive notifications for check-in and check-out time of borrowed items.
- Manage bookings seamlessly, ensuring transparency and accountability.

This system is particularly useful as the previous process lacked any formalized control, leading to inefficiencies and confusion about item usage.

In addition to item reservations, the app offers a robust reporting system:

- Teachers can report issues with lockers or items (e.g., damages, malfunctions, or missing objects).
- A designated report manager reviews these reports, communicates with the teacher if needed, and resolves the problems.

By tracking who has borrowed each item and for how long, this project serves as a comprehensive control system, ensuring proper usage and management of the institute's resources.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

This app was built with:

- [![React][React.js]][React-url]
- [![Node.js][Node.js]][Node-url]
- [![Sequelize][Sequelize.org]][Sequelize-url]
- [![MySQL][Mysql.com]][Mysql-url]
- [![Mantine][Mantine.dev]][Mysql-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

These are the instructions on setting up this project locally. To get a local copy up and running follow these simple example steps.

### Prerequisites

These are the technologies and tools you need to use this application.

- npm
- vscode
- node.js
- any web browser
- mysql workbench

### Installation

1. Clone the repo
   ```
   git clone https://github.com/MiguelGC97/ProjectLockEdu/
   ```
2. Install NPM packages for backend and frontend
   ```
   cd backend
   npm install
   cd ../frontend
   npm install
   ```
3. Create an `.env` file in both frontend and backend folders, then replace with your environment variables (except for the two last ones in the backend one)

   - backend `.env`

   ```
   JWT_SECRET=your_jwt_secret
   DB_HOST=your_db_host
   DB_USERNAME=your_db_username
   DB_PASSWORD=your_db_password
   DB_DATABASE=your_db_name
   DB_PORT=your_db_port


   DB_DIALECT=mysql
   NODE_ENV=development
   ```

   - frontend `.env`

   ```
   VITE_BASE_URL=your_base_url
   ```

4. Create a database schema in MySQL workbench with the exact name of your DB_DATABASE environment variable

5. Run the backend first

   ```
   cd backend
   node index.js
   ```

6. Then, run the frontend

   ```
   cd ../frontend
   npm run dev
   ```

7. You're all set!

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- AUTHORS -->

## Authors

- **Yamiley del Mar Henriquez** - _Initial work_ - [Dr3am-dev](https://github.com/Dr3am-dev) or [Yamivc](https://github.com/Yamivc)
- **Miguel Angel Gutierrez** - _Initial work_ - [MiguelGC97](https://github.com/MiguelGC97)
- **Sarah Soares** - _Initial work_ - [scsoares](https://github.com/scsoares)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- [README Template by othneildrew](https://github.com/othneildrew/Best-README-Template)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[product-screenshot]: images/home-page.png
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://react.dev/
[Node.js]: https://img.shields.io/badge/Node.js-303030?style=for-the-badge&logo=node.js&logoColor=3C873A
[Node-url]: https://nodejs.org/
[Express.js]: https://img.shields.io/badge/Express-DEDEDE?style=for-the-badge&logo=express&logoColor=212121
[Express-url]: https://expressjs.com/
[Sequelize.org]: https://img.shields.io/badge/Sequelize-2379bd?style=for-the-badge&logo=sequelize&logoColor=#2379bd
[Sequelize-url]: https://sequelize.org/
[Mysql.com]: https://img.shields.io/badge/MySQL-DADADA?style=for-the-badge&logo=mysql&logoColor=00758F
[Mysql-url]: https://mysql.com
[Mantine.dev]: https://img.shields.io/badge/Mantine-cbe7f7?style=for-the-badge&logo=mantine&logoColor=309BF0
[Mantine-url]: https://mantine.dev
