# User Stories

This document summarizes the user stories that guided ArcForge during development and reflects the state of the application after the final CodePath WEB103 submission and demo.

User stories are grouped by implementation status so that completed functionality is clearly separated from partially implemented ideas and future development opportunities.

---

## Primary User

### Story Creator

A **Story Creator** is a writer, game designer, filmmaker, student, or other creator who uses ArcForge to plan and organize a story project.

The current version of ArcForge is primarily designed around this user.

---

## Future User Roles

The original project planning also considered additional collaborative roles.

### Collaborator

A collaborator could help review, create, or update story information within a shared project.

This role would require future authentication, project membership, and authorization functionality.

### Viewer / Reviewer

A viewer could access a project in a read-only capacity to review its structure and progress without modifying story data.

This could support instructors, teammates, clients, or other project reviewers.

> Authentication and role-based permissions are not part of the current ArcForge release and remain part of the future roadmap.

---

# Shipped User Stories ✅

The following user stories are supported by the completed application.

## Project Management

### Create a Story Project

- [x] **As a Story Creator, I want to create a new story project, so that I can organize all of my story ideas in one place.**

ArcForge allows users to create projects with a title, description, genre, and project status.

---

### View Project Progress

- [x] **As a Story Creator, I want to view a project overview showing scene, character, and location counts along with completed-scene progress, so that I can quickly understand the current state of my project.**

The project workspace displays:

- Scene count
- Character count
- Location count
- Completed scene percentage
- Completed scene count

---

## Scene Management

### Add Scenes

- [x] **As a Story Creator, I want to add scenes to a story project, so that I can plan the major events in my story.**

Scenes can contain:

- Name
- Description
- Scene order
- Timeline order
- Notes
- Location
- Characters
- Status

---

### Edit Scenes

- [x] **As a Story Creator, I want to update a scene's information, so that changes to my story plan remain accurate as the project develops.**

Users can update existing scene information and view the saved changes on the scene detail page.

---

### Delete Scenes

- [x] **As a Story Creator, I want to delete a scene I no longer need, so that my project only contains relevant scenes.**

Scene deletion includes a confirmation step before permanently removing the scene.

---

### Track Scene Status

- [x] **As a Story Creator, I want to assign a status to each scene, so that I can track my story planning progress.**

Current scene statuses include:

- Planning
- In Progress
- On Hold
- Completed

The project overview uses completed scenes to calculate overall scene progress.

---

### Organize Scenes by Timeline

- [x] **As a Story Creator, I want to view scenes in timeline order, so that I can check whether story events make sense chronologically.**

ArcForge stores both:

- **Scene order** — where the scene appears in the presented story
- **Timeline order** — where the scene occurs chronologically

Users can sort the scene library using either value.

---

### Assign Characters to Scenes

- [x] **As a Story Creator, I want to assign characters to scenes, so that I can see which characters appear in each part of the story.**

The scene form loads characters belonging to the current project and allows multiple characters to be selected for a scene.

---

### Assign Locations to Scenes

- [x] **As a Story Creator, I want to connect a scene to a project location, so that I can keep track of where story events take place.**

Locations created within the project can be selected while creating or editing a scene.

---

## Character Management

### Create Character Profiles

- [x] **As a Story Creator, I want to create character profiles, so that I can keep track of each character's role, background, goals, and purpose.**

Character profiles can contain:

- Name
- Story role
- Description
- Goal
- Knowledge notes

Users can create, view, update, and delete project characters.

---

## Location Management

### Create Locations

- [x] **As a Story Creator, I want to create locations, so that I can organize the places used throughout my story.**

Location records can contain:

- Name
- Description
- Atmosphere

Users can create, view, update, and delete locations within a project.

---

## Scene Discovery

### Search and Filter Scenes

- [x] **As a Story Creator, I want to search and filter my scenes, so that I can quickly find the story information I need.**

The current scene library supports:

- Searching scene names
- Searching scene descriptions
- Searching locations
- Searching character names
- Filtering by scene status

Users can also sort scenes by:

- Scene order
- Timeline order
- Newest
- Name

---

# Partially Implemented User Stories 🟡

