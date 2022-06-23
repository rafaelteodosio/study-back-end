import {
  AbstractMigration,
  ClientPostgreSQL,
  Info,
} from "https://deno.land/x/nessie@2.0.5/mod.ts";

export default class extends AbstractMigration<ClientPostgreSQL> {
  /** Runs on migrate */
  async up(_info: Info): Promise<void> {
    const create_module = `
        CREATE TABLE module (
            id serial PRIMARY KEY,
            name varchar(255),
            description text,
            reward integer
        )`;

    const create_quest = `
        CREATE TABLE quest (
            id serial PRIMARY KEY,
            quest_number integer,
            name varchar(255),
            summary text,
            module_id integer REFERENCES module
        )`;

    const create_question = `
        CREATE TABLE question (
            id serial PRIMARY KEY,
            question_text varchar,
            alternatives json,
            answer varchar CHECK (answer IN ('a', 'b', 'c', 'd')),
            quest_id integer REFERENCES quest
        )`;

    await this.client.queryArray(create_module);
    await this.client.queryArray(create_quest);
    await this.client.queryArray(create_question);
  }

  /** Runs on rollback */
  async down(_info: Info): Promise<void> {
    await this.client.queryArray("DROP TABLE question");
    await this.client.queryArray("DROP TABLE quest");
    await this.client.queryArray("DROP TABLE module");
  }
}
