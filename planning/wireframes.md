# Wireframes & UI Evolution

This document preserves the original ArcForge wireframes created during the planning phase of the CodePath WEB103 capstone and documents how the interface evolved during implementation.

The original wireframes represent **early design concepts**, not the exact layout or feature set of the final application.

As development progressed, ArcForge's navigation, project workspace, reusable UI components, responsive layouts, and story-management workflows evolved beyond these initial designs.

---

# Original Design Goals

The early wireframes focused on three core experiences:

1. Introduce users to ArcForge.
2. Give users a dashboard for managing story projects.
3. Provide a detailed workspace for an individual story.

The original planning also considered:

- Authentication
- User profiles
- Story creation
- Story editing

Authentication and user profiles were ultimately moved outside the scope of the submitted WEB103 version.

---

# Original Planned Pages

The original page plan included:

| Page                   | Original Status | Final Status   |
| ---------------------- | --------------- | -------------- |
| Landing Page           | Planned         | ✅ Implemented |
| Login / Sign Up        | Planned         | 🚀 Future      |
| User Dashboard         | Planned         | ✅ Implemented |
| User Profile           | Planned         | 🚀 Future      |
| Story / Project Detail | Planned         | ✅ Implemented |
| Create Story / Project | Planned         | ✅ Implemented |
| Edit Story / Project   | Planned         | ✅ Implemented |

During development, ArcForge expanded significantly beyond this original page list.

---

# Original Wireframes

## 1. Landing Page

The original landing-page wireframe established the first concept for introducing ArcForge and directing users into the application.

![Original ArcForge Landing Page Wireframe](./wireframes/landing-page.png)

### Final Implementation

The completed landing page expanded the original concept into a full product-style introduction containing:

- Hero section
- Project workspace preview
- Feature overview
- Story-planning workflow
- CodePath capstone information
- About/team navigation
- Calls to action
- Responsive navigation and layout

The final landing page is available at:

```text
/
```

---

## 2. User Dashboard

The original dashboard wireframe explored how users could view and manage multiple story projects.

![Original ArcForge User Dashboard Wireframe](./wireframes/user-dashboard.png)

An additional variation explored a modal-based interaction:

![Original ArcForge User Dashboard Wireframe with Pop Up](./wireframes/user-dashboard-with-popup.png)

### Final Implementation

The completed dashboard provides a project collection interface where users can:

- View existing story projects
- Open individual projects
- Create projects
- Edit projects
- Delete projects
- Review project status and information
- Navigate between the dashboard and the rest of the application

The final dashboard is available at:

```text
/dashboard
```

---

## 3. Story Detail View

The original story detail wireframe established the idea of giving each story its own workspace.

![Original ArcForge Story Detailed View Wireframe](./wireframes/story-detailed-view.png)

### Final Implementation

During development, the original "Story" concept became the ArcForge **Story Project** model.

The final project workspace includes:

- Project title
- Description
- Genre
- Status
- Creation date
- Last updated date
- Project progress overview
- Scene summary
- Character summary
- Location summary
- Links into individual story resources
- Project editing
- Project deletion

The final project detail route is:

```text
/projects/:projectId
```

---

# Final Application Pages

The completed application grew substantially beyond the three original wireframes.

## Public / General Pages

### Landing

```text
/
```

Introduces ArcForge, its workflow, major features, and the project team.

---

### About

```text
/about
```

Provides information about the CodePath WEB103 capstone, technology stack, and team contributions.

---

### Dashboard

```text
/dashboard
```

Displays and manages story projects.

---

# Project Pages

## Create Project

```text
/projects/new
```

Allows users to create a new story project.

---

## Project Detail

```text
/projects/:projectId
```

Acts as the central workspace for a selected project.

---

## Edit Project

```text
/projects/:projectId/edit
```

Allows users to update project information.

---

# Scene Pages

## Scene Library

```text
/projects/:projectId/scenes
```

Displays scenes belonging to the selected project.

The library supports:

- Search
- Status filtering
- Sorting
- Navigation to scene details
- Scene creation

---

## Create Scene

```text
/projects/:projectId/scenes/new
```

Allows users to add a scene to the selected project.

---

## Scene Detail

```text
/projects/:projectId/scenes/:sceneId
```

Displays information about an individual scene.

---

## Edit Scene

```text
/projects/:projectId/scenes/:sceneId/edit
```

Allows users to update scene information.

---

# Character Pages

## Character Roster

```text
/projects/:projectId/characters
```

Displays characters belonging to the selected project.

---

## Create Character

```text
/projects/:projectId/characters/new
```

