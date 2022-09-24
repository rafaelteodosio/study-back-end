import {
  AbstractSeed,
  ClientPostgreSQL,
  Info,
} from "https://deno.land/x/nessie@2.0.5/mod.ts";

export default class extends AbstractSeed<ClientPostgreSQL> {
  /** Runs on seed */
  async run(_info: Info): Promise<void> {
    await this.client.queryArray(
      `INSERT INTO module (id, name, description, reward)
       VALUES 
            (1, 'Renda Fixa', 'Diferentes formas de renda fixa', 20),
            (2, 'Renda Variável', 'Diferentes formas de renda variável', 25)`,
    );

    await this.client.queryArray(
      `INSERT INTO quest (id, quest_number, name, summary, module_id, reward)
       VALUES 
            (1, 1, 'Taxa SELIC', 'Básico sobre a Taxa SELIC', 1, 20),
            (2, 1, 'Ações', 'Básico sobre ações', 2, 25)`,
    );

    await this.client.queryArray(
      `INSERT INTO question (question_text, alternatives, answer, quest_id)
       VALUES 
            (
                'Quem define a taxa SELIC?', 
                '{
                    "a": "O Banco Central",
                    "b": "O Presidente",
                    "c": "O STF",
                    "d": "Deus" 
                }', 
                'a',
                1
            ),
            (
                'É possível perder dinheiro com renda variável?',
                '{
                    "a": "Não",
                    "b": "Sim",
                    "c": "Só com criptomoedas",
                    "d": "Nenhuma das anteriores"
                }', 
                'b', 
                2
            )`,
    );
  }
}
