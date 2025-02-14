### Skill Development Self-Assessment Platform

## Description

The Skill Development Self-Assessment Platform is a web-based application designed to help individuals evaluate their skills, identify gaps, and receive recommendations for improvement. Users can take assessments, receive detailed reports, and track their progress over time. The platform features an intuitive UI built with React and Tailwind CSS, a backend powered by Node.js and MySQL, and secure authentication.

## GitHub Repository

https://github.com/Obedine-Flore/Capstone-Project.git

## Setup Instructions

# Prerequisites

Ensure you have the following installed on your system:

* Node.js (Latest LTS version recommended)

* MySQL

* Git

# Clone the Repository

git clone [https://github.com/Obedine-Flore/Capstone-Project.git]
cd skill-assessment-platform

# Backend Setup

1. Navigate to the backend directory:

cd skills-assess-backend

2. Install dependencies:

npm install

3. Configure environment variables:

* Create a .env file in the backend directory and set up the following variables:

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=SkillsAssess

4. Initialize the database:

Run MySQL and create the database manually:

CREATE DATABASE skill_assessment_db;

5. Start the backend server:

npm start

# Frontend Setup

1. Navigate to the frontend directory:

cd skills-assessment-platform

2. Install dependencies:

npm install

3. Start the development server:

npm run dev

## Deployment Plan

# Backend Deployment

I would use the Heroku cloud platform to deploy the Node.js backend.

I would set up a MySQL database on Amazon RDS, DigitalOcean Managed Databases, or another cloud provider.

I would configure PM2 to keep the backend running.

I would use Nginx or as a reverse proxy to manage API requests.

# Frontend Deployment

I would deploy the React application using Netlify.

Ensuring the frontend communicates with the deployed backend via the correct API endpoints.

# Database Deployment

Use Amazon RDS, DigitalOcean Managed Databases, or a self-hosted MySQL instance.

Secure the database with proper authentication and access control.

Implement database backups and monitoring tools.

# Environment Variables

Store secrets securely using dotenv files (.env), AWS Secrets Manager, or environment variables on the cloud platform.

# Continuous Deployment (CI/CD)

Use GitHub Actions, Jenkins, or Travis CI to automate deployments.

Set up automatic deployments on push to main or a designated deployment branch.

## Video Demo

[Insert Link to Video Demo]