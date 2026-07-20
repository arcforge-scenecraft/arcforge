import "../config/dotenv.js";
import { pool } from "../config/database.js";

try {
  // 1. Create test project
  const projectResult = await pool.query(
    "INSERT INTO story_projects (title) VALUES ($1) RETURNING id",
    ["Test Project"],
  );

  const projectId = projectResult.rows[0].id;

  // 2. Create test scene
  const sceneResult = await pool.query(
    "INSERT INTO scenes (project_id, title) VALUES ($1, $2) RETURNING id",
    [projectId, "Test Scene"],
  );

  const sceneId = sceneResult.rows[0].id;

  // 3. Create test character
  const characterResult = await pool.query(
    "INSERT INTO characters (project_id, name) VALUES ($1, $2) RETURNING id",
    [projectId, "Test Character"],
  );

  const characterId = characterResult.rows[0].id;

  // 4. Create test item
  const itemResult = await pool.query(
    "INSERT INTO items (project_id, name) VALUES ($1, $2) RETURNING id",
    [projectId, "Test Item"],
  );

  const itemId = itemResult.rows[0].id;

  // =====================================================
  // Test 1: Scene Item duplicate prevention
  // =====================================================

  await pool.query(
    "INSERT INTO scene_items (scene_id, item_id) VALUES ($1, $2)",
    [sceneId, itemId],
  );

  console.log("✅ First scene-item assignment succeeded.");

  try {
    await pool.query(
      "INSERT INTO scene_items (scene_id, item_id) VALUES ($1, $2)",
      [sceneId, itemId],
    );

    console.log("❌ Duplicate scene-item was incorrectly allowed.");
  } catch (error) {
    console.log("✅ Duplicate scene-item assignment was blocked.");
    console.log("PostgreSQL error code:", error.code);
  }

  // =====================================================
  // Test 2: Scene Character duplicate prevention
  // =====================================================

  await pool.query(
    "INSERT INTO scene_characters (scene_id, character_id) VALUES ($1, $2)",
    [sceneId, characterId],
  );

  console.log("✅ First scene-character assignment succeeded.");

  try {
    await pool.query(
      "INSERT INTO scene_characters (scene_id, character_id) VALUES ($1, $2)",
      [sceneId, characterId],
    );

    console.log("❌ Duplicate scene-character was incorrectly allowed.");
  } catch (error) {
    console.log("✅ Duplicate scene-character assignment was blocked.");
    console.log("PostgreSQL error code:", error.code);
  }

  // =====================================================
  // Test 3: Prevent character self-relationship
  // =====================================================

  try {
    await pool.query(
      `INSERT INTO character_relationships
        (character_id, related_character_id, relationship_type)
       VALUES ($1, $2, $3)`,
      [characterId, characterId, "friend"],
    );

    console.log("❌ Self-relationship was incorrectly allowed.");
  } catch (error) {
    console.log("✅ Character self-relationship was blocked.");
    console.log("PostgreSQL error code:", error.code);
  }

  // =====================================================
  // Test 4: Create second character
  // =====================================================

  const relatedCharacterResult = await pool.query(
    "INSERT INTO characters (project_id, name) VALUES ($1, $2) RETURNING id",
    [projectId, "Related Character"],
  );

  const relatedCharacterId = relatedCharacterResult.rows[0].id;

  // =====================================================
  // Test 5: Character relationship
  // =====================================================

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
      characterId,
      relatedCharacterId,
      "friend",
      "They became friends during the story.",
    ],
  );

  console.log("✅ First character relationship succeeded.");

  // =====================================================
  // Test 6: Duplicate character relationship prevention
  // =====================================================

  try {
    await pool.query(
      `INSERT INTO character_relationships
        (
          character_id,
          related_character_id,
          relationship_type,
          description
        )
       VALUES ($1, $2, $3, $4)`,
      [characterId, relatedCharacterId, "friend", "Duplicate relationship."],
    );

    console.log("❌ Duplicate character relationship was incorrectly allowed.");
  } catch (error) {
    console.log("✅ Duplicate character relationship was blocked.");
    console.log("PostgreSQL error code:", error.code);
  }
  // =====================================================
  // Test 7: Verify one-to-many relationship
  // Project -> Characters
  // =====================================================

  const projectCharactersResult = await pool.query(
    `SELECT c.id, c.name
   FROM characters c
   WHERE c.project_id = $1
   ORDER BY c.id`,
    [projectId],
  );

  console.log(
    "✅ One-to-many Project -> Characters:",
    projectCharactersResult.rows,
  );

  // =====================================================
  // Test 8: Verify many-to-many relationship
  // Scene -> Characters
  // =====================================================

  const sceneCharactersResult = await pool.query(
    `SELECT c.id, c.name
   FROM characters c
   JOIN scene_characters sc
     ON c.id = sc.character_id
   WHERE sc.scene_id = $1`,
    [sceneId],
  );

  console.log(
    "✅ Many-to-many Scene -> Characters:",
    sceneCharactersResult.rows,
  );

  // =====================================================
  // Test 9: Verify many-to-many relationship
  // Scene -> Items
  // =====================================================

  const sceneItemsResult = await pool.query(
    `SELECT i.id, i.name
   FROM items i
   JOIN scene_items si
     ON i.id = si.item_id
   WHERE si.scene_id = $1`,
    [sceneId],
  );

  console.log("✅ Many-to-many Scene -> Items:", sceneItemsResult.rows);

  // =====================================================
  // Test 10: Verify self-referencing relationship
  // Character -> Related Character
  // =====================================================

  const relationshipResult = await pool.query(
    `SELECT
      source.name AS source_character,
      cr.relationship_type,
      related.name AS related_character,
      cr.description
   FROM character_relationships cr
   JOIN characters source
     ON cr.character_id = source.id
   JOIN characters related
     ON cr.related_character_id = related.id
   WHERE cr.character_id = $1`,
    [characterId],
  );

  console.log(
    "✅ Self-referencing Character Relationship:",
    relationshipResult.rows,
  );
  // =====================================================
  // Cleanup
  // =====================================================

  await pool.query("DELETE FROM story_projects WHERE id = $1", [projectId]);

  console.log("✅ Test data cleaned up successfully.");
} catch (error) {
  console.error("❌ Schema test failed:");
  console.error(error);
} finally {
  await pool.end();
}
