# task-manager-web
Task Manager Dashboad:

User can create personal tasks in the dashboard
after creating an account and logging in.
The tasks created by an user is only visible
to the user and not to anyone else.

user can create/modify/search and delete tasks.
For ex. say a task "To pickup groceries from Costco
at 7:45 AM on Monday Dec 5th". User can track all his
personal tasks with setting priority and status for each
tasks. User can also see the details of activities performed.

Task Manager Web is a modern, full-stack front-end application built to 
interact with the Task Manager Service, a Spring Boot microservice running 
behind an AWS ALB + ECS Fargate environment. The web application provides 
a responsive UI for task creation, updates, filtering, activity logs, authentication, 
and general dashboard interaction.

Technologies Used:
Frontend Framework (React + TypeScript)
The UI is developed using React with TypeScript, leveraging functional components, 
hooks (useState, useEffect, useNavigate) and React Router for navigation. 
The application follows a page-based layout (WelcomePage, LoginPage, SignupPage, 
TaskDashboard, UserActivityPage) for scalable routing.

Build System (Vite):
Development builds use Vite, providing fast HMR and TypeScript transforms.
Production assets are compiled into dist/client and later served by a Node.js server.

Backend Proxy Layer (Node.js + Express):

A lightweight Node.js Express server acts as: 
Static file server for the built React UI, Reverse proxy for backend API calls.

All frontend API requests are sent to:
http://localhost:3001/api/*
The Express server forwards these to the Spring Boot backend (running on AWS at port 8080).

This architecture provides: CORS-free communication, A unified production server for deployment,
Clean separation of client UI and backend service.

Authentication:

The client stores the JWT returned by the backend in localStorage.
Axios interceptors inject the token into all outgoing requests:

Authorization: Bearer <token>
The UI conditionally displays navigation elements based on auth status
(e.g., logout link, user activity link).
