# Entity Relationship Diagram

This database supports ArcForge's story-planning workspace. A story project contains its own scenes, characters, locations, and story items. Scenes can include multiple characters and items through join tables, and characters can be connected to other characters through basic relationships such as friends, family members, allies, or rivals.

## Create the List of Tables

- **story_projects** — stores the main information for each story project.
- **scenes** — stores scenes that belong to a story project and may take place at a location.
- **characters** — stores character profiles for a story project.
- **character_relationships** — connects one character to another and stores their relationship type and an optional description.
- **locations** — stores reusable story locations for a story project.
- **items** — stores important props or story items for a story project.
- **scene_characters** — join table connecting scenes and characters, including each character's role in a scene.
- **scene_items** — join table connecting scenes and items, including an item's purpose in a scene.

## Add the Entity Relationship Diagram

![ArcForge entity relationship diagram](./entity_relationship_diagram_v2.png)

### Editable Mermaid Version

```mermaid
erDiagram
    STORY_PROJECTS ||--o{ SCENES : contains
    STORY_PROJECTS ||--o{ CHARACTERS : includes
    STORY_PROJECTS ||--o{ LOCATIONS : includes
    STORY_PROJECTS ||--o{ ITEMS : includes
    LOCATIONS o|--o{ SCENES : hosts
    SCENES ||--o{ SCENE_CHARACTERS : has
    CHARACTERS ||--o{ SCENE_CHARACTERS : appears_in
    SCENES ||--o{ SCENE_ITEMS : uses
    ITEMS ||--o{ SCENE_ITEMS : appears_in
    CHARACTERS ||--o{ CHARACTER_RELATIONSHIPS : source_character
    CHARACTERS ||--o{ CHARACTER_RELATIONSHIPS : related_character

    STORY_PROJECTS {
        integer id PK
        varchar title
        text description
        varchar genre
        varchar status
        timestamp created_at
        timestamp updated_at
    }

    SCENES {
        integer id PK
        integer project_id FK
        integer location_id FK
        varchar title
        text summary
        integer scene_order
        integer timeline_order
        varchar status
        varchar mood
        text notes
        timestamp created_at
        timestamp updated_at
    }

    CHARACTERS {
        integer id PK
        integer project_id FK
        varchar name
        varchar story_role
        text description
        text goal
        text knowledge_notes
        timestamp created_at
        timestamp updated_at
    }

    CHARACTER_RELATIONSHIPS {
        integer id PK
        integer character_id FK
        integer related_character_id FK
        varchar relationship_type
        text description
    }

    LOCATIONS {
        integer id PK
        integer project_id FK
        varchar name
        text description
        varchar atmosphere
        timestamp created_at
        timestamp updated_at
    }

    ITEMS {
        integer id PK
        integer project_id FK
        varchar name
        text description
        text significance
        timestamp created_at
        timestamp updated_at
    }

    SCENE_CHARACTERS {
        integer scene_id PK, FK
        integer character_id PK, FK
        varchar role_in_scene
        text knowledge_gained
    }

    SCENE_ITEMS {
        integer scene_id PK, FK
        integer item_id PK, FK
        text purpose_in_scene
    }
```

## Relationship Summary

- One **story project** can have many scenes, characters, locations, and items.
- One **location** can be used by many scenes, while a scene can have zero or one location.
- **Scenes** and **characters** have a many-to-many relationship through `scene_characters`.
- **Scenes** and **items** have a many-to-many relationship through `scene_items`.
- **Characters** have a self-referencing many-to-many relationship through `character_relationships`.
- Each `character_relationships` record connects one character to another and identifies a basic relationship such as friend, sibling, parent, child, ally, rival, or enemy.
- The composite primary keys in `scene_characters` and `scene_items` prevent the same character or item from being assigned to the same scene more than once.
