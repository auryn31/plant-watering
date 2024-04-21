drop table if exists plant_values;
drop table if exists plant;
drop table if exists "user";
drop table if exists token;
drop table if exists tokens;
drop table if exists "plant_user";


CREATE TABLE "token" (
  "user_id" varchar UNIQUE NOT NULL,
  "token_id" varchar UNIQUE NOT NULL,
  "created_at" timestamp DEFAULT (now()),
  PRIMARY KEY ("user_id", "token_id")
);

CREATE TABLE "plant_user" (
  "user_id" varchar UNIQUE PRIMARY KEY NOT NULL,
  "name" varchar,
  "email" varchar,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "plant" (
  "id" varchar UNIQUE PRIMARY KEY NOT NULL,
  "token_id" varchar,
  "name" varchar,
  "ml_per_watering" int,
  "max_ml_per_day" int,
  "desired_humidity" float,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "plant_values" (
  "plant_id" varchar,
  "humidity" float,
  "last_watering_in_ml" int,
  "created_at" timestamp DEFAULT (now())
);

ALTER TABLE "plant" ADD FOREIGN KEY ("token_id") REFERENCES "token" ("token_id");

ALTER TABLE "token" ADD FOREIGN KEY ("user_id") REFERENCES "plant_user" ("user_id");

ALTER TABLE "plant_values" ADD FOREIGN KEY ("plant_id") REFERENCES "plant" ("id");
