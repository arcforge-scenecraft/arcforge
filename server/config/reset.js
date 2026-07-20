import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./database.js";

const currentPath = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentPath);

const dropAllTables = async () => {
  const dropTablesQuery = `
    DROP TABLE IF EXISTS character_relationships;
    DROP TABLE IF EXISTS scene_items;
    DROP TABLE IF EXISTS scene_characters;
    DROP TABLE IF EXISTS scenes;
    DROP TABLE IF EXISTS items;
    DROP TABLE IF EXISTS characters;
    DROP TABLE IF EXISTS locations;
    DROP TABLE IF EXISTS story_projects;
  `;

  await pool.query(dropTablesQuery);
  console.log("All tables dropped successfully.");
};

const createTables = async () => {
  const schemaPath = path.join(currentDir, "../data/schema.sql");
  const schemaQuery = fs.readFileSync(schemaPath, "utf8");

  await pool.query(schemaQuery);
  console.log("All tables created successfully.");
};

const seedDatabase = async () => {
  const seedPath = path.join(currentDir, "../data/story_project.json");
  const project = JSON.parse(fs.readFileSync(seedPath, "utf8"));

  const projectResult = await pool.query(
    `INSERT INTO story_projects (title, description, genre, status)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [project.title, project.description, project.genre, project.status],
  );
  const projectId = projectResult.rows[0].id;

  const locationIds = {};
  for (const location of project.locations) {
    const result = await pool.query(
      `INSERT INTO locations (project_id, name, description, atmosphere)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [projectId, location.name, location.description, location.atmosphere],
    );
    locationIds[location.key] = result.rows[0].id;
  }

  const characterIds = {};
  for (const character of project.characters) {
    const result = await pool.query(
      `INSERT INTO characters
        (project_id, name, story_role, description, goal, knowledge_notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [
        projectId,
        character.name,
        character.story_role,
        character.description,
        character.goal,
        character.knowledge_notes,
      ],
    );
    characterIds[character.key] = result.rows[0].id;
  }

  const itemIds = {};
  for (const item of project.items) {
    const result = await pool.query(
      `INSERT INTO items (project_id, name, description, significance)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [projectId, item.name, item.description, item.significance],
    );
    itemIds[item.key] = result.rows[0].id;
  }

  const sceneIds = {};
  for (const scene of project.scenes) {
    const result = await pool.query(
      `INSERT INTO scenes
        (
          project_id,
          location_id,
          title,
          summary,
          scene_order,
          timeline_order,
          status,
          mood,
          notes
        )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      [
        projectId,
        locationIds[scene.location_key],
        scene.title,
        scene.summary,
        scene.scene_order,
        scene.timeline_order,
        scene.status,
        scene.mood,
        scene.notes,
      ],
    );
    sceneIds[scene.key] = result.rows[0].id;
  }

  for (const assignment of project.scene_characters) {
    await pool.query(
      `INSERT INTO scene_characters
        (scene_id, character_id, role_in_scene, knowledge_gained)
       VALUES ($1, $2, $3, $4)`,
      [
        sceneIds[assignment.scene_key],
        characterIds[assignment.character_key],
        assignment.role_in_scene,
        assignment.knowledge_gained,
      ],
    );
  }

  for (const assignment of project.scene_items) {
    await pool.query(
      `INSERT INTO scene_items (scene_id, item_id, purpose_in_scene)
       VALUES ($1, $2, $3)`,
      [
        sceneIds[assignment.scene_key],
        itemIds[assignment.item_key],
        assignment.purpose_in_scene,
      ],
    );
  }

  for (const relationship of project.character_relationships) {
    await pool.query(
      `INSERT INTO character_relationships
        (
          character_id,
          related_character_id,
          relationship_type,
          description
        )
       VALUES ($1, $2, $3, $4)`,
      [
        characterIds[relationship.character_key],
        characterIds[relationship.related_character_key],
        relationship.relationship_type,
        relationship.description,
      ],
    );
  }

  console.log(`Seeded project: ${project.title}`);
};

const resetDatabase = async () => {
  try {
    await dropAllTables();
    await createTables();
    await seedDatabase();
    console.log("Database reset complete.");
  } catch (error) {
    console.error("Error resetting database:");
    console.error(error);
  } finally {
    await pool.end();
  }
};

resetDatabase();