These ideas have some technical foundation in ArcForge but are not yet complete end-to-end features.

## Character Roles Within Scenes

- [ ] **As a Story Creator, I want to describe each character's role in a scene, so that I can understand their purpose during that part of the story.**

The database includes a `scene_characters` relationship with fields for:

- `role_in_scene`
- `knowledge_gained`

However, the current scene creation and editing interface only supports selecting which characters appear in a scene.

A future implementation could allow creators to add scene-specific information for each assigned character.

---

## Advanced Scene Filtering

- [ ] **As a Story Creator, I want to filter scenes by multiple story attributes, so that I can quickly narrow down a large project.**

The current application supports text search across scenes, locations, and characters as well as filtering by status.

Potential future filters include:

- Character
- Location
- Mood or tone
- Timeline range
- Scene order range

Dedicated filters would provide more control than the current general-purpose search.

---

# Future User Stories 🚀

The following stories describe possible next steps beyond the submitted WEB103 version.

## Authentication

- [ ] **As a user, I want to create an account and sign in, so that my story projects belong to me and remain separated from other users' projects.**

Potential authentication options could include:

- Email and password
- GitHub OAuth
- Other OAuth providers

---

## Project Roles and Collaboration

- [ ] **As a Project Owner, I want to invite collaborators to my project, so that multiple people can work on the same story.**

- [ ] **As a Project Owner, I want to control collaborator permissions, so that I can decide who can edit or only view my project.**

Potential roles could include:

- Owner
- Collaborator
- Viewer

---

## Project Workspace Navigation

- [ ] **As a Story Creator, I want persistent navigation within a selected project, so that I can quickly move between its scenes, characters, locations, and other story resources.**

A future project workspace could provide tabs or navigation for:

- Overview
- Scenes
- Characters
- Locations
- Items

---

## Image Uploads

- [ ] **As a Story Creator, I want to upload reference images, so that I can visually organize my story world.**

Images could be attached to:

- Projects
- Characters
- Scenes
- Locations

This could support character references, concept art, location inspiration, maps, or storyboards.

---

## Story Items

- [ ] **As a Story Creator, I want to create important story items, so that I can track objects that influence the plot.**

Examples could include:

- Weapons
- Clues
- Artifacts
- Props
- Documents
- Key story objects

---

### Assign Items to Scenes

- [ ] **As a Story Creator, I want to assign items to scenes, so that I can track where important objects appear or are used.**

The database already contains `items` and `scene_items` structures that can support this feature in future development.

---

## Character Relationships

- [ ] **As a Story Creator, I want to define relationships between characters, so that I can keep track of how members of my cast are connected.**

Possible relationship types include:

- Family
- Friend
- Ally
- Rival
- Mentor
- Enemy
- Romantic relationship
- Custom relationship

The database contains a `character_relationships` structure that provides a foundation for this feature.

---

## Character Knowledge Tracking

- [ ] **As a Story Creator, I want to record what a character learns during each scene, so that I can avoid continuity errors in my story.**

This could use the existing `knowledge_gained` field associated with scene-character relationships.

---

## Story Templates

- [ ] **As a Story Creator, I want to start from a project template, so that I can quickly create a workspace appropriate for my type of story.**

Potential templates could include:

- Novel
- Screenplay
- Short film
- Visual novel
- Story-driven game

---

## Expanded Progress Tracking

- [ ] **As a Story Creator, I want more detailed project progress information, so that I can see which parts of my story still need work.**

Future metrics could include:

- Scenes missing characters
- Scenes missing locations
- Scenes without descriptions
- Characters missing goals
- Locations missing descriptions
- Overall project completion

---

# Original Project Goals

ArcForge was designed around the idea of bringing commonly separated story-planning information into a single project workspace.

The completed WEB103 version established the core workflow:

1. Create a story project.
2. Create characters and locations for the project.
3. Create and organize scenes.
4. Connect characters and locations to scenes.
5. Track scene order, timeline order, and status.
6. Review project progress from a central project workspace.

Future development can build on this foundation with authentication, collaboration, richer story relationships, media uploads, and additional planning tools.