Allows users to create a new character profile.

---

## Character Detail

```text
/projects/:projectId/characters/:characterId
```

Displays an individual character profile.

---

## Edit Character

```text
/projects/:projectId/characters/:characterId/edit
```

Allows users to update character information.

---

# Location Pages

## Location Library

```text
/projects/:projectId/locations
```

Displays locations belonging to the selected project.

---

## Create Location

```text
/projects/:projectId/locations/new
```

Allows users to create a project location.

---

## Location Detail

```text
/projects/:projectId/locations/:locationId
```

Displays information about an individual location.

---

## Edit Location

```text
/projects/:projectId/locations/:locationId/edit
```

Allows users to update location information.

---

# Application States

The final interface also introduced reusable states that were not represented in the original wireframes.

These include:

## Loading States

Displayed while application data is being retrieved.

## Empty States

Displayed when a collection does not yet contain any resources.

Examples include projects without:

- Scenes
- Characters
- Locations

## Error States

Displayed when data cannot be retrieved or an API request fails.

## Not Found States

Displayed when a requested project or story resource does not exist.

## Confirmation Modals

Used before destructive actions such as deleting projects or story resources.

## Notifications

Used to communicate successful and failed actions.

---

# Responsive Design

The original wireframes primarily established page structure.

The final application expanded those concepts into a responsive interface designed to remain usable across different viewport sizes.

Responsive work includes:

- Navigation
- Page layouts
- Collection cards
- Detail pages
- Forms
- Project overviews
- Action controls
- Footer
- Landing-page sections

---

# UI Evolution

Several design decisions changed between planning and implementation.

| Original Concept                | Final Implementation                                    |
| ------------------------------- | ------------------------------------------------------- |
| Story                           | Story Project                                           |
| Basic story detail              | Full project workspace                                  |
| Small initial page set          | Project-scoped scene, character, and location workflows |
| Login / Sign Up                 | Moved to future roadmap                                 |
| User Profile                    | Moved to future roadmap                                 |
| Primarily page-specific layouts | Shared reusable UI patterns                             |
| Basic dashboard concept         | Responsive project management dashboard                 |
| Static project information      | Project progress and resource overviews                 |
| Early navigation concept        | Responsive global navigation and project-scoped routes  |

These changes reflect the iterative nature of the project: the original wireframes provided direction, while implementation feedback and new requirements shaped the final interface.

---

# Current Navigation Structure

The final application can be summarized as:

```text
ArcForge
│
├── Landing
├── About
├── Dashboard
│
└── Story Project
    │
    ├── Project Overview
    │
    ├── Scenes
    │   ├── Scene Library
    │   ├── Create Scene
    │   ├── Scene Detail
    │   └── Edit Scene
    │
    ├── Characters
    │   ├── Character Roster
    │   ├── Create Character
    │   ├── Character Detail
    │   └── Edit Character
    │
    └── Locations
        ├── Location Library
        ├── Create Location
        ├── Location Detail
        └── Edit Location
```

---

# Future UI Direction

The current navigation works for the submitted ArcForge application, but future development could make the selected project feel even more like a persistent workspace.

## Project Workspace Navigation

A future project-level navigation system could provide persistent tabs such as:

```text
Overview | Scenes | Characters | Locations | Items
```

This would allow users to move between story resources without repeatedly returning to the project overview.

---

## Authentication

Future authentication would introduce interfaces for:

- Sign up
- Sign in
- Sign out
- Account management

Authentication would also allow projects to belong to specific users.

---

## Collaboration

If collaborative editing is implemented, future interfaces could support:

- Project members
- Invitations
- Permission management
- Owner / Collaborator / Viewer roles

---

## Image Management

Future image-upload functionality could add visual references to:

- Projects
- Characters
- Scenes
- Locations

This could support character art, maps, storyboards, location references, and other visual planning materials.

---

## Story Items

The database already includes foundations for story items.

A future UI could introduce:

```text
/projects/:projectId/items
/projects/:projectId/items/new
/projects/:projectId/items/:itemId
/projects/:projectId/items/:itemId/edit
```

This would extend the existing project-scoped organization pattern.

---

# Design Reflection

The original wireframes were useful for establishing ArcForge's initial direction, but the final application became more comprehensive as the team implemented and tested the product.

The biggest evolution was moving from a small set of general story pages to a **project-centered workspace** where scenes, characters, and locations are organized as related resources.

The final interface also introduced reusable components, responsive layouts, application states, confirmation flows, notifications, and more structured navigation that were not represented in the initial wireframes.

The original images remain in this repository as documentation of the project's design process and evolution.
