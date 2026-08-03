# Milestone 5

This document should be completed and submitted during **Unit 9** of this course. You **must** check off all completed tasks in this document in order to receive credit for your work.

## Checklist

This unit, be sure to complete all tasks listed below. To complete a task, place an `x` between the brackets.

- [x] Deploy your project on Render
  - [x] In `readme.md`, add the link to your deployed project
- [x] Update the status of issues in your project board as you complete them
- [x] In `readme.md`, check off the features you have completed in this unit by adding a ✅ emoji in front of their title
  - [x] Under each feature you have completed, **include a GIF** showing feature functionality
- [x] In this document, complete the **Reflection** section below
- [x] 🚩🚩🚩**Complete the Final Project Feature Checklist section below**, detailing each feature you completed in the project (ONLY include features you implemented, not features you planned)
- [x] 🚩🚩🚩**Record a GIF showing a complete run-through of your app** that displays all the components included in the **Final Project Feature Checklist** below
  - [x] Include this GIF in the **Final Demo GIF** section below

## Final Project Feature Checklist

Complete the checklist below detailing each baseline, custom, and stretch feature you completed in your project. This checklist will help graders look for each feature in the GIF you submit.

### Baseline Features

👉🏾👉🏾👉🏾 Check off each completed feature below.

- [x] The project includes an Express backend app and a React frontend app
- [x] The project includes these backend-specific features:
  - [x] At least one of each of the following database relationships in Postgres
    - [x] one-to-many
    - [x] many-to-many with a join table
  - [x] A well-designed RESTful API that:
    - [x] supports all four main request types for a single entity (ex. tasks in a to-do list app): GET, POST, PATCH, and DELETE
      - [x] the user can **view** items, such as tasks
      - [x] the user can **create** a new item, such as a task
      - [x] the user can **update** an existing item by changing some or all of its values, such as changing the title of task
      - [x] the user can **delete** an existing item, such as a task
    - [x] Routes follow proper naming conventions
  - [x] The web app includes the ability to reset the database to its default state
- [x] The project includes these frontend-specific features:
  - [x] At least one redirection, where users are able to navigate to a new page with a new URL within the app
  - [x] At least one interaction that the user can initiate and complete on the same page without navigating to a new page
  - [x] Dynamic frontend routes created with React Router
  - [x] Hierarchically designed React components
    - [x] Components broken down into categories, including Page and Component types
    - [x] Corresponding container components and presenter components as appropriate
- [x] The project includes dynamic routes for both frontend and backend apps
- [x] The project is deployed on Render with all pages and features that are visible to the user are working as intended

### Custom Features

👉🏾👉🏾👉🏾 Check off each completed feature below.

- [x] The project gracefully handles errors
- [x] The project includes a one-to-one database relationship
- [x] The project includes a slide-out pane or modal as appropriate for your use case that pops up and covers the page content without navigating away from the current page
- [x] The project includes a unique field within the join table
- [x] The project includes a custom non-RESTful route with corresponding controller actions
- [x] The user can filter or sort items based on particular criteria as appropriate for your use case
- [x] Data is automatically generated in response to a certain event or user action. Examples include generating a default inventory for a new user starting a game or creating a starter set of tasks for a user creating a new task app account
- [x] Data submitted via a POST or PATCH request is validated before the database is updated (e.g. validating that an event is in the future before allowing a new event to be created)
  - [x] _To receive full credit, please be sure to demonstrate in your walkthrough that for certain inputs, the item will NOT be successfully created or updated._

### Stretch Features

👉🏾👉🏾👉🏾 Check off each completed feature below.

- [ ] A subset of pages require the user to log in before accessing the content
  - [ ] Users can log in and log out via GitHub OAuth with Passport.js
- [ ] Restrict available user options dynamically, such as restricting available purchases based on a user's currency
- [x] Show a spinner while a page or page element is loading
- [x] Disable buttons and inputs during the form submission process
- [ ] Disable buttons after they have been clicked
  - _At least 75% of buttons in your app must exhibit this behavior to receive full credit_
- [ ] Users can upload images to the app and have them be stored on a cloud service
  - _A user profile picture does **NOT** count for this rubric item **only if** the app also includes "Login via GitHub" functionality._
  - _Adding a photo via a URL does **NOT** count for this rubric item (for example, if the user provides a URL with an image to attach it to the post)._
  - _Selecting a photo from a list of provided photos does **NOT** count for this rubric item._
- [x] 🍞 [Toast messages](https://www.patternfly.org/v3/pattern-library/communication/toast-notifications/index.html) deliver simple feedback in response to user events

## Final Demo GIF

![Story Project Dashboard](./gifs/Story_Project_Dashboard.gif)

## Reflection

### 1. What went well during this unit?

During this unit, our group successfully brought the main parts of ArcForge together into a complete full-stack application. We connected the React frontend, Express backend, and PostgreSQL database and deployed the application using Render and Neon. We completed features for projects, scenes, characters, locations, filtering, sorting, progress tracking, validation, confirmation modals, notifications, and loading states. We also added GIFs to the README to demonstrate the completed functionality.

### 2. What were some challenges your group faced in this unit?

One of the main challenges was uneven participation and communication within the group. Some members completed only a small amount of work, while others submitted features that did not fully follow the requirements or still contained unresolved bugs. Some members also did not regularly read or respond to group messages, which made it difficult to coordinate changes and confirm whether features had been properly tested.

Another challenge was managing the main branch. In several cases, incomplete or incorrect changes were merged before they were fully reviewed, which introduced new bugs and created additional work for other team members. Because the project is now close to completion, we decided to temporarily stop merging new changes into main until the final testing and review are complete. This helps prevent last-minute bugs, conflicts, or broken features from affecting the final submission.

### 3. What were some of the highlights or achievements that you are most proud of in this project?

One of our main achievements was building and deploying a complete full-stack story-planning application. ArcForge allows users to create, view, update, and delete story projects, scenes, characters, and locations.

We are also proud that the application demonstrates important full-stack concepts, including RESTful API routes, dynamic frontend and backend routes, one-to-many and many-to-many PostgreSQL relationships, reusable React components, validation, filtering, sorting, confirmation modals, loading states, and user feedback notifications.

Another important achievement was improving the organization of the codebase. We separated reusable components, hooks, API services, backend routes, and controllers, which made the project easier to understand, test, and maintain.

### 4. Reflecting on your web development journey so far, how have you grown since the beginning of the course?

Since the beginning of the course, our group has developed a stronger understanding of how to plan and build a complete full-stack web application. We learned how React components, hooks, API services, Express routes, controllers, and PostgreSQL tables work together.

We also improved our ability to debug frontend and backend problems, test REST API routes, manage Git branches, create pull requests, resolve merge conflicts, and deploy an application. Working as a group also taught us the importance of communication, task ownership, testing, code review, and checking changes carefully before merging them into the main branch.

### 5. Looking ahead, what are your goals related to web development, and what steps do you plan to take to achieve them?

Looking ahead, our goal is to become more confident in building reliable, maintainable, and secure full-stack applications. We plan to continue improving our skills in React, Express, PostgreSQL, REST API design, testing, and deployment.

We also want to learn more about TypeScript, authentication, automated testing, accessibility, application security, and cloud storage. To achieve these goals, we plan to build more projects, practise better team communication, review code more carefully before merging, create smaller and more focused pull requests, and improve our testing and documentation practices.
