CREATE TABLE IF NOT EXISTS story_projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    genre VARCHAR(100),
    status VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES story_projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    atmosphere VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS characters (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES story_projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    story_role VARCHAR(100),
    description TEXT,
    goal TEXT,
    knowledge_notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES story_projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    significance TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scenes (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES story_projects(id) ON DELETE CASCADE,
    location_id INTEGER REFERENCES locations(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    scene_order INTEGER,
    timeline_order INTEGER,
    status VARCHAR(50),
    mood VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scene_characters (
    scene_id INTEGER NOT NULL REFERENCES scenes(id) ON DELETE CASCADE,
    character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    role_in_scene VARCHAR(100),
    knowledge_gained TEXT,
    PRIMARY KEY (scene_id, character_id)
);

CREATE TABLE IF NOT EXISTS scene_items (
    scene_id INTEGER NOT NULL REFERENCES scenes(id) ON DELETE CASCADE,
    item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    purpose_in_scene TEXT,
    PRIMARY KEY (scene_id, item_id)
);

CREATE TABLE IF NOT EXISTS character_relationships (
    id SERIAL PRIMARY KEY,

    character_id INTEGER NOT NULL
        REFERENCES characters(id)
        ON DELETE CASCADE,

    related_character_id INTEGER NOT NULL
        REFERENCES characters(id)
        ON DELETE CASCADE,

    relationship_type VARCHAR(100) NOT NULL,

    description TEXT,

    CHECK (character_id <> related_character_id),

    UNIQUE (
        character_id,
        related_character_id,
        relationship_type
    )
);