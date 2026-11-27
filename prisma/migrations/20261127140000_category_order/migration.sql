ALTER TABLE "Category" ADD COLUMN "position" INTEGER NOT NULL DEFAULT 0;
UPDATE "Category" AS current
SET "position" = ordered.position
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY CASE name
    WHEN 'Glass Jar' THEN 1
    WHEN 'Essential Oil Bottle' THEN 2
    WHEN 'Airless Bottle & Jar' THEN 3
    WHEN 'Foam Bottle' THEN 4
    WHEN 'Deodorant Bottle' THEN 5
    WHEN 'Plastic jar' THEN 6
    WHEN 'Bamboo Bottle & Jar' THEN 7
    WHEN 'Plastic Bottle' THEN 8
    WHEN 'Perfume bottles' THEN 9
    WHEN 'Aluminum Jar' THEN 10
    WHEN 'Plastic Tube' THEN 11
    ELSE 100
  END, name) - 1 AS position
  FROM "Category"
) AS ordered
WHERE current.id = ordered.id;
